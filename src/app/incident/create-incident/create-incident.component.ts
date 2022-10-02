import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms'

import { forkJoin } from "rxjs";
import { DropdownService } from '../../dropdown.service';
import { CommonServiceService } from '../../common-service.service';
import { nameId, User } from '../../model';
import { incidentTypes, occurrence } from '../../constants';
import { EmployeeMultiSelectionComponent } from '../../utility/employee-multi-selection/employee-multi-selection.component';
import { DateTimeCmpComponent } from '../../utility/date-time-cmp/date-time-cmp.component';

@Component({
  selector: 'create-incident',
  templateUrl: './create-incident.component.html',
  styleUrls: ['./create-incident.component.css']
})
export class CreateIncidentComponent implements OnInit {

  @ViewChild(EmployeeMultiSelectionComponent)
  private employeeSelector!: EmployeeMultiSelectionComponent;
  @ViewChild(DateTimeCmpComponent)
  private dateRange!: DateTimeCmpComponent
  @ViewChild('dateCmp') input!: ElementRef

  incidentForm!: FormGroup;
  functionalBusinessUnits!: nameId[];
  users!: User[];
  applicationNames!: nameId;
  incidentTypes: any;
  occurrence: any;
  alert: any;
  incidentTimeFrame!: String;
  isWrongDate: boolean = false;
  showDateRange: boolean = true;

  constructor(private formBuilder: FormBuilder,
    private dropdownService: DropdownService,
    private commonService: CommonServiceService, ) { }

  ngOnInit() {
    this.initialLoad();
    this.onChanges();
  }

  initialLoad() {
    this.incidentForm = this.formBuilder.group({
      fbu: ['', Validators.required],
      application: ['', Validators.required],
      requestType: ['', Validators.required],
      occurrence: ['', Validators.required],
      crfNumber: [''],
      durationArray: this.formBuilder.array([
        this.durationArrayGenerator()
      ]),
      issue: ['', Validators.required],
      rca: ['', Validators.required],
      staffList: ['', Validators.required]
    })

    this.incidentTypes = incidentTypes;
    this.occurrence = occurrence;
    let businessUnit = this.dropdownService.getChannelNames();
    this.commonService.startOrStopLoader(true);
    forkJoin([businessUnit]).subscribe(results => {
      this.commonService.startOrStopLoader(false);
      let currentUser = this.commonService.getCurrentUser();
      this.functionalBusinessUnits = results[0].filter(fbu => currentUser.FBU.includes(fbu.id));
    })
  }

  durationArrayGenerator() {
    return this.formBuilder.group({
      fromTime: ['', Validators.required],
      toTime: ['', Validators.required]
    })
  }

  onChanges() {
    this.incidentForm.get('fbu')?.valueChanges.subscribe(value => {
      if (value) {
        this.commonService.startOrStopLoader(true);
        this.dropdownService.getApplicationNames({ "channelID": value }).subscribe(
          data => {
            this.getUsersForFBU();
            this.commonService.startOrStopLoader(false);
            this.applicationNames = data;
            this.incidentForm.patchValue({ application: '' });
          },
          err => {
            this.commonService.startOrStopLoader(false);
          }
        );
      }
    })

    this.incidentForm.get('occurrence')?.valueChanges.subscribe(value => {
      if (value && value == 1 && this.incidentForm.value.durationArray.length > 1) {
        for (let i = 1; i < this.incidentForm.value.durationArray.length; i++) {
          this.removeDuration(i);
        }
      }
    })
  }

  getUsersForFBU() {
    this.commonService.startOrStopLoader(true);
    this.dropdownService.getFBUUsers({ "fbu": this.incidentForm.value.fbu }).subscribe(
      data => {
        this.commonService.startOrStopLoader(false);
        let currentUser = this.commonService.getCurrentUser();
        this.users = data.filter(user => user.ppc !== currentUser.ppc);
      },
      err => {
        this.commonService.startOrStopLoader(false);
      }
    )
  }

