import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AutosizeModule } from 'ngx-autosize';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PickerModule, EmojiFrequentlyService, EmojiSearch } from '@ctrl/ngx-emoji-mart';
import { EmojiService } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { TokenInterceptorService } from './service/token-interceptor.service';
import { MessengerModule } from './main/mainpage/messenger/messenger.module';
import { MainPageModule } from './main/mainpage/mainpage.module';
import { AuthService } from './main/auth/auth.service';
import { MessengerService } from './main/mainpage/messenger/messenger.service';
import { MainPageService } from './main/mainpage/mainpage.service';

const config: SocketIoConfig = { url: 'http://localhost:5000' };


export const AppRoutes: Routes = [

    {
        path: 'auth',
        loadChildren: './main/auth/auth.module#AuthModule'

    },
    {
        path: 'login',
        loadChildren: './main/mainpage/messenger/messenger.module#MessengerModule'

    },
    {
        path: 'room/:id',
        loadChildren: './main/callRoom/call-room.module#CallRoomModule'

    },
    {
        path: 'chat',
        loadChildren: './main/mainpage/mainpage.module#MainPageModule'
    },
    {
        path: '**',
        redirectTo: 'auth',
    },
];
@NgModule({
    declarations: [
        AppComponent
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
        AutosizeModule,
        PickerModule,
        BrowserAnimationsModule,
        NgbModule
    ],
    providers: [{
        provide: HTTP_INTERCEPTORS,
        useClass: TokenInterceptorService,
        multi: true
    }, EmojiFrequentlyService, EmojiSearch, EmojiService, AuthService, MessengerService, MainPageService,

    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
