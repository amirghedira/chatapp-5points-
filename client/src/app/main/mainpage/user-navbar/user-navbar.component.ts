import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MainPageService } from '../mainpage.service';

@Component({
    selector: 'app-usernav',
    templateUrl: './user-navbar.component.html',
    styleUrls: ['./user-navbar.component.css'],
})

export class UserNavbarComponent implements OnInit {

    status: boolean;
    loading: boolean
    currentUser: any;
    constructor(private mainPageService: MainPageService, private router: Router) {

        this.loading = true;
        this.status = false;
        this.mainPageService.userConnected.subscribe((user) => {

            if (user) {
                this.status = true
                this.currentUser = user
            }

        });
    }
    ngOnInit() {
        this.mainPageService.getConnectUser().subscribe((response: any) => {
            if (response.user)
                this.status = true
            else
                this.status = false
            this.currentUser = response.user
            this.loading = false
        })



    }
    onDisconnect() {
        this.mainPageService.disconnectUser(this.currentUser._id)
            .subscribe(res => {
                this.status = false;
                this.router.navigate(['auth/login'])
            })
    }

}