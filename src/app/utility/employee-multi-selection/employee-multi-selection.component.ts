import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DropdownService } from '../../dropdown.service';
import { CommonServiceService } from '../../common-service.service';
import { ModalServiceComponent } from '../modal-service/modal-service.component';

@Component({
  selector: 'employee-multi-selection',
  templateUrl: './employee-multi-selection.component.html',
  styleUrls: ['./employee-multi-selection.component.css']
})
export class EmployeeMultiSelectionComponent implements OnInit {

  employeeList = [];
 // employeeId = [];
  employeeId : any = [];
  employeeName!: string;
  storedList: any;
  infoText!: string;
  showDropdown: boolean = false;

  @ViewChild('name') input: any;
  @Output() public employeeSelectList: EventEmitter<string[]> = new EventEmitter();

  constructor(private dropdownService: DropdownService,
    private commonService: CommonServiceService,
    private modal: NgbModal) { }

  ngOnInit() {
  }

  deleteEmployee(i: number) {
    this.employeeList.splice(i, 1);
    this.employeeId = [];
    this.employeeList.forEach(emp => {
      if (this.employeeId.indexOf(emp._id) === -1) {
        this.employeeId.push(emp._id);
      }
    })
    this.employeeSelectList.emit(this.employeeId);
  }

  saveNewEmployee(selection: any) {
    this.employeeList.push(selection);
    this.employeeId = [];
    this.employeeName = '';
    this.employeeList.forEach(emp => {
      if (this.employeeId.indexOf(emp._id) === -1) {
        this.employeeId.push(emp._id);
      }
    })
    this.employeeSelectList.emit(this.employeeId);
  }

  selectEmployee(selection: any) {
    if (selection) {
      this.saveNewEmployee(selection);
      this.showDropdown = false;
    }
  }

  removeEmployees() {
    this.employeeList = [];
  }

  onBlur() {
    setTimeout( () => { this.showDropdown = false; }, 3000);
  }

  getEmployeeValues(selection: any) {
    if (selection && selection.length > 0) {
      let data = { 'search': selection }
      this.showDropdown = false;
      this.dropdownService.getAllUsersBykeywords(data).subscribe(
        data => {
          this.commonService.startOrStopLoader(false);
          this.storedList = [];
          if (data && data.length > 0) {
            this.storedList = data;
            this.showDropdown = true;
          }
        },
        err => {
          this.commonService.startOrStopLoader(false);
        }
      )
    } else {
      this.showDropdown = false;
      this.storedList = [];
    }
  }

}
