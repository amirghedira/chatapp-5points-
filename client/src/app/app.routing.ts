import { Routes } from '@angular/router';
import { signUpComponent } from './signup/signup.component'
import { AppComponent } from './app.component';
import { loginComponent } from './login/login.component';
import { mainPageComponent } from './mainpage/mainpage.component';
import { ProfileSettingsComponent } from './profileSettings/profilesettings.component';
import { CallRoomComponent } from './callRoom/call-room.component';


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
        path: 'room/:id',
        component: CallRoomComponent
    },
    {
        path: 'settings',
        component: ProfileSettingsComponent,
    },
    {
        path: '**',
        redirectTo: 'login',
    },
];