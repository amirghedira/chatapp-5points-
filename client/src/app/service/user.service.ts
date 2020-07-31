import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Socket } from 'ngx-socket-io';


@Injectable()
export class UserService {

    token: string;
    private userCon = new BehaviorSubject(null);
    userConnected = this.userCon.asObservable();
    constructor(private http: HttpClient, private socket: Socket) {
        this.setSesstion()
    }

    setSesstion() {
        this.token = sessionStorage.getItem('token')
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
    seenMessage() {
        let observable = new Observable(
            (observer) => {
                this.socket.on('seen-message', (data) => {
                    observer.next(data);
                });
                return () => this.socket.disconnect();
            }
        );
        return observable;
    }
    userHasConnected() {
        let observable = new Observable(
            (observer) => {
                this.socket.on('user-connected', (data) => {
                    console.log(data)
                    observer.next(data);
                });
                return () => this.socket.disconnect();
            }
        );
        return observable;
    }
    userHasDisconnected() {
        let observable = new Observable(
            (observer) => {
                this.socket.on('user-disconnected', (data) => {
                    observer.next(data);
                });
                return () => this.socket.disconnect();
            }
        );
        return observable;
    }
    disconnectUser() {
        const headers = new HttpHeaders().set('Authorization', this.token);
        this.token = null;
        sessionStorage.clear()
        return this.http.patch('http://localhost:5000/user/disconnect', null, { headers: headers })
    }
}