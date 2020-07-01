import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { signUpComponent } from './signup/signup.component';
import { loginComponent } from './login/login.component';
import { mainPageComponent } from './mainpage/mainpage.component';
import { UserService } from './service/user.service';
import { MessageService } from './service/message.service';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './navbar/navbar.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
const config: SocketIoConfig = { url: 'http://localhost:5000' };


@NgModule({
    declarations: [
        AppComponent, signUpComponent, loginComponent, mainPageComponent, NavbarComponent
    ],

    imports: [
        SocketIoModule.forRoot(config),
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule
    ],
    providers: [UserService, MessageService],
    bootstrap: [AppComponent]
})
export class AppModule { }
