import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { MainPageService } from '../mainpage.service';

@Component({
    styleUrls: ['profilesettings.component.css'],
    templateUrl: 'profilesettings.component.html'
})

export class ProfileSettingsComponent implements OnInit {

    showUsernameModal: boolean;
    showPhoneModal: boolean;
    showAddressModal: boolean;
    showSurnameModal: boolean;
    showNameModal: boolean;
    showPasswordModal: boolean;


    userProfile: any;
    editedUsername: string;
    editedName: string;
    editedSurname: string;
    editedOldPassword: string;
    editedNewPassword: string;
    editedReNewPassword: string;
    editedPassword: string;
    editedPhone: string;
    editedAddress: string;
    editPasswordError: string;


    constructor(private mainPageService: MainPageService) {

        this.showUsernameModal = false
        this.showPhoneModal = false
        this.showAddressModal = false
        this.showSurnameModal = false
        this.showNameModal = false
        this.showPasswordModal = false
        this.editPasswordError = ''
    }

    ngOnInit() {
        this.mainPageService.getConnectUser()
            .subscribe((response: any) => {
                this.userProfile = response.user;
                this.userProfile.address = 'skanes'
            })
    }

    onShowUsernameModal(status: boolean) {
        this.showUsernameModal = status
    }
    onShowNameModal(status: boolean) {
        this.showNameModal = status
    }
    onShowPhoneModal(status: boolean) {
        this.showPhoneModal = status
    }
    onShowAddressModal(status: boolean) {
        this.showAddressModal = status
    }
    onShowSurnameModal(status: boolean) {
        this.showSurnameModal = status
    }
    onShowPasswordModal(status: boolean) {
        this.showPasswordModal = status
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
    saveUsername() {

        this.userProfile.username = this.editedUsername
        this.mainPageService.updateUserInfo(this.userProfile)
            .subscribe()
        this.showUsernameModal = false;

    }
    saveName() {
        this.userProfile.name = this.editedName
        this.mainPageService.updateUserInfo(this.userProfile)
            .subscribe()
        this.showNameModal = false;
    }
    saveSurname() {
        this.userProfile.surname = this.editedSurname
        this.mainPageService.updateUserInfo(this.userProfile)
            .subscribe()
        this.showSurnameModal = false;
    }
    savePassword() {

        if (this.editedNewPassword == this.editedReNewPassword) {
            this.mainPageService.updateUserPassword(this.editedOldPassword, this.editedNewPassword)
                .subscribe(() => {

                    this.showPasswordModal = false;
                    this.editedOldPassword = this.editedNewPassword = this.editedReNewPassword = ''

                }, () => {
                    this.editPasswordError = 'Old password is wrong'
                })
        } else {
            this.editPasswordError = "Passwords didn\'t match"
        }

    }
    savePhone() {
        this.userProfile.tel = this.editedPhone
        this.mainPageService.updateUserInfo(this.userProfile)
            .subscribe()
        this.showPhoneModal = false;
    }
    saveAddress() {
        this.userProfile.address = this.editedAddress
        this.mainPageService.updateUserInfo(this.userProfile)
            .subscribe()
        this.showAddressModal = false;
    }

    resetErrorMsg() {
        this.editPasswordError = ''
    }

}