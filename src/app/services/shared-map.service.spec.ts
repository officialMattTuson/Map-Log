import { TestBed } from '@angular/core/testing';

import { SharedMapService } from './shared-map.service';

describe('SharedMapService', () => {
  let service: SharedMapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedMapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
