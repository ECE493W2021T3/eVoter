import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { shareReplay, tap } from 'rxjs/operators';
import { BaseService } from './base.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private baseService: BaseService, private router: Router, private http: HttpClient) { }
  
    login(email: string, password: string) {
        return this.baseService.login(email, password).pipe(
            shareReplay(),
            tap((res: HttpResponse<any>) => {
                // the auth tokens will be in the header of this response
                this.setSession(res.body._id, res.headers.get('x-access-token'), res.headers.get('x-refresh-token'));
                console.log("LOGGED IN!");
            })
        );
    }
  
    signup(email: string, password: string) {
        return this.baseService.signup(email, password).pipe(
            shareReplay(),
            tap((res: HttpResponse<any>) => {
                // the auth tokens will be in the header of this response
                this.setSession(res.body._id, res.headers.get('x-access-token'), res.headers.get('x-refresh-token'));
                console.log("Successfully signed up and now logged in!");
            })
        );
    }
    
    logout() {
        this.removeSession();
        this.router.navigate(['/login']);
    }
  
    getAccessToken() {
        return localStorage.getItem('x-access-token');
    }
  
    getRefreshToken() {
        return localStorage.getItem('x-refresh-token');
    }
  
    getUserId() {
        return localStorage.getItem('user-id');
    }
  
    setAccessToken(accessToken: string) {
        localStorage.setItem('x-access-token', accessToken);
    }
  
    getNewAccessToken() {
        return this.http.get(`${this.baseService.ROOT_URL}/users/me/access-token`, {
            headers: {
                'x-refresh-token': this.getRefreshToken(),
                '_id': this.getUserId()
            },
            observe: 'response'
        }).pipe(
            tap((res: HttpResponse<any>) => {
                this.setAccessToken(res.headers.get('x-access-token'));
            })
        );
    }

    private setSession(userId: string, accessToken: string, refreshToken: string) {
        localStorage.setItem('user-id', userId);
        localStorage.setItem('x-access-token', accessToken);
        localStorage.setItem('x-refresh-token', refreshToken);
    }
  
    private removeSession() {
        localStorage.removeItem('user-id');
        localStorage.removeItem('x-access-token');
        localStorage.removeItem('x-refresh-token');
    }
}