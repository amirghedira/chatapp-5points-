import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Socket } from 'ngx-socket-io';


@Injectable()
export class CallRoomService {

    private closeCallWindow = new BehaviorSubject(null);
    constructor(private http: HttpClient, private socket: Socket) {

        this.socket.emit('connectuser', localStorage.getItem('token'), true)

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
    getConversationByUsers(userid: string) {

        return this.http.get('http://localhost:5000/conversation/byusers/' + userid)
    }
    logCall(conversationId, isAnsweredCall, isVideoCall) {
        return this.http.post('http://localhost:5000/conversation/call/' + conversationId, { isAnsweredCall, isVideoCall })

    }
    callUser(callerUserId, receiverUserId, isVideoCall) {
        this.socket.emit('call-user', callerUserId, receiverUserId, isVideoCall)
    }
    onCallEnded() {
        let observable = new Observable(
            (observer) => {
                this.socket.on('call-ended', (data) => {
                    console.log('hey call ended')
                    observer.next(data);
                });
                return () => this.socket.disconnect();
            }
        );
        return observable
    }
    onCameraStateChanged() {
        let observable = new Observable(
            (observer) => {
                this.socket.on('onCameraStateChange', (data) => {
                    observer.next(data);
                });
                return () => this.socket.disconnect();
            }
        );
        return observable
    }

    userOpenCloseCamera(DestUserId, action) {
        this.socket.emit('cameraOpenClose', DestUserId, action)
    }

    onCallState() {
        let observable = new Observable(
            (observer) => {
                this.socket.on('user-call-state', (data) => {
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

        return this.http.get('http://localhost:5000/user/bytoken')
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