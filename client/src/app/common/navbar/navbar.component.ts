// import { Component, OnInit } from '@angular/core';
// import { UserService } from '../service/user.service';
// import { Router } from '@angular/router';

// @Component({
//     selector: 'app-nav',
//     templateUrl: './navbar.component.html',
//     styleUrls: ['./navbar.component.css'],
// })

// export class NavbarComponent implements OnInit {

//     status: boolean;
//     loading: boolean
//     currentUser: any;
//     constructor(private UserService: UserService, private router: Router) {

//         this.loading = true;
//         this.status = false;
//         this.UserService.userConnected.subscribe((user) => {

//             if (user) {
//                 this.status = true
//                 this.currentUser = user
//             }

//         });
//     }
//     ngOnInit() {

//         if (this.UserService.token)
//             this.UserService.getConnectUser().subscribe((response: any) => {
//                 if (response.user)
//                     this.status = true
//                 else
//                     this.status = false
//                 this.currentUser = response.user
//                 this.loading = false
//             })
//         else
//             this.loading = false


//     }
//     onDisconnect() {
//         this.UserService.disconnectUser()
//             .subscribe(res => {
//                 this.status = false;
//                 this.router.navigate(['/login'])
//             })
//     }

// }