import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { COMMON } from 'src/app/helpers/common.const';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-verify-tfa',
    templateUrl: './verify-tfa.component.html',
    styleUrls: ['./verify-tfa.component.css']
})
export class VerifyTfaComponent implements OnInit, OnDestroy {
    public TFAForm: FormGroup;

    private subscription: Subscription = new Subscription();

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private snackBar: MatSnackBar) { }

    ngOnInit(): void {
        this.TFAForm = this.formBuilder.group({
            code: ['', Validators.required]
        });
    }
    
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    // Convenience getter for easy access to form fields
    get tf() { return this.TFAForm.controls; }

    onSubmit() {
        if (this.TFAForm.invalid || this.TFAForm.pending) {
            return;
        }

        this.subscription.add(this.authService.verify2FA(this.tf.code.value).subscribe(result => {
            this.subscription.add(this.authService.userProfile.subscribe(userProfile => {
                if (userProfile) {
                    if (userProfile.role == COMMON.role.admin) {
                        this.router.navigate(['/hosted-polls']);
                    } else {
                        this.router.navigate(['/invited-polls']);
                    }
                }
            }));
        }, error => {
            this.snackBar.open('One-time passcode is invalid. Please try logging in again to generate a new code.', '', {
                duration: 5000,
                verticalPosition: 'top',
                panelClass: ['error-snackbar']
            });
        }));
    }
}
