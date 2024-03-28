import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown'; // Add this line for the dropdown module
import { AlertModule } from 'ngx-bootstrap/alert';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FormsModule } from '@angular/forms';


import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { ImagePreloadDirective } from './ImagePreloadDirective ';





@NgModule({
  declarations: [
    AppComponent,
    ImagePreloadDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BsDropdownModule,
    AlertModule,
    ToastrModule.forRoot({}),
    BrowserAnimationsModule,
    TooltipModule.forRoot(),
    NgbDatepickerModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
