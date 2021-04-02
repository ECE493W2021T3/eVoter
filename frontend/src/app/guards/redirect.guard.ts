import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { COMMON } from '../helpers/common.const';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class RedirectGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private router: Router) { }
        
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.authService.userProfile.pipe(
            take(1),
            map(user => {
                if (user) {
                    if (user.role == COMMON.role.admin) {
                        this.router.navigate(['/hosted-polls']);
                    } else {
                        this.router.navigate(['/invited-polls']);
                    }
                    return true;
                }
                this.router.navigate(['/login']);
                return false;
            })
        );
    }
}
