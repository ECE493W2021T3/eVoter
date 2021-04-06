import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PollService } from 'src/app/services/poll.service';

@Component({
    selector: 'app-poll-results',
    templateUrl: './poll-results.component.html',
    styleUrls: ['./poll-results.component.css']
})
export class PollResultsComponent implements OnInit {

    private subscription: Subscription = new Subscription();
    public pollResults:any;                 // JSON
// -----------for charts                    
    public mcq: any[];                      // Array for MCQ questions
    private choices: any;                   // Data passes to charts
    private question: string;               // Question String passed to charts
    size = [800, 600]                       // Size of Charts
// -----------for CSV
    title="title line shows in CSV sheet";  // title line shows in CSV sheet
    private questions: string[];                 // header for CSV
    private responses = [];                 // responses from Voters, shows as lines in CSV
    fileName="seriousPoll2";                // CSV file name "seriousPoll2.csv"

    constructor(
        private pollService: PollService
    ){}

    ngOnInit(): void {

        this.subscription.add(this.pollService.getPollResults("606bda054577254b10c34e04").subscribe(results => {
            this.pollResults = results;
            this.mcq = this.pollResults.questions
                            .filter(question => question.type =="Multiple Choice")
                            .map(ele => {
                                return {
                                    question: ele.question,
                                    choices: Object.entries(ele.choices)
                                                .map(choice => {
                                                        return {    name: choice[0],
                                                                    value: choice[1]
                                                        }
                                                })
                                }
                            });
            this.question = this.mcq[0].question;
            this.choices = this.mcq[0].choices;
            // ----------------------------
            this.questions = this.pollResults.questions.map(ele => ele.question);
            this.responses = this.pollResults.voted.map(ele =>{
                let result ={ voter: ele.name };
                for (let i = 0; i < ele.answers.length; i++) {
                    // The sequence of element in Object does matter, CSV libary depends on it
                    result["answer".concat(i.toString())] = ele.answers[i].answer;
                }
                return result;
            });
        }));
    }
}
