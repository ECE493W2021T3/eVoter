import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { SettingsComponent } from './components/settings/settings.component';
import { COMMON } from './helpers/common.const';
import { UserProfile } from './models/user.model';
import { AuthService } from './services/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    private subscription: Subscription = new Subscription();
    public userProfile: UserProfile;
    public routes= [];
    public isExpanded = true;
    public isCollapsible = false;
    public sidenavWidth = 250;

    constructor(
        private authService: AuthService,
        private dialog: MatDialog) { }

    ngOnInit(): void {
        // Below triggers every time the user id changes (log in/out)
        this.subscription.add(this.authService.userProfile.subscribe(user => {
            this.userProfile = user; // this is used to hide the navigation bars if user logs out

            if (this.userProfile) {
                const isAdmin = this.userProfile.role == COMMON.role.admin;
                this.routes = [
                    { Icon: 'add_circle', Label: 'Create New Poll', Route: '/new-poll', IsVisible: isAdmin },
                    { Icon: 'content_paste', Label: 'My Hosted Polls', Route: '/hosted-polls', IsVisible: isAdmin },
                    { Icon: 'ballot', Label: 'Invited Polls', Route: '/invited-polls', IsVisible: !isAdmin }
                ];
            }
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

    expandSidenav() {
        if (this.isCollapsible) {
            this.isExpanded = true;
            this.sidenavWidth = 250;
        }
    }

    collapseSidenav() {
        if (this.isCollapsible) {
            this.isExpanded = false;
            this.sidenavWidth = 76;
        }
    }
}
