import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { MessageService } from '../service/message.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
})

export class loginComponent implements OnInit {

    username: string;
    password: string;
    constructor(private UserService: UserService, private MessageService: MessageService, private router: Router) { }
    ngOnInit() {
        if (localStorage.getItem('token'))
            this.router.navigate(['/chat'])
    }
    onConnect() {
        this.UserService.userLogin(this.username, this.password).subscribe(((response: any) => {
            localStorage.setItem('token', response.body.token)
            this.UserService.setSesstion()
            this.MessageService.setSesstion()
            this.UserService.login(response.body.token)
            this.router.navigate(['/chat']);
        }), (error) => {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Invalid username or password'
            })
        })

    }
}