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

    public get<T>(url: string) {
        return this.http.get<T>(`${this.ROOT_URL}/${url}`);
    }

    public post<T>(url: string, data: Object) {
        return this.http.post<T>(`${this.ROOT_URL}/${url}`, data);
    }

    public auth<T>(url: string, data: Object) {
        return this.http.post<T>(`${this.ROOT_URL}/${url}`, data, { observe: 'response' });
    }
    
    public patch<T>(url: string, data: Object) {
        return this.http.patch<T>(`${this.ROOT_URL}/${url}`, data);
    }
}
