import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';
import { forkJoin } from "rxjs";
import { NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { DropdownService } from '../../dropdown.service';
import { CommonServiceService } from '../../common-service.service';
import { incidentTypes, occurrence } from '../../constants';
import { ModalServiceComponent } from '../../utility/modal-service/modal-service.component';

@Component({
  selector: 'incident-tracker',
  templateUrl: './incident-tracker.component.html',
  styleUrls: ['./incident-tracker.component.css']
})
export class IncidentTrackerComponent implements OnInit {

  functionalBusinessUnits: any;
  applicationNames: any;
  incidentTrackForm!: FormGroup;
  searchComplete: boolean = false;
  incidentTypes: any = incidentTypes;
  occurrence: any = occurrence;
  data: any;
  options = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    showTitle: true,
    title: 'Incident Details',
    useBom: true,
    noDownload: false,
    headers: ["Sl No", "Incident Type", "Application", "Occurrence", "Incident/Feature Details", "RCA/Servers affected", "CRF/DRF Number", "Date", "Staff Involved"],
    nullToEmptyString: true,
  };
  constructor(
    private dropdownService: DropdownService,
    private formBuilder: FormBuilder,
    private commonService: CommonServiceService,
    private modal: NgbModal
  ) {
  }

  ngOnInit() {
    this.incidentTrackForm = this.formBuilder.group({
      fbu: ['', Validators.required],
      applicationID: [''],
      requestType: [''],
      content: [''],
    });
    this.onChanges();
    this.initialLoad();
  }

  initialLoad() {
    let currentUser = this.commonService.getCurrentUser();
    this.commonService.startOrStopLoader(true);
    this.dropdownService.getChannelNames().subscribe(results => {
      this.commonService.startOrStopLoader(false);
      this.functionalBusinessUnits = results.filter(fbu => currentUser.FBU.includes(fbu.id));
      if (this.functionalBusinessUnits && this.functionalBusinessUnits.length == 1) {
        this.incidentTrackForm.patchValue({ fbu: this.functionalBusinessUnits[0].id });
      }
    },
      err => {
        this.commonService.startOrStopLoader(false);
      });
  }

  onChanges() {
    this.incidentTrackForm.get('fbu')?.valueChanges.subscribe(val => {
      if (val) {
        this.commonService.startOrStopLoader(true);
        this.dropdownService.getApplicationNames({ "channelID": val }).subscribe(
          data => {
            this.commonService.startOrStopLoader(false);
            this.applicationNames = data;
            this.incidentTrackForm.patchValue({ applicationName: '' });
          },
          err => {
            this.commonService.startOrStopLoader(false);
          }
        );
      }
    })
  }

  search(pageNo?: number | string) {
    let searchObj = {}

    searchObj['fbu'] = this.incidentTrackForm.value.fbu;
    if (this.incidentTrackForm.value.applicationID) {
      searchObj['appId'] = this.incidentTrackForm.value.applicationID;
    }
    if (this.incidentTrackForm.value.content) {
      searchObj['searchTxt'] = this.incidentTrackForm.value.content;
    }
    if (this.incidentTrackForm.value.requestType) {
      searchObj['type'] = this.incidentTrackForm.value.requestType;
    }
    searchObj['page'] = pageNo ? pageNo : 1;

    this.commonService.startOrStopLoader(true);
    this.commonService.searchIncidents(searchObj).subscribe(
      data => {
        this.commonService.startOrStopLoader(false);
        this.searchComplete = true;
        this.data = data;
        if (this.data.data && this.data.data.length > 0) {
          this.data.data.forEach(entry => {
            this.incidentTypes.forEach(types => {
              if (types && types.id == entry.requestType) {
                entry.requestType = types.name;
              }
            })
            this.occurrence.forEach(types => {
              if (types && types.id == entry.occurrence) {
                entry.occurrence = types.name;
              }
            })
            this.applicationNames.forEach(names => {
              if (names && names.id == entry.application) {
                entry.application = names.name;
              }
            })
            if (!entry.crfNumber) {
              entry.crfNumber = 'NA';
            }
            if (entry && entry.durationArray && entry.durationArray.length > 0) {
              entry.durationArray.forEach(dates => {
                if (dates && dates.fromTime && dates.toTime) {
                  let dateFrom = new Date(dates.fromTime);
                  let dateto = new Date(dates.toTime);
                  dates.fromTime = dateFrom.toLocaleString();
                  dates.toTime = dateto.toLocaleString();
                }
              })
            }
            entry.totalDuration = this.calculateDateDiff(entry.durationArray);
          })
        }
      },
      err => {
        this.commonService.startOrStopLoader(false);
      }
    )
  }

  reset() {
    this.incidentTrackForm.reset();
    this.incidentTrackForm.controls['applicationID'].setValue('');
    this.incidentTrackForm.controls['fbu'].setValue('');
    this.incidentTrackForm.controls['requestType'].setValue('');
    this.data = '';
  }

  calculateDateDiff(durationArray) {
    if (durationArray && durationArray.length > 0) {
      let totalDiff: number = 0;
      let incidentTimeFrame = '';
      durationArray.forEach(duration => {
        var fromTime: any = new Date(duration.fromTime);
        var toTime: any = new Date(duration.toTime);
        var diffMs = (toTime - fromTime);
        if (diffMs <= 0) {
          return 0;
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
          if (diffDays > 0) {
            incidentTimeFrame = diffDays + " Days ";
          }
          if (diffHrs > 0) {
            incidentTimeFrame = incidentTimeFrame + ' ' + diffHrs + " Hours "
          }
          if (diffMins > 0) {
            incidentTimeFrame = incidentTimeFrame + ' ' + diffMins + " Minutes"
          }

          if (diffDays && diffDays > 30 || diffDays < 0) {
            return 0;
          } else {
            return incidentTimeFrame;
          }
        } catch (e) {
          return 0;
        }

      } else {
        return 0;
      }
    }
  }
  next() {
    this.search(Number(this.data.current) + 1);
  }

  previous() {
    this.search(Number(this.data.current) - 1);
  }

  exportToExcel() {
    let searchObj = {}
    searchObj['fbu'] = this.incidentTrackForm.value.fbu;
    if (this.incidentTrackForm.value.applicationID) {
      searchObj['appId'] = this.incidentTrackForm.value.applicationID;
    }
    if (this.incidentTrackForm.value.content) {
      searchObj['searchTxt'] = this.incidentTrackForm.value.content;
    }
    if (this.incidentTrackForm.value.requestType) {
      searchObj['type'] = this.incidentTrackForm.value.requestType;
    }
    this.commonService.startOrStopLoader(true);
    this.commonService.saveIncidentsExcel(searchObj).subscribe(
      data => {
        this.commonService.startOrStopLoader(false);
        if (data && data.data && data.data.length > 0) {
          data.data.forEach(entry => {
            this.incidentTypes.forEach(types => {
              if (types && types.id == entry.IncidentType) {
                entry.IncidentType = types.name;
              }
            })
            this.occurrence.forEach(types => {
              if (types && types.id == entry.Occurrence) {
                entry.Occurrence = types.name;
              }
            })
            this.applicationNames.forEach(names => {
              if (names && names.id == entry.Application) {
                entry.Application = names.name;
              }
            })
          })
          new AngularCsv(data.data, 'Incidents -' + new Date(), this.options);
        }
      },
      err => {
        this.commonService.startOrStopLoader(false);
      });
  }

  isAdmin() {
    return this.commonService.isAdminUser();
  }

  deleteIncident(id: string) {
    if (id) {
      const modalRef = this.modal.open(ModalServiceComponent);
      modalRef.componentInstance.inputObj = {
        "heading": "Confirm Deletion",
        "cancelBtn": "Cancel",
        "SubmitBtn": "Confirm",
        "isSingleTxt": true,
        "singleTxt": `Are you sure you want to delete incident ?`
      }
      modalRef.componentInstance.notifyParent.subscribe(value => {
        modalRef.close();
        this.commonService.startOrStopLoader(true);
        let deleteIncident = { "id": id }
        this.commonService.deleteIncident(deleteIncident).subscribe(
          data => {
            this.commonService.startOrStopLoader(false);
            this.search();
          },
          err => {
            this.commonService.startOrStopLoader(false);
          }
        )
      })
    }
  }

}
