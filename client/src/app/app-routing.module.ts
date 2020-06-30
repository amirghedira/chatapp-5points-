import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppRoutes } from './app.routing'
import { registerComponent } from './register/register.component';


@NgModule({
    imports: [
        RouterModule.forRoot(AppRoutes, {
            useHash: false,
            scrollPositionRestoration: 'enabled',
        })]
    ,
    exports: [RouterModule]
})
export class AppRoutingModule { }