  updateForm($event : any, value: any, index) {
    if ($event && value) {
      //this.incidentForm.patchValue({ [value]: $event });
      (<FormArray>this.incidentForm.controls['durationArray']).at(index).patchValue({ [value]: $event })
      this.calculateDateDiff();
    }
  }

  calculateDateDiff() {
    if (this.incidentForm.value.durationArray && this.incidentForm.value.durationArray.length > 0) {
      let totalDiff: number = 0;
      this.isWrongDate = false;
      this.showDateRange = true;
      this.incidentForm.value.durationArray.forEach(duration => {
        var fromTime: any = new Date(duration.fromTime);
        var toTime: any = new Date(duration.toTime);
        var diffMs = (toTime - fromTime);
        const isDateOverlap = this.checkOverlap(duration, this.incidentForm.value.durationArray);
        if (diffMs <= 0 || isDateOverlap) {
          this.isWrongDate = true;
          return false;
        } else {
          if (!Number.isNaN(diffMs)) {
            totalDiff += diffMs;
          }
        }
      });
      if (totalDiff) {
        try {
          var diffDays = Math.floor(totalDiff / 86400000); // days
          var diffHrs = Math.floor((totalDiff % 86400000) / 3600000); // hours
          var diffMins = Math.round(((totalDiff % 86400000) % 3600000) / 60000); // minutes
          this.incidentTimeFrame = diffDays + " Days, " + diffHrs + " Hours, " + diffMins + " Minutes";
          if (diffDays && diffDays > 30 || diffDays < 0) {
            this.isWrongDate = true;
          }
        } catch (e) {
          this.incidentTimeFrame = '';
        }
      } else {
        this.showDateRange = false;
      }
    }
  }

  addOccurrence() {
    if (this.incidentForm.value.durationArray.length < 11) {
      const control = <FormArray>this.incidentForm.controls['durationArray']
      control.push(this.durationArrayGenerator())
    } else {

    }
  }

  removeDuration(index) {
    const control = <FormArray>this.incidentForm.controls['durationArray']
    control.removeAt(index);
    this.calculateDateDiff()
  }

  checkOverlap(datesToCheck, DateArray) {
    let isOverlaped = false;
    if (DateArray && DateArray.length > 0) {
      for (let i = 0; i < DateArray.length; i++) {
        if (DateArray[i] && DateArray[i].fromTime && DateArray[i].toTime) {
          var loopFromTime: any = new Date(DateArray[i].fromTime);
          var loopToTime: any = new Date(DateArray[i].toTime);
          var fromTime = new Date(datesToCheck.fromTime);
          var toTime = new Date(datesToCheck.toTime)
          if ((fromTime > loopFromTime && fromTime < loopToTime) || (toTime > loopFromTime && toTime < loopToTime)) {
            isOverlaped = true;
          }
        }
      }
    }
    return isOverlaped;
  }

  updateStaffList(employeeIds) {
    this.incidentForm.patchValue({ staffList: employeeIds });
  }

  saveIncident() {
    if (this.incidentForm.valid) {
      console.log(this.incidentForm.value);
      this.commonService.startOrStopLoader(true);
      this.commonService.saveIncident(this.incidentForm.value).subscribe(
        data => {
          this.commonService.startOrStopLoader(false);
          this.incidentForm.reset();
          this.incidentForm.controls['fbu'].setValue('');
          this.incidentForm.controls['application'].setValue('');
          this.incidentForm.controls['requestType'].setValue('');
          this.incidentForm.controls['occurrence'].setValue('');
          this.initialLoad();
          this.employeeSelector.removeEmployees();
          this.dateRange.removeDate();
          this.showDateRange = false;
          window.scrollTo(0, 0);
          this.alert = {
            id: 1,
            type: 'success',
            message: data.message,
          }
          this.onChanges();
        },
        err => {
          this.commonService.startOrStopLoader(false);
          this.alert = {
            id: 2,
            type: 'danger',
            message: 'Something went wrong !',
          }
        }
      )

    }
  }

  public closeAlert() {
    this.alert = '';
  }
}
