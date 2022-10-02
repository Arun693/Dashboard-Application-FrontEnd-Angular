import { Component, OnInit } from '@angular/core';

import { Router, RoutesRecognized } from '@angular/router';
import { filter, pairwise } from 'rxjs/operators';
import { CommonServiceService } from '../../common-service.service';

@Component({
  selector: 'back-cmp',
  templateUrl: './back-cmp.component.html',
  styleUrls: ['./back-cmp.component.css']
})
export class BackCmpComponent implements OnInit {

  previousURL!: string;

  constructor(private router: Router, 
              private commonService: CommonServiceService) { }

  ngOnInit() {
    this.router.events
      .pipe(filter((e: any) => e instanceof RoutesRecognized),
        pairwise()
      ).subscribe((e: any) => {
        if(e[0].urlAfterRedirects) {
          this.commonService.setCurrentState(e[0].urlAfterRedirects)
        }
      });
  }

  back() {
    let currentState = this.commonService.getCurrentState()
    this.router.navigate([currentState]);
  }

}
