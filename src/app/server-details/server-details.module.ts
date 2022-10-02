import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

 import { LoadingModule, ANIMATION_TYPES } from 'ngx-loading';
 import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
 import { UtilityModule } from '../utility/utility.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AddEditDetailsComponent } from './add-edit-details/add-edit-details.component';
import { ViewDetailsComponent } from './view-details/view-details.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    LoadingModule.forRoot({animationType: ANIMATION_TYPES.circleSwish, primaryColour: '#71b1b7'}),
    NgMultiSelectDropDownModule.forRoot(),
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    UtilityModule
  ],
  declarations: [
    AddEditDetailsComponent, 
    ViewDetailsComponent
  ],
  providers: [
    HttpClientModule,

  ]
})
export class ServerDetailsModule { }
