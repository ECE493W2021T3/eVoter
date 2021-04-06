import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { COMMON } from 'src/app/helpers/common.const';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-login-page',
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit, OnDestroy {
    public loginForm: FormGroup;

    private subscription: Subscription = new Subscription();

    constructor(
        private formBuilder: FormBuilder,
        private snackBar: MatSnackBar,
        private authService: AuthService,
        private userService: UserService,
        private route: ActivatedRoute,
        private router: Router) { }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });

        this.subscription.add(this.route.params.subscribe(params => {
            if (params.confirmationCode) {
                this.subscription.add(this.userService.confirmEmail(params.confirmationCode).subscribe(result => {
                    this.snackBar.open('Thank you for confirming your email. Please login now.', '', {
                        duration: 5000,
                        verticalPosition: 'top',
                        panelClass: ['success-snackbar']
                      });
                }));
            }
        }));
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    // Convenience getter for easy access to form fields
    get lf() { return this.loginForm.controls; }

    onSubmit() {
        if (this.loginForm.invalid || this.loginForm.pending) {
            return;
        }

        this.subscription.add(this.authService.login(this.lf.email.value, this.lf.password.value).subscribe((res: HttpResponse<any>) => {
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
          if (error.error === "User not confirmed.") {
              this.snackBar.open('User is required to confirm registration email before logging in. Please confirm using the link in the email and try again.', '', {
                duration: 5000,
                verticalPosition: 'top',
                panelClass: ['error-snackbar']
              });
          } else {
              this.snackBar.open('User with entered credentials does not exist. Please try again.', '', {
                duration: 5000,
                verticalPosition: 'top',
                panelClass: ['error-snackbar']
              });
          }
        }));
    }
}
