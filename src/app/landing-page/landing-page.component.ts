import { Component, OnInit } from '@angular/core';

import { CommonServiceService } from '../common-service.service';
import { adminPages, userPages } from '../constants';
import { User } from '../model'

@Component({
  selector: 'landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  isAdmin!: boolean;
  counts!: Number[];
  userRoutes: any;
  currentUser!: User;
  constructor(private commonService: CommonServiceService) { }

  ngOnInit() {
    // this.commonService.currentUserEmitter.subscribe(user => {
    //   if (user) {
    //     if (user && user.role == 'admin') {
    //       this.addCount(adminPages);
    //     } else {
    //       this.addCount(userPages);
    //     }
    //   }
    // });

    if (!this.userRoutes) {
      this.currentUser = this.commonService.getCurrentUser();
      if (this.commonService.isAdminUser()) {
        this.addCount(adminPages); 
      } else {
        this.addCount(userPages);
      }
    }
  }

  addCount(page: any) {
    this.commonService.startOrStopLoader(true);
    this.commonService.getAllCounts().subscribe(
      data => {
        this.commonService.startOrStopLoader(false);
        this.counts = data.data;
        page.forEach((obj: { name: string; count: any; }) => {
          if (obj && obj.name == 'Documents') {
            obj.count = data.data ? data.data.documents : 0;
          } else if (obj && obj.name == 'Users') {
            obj.count = data.data ? data.data.users : 0;
          } else if(obj && obj.name == 'Incidents') {
            obj.count = data.data ? data.data.incidents : 0;
          }
        });
        this.userRoutes = page;
      },
      err => {
        this.commonService.startOrStopLoader(false);
        this.userRoutes = page;
      }
    )
  }

}
