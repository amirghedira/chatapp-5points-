import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TokenInterceptorService } from './service/token-interceptor.service';
import { AuthService } from './main/auth/auth.service';
import { NavbarComponent } from './main/auth/navbar/navbar.component';
import { UserNavbarComponent } from './main/mainpage/user-navbar/user-navbar.component';
import { MainPageService } from './main/mainpage/mainpage.service';
import { AuthComponent } from './main/auth/auth.component';
import { MainPageComponent } from './main/mainpage/mainpage.component';
import { NavBarModule } from './main/auth/navbar/navbar.module';
import { CallRoomModule } from './main/callRoom/call-room.module';
import { CallRoomComponent } from './main/callRoom/call-room.component';
import { UserNavBarModule } from './main/mainpage/user-navbar/user-navbar.module';


const config: SocketIoConfig = { url: 'http://localhost:5000' };


export const AppRoutes: Routes = [

    {
        path: 'auth',
        component: AuthComponent,
        children: [
            {
                path: '',
                loadChildren:
                    './main/auth/auth.module#AuthModule',
            },
        ],

    },
    {
        path: 'room',
        loadChildren: './main/callRoom/call-room.module#CallRoomModule',

    },
    {
        path: 'chat',
        component: MainPageComponent,
        children: [
            {
                path: '',
                loadChildren: './main/mainpage/mainpage.module#MainPageModule',
            },
        ],
    },
    {
        path: '**',
        redirectTo: 'auth',
    },
];
@NgModule({
    declarations: [
        AppComponent, AuthComponent, MainPageComponent
    ],

    imports: [

        SocketIoModule.forRoot(config),
        BrowserModule,
        RouterModule.forRoot(AppRoutes, {
            useHash: false,
            scrollPositionRestoration: 'enabled',
        }),
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        NgbModule,
        NavBarModule,
        UserNavBarModule

    ],
    providers: [{
        provide: HTTP_INTERCEPTORS,
        useClass: TokenInterceptorService,
        multi: true
    },
        AuthService, MainPageService

    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
