import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appPopupHost]',
})
export class PopupHostDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
