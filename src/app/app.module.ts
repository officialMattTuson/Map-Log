import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WorldMapComponent } from './components/world-map/world-map.component';
import { MarkerPopupComponent } from './components/marker-popup/marker-popup.component';
import { PopupHostDirective } from './directives/popup-host.directive';

@NgModule({
  declarations: [
    AppComponent,
    WorldMapComponent,
    PopupHostDirective,
    MarkerPopupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
