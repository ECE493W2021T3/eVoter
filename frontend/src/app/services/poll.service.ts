import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

    public getHostedPolls(hostID: string): Observable<Poll[]> {
        return this.baseService.get(`poll/all/${hostID}`);
    }
}
