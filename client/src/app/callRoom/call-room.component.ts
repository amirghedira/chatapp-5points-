import { Component, OnInit } from "@angular/core";
import { UserService } from '../service/user.service';
import { ActivatedRoute } from '@angular/router';
import { Howl } from 'howler';
import { BehaviorSubject } from 'rxjs';


declare var Peer: any;


@Component({
    selector: 'app-mainpage',
    templateUrl: './call-room.component.html',
    styleUrls: ['./call-room.component.css']
})

export class CallRoomComponent implements OnInit {
    peer = new Peer(undefined);
    myPeerId;
    roomId: any;
    isVideoCall: any;
    userCallDes: any
    connectedUser: any
    ringinSound: Howl;
    callState: string;
    isACall: boolean;
    callStatus: boolean
    stopCallStream: BehaviorSubject<boolean>;
    callWindow;
    time: number = 0;
    interval;
    constructor(private userService: UserService, private router: ActivatedRoute) {
        this.stopCallStream = new BehaviorSubject(null);
        this.callStatus = true;
        this.callState = 'Mise en relation...'
        this.ringinSound = new Howl({
            src: ['/assets/audio/isringing.mp3'],
            loop: true

        });

    }
    ngOnInit() {
        this.isVideoCall = this.router.snapshot.queryParamMap.get('video') == 'true';
        this.roomId = this.router.snapshot.paramMap.get('id');
        this.isACall = this.router.snapshot.queryParamMap.get('call') == 'true';

        this.peer.on('open', id => {
            this.userService.startCall(this.roomId, id)
        })
        this.userService.userDisconnectFromRoom()
            .subscribe(() => {
                this.stopTimer()
                this.stopCallStream.next(true)
                this.callStatus = false;
                this.callState = 'Call Ended'
            })
        this.userService.onCallEnded()
            .subscribe(res => {
                // this.ringinSound.stop() 
                if (this.time > 0) {
                    this.stopTimer();
                    this.callStatus = false;
                    this.callState = 'Call Ended...'
                } else {
                    this.callStatus = false;
                    this.callState = 'Call Ended...'
                }
                this.stopCallStream.next(true)


            })
        const userIds = this.roomId.split('-')
        this.userService.onCallState()
            .subscribe(state => {
                console.log(state)
                if (state) {

                    this.callState = 'ca sonne...'
                    // this.ringinSound.play()

                }
                else {
                    this.callState = 'Pas de reponse'
                    this.callStatus = false;
                }
            })
        this.userService.getConnectUser()
            .subscribe((response: any) => {
                this.connectedUser = response.user
                this.userService.getUserById(this.connectedUser._id == userIds[1] ? userIds[0] : userIds[1])
                    .subscribe((response: any) => {
                        this.userCallDes = response
                        if (this.isACall)
                            this.userService.callUser(this.connectedUser._id, this.userCallDes._id)
                        else {
                            this.startTimer()
                        }
                    })

            })
        this.createCall()

    }
    endCall() {
        this.stopCallStream.next(true)
        console.log('end the call')
        if (this.time > 0) {
            this.stopTimer()
            this.callStatus = false;
            this.callState = 'Call Ended'
            this.userService.endCall(this.userCallDes, false)

        }
        else
            this.userService.endCall(this.userCallDes, true)

    }
    closeCallWindow() {
        this.userService.setOpenCallWindow(true)
    }
    createCall() {
        var myVideo = document.createElement('video')
        myVideo.muted = true;
        navigator.mediaDevices.getUserMedia({ video: this.isVideoCall, audio: true })
            .then(stream => {

                this.stopCallStream
                    .subscribe(res => {
                        console.log(res)
                        if (res) {
                            stream.getTracks().forEach(track => track.stop())

                        }
                    })

                this.addVideoStream(myVideo, stream)
                this.peer.on('call', call => {
                    call.answer(stream)
                    const video = document.createElement('video')
                    call.on('stream', userVideoStream => {
                        this.addVideoStream(video, userVideoStream)
                    })
                })
                this.userService.userJoiningRoom()
                    .subscribe(userId => {
                        this.startTimer();
                        this.connectToNewUser(userId, stream)
                    })
            })
    }
    connectToNewUser(userId, stream) {
        const call = this.peer.call(userId, stream)
        var video = document.createElement('video')
        call.on('stream', userVideoStream => {
            this.addVideoStream(video, userVideoStream)
        })
        call.on('close', () => {
            video.remove()
        })
    }
    addVideoStream(video, stream) {
        video.srcObject = stream
        video.addEventListener('loadedmetadata', () => {
            video.play()
        })
        var videoGrid = document.getElementById('videoGrid')
        videoGrid.append(video)
    }
    startTimer() {
        this.interval = setInterval(() => {
            if (this.time === 0) {
                this.time++;
            } else {
                this.time++;
            }
            this.callState = this.transform(this.time)
        }, 1000);
    }
    transform(value: number) {
        const minutes: number = Math.floor(value / 60);
        const seconds = (value - minutes * 60)
        const minutesStr = minutes < 10 ? '0' + minutes : minutes
        const secondsStr = seconds < 10 ? '0' + seconds : seconds
        return `${minutesStr}:${secondsStr}`
    }
    pauseTimer() {
        clearInterval(this.interval);
    }
    stopTimer() {
        clearInterval(this.interval)
        this.time = 0
    }
}