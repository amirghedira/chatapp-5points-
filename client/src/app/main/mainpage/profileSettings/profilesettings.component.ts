import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { MainPageService } from '../mainpage.service';

@Component({
    styleUrls: ['profilesettings.component.css'],
    templateUrl: 'profilesettings.component.html'
})

export class ProfileSettingsComponent implements OnInit {

    showModal: boolean;
    userProfile: any;
    constructor(private mainPageService: MainPageService) {

        this.showModal = false;
    }

    ngOnInit() {
        this.mainPageService.getConnectUser()
            .subscribe((response: any) => {
                this.userProfile = response.user;
            })
    }

    onShowModal(status: boolean) {
        this.showModal = status
    }
    uploadFileHandler(file) {
        try {
            var reader = new FileReader();
            reader.onload = (e: any) => {
                this.userProfile.profileImg = e.target.result;
            };
            reader.readAsDataURL(file);
            this.mainPageService.updateUserProfileImg(file)
                .subscribe((response: any) => {
                    this.userProfile.profileImg = response.imageUrl;
                })
        } catch (err) {
            console.log(err)
        }

    }

}