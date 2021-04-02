import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Answer, VoterResponse } from '../models/response.model';
import { BaseService } from './base.service';

@Injectable({
    providedIn: 'root'
})
export class ResponseService {
    constructor(private baseService: BaseService) { }

    public createResponse(data: VoterResponse): Observable<any> {
        return this.baseService.post('response', data);
    }

    public updateResponse(responseID: string, answers: Answer[]) {
        return this.baseService.patch(`response/${responseID}`, { answers });
    }
}
