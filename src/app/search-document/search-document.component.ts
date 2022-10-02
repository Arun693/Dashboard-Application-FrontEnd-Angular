import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Observable, interval  } from 'rxjs';
import { forkJoin, take } from "rxjs";
import { DropdownService } from '../dropdown.service';
import { CommonServiceService } from '../common-service.service';
import { nameId, searchDocument, documentData } from '../model'
import { NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { saveAs } from 'file-saver';
import { ModalServiceComponent } from '../utility/modal-service/modal-service.component';
import { User } from '../model'
import { HashtagComponent } from '../utility/hashtag/hashtag.component';


@Component({
  selector: 'search-document',
  templateUrl: './search-document.component.html',
  styleUrls: ['./search-document.component.css']
})
export class SearchDocumentComponent implements OnInit {

  @ViewChild(HashtagComponent)  
  private hasComponent!: HashtagComponent;
  searchDocumentForm!: FormGroup;
  documentTypes: any;
  applicationNames: any;
  searchComplete: boolean = false;
  data!: searchDocument;
  loggedUser!: User;
  functionalBusinessUnits!: nameId[];
  hashTags : String[] = [];
  toggleFlag: boolean = false;
  showBtns: boolean = true;
  dropdownSettings: any = {
    singleSelection: false,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: false
  };
  constructor(private formBuilder: FormBuilder,
              private dropdownService: DropdownService,
              private commonService: CommonServiceService,
              config: NgbDatepickerConfig,
              private modal: NgbModal) {
    config.minDate = { year: 1990, month: 1, day: 1 };
    config.maxDate = { year: new Date().getUTCFullYear(), month: new Date().getUTCMonth() + 1, day: new Date().getUTCDate() };
  }

  ngOnInit() {
    this.searchDocumentForm = this.formBuilder.group({
      fbu: ['', Validators.required],
      applicationName: [''],
      documentFromDate: [''],
      documentToDate: [''],
      documentType: [''],
      documentName: ['']
    });
    this.onChanges();
    this.initialLoad();
    this.loggedUser = this.commonService.getCurrentUser();
  }

  initialLoad() {
    let docTypes = this.dropdownService.getdocumentTypes();
    let businessUnit = this.dropdownService.getChannelNames();
    let currentUser = this.commonService.getCurrentUser();
    this.commonService.startOrStopLoader(true);
    forkJoin([docTypes, businessUnit]).subscribe(results => {
      this.commonService.startOrStopLoader(false);
      this.documentTypes = results[0];
      this.functionalBusinessUnits = results[1].filter(fbu => currentUser.FBU.includes(fbu.id));
      if (this.functionalBusinessUnits && this.functionalBusinessUnits.length == 1) {
        this.searchDocumentForm.patchValue({ fbu: this.functionalBusinessUnits[0].id });
      }
    },
      err => {
        this.commonService.startOrStopLoader(false);
      });
  }


  onChanges() {
    this.searchDocumentForm.get('fbu')?.valueChanges.subscribe(val => {
      if (val) {
        this.commonService.startOrStopLoader(true);
        this.dropdownService.getApplicationNames({ "channelID": val }).subscribe(
          data => {
            this.commonService.startOrStopLoader(false);
            this.applicationNames = data;
            this.searchDocumentForm.patchValue({ applicationName: '' });
            document.getElementById('dropdownMulti')?.click();
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

  search(pageNo?: number | string) {
    let searchObj = {};
    let appIds : string[] = [];
    if (this.searchDocumentForm.value.applicationName) {
      this.searchDocumentForm.value.applicationName.forEach(item => {
        appIds.push(item.id);
      })
    }
    searchObj['fbu'] = this.searchDocumentForm.value.fbu;
    if (appIds && appIds.length > 0) {
      searchObj['applicationName'] = appIds;
    }
    if (this.searchDocumentForm.value.documentType) {
      searchObj['documentType'] = this.searchDocumentForm.value.documentType;
    }
    if (this.searchDocumentForm.value.documentName) {
      searchObj['documentName'] = this.searchDocumentForm.value.documentName;
    }
    if (this.searchDocumentForm.value.documentFromDate) {
      searchObj['documentFromDate'] = this.convertDate(this.searchDocumentForm.value.documentFromDate);
    }
    if (this.searchDocumentForm.value.documentToDate) {
      searchObj['documentToDate'] = this.convertDate(this.searchDocumentForm.value.documentToDate);
    }
    if (searchObj['documentToDate'] && searchObj['documentFromDate']) {
      var d1 = Date.parse(searchObj['documentToDate']);
      var d2 = Date.parse(searchObj['documentFromDate']);
      if (d1 < d2) {
        const modalRef = this.modal.open(ModalServiceComponent);
        modalRef.componentInstance.inputObj = {
          "heading": "Invaid Date Selection",
          "cancelBtn": "",
          "SubmitBtn": "OK",
          "isSingleTxt": true,
          "singleTxt": `To date can't be before From Date!`
        }
        modalRef.componentInstance.notifyParent.subscribe(() => {
          modalRef.close();
        });
        return;
      }
    }
    searchObj['page'] = pageNo ? pageNo : 1;
    searchObj['hashTags'] = this.hashTags;

    this.commonService.startOrStopLoader(true);
    this.commonService.searchDocument(searchObj).subscribe(
      data => {
        this.commonService.startOrStopLoader(false);
        this.searchComplete = true;
        this.data = data;
        if (data.data && data.data.length > 0) {
          data.data.forEach(entry => {
            this.documentTypes.forEach(types => {
              if (types && types.id == entry.documentType) {
                entry.documentType = types.name;
              }
            })
            if (entry && entry.applicationName && entry.applicationName.length > 0) {
              for (let i = 0; i < entry.applicationName.length; i++) {
                this.applicationNames.forEach(names => {
                  if (names && names.id == entry.applicationName[i]) {
                    entry.applicationName[i] = names.name;
                  }
                })
              }
            }
          })
        }
      },
      err => {
        this.commonService.startOrStopLoader(false);
      }
    )
  }

  convertDate(d) {
    let newDate;
    if (Number(d.month) < 10) d.month = '0' + Number(d.month);
    if (Number(d.day) < 10) d.day = '0' + Number(d.day);
    newDate = '' + d.year + '-' + d.month + '-' + d.day;
    return newDate;
  }

  downloadItem(name: string, orginalName: string, isBlob?: Boolean) {
    if (name) {
      this.commonService.startOrStopLoader(true);
      let downloadObj = { "name": name }
      if (isBlob) {
        this.commonService.downloadDBDoc(downloadObj).subscribe(
          data => {
            this.commonService.startOrStopLoader(false);
            saveAs(data, orginalName);
          },
          err => {
            this.commonService.startOrStopLoader(false);
          })
      } else {
        this.commonService.downloadDoc(downloadObj).subscribe(
          data => {
            this.commonService.startOrStopLoader(false);
            saveAs(data, orginalName);
          },
          err => {
            this.commonService.startOrStopLoader(false);
          })
      }
    }
  }


  deleteFile(id: string, name: string) {
    if (id) {
      const modalRef = this.modal.open(ModalServiceComponent);
      modalRef.componentInstance.inputObj = {
        "heading": "Confirm Deletion",
        "cancelBtn": "Cancel",
        "SubmitBtn": "Confirm",
        "isSingleTxt": true,
        "singleTxt": `Are you sure you want to delete - ${name}`
      }
      modalRef.componentInstance.notifyParent.subscribe(value => {
        modalRef.close();
        this.commonService.startOrStopLoader(true);
        let deleteDoc = { "id": id }
        this.commonService.deleteDocument(deleteDoc).subscribe(
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

  deleteDbFile(id: string, name: string) {
    if (id) {
      const modalRef = this.modal.open(ModalServiceComponent);
      modalRef.componentInstance.inputObj = {
        "heading": "Confirm Deletion",
        "cancelBtn": "Cancel",
        "SubmitBtn": "Confirm",
        "isSingleTxt": true,
        "singleTxt": `Are you sure you want to delete - ${name}`
      }
      modalRef.componentInstance.notifyParent.subscribe(value => {
        modalRef.close();
        this.commonService.startOrStopLoader(true);
        let deleteDoc = { "id": id }
        this.commonService.deleteDBDocument(deleteDoc).subscribe(
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

  isAdmin() {
    return this.commonService.isAdminUser();
  }

  reset() {
    this.searchDocumentForm.reset();
    this.searchDocumentForm.controls['applicationName'].setValue('');
    this.searchDocumentForm.controls['documentType'].setValue('');
    this.searchDocumentForm.controls['fbu'].setValue('');
    this.data = null;
    this.hasComponent.removeHashs();
  }

  next() {
    this.search(Number(this.data.current) + 1);
  }

  previous() {
    this.search(Number(this.data.current) - 1);
  }

  toggleFn() {
    this.toggleFlag = !this.toggleFlag;
    this.showBtns = false;
    this.searchDocumentForm.patchValue({ 
      documentName: '',
      documentToDate: '',
      documentFromDate: ''
    });
    //setTimeout(function(){ this.showBtns = true; }, 3000);
    interval(2000).pipe(take(1)).subscribe(() => this.showBtns = true);
  }
}
