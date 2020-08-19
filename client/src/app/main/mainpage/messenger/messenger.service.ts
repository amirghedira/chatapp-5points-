import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Socket } from 'ngx-socket-io';


@Injectable()
export class MessengerService {

    token: string;
    private closeCallWindow = new BehaviorSubject(null);
    constructor(private http: HttpClient, private socket: Socket) {
        this.token = localStorage.getItem('token')
        if (this.token) this.socket.emit('connectuser', this.token, false)

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
    onCloseCallWindow() {
        return this.closeCallWindow;
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
    getUserById(userId) {
        return this.http.get(`http://localhost:5000/user/${userId}`)
    }
    setReceivedMessage(messageId: string, receptor: string) {
        return this.http.patch(`http://localhost:5000/conversation/message/received/${messageId}`, { receptor })
    }
    getConnectUser() {


        return this.http.get('http://localhost:5000/user/bytoken')
    }
    getUserConversations() {

        return this.http.get('http://localhost:5000/conversation')
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
    userIsCalling() {
        let observable = new Observable(
            (observer) => {
                this.socket.on('call-user', (userId, isVideoCall) => {
                    observer.next({ userId, isVideoCall });
                });
                return () => this.socket.disconnect();
            }
        );
        return observable;
    }
    changeConversationEmoji(convId: string, emoji: string) {
        return this.http.patch(`http://localhost:5000/conversation/emoji/${convId}`, { emoji })
    }
    deleteMessage(messageId) {
        return this.http.delete(`http://localhost:5000/conversation/message/${messageId}`)
    }
    unBlockConversation(convId: string, userid: string) {
        return this.http.patch(`http://localhost:5000/conversation/unblock/${convId}`, { userid })
    }
    archiveConversation(convId: string) {
        return this.http.patch(`http://localhost:5000/conversation/archive/${convId}`, null)
    }
    deleteConversation(convId: string) {
        return this.http.patch(`http://localhost:5000/conversation/delete/${convId}`, null)
    }
    sendMessage(conversationId: string, content: string, files: any) {
        const fd = new FormData()
        fd.append('conversationId', conversationId)
        fd.append('content', content)
        if (files) {
            for (const key of Object.keys(files)) {
                if (files[key].type.includes('image')) {
                    fd.append('images', files[key]);
                    console.log(files[key].type)
                }
                else if (files[key].type.includes('video')) {
                    fd.append('videos', files[key]);
                    console.log()
                }
            }

        }

        return this.http.post('http://localhost:5000/conversation', fd)
    }
    createConversation(destUserid: string) {

        return this.http.post('http://localhost:5000/conversation/conversation', { destination: destUserid })

    }
    endCall(userCaller, fromCaller) {
        this.socket.emit('end-call', userCaller, fromCaller)
    }
    sendVocalMessage(convId: string, file: any) {
        const fd = new FormData()
        fd.append('audio', file)
        return this.http.post('http://localhost:5000/conversation/vocal/' + convId, fd)
    }
    getConversationByUsers(userid: string) {

        return this.http.get('http://localhost:5000/conversation/byusers/' + userid)
    }
    markConversationasRead(userDest: string, conversationId: string) {
        return this.http.patch(`http://localhost:5000/conversation/message/${conversationId}`, { userDest })
    }
    changeConversationColor(convId: string, color: string) {
        return this.http.patch(`http://localhost:5000/conversation/color/${convId}`, { color })
    }
    blockUserConversation(convId: string, userid: string) {
        return this.http.patch(`http://localhost:5000/conversation/block/${convId}`, { userid })
    }
    searchAllUsers(term: string) {

        return this.http.get(`http://localhost:5000/user/search-users?term=${term}`)
    }
    changeConversationPseudo(convId: string, userid: string, content: string) {
        return this.http.patch(`http://localhost:5000/conversation/pseudos/${convId}`, { userid, content })
    }
    removeConversationPseudo(convId: string, userid) {
        return this.http.delete(`http://localhost:5000/conversation/pseudos/${convId}/${userid}`)
    }

}