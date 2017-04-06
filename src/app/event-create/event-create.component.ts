import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { AuthService } from '../providers/auth.service';
import {
  SebmGoogleMap,
  SebmGoogleMapPolyline,
  SebmGoogleMapPolylinePoint
} from 'angular2-google-maps/core';

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.scss']
})
export class EventCreateComponent implements OnInit {
  dbEvents: FirebaseListObservable<any[]>;
  dbUsers: FirebaseListObservable<any[]>;
  createdAt: Date;
  newEvent: Event;
  uid: string;
  navigator: any;
  getPositionId: void;
  destinationPoint: Point = {
    lat: 51,
    lng: 21
  };
  mapCenterLat: Point = {
    lat: 50,
    lng: 21
  };
  mapZoom = 8;


  constructor(af: AngularFire, public authService: AuthService, public router: Router) {
    this.dbUsers = af.database.list(`/users`);
    this.authService.af.auth.subscribe((auth) => {
      if (auth !== null) {
        this.uid = auth.uid;
        this.dbEvents = af.database.list('/events');
      }
    });

    if (!navigator.geolocation) {
       console.warn('Geolocation is not supported by your browser');
    } else {
      navigator.geolocation.getCurrentPosition(
        this.success.bind(this),
        this.error,
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    };
  }

  success(position) {
    // if at least one coordinate is provided
    if (position.coords && position.coords.latitude)
    {
      this.destinationPoint = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      //use the same starting values\
      this.mapCenterLat = Object.assign({},this.destinationPoint);
      this.mapZoom = 16;
    }
  }

  error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  onSubmit(form: any): void {
    let selectedUsers = {}; // users IDs will be passed as object keys with value "true"

    this.dbUsers.subscribe((users) => {
      users.map(user => selectedUsers[user.uid] = true); //adding users related to event
      this.createdAt = new Date;
      this.newEvent = {
        created_at: this.createdAt.toString(),
        created_by: this.uid,
        event_name: form.eventName,
        mapDestinationLat: this.destinationPoint.lat || 0,
        mapDestinationLng: this.destinationPoint.lng || 0,
        users: selectedUsers,
      }

      this.dbEvents.push(this.newEvent);
      this.router.navigate(['']);
    });
  }

  updateTargetPosition(event) {
    this.destinationPoint = {
      lat: event.coords.lat,
      lng: event.coords.lng
    }
  }

  ngOnInit() {
  }

}

interface Event {
  created_at: string;
  created_by: string;
  event_started?: Date;
  event_name: string;
  mapDestinationLat: number;
  mapDestinationLng: number;
  users: any;
}

interface Point {
  lat: number;
  lng: number;
}
