import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { CommonServiceService } from './common-service.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  isAllowed!: boolean;
  constructor(private commonService: CommonServiceService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;

    if (this.isAdminPage(url)) {
      if (this.isAdminAuthorised()) {
        return true;
      } else {
        this.router.navigate(['/login']);
        return false;
      }
    } else {
      if (this.isActiveUser()) {
        return true;
      } else {
        this.router.navigate(['/login']);
      }
    }
    return false;
  }

  isAdminPage(url: any) {
    return url == "/addUser" || url == "/editUser" || url == "/editDetails/:ppc" || url == '/addServer'
  }

  isAdminAuthorised() {
    return this.commonService.isAdminUser();
  }

  isActiveUser() {
    return this.commonService.isLoggedIn();
  }
}
