import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FirebaseListObservable } from 'angularfire2';

import { UsersService } from './../services/users.service';

@Component({
  selector: 'app-side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.scss']
})

export class SidePanelComponent {
  isPanelClosed = true;
  @Input() eventUsers: User[];
  @Input() eventId: string;
  @Input() userId: string;
  @Input() eventAuthorId: string;

  @Output() startTracking: EventEmitter<any> = new EventEmitter();
  @Output() stopTracking: EventEmitter<any> = new EventEmitter();
  @Output() resetEvent: EventEmitter<any> = new EventEmitter();

  constructor(public usersService: UsersService) {}

  togglePanel() {
    this.isPanelClosed = !this.isPanelClosed;
  }

  isActualUser(itemId, userId) {
    return itemId && userId && itemId === userId;
  }

  isEventAuthor(itemId) {
    return itemId &&
      itemId === this.eventAuthorId &&
      itemId === this.userId;
  }

  onStartTracking() {
    this.startTracking.emit();
  }

  onStopTracking() {
    this.stopTracking.emit();
  }

  onResetEvenet() {
    this.resetEvent.emit();
  }

  onResize(event) {
    // this resize event update will refresh google maps
    // after side panel toggle (causing blank fields under the panel)
    return event.target.innerWidth;
  }
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
