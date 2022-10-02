import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { ModalServiceComponent } from './utility/modal-service/modal-service.component';

import { auth, User, docUpload, incidentModal } from './model'
import { environment } from '../environments/environment';
import { endpoints } from './constants';
import { SecurityService } from './security.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
  withCredentials: true
};

@Injectable()
export class CommonServiceService {

  loaderStatus: EventEmitter<boolean> = new EventEmitter();
  loadFlag: boolean = false;
  private url: string = environment.apiURL;
  currentUserEmitter: EventEmitter<User> = new EventEmitter();
  //currentUser: User = { name: "Arun", ppc: 13987, role: "admin", isPasswordChanged: false, FBU: [1, 2] };
  currentUser! : User | any;
  currentState!: string;

  constructor(private http: HttpClient,
    private securityService: SecurityService,
    private router: Router,
    private modal: NgbModal) { }


  startOrStopLoader(flag: boolean) {
    this.loadFlag = flag;
    this.loaderStatus.next(this.loadFlag);
  }

  authenticate(data: auth): Observable<User> {
    const endUrl = this.url + endpoints.authenticate;
    return this.http.post<User>(endUrl, data, httpOptions)
      .pipe(
        tap(user => {
          this.currentUserEmitter.next(user);
          this.currentUser = user;
        })
      );
  }

  uploadDocEntry(data: docUpload) {
    const endUrl = this.url + endpoints.documentUploadEntry;
    return this.http.post<User>(endUrl, data, httpOptions).pipe(
      tap(data => console.log()),
      catchError(this.handleError('uploadDocEntry', endUrl))
    );
  }

  searchDocument(data: any) {
    const endUrl = this.url + endpoints.documentSearch;
    return this.http.post<any>(endUrl, data, httpOptions).pipe(
      tap(data => console.log()),
      catchError(this.handleError('searchDocument', endUrl))
    );
  }

  searchIncidents(data: any) {
    const endUrl = this.url + endpoints.incidentSearch;
    return this.http.post<User>(endUrl, data, httpOptions).pipe(
      tap(data => console.log()),
      catchError(this.handleError('searchDocument', endUrl))
    );
  }

  saveIncidentsExcel(data: any) {
    const endUrl = this.url + endpoints.incidentsInExcel;
    return this.http.post<any>(endUrl, data, httpOptions).pipe(
      tap(data => console.log()),
      catchError(this.handleError('saveIncidentsExcel', endUrl))
    );
  }

