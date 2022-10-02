import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UtilityModule } from '../utility/utility.module';

import { CreateIncidentComponent } from './create-incident/create-incident.component';
import { IncidentTrackerComponent } from './incident-tracker/incident-tracker.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    UtilityModule
  ],
  declarations: [
    CreateIncidentComponent,
    IncidentTrackerComponent
  ],
  exports: [
    CreateIncidentComponent
  ]
})
export class IncidentModule { }
