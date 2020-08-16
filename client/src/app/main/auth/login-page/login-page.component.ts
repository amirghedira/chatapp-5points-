import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { AuthService } from '../auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.css'],
})

export class LoginPageComponent implements OnInit {

    username: string;
    password: string;
    constructor(private authService: AuthService, private router: Router) { }
    ngOnInit() {
        if (localStorage.getItem('token'))
            this.router.navigate(['/chat'])
    }
    onConnect() {
        this.authService.userLogin(this.username, this.password).subscribe(((response: any) => {
            this.authService.setSesstion(response.body.token)
            this.router.navigate(['chat/messenger']);
        }), (error) => {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Invalid username or password'
            })
        })

    }
}