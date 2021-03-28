import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { COMMON } from 'src/app/helpers/common.const';
import { Poll } from 'src/app/models/poll.model';
import { AuthService } from 'src/app/services/auth.service';
import { PollService } from 'src/app/services/poll.service';

@Component({
    selector: 'app-hosted-polls',
    templateUrl: './hosted-polls.component.html',
    styleUrls: ['./hosted-polls.component.css']
})
export class HostedPollsComponent implements OnInit, OnDestroy {
    public PRIVATE = COMMON.accessLevel.private;
    public INACTIVE = COMMON.pollStatus.inactive;
    public hostedPolls: Poll[] = [];
    public displayedColumns: string[] = [
        'title',
        'type',
        'deadline',
        'accessLevel',
        'anonimity',
        'hiddenTillDeadline',
        'canVotersSeeResults',
        'inviteVoters',
        'seePresentation',
        'endPoll'
    ];

    private subscription: Subscription = new Subscription();

    constructor(
        private authService: AuthService,
        private pollService: PollService,
        private snackBar: MatSnackBar) { }

    ngOnInit(): void {
        this.subscription.add(this.authService.currentUser.subscribe(currentUserId => {
            this.subscription.add(this.pollService.getHostedPolls(currentUserId).subscribe(polls => {
                this.hostedPolls = polls;
            }));
        }));
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    endPoll(pollID: string, index: number) {
        this.subscription.add(this.pollService.updatePollStatus(pollID, this.INACTIVE).subscribe(result => {
            this.hostedPolls[index] = result;
        }, error => {
            this.snackBar.open('Failed to end poll.', '', {
                duration: 5000,
                verticalPosition: 'top',
                panelClass: ['error-snackbar']
            });
        }));
    }

    showViewResults(poll: Poll) {
        return this.isPastDeadline(poll.deadline) || poll.status == this.INACTIVE ? true : !poll.isHiddenUntilDeadline;
    }

    isPastDeadline(deadline: Date) {
        return deadline.getTime() <= new Date().getTime();
    }
}
