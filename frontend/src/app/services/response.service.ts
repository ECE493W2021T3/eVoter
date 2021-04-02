import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VoterResponse } from '../models/response.model';
import { BaseService } from './base.service';

@Injectable({
    providedIn: 'root'
})
export class ResponseService {
    constructor(private baseService: BaseService) { }

    public createResponse(data: VoterResponse): Observable<any> {
        return this.baseService.post('response', data);
    }

    public updateResponse(responseID: string, data: any): Observable<any> {
        return this.baseService.patch(`response/${responseID}`, data);
    }

    public getResponse(responseID: string): Observable<VoterResponse> {
        return this.baseService.get(`response/${responseID}`);
    }
}
