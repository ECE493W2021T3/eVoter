import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { shareReplay, tap } from 'rxjs/operators';
import { BaseService } from './base.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUserSubject: BehaviorSubject<string>;
    public currentUser: Observable<string>;

    constructor(
        private baseService: BaseService,
        private router: Router,
        private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<string>(localStorage.getItem("user-id"));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    login(email: string, password: string) {
        return this.baseService.auth('users/login', { email, password }).pipe(
            shareReplay(),
            tap((res: HttpResponse<any>) => {
                // the auth tokens will be in the header of this response
                this.setSession(res.body._id, res.headers.get('x-access-token'), res.headers.get('x-refresh-token'));
                console.log("LOGGED IN!");
            })
        );
    }

    signup(data: User): Observable<any> {
        return this.baseService.auth('users', data).pipe(
            shareReplay(),
            tap(res => {
                // the auth tokens will be in the header of this response
                this.setSession(res.body._id, res.headers.get('x-access-token'), res.headers.get('x-refresh-token'));
                console.log("Successfully signed up and now logged in!");
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
                '_id': localStorage.getItem('user-id')
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

    private setSession(userID: string, accessToken: string, refreshToken: string) {
        localStorage.setItem('user-id', userID);
        localStorage.setItem('x-access-token', accessToken);
        localStorage.setItem('x-refresh-token', refreshToken);
        this.currentUserSubject.next(userID);
    }

    private removeSession() {
        localStorage.removeItem('user-id');
        localStorage.removeItem('x-access-token');
        localStorage.removeItem('x-refresh-token');
        this.currentUserSubject.next(null);
    }
}
