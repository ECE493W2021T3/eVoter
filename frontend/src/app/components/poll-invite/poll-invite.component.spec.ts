import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { imports } from 'src/app/app.imports';
import { Poll } from 'src/app/models/poll.model';
import { PollService } from 'src/app/services/poll.service';
import { UserService } from 'src/app/services/user.service';

import { PollInviteComponent } from './poll-invite.component';

describe('PollInviteComponent', () => {
    let component: PollInviteComponent;
    let fixture: ComponentFixture<PollInviteComponent>;

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
            declarations: [PollInviteComponent],
            imports: imports,
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: { poll: poll } },
                { provide: MatDialogRef, useValue: {} }
            ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PollInviteComponent);
        component = fixture.componentInstance;
    });

    it('initialize list of voters', fakeAsync(() => {
        initializeVoters();
        expect(component.invitedVoters.length == 1).toBeTruthy();
        expect(component.voterList.length == 1).toBeTruthy();
        expect(component.domainNames.length == 1).toBeTruthy();
    }));

    const initializeVoters = function() {
        let pollService = fixture.debugElement.injector.get(PollService);
        let userService = fixture.debugElement.injector.get(UserService);
        spyOn(pollService, "getAssignedVoters").and.callFake(() => {
            return of([{
                _id: 'voterID',
                email: 'voter@email.com'
            }]);
        });
        spyOn(userService, "getRegisteredVoters").and.callFake(() => {
            return of([{
                _id: 'voterID',
                email: 'voter@email.com'
            }, {
                _id: 'voterID2',
                email: 'voter2@email.com'
            }]).pipe(delay(300));
        });

        fixture.detectChanges();
        tick(300);
    };
});
