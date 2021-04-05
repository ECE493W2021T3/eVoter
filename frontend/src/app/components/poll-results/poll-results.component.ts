import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-poll-results',
    templateUrl: './poll-results.component.html',
    styleUrls: ['./poll-results.component.css']
})
export class PollResultsComponent implements OnInit {

    choices = [
        {
            name: "Germany",
            value: 8940000
        },
        {
            name: "USA",
            value: 5000000
        },
        {
            name: "France",
            value: 7200000
        },
        {
            name: "UK",
            value: 6200000
        },
        {
            name: "Germany2",
            value: 8940000
        },
        {
            name: "USA2",
            value: 5000000
        },
        {
            name: "France2",
            value: 7200000
        },
        {
            name: "UK2",
            value: 6200000
        }
    ];
    question = "what is the question?";
    size = [800, 600]
    constructor() { }

    ngOnInit(): void {
    }

}
