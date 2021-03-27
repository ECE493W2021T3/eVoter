import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    private subscription: Subscription = new Subscription();
    public currentUserID: string;

    public isExpanded = true;
    public isCollapsible = false;
    public sidenavWidth = 250;

    public routes = [
        { Icon: 'add_circle', Label: 'Create New Poll', Route: '/new-poll' },
        { Icon: 'content_paste', Label: 'My Hosted Polls', Route: '/hosted-polls' },
        { Icon: 'ballot', Label: 'Invited Polls', Route: '/invited-polls' },
        { Icon: 'bar_chart', Label: 'Poll Results', Route: '/poll-results' },
        { Icon: 'settings', Label: 'Settings', Route: '/settings' },
    ]

    constructor(private authService: AuthService) { }

    ngOnInit(): void {
        // Below triggers every time the user id changes (log in/out)
        this.subscription.add(this.authService.currentUser.subscribe(userID => {
            this.currentUserID = userID; // this is used to hide the navigation bars if user logs out
        }));
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
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
