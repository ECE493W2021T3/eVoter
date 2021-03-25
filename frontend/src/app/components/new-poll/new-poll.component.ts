import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ACCESS_LEVELS, COMMON, POLL_TYPES, QUESTION_TYPES } from 'src/app/helpers/common.const';

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
    public pollTypes = POLL_TYPES;
    public accessLevels = ACCESS_LEVELS;
    public questionTypes = QUESTION_TYPES;
    public minDate = new Date();

    private oldSelectedPollType: string;
    private selectedPollType: string;

    constructor(
        private formBuilder: FormBuilder) { }

    ngOnInit(): void {
        this.pollConfigForm = this.formBuilder.group({
            title: ['', Validators.required],
            type: ['', Validators.required],
            accessLevel: ['', Validators.required],
            // endDate: ['', Validators.required],
            // endTime: ['', Validators.required],
            isAnonymousModeOn: [''],
            isHiddenUntilDeadline: [''],
            canVotersSeeResults: ['']
        });

        this.questionForm = this.formBuilder.group({
            questions: new FormArray([])
        });
    }

    // Convenience getters for easy access to form fields
    get pcf() { return this.pollConfigForm.controls; }
    get qfa() { return this.questionForm.controls.questions as FormArray; }

    onPollTypeChange(event) {
        this.selectedPollType = event.value;

        // If initial poll type is empty, add a question
        if (this.oldSelectedPollType == null) {
            this.addQuestion();
            if (this.selectedPollType == COMMON.pollType.election) {
                this.addChoice(this.qfa.controls[0]);
            }
        }
        // If poll type was changed from survey to election, remove all short answer questions and questions with empty types
        else if (this.oldSelectedPollType == COMMON.pollType.survey && this.selectedPollType == COMMON.pollType.election) {
            const indices = this.qfa.value
                .map((item, index) => item.questionType == COMMON.questionType.shortAnswer || item.questionType == '' ? index : null)
                .filter(x => x != null)
                .sort((a, b) => b - a); // sort indices in descending order

            indices.forEach(index => {
                this.qfa.removeAt(index);
            });
        }

        this.oldSelectedPollType = this.selectedPollType;
    }

    onQuestionTypeChange(event, item) {
        if (event.value == COMMON.questionType.multipleChoice && item.controls.choices.length == 0) {
            this.addChoice(item);
        }
    }

    addQuestion() {
        const questionType = this.selectedPollType == COMMON.pollType.election ? COMMON.questionType.multipleChoice : '';
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
