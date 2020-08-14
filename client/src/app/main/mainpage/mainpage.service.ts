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

        const headers = new HttpHeaders().set('Authorization', this.token);

        return this.http.get('http://localhost:5000/user/bytoken', { headers: headers })
    }
    updateUserProfileImg(image) {
        const headers = new HttpHeaders().set('Authorization', this.token);
        const fd = new FormData()
        fd.append('profileImage', image)
        return this.http.patch(`http://localhost:5000/user/image/`, fd, {
            headers: headers
        })
    }
}