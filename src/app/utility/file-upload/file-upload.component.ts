import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';

import { FileUploader, FileUploaderOptions, FileLikeObject, FileItem } from 'ng2-file-upload';
import { allowedDocTypes, maxFileSize } from '../../constants';
@Component({
  selector: 'file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {

  private _url!: string;
  // @Input() public url: string;
  @Input() public queueLimit!: number;
  @Input() public maxFileSize!: number;
  @Input() public allowedFileType!: Array<string>;
  @Input() public allowedMimeType!: Array<string>;
  @Input() public multiple!: boolean;
  @Input() public formInvalid!: boolean;
  @ViewChild('selectedFile') selectedFile: any;
  @Output() public onComplete: EventEmitter<string> = new EventEmitter();
  @Input() set url(value: string) {
    this._url = value;
    this.uploader = new FileUploader({url: this._url,allowedMimeType: allowedDocTypes,autoUpload: false,maxFileSize: maxFileSize,method: "POST"});
    this.uploader.onWhenAddingFileFailed = (item, filter, options) => this.onWhenAddingFileFailed(item, filter, options);
    this.uploader.onSuccessItem = (item, response, status, headers) => this.onSuccessItem(item, response, status, headers);
    this.uploader.onAfterAddingFile = (fileItem: FileItem) => this.onAfterAddingFile(fileItem)
    this.uploader.onBeforeUploadItem = (fileItem: FileItem) => this.onBeforeUploadItem(fileItem)
    this.selectedFile.nativeElement.value = '';
    this.uploader.queue = [];
  }
  public uploader!: FileUploader;
  errorMessage!: string;

  constructor() { }

  ngOnInit() {}


  onWhenAddingFileFailed(item: FileLikeObject, filter: any, options: any) {
    switch (filter.name) {
      case 'fileSize':
        this.errorMessage = `Maximum upload size exceeded. Please upload item below 5MB`;
        break;
      case 'mimeType':
        this.errorMessage = `Type ${item.type} is not allowed. Allowed types: Word document, JPEG, PNG, Excel and pdf`;
        break;
    }
  }

  uploadComplete(data: any) { }
  onAfterAddingFile(fileItem: FileItem) {
    this.errorMessage = '';
    let latestFile = this.uploader.queue[this.uploader.queue.length - 1]
    this.uploader.queue = [];
    this.uploader.queue.push(latestFile);
  }
  onBeforeUploadItem(fileItem: FileItem) { }

  onSuccessItem(item : any, response : any, status : any, headers : any) {
    if (response) {
      try {
        let res = JSON.parse(response);
        this.selectedFile.nativeElement.value = '';
        this.uploader.queue = [];
        this.onComplete.emit(res);
      } catch (e) {

      }
    }
  }
}
