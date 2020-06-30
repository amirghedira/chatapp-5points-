import { Routes } from '@angular/router';
import { registerComponent } from '../app/register/register.component'
import { AppComponent } from './app.component';
import { loginComponent } from './login/login.component';
import { mainPageComponent } from './mainpage/mainpage.component';


export const AppRoutes: Routes = [

    {
        path: 'register',
        component: registerComponent,

    },
    {
        path: 'login',
        component: loginComponent,

    },
    {
        path: 'home',
        component: AppComponent,

    },
    {
        path: 'main',
        component: mainPageComponent,

    },

    {
        path: '**',
        redirectTo: 'home',
    },
];