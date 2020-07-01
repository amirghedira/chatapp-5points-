import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { registerComponent } from './register/register.component';
import { loginComponent } from './login/login.component';
import { mainPageComponent } from './mainpage/mainpage.component';
import { UserService } from './service/user.service';
import { MessageService } from './service/message.service';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
    declarations: [
        AppComponent, registerComponent, loginComponent, mainPageComponent, NavbarComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule
    ],
    providers: [UserService, MessageService],
    bootstrap: [AppComponent]
})
export class AppModule { }
