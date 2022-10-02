import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonServiceService } from './common-service.service';

@Component({
  selector: 'mobile-roster',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  title = '';
  loading: boolean = false;
  loadComplete: boolean = false;
  constructor(private commonService: CommonServiceService, 
              private cd: ChangeDetectorRef,
              private router:Router) { }

  ngOnInit() {
    this.commonService.loaderStatus.subscribe( value => {
      if(this.loadComplete) {
       this.loading = value;
       this.cd.detectChanges();
      }
    });
  }

  ngAfterViewInit() {
    this.loadComplete = true;
  }

  ngOnDestroy() {
    this.commonService.loaderStatus.unsubscribe();
  }
}
