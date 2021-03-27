import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private router: Router) { }

    // prevents the user from accessing certain components if not logged in
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.authService.currentUser.pipe(
            take(1),
            map(userID => {
                if (!userID) {
                    this.router.navigate(['/login']);
                    return false;
                }
                return true;
            })
        );
    }
}
