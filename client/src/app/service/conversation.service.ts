import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable()
export class ConversationService {

    token: string;
    constructor(private http: HttpClient) {
        this.setSesstion()

    }
    setSesstion() {
        this.token = sessionStorage.getItem('token')
    }

    sendMessage(conversationId: string, content: string) {
        const headers = new HttpHeaders().set('Authorization', this.token);

        return this.http.post('http://localhost:5000/conversation', { conversationId, content }, {
            headers: headers
        })
    }
    getUserConversations() {
        const headers = new HttpHeaders().set('Authorization', this.token);

        return this.http.get('http://localhost:5000/conversation', {
            headers: headers
        })
    }
    searchAllUsers(term: string) {
        const headers = new HttpHeaders().set('Authorization', this.token);

        return this.http.get(`http://localhost:5000/user/search-users?term=${term}`, {
            headers: headers
        })
    }
    createConversation(destUserid: string) {
        const headers = new HttpHeaders().set('Authorization', this.token);

        return this.http.post('http://localhost:5000/conversation/conversation', { destination: destUserid }, {
            headers: headers
        })

    }
    getChatConversation(conversationId: string) {

        const headers = new HttpHeaders().set('Authorization', this.token);
        return this.http.get('http://localhost:5000/conversation/' + conversationId, {
            headers: headers
        })

    }
    markMessageAsRead(userDest: string, messageId: string) {
        const headers = new HttpHeaders().set('Authorization', this.token);
        return this.http.patch('http://localhost:5000/conversation/message/' + messageId, { userDest }, {
            headers: headers
        })
    }
}