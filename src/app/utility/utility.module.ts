import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FileUploadModule } from "ng2-file-upload";
import { LoadingModule, ANIMATION_TYPES } from 'ngx-loading';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FileUploadComponent } from './file-upload/file-upload.component';
import { ModalServiceComponent } from './modal-service/modal-service.component';
import { HashtagComponent } from './hashtag/hashtag.component';
import { CardCmpComponent } from './card-cmp/card-cmp.component';
import { BackCmpComponent } from './back-cmp/back-cmp.component';
import { DateTimeCmpComponent } from './date-time-cmp/date-time-cmp.component';
import { EmployeeMultiSelectionComponent } from './employee-multi-selection/employee-multi-selection.component';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    FileUploadModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    BrowserAnimationsModule,
    BrowserModule,
  ],
  declarations: [
    FileUploadComponent,
    ModalServiceComponent,
    HashtagComponent,
    CardCmpComponent,
    BackCmpComponent,
    DateTimeCmpComponent,
    EmployeeMultiSelectionComponent
  ],
  exports:[
    FileUploadComponent,
    ModalServiceComponent,
    HashtagComponent,
    CardCmpComponent,
    BackCmpComponent,
    DateTimeCmpComponent,
    EmployeeMultiSelectionComponent
  ],
  providers: [
  ],
  entryComponents: [ModalServiceComponent]
})
export class UtilityModule { }
