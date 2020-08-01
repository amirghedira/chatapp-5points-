import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { UserService } from '../service/user.service';
import { ConversationService } from '../service/conversation.service';
import { Router } from '@angular/router';
import { switchMap, distinctUntilChanged, debounceTime } from 'rxjs/operators'
import { Observable } from 'rxjs';
import * as moment from 'moment';
import Swal from 'sweetalert2';
moment.locale('fr')


@Component({
    selector: 'app-mainpage',
    templateUrl: './mainpage.component.html',
    styleUrls: ['./mainpage.component.css']
})

export class mainPageComponent implements OnInit, OnDestroy {


    users: any;
    connectedUser: any;
    currentMessage: string;
    userConversations: any;
    searchTerms: string;
    searchedUsers: any;
    searchObs: Observable<string>;
    conversationMsgs: any;
    selectedProfileInfo: boolean;
    loading: boolean;
    loadingMessages: boolean;
    currentConversation: any;
    selectedConversation: boolean;
    focusConversation: {};
    loadingSearch: boolean;
    destinationUser: number;
    imagesToSend: any;
    fileUpload: File;
    //modals
    openBlockMsgModal: boolean;
    openIgnoreMessages: boolean;
    openEditPseudoModal: boolean;
    openPseudoModal: boolean;
    openColorsModal: boolean;


    constructor(private UserService: UserService, private conversationService: ConversationService, private router: Router) {

        this.search = this.search.bind(this)
        this.openBlockMsgModal = false;
        this.openIgnoreMessages = false;
        this.openEditPseudoModal = false;
        this.openPseudoModal = false;
        this.openColorsModal = false;
        this.fileUpload = null;
        this.imagesToSend = [];
        this.currentMessage = '';
        this.selectedProfileInfo = false;
        this.searchTerms = '';
        this.loading = true;
        this.loadingSearch = false;
        this.focusConversation = {};
        this.loadingMessages = true;
        this.UserService.newUserAdded().subscribe((newuser) => {
            this.users = [...this.users, newuser]

        });
        this.UserService.userHasConnected()
            .subscribe(userid => {
                console.log('connected')
                this.userConversations.forEach(conversation => {

                    const userIndex = conversation.users.findIndex(user => user._id == userid)
                    if (userIndex != -1) {
                        conversation.users[userIndex].connection = { status: true }
                    }

                });
            })

        this.UserService.userHasDisconnected()
            .subscribe((data: any) => {
                this.userConversations.forEach(conversation => {
                    const userIndex = conversation.users.findIndex(user => user._id == data.userid)
                    if (userIndex != -1) {
                        conversation.users[userIndex].connection = { status: false, lastVisit: data.lastVisit }
                    }
                });
            })


        this.UserService.seenMessage()
            .subscribe((newMessage: any) => {
                const conversationIndex = this.userConversations.findIndex(conversation => {
                    const conversationMessages = conversation.messages.map(message => message._id)
                    return conversationMessages.includes(newMessage._id)
                })
                const messageIndex = this.userConversations[conversationIndex].messages.findIndex(message => newMessage._id == message._id)
                this.userConversations[conversationIndex].messages[messageIndex] = newMessage;

            })
        this.UserService.newMessage()
            .subscribe((newConversation: any) => {
                const conversationIndex = this.userConversations.findIndex(userConversation => userConversation._id == newConversation._id)
                if (conversationIndex != -1) {
                    if (this.currentConversation._id == this.userConversations[conversationIndex]._id) {
                        this.currentConversation = newConversation;
                    }
                    this.userConversations.splice(conversationIndex, 1)
                    this.userConversations.unshift(newConversation)
                }
                else
                    this.userConversations.unshift(newConversation)

            });

    }
    formatSeenDate(date: string) {
        const nowDate = new Date();
        const _Date = new Date(date)
        if (nowDate.getFullYear() == _Date.getFullYear() && nowDate.getMonth() == _Date.getMonth() && nowDate.getDay() == _Date.getDay())
            return moment(new Date(date)).format('HH:mm')
        return moment(new Date(date)).format('DD MMMM YYYY à HH:mm')
    }

