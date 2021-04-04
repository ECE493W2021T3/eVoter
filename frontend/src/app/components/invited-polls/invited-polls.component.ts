import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { COMMON } from 'src/app/helpers/common.const';
import { InvitedPoll, Poll } from 'src/app/models/poll.model';
import { PollService } from 'src/app/services/poll.service';
import { SubmitResponseComponent } from '../submit-response/submit-response.component';

@Component({
    selector: 'app-invited-polls',
    templateUrl: './invited-polls.component.html',
    styleUrls: ['./invited-polls.component.css']
})
export class InvitedPollsComponent implements OnInit, OnDestroy {
    public invitedPolls: InvitedPoll[] = [];
    public ELECTION = COMMON.pollType.election;
    public SURVEY = COMMON.pollType.survey;
    public accessCode = new FormControl();

    private subscription: Subscription = new Subscription();

    constructor(
        private pollService: PollService,
        private dialog: MatDialog) { }

    ngOnInit(): void {
        this.subscription.add(this.pollService.getInvitedPolls().subscribe(invitedPolls => {
            this.invitedPolls = this.sortByDeadline(invitedPolls);
        }));
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    onAccessCodeSearch() {
        console.log(this.accessCode.value)
    }

    openSubmitResponsePage(invitedPoll: InvitedPoll) {
        const responseDialogRef = this.dialog.open(SubmitResponseComponent, {
            minWidth: "800px",
            data: {
                id: invitedPoll.responseID,
                poll: invitedPoll.poll
            },
            disableClose: true
        });

        this.subscription.add(responseDialogRef.afterClosed().subscribe(responseID => {
            // Upon dialog close, update responseID to indicate that voter has responded
            if (responseID) {
                invitedPoll.responseID = responseID;
            }
        }));
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

    private sortByDeadline(invitedPolls: InvitedPoll[]) {
        return invitedPolls.sort((a, b) => new Date(b.poll.deadline).getTime() - new Date(a.poll.deadline).getTime());
    }
}
