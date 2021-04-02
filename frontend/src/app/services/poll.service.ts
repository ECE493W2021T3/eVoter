import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { InvitedPoll, Poll } from '../models/poll.model';
import { Voter } from '../models/user.model';
import { BaseService } from './base.service';

@Injectable({
    providedIn: 'root'
})
export class PollService {
    constructor(private baseService: BaseService) { }

    public createPoll(data: Poll): Observable<any> {
        return this.baseService.post('poll', data);
    }

    public getHostedPolls(): Observable<Poll[]> {
        return this.baseService.get('poll/all-hosted')
            .pipe(map((res: Object[]) => res.map(o => new Poll(o))));
    }

    public getInvitedPolls(): Observable<InvitedPoll[]> {
        return this.baseService.get('poll/all-invited')
            .pipe(map((res: Object[]) => res.map(o => new InvitedPoll(o))));
    }

    public updatePoll(pollID: string, data: any): Observable<Poll> {
        return this.baseService.patch(`poll/${pollID}`, data)
            .pipe(map(res => new Poll(res)));
    }

    public assignVotersToPoll(pollID: string, voters: Voter[]): Observable<any> {
        return this.baseService.post(`poll/${pollID}/voter-assignments`, voters);
    }

    public getAssignedVoters(pollID: string): Observable<Voter[]> {
        return this.baseService.get(`poll/${pollID}/voter-assignments`);
    }
}
