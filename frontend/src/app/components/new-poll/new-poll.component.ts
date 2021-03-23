import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ACCESS_LEVELS, POLL_TYPES } from 'src/app/helpers/common.const';

@Component({
    selector: 'app-new-poll',
    templateUrl: './new-poll.component.html',
    styleUrls: ['./new-poll.component.css'],
    providers: [{
        provide: STEPPER_GLOBAL_OPTIONS,
        useValue: { showError: true }
    }]
})
export class NewPollComponent implements OnInit {
    public pollConfigForm: FormGroup

    public pollTypes = POLL_TYPES;
    public accessLevels = ACCESS_LEVELS;
    public minDate = new Date();

    constructor(
        private formBuilder: FormBuilder) { }

    ngOnInit(): void {
        this.pollConfigForm = this.formBuilder.group({
            title: ['', Validators.required],
            type: ['', Validators.required],
            accessLevel: ['', Validators.required],
            endDate: ['', Validators.required],
            endTime: ['', Validators.required],
            isAnonymousModeOn: [''],
            isHiddenUntilDeadline: [''],
            canVotersSeeResults: ['']
        });
    }

    // Convenience getters for easy access to form fields
    get pcf() { return this.pollConfigForm.controls; }
}
