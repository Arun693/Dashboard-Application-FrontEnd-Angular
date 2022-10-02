import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import * as sha1 from 'js-sha1';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { User} from '../model'
import { CommonServiceService } from '../common-service.service';
import { ModalServiceComponent } from '../utility/modal-service/modal-service.component';


@Component({
  selector: 'app-account-management',
  templateUrl: './account-management.component.html',
  styleUrls: ['./account-management.component.css']
})
export class AccountManagementComponent implements OnInit {

  manageAcctForm: FormGroup;
  passwordRegex = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$';
  currentUser: User;
  constructor(private formBuilder: FormBuilder,
              private _commonservice: CommonServiceService,
              private modal: NgbModal,
              private router: Router) { }

  ngOnInit() {
     this.currentUser = this._commonservice.getCurrentUser();
    this.manageAcctForm = this.formBuilder.group({
        ppc: [this.currentUser.ppc, Validators.required],
        currentPassword: ['', Validators.required],
        newPasswordOne: ['', Validators.compose([Validators.required, Validators.pattern(this.passwordRegex)])],
        newPasswordTwo: ['', Validators.compose([Validators.required, Validators.pattern(this.passwordRegex)])]
    });
  }

  changePassword() {
    if(this.manageAcctForm.value.newPasswordOne != this.manageAcctForm.value.newPasswordTwo) {
      const modalRef = this.modal.open(ModalServiceComponent);
      modalRef.componentInstance.inputObj = {
        "heading" : "Password Mismatch",
        "SubmitBtn": "OK",
        "isSingleTxt": true,
        "singleTxt":'New password entered and confired are different!'
      }
      modalRef.componentInstance.notifyParent.subscribe(value => {
        modalRef.close();
      })
      return;
    }
    let newPassword = {
      "ppc": this.currentUser.ppc,
      "currentPassword": sha1(this.manageAcctForm.value.currentPassword),
      "newPassword": sha1(this.manageAcctForm.value.newPasswordTwo)
    }
    this._commonservice.startOrStopLoader(true);
    this._commonservice.changePassword(newPassword).subscribe(
      data => {
        this._commonservice.startOrStopLoader(false);
        this.manageAcctForm.reset();
        const modalRef = this.modal.open(ModalServiceComponent);
        modalRef.componentInstance.inputObj = {
          "heading" : "Success",
          "SubmitBtn": "OK",
          "isSingleTxt": true,
          "singleTxt":'Password changed succesfully!'
        }
        modalRef.componentInstance.notifyParent.subscribe(value => {
          modalRef.close();
          this.router.navigate(['/home']);
        })
      },
      err => {
        this._commonservice.startOrStopLoader(false);
      }
    )
  }

}
