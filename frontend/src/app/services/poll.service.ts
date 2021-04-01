import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Poll } from '../models/poll.model';
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
            .pipe(map((res: Object[]) => res.map(o => new Poll(o)))
        );
    }

    public getInvitedPolls(): Observable<Poll[]> {
        return this.baseService.get('poll/all-invited')
            .pipe(map((res: Object[]) => res.map(o => new Poll(o))))
    }

    public updatePoll(pollID: string, data: any): Observable<Poll> {
        return this.baseService.patch(`poll/${pollID}`, data)
            .pipe(map(res => new Poll(res)));
    }
}
