import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MainPageService } from './mainpage.service';
import { ProfileSettingsComponent } from './profileSettings/profilesettings.component';
import { CommonModule } from '@angular/common';

const MainPageRoutes: Routes = [

    {
        path: 'settings',
        component: ProfileSettingsComponent,

    },
    {
        path: 'messenger',
        loadChildren: './messenger/messenger.module#MessengerModule',

    },
    {
        path: '**',
        redirectTo: 'messenger',
    },
];

@NgModule({
    declarations: [
        ProfileSettingsComponent
    ],

    imports: [

        CommonModule,
        RouterModule.forChild(MainPageRoutes),
        FormsModule,
    ],
    providers: [MainPageService],
})
export class MainPageModule { }
