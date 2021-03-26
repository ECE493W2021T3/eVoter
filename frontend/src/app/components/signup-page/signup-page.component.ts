import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-signup-page',
    templateUrl: './signup-page.component.html',
    styleUrls: ['./signup-page.component.scss']
})
export class SignupPageComponent implements OnInit {
    public registrationForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private router: Router) { }

    ngOnInit() {
        this.registrationForm = this.formBuilder.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8)]],
            confirmPassword: ['', Validators.required],
            isHostingPolls: [false],
            is2FAEnabled: [false],
            securityQuestions: new FormArray([])
        }, { validators: this.checkPasswords });

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
        this.authService.signup(this.rf.email.value, this.rf.password.value).subscribe((res: HttpResponse<any>) => {
            console.log(res);
            this.router.navigate(['/lists']);
        });
    }

    private checkPasswords(group: FormGroup) {
        const password = group.get('password').value;
        const confirmPassword = group.get('confirmPassword').value;
        return password === confirmPassword ? null : { notSame: true }
    }
}
