import {Directive, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[appMapOverlay]',
})
export class MapOverlayDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
