import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class BaseService {
    public readonly ROOT_URL: string;

    constructor(private http: HttpClient) {
        this.ROOT_URL = 'http://localhost:3000';
    }

    public get(url: string) {
        return this.http.get(`${this.ROOT_URL}/${url}`);
    }

    public post(url: string, data: Object) {
        return this.http.post(`${this.ROOT_URL}/${url}`, data);
    }
    
    public patch(url: string, data: Object) {
        return this.http.patch(`${this.ROOT_URL}/${url}`, data);
    }
    
    public delete(url: string) {
        return this.http.delete(`${this.ROOT_URL}/${url}`);
    }

    public login(email: string, password: string) {
        return this.http.post(`${this.ROOT_URL}/users/login`, {
            email,
            password
        }, {
            observe: 'response'
        });
    }
    
    public signup(email: string, password: string) {
        return this.http.post(`${this.ROOT_URL}/users`, {
            email,
            password
        }, {
            observe: 'response'
        });
    }
}