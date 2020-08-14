import { SignUpPageComponent } from './signup-page/signup-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from './auth.service';
import { CommonModule } from '@angular/common';

const AuthRoutes: Routes = [

    {
        path: 'login',
        component: LoginPageComponent,

    },
    {
        path: 'signup',
        component: SignUpPageComponent,

    },
    {
        path: '**',
        redirectTo: 'login',
    },
];

@NgModule({
    declarations: [
        SignUpPageComponent, LoginPageComponent
    ],

    imports: [

        CommonModule,
        RouterModule.forChild(AuthRoutes),
        FormsModule,
        NgbModule
    ],
    providers: [AuthService],
})
export class AuthModule { }
