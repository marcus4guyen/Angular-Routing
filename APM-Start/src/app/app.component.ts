import { Component } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';

import { AuthService } from './user/auth.service';
import { MessageService } from './messages/message.service';

@Component({
    selector: 'pm-app',
    templateUrl: './app/app.component.html'
})
export class AppComponent {
    pageTitle: string = 'Acme Product Management';
    loading: boolean = false;

    constructor(private _router: Router,
                private _messageService: MessageService,
                private authService: AuthService) {
        this._router.events.subscribe((routerEvent: Event) => {
            this.checkRouterEvent(routerEvent);
        });
    }

    displayMessages(): void {
        this._router.navigate([{ outlets: { popup: ['messages'] } }]);
        this._messageService.isDisplayed = true;
    }

    hideMessages(): void {
        this._router.navigate([{ outlets: { popup: null } }]);
        this._messageService.isDisplayed = false;
    }

    checkRouterEvent(routerEvent: Event) {
        if (routerEvent instanceof NavigationStart) {
            this.loading = true;
        }

        if (routerEvent instanceof NavigationEnd ||
            routerEvent instanceof NavigationCancel ||
            routerEvent instanceof NavigationError) {
            this.loading = false;
        }
    }

    logOut(): void {
        this.authService.logout();
        this._router.navigateByUrl('');
    }
}
