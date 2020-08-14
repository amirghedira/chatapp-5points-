import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Socket } from 'ngx-socket-io';


@Injectable()
export class AuthService {

    token: string;
    private userCon = new BehaviorSubject(null);
    userConnected = this.userCon.asObservable();
    private closeCallWindow = new BehaviorSubject(null);
    constructor(private http: HttpClient, private socket: Socket) {
        this.token = sessionStorage.getItem('token')
    }

    setSesstion(token) {
        this.token = token;
        sessionStorage.setItem('token', token)
        if (this.token) this.socket.emit('connectuser', this.token, window.location.href.includes('room'))


    }

    getToken() {
        return this.token;
    }

    userLogin(username: string, password: string) {

        return this.http.post('http://localhost:5000/user/login', { username, password }, {
            observe: 'response',
        })
    }
    login(user: any) {
        this.userCon.next(user);
    }

    userRegistration(data) {

        return this.http.post('http://localhost:5000/user', data, {
            observe: 'response',
        });
    }
}