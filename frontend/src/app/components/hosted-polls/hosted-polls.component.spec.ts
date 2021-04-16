import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { imports } from 'src/app/app.imports';
import { PollService } from 'src/app/services/poll.service';

import { HostedPollsComponent } from './hosted-polls.component';

describe('HostedPollsComponent', () => {
    let component: HostedPollsComponent;
    let fixture: ComponentFixture<HostedPollsComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [HostedPollsComponent],
            imports: imports
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(HostedPollsComponent);
        component = fixture.componentInstance;
    });

    it('initially load hosted polls', fakeAsync(() => {
        initializePolls();
        expect(component.hostedPolls.length == 1).toBeTruthy();
    }));

    it('test past deadline', fakeAsync(() => {
        initializePolls();
        expect(component.hostedPolls.length == 1).toBeTruthy();

        const isPastDeadline = component.isPastDeadline(component.hostedPolls[0].deadline);
        expect(isPastDeadline).toBeTruthy();
    }));

    it('test view results', fakeAsync(() => {
        initializePolls();
        expect(component.hostedPolls.length == 1).toBeTruthy();

        const viewResults = component.showViewResults(component.hostedPolls[0]);
        expect(viewResults).toBeTruthy();
    }));

    const initializePolls = function() {
        let pollService = fixture.debugElement.injector.get(PollService);
        spyOn(pollService, "getHostedPolls").and.callFake(() => {
            return of([{
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
            }]).pipe(delay(300));
        });

        fixture.detectChanges();
        tick(300);
    };
});
