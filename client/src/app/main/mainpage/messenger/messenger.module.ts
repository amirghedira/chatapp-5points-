import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MessengerComponent } from './messenger.component';
import { MessengerService } from './messenger.service';
import { CommonModule } from '@angular/common';
import { AutosizeModule } from 'ngx-autosize';
import { PickerModule, EmojiFrequentlyService, EmojiSearch } from '@ctrl/ngx-emoji-mart';
import { EmojiService } from '@ctrl/ngx-emoji-mart/ngx-emoji';

const MessengerRoutes: Routes = [


    {
        path: '',
        component: MessengerComponent,

    },
    {
        path: '**',
        redirectTo: 'home',
    },
];

@NgModule({
    declarations: [
        MessengerComponent
    ],

    imports: [

        CommonModule,
        RouterModule.forChild(MessengerRoutes),
        FormsModule,
        NgbModule,
        AutosizeModule,
        PickerModule,
    ],
    providers: [MessengerService, EmojiFrequentlyService, EmojiSearch, EmojiService],
})
export class MessengerModule { }
