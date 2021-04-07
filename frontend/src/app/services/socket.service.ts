import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import io from 'socket.io-client';

@Injectable({
    providedIn: 'root'
})
export class SocketService {
    socket: any;

    constructor() {
        this.socket = io('http://localhost:3000');
    }

    listen(eventName: string) {
        return new Observable((subscriber) => {
            this.socket.on(eventName, (data) => {
                subscriber.next(data);
            });
        });
    }
}
