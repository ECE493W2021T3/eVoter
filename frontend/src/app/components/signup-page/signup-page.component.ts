import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { MyErrorStateMatcher } from 'src/app/helpers/default.error-matcher';
import { COMMON, SECURITY_QUESTION_1, SECURITY_QUESTION_2, SECURITY_QUESTION_3 } from 'src/app/helpers/common.const';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SecurityQuestion, User } from 'src/app/models/user.model';

@Component({
    selector: 'app-signup-page',
    templateUrl: './signup-page.component.html',
    styleUrls: ['./signup-page.component.scss']
})
export class SignupPageComponent implements OnInit, OnDestroy {
    public registrationForm: FormGroup;
    public matcher = new MyErrorStateMatcher();
    public securityQuestions1 = SECURITY_QUESTION_1;
    public securityQuestions2 = SECURITY_QUESTION_2;
    public securityQuestions3 = SECURITY_QUESTION_3;

    private subscription: Subscription = new Subscription();

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private snackBar: MatSnackBar) { }

    ngOnInit() {
        this.registrationForm = this.formBuilder.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            passwords: this.formBuilder.group({
                password: ['', [Validators.required, Validators.minLength(8)]],
                confirmPassword: ['']
            }, { validators: this.checkPasswords }),
            isHostingPolls: [false],
            is2FAEnabled: [false],
            securityQuestions: new FormArray([])
        });

        // Initialize three empty security question fields
        for (var i = 0; i < 3; i++) {
            this.sfa.push(this.formBuilder.group({
                question: ['', Validators.required],
                answer: ['', Validators.required]
            }));
        }
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    // Convenience getters for easy access to form fields
    get rf() { return this.registrationForm.controls; }
    get sfa() { return this.rf.securityQuestions as FormArray; }

    onSubmit() {
        if (this.registrationForm.invalid || this.registrationForm.pending) {
            return;
        }

        const model = {
            name: this.rf.name.value,
            email: this.rf.email.value,
            password: this.rf.passwords.value.password,
            role: this.rf.isHostingPolls.value ? COMMON.role.admin : COMMON.role.voter,
            is2FAEnabled: this.rf.is2FAEnabled.value,
            securityQuestions: this.sfa.value.map(item => {
                return {
                    question: item.question,
                    answer: item.answer
                } as SecurityQuestion;
            })
        } as User;

        this.subscription.add(this.authService.signup(model).subscribe(result => {
            this.router.navigate(['/login']);
        }, error =>{
            this.snackBar.open('User with entered email already exists.', '', {
                duration: 5000,
                verticalPosition: 'top',
                panelClass: ['error-snackbar']
            });
        }))
    }

    private checkPasswords(group: FormGroup) {
        return group.get('password').value === group.get('confirmPassword').value ? null : { mismatch: true }
    }
}
