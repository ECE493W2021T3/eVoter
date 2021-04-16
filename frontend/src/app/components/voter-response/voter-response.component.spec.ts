import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { imports } from 'src/app/app.imports';
import { Voted } from 'src/app/models/poll-result.model';
import { Poll } from 'src/app/models/poll.model';

import { VoterResponseComponent } from './voter-response.component';

describe('VoterResponseComponent', () => {
    let component: VoterResponseComponent;
    let fixture: ComponentFixture<VoterResponseComponent>;

    let voter: Voted = {
        userID: 'userID',
        responseID: 'responseID',
        name: 'name',
        email: 'email@123.com',
        answers: [{
            questionID: 'questionID1',
            answer: 'myanswer'
        }, {
            questionID: 'questionID2',
            answer: 'myanswer2'
        }]
    };

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
            declarations: [VoterResponseComponent],
            imports: imports,
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: { voter: voter, poll: poll } },
                { provide: MatDialogRef, useValue: {} }
            ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(VoterResponseComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should initially load voter responses', () => {
        expect(component.responses.length == 2).toBeTruthy();
    });
});
