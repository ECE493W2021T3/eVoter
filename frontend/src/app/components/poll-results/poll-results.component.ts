import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { COMMON } from 'src/app/helpers/common.const';
import { ChartChoice, ChartData, Voted } from 'src/app/models/poll-result.model';
import { Poll } from 'src/app/models/poll.model';
import { PollService } from 'src/app/services/poll.service';
import { SocketService } from 'src/app/services/socket.service';
import { VoterResponseComponent } from '../voter-response/voter-response.component';

@Component({
    selector: 'app-poll-results',
    templateUrl: './poll-results.component.html',
    styleUrls: ['./poll-results.component.css']
})
export class PollResultsComponent implements OnInit, OnDestroy {
    public poll: Poll;
    public chartData: ChartData[] = [];
    public voters: Voted[] = [];
    public selectedQuestion = new FormControl();

    // Chart arguments
    public question: string;
    public choices = [];
    public size = [800, 300];

    // CSV arguments
    public fileName: string;
    public title: string;
    public questions: string[];
    public responses = [];

    private subscription: Subscription = new Subscription();

    constructor(
        private route: ActivatedRoute,
        private pollService: PollService,
        private socketService: SocketService,
        private dialog: MatDialog) { }

    ngOnInit(): void {
        this.subscription.add(this.socketService.listen("updateCharts").subscribe(res => {
            if (res == this.poll?._id) {
                this.updateChartData();
            }
        }));

        this.subscription.add(this.route.params.subscribe(params => {
            if (params.pollID) {
                this.subscription.add(this.pollService.getPoll(params.pollID).subscribe(poll => {
                    this.poll = poll;
                    this.fileName = this.poll.title + "_Results";
                    this.title = this.poll.title;
                    this.questions = this.poll.questions.map(x => x.question);

                    this.updateChartData();
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

    private updateChartData() {
        this.subscription.add(this.pollService.getResults(this.poll._id).subscribe(result => {
            this.chartData = [];
            this.voters = result.voted;
            this.responses = this.voters.map(ele =>{
                let result = ele.name ? { voter: ele.name } : {};
                for (let i = 0; i < ele.answers.length; i++) {
                    // The sequence of element in Object does matter, CSV libary depends on it
                    result["answer".concat(i.toString())] = ele.answers[i].answer;
                }
                return result;
            });

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
    }
}
