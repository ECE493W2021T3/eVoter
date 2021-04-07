import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Voted } from 'src/app/models/poll-result.model';
import { Poll } from 'src/app/models/poll.model';

@Component({
    selector: 'app-voter-response',
    templateUrl: './voter-response.component.html',
    styleUrls: ['./voter-response.component.css']
})
export class VoterResponseComponent implements OnInit, OnDestroy {
    public voter: Voted;
    public responses: any[] = [];

    private subscription: Subscription = new Subscription();
    private poll: Poll;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
        this.voter = this.data.voter;
        this.poll = this.data.poll;
    }

    ngOnInit(): void {
        this.voter.answers.forEach(answer => {
            const model = {
                question: this.poll.questions.find(x => x._id == answer.questionID).question,
                answer: answer.answer
            };

            this.responses.push(model);
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
