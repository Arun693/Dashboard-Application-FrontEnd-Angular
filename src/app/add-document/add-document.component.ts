import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { forkJoin } from "rxjs";
import { NgbDatepickerConfig, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

import { DropdownService } from '../dropdown.service';
import { CommonServiceService } from '../common-service.service';
import { nameId, docUpload, User} from '../model'
import { endpoints } from '../constants';
import { environment } from '../../environments/environment';
import { HashtagComponent } from '../utility/hashtag/hashtag.component';

@Component({
  selector: 'add-document',
  templateUrl: './add-document.component.html',
  styleUrls: ['./add-document.component.css']
})
export class AddDocumentComponent implements OnInit {

  @ViewChild(HashtagComponent)  
  private hashComponent: HashtagComponent;
  uploadDocument: FormGroup;
  documentTypes: nameId;
  applicationNames: nameId;
  functionalBusinessUnits: nameId[];
  showMessage: boolean = false;
  alert: any;
  url: String;
  users: User[];
  hashTags : String[] = [];
  dropdownSettings: any = {singleSelection: false,idField: 'id',textField: 'name',selectAllText: 'Select All',unSelectAllText: 'UnSelect All',itemsShowLimit: 3,allowSearchFilter: false};
  userMultiSettings: any = {idField: 'ppc',textField: 'name', itemsShowLimit: 2, allowSearchFilter: false, singleSelection: false, selectAllText: 'Select All',unSelectAllText: 'UnSelect All'};

  constructor(private formBuilder: FormBuilder,
              private dropdownService: DropdownService,
              private commonService: CommonServiceService,
              config: NgbDatepickerConfig) {
              config.minDate = { year: 1990, month: 1, day: 1 };
              config.maxDate = { year: new Date().getUTCFullYear(), month: new Date().getUTCMonth() + 1, day: new Date().getUTCDate() };
  }

  ngOnInit() {
    this.uploadDocument = this.formBuilder.group({
      documentName: ['', Validators.compose([Validators.required, Validators.minLength(3),
      Validators.maxLength(50)])],
      fbu: ['', Validators.required],
      applicationName: ['', Validators.required],
      documentDate: ['', Validators.required],
      documentType: ['', Validators.required],
      security: 'public',
      privilegedUsers: ''
    });
    this.onChanges();
    this.initialLoad();
  }

  initialLoad() {
    this.changeSecurity();
    let docTypes = this.dropdownService.getdocumentTypes();
    let businessUnit = this.dropdownService.getChannelNames();
    this.commonService.startOrStopLoader(true);
    forkJoin([docTypes, businessUnit]).subscribe(results => {
      this.commonService.startOrStopLoader(false);
      this.documentTypes = results[0];
      let currentUser = this.commonService.getCurrentUser();
      this.functionalBusinessUnits = results[1].filter(fbu => currentUser.FBU.includes(fbu.id));
      if(this.functionalBusinessUnits  && this.functionalBusinessUnits.length == 1) {
        this.uploadDocument.patchValue({fbu: this.functionalBusinessUnits[0].id});
      }
    },
      err => {
        this.commonService.startOrStopLoader(false);
      });
  }

  public closeAlert() {
    this.showMessage = false;
  }

  getUsersForFBU() {
    this.uploadDocument.controls['privilegedUsers'].setValue('');
      this.commonService.startOrStopLoader(true);
      this.dropdownService.getFBUUsers({"fbu": this.uploadDocument.value.fbu}).subscribe(
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

  changeSecurity($event?: any) {
    this.url = $event && $event == 'confidential' ? environment.apiURL + endpoints.singleBlobUpload : environment.apiURL + endpoints.singleUpload;
    if(document.getElementById('dropdownUsers')) {
      document.getElementById('dropdownUsers').click();
    }
    if ($event == 'confidential') {
        this.getUsersForFBU();
    }
  }

  onChanges() {
    this.uploadDocument.get('fbu').valueChanges.subscribe(val => {
      if (val) {
        this.commonService.startOrStopLoader(true);
        this.dropdownService.getApplicationNames({ "channelID": val }).subscribe(
          data => {
            this.getUsersForFBU();
            this.commonService.startOrStopLoader(false);
            this.applicationNames = data;
            this.uploadDocument.patchValue({applicationName: ''});
            document.getElementById('dropdownMulti').click();
          },
          err => {
            this.commonService.startOrStopLoader(false);
          }
        );
      }
    })
  }

  setUserTags(tags: string[]) {
    this.hashTags = tags;
  }
  submitData(response) {
    if (!this.uploadDocument.invalid) {
      let newDate;
      if (this.uploadDocument.value.documentDate) {
        let d = this.uploadDocument.value.documentDate
        if (Number(d.month) < 10) d.month = '0' + Number(d.month);
        if (Number(d.day) < 10) d.day = '0' + Number(d.day);
        newDate = '' + d.year + '-' + d.month + '-' + d.day;
      }
      let appIds = []
      this.uploadDocument.value.applicationName.forEach(item => {
        appIds.push(item.id);
      })
      let userPPCs = []
      if(this.uploadDocument.value.privilegedUsers && this.uploadDocument.value.privilegedUsers.length > 0) {
        this.uploadDocument.value.privilegedUsers.forEach(item => {
          userPPCs.push(item.ppc);
        })
      }
      let fduArrray = [this.uploadDocument.value.fbu];
      let submitData = {
        'fileName': response.fileName,
        'orginalName': response.orginalName,
        'applicationName': appIds,
        'documentName': this.uploadDocument.value.documentName,
        'documentType': this.uploadDocument.value.documentType,
        'documentDate': newDate,
        'isBlob': response.isBlob,
        'allowedUsers': userPPCs,
        'fbu': fduArrray,
        'hashTags':  this.hashTags,
      }
      this.commonService.startOrStopLoader(true);
      this.commonService.uploadDocEntry(submitData).subscribe(
        data => {
          this.commonService.startOrStopLoader(false);
          this.uploadDocument.reset();
          this.uploadDocument.controls['documentType'].setValue('');
          this.uploadDocument.controls['security'].setValue('public');
          this.uploadDocument.controls['fbu'].setValue('');
          this.showMessage = true;
          this.alert = {
            id: 1,
            type: 'success',
            message: 'Document uploaded succesfully !',
          }
          document.getElementById('dropdownMulti').click();//tweek to reset the multiselection dropdown
          this.hashComponent.removeHashs();
        },
        err => {
          this.commonService.startOrStopLoader(false);
          this.showMessage = true;
          this.alert = {
            id: 2,
            type: 'danger',
            message: 'Something went wrong !',
          }
        }
      )
    }
  }
}
