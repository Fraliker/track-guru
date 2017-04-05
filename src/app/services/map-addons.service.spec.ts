import { TestBed, inject } from '@angular/core/testing';

import { MapAddonsService } from './map-addons.service';

describe('MapAddonsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapAddonsService]
    });
  });

  it('should ...', inject([MapAddonsService], (service: MapAddonsService) => {
    expect(service).toBeTruthy();
  }));
});
