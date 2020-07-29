import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { UserService } from '../service/user.service';
import { ConversationService } from '../service/conversation.service';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators'
import { Observable } from 'rxjs';

@Component({
    selector: 'app-mainpage',
    templateUrl: './mainpage.component.html',
    styleUrls: ['./mainpage.component.css']
})

export class mainPageComponent implements OnInit, OnDestroy {


    users: any;
    connectedUser: any;
    currentMessage: string;
    conversationIndex: any;
    userConversations: any;
    searchTerms: string;
    searchedUsers: any;
    searchObs: Observable<string>;
    conversationMsgs: any;
    loading: boolean;
    loadingMessages: boolean;
    selectedConversation: boolean;
    focusConversation: {};
    loadingSearch: boolean;
    destinationUser: number;

    constructor(private UserService: UserService, private conversationService: ConversationService, private router: Router) {

        this.search = this.search.bind(this)
        this.currentMessage = '';
        this.searchTerms = '';
        this.loading = true;
        this.loadingSearch = false;
        this.focusConversation = {};
        this.loadingMessages = true;
        this.UserService.newUserAdded().subscribe((newuser) => {
            this.users = [...this.users, newuser]

        });
        this.UserService.newMessage().subscribe((newConversation) => {
            console.log(newConversation)
            this.userConversations[this.conversationIndex] = newConversation

        });

    }

    ngOnInit() {
        if (this.UserService.token)
            this.UserService.getConnectUser().subscribe((result: any) => {
                this.connectedUser = result.user
                this.conversationService.getUserConversations().subscribe((response: any) => {
                    this.userConversations = response.conversations;
                    this.selectedConversation = false;
                    this.loading = false;
                })
            })
        else
            this.router.navigate(['/login'])

    }
    checkUserAvailabe() {

        if (this.searchTerms == '')
            return this.userConversations.length > 0;
        if (!this.loadingSearch)
            return this.searchedUsers.length > 0;
    }
    onSendMessage() {
        this.conversationService.sendMessage(this.userConversations[this.conversationIndex]._id, this.currentMessage).subscribe((response: any) => {
            this.currentMessage = '';
            this.userConversations[this.conversationIndex].messages.push(response.newMessage)

        })
    }
    onOpenConvers(conversationId) {

        this.selectedConversation = true;
        this.conversationIndex = this.userConversations.findIndex(conversation => conversation._id == conversationId)
        this.loadingMessages = false;
        this.destinationUser = this.userConversations[this.conversationIndex].users.findIndex(user => user._id != this.connectedUser._id)
    }
    indexUserDest(conversationId) {

        const index = this.userConversations.findIndex(conversation => conversation._id == conversationId);
        const indexUserDest = this.userConversations[index].users.findIndex(user => user._id != this.connectedUser._id)
        return indexUserDest
    }
    checkSenderMsg(senderid) {

        return senderid == this.connectedUser._id
    }
    activeConversation(conversationId) {
        if (this.conversationIndex) {
            if (this.userConversations[this.conversationIndex]._id == conversationId) {
                return true;
            }
        }
        return false
    }
    setFocusConversation(conversationid, status) {
        this.focusConversation = { id: conversationid, status: status }
    }

    createdConversation(userId) {
        this.conversationService.createConversation(userId)
            .subscribe((response: any) => {
                this.userConversations.push(response.conversation)
                this.onOpenConvers(response.conversation._id)
                this.searchTerms = '';

            })
    }

    messageField() {
        const message = this.userConversations[this.conversationIndex].messages[this.userConversations[this.conversationIndex].messages.length - 1]
        this.conversationService.markMessageAsRead(message._id)
            .subscribe(res => {
                const msgIndex = this.userConversations[this.conversationIndex].messages.findIndex(msg => msg._id == message._id)
                this.userConversations[this.conversationIndex].messages[msgIndex].seen = true;
            })
    }
    lastMessageSeen(conversationId) {
        const conversation = this.userConversations.find(conversation => conversation._id == conversationId)
        const message = conversation.messages[conversation.messages.length - 1]
        if (conversation.messages.length > 0) // to check 
            if (message.sender != this.connectedUser._id)
                return message.seen;
            else
                return true
        return false
    }

    search(text: Observable<string>) {
        this.loadingSearch = true
        return text
            .pipe(
                switchMap(searchTerm => {
                    return this.conversationService.searchAllUsers(searchTerm)
                })
            )
            .subscribe((response: any) => {
                this.searchedUsers = response.users.filter(user => { return user._id !== this.connectedUser._id })
                this.loadingSearch = false
            })

    }

    ngOnDestroy() {
        this.users = []
    }

}