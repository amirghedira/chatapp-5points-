
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CallRoomComponent } from './call-room.component';
import { CallRoomService } from './call-room.service';
import { CommonModule } from '@angular/common';

const RoomRoutes: Routes = [

    {
        path: 'room/:id',
        component: CallRoomComponent
    },
    {
        path: '**',
        redirectTo: '/'
    }
];

@NgModule({
    declarations: [
        CallRoomComponent
    ],

    imports: [

        CommonModule,
        RouterModule.forChild(RoomRoutes),
        FormsModule,
        NgbModule
    ],
    providers: [CallRoomService],
})
export class CallRoomModule { }
