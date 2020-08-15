import { SignUpPageComponent } from './signup-page/signup-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
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
    ],
    providers: [AuthService]
})
export class AuthModule { }
