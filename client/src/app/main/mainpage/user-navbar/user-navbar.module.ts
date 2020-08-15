import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserNavbarComponent } from './user-navbar.component';

@NgModule({
    declarations: [
        UserNavbarComponent
    ],

    imports: [


        RouterModule,
        FormsModule,
        CommonModule,

    ],
    exports: [UserNavbarComponent]
})
export class UserNavBarModule { }
