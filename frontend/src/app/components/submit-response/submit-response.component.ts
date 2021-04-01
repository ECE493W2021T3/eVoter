import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Poll } from 'src/app/models/poll.model';

@Component({
    selector: 'app-submit-response',
    templateUrl: './submit-response.component.html',
    styleUrls: ['./submit-response.component.css']
})
export class SubmitResponseComponent implements OnInit {
    public responseForm: FormGroup;
    public poll: Poll;

    constructor(
        private formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.poll = data.poll;
    }

    ngOnInit(): void {
        this.responseForm = this.formBuilder.group({
             
        });
    }

    onSubmit() {

    }
}
