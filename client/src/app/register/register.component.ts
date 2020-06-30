import { Component, OnInit } from '@angular/core';
@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css'],
})

export class registerComponent implements OnInit {

    username: string;
    name: string;
    surname: string;
    password: string;
    repassword: string;

    ngOnInit() {
    }
}