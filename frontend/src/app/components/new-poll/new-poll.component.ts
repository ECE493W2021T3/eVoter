import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ACCESS_LEVELS, COMMON, POLL_TYPES, QUESTION_TYPES } from 'src/app/helpers/common.const';
import { Poll } from 'src/app/models/poll.model';
import { Question } from 'src/app/models/question.model';
import * as moment from 'moment';
import { PollService } from 'src/app/services/poll.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-new-poll',
    templateUrl: './new-poll.component.html',
    styleUrls: ['./new-poll.component.css'],
    providers: [{
        provide: STEPPER_GLOBAL_OPTIONS,
        useValue: { showError: true }
    }]
})
export class NewPollComponent implements OnInit, OnDestroy {
    public pollConfigForm: FormGroup;
    public questionForm: FormGroup;
    public minDate = new Date();
    public pollTypes = POLL_TYPES;
    public accessLevels = ACCESS_LEVELS;
    public questionTypes = QUESTION_TYPES;
    public SURVEY = COMMON.pollType.survey;
    public ELECTION = COMMON.pollType.election;
    public MULTIPLE_CHOICE = COMMON.questionType.multipleChoice;
    public endTimeArray = [];

    private TIME_INTERVAL = 15; // time array goes up by 15 minutes;
    private SHORT_ANSWER = COMMON.questionType.shortAnswer;
    private subscription: Subscription = new Subscription();
    private oldSelectedPollType: string;
    private selectedPollType: string;

    constructor(
        private formBuilder: FormBuilder,
        private snackBar: MatSnackBar,
        private router: Router,
        private pollService: PollService) { }

    ngOnInit(): void {
        this.pollConfigForm = this.formBuilder.group({
            title: ['', Validators.required],
            type: ['', Validators.required],
            accessLevel: ['', Validators.required],
            endDate: ['', Validators.required],
            endTime: [{ value: '', disabled: true }, Validators.required],
            isAnonymousModeOn: [false],
            isHiddenUntilDeadline: [false],
            canVotersSeeResults: [false]
        });

        this.questionForm = this.formBuilder.group({
            questions: new FormArray([])
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
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

        const endTime = moment(this.pcf.endTime.value, "hh:mm a");
        var deadline = moment(this.pcf.endDate.value);
        deadline.set({ hour: endTime.get('hour'), minute: endTime.get('minute'), second: endTime.get('second') });

        const model = {
            title: this.pcf.title.value,
            type: this.pcf.type.value,
            accessLevel: this.pcf.accessLevel.value,
            deadline: deadline.toDate(),
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

        this.subscription.add(this.pollService.createPoll(model).subscribe(result => {
            this.router.navigate(['/hosted-polls']);
        }, error => {
            this.snackBar.open('Failed to create poll.', '', {
                duration: 5000,
                verticalPosition: 'top',
                panelClass: ['error-snackbar']
            });
        }))
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
        // Add a choice only if the new question type is multiple choice and the choices list is empty
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

    constructEndTimeArray() {
        if (this.pcf.endDate.value == null || this.pcf.endDate.value == '') {
            this.pcf.endTime.disable();
            return;
        }

        this.endTimeArray = [];
        var selectedEndDate = new Date(this.pcf.endDate.value);

        // If selected end date is today, start the array from the nearest time minute interval from current time. Else, start the array from 12am
        const startTimeMinutes = selectedEndDate.setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0)
                ? this.getRoundedTimeDifference()
                : 0;

        var hours, minutes, ampm, time;
        for(var i = startTimeMinutes; i < 1440; i += this.TIME_INTERVAL) {
            minutes = i % 60;
            if (minutes < 10) minutes += '0';

            hours = Math.floor(i / 60);
            ampm = hours % 24 < 12 ? 'AM' : 'PM';
            hours = hours % 12;
            if (hours === 0) hours = 12;

            time = hours + ':' + minutes + ' ' + ampm;
            this.endTimeArray.push({ value: time, display: time });
        }

        this.pcf.endTime.enable();
    }

    private getRoundedTimeDifference() {
        const today = new Date();
        const today12am = new Date(today.getFullYear(), today.getMonth(), today.getDate());

		const coeff = 1000 * 60 * this.TIME_INTERVAL;
        const roundedTime = new Date(Math.ceil(today.getTime() / coeff) * coeff); // Round up current time to the nearest time interval
        const diff = (roundedTime.getTime() - today12am.getTime()) / 1000 / 60; // Get minute difference from 12am to rounded time

        return Math.abs(Math.round(diff));
    }
}
