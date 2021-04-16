import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { imports } from 'src/app/app.imports';
import { Poll } from 'src/app/models/poll.model';

import { PollDetailsDialogComponent } from './poll-details-dialog.component';

describe('PollDetailsDialogComponent', () => {
    let component: PollDetailsDialogComponent;
    let fixture: ComponentFixture<PollDetailsDialogComponent>;

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
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PollDetailsDialogComponent],
            imports: imports,
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: { poll: poll } },
                { provide: MatDialogRef, useValue: {} }
            ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PollDetailsDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('initially load poll details', () => {
        expect(component).toBeTruthy();
        expect(component.poll).not.toBeNull();
    });
});
