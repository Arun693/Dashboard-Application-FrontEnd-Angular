import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { CommonServiceService } from '../common-service.service';
import { DropdownService } from '../dropdown.service';
import { nameId } from '../model'
import { ModalServiceComponent } from '../utility/modal-service/modal-service.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  addUserForm: FormGroup;
  ppcPattern: any = "^[0-9]{2,6}$";
  namePattern: any = "^[a-zA-Z ]*$";
  fbuLists: nameId[];
  showMessage: boolean = false;
  alert: any;
  fbuMultiSettings: any = {
    singleSelection: false,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: false
  }

  constructor( private formBuilder: FormBuilder,
               private _commonservice: CommonServiceService,
               private dropdownService: DropdownService,
               private modal: NgbModal) { }

  ngOnInit() {
    this.addUserForm = this.formBuilder.group({
      ppc: ['', Validators.compose([Validators.required, Validators.pattern(this.ppcPattern)])],
      name: ['', Validators.compose([Validators.required, Validators.pattern(this.namePattern), Validators.maxLength(50), Validators.minLength(2)])],
      role: ['', Validators.required],
      fbu: ['', Validators.required]
    });
    this.initialLoad();
  }

  initialLoad() {
    this._commonservice.startOrStopLoader(true);
    this.dropdownService.getChannelNames().subscribe(results => {
      this._commonservice.startOrStopLoader(false);
      this.fbuLists = results;
    },err => {
        this._commonservice.startOrStopLoader(false);
      });
  }


  addUser() {
    if (!this.addUserForm.invalid) {
      let currentUser = this._commonservice.getCurrentUser();
      let data = this.addUserForm.value;
      let isAutherised = data.fbu.every(fbu => currentUser.FBU.includes(fbu.id))
      if(!isAutherised) {
        const modalRef = this.modal.open(ModalServiceComponent);
        modalRef.componentInstance.inputObj = {
          "heading": "Unauthorized Request",
          "cancelBtn": "",
          "SubmitBtn": "OK",
          "isSingleTxt": true,
          "singleTxt": `You can only grand access to an FBU which you have access. Please ask corresponding FBU Admin to provide the access. `
        }
        modalRef.componentInstance.notifyParent.subscribe(value => {
          modalRef.close();
        });
        return false;
      }
     data.fbuList = data.fbu.map(fbu => fbu.id)
     this._commonservice.startOrStopLoader(true);
      this._commonservice.addNewUser(this.addUserForm.value).subscribe(
        data => {
          this._commonservice.startOrStopLoader(false);
          this.addUserForm.reset();
          this.addUserForm.controls['role'].setValue('');
          this.addUserForm.controls['fbu'].setValue('');
          document.getElementById('dropdownMulti').click();
          this.showMessage = true;
          this.alert = {
            id: 1,
            type: 'success',
            message: 'User added succesfully !',
          }
        },
        err => {
          this._commonservice.startOrStopLoader(false);
          this.showMessage = true;
          this.alert = {
            id: 2,
            type: 'danger',
            message: err && err.errorMessage ? err.errorMessage : "Something went wrong",
          }
        }
      )
    }
  }

  public closeAlert() {
    this.showMessage = false;
  }


}
