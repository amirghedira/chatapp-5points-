import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2'
import { AuthService } from '../auth.service';
@Component({
    selector: 'app-signup',
    templateUrl: './signup-page.component.html',
    styleUrls: ['./signup-page.component.css'],
})

export class SignUpPageComponent implements OnInit {

    constructor(private authService: AuthService) { }
    username: string;
    name: string;
    surname: string;
    password: string;
    repassword: string;

    ngOnInit() {
    }

    registerUser() {

        this.authService.userRegistration({
            username: this.username,
            password: this.password,
            name: this.name,
            surname: this.surname
        }).subscribe((response: any) => {
            Swal.fire({
                icon: 'success',
                title: 'Your account is created',
                showConfirmButton: false,
            })
        }, error => {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!'
            })
        })

    }
}