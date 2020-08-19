import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2'
import { AuthService } from '../auth.service';
@Component({
    selector: 'app-signup',
    templateUrl: './signup-page.component.html',
    styleUrls: ['./signup-page.component.css'],
})

export class SignUpPageComponent implements OnInit {


    username: string;
    name: string;
    surname: string;
    password: string;
    repassword: string;
    imagePreview: any;
    address: string;
    phone: string;
    showPassword: boolean;
    showRePassword: boolean;
    profileImageFile: File;

    constructor(private authService: AuthService) {
        this.imagePreview = 'assets/img/default-user.jpeg'
        this.username = '';
        this.name = '';
        this.surname = '';
        this.password = '';
        this.repassword = '';
        this.address = '';
        this.phone = '';
        this.showPassword = false;
        this.showRePassword = false;


    }

    ngOnInit() {
    }

    registerUser() {
        if (this.username.length == 0 || this.password.length == 0 || this.name.length == 0 || this.surname.length == 0 || this.repassword.length == 0) {
            return Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Some fields are required'
            })
        }
        if (this.password !== this.repassword) {
            return Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Passwords did\'t match'
            })
        }
        const fd = new FormData()
        fd.append('profileImage', this.profileImageFile)
        fd.append('username', this.username)
        fd.append('password', this.password)
        fd.append('name', this.name)
        fd.append('surname', this.surname)
        fd.append('address', this.address)
        fd.append('phone', this.phone)

        this.authService.userRegistration(fd).subscribe((response: any) => {
            Swal.fire({
                icon: 'success',
                title: 'Your account is created',
                showConfirmButton: false,
            })
        }, errorResponse => {
            if (errorResponse.status == 409)
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: errorResponse.error.message
                })
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!'
                })
            }
        })

    }
    uploadFileHandler(file) {
        try {
            var reader = new FileReader();
            reader.onload = (e: any) => {
                this.imagePreview = e.target.result;
            };
            reader.readAsDataURL(file);
            this.profileImageFile = file
        } catch (err) {
            console.log(err)
        }

    }
    showHidePassword() {
        this.showPassword = !this.showPassword
    }
    showHideRePassword() {
        this.showRePassword = !this.showRePassword
    }
}