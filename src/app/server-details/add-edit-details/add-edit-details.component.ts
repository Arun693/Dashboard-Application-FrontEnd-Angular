import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DropdownService } from '../../dropdown.service';
import { CommonServiceService } from '../../common-service.service';
import { ModalServiceComponent } from '../../utility/modal-service/modal-service.component';

@Component({
  selector: 'server-details-add',
  templateUrl: './add-edit-details.component.html',
  styleUrls: ['./add-edit-details.component.css']
})
export class AddEditDetailsComponent implements OnInit {

  addEditServer!: FormGroup;
  applicationTypes: any;
  channelTypes: any;
  namePattern: any = "^[a-zA-Z ]*$";
  ipPattern: any = "^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$";
  alert: any;
  storedData: any;
  channelId: any;
  appId: any;

  constructor(private _formBuilder: FormBuilder,
              private _dropdownService: DropdownService,
              private _commonService: CommonServiceService,
              private modal: NgbModal,
              private cdr: ChangeDetectorRef
              ) { }

  ngOnInit() {
    this.initialLoad();
    this.onChanges();
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  initialLoad(storedData?: any) {
    this.channelId = this.channelId ? this.channelId : '';
    this.appId = this.appId ? this.appId : '';
    this.addEditServer = this._formBuilder.group({
      channelType: [storedData ? storedData.channelID : this.channelId, Validators.required],
      applicationID: [storedData ? storedData.application._id : this.appId, Validators.required],
      publicDCIP: [storedData ? storedData.publicDCIP : '', Validators.pattern(this.ipPattern)],
      publicDRIP: [storedData ? storedData.publicDRIP : '', Validators.pattern(this.ipPattern)],
      publicUATIP: [storedData ? storedData.publicUATIP : '', Validators.pattern(this.ipPattern)],
      publicDomainLive: storedData ? storedData.publicDomainLive : '',
      publicDomainUat: storedData ? storedData.publicDomainUAT : '',
      serverArray: this._formBuilder.array([
        this.initServer(storedData ? storedData.serverArray : '')
      ])
    });
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
    this.addEditServer?.get('channelType')?.valueChanges.subscribe(val => {
      if (val) {
        this.channelId = val;
        this._commonService.startOrStopLoader(true);
        this._dropdownService.getApplicationNames({ "channelID": val }).subscribe(
          data => {
            this._commonService.startOrStopLoader(false);
            this.applicationTypes = data;
            this.cdr.detectChanges();
          },
          err => {
            this._commonService.startOrStopLoader(false);
          }
        );
      }
    });

    this.addEditServer?.get('applicationID')?.valueChanges.subscribe(val => {
      this.appId = val;
      if (val && this.addEditServer.value.channelType) {
        this._commonService.startOrStopLoader(true);
        let data = {
          "channelType": this.addEditServer.value.channelType,
          "applicationID": val
        }
        this._commonService.getServerInfo(data).subscribe(
          data => {
            this._commonService.startOrStopLoader(false);
            if (data && data.length == 1) {
              this.storedData = data[0];
              this.initialLoad(this.storedData);
              this.loopServerInfo(this.storedData.serverArray);
              this.showAlert("Info", "We can find one entry for this sever in System. Please review and edit if necessary !");
            } else {
              this.initialLoad();
            }
            this.onChanges();
            this.cdr.detectChanges();
          },
          err => {
            this._commonService.startOrStopLoader(false);
            this.initialLoad();
            this.onChanges();
          }
        );
      }
    });
  }

  initServer(item?: any) {
    return this._formBuilder.group({
      serverName: [item ? item.serverName : '', Validators.compose([Validators.required, Validators.pattern(this.namePattern)])],
      liveIP: [item ? item.liveIP : '', Validators.compose([Validators.required, Validators.pattern(this.ipPattern)])],
      drIP: [item ? item.drIP : '', Validators.pattern(this.ipPattern)],
      uatIP: [item ? item.uatIP : '', Validators.pattern(this.ipPattern)],
      externalDependencyIp: [item ? item.externalDependencyIp : '']
    });
  }

  addServer() {
    const control = <FormArray>this.addEditServer.controls['serverArray'];
    control.push(this.initServer());
  }

  removeServer(i: number) {
    const control = <FormArray>this.addEditServer.controls['serverArray'];
    control.removeAt(i);
  }

  loopServerInfo(serverArray: any[]) {
    if (serverArray && serverArray.length > 0) {
      this.removeServer(0);
      serverArray.forEach(item => {
        const control = <FormArray>this.addEditServer.controls['serverArray'];
        control.push(this.initServer(item));
      })
    }
  }

  addServerInfo() {
    if (this.addEditServer.value && this.addEditServer.valid) {
      let isIPValid = this.checkIPAddress(this.addEditServer.value);
      if (isIPValid) {
        this._commonService.startOrStopLoader(true);
        this._commonService.saveServerInfo(this.addEditServer.value).subscribe(
          data => {
            this._commonService.startOrStopLoader(false);
            this.addEditServer.reset();
            this.initialLoad();
            window.scrollTo(0, 0);
            this.alert = {
              id: 1,
              type: 'success',
              message: data.message,
            }
            this.onChanges();
          },
          err => {
            this._commonService.startOrStopLoader(false);
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

  checkIPAddress(serverInfo: any): boolean {
    let isValid = 0;
    if (!(this.IPValitaor(serverInfo.publicDCIP) && this.IPValitaor(serverInfo.publicDRIP) && this.IPValitaor(serverInfo.publicUATIP))) {
      this.showAlert("Error", `Invalid IP Address for DC/DR/UAT public IP`);
      isValid = isValid + 1;
    } else {
      let serverDetails = serverInfo.serverArray;
      if (serverDetails && serverDetails.length > 0) {
        serverDetails.forEach(item => {
          if (!(this.IPValitaor(item.liveIP) && this.IPValitaor(item.drIP) && this.IPValitaor(item.uatIP))) {
            this.showAlert("Error", `Invalid IP Address for ${item.serverName}`);
            isValid = isValid + 1;
          }
        })
      }
    }
    return isValid == 0;
  }

  IPValitaor(ipAddress: any) {
    if (ipAddress) {
      if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipAddress)) {
        return true
      }
      return false
    } else {
      return true;
    }
  }

  showAlert(header : any, message: any) {
    const modalRef = this.modal.open(ModalServiceComponent);
    modalRef.componentInstance.inputObj = {
      "heading": header,
      "SubmitBtn": "OK",
      "isSingleTxt": true,
      "singleTxt": message
    }
    modalRef.componentInstance.notifyParent.subscribe(() => {
      modalRef.close();
    });
  }

  public closeAlert() {
    this.alert = '';
  }

}