  downloadDoc(data: any) {
    const endUrl = this.url + endpoints.documentDownload + '/' + data.name;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'responseType': 'blob'
      })
    }
    return this.http.get(endUrl, { responseType: 'blob', withCredentials: true }).pipe(
      tap(data => console.log()),
      catchError(this.handleError('downloadDoc', endUrl))
    );
  }

  downloadDBDoc(data: any) {
    const endUrl = this.url + endpoints.secureDownload + '/' + data.name;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'responseType': 'blob'
      })
    }
    return this.http.get(endUrl, { responseType: 'blob', withCredentials: true }).pipe(
      tap(data => console.log()),
      catchError(this.handleError('downloadDoc', endUrl))
    );
  }

  deleteDocument(data: any) {
    const endUrl = this.url + endpoints.documentDelete;
    return this.http.post<User>(endUrl, data, httpOptions).pipe(
      tap(data => console.log()),
      catchError(this.handleError('deleteDocument', endUrl))
    );
  }

  deleteDBDocument(data: any) {
    const endUrl = this.url + endpoints.secureDocumentDelete;
    return this.http.post<User>(endUrl, data, httpOptions).pipe(
      tap(data => console.log()),
      catchError(this.handleError('deleteDocument', endUrl))
    );
  }

  changePassword(data: any) {
    const endUrl = this.url + endpoints.changeCredential;
    return this.http.post<User>(endUrl, data, httpOptions).pipe(
      tap(data => console.log()),
      catchError(this.handleError('changePassword', endUrl))
    );
  }

  addNewUser(data: User) {
    const endUrl = this.url + endpoints.addNewUser;
    return this.http.post<any>(endUrl, data, httpOptions).pipe(
      tap(data => console.log()),
      catchError(this.handleError('deleteDocument', endUrl))
    );
  }

  deleteUser(data: any) {
    const endUrl = this.url + endpoints.deleteUser;
    return this.http.post<User>(endUrl, data, httpOptions).pipe(
      tap(data => console.log()),
      catchError(this.handleError('deleteUser', endUrl))
    );
  }

  isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  isAdminUser() {
    return this.currentUser && this.currentUser.role == 'admin';
  }

  removeCurrentUser() {
    this.currentUser = null;
  }

  setCurrentState(state: any) {
    this.currentState = state;
  }

  getCurrentState() {
    return this.currentState ? this.currentState : '/home';
  }

  getUserDetails(param: any) {
    const endUrl = this.url + endpoints.getSIngleUser;
    return this.http.post<User>(endUrl, param, httpOptions).pipe(
      tap(data => console.log()),
      catchError(this.handleError('getUserDetails', endUrl))
    );
  }

  editUser(data: any) {
    const endUrl = this.url + endpoints.editUser;
    return this.http.post<any>(endUrl, data, httpOptions).pipe(
      tap(data => console.log()),
      catchError(this.handleError('editUser', endUrl))
    );
  }

  resetPassword(data : any) {
    const endUrl = this.url + endpoints.resetPassword;
    return this.http.post<any>(endUrl, data, httpOptions).pipe(
      tap(data => console.log()),
      catchError(this.handleError('resetPassword', endUrl))
    );
  }

  getAllCounts() {
    const endUrl = this.url + endpoints.getCounts;
    return this.http.post<any>(endUrl, '', httpOptions).pipe(
      tap(data => console.log()),
      catchError(this.handleError('getAllCounts', endUrl))
    );
  }

  saveServerInfo(data: any) {
    const endUrl = this.url + endpoints.saveServerInfo;
    return this.http.post<any>(endUrl, data, httpOptions).pipe(
      tap(data => console.log()),
      catchError(this.handleError('saveServerInfo', endUrl))
    );
  }

  getServerInfo(data: any) {
    const endUrl = this.url + endpoints.getServerInfo;
    return this.http.post<any>(endUrl, data, httpOptions).pipe(
      tap(data => console.log()),
      catchError(this.handleError('getServerInfo', endUrl))
    );
  }

  getServerForIP(data: any) {
    const endUrl = this.url + endpoints.getServerForIP;
    return this.http.post<any>(endUrl, data, httpOptions).pipe(
      tap(data => console.log()),
      catchError(this.handleError('getServerForIP', endUrl))
    );
  }

  saveIncident(data: incidentModal) {
    const endUrl = this.url + endpoints.saveIncident;
    return this.http.post<any>(endUrl, data, httpOptions).pipe(
      tap(data => console.log()),
      catchError(this.handleError('saveIncident', endUrl))
    );
  }
  
  deleteIncident(data: any) {
    const endUrl = this.url + endpoints.deleteIncident;
    return this.http.post<User>(endUrl, data, httpOptions).pipe(
      tap(data => console.log()),
      catchError(this.handleError('deleteIncident', endUrl))
    );
  }

  logout() {
    const endUrl = this.url + endpoints.logout;
    return this.http.post<any>(endUrl, '', httpOptions).pipe(
      tap(data => console.log()),
      catchError(this.handleError('logout', endUrl))
    );
  }
 
  showTimeOutMsg() {
    this.removeCurrentUser();
    this.startOrStopLoader(false);
    //alert('Session time out');
    const modalRef = this.modal.open(ModalServiceComponent);
    modalRef.componentInstance.inputObj = {
      "heading": "Session timeout",
      "SubmitBtn": "OK",
      "isSingleTxt": true,
      "singleTxt": "Session timeout !. Please login again."
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
