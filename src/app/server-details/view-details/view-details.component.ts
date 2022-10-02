import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonServiceService } from '../../common-service.service';
import { DropdownService } from '../../dropdown.service';
@Component({
  selector: 'app-view-details',
  templateUrl: './view-details.component.html',
  styleUrls: ['./view-details.component.css']
})
export class ViewDetailsComponent implements OnInit {

  channelTypes: any;
  viewServer!: FormGroup;
  applicationTypes: any;
  serverData: any;
  ipPattern: any = "^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$";
  searchComplete: boolean = false;
  requestType!: boolean;

  constructor(private _commonService: CommonServiceService,
    private _dropdownService: DropdownService,
    private _formBuilder: FormBuilder) { }

  ngOnInit() {
    this.viewServer = this._formBuilder.group({
      channelType: [''],
      applicationID: [''],
      serverIP: ['', Validators.pattern(this.ipPattern)],
      requestType: [true]
    });
    this.initialLoad();
    this.onChanges();
  }

  initialLoad() {
    this._dropdownService.getChannelNames().subscribe(
      data => {
        this._commonService.startOrStopLoader(false);
        this.channelTypes = data;
      },
      err => {
        this._commonService.startOrStopLoader(false);
      }
    );
  }

  onChanges() {
    this.viewServer?.get('channelType')?.valueChanges.subscribe(val => {
      if (val) {
        this._commonService.startOrStopLoader(true);
        this._dropdownService.getApplicationNames({ "channelID": val }).subscribe(
          data => {
            this._commonService.startOrStopLoader(false);
            this.applicationTypes = data;
          },
          err => {
            this._commonService.startOrStopLoader(false);
          }
        );
      }
    })
  }

  searchServer() {
    this.serverData = '';
    if (this.viewServer.value.requestType && this.viewServer.value.channelType && this.viewServer.value.applicationID) {
      this.viewServer.patchValue({serverIP: ''})
      let obj = {
        'channelType': this.viewServer.value.channelType,
        'applicationID': this.viewServer.value.applicationID
      }
      this._commonService.getServerInfo(obj).subscribe(
        data => {
          this._commonService.startOrStopLoader(false);
          if (data && data.length == 1) {
            this.serverData = data[0];
          }
          this.searchComplete = true;
        },
        err => {
          this._commonService.startOrStopLoader(false);
        }
      );
    } else if (!this.viewServer.value.requestType && this.viewServer.value.serverIP && this.viewServer.valid) {
      this.viewServer.patchValue({
        channelType: '',
        applicationID: ''
      });
      let obj = {
        'ipAddress': this.viewServer.value.serverIP
      }
      this._commonService.getServerForIP(obj).subscribe(
        data => {
          this._commonService.startOrStopLoader(false);
          if (data && data.length > 0) {
            this.serverData = data[0];
          }
          this.searchComplete = true;
        },
        err => {
          this._commonService.startOrStopLoader(false);
        }
      );
    }
  }
}
