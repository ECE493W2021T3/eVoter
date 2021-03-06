import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { Voter } from '../models/user.model';
import { BaseService } from './base.service';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private baseService: BaseService) { }

    public getUserByEmail(email: string): Observable<User> {
        return this.baseService.get(`users/by-email/${email}`);
    }
    
    public getRegisteredVoters(): Observable<Voter[]> {
        return this.baseService.get('users/voters');
    }

    public sendSystemRegistrationEmail(emails: string[]): Observable<any> {
        return this.baseService.post('users/send-registration-email', { emails });
    }

    public confirmEmail(confirmationCode: string): Observable<any> {
        return this.baseService.get(`users/confirm/${confirmationCode}`);
    }

    public get2FAConfig(): Observable<boolean> {
        return this.baseService.get('users/me/2FA');
    }

    public update2FASetting(is2FAEnabled: boolean): Observable<any> {
        return this.baseService.patch('users/me/2FA', { is2FAEnabled });
    }

    public updatePassword(userID: string, password: string): Observable<any> {
        return this.baseService.patch(`users/${userID}/change-password`, { password });
    }
}
