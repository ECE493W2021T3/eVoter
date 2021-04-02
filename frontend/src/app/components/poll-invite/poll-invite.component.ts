import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { Poll } from 'src/app/models/poll.model';
import { Voter } from 'src/app/models/user.model';
import { PollService } from 'src/app/services/poll.service';
import { UserService } from 'src/app/services/user.service';
import { SystemInviteComponent } from '../system-invite/system-invite.component';

@Component({
    selector: 'app-poll-invite',
    templateUrl: './poll-invite.component.html',
    styleUrls: ['./poll-invite.component.css']
})
export class PollInviteComponent implements OnInit, OnDestroy {
    public votersForm: FormGroup;
    public poll: Poll;
    public invitedVoters: Voter[] = [];
    public voterList = [];
    public domainNames = [];

    private subscription: Subscription = new Subscription();

    constructor(
        private dialogRef: MatDialogRef<PollInviteComponent>,
        private formBuilder: FormBuilder,
        private snackBar: MatSnackBar,
        private userService: UserService,
        private pollService: PollService,
        private dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.poll = data.poll;
    }

    ngOnInit(): void {
        this.votersForm = this.formBuilder.group({
            voters: [[]],
            domainNames: [[]]
        });

        this.subscription.add(this.pollService.getAssignedVoters(this.poll._id).subscribe(result => {
            this.invitedVoters = result.sort((a, b) => (a.email > b.email) ? 1 : ((b.email > a.email) ? -1 : 0));

            this.subscription.add(this.userService.getRegisteredVoters().subscribe(voters => {
                const invitedVoterIDs = this.invitedVoters.map(x => x._id);
                this.voterList = voters.filter(voter => !invitedVoterIDs.includes(voter._id));
                this.voterList.sort((a, b) => (a.email > b.email) ? 1 : ((b.email > a.email) ? -1 : 0));
                this.domainNames = this.voterList
                                        .map(x => x.email.replace(/.*@/, ""))
                                        .filter((value, index, self) => self.indexOf(value) == index)
                                        .sort();
            }));
        }));
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

        var voters = this.vf.voters.value as Voter[];
        if (this.vf.domainNames.value.length > 0) {
            this.voterList.forEach(item => {
                if (!voters.includes(item) && this.vf.domainNames.value.includes(item.email.replace(/.*@/, ""))) {
                    voters.push(item);
                }
            });
        }
        
        // Send model request to backend
        this.subscription.add(this.pollService.assignVotersToPoll(this.poll._id, voters).subscribe(result => {
            this.dialogRef.close();
        }, error => {
            this.snackBar.open('Failed to invite voters.', '', {
                duration: 5000,
                verticalPosition: 'top',
                panelClass: ['error-snackbar']
            });
        }));
    }
    
    openInviteSystemDialog() {
        this.dialog.open(SystemInviteComponent, {
            minWidth: "600px",
            data: {
                registeredVoterEmails: this.voterList.map(x => x.email)
            },
            disableClose: true
        });
    }
}
