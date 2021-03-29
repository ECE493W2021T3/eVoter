import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Poll } from 'src/app/models/poll.model';

@Component({
    selector: 'app-poll-details-dialog',
    templateUrl: './poll-details-dialog.component.html',
    styleUrls: ['./poll-details-dialog.component.css']
})
export class PollDetailsDialogComponent implements OnInit {
    public poll: Poll;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.poll = data.poll;
        console.log(this.poll);
    }

    ngOnInit(): void {
    }

}
