import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Socket } from 'ngx-socket-io';


@Injectable()
export class MainPageService {

    token: string;
    private userCon = new BehaviorSubject(null);
    userConnected = this.userCon.asObservable();
    private closeCallWindow = new BehaviorSubject(null);
    constructor(private http: HttpClient, private socket: Socket) {
    }

    getConnectUser() {


        return this.http.get('http://localhost:5000/user/bytoken')
    }
    updateUserProfileImg(image) {
        const fd = new FormData()
        fd.append('profileImage', image)
        return this.http.patch(`http://localhost:5000/user/image/`, fd)
    }
    disconnectUser(userId) {
        this.token = null;
        localStorage.clear()
        return this.http.patch('http://localhost:5000/user/disconnect', { userId })
    }
}