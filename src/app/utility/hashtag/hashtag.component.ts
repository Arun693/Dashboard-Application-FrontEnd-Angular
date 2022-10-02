import { Component, OnInit, ViewChild, Input, Output, EventEmitter, } from '@angular/core';

//import { BsModalService, BsModalRef  } from 'ngx-bootstrap/modal';
//import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DropdownService } from '../../dropdown.service';
import { CommonServiceService } from '../../common-service.service';
import { ModalServiceComponent } from '../modal-service/modal-service.component';

@Component({
  selector: 'hashtag',
  templateUrl: './hashtag.component.html',
  styleUrls: ['./hashtag.component.css']
})
export class HashtagComponent implements OnInit {

  userHashArray = [];
  hashtag!: string;
  storedHash: any;
  infoText!: string;
  showDropdown: boolean = false;

  @Input() issearchOnly!: boolean;
  @Input() placeHolder!: String;
  @ViewChild('name') input: any;
  @Output() public hashList: EventEmitter<string[]> = new EventEmitter();

  constructor(private dropdownService: DropdownService,
    private commonService: CommonServiceService,
    private modal: NgbModal) { }

  ngOnInit() {
  }

  eventHandler(event: any) {
    if ((event.keyCode == 13 || event.keyCode == 44) && this.hashtag && !this.issearchOnly) {
      this.hashtag = this.hashtag.replace("#", "");
      if (!this.input.invalid) {
        this.saveNewHash(this.hashtag);
      }
    }
  }

  deleteHash(i: number) {
    this.userHashArray.splice(i, 1);
    this.hashList.emit(this.userHashArray);
  }

  saveNewHash(hash: any) {
    this.userHashArray.push(hash);
    this.hashtag = '';
    this.hashList.emit(this.userHashArray);
  }

  selectHash(hash:any) {
    if (hash) {
      this.saveNewHash(hash);
      this.showDropdown = false;
    }
  }

  removeHashs() {
    this.userHashArray = [];
  }

  onBlur() {
    setTimeout(() => { this.showDropdown = false; }, 3000);
  }

  getHashValues(hash: any) {
    if (hash && hash.length > 0) {
      let data = { 'search': hash.replace("#", "") }
      this.showDropdown = false;
      this.dropdownService.getHashTags(data).subscribe(
        data => {
          this.commonService.startOrStopLoader(false);
          this.storedHash = [];
          if (data && data.length > 0) {
            this.storedHash = data;
            this.showDropdown = true;
          }
        },
        err => {
          this.commonService.startOrStopLoader(false);
        }
      )
    } else {
      this.showDropdown = false;
      this.storedHash = [];
    }
  }

  showInfo() {
    const modalRef = this.modal.open(ModalServiceComponent);
    modalRef.componentInstance.inputObj = {
      "heading": "#Hashtags -Introduction",
      "cancelBtn": "",
      "SubmitBtn": "OK",
      "isSingleTxt": true,
      "singleTxt": `If you are searching for documents, please type some document related hashtags. If any hashtag is available, system will show suggestion. In case of adding a new document, you can add new hashtag
                     by clicking ENTER key. Adding meaningful tags will make the search more easy.`
    }
    modalRef.componentInstance.notifyParent.subscribe(() => {
      modalRef.close();
    })
  }

}
