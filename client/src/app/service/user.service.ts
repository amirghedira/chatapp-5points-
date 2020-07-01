import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as io from 'socket.io-client';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable()
export class UserService {

    token: string;
    socket: any;
    private userCon = new BehaviorSubject(null);
    userConnected = this.userCon.asObservable();
    constructor(private http: HttpClient) {
        this.socket = io('http://localhost:5000');
        this.setSesstion()
    }

    setSesstion() {
        this.token = localStorage.getItem('token')
        if (this.token) this.socket.emit('connectuser', this.token)


    }

    userRegistration(data) {

        return this.http.post('http://localhost:5000/user', data, {
            observe: 'response',
        });
    }
    getConnectUser() {

        const headers = new HttpHeaders().set('Authorization', this.token);

        return this.http.get('http://localhost:5000/user/bytoken', { headers: headers })
    }
    getUsers() {
        const headers = new HttpHeaders().set('Authorization', this.token);

        return this.http.get('http://localhost:5000/user', { headers: headers })
    }
    userLogin(username: string, password: string) {

        return this.http.post('http://localhost:5000/user/login', { username, password }, {
            observe: 'response',
        })
    }
    login(user: any) {
        this.userCon.next(user);
    }
    newUserAdded() {
        let observable = new Observable<{ newuser: {} }>(
            (observer) => {
                this.socket.on('useradded', (data) => {
                    observer.next(data);
                });
                return () => this.socket.disconnect();
            }
        );
        return observable;
    }
    newMessage() {
        let observable = new Observable(
            (observer) => {
                this.socket.on('send-message', (data) => {
                    observer.next(data);
                });
                return () => this.socket.disconnect();
            }
        );
        return observable;
    }

    disconnectUser() {
        this.token = null;
        localStorage.clear()
    }


}