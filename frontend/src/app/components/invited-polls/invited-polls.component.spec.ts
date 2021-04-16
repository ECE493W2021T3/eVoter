import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { imports } from 'src/app/app.imports';
import { PollService } from 'src/app/services/poll.service';

import { InvitedPollsComponent } from './invited-polls.component';

describe('InvitedPollsComponent', () => {
    let component: InvitedPollsComponent;
    let fixture: ComponentFixture<InvitedPollsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [InvitedPollsComponent],
            imports: imports
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(InvitedPollsComponent);
        component = fixture.componentInstance;
    });

    it('initially load invited polls', fakeAsync(() => {
        initializePolls();
        expect(component.invitedPolls.length == 1).toBeTruthy();
    }));

    it('test past deadline', fakeAsync(() => {
        initializePolls();
        expect(component.invitedPolls.length == 1).toBeTruthy();

        const isPastDeadline = component.isPastDeadline(component.invitedPolls[0].poll.deadline);
        expect(isPastDeadline).toBeTruthy();
    }));

    it('test view results', fakeAsync(() => {
        initializePolls();
        expect(component.invitedPolls.length == 1).toBeTruthy();

        const viewResults = component.showViewResults(component.invitedPolls[0].poll);
        expect(viewResults).toBeFalse();
    }));

    it('test access code search', fakeAsync(() => {
        component.accessCode.setValue(123456);
        
        let pollService = fixture.debugElement.injector.get(PollService);
        spyOn(pollService, "getPublicPoll").and.callFake(() => {
            return of({
                poll: {
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
                },
                responseID: 'responseID'
            }).pipe(delay(300));
        });

        component.onAccessCodeSearch();

        tick(300);

        expect(component.publicPoll).not.toBeNull();
    }));

    const initializePolls = function() {
        let pollService = fixture.debugElement.injector.get(PollService);
        spyOn(pollService, "getInvitedPolls").and.callFake(() => {
            return of([{
                poll: {
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
                },
                responseID: 'responseID'
            }]).pipe(delay(300));
        });

        fixture.detectChanges();
        tick(300);
    };
});
