import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { LoadingModule, ANIMATION_TYPES } from 'ngx-loading';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { ModalModule } from 'ngx-bootstrap/modal';
// import { BsModalService } from 'ngx-bootstrap/modal';

import { UtilityModule } from './utility/utility.module';
import { IncidentModule } from './incident/incident.module';
import { ServerDetailsModule } from './server-details/server-details.module';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { CommonServiceService } from './common-service.service';
import { DropdownService } from './dropdown.service';
import { AuthGuardService } from './auth-guard-service.service';
import { SecurityService } from './security.service';

import { LoginComponent } from './login/login.component';
import { PortalBaseComponent } from './portal-base/portal-base.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { HeaderComponentComponent } from './header-component/header-component.component';
import { AddDocumentComponent } from './add-document/add-document.component';
import { SearchDocumentComponent } from './search-document/search-document.component';
import { AccountManagementComponent } from './account-management/account-management.component';
import { AddUserComponent } from './add-user/add-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { EditUserDetailsComponent } from './edit-user-details/edit-user-details.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PortalBaseComponent,
    LandingPageComponent,
    HeaderComponentComponent,
    AddDocumentComponent,
    SearchDocumentComponent,
    AccountManagementComponent,
    AddUserComponent,
    EditUserComponent,
    EditUserDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    LoadingModule.forRoot({animationType: ANIMATION_TYPES.circleSwish, primaryColour: '#71b1b7'}),
    NgbModule,
    UtilityModule,
    ServerDetailsModule,
    NgMultiSelectDropDownModule.forRoot(),
    IncidentModule,
    RouterModule
    //ModalModule.forRoot()
  ],
  providers: [
    HttpClientModule,
    CommonServiceService,
    DropdownService, 
    AuthGuardService,
    SecurityService,
    //BsModalService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
