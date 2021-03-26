import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { MyErrorStateMatcher } from 'src/app/helpers/default.error-matcher';

@Component({
    selector: 'app-signup-page',
    templateUrl: './signup-page.component.html',
    styleUrls: ['./signup-page.component.scss']
})
export class SignupPageComponent implements OnInit {
    public registrationForm: FormGroup;
    public matcher = new MyErrorStateMatcher();

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private router: Router) { }

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

    // Convenience getters for easy access to form fields
    get rf() { return this.registrationForm.controls; }
    get sfa() { return this.rf.securityQuestions as FormArray; }

    onSubmit() {
        console.log(this.rf);
        console.log(this.registrationForm.valid);
        // this.authService.signup(this.rf.email.value, this.rf.password.value).subscribe((res: HttpResponse<any>) => {
        //     console.log(res);
        //     this.router.navigate(['/lists']);
        // });
    }

    private checkPasswords(group: FormGroup) {
        return group.get('password').value === group.get('confirmPassword').value ? null : { mismatch: true }
    }
}
