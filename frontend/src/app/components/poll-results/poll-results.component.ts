import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Poll } from 'src/app/models/poll.model';
import { PollService } from 'src/app/services/poll.service';

@Component({
    selector: 'app-poll-results',
    templateUrl: './poll-results.component.html',
    styleUrls: ['./poll-results.component.css']
})
export class PollResultsComponent implements OnInit {
    public poll: Poll;
    public question: string;
    public choices = [];

    private subscription: Subscription = new Subscription();

    // choices = [
    //     {
    //         name: "Germany",
    //         value: 8940000
    //     },
    //     {
    //         name: "USA",
    //         value: 5000000
    //     },
    //     {
    //         name: "France",
    //         value: 7200000
    //     },
    //     {
    //         name: "UK",
    //         value: 6200000
    //     },
    //     {
    //         name: "Germany2",
    //         value: 8940000
    //     },
    //     {
    //         name: "USA2",
    //         value: 5000000
    //     },
    //     {
    //         name: "France2",
    //         value: 7200000
    //     },
    //     {
    //         name: "UK2",
    //         value: 6200000
    //     }
    // ];
    // question = "what is the question?";
    // size = [800, 600]

    constructor(
        private route: ActivatedRoute,
        private pollService: PollService) { }

    ngOnInit(): void {
        this.subscription.add(this.route.params.subscribe(params => {
            if (params.pollID) {
                this.subscription.add(this.pollService.getPoll(params.pollID).subscribe(poll => {
                    this.poll = poll;
                    console.log(poll);

                    this.subscription.add(this.pollService.getResults(params.pollID).subscribe(result => {
                        console.log(result)
                    }));
                }));
            }
        }));
    }

}
