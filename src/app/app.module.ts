import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {WorldMapComponent} from './components/world-map/world-map.component';
import {MarkerPopupComponent} from './components/marker-popup/marker-popup.component';
import {PopupHostDirective} from './directives/popup-host.directive';

import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatMenuModule} from '@angular/material/menu';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatInputModule} from '@angular/material/input';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MapDrawerComponent} from './components/map-drawer/map-drawer.component';
import {HttpClientModule} from '@angular/common/http';
import {MapOverlayDirective} from './directives/map-overlay.directive';
import {MapOverlayComponent} from './components/map-overlay/map-overlay.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MenuOverlayComponent} from './components/menu-overlay/menu-overlay.component';

@NgModule({
  declarations: [
    AppComponent,
    WorldMapComponent,
    PopupHostDirective,
    MarkerPopupComponent,
    MapDrawerComponent,
    MapOverlayDirective,
    MapOverlayComponent,
    MenuOverlayComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatMenuModule,
    MatTooltipModule,
    MatIconModule,
    MatCheckboxModule,
    MatInputModule,
    MatSidenavModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
  ],
  exports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatMenuModule,
    MatTooltipModule,
    MatIconModule,
    MatCheckboxModule,
    MatInputModule,
    MatSidenavModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
