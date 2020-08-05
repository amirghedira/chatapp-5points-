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
    selectedUserPseudoIndex: number;
    enteredPseudo: string;
    videosToSend: any;
    searchedUsers: any;
    searchObs: Observable<string>;
    conversationMsgs: any;
    selectedProfileInfo: boolean;
    loading: boolean;
    loadingMessages: boolean;
    loadingImages: boolean;
    currentConversation: any;
    selectedConversation: boolean;
    focusConversation: {};
    loadingSearch: boolean;
    destinationUser: number;
    imagesToSend: any;
    filesUpload: any;
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
        this.selectedUserPseudoIndex = null;
        this.openPseudoModal = false;
        this.openColorsModal = false;
        this.loadingImages = false;
        this.filesUpload = null;
        this.imagesToSend = [];
        this.videosToSend = [];
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
            .subscribe((info: any) => {
                const conversationIndex = this.userConversations.findIndex(conversation => conversation._id == info.conversation)
                this.userConversations[conversationIndex].messages.forEach(message => {
                    if (!message.seen.state)
                        message.seen = { state: true, seenDate: info.seenDate }
                })
                this.currentConversation = this.userConversations[conversationIndex]

            })
        this.UserService.messageReceived()
            .subscribe((message: any) => {

                if (this.currentConversation && this.currentConversation._id == message.conversation) {
                    const msgIndex = this.currentConversation.messages.findIndex(msg => msg._id == message._id)
                    this.currentConversation.messages[msgIndex] = message
                }

            })
        this.UserService.newMessage()
            .subscribe((newConversation: any) => {
                const conversationIndex = this.userConversations.findIndex(userConversation => userConversation._id == newConversation._id)
                if (conversationIndex != -1) {
                    if (this.currentConversation && this.currentConversation._id == this.userConversations[conversationIndex]._id) {
                        this.currentConversation = newConversation;
                    }
                    this.userConversations.splice(conversationIndex, 1)
                    this.userConversations.unshift(newConversation)
                }
                else
                    this.userConversations.unshift(newConversation)

                this.conversationService.setReceivedMessage(newConversation.messages[newConversation.messages.length - 1]._id,
                    newConversation.users[0]._id == this.connectedUser._id ? newConversation.users[1]._id : newConversation.users[0]._id)
                    .subscribe(res => {
                        console.log(res)
                    })

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
        this.filesUpload = event;

        for (let i = 0; i < event.length; i++) {
            try {
                var reader = new FileReader();
                reader.onload = (e: any) => {
                    if (event.item(i).type.includes('image'))
                        this.imagesToSend.push(e.target.result);
                    else if (event.item(i).type.includes('video')) {
                        this.videosToSend.push(e.target.result)
                    }
                };
                reader.readAsDataURL(this.filesUpload[i]);
            } catch (err) {
                console.log(err)
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
        if (this.currentConversation._id) {
            const loadingMessage = {
                _id: null, sender: this.connectedUser._id,
                content: this.currentMessage, images: this.imagesToSend, videos: this.videosToSend, seen: { state: false }
            }
            const currentMessage = this.currentMessage
            this.currentMessage = ''
            this.currentConversation.messages.push(loadingMessage)
            this.conversationService.sendMessage(this.currentConversation._id, currentMessage, this.filesUpload)
                .subscribe((response: any) => {
                    const conversationsIds = this.userConversations.map(conversation => conversation._id)

                    if (!conversationsIds.includes(this.currentConversation._id)) {
                        this.userConversations.push(this.currentConversation)
                    }
                    this.currentConversation.messages[this.currentConversation.messages.length - 1] = response.newMessage

                })
        }
        else {
            this.conversationService.createConversation(this.currentConversation.users[this.destinationUser]._id)
                .subscribe((response: any) => {

                    this.conversationService.sendMessage(response.conversation._id, this.currentMessage, this.filesUpload).subscribe((messageResponse: any) => {
                        this.currentMessage = '';
                        response.conversation.messages.push(messageResponse.newMessage)
                        this.userConversations.unshift(response.conversation)
                        this.currentConversation.messages.push(messageResponse.newMessage)

                    })

                })
        }

    }
    getLoadingImageStatus(messageId) {
        return this.loadingImages && this.currentConversation.messages[this.currentConversation.messages.length - 1]._id == messageId
    }
    getLastConversationContent(conversation) {
        const lastMessage = conversation.messages[conversation.messages.length - 1];
        if (lastMessage.content.length > 0)
            if (lastMessage.sender == this.connectedUser._id)
                return `Vous: ${lastMessage.content}`
            else
                return lastMessage.content
        if (lastMessage.images.length > 0) {
            if (lastMessage.sender == this.connectedUser._id) {

                if (lastMessage.images.length == 1)
                    return `Vous envoyé envoyé une photo`
                return `Vous avez envoyé ${lastMessage.images.length} photos`
            }
            if (lastMessage.images.length == 1)
                return `Vous récu envoyé une photo`
            return `Vous avez récu ${lastMessage.images.length} photos`
        }
    }
    onOpenConvers(conversationId) {
        this.currentMessage = '';
        const conversationIndex = this.userConversations.findIndex(conversation => conversation._id == conversationId)
        this.currentConversation = this.userConversations[conversationIndex];
        this.loadingMessages = false;
        this.destinationUser = this.currentConversation.users.findIndex(user => user._id != this.connectedUser._id)
        this.selectedConversation = true;
        this.selectedProfileInfo = false;

    }

    getConversationColor() {

        if (this.currentConversation._id)
            return this.currentConversation.color
        else
            return 'rgb(0, 153, 255)'
    }
    checkBlockedConversation() {
        if (this.currentConversation._id)
            return this.currentConversation.blocked.includes(this.currentConversation.users[this.destinationUser]._id)
                || this.currentConversation.blocked.includes(this.connectedUser._id)
        return false

    }
    checkBlockedConversations(conversationId) {

        const conversationIndex = this.userConversations.findIndex(conversation => conversation._id == conversationId)
        return this.userConversations[conversationIndex].blocked.includes(this.userConversations[conversationIndex].users[0]._id)
            || this.userConversations[conversationIndex].blocked.includes(this.userConversations[conversationIndex].users[1]._id)
    }
    checkBlockedUser() {
        return this.currentConversation.blocked.includes(this.currentConversation.users[this.destinationUser]._id)

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

        this.conversationService.getConversationByUsers(user._id)
            .subscribe((response: any) => {
                if (response.conversation) {
                    this.currentConversation = response.conversation;
                    this.destinationUser = this.currentConversation.users.findIndex(user => user._id != this.connectedUser._id)
                    this.loadingMessages = false;
                    this.selectedConversation = true;
                    this.searchTerms = '';
                }
                else {
                    this.currentConversation = { _id: null, users: [{ ...this.connectedUser }, { ...user }], messages: [] }
                    this.destinationUser = 1;
                    this.loadingMessages = false;
                    this.selectedConversation = true;
                    this.searchTerms = '';
                }
            })
    }
    isLastMessage(messageId: string) {

        if (messageId) {
            const indexMessage = this.currentConversation.messages.findIndex(message => message._id == messageId)
            return indexMessage == this.currentConversation.messages.length - 1
        }
        return true;


    }
    messageField() {
        if (this.currentConversation.messages.length > 0) {
            const message = this.currentConversation.messages[this.currentConversation.messages.length - 1]
            if (message.sender != this.connectedUser._id)
                this.conversationService.markConversationasRead(this.currentConversation.users[this.destinationUser]._id, this.currentConversation._id)
                    .subscribe(() => {
                        const msgIndex = this.currentConversation.messages.findIndex(msg => msg._id == message._id)
                        this.currentConversation.messages[msgIndex].seen.state = true;
                    })
        }
    }
    islastMessageSeen(conversationId) {
        const conversation = this.userConversations.find(conversation => conversation._id == conversationId)
        const message = conversation.messages[conversation.messages.length - 1]
        if (conversation.messages.length > 0) // to check 
            if (message.sender != this.connectedUser._id)
                return message.seen.state;
            else
                return true
        return false
    }
    isLastSeenMsg(messageId) {
        const messageIndex = this.currentConversation.messages.findIndex(message => message.seen.state == false)
        if (messageIndex == -1)
            return this.currentConversation.messages[this.currentConversation.messages.length - 1]._id == messageId
        if (messageIndex == 0)
            return this.currentConversation.messages[messageIndex].seen.state
        return this.currentConversation.messages[messageIndex - 1]._id == messageId
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

    setConversationColor(color: string) {
        this.conversationService.changeConversationColor(this.currentConversation._id, color)
            .subscribe(() => {
                this.currentConversation.color = color;
                const convIndex = this.userConversations.findIndex(conversation => conversation._id == this.currentConversation._id)
                this.userConversations[convIndex].color = color
            })
    }

    archiveConversation() {

        this.conversationService.archiveConversation(this.currentConversation._id)
            .subscribe(res => {
                const conversationIndex = this.userConversations.findIndex(conversation => conversation._id == this.currentConversation._id)
                this.userConversations.splice(conversationIndex, 1)
            })
    }
    blockUser() {

        this.conversationService.blockUserConversation(this.currentConversation._id, this.currentConversation.users[this.destinationUser]._id)
            .subscribe((response: any) => {
                this.openBlockMsgModal = false;
                this.currentConversation.blocked = response.blocked
            })
    }
    deBlockUser() {
        this.conversationService.unBlockConversation(this.currentConversation._id, this.currentConversation.users[this.destinationUser]._id)
            .subscribe((response: any) => {
                this.openBlockMsgModal = false;
                this.currentConversation.blocked = response.blocked
            })
    }
    deleteConversation() {
        this.conversationService.deleteConversation(this.currentConversation._id)
            .subscribe(res => {
                console.log(res)
            })
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
                this.searchedUsers = response.users
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
    saveUserPseudo() {
        console.log(this.enteredPseudo)
        this.conversationService.changeConversationPseudo(this.currentConversation._id, this.currentConversation.users[this.selectedUserPseudoIndex]._id, this.enteredPseudo)
            .subscribe((response: any) => {
                this.currentConversation.pseudos = response.conversationPseudos
            })
    }
    onOpenPseudoModal(status: boolean, selectedUserIndex) {
        this.selectedUserPseudoIndex = selectedUserIndex
        this.openPseudoModal = status

    };
    getUserPseudo() {

        const pseudoIndex = this.currentConversation.pseudos.findIndex(pseudo => pseudo.userid == this.currentConversation.users[this.destinationUser]._id)
        return this.currentConversation.pseudos[pseudoIndex].content
    }
    userHavePseudo() {
        if (this.currentConversation._id)
            return this.currentConversation.pseudos.findIndex(pseudo => pseudo.userid == this.currentConversation.users[this.destinationUser]._id) != -1
        return false
    }
    onOpenColorsModal(status: boolean) {
        this.openColorsModal = status

    };

    ngOnDestroy() {
        this.users = []
    }

}