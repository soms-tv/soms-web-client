import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { MaterialImportsModule } from './material-imports.module';

import { AppComponent } from './app.component';
import { HostComponent } from './host/host.component';
import { ViewComponent } from './view/view.component';
import { ChooseComponent } from './choose/choose.component';

import { SharedService } from './shared/shared.service';
import { RoomHeaderComponent } from './room-header/room-header.component';

@NgModule({
  declarations: [
    AppComponent,
    HostComponent,
    ViewComponent,
    ChooseComponent,
    RoomHeaderComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    MaterialImportsModule,
    ReactiveFormsModule
  ],
  providers: [SharedService],
  bootstrap: [AppComponent]
})
export class AppModule { }
