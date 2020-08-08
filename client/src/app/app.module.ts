import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AutosizeModule } from 'ngx-autosize';
import { AppComponent } from './app.component';
import { signUpComponent } from './signup/signup.component';
import { loginComponent } from './login/login.component';
import { mainPageComponent } from './mainpage/mainpage.component';
import { UserService } from './service/user.service';
import { ConversationService } from './service/conversation.service';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './navbar/navbar.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { AppRoutes } from './app.routing';
import { PickerModule, EmojiFrequentlyService, EmojiSearch } from '@ctrl/ngx-emoji-mart';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EmojiModule, EmojiComponent, EmojiService } from '@ctrl/ngx-emoji-mart/ngx-emoji';

const config: SocketIoConfig = { url: 'http://localhost:5000' };


@NgModule({
    declarations: [
        AppComponent, signUpComponent, loginComponent, mainPageComponent, NavbarComponent
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
    providers: [UserService, ConversationService, EmojiFrequentlyService, EmojiService, EmojiSearch],
    bootstrap: [AppComponent]
})
export class AppModule { }
