import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ACCESS_LEVELS, COMMON, POLL_TYPES, QUESTION_TYPES } from 'src/app/helpers/common.const';
import { Poll } from 'src/app/models/poll.model';
import { Question } from 'src/app/models/question.model';

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
    public pollConfigForm: FormGroup;
    public questionForm: FormGroup;
    public minDate = new Date();
    public pollTypes = POLL_TYPES;
    public accessLevels = ACCESS_LEVELS;
    public questionTypes = QUESTION_TYPES;
    public SURVEY = COMMON.pollType.survey;
    public ELECTION = COMMON.pollType.election;
    public MULTIPLE_CHOICE = COMMON.questionType.multipleChoice;

    private SHORT_ANSWER = COMMON.questionType.shortAnswer;
    private oldSelectedPollType: string;
    private selectedPollType: string;

    constructor(
        private formBuilder: FormBuilder,
        private snackBar: MatSnackBar) { }

    ngOnInit(): void {
        this.pollConfigForm = this.formBuilder.group({
            title: ['', Validators.required],
            type: ['', Validators.required],
            accessLevel: ['', Validators.required],
            // endDate: ['', Validators.required],
            // endTime: ['', Validators.required],
            isAnonymousModeOn: [false],
            isHiddenUntilDeadline: [false],
            canVotersSeeResults: [false]
        });

        this.questionForm = this.formBuilder.group({
            questions: new FormArray([])
        });
    }

    // Convenience getters for easy access to form fields
    get pcf() { return this.pollConfigForm.controls; }
    get qfa() { return this.questionForm.controls.questions as FormArray; }

    onSubmit() {
        if (this.pollConfigForm.invalid || this.pollConfigForm.pending || this.questionForm.invalid || this.questionForm.pending) {
            this.snackBar.open('Cannot submit poll due to invalid fields.', '', {
                duration: 5000,
                verticalPosition: 'top',
                panelClass: ['error-snackbar']
            });
            return;
        }

        const model = {
            title: this.pcf.title.value,
            type: this.pcf.type.value,
            accessLevel: this.pcf.accessLevel.value,
            isAnonymousModeOn: this.pcf.isAnonymousModeOn.value,
            isHiddenUntilDeadline: this.pcf.isHiddenUntilDeadline.value,
            canVotersSeeResults: this.pcf.canVotersSeeResults.value,
            questions: this.qfa.value
                .map(item => {
                    const question = {
                        question: item.question,
                        type: item.questionType
                    } as Question;

                    if (item.questionType == this.MULTIPLE_CHOICE) {
                        question.choices = item.choices.map(x => x.option);
                    }

                    return question;
                })
        } as Poll;
    }

    onPollTypeChange(event) {
        this.selectedPollType = event.value;

        // If initial poll type is empty, add a question
        if (this.oldSelectedPollType == null) {
            this.addQuestion();
            if (this.selectedPollType == this.ELECTION) {
                this.addChoice(this.qfa.controls[0]);
            }
        }
        // If poll type was changed from survey to election, remove all short answer questions and questions with empty types
        else if (this.oldSelectedPollType == this.SURVEY && this.selectedPollType == this.ELECTION) {
            const indices = this.qfa.value
                .map((item, index) => item.questionType == this.SHORT_ANSWER || item.questionType == '' ? index : null)
                .filter(x => x != null)
                .sort((a, b) => b - a); // sort indices in descending order

            indices.forEach(index => {
                this.qfa.removeAt(index);
            });
        }

        this.oldSelectedPollType = this.selectedPollType;
    }

    onQuestionTypeChange(event, item) {
        if (event.value == this.MULTIPLE_CHOICE && item.controls.choices.length == 0) {
            this.addChoice(item);
        }
    }

    addQuestion() {
        const questionType = this.selectedPollType == this.ELECTION ? this.MULTIPLE_CHOICE : '';
        this.qfa.push(this.formBuilder.group({
            question: ['', Validators.required],
            questionType: [questionType, Validators.required],
            choices: new FormArray([])
        }));
    }

    deleteQuestion(index) {
        this.qfa.removeAt(index);
    }

    addChoice(item) {
        const choices = item.controls.choices as FormArray;
        choices.push(this.formBuilder.group({
            option: ['', Validators.required]
        }));
    }

    deleteChoice(item, index) {
        var choices = item.controls.choices as FormArray;
        choices.removeAt(index);
    }
}
