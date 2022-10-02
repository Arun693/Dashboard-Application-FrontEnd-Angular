import { Component, OnInit, Input} from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { CommonServiceService } from '../common-service.service';

import { adminPages, userPages } from '../constants';
import { User } from '../model'
import { environment } from '../../environments/environment';

@Component({
  selector: 'header-component',
  templateUrl: './header-component.component.html',
  styleUrls: ['./header-component.component.css']
})
export class HeaderComponentComponent implements OnInit {

  constructor(private router:Router, private commonService: CommonServiceService) { }

  @Input() name: string;
  @Input() disable: boolean;
  userRoutes: any;
  currentUser: User;
  version: string;
  ngOnInit() {
    this.version = environment.version;
    this.commonService.currentUserEmitter.subscribe( user => {
        if(user) {
           if(user && user.role == 'admin') {
              this.userRoutes = adminPages;
           } else {
             this.userRoutes = userPages;
           }
        }
    });

    if(!this.userRoutes) {
       this.currentUser = this.commonService.getCurrentUser();
      if(this.commonService.isAdminUser()) {
         this.userRoutes = adminPages;
      } else {
        this.userRoutes = userPages;
      }
    }

  }

  logout() {
    this.commonService.removeCurrentUser();
    this.commonService.startOrStopLoader(true);
    this.commonService.logout().subscribe( 
      data => { 
        this.commonService.startOrStopLoader(false);
        this.router.navigate(['/login']);
      },
      err => {
        this.commonService.startOrStopLoader(false);
        this.router.navigate(['/login']);
      }
    )    
  }
}
