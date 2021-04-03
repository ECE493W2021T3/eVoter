import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-verify-tfa',
    templateUrl: './verify-tfa.component.html',
    styleUrls: ['./verify-tfa.component.css']
})
export class VerifyTfaComponent implements OnInit, OnDestroy {
    public TFAForm: FormGroup;

    private subscription: Subscription = new Subscription();

    constructor(
        private formBuilder: FormBuilder) { }

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
    }
}
