import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { forkJoin } from "rxjs";
import { switchMap } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User, fbu } from '../model'
import { DropdownService } from '../dropdown.service';
import { CommonServiceService } from '../common-service.service';
import { ModalServiceComponent } from '../utility/modal-service/modal-service.component';

@Component({
  selector: 'app-edit-user-details',
  templateUrl: './edit-user-details.component.html',
  styleUrls: ['./edit-user-details.component.css']
})
export class EditUserDetailsComponent implements OnInit {

  editDetailsForm: FormGroup;
  namePattern: any = "^[a-zA-Z ]*$";
  ppc: string | number;
  currentUser: any;
  functionalBusinessUnits: fbu[];
  fbuMultiSettings: any = {
    singleSelection: false,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: false
  }
  constructor(private formBuilder: FormBuilder,
    private _commonservice: CommonServiceService,
    private dropdownService: DropdownService,
    private route: ActivatedRoute,
    private router: Router,
    private modal: NgbModal, ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.ppc = +params['ppc'];
      let userppc = { 'ppc': this.ppc }
      let userInfo = this._commonservice.getUserDetails(userppc);
      let channelList = this.dropdownService.getChannelNames();
      this._commonservice.startOrStopLoader(true);
      forkJoin([userInfo, channelList]).subscribe(results => {
        this._commonservice.startOrStopLoader(false);
        this.currentUser = results[0];
        this.functionalBusinessUnits = results[1];
        const result = results[1].filter(fbu => this.currentUser.FBU.includes(fbu.id));
        this.currentUser.FBU = result;
        this.createForm(this.currentUser);
      },
        err => {
          this._commonservice.startOrStopLoader(false);
        }
      )
    })
  }

  createForm(user) {
    this.editDetailsForm = this.formBuilder.group({
      ppc: [{ value: user.ppc, disabled: true }, Validators.compose([Validators.required])],
      name: [user.name, Validators.compose([Validators.required, Validators.pattern(this.namePattern), Validators.maxLength(50), Validators.minLength(2)])],
      role: [user.role, Validators.required],
      fbu: [user.FBU, Validators.required]
    });
  }

  editUser() {
    if (!this.editDetailsForm.invalid) {
      let unAuthorised = false;
      if (!this.editDetailsForm.value.fbu || this.editDetailsForm.value.fbu.length <= 0) {
        const modalRef = this.modal.open(ModalServiceComponent);
        modalRef.componentInstance.inputObj = {
          "heading": "Invalid request",
          "cancelBtn": "",
          "SubmitBtn": "Ok",
          "isSingleTxt": true,
          "singleTxt": `User need to assign in atleast one functional business unit.`
        }
        modalRef.componentInstance.notifyParent.subscribe(value => {
          modalRef.close();
        })
        return false;
      }

      let ids1 = this.editDetailsForm.value.fbu.map(item => item.id);
      let ids2 = this.currentUser.FBU.map(item => item.id);

      let changes = ids1.map((id, index) => {
        if (ids2.indexOf(id) < 0) {
          return this.editDetailsForm.value.fbu[index];
        }
      }).concat(ids2.map((id, index) => {
        if (ids1.indexOf(id) < 0) {
          return this.currentUser.FBU[index];
        }
      })).filter(item => item != undefined);

      if (changes && changes.length > 0) {
        let loggedInUser = this._commonservice.getCurrentUser();
        changes.forEach(fbu => {
          if (!loggedInUser.FBU.includes(fbu.id)) {
            unAuthorised = true;
          }
        })
        if (unAuthorised) {
          const modalRef = this.modal.open(ModalServiceComponent);
          modalRef.componentInstance.inputObj = {
            "heading": "Unauthorised Request",
            "cancelBtn": "",
            "SubmitBtn": "Ok",
            "isSingleTxt": true,
            "singleTxt": `You can only add/remove FBU which you also have access`
          }
          modalRef.componentInstance.notifyParent.subscribe(value => {
            modalRef.close();
          })
          return false;
        }
      }
      let fbuIds = []
      this.editDetailsForm.value.fbu.forEach(item => {
        fbuIds.push(item.id);
      })
      let editObj = {
        "ppc": this.currentUser.ppc,
        "name": this.editDetailsForm.value.name,
        "role": this.editDetailsForm.value.role,
        "fbu": fbuIds
      }
      this._commonservice.startOrStopLoader(true);
      this._commonservice.editUser(editObj).subscribe(
        data => {
          this._commonservice.startOrStopLoader(false);
          const modalRef = this.modal.open(ModalServiceComponent);
          modalRef.componentInstance.inputObj = {
            "heading": "Success",
            "cancelBtn": "",
            "SubmitBtn": "Ok",
            "isSingleTxt": true,
            "singleTxt": `User ${this.editDetailsForm.value.name} profile updated succesfully.`
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
}
