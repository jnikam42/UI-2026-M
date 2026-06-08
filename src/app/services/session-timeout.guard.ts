import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { UserIdleService } from 'angular-user-idle';
import { UserService } from './user.service';
import { DialogComponent } from '../shared/dialog/dialog.component';
import { SharedService } from './shared.service';

@Injectable()
export class SessionTimeoutGuard implements CanActivate {
  showPopup: boolean = true;

  constructor(private sharedService: SharedService, private userService: UserService, private router: Router, public dialog: MatDialog, private userIdle: UserIdleService) { }


  canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): any {
    const routePermissions = route?.data['permissions']?.split(',');
    let hasPermissions = false;

    const permissions = this.userService?.userPermissions
    if (!routePermissions) {
      hasPermissions = true;
    }
    for (let i: number = 0; i < routePermissions?.length; i++) {
      hasPermissions = permissions?.some((item: any) => item.id === routePermissions[i]);

      if (hasPermissions) {
        break;
      }
    }
    console.log(hasPermissions);
    if (this.userService.userSessionData && hasPermissions) {
      this.userIdle.startWatching();

      this.userIdle.onTimerStart().subscribe(count => {
        console.log("onTimerStart");
        if (this.showPopup) {
          const dialogRef = this.dialog.open(DialogComponent, {
            width: "380px",
            data: {
              "msgSessionMsgTitle": `Your session is going to be expired in <b>60 seconds.</b>`,
              "msgSessionMsgBody": `If you wish to continue please click on Yes button,</br>` +
                `else the session will be auto-logged out.`,
              "type": "confirm"
            }
          });
          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              this.restart();
              this.showPopup = true;
            } else {
              this.stop();
              this.userService.logoutServerSession();
            }
          });
          this.showPopup = false;
        }
      });

      this.userIdle.onTimeout().subscribe(() => {
        this.stop();
        this.userService.logoutServerSession();
      });
      return true;
    } else {
      this.userService.logout();
    }
  }

  stop() {
    this.userIdle.stopTimer();
  }

  stopWatching() {
    this.userIdle.stopWatching();
  }

  startWatching() {
    this.userIdle.startWatching();
  }

  restart() {
    this.userIdle.resetTimer();
  }
}
