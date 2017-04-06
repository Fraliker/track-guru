import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  SebmGoogleMap,
  SebmGoogleMapPolyline,
  SebmGoogleMapPolylinePoint
} from 'angular2-google-maps/core';
import { FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { UsersService } from './../services/users.service';

@Component({
  selector: 'app-gmaps',
  templateUrl: './gmaps.component.html',
  styleUrls: ['./gmaps.component.scss']
})

export class GmapsComponent {
  @Input() eventTracks: Track[];
  @Input() dbUser: FirebaseObjectObservable<any>;
  @Input() dbEvent: FirebaseObjectObservable<any>;

  @Input() userId: string;
  @Input() eventAuthorId: string;

  @Output() updateTargetPosition: EventEmitter<any> = new EventEmitter();

  constructor(public usersService: UsersService) {}

  onUpdateTargetPosition(event) {
    this.updateTargetPosition.emit(event);
  }
}

interface Point {
  lat: number;
  lng: number;
}

interface Track {
  created_at: Date;
  trackColor: string;
  points: Point[];
  userId: string;
  eventId: string;
}
