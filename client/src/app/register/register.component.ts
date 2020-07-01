import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2'
import { UserService } from '../service/user.service';
@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css'],
})

export class registerComponent implements OnInit {

    constructor(private userService: UserService) { }
    username: string;
    name: string;
    surname: string;
    password: string;
    repassword: string;

    ngOnInit() {
    }

    registerUser() {

        this.userService.userRegistration({
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