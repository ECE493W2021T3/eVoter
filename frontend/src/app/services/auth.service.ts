import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { shareReplay, tap } from 'rxjs/operators';
import { BaseService } from './base.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, UserProfile } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private userProfileSubject: BehaviorSubject<UserProfile>;
    public userProfile: Observable<UserProfile>;

    constructor(
        private baseService: BaseService,
        private router: Router,
        private http: HttpClient) {
        this.userProfileSubject = new BehaviorSubject<UserProfile>(JSON.parse(localStorage.getItem("userProfile")));
        this.userProfile = this.userProfileSubject.asObservable();
    }

    login(email: string, password: string) {
        return this.baseService.auth('users/login', { email, password }).pipe(
            shareReplay(),
            tap((res: HttpResponse<any>) => {
                // the auth tokens will be in the header of this response
                this.setSession(res.body, res.headers.get('x-access-token'), res.headers.get('x-refresh-token'));
                console.log("LOGGED IN!");
            })
        );
    }

    signup(data: User): Observable<any> {
        return this.baseService.auth('users', data).pipe(
            shareReplay(),
            tap(res => {
                // the auth tokens will be in the header of this response
                console.log("Successfully signed up!");
            })
        )
    }

    logout() {
        this.removeSession();
        this.router.navigate(['/login']);
    }

    getAccessToken() {
        return localStorage.getItem('x-access-token');
    }

    getNewAccessToken() {
        return this.http.get(`${this.baseService.ROOT_URL}/users/me/access-token`, {
            headers: {
                'x-refresh-token': localStorage.getItem('x-refresh-token'),
                '_id': this.userProfileSubject.value._id
            },
            observe: 'response'
        }).pipe(
            tap((res: HttpResponse<any>) => {
                this.setAccessToken(res.headers.get('x-access-token'));
            })
        );
    }

    private setAccessToken(accessToken: string) {
        localStorage.setItem('x-access-token', accessToken);
    }

    private setSession(response: any, accessToken: string, refreshToken: string) {
        const userProfile = {
            _id: response._id,
            name: response.name,
            role: response.role
        } as UserProfile;

        localStorage.setItem('userProfile', JSON.stringify(userProfile));
        localStorage.setItem('x-access-token', accessToken);
        localStorage.setItem('x-refresh-token', refreshToken);
        this.userProfileSubject.next(userProfile);
    }

    private removeSession() {
        localStorage.removeItem('userProfile');
        localStorage.removeItem('x-access-token');
        localStorage.removeItem('x-refresh-token');
        this.userProfileSubject.next(null);
    }
}
