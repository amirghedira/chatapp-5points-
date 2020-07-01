import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
@Injectable()
export class MessageService {

    token: string;
    constructor(private http: HttpClient) {
        this.setSesstion()

    }
    setSesstion() {
        this.token = localStorage.getItem('token')
    }

    sendMessage(destination: string, content: string) {
        const headers = new HttpHeaders().set('Authorization', this.token);

        return this.http.post('http://localhost:5000/message', { destination, content }, {
            headers: headers
        })
    }
    getChatConversation(participant: string) {

        const headers = new HttpHeaders().set('Authorization', this.token);
        return this.http.get('http://localhost:5000/message/' + participant, {
            headers: headers
        })

    }
}