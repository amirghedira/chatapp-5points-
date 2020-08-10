import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";

@Component({
    styleUrls: ['profilesettings.component.css'],
    templateUrl: 'profilesettings.component.html'
})

export class ProfileSettingsComponent implements OnInit {

    showModal: boolean;

    constructor() {

        this.showModal = false;
    }

    ngOnInit() {

    }

    onShowModal(status: boolean) {
        this.showModal = status
    }

}