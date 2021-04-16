import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { imports } from 'src/app/app.imports';
import { PollService } from 'src/app/services/poll.service';
import { CsvDownloaderComponent } from '../csv-downloader/csv-downloader.component';

import { PollResultsComponent } from './poll-results.component';

describe('PollResultsComponent', () => {
    let component: PollResultsComponent;
    let fixture: ComponentFixture<PollResultsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                PollResultsComponent,
                CsvDownloaderComponent
            ],
            imports: imports,
            providers: [
                { provide: ActivatedRoute, useValue: { params: of({ pollID: 'pollID' })} }
            ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PollResultsComponent);
        component = fixture.componentInstance;
    });

    it('should initialize poll data', fakeAsync(() => {
        initializePoll();
        expect(component).toBeTruthy();
        expect(component.chartData.length > 0).toBeTruthy();
        expect(component.selectedQuestion.value).toEqual(component.chartData[0].questionID);
        expect(component.question).toEqual(component.chartData[0].question);
        expect(component.choices).toEqual(component.chartData[0].choices);
    }));

    const initializePoll = function() {
        let pollService = fixture.debugElement.injector.get(PollService);
        spyOn(pollService, "getPoll").and.callFake(() => {
            return of({
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
            });
        });
        spyOn(pollService, "getResults").and.callFake(() => {
            return of({
                pollID: 'pollID',
                questions: [{
                    _id: 'questionID1',
                    type: 'Multiple Choice',
                    question: 'question 1',
                    choices: ['myanswer', 'myanswer2'],
                    answers: ['myanswer']
                }, {
                    _id: 'questionID2',
                    type: 'Short Answer',
                    question: 'question 2',
                    choices: ['myanswer2'],
                    answers: ['myanswer2']
                }],
                voted: [{
                    userID: 'userID',
                    responseID: 'responseID',
                    name: 'Name',
                    email: 'voter@email.com',
                    answers: [{
                        questionID: 'questionID1',
                        answer: 'myanswer'
                    }, {
                        questionID: 'questionID2',
                        answer: 'myanswer2'
                    }]
                }]
            }).pipe(delay(300));
        });

        fixture.detectChanges();
        tick(300);
    };
});
