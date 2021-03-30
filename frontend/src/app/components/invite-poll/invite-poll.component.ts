import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Poll } from 'src/app/models/poll.model';
import { VoterAssignment } from 'src/app/models/voter-assignment.model';
import { InviteSystemComponent } from '../invite-system/invite-system.component';

@Component({
    selector: 'app-invite-poll',
    templateUrl: './invite-poll.component.html',
    styleUrls: ['./invite-poll.component.css']
})
export class InvitePollComponent implements OnInit, OnDestroy {
    public votersForm: FormGroup;
    public poll: Poll;
    public voterList = [];
    public domainNames = [];

    private subscription: Subscription = new Subscription();

    constructor(
        private formBuilder: FormBuilder,
        private dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.poll = data.poll;
    }

    ngOnInit(): void {
        this.votersForm = this.formBuilder.group({
            voterIDs: [[]],
            domainNames: [[]]
        });

        // Get list of voters by pollID
        // this.subscription.add()

        this.voterList.sort((a, b) => (a.email > b.email) ? 1 : ((b.email > a.email) ? -1 : 0));
        this.domainNames = this.voterList
                                .map(x => x.email.replace(/.*@/, ""))
                                .filter((value, index, self) => self.indexOf(value) == index)
                                .sort();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
    
    // Convenience getters for easy access to form fields
    get vf() { return this.votersForm.controls; }

    onSubmit() {
        if (this.votersForm.invalid || this.votersForm.pending) {
            return;
        }

        var voterIDs = this.vf.voterIDs.value as string[];
        if (this.vf.domainNames.value.length > 0) {
            this.voterList.forEach(item => {
                if (!voterIDs.includes(item._id) && this.vf.domainNames.value.includes(item.email.replace(/.*@/, ""))) {
                    voterIDs.push(item._id);
                }
            });
        }

        const model = {
            pollID: this.poll._id,
            voterIDs: voterIDs
        } as VoterAssignment;
        
        // Send model request to backend
        // this.subscription.add()
    }
    
    openInviteSystemDialog() {
        this.dialog.open(InviteSystemComponent, {
            maxWidth: "800px",
            disableClose: true
        });
    }
}
