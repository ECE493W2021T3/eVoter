import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Poll } from 'src/app/models/poll.model';
import { PollService } from 'src/app/services/poll.service';
import { SubmitResponseComponent } from '../submit-response/submit-response.component';

@Component({
    selector: 'app-invited-polls',
    templateUrl: './invited-polls.component.html',
    styleUrls: ['./invited-polls.component.css']
})
export class InvitedPollsComponent implements OnInit, OnDestroy {
    public invitedPolls: Poll[] = [];

    private subscription: Subscription = new Subscription();

    constructor(
        private pollService: PollService,
        private dialog: MatDialog) { }

    ngOnInit(): void {
        this.subscription.add(this.pollService.getInvitedPolls().subscribe(polls => {
            this.invitedPolls = this.sortByDeadline(polls);
        }));
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    openSubmitResponsePage(poll: Poll) {
        this.dialog.open(SubmitResponseComponent, {
            minWidth: "800px",
            data: { poll: poll },
            disableClose: true
        });
    }

    showViewResults(poll: Poll) {
        if (!poll.canVotersSeeResults) {
            return false;
        }

        return this.isPastDeadline(poll.deadline) ? true : !poll.isHiddenUntilDeadline;
    }

    isPastDeadline(deadline: Date) {
        return deadline.getTime() <= new Date().getTime();
    }

    private sortByDeadline(polls: Poll[]) {
        return polls.sort((a, b) => new Date(b.deadline).getTime() - new Date(a.deadline).getTime());
    }
}
