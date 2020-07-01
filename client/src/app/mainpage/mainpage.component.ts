import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../service/user.service';
import { MessageService } from '../service/message.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-mainpage',
    templateUrl: './mainpage.component.html',
    styleUrls: ['./mainpage.component.css']
})

export class mainPageComponent implements OnInit, OnDestroy {


    users: any;
    connectedUser: any;
    currentMessage: string;
    currentUserDest: any;
    conversationMsgs: any;
    loading: boolean;

    constructor(private UserService: UserService, private MessageService: MessageService, private router: Router) {

        this.loading = true;
        this.UserService.newUserAdded().subscribe((newuser) => {
            this.users = [...this.users, newuser]

        });
        this.UserService.newMessage().subscribe((newMessage) => {
            this.conversationMsgs.push(newMessage)
            console.log(newMessage)

        });

    }

    ngOnInit() {
        if (this.UserService.token)
            this.UserService.getConnectUser().subscribe((result: any) => {
                this.connectedUser = result.user
                this.UserService.getUsers().subscribe((response: any) => {
                    this.users = response.users
                    if (response.users) {
                        this.currentUserDest = response.users[0];
                        this.MessageService.getChatConversation(response.users[0]._id).subscribe((response: any) => {
                            this.conversationMsgs = response.conversationMsgs
                            this.loading = false;

                        })
                    }
                })


            })
        else
            this.router.navigate(['/login'])

    }
    checkUserAvailabe() {

        return this.users.length > 0;
    }
    onSendMessage() {
        this.MessageService.sendMessage(this.currentUserDest._id, this.currentMessage).subscribe((response: any) => {
            this.currentMessage = '';
            this.conversationMsgs = [...this.conversationMsgs, response.newMessage]
        })
    }

    onOpenConvers(user) {

        this.currentUserDest = user;
        this.MessageService.getChatConversation(this.currentUserDest._id).subscribe((response: any) => {
            console.log(response)
            this.conversationMsgs = response.conversationMsgs
        })
    }
    checkSenderMsg(senderid) {

        return senderid == this.connectedUser._id
    }

    ngOnDestroy() {
        this.users = []
    }



}