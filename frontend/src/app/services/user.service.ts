import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Voter } from '../models/user.model';
import { BaseService } from './base.service';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private baseService: BaseService) { }

    public get2FAConfig(): Observable<boolean> {
        return this.baseService.get('users/me/2FA');
    }

    public getRegisteredVoters(): Observable<Voter[]> {
        return this.baseService.get('users/voters');
    }

    public update2FASetting(is2FAEnabled: boolean): Observable<any> {
        return this.baseService.patch('users/me/2FA', { is2FAEnabled });
    }
}
