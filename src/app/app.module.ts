import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';

import { AppComponent } from './app.component';
import { GmapsComponent } from './gmaps/gmaps.component';
import { firebaseConfig } from './../environments/firebase.config';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { PointFilterPipe } from './point-filter.pipe';
import { HeaderComponent } from './header/header.component';
import { SidePanelComponent } from './side-panel/side-panel.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { EventComponent } from './event/event.component';
import { EventListComponent } from './event-list/event-list.component';
import { EventCreateComponent } from './event-create/event-create.component';

import { MapAddonsService} from './services/map-addons.service';
import { UsersService } from './services/users.service';

import { AuthService } from './providers/index';

import { AuthGuard } from './guards/index';

import { routing } from './app.routing';


@NgModule({
  declarations: [
    AppComponent,
    GmapsComponent,
    HeaderComponent,
    PointFilterPipe,
    SidePanelComponent,
    LoginPageComponent,
    HomePageComponent,
    EventComponent,
    EventListComponent,
    EventCreateComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    MultiselectDropdownModule,
    AngularFireModule.initializeApp(firebaseConfig, 'track-guru'),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAdqECNlRtdg5MaB-GJQ486W-jGZhhWCNg'
    }),
    routing
  ],
  providers: [AuthGuard, AuthService, MapAddonsService, UsersService],
  bootstrap: [AppComponent]
})
export class AppModule { }
