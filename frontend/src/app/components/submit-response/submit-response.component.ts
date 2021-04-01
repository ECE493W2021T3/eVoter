import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { COMMON } from 'src/app/helpers/common.const';
import { Poll } from 'src/app/models/poll.model';
import { Answer, VoterResponse } from 'src/app/models/response.model';

@Component({
    selector: 'app-submit-response',
    templateUrl: './submit-response.component.html',
    styleUrls: ['./submit-response.component.css']
})
export class SubmitResponseComponent implements OnInit, OnDestroy {
    public responseForm: FormGroup;
    public poll: Poll;
    public MULTIPLE_CHOICE = COMMON.questionType.multipleChoice;
    public SHORT_ANSWER = COMMON.questionType.shortAnswer;
    public submitted = false;

    private subscription: Subscription = new Subscription();

    constructor(
        private dialogRef: MatDialogRef<SubmitResponseComponent>,
        private formBuilder: FormBuilder,
        private snackBar: MatSnackBar,
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

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    // Convenience getters for easy access to form fields
    get qfa() { return this.responseForm.controls.questions as FormArray; }

    onSubmit() {
        this.submitted = true;

        if (this.responseForm.invalid || this.responseForm.pending) {
            return;
        }

        if (this.poll.deadline.getTime() <= new Date().getTime()) {
            this.snackBar.open('Failed to submit response. The poll deadline has already passed', '', {
                duration: 5000,
                verticalPosition: 'top',
                panelClass: ['error-snackbar']
            });

            this.dialogRef.close();
            return;
        }
        
        const model = {
            pollID: this.poll._id,
            answers: this.qfa.value.map(item => {
                return {
                    question: item.question,
                    answer: item.response
                } as Answer;
            })
        } as VoterResponse;


    }
}
