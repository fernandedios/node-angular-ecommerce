import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
@Injectable()

// decide if a route can be activated or not
export class AuthGuardService implements CanActivate {

  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // check login token, if logged in
    if(localStorage.getItem('token')) {
      // allow access to profile page
      return state.url.startsWith('/profile') ? true : (this.router.navigate(['/']), false);
    }
    else {
      // block access to profile page
      return state.url.startsWith('/profile') ?  (this.router.navigate(['/']), false) : true;
    }
  }

}
