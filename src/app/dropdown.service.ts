import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { ModalServiceComponent } from './utility/modal-service/modal-service.component';
import { auth, User, nameId } from './model'
import { environment } from '../environments/environment';
import { endpoints } from './constants';
import { SecurityService } from './security.service';
import { CommonServiceService } from './common-service.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
  withCredentials: true
};


@Injectable()
export class DropdownService {

  private url: string = environment.apiURL;

  constructor(private http: HttpClient,
    private commonService: CommonServiceService,
    private router: Router,
    private modal: NgbModal) { }

  getdocumentTypes(): Observable<any> {
    const endUrl = this.url + endpoints.documentTypes;
    return this.http.post<any>(endUrl, '', httpOptions).pipe(
      tap(data => console.log()),
      catchError(this.handleError('documentTypes', endUrl))
    );
  }

  getApplicationNames(data: any): Observable<any> {
    const endUrl = this.url + endpoints.applicationNames;
    return this.http.post<any>(endUrl, data, httpOptions).pipe(
      tap(data => console.log()),
      catchError(this.handleError('applicationNames', endUrl))
    );
  }

  getAllUsers(): Observable<any> {
    const endUrl = this.url + endpoints.getAllUsers;
    return this.http.post<any>(endUrl, '', httpOptions).pipe(
      tap(data => console.log()),
      catchError(this.handleError('getAllUsers', endUrl))
    );
  }

  getAllUsersBykeywords(data:any): Observable<any> {
    const endUrl = this.url + endpoints.getUserForKeyword;
    return this.http.post<any>(endUrl, data , httpOptions).pipe(
      tap(data => console.log()),
      catchError(this.handleError('getAllUsers', endUrl))
    );
  }

  getFBUUsers(data: any): Observable<any> {
    const endUrl = this.url + endpoints.getFBUUsers;
    return this.http.post<any>(endUrl, data, httpOptions).pipe(
      tap(data => console.log()),
      catchError(this.handleError('getAllUsers', endUrl))
    );
  }

  getChannelNames(): Observable<any> {
    const endUrl = this.url + endpoints.getChannelNames;
    return this.http.post<any>(endUrl, '', httpOptions).pipe(
      tap(data => console.log()),
      catchError(this.handleError('getAllUsers', endUrl))
    );
  }

  getHashTags(data: any): Observable<any> {
    const endUrl = this.url + endpoints.getHashTags;
    return this.http.post<any>(endUrl, data, httpOptions).pipe(
      tap(data => console.log()),
      catchError(this.handleError('getAllUsers', endUrl))
    );
  }

  showTimeOutMsg() {
    this.commonService.removeCurrentUser();
    this.commonService.startOrStopLoader(false);
    //alert('Session time out');
    const modalRef = this.modal.open(ModalServiceComponent);
    modalRef.componentInstance.inputObj = {
      "heading" : "Session timeout",
      "SubmitBtn": "OK",
      "isSingleTxt": true,
      "singleTxt":"Session timeout !. Please login again."
    }
    modalRef.componentInstance.notifyParent.subscribe(() => {
      modalRef.close();
    })
    this.router.navigate(['/login']);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (err: any): Observable<T> => {

      let errorDetails: any;
      if (err && err.error && err.error.error) {
        const modalRef = this.modal.open(ModalServiceComponent);
        modalRef.componentInstance.inputObj = {
          "heading": "Error",
          "SubmitBtn": "OK",
          "isSingleTxt": true,
          "singleTxt": err.error.error
        }
        modalRef.componentInstance.notifyParent.subscribe(() => {
          modalRef.close();
        })
      } else if (err && err.error.message) {
        errorDetails = {
          'errorMessage': err.error.message,
          'errorCode': err.status
        }
      } else {
        errorDetails = {
          'errorMessage': `Something went wrong!`,
          'errorCode': err.status
        }
      }
      if (err && err.status == 401) {
        this.showTimeOutMsg();
      }
      return of(result as T);
    };
  }

}
