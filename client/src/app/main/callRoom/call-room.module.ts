
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CallRoomComponent } from './call-room.component';
import { CallRoomService } from './call-room.service';
import { CommonModule } from '@angular/common';

const RoomRoutes: Routes = [

    {
        path: ':id',
        component: CallRoomComponent
    },
    {
        path: '**',
        redirectTo: '/chat/messenger'
    }
];

@NgModule({
    declarations: [
        CallRoomComponent
    ],

    imports: [

        CommonModule,
        RouterModule.forChild(RoomRoutes),
        FormsModule
    ],
    providers: [CallRoomService],
})
export class CallRoomModule { }