    TransformDateOnline(date) {

        const _Date = new Date(date);
        const _nowDate = new Date()
        const nowday = _nowDate.getDay();
        const nowyear = _nowDate.getFullYear();
        const nowhour = _nowDate.getHours();

        const day = + _Date.getDay()
        const year = + _Date.getFullYear();
        const hour = + _Date.getHours();

        if (year === nowyear && day === nowday && nowhour - hour < 12)
            return 'En ligne ' + moment(_Date).seconds(0).milliseconds(0).fromNow()
        return ""
    }
    transformDateJoin(date) {
        const _Date = new Date(date);
        const _nowDate = new Date()
        const nowYear = _nowDate.getFullYear();
        const year = + _Date.getFullYear();

        if (year == nowYear) {
            return moment(new Date(date)).format('DD MMMM')

        }
        return moment(new Date(date)).format('DD MMMM YYYY')
    }
    transformDateMessage(date) {
        const _Date = new Date(date);
        const _nowDate = new Date()
        const nowDay = _nowDate.getDay();
        const nowYear = _nowDate.getFullYear();
        const nowMonth = _nowDate.getMonth();


        const day = + _Date.getDay()
        const year = + _Date.getFullYear();
        const month = + _Date.getMonth();

        if (year == nowYear) {
            if (month == nowMonth) {

                if (day == nowDay) {

                    return moment(new Date(date)).format('HH:mm')
                }
                else if (moment(new Date(_Date)).week() == moment(new Date(_nowDate)).week()) {
                    return moment(new Date(date)).format('dddd HH:mm')
                }
            }

        }
        return moment(new Date(date)).format('DD MMMM YYYY à HH:mm')

    }
    uploadImageClicked() {
        document.getElementById('uploadimage').click()
    }
    onDeleteImage(image) {
        const imageIndex = this.imagesToSend.findIndex(img => img == image)
        this.imagesToSend.splice(imageIndex, 1)
    }
    handlefileInput(event) {
        for (let i = 0; i < event.length; i++) {

            if (event.item(i).type.includes('image')) {
                try {
                    this.fileUpload = event.item(i);
                    var reader = new FileReader();
                    reader.onload = (event: any) => {
                        this.imagesToSend.push(event.target.result);
                    };
                    reader.readAsDataURL(this.fileUpload);
                } catch (err) {
                    console.log(err)
                }
            } else {
                Swal.fire('Oops...', 'Le format incorrect', 'info');
            }
        }
    }
    showUserInfo(status) {
        this.selectedProfileInfo = status;
        this.selectedConversation = !status;
    }
    conversationDateFormat(date) {
        const _Date = new Date(date);
        const _nowDate = new Date()
        const nowDay = _nowDate.getDay();
        const nowYear = _nowDate.getFullYear();
        const nowMonth = _nowDate.getMonth();


        const day = + _Date.getDay()
        const year = + _Date.getFullYear();
        const month = + _Date.getMonth();

        if (year == nowYear) {
            if (month == nowMonth) {

                if (day == nowDay) {

                    return moment(new Date(date)).format('HH:mm')
                }
                else if (moment(new Date(_Date)).week() == moment(new Date(_nowDate)).week()) {
                    return moment(new Date(date)).format('ddd')
                }
            } else
                return moment(new Date(date)).format('DD MMM')

        }
        return moment(new Date(date)).format('DD/MM/YYYY')

    }
    ngOnInit() {
        if (this.UserService.token)
            this.UserService.getConnectUser().subscribe((result: any) => {
                this.connectedUser = result.user
                this.conversationService.getUserConversations().subscribe((response: any) => {
                    this.userConversations = response.conversations.sort((c1: any, c2: any) => {
                        const messagedate1 = c1.messages[c1.messages.length - 1].date;
                        const messagedate2 = c2.messages[c2.messages.length - 1].date;
                        return new Date(messagedate2).getTime() - new Date(messagedate1).getTime();
                    });
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
        if (this.currentConversation._id)
            this.conversationService.sendMessage(this.currentConversation._id, this.currentMessage).subscribe((response: any) => {
                this.currentMessage = '';
                this.currentConversation.messages.push(response.newMessage)

            })
        else {
            this.conversationService.createConversation(this.currentConversation.users[this.destinationUser]._id)
                .subscribe((response: any) => {
                    this.conversationService.sendMessage(response.conversation._id, this.currentMessage).subscribe((messageResponse: any) => {
                        this.currentMessage = '';
                        response.conversation.messages.push(messageResponse.newMessage)
                        this.userConversations.unshift(response.conversation)
                        this.currentConversation.messages.push(messageResponse.newMessage)

                    })

                })
        }

    }
    onOpenConvers(conversationId) {

        this.currentMessage = '';
        const conversationIndex = this.userConversations.findIndex(conversation => conversation._id == conversationId)
        this.currentConversation = this.userConversations[conversationIndex];
        this.loadingMessages = false;
        this.destinationUser = this.currentConversation.users.findIndex(user => user._id != this.connectedUser._id)
        console.log(this.userConversations[conversationIndex].users[this.destinationUser].connection)
        this.selectedConversation = true;
        this.selectedProfileInfo = false;

    }
    indexUserDest(conversationId) {//to check userconversation or currentconversation
        const index = this.userConversations.findIndex(conversation => conversation._id == conversationId);
        const indexUserDest = this.userConversations[index].users.findIndex(user => user._id != this.connectedUser._id)
        return indexUserDest
    }
    checkSenderMsg(senderid) {

        return senderid == this.connectedUser._id
    }
    activeConversation(conversationId) {
        if (this.selectedConversation) {
            if (this.currentConversation._id == conversationId) {
                return true;
            }
        }
        return false
    }
    setFocusConversation(conversationid, status) {
        this.focusConversation = { id: conversationid, status: status }
    }

    createdConversation(user) {

        this.selectedConversation = true;
        this.currentConversation = { _id: null, users: [{ ...this.connectedUser }, { ...user }], messages: [] }
        this.destinationUser = 1;
        this.loadingMessages = false;
        this.searchTerms = '';

    }
    isLastMessage(messageId: string) {

        const indexMessage = this.currentConversation.messages.findIndex(message => message._id == messageId)
        return indexMessage == this.currentConversation.messages.length - 1


    }
    messageField() {
        if (this.currentConversation.messages.length > 0) {
            const message = this.currentConversation.messages[this.currentConversation.messages.length - 1]
            if (message.sender != this.connectedUser._id)
                this.conversationService.markMessageAsRead(this.currentConversation.users[this.destinationUser]._id, message._id)
                    .subscribe(() => {
                        const msgIndex = this.currentConversation.messages.findIndex(msg => msg._id == message._id)
                        this.currentConversation.messages[msgIndex].seen.state = true;
                    })
        }
    }
    lastMessageSeen(conversationId) {
        const conversation = this.userConversations.find(conversation => conversation._id == conversationId)
        const message = conversation.messages[conversation.messages.length - 1]
        if (conversation.messages.length > 0) // to check 
            if (message.sender != this.connectedUser._id)
                return message.seen.state;
            else
                return true
        return false
    }
    showSeenPicture(conversationId) {
        const conversation = this.userConversations.find(conversation => conversation._id == conversationId)
        const message = conversation.messages[conversation.messages.length - 1]
        if (conversation.messages.length > 0) // to check 
            if (message.sender == this.connectedUser._id)
                return message.seen.state;
            else
                return false
        return false
    }

    search(text: Observable<string>) {


        this.loadingSearch = true
        text
            .pipe(
                debounceTime(500),
                distinctUntilChanged(),
                switchMap(searchTerm => {
                    return this.conversationService.searchAllUsers(searchTerm)
                })
            )
            .subscribe((response: any) => {
                this.searchedUsers = response.users.filter(user => { return user._id !== this.connectedUser._id })
                this.loadingSearch = false
            })

        return new Observable()


    }
    //modals controllers 

    onOpenBlockMsgModal(status: boolean) {

        this.openBlockMsgModal = status

    };
    onOpenIgnoreMessages(status: boolean) {

        this.openIgnoreMessages = status

    };
    onOpenEditPseudoModal(status: boolean) {
        this.openEditPseudoModal = status

    };
    onOpenPseudoModal(status: boolean) {
        this.openPseudoModal = status

    };
    onOpenColorsModal(status: boolean) {
        this.openColorsModal = status

    };

    ngOnDestroy() {
        this.users = []
    }

}