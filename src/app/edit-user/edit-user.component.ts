import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DropdownService } from '../dropdown.service';
import { CommonServiceService } from '../common-service.service';
import { User } from '../model'
import { ModalServiceComponent } from '../utility/modal-service/modal-service.component';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  editUser: FormGroup;
  userList: User[]
  selectedUser: any;
  showMessage: boolean = false;
  alert: any;

  constructor(private formBuilder: FormBuilder,
    private _commonservice: CommonServiceService,
    private dropDownservice: DropdownService,
    private modal: NgbModal,
    private router: Router
  ) { }

  ngOnInit() {
    this.editUser = this.formBuilder.group({
      user: ['', Validators.required]
    });
    this.initiateLoad();
  }

  initiateLoad() {
    this._commonservice.startOrStopLoader(true);
    this.dropDownservice.getAllUsers().subscribe(
      data => {
        this._commonservice.startOrStopLoader(false);
        this.userList = data;
        let currentUser = this._commonservice.getCurrentUser();
        this.userList = this.userList.filter(user => user.ppc !== currentUser.ppc);
        this.editUser.controls['user'].setValue('');
      },
      err => {
        this._commonservice.startOrStopLoader(false);
      }
    )
  }

  onChange($event) {
    this.selectedUser = this.userList.filter(user => user.ppc == this.editUser.value.user);
  }

  public closeAlert() {
    this.showMessage = false;
  }

  delete() {
    if (this.selectedUser && this.selectedUser.length == 1) {
      let unAuthorised = false;
      let loggedInUser = this._commonservice.getCurrentUser();
      this.selectedUser[0].FBU.forEach(fbu => {
        if (!loggedInUser.FBU.includes(fbu)) {
          unAuthorised = true;
        }
      })
      if (unAuthorised) {
        this.showFBUerror();
        return false;
      }
      const modalRef = this.modal.open(ModalServiceComponent);
      modalRef.componentInstance.inputObj = {
        "heading": "Confirm Deletion",
        "cancelBtn": "Cancel",
        "SubmitBtn": "Confirm",
        "isSingleTxt": true,
        "singleTxt": `Are you sure You want to delete - ${this.selectedUser[0].name}(${this.selectedUser[0].ppc}) ?`
      }
      modalRef.componentInstance.notifyParent.subscribe(value => {
        modalRef.close();
        this._commonservice.startOrStopLoader(true);
        this._commonservice.deleteUser({ 'ppc': this.selectedUser[0].ppc }).subscribe(
          data => {
            this._commonservice.startOrStopLoader(false);
            this.showMessage = true;
            this.alert = {
              id: 1,
              type: 'success',
              message: 'User deleted succesfully !',
            }
            this.initiateLoad();
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
      })
    }
  }

  edit() {
    this.router.navigate(['/editDetails', this.editUser.value.user]);
  }

  reset() {
    if (this.selectedUser && this.selectedUser.length == 1) {
      let unAuthorised = false;
      let loggedInUser = this._commonservice.getCurrentUser();
      this.selectedUser[0].FBU.forEach(fbu => {
        if (!loggedInUser.FBU.includes(fbu)) {
          unAuthorised = true;
        }
      })
      if (unAuthorised) {
        this.showFBUerror();
        return false;
      }
      this._commonservice.startOrStopLoader(true);
      this._commonservice.resetPassword({ 'ppc': this.selectedUser[0].ppc }).subscribe(
        data => {
          this._commonservice.startOrStopLoader(false);
          this.showMessage = true;
          this.alert = {
            id: 1,
            type: 'success',
            message: 'Password reset succesfully !',
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

  showFBUerror() {
    const modalRef = this.modal.open(ModalServiceComponent);
    modalRef.componentInstance.inputObj = {
      "heading": "Unauthorised Request",
      "cancelBtn": "",
      "SubmitBtn": "OK",
      "isSingleTxt": true,
      "singleTxt": `You can only do Delete/Reset password for those users who have equal or less privilage in terms of functional business units.`
    }
    modalRef.componentInstance.notifyParent.subscribe(value => {
      modalRef.close();
    })
  }
}
