import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { COMMON } from 'src/app/helpers/common.const';
import { ChartChoice, ChartData, Voted } from 'src/app/models/poll-result.model';
import { Poll } from 'src/app/models/poll.model';
import { PollService } from 'src/app/services/poll.service';
import { VoterResponseComponent } from '../voter-response/voter-response.component';

@Component({
    selector: 'app-poll-results',
    templateUrl: './poll-results.component.html',
    styleUrls: ['./poll-results.component.css']
})
export class PollResultsComponent implements OnInit, OnDestroy {
    public poll: Poll;
    public question: string;
    public choices = [];
    public chartData: ChartData[] = [];
    public voters: Voted[] = [];
    public size = [800, 300];
    public selectedQuestion = new FormControl();

    private subscription: Subscription = new Subscription();

    constructor(
        private route: ActivatedRoute,
        private pollService: PollService,
        private dialog: MatDialog) { }

    ngOnInit(): void {
        this.subscription.add(this.route.params.subscribe(params => {
            if (params.pollID) {
                this.subscription.add(this.pollService.getPoll(params.pollID).subscribe(poll => {
                    this.poll = poll;

                    this.subscription.add(this.pollService.getResults(params.pollID).subscribe(result => {
                        this.voters = result.voted;

                        for (let question of result.questions) {
                            if (question.type == COMMON.questionType.shortAnswer) {
                                continue;
                            }

                            const pollQuestion = this.poll.questions.find(x => x._id == question._id);
                            const choices = pollQuestion.choices.map(choice => {
                                return {
                                    name: choice,
                                    value: question.choices[choice] ?? 0
                                } as ChartChoice;
                            });

                            const model = {
                                questionID: question._id,
                                question: question.question,
                                choices: choices
                            } as ChartData;

                            this.chartData.push(model);
                        }

                        if (this.chartData.length > 0) {
                            // Initially populate the charts with values from the first question
                            this.selectedQuestion.setValue(this.chartData[0].questionID);
                            this.question = this.chartData[0].question;
                            this.choices = this.chartData[0].choices;
                        }
                    }));
                }));
            }
        }));
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    onQuestionChange() {
        const chartData = this.chartData.find(x => x.questionID == this.selectedQuestion.value);
        this.question = chartData.question;
        this.choices = chartData.choices;
    }

    openVoterResponseDialog(voter: Voted) {
        this.dialog.open(VoterResponseComponent, {
            minWidth: "600px",
            data: {
                voter: voter,
                poll: this.poll
            }
        });
    }
}
