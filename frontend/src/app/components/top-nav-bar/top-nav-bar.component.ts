import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { SettingsComponent } from '../settings/settings.component';

@Component({
    selector: 'app-top-nav-bar',
    templateUrl: './top-nav-bar.component.html',
    styleUrls: ['./top-nav-bar.component.css']
})
export class TopNavBarComponent implements OnInit, OnDestroy {
    private subscription: Subscription = new Subscription();
    public title: string = "Welcome to eVoter";
    public activeUserName: string;

    constructor(
        private router: Router,
        private authService: AuthService,
        private dialog: MatDialog) { }

    ngOnInit(): void {
        // Get title from routes in app-routing-module
        this.subscription.add(this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.title = this.getDeepestTitle(this.router.routerState.snapshot.root) || this.title;
            }
        }));

        if (this.title == null || this.title == '') {
            console.log("DEBUG: this.title == null || this.title == ''")
        }

        this.subscription.add(this.authService.userProfile.subscribe(user => {
            this.activeUserName = user?.name;
        }));
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    openSettingsDialog() {
        this.dialog.open(SettingsComponent, {
            maxWidth: "600px",
            disableClose: true
        });
    }

    logout() {
        this.authService.logout();
    }

    private getDeepestTitle(routeSnapshot: ActivatedRouteSnapshot) {
        var title = routeSnapshot.data ? routeSnapshot.data['title'] : '';
        if (routeSnapshot.firstChild) {
            title = this.getDeepestTitle(routeSnapshot.firstChild) || title;
        }
        return title;
    }
}
