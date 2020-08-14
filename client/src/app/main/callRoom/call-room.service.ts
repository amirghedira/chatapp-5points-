import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Socket } from 'ngx-socket-io';


@Injectable()
export class CallRoomService {

    token: string;
    private userCon = new BehaviorSubject(null);
    userConnected = this.userCon.asObservable();
    private closeCallWindow = new BehaviorSubject(null);
    constructor(private http: HttpClient, private socket: Socket) {
    }

    startCall(roomId: string, userPeerId: string) {
        this.socket.emit('join-room', roomId, userPeerId)
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
    callUser(callerUserId, receiverUserId, isVideoCall) {
        this.socket.emit('call-user', callerUserId, receiverUserId, isVideoCall)
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
    getUserById(userId) {
        return this.http.get(`http://localhost:5000/user/${userId}`)
    }
    getConnectUser() {

        const headers = new HttpHeaders().set('Authorization', this.token);

        return this.http.get('http://localhost:5000/user/bytoken', { headers: headers })
    }
    endCall(userCaller, fromCaller) {
        this.socket.emit('end-call', userCaller, fromCaller)
    }
    setOpenCallWindow(bool) {
        this.closeCallWindow.next(bool)
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
}