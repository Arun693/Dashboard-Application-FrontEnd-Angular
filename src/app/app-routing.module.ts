import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { AuthGuardService } from './auth-guard-service.service';

import { PortalBaseComponent } from './portal-base/portal-base.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AddDocumentComponent } from './add-document/add-document.component';
import { SearchDocumentComponent } from './search-document/search-document.component';
import { AccountManagementComponent } from './account-management/account-management.component';
import { AddUserComponent } from './add-user/add-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { EditUserDetailsComponent } from './edit-user-details/edit-user-details.component';
import { AddEditDetailsComponent } from './server-details/add-edit-details/add-edit-details.component';
import { ViewDetailsComponent } from './server-details/view-details/view-details.component';
import { CreateIncidentComponent } from './incident/create-incident/create-incident.component';
import { IncidentTrackerComponent } from './incident/incident-tracker/incident-tracker.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent},
  { path: '', component: PortalBaseComponent,
       children: [
           { path: 'home', component: LandingPageComponent ,canActivate: [ AuthGuardService ] },
           { path:'resetPassword', component: AccountManagementComponent, canActivate: [AuthGuardService]},
           { path: 'addDocument', component: AddDocumentComponent , canActivate: [ AuthGuardService ] },
           { path: 'searchDocument', component: SearchDocumentComponent , canActivate: [ AuthGuardService ] },
           { path: 'addUser', component: AddUserComponent , canActivate: [ AuthGuardService ] },
           { path: 'editUser', component: EditUserComponent, canActivate: [ AuthGuardService ]  },
           { path: 'editDetails/:ppc', component: EditUserDetailsComponent , canActivate: [ AuthGuardService ] },
           { path: 'addServer', component: AddEditDetailsComponent , canActivate: [ AuthGuardService ]},
           { path: 'viewServer', component: ViewDetailsComponent , canActivate: [ AuthGuardService ] },
           { path : 'addIncident',  component: CreateIncidentComponent, canActivate: [ AuthGuardService ]},
           { path : 'trackIncident',  component: IncidentTrackerComponent, canActivate: [ AuthGuardService ]}
        ]
  }
]
@NgModule({
  imports: [ RouterModule.forRoot(routes, { useHash: true }) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
