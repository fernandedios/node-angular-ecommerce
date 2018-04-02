import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
@Injectable()

// decide if a route can be activated or not
export class AuthGuardService implements CanActivate {

  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // check login token
    if(localStorage.getItem('token')) {
      this.router.navigate(['/']);
      return false;
    }
    else {
      return true;
    }
  }

}
