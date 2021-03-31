import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MyErrorStateMatcher } from 'src/app/helpers/default.error-matcher';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
    public emailForm: FormGroup;
    public securityQuestionForm: FormGroup;
    public passwordForm: FormGroup;
    public user: User;
    public securityQuestionsValid = false;
    public matcher = new MyErrorStateMatcher();

    private subscription: Subscription = new Subscription();

    constructor(
        private formBuilder: FormBuilder,
        private userService: UserService,
        private snackBar: MatSnackBar,
        private router: Router) { }

    ngOnInit(): void {
        this.emailForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]]
        });

        this.securityQuestionForm = this.formBuilder.group({
            securityQuestions: new FormArray([])
        });

        this.passwordForm = this.formBuilder.group({
            password: ['', [Validators.required, Validators.minLength(8)]],
            confirmPassword: ['']
        }, { validators: this.checkPasswords });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    // Convenience getter for easy access to form fields
    get ef() { return this.emailForm.controls; }
    get sfa() { return this.securityQuestionForm.controls.securityQuestions as FormArray }
    get pf() { return this.passwordForm.controls; }

    onEmailSubmit() {
        if (this.emailForm.invalid || this.emailForm.pending) {
            return;
        }

        this.subscription.add(this.userService.getUserByEmail(this.ef.email.value).subscribe(user => {
            this.user = user;

            this.user.securityQuestions.forEach(securityQuestion => {
                this.sfa.push(this.formBuilder.group({
                    question: securityQuestion.question,
                    answer: ['', Validators.required]
                }));
            });
        }, error => {
            this.snackBar.open('Email was not found. Please try again.', '', {
                duration: 5000,
                verticalPosition: 'top',
                panelClass: ['error-snackbar']
            });
        }));
    }
    
    onQuestionsSubmit() {
        if (this.securityQuestionForm.invalid || this.securityQuestionForm.pending) {
            return;
        }
        
        var isValid = true;
        for (const item of this.sfa.value) {
            const answer = this.user.securityQuestions.find(x => x.question == item.question).answer;
            if (answer.toLowerCase() != item.answer.toLowerCase()) {
                isValid = false;
                break;
            }
        }

        if (isValid) {
            this.securityQuestionsValid = true;
        } else {
            this.snackBar.open('One or more of the answers to the security questions is wrong.', '', {
                duration: 5000,
                verticalPosition: 'top',
                panelClass: ['error-snackbar']
            });
        }
    }

    onPasswordSubmit() {
        if (this.passwordForm.invalid || this.passwordForm.pending) {
            return;
        }
        
        this.subscription.add(this.userService.updatePassword(this.user._id, this.pf.password.value).subscribe(result => {
            this.snackBar.open('Successfully updated password.', '', {
                duration: 5000,
                verticalPosition: 'top',
                panelClass: ['success-snackbar']
            });
            
            this.router.navigate(['/login']);
        }, error => {
            this.snackBar.open('Failed to change password.', '', {
                duration: 5000,
                verticalPosition: 'top',
                panelClass: ['error-snackbar']
            });
        }));
    }

    private checkPasswords(group: FormGroup) {
        return group.get('password').value === group.get('confirmPassword').value ? null : { mismatch: true }
    }
}
