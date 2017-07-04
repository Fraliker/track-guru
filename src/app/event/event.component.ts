import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AuthService } from '../providers/auth.service';
import { GmapsComponent } from './../gmaps/gmaps.component';
import { MapAddonsService} from './../services/map-addons.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {
  dbTracks: FirebaseListObservable<any[]>;
  eventTracks: Track[];
  dbUsers: FirebaseListObservable<any[]>;
  dbEvent: FirebaseObjectObservable<any>;
  dbUser: FirebaseObjectObservable<any>;
  trackingId: number;
  trackingStartTime: number;
  trackedPoints: Point[];
  actualTrack: Track;
  actualDistance = 0;
  trackKey: string;
  Math: any;
  navigator: any;
  userId: string;
  isTracking: boolean;
  eventDestinationPoint: Point;

  eventKey: string;
  eventUsers: any[];
  defaultZoom = 17;
  minTargetDistance = 20;
  minAccuracy = 25;

  private isLoggedIn: Boolean;
  private user_displayName: String;
  private user_email: String;

  constructor(
    public db: AngularFireDatabase,
    public authService: AuthService,
    private router: Router,
    public route: ActivatedRoute,
    public mapAddons: MapAddonsService
  ) {
    this.dbTracks = db.list('/tracks');
    this.dbUsers = db.list(`/users`);

    this.Math = Math;
    this.navigator = navigator;

    this.authService.afAuth.authState.subscribe(
      (auth) => {
        if (auth !== null) {
          this.dbUsers.subscribe((users) => {
            users.map((user) => {
              // if auth user
              if(user.uid === auth.uid) {
                this.isTracking = user.isTracking;

                // if caused by page reload we should reload data and disable tracking
                if(this.userId !== auth.uid) {
                  this.userId = auth.uid;
                  this.dbUser = db.object(`/users/${user.$key}`);
                  this.dbUser.update({
                    isTracking: false,
                  });
                }
              }
            })
          });
        }
      }
    );

    this.route.params.subscribe(params => {
      this.eventKey = params['id'];
      this.dbEvent = db.object(`/events/${this.eventKey}`);

      // reload eventTracks related to actual event by eventId
      this.dbTracks.subscribe((tracks) => {
        this.eventTracks = [];
        tracks.map((track) => {
          if(track.eventId === this.eventKey){
            this.eventTracks.push(track);
          }
        })
      });

      // on every update get actual destination point
      this.dbEvent.subscribe((event) => {
        this.eventDestinationPoint = {
          lat: event.mapDestinationLat,
          lng: event.mapDestinationLng
        }

        // ... and list of assigned users
        this.dbUsers.subscribe((users) => {
          this.eventUsers = users.filter(user =>
            event.users && Object.keys(event.users).indexOf(user.uid) > -1
          )
        });
      })
    });
   }

  ngOnInit() {

  }

  startTracking() {
    if (!navigator.geolocation) {
      return alert('Geolocation is not supported by your browser');
    }

    this.trackingStartTime = Date.now();
    this.trackedPoints = [];
    this.actualTrack = {
      created_at: this.trackingStartTime,
      trackColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // random hex color
      points: [],
      userId: this.userId,
      eventId: this.eventKey,
    };

    const onSuccess = (position) => {
      const actualLat = position.coords.latitude;
      const actualLng = position.coords.longitude;
      // conversion m/s to km/h + parse sample: 12.5
      const actualSpeed = parseFloat(((position.coords.speed || 0)  * 3.6).toFixed(1));
      const actualAlt = position.coords.altitude || 0;


      this.db
        .object(`/tracks/${this.trackingStartTime}`)
        .subscribe((track) =>  this.actualDistance = this.mapAddons.getDistance(track));

      this.dbUser.update({
        alt: actualAlt,
        isTracking: true,
        isFinished: false,
        mapCenterLat: actualLat,
        mapCenterLng: actualLng,
        mapZoom: this.defaultZoom,
        speed: actualSpeed,
        distance: this.actualDistance
      });

      const point: Point = {
        lat: actualLat,
        lng: actualLng,
      };

      // if we reached the target then
      if (this.isEventTargetReached(point, this.eventDestinationPoint, this.minTargetDistance)) {
        alert('Congratulations');
        this.dbUser.update({
          isFinished: true,
        });
        return this.stopTracking();
      }

      // TODO: to be verified - push only points with good accuracy
      // if (position.coords.accuracy > this.minAccuracy) return null;

      this.actualTrack.points.push(point);

      this.dbTracks.update(this.trackingStartTime.toString(), this.actualTrack);
    };

    const onError = () =>
      alert('Sorry, no position available. Click "Stop tracking" if You want to abort');

    const geoOptions = {
      enableHighAccuracy: true, // use GPS receiver, if possible
      maximumAge        : 30000,
      timeout           : 20000 // after fimeout exipires, onError will be invoked
    };

    this.trackingId = navigator.geolocation.watchPosition(onSuccess, onError, geoOptions);
  }

  stopTracking() {
    navigator.geolocation.clearWatch(this.trackingId);
    this.dbUser.update({
      alt: 0,
      isTracking: false,
      speed: 0,
    });

    // if tracking was started for this event
    if(this.trackingStartTime) {
      this.dbTracks.remove(this.trackingStartTime.toString());
    }
  }

  resetEvent() {
    if(confirm('Are you sure?')){
      this.stopTracking();
      this.dbTracks.remove();
    }
  }

  isEventTargetReached(point, eventDestinationPoint, minTargetDistance) {
    return this.mapAddons.point2PointDistance(point, eventDestinationPoint) < minTargetDistance;
  }

  updateTargetPosition(event) {
    const point = event && event.coords;
    point && this.dbEvent.update({
      mapDestinationLat: point.lat,
      mapDestinationLng: point.lng
    });
  }
}

interface Point {
  lat: number;
  lng: number;
}

interface Track {
  created_at: number;
  trackColor: string;
  points: Point[];
  userId: string;
  eventId: string;
}

interface User {
  alt: number;
  created_at: string;
  eventStarted: string;
  fullName: string;
  isTracking: boolean;
  isFinished: boolean;
  isVisitor: boolean;
  mapCenterLat: number;
  mapCenterLng: number;
  mapDestinationLat: number;
  mapDestinationLng: number;
  mapZoom: number;
}
