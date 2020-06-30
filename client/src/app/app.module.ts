import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { registerComponent } from './register/register.component';
import { loginComponent } from './login/login.component';
import { mainPageComponent } from './mainpage/mainpage.component';

@NgModule({
    declarations: [
        AppComponent, registerComponent, loginComponent, mainPageComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
