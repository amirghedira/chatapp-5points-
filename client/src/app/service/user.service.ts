import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Socket } from 'ngx-socket-io';


@Injectable()
export class UserService {

    token: string;
    private userCon = new BehaviorSubject(null);
    userConnected = this.userCon.asObservable();
    private closeCallWindow = new BehaviorSubject(null);
    constructor(private http: HttpClient, private socket: Socket) {
        this.setSesstion()
    }

    setSesstion() {
        this.token = sessionStorage.getItem('token')
        if (this.token) this.socket.emit('connectuser', this.token, window.location.href.includes('room'))


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
    messageReceived() {
        let observable = new Observable(
            (observer) => {
                this.socket.on('message-received', (data) => {
                    observer.next(data);
                });
                return () => this.socket.disconnect();
            }
        );
        return observable;
    }
    updateUserProfileImg(image) {
        const headers = new HttpHeaders().set('Authorization', this.token);
        const fd = new FormData()
        fd.append('profileImage', image)
        return this.http.patch(`http://localhost:5000/user/image/`, fd, {
            headers: headers
        })
    }
    updateUserPassword(oldPassword, newPassword) {
        const headers = new HttpHeaders().set('Authorization', this.token);
        return this.http.patch(`http://localhost:5000/user/password/`, { oldPassword, newPassword }, {
            headers: headers
        })
    }
    updateUserInfo(user) {
        const headers = new HttpHeaders().set('Authorization', this.token);
        return this.http.patch(`http://localhost:5000/user/password/`, { ...user }, {
            headers: headers
        })
    }
    getUserById(userId) {
        return this.http.get(`http://localhost:5000/user/${userId}`)
    }
    userHasConnected() {
        let observable = new Observable(
            (observer) => {
                this.socket.on('user-connected', (data) => {
                    observer.next(data);
                });
                return () => this.socket.disconnect();
            }
        );
        return observable;
    }
    startCall(roomId: string, userPeerId: string) {
        this.socket.emit('join-room', roomId, userPeerId)
    }
    userJoiningRoom() {
        let observable = new Observable(
            (observer) => {
                this.socket.on('userConnectedToRoom', (data) => {
                    console.log(data)
                    observer.next(data);
                });
                return () => this.socket.disconnect();
            }
        );
        return observable;
    }
    userDisconnectFromRoom() {
        let observable = new Observable(
            (observer) => {
                this.socket.on('user-disconnected-from-room', (data) => {
                    console.log(data)
                    observer.next(data);
                });
                return () => this.socket.disconnect();
            }
        );
        return observable;
    }
    callUser(callerUserId, receiverUserId) {
        this.socket.emit('call-user', callerUserId, receiverUserId)
    }
    onCallEnded() {
        let observable = new Observable(
            (observer) => {
                this.socket.on('call-ended', (data) => {
                    console.log(data)
                    observer.next(data);
                });
                return () => this.socket.disconnect();
            }
        );
        return observable
    }
    onCallState() {
        let observable = new Observable(
            (observer) => {
                this.socket.on('user-call-state', (data) => {
                    console.log(data)
                    observer.next(data);
                });
                return () => this.socket.disconnect();
            }
        );
        return observable
    }
    endCall(userCaller, fromCaller) {
        this.socket.emit('end-call', userCaller, fromCaller)
    }
    userIsCalling() {
        let observable = new Observable(
            (observer) => {
                this.socket.on('call-user', (data) => {
                    observer.next(data);
                });
                return () => this.socket.disconnect();
            }
        );
        return observable;
    }
    onCloseCallWindow() {
        return this.closeCallWindow;
    }
    setOpenCallWindow(bool) {
        this.closeCallWindow.next(bool)
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