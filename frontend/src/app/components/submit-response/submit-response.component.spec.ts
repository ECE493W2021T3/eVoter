import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { imports } from 'src/app/app.imports';
import { Poll } from 'src/app/models/poll.model';
import { ResponseService } from 'src/app/services/response.service';

import { SubmitResponseComponent } from './submit-response.component';

describe('SubmitResponseComponent', () => {
    let component: SubmitResponseComponent;
    let fixture: ComponentFixture<SubmitResponseComponent>;

    let poll: Poll = {
        _id: 'pollID',
        title: 'title',
        type: 'Survey',
        accessLevel: 'Invite Only',
        deadline: new Date('2021-03-25T23:45:00.000Z'),
        isAnonymousModeOn: false,
        isHiddenUntilDeadline: false,
        canVotersSeeResults: false,
        questions: [{
            _id: 'questionID1',
            type: 'Multiple Choice',
            question: 'question 1',
            choices: ['myanswer', 'myanswer2']
        }, {
            _id: 'questionID2',
            type: 'Short Answer',
            question: 'question 2',
            choices: ['myanswer2']
        }],
        accessCode: ''
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SubmitResponseComponent],
            imports: imports,
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: { poll: poll } },
                { provide: MatDialogRef, useValue: {} }
            ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SubmitResponseComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('initialize questions', fakeAsync(() => {
        initializeResponse();
        expect(component).toBeTruthy();
        expect(component.qfa.length == 2).toBeTruthy();
    }));

    it('test invalid answers', fakeAsync(() => {
        initializeResponse();
        expect(component).toBeTruthy();
        expect(component.qfa.length == 2).toBeTruthy();

        const questions = component.qfa.controls;
        questions.forEach(control => {
            const c = control as FormGroup;
            c.controls.response.setValue('');
        });

        component.onSubmit();

        expect(component.responseForm.valid).toBeFalsy();
    }));

    const initializeResponse = function() {
        let responseService = fixture.debugElement.injector.get(ResponseService);
        spyOn(responseService, "getResponse").and.callFake(() => {
            return of({
                _id: "responseID",
                pollID: "pollID",
                voterID: "voterID",
                answers: [{
                    questionID: "questionID",
                    answer: "my answer"
                }]
            }).pipe(delay(300));
        });

        fixture.detectChanges();
        tick(300);
    }
});
