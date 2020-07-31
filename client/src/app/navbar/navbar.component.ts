import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-nav',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css'],
})

export class NavbarComponent implements OnInit {

    status: boolean;
    constructor(private UserService: UserService, private router: Router) {

        this.status = false;
        this.UserService.userConnected.subscribe((token) => {

            if (token)
                this.status = true

        });
    }
    ngOnInit() {

        this.UserService.getConnectUser().subscribe((response: any) => {
            if (response.user)
                this.status = true
            else
                this.status = false

        })

    }
    onDisconnect() {
        this.UserService.disconnectUser()
            .subscribe(res => {
                this.status = false;
                this.router.navigate(['/login'])
            })
    }

}