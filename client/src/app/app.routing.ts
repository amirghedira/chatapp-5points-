import { Routes } from '@angular/router';
import { signUpComponent } from './signup/signup.component'
import { AppComponent } from './app.component';
import { loginComponent } from './login/login.component';
import { mainPageComponent } from './mainpage/mainpage.component';


export const AppRoutes: Routes = [

    {
        path: 'signup',
        component: signUpComponent,

    },
    {
        path: 'login',
        component: loginComponent,

    },
    {
        path: 'chat',
        component: mainPageComponent,

    },
    {
        path: '**',
        redirectTo: 'login',
    },
];