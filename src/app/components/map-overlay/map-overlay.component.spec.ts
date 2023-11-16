import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapOverlayComponent } from './map-overlay.component';

describe('MapOverlayComponent', () => {
  let component: MapOverlayComponent;
  let fixture: ComponentFixture<MapOverlayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MapOverlayComponent]
    });
    fixture = TestBed.createComponent(MapOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
