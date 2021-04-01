import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { COMMON } from 'src/app/helpers/common.const';
import { Poll } from 'src/app/models/poll.model';

@Component({
    selector: 'app-submit-response',
    templateUrl: './submit-response.component.html',
    styleUrls: ['./submit-response.component.css']
})
export class SubmitResponseComponent implements OnInit {
    public responseForm: FormGroup;
    public poll: Poll;
    public MULTIPLE_CHOICE = COMMON.questionType.multipleChoice;
    public SHORT_ANSWER = COMMON.questionType.shortAnswer;

    constructor(
        private formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.poll = data.poll;
    }

    ngOnInit(): void {
        this.responseForm = this.formBuilder.group({
            questions: new FormArray([])
        });

        this.poll.questions.forEach(item => {
            this.qfa.push(this.formBuilder.group({
                id: item._id,
                question: item.question,
                type: item.type,
                choices: [item.choices],
                response: ['', Validators.required]
            }));
        });
    }

    // Convenience getters for easy access to form fields
    get qfa() { return this.responseForm.controls.questions as FormArray; }

    onSubmit() {
        if (this.responseForm.invalid || this.responseForm.pending) {
            return;
        }


    }
}
