import { Injectable } from '@angular/core';

@Injectable()
export class MapAddonsService {

  constructor() { }

  rad(x) {
    return x * Math.PI / 180;
  }

  // The Haversine formula (calculates distance bewteen 2 points in sphere)
  // https://en.wikipedia.org/wiki/Haversine_formula
  point2PointDistance(p1: Point, p2: Point) {
    const R = 6378137; // Earth’s mean radius in meter
    const dLat = this.rad(p2.lat - p1.lat);
    const dLong = this.rad(p2.lng - p1.lng);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.rad(p1.lat)) * Math.cos(this.rad(p2.lat)) *
      Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    alert(d);
    return d / 1000; // returns the distance in kilometers
  };

  getDistance(track): number {
    if(!track.points || track.points.length < 2) return 0; //skip for init 0 or 1 value

    const points: Point[] = track.points;
    let summaryDistance = 0;

    for( let i = 0; i< (points.length - 1); i++) {
      summaryDistance += this.point2PointDistance(points[i], points[i+1]);
    }
    return summaryDistance.toFixed(2); //format example 2.35 km
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
