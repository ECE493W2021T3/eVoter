import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { COMMON } from 'src/app/helpers/common.const';
import { Poll } from 'src/app/models/poll.model';
import { Answer, VoterResponse } from 'src/app/models/response.model';
import { ResponseService } from 'src/app/services/response.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

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
        private responseService: ResponseService,
        private formBuilder: FormBuilder,
        private snackBar: MatSnackBar,
        private dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.poll = data.poll;
    }

    ngOnInit(): void {
        this.responseForm = this.formBuilder.group({
            questions: new FormArray([])
        });

        if (this.data.id) {
            this.subscription.add(this.responseService.getResponse(this.data.id).subscribe(voterResponse => {
                this.addQuestionFields(voterResponse);
            }, error =>{
                this.snackBar.open('Could not retrieve voter response.', '', {
                    duration: 5000,
                    verticalPosition: 'top',
                    panelClass: ['error-snackbar']
                });
            }));
        } else {
            this.addQuestionFields(null);
        }
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

        if (this.data.id && this.poll.type == COMMON.pollType.election) {
            this.snackBar.open('Failed to submit response. Cannot edit a ballot', '', {
                duration: 5000,
                verticalPosition: 'top',
                panelClass: ['error-snackbar']
            });

            this.dialogRef.close();
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

        const modifyMsg = this.poll.type == COMMON.pollType.election ? 'cannot' : 'can still';
        const confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
                title: 'Confirm Response Submission',
                message: `Are you sure you want to submit? You ${modifyMsg} modify your response later.`,
                confirmVerb: 'Yes, submit now'
            }
        });

        this.subscription.add(confirmDialogRef.afterClosed().subscribe(confirmSubmit => {
            if (confirmSubmit) {
                const model = {
                    pollID: this.poll._id,
                    answers: this.qfa.value.map(item => {
                        return {
                            questionID: item.id,
                            answer: item.response
                        } as Answer;
                    })
                } as VoterResponse;

                if (this.data.id) {
                    this.subscription.add(this.responseService.updateResponse(this.data.id, { answers: model.answers }).subscribe(result => {
                        this.dialogRef.close();
                    }, error => {
                        this.snackBar.open('Failed to submit response.', '', {
                            duration: 5000,
                            verticalPosition: 'top',
                            panelClass: ['error-snackbar']
                        });
                    }));
                } else {
                    this.subscription.add(this.responseService.createResponse(model).subscribe(result => {
                        // result returns the created response id back to invited polls list to indicate that voter has responded
                        this.dialogRef.close(result.responseID);
                    }, error => {
                        this.snackBar.open('Failed to submit response.', '', {
                            duration: 5000,
                            verticalPosition: 'top',
                            panelClass: ['error-snackbar']
                        });
                    }));
                }
            }
        }));
    }

    private addQuestionFields(voterResponse) {
        const answers = voterResponse?.answers;

        this.poll.questions.forEach(item => {
            const foundAnswer = answers ? answers.find(x => x.questionID == item._id).answer : '';

            this.qfa.push(this.formBuilder.group({
                id: item._id,
                question: item.question,
                type: item.type,
                choices: [item.choices],
                response: [foundAnswer, Validators.required]
            }));
        });
    }
}
