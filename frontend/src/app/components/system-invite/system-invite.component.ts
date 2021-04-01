import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-system-invite',
    templateUrl: './system-invite.component.html',
    styleUrls: ['./system-invite.component.css']
})
export class SystemInviteComponent implements OnInit, OnDestroy {
    public emailForm: FormGroup;

    private subscription: Subscription = new Subscription();
    private existingVoterList = [];

    constructor(
        private dialogRef: MatDialogRef<SystemInviteComponent>,
        private formBuilder: FormBuilder,
        private userService: UserService,
        private snackBar: MatSnackBar,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.existingVoterList = data.registeredVoterEmails;
    }

    ngOnInit(): void {
        this.emailForm = this.formBuilder.group({
            emails: [[], Validators.required]
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    // Convenience getters for easy access to form fields
    get ef() { return this.emailForm.controls; }

    onSubmit() {
        if (this.emailForm.invalid || this.emailForm.pending) {
            return;
        }

        this.subscription.add(this.userService.sendSystemRegistrationEmail(this.ef.emails.value).subscribe(result => {
            this.dialogRef.close();
        }, error => {
            this.snackBar.open('Failed to send emails to unregistered voters.', '', {
                duration: 5000,
                verticalPosition: 'top',
                panelClass: ['error-snackbar']
            });
        }));
    }
    
    addEmail(event) {
        const input = event.input;
        const value = event.value;
        
        if ((value || '').trim()) {
            this.ef.emails.setValue([...this.ef.emails.value, value.trim()]);
            this.ef.emails.updateValueAndValidity();
        }
        
        if (input) {
            input.value = '';
        }
        
        this.validateEmails();
    }
    
    removeEmail(email: string) {
        const index = this.ef.emails.value.indexOf(email);
        
        if (index >= 0) {
            this.ef.emails.value.splice(index, 1);
        }
        
        this.validateEmails();
    }

    private validateEmails() {
        const regex = /^([\w+-.%]+@[\w-.]+\.[A-Za-z]{2,4},?)+$/;
        
        var isInvalid, alreadyExists = false;
        for (const email of this.ef.emails.value) {
            if (!regex.test(email)) {
                isInvalid = true;
                break;
            } else if (this.existingVoterList.includes(email)) {
                alreadyExists = true;
                break;
            }
        }

        if (isInvalid) {
            this.ef.emails.setErrors({ invalid: true });
        } else if (alreadyExists) {
            this.ef.emails.setErrors({ exists: true });
        } else {
            this.ef.emails.setErrors(null);
        }
    }
}
