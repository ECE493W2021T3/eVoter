import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { COMMON } from 'src/app/helpers/common.const';
import { Poll } from 'src/app/models/poll.model';
import { PollService } from 'src/app/services/poll.service';
import { PollInviteComponent } from '../poll-invite/poll-invite.component';
import { PollDetailsDialogComponent } from '../poll-details-dialog/poll-details-dialog.component';

@Component({
    selector: 'app-hosted-polls',
    templateUrl: './hosted-polls.component.html',
    styleUrls: ['./hosted-polls.component.css']
})
export class HostedPollsComponent implements OnInit, OnDestroy {
    public PRIVATE = COMMON.accessLevel.private;
    public hostedPolls: Poll[] = [];

    private subscription: Subscription = new Subscription();

    constructor(
        private pollService: PollService,
        private snackBar: MatSnackBar,
        private dialog: MatDialog) { }

    ngOnInit(): void {
        this.subscription.add(this.pollService.getHostedPolls().subscribe(polls => {
            this.hostedPolls = this.sortByDeadline(polls);
        }));
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    openPollDetails(poll: Poll) {
        this.dialog.open(PollDetailsDialogComponent, {
            maxWidth: "800px",
            data: { poll: poll }
        });
    }

    openInviteVotersDialog(poll: Poll) {
        this.dialog.open(PollInviteComponent, {
            minWidth: "600px",
            data: { poll: poll },
            disableClose: true
        });
    }

    endPoll(pollID: string, index: number) {
        this.subscription.add(this.pollService.updatePoll(pollID, { deadline: new Date() }).subscribe(result => {
            this.hostedPolls[index] = result;
            this.hostedPolls = this.sortByDeadline(this.hostedPolls);
        }, error => {
            this.snackBar.open('Failed to end poll.', '', {
                duration: 5000,
                verticalPosition: 'top',
                panelClass: ['error-snackbar']
            });
        }));
    }

    showViewResults(poll: Poll) {
        return this.isPastDeadline(poll.deadline) ? true : !poll.isHiddenUntilDeadline;
    }

    isPastDeadline(deadline: Date) {
        return deadline.getTime() <= new Date().getTime();
    }

    private sortByDeadline(polls: Poll[]) {
        return polls.sort((a, b) => new Date(b.deadline).getTime() - new Date(a.deadline).getTime());
    }
}
