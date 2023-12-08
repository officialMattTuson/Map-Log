import {Component, OnInit} from '@angular/core';
import {Subject, takeUntil} from 'rxjs';
import {StoryMarker} from 'src/app/models.ts/marker';
import {SharedMapService} from 'src/app/services/shared-map.service';

@Component({
  selector: 'app-menu-overlay',
  templateUrl: './menu-overlay.component.html',
  styleUrls: ['./menu-overlay.component.scss'],
})
export class MenuOverlayComponent implements OnInit {

  storyMarkers: StoryMarker[];
  destroy$ = new Subject<boolean>();
  constructor(private readonly sharedMapService: SharedMapService) {}

  ngOnInit(): void {
    this.observeStoryMarkers();
  }
  
  observeStoryMarkers() {
    this.sharedMapService.$storyMarkers.pipe(takeUntil(this.destroy$)).subscribe(storyMarkers => {
      this.storyMarkers = storyMarkers;
    });
  }
}
