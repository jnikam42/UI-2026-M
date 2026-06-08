import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SharedService } from './shared.service';
import { UserManagementService } from './user-management.service';
import { DialogComponent } from '../shared/dialog/dialog.component';

@Injectable()

export class UserService {

  spinnerVisibility: BehaviorSubject<any>;

  private userloginCheck = new BehaviorSubject<boolean>(false);
  loginCheck = this.userloginCheck.asObservable();
  headers: HttpHeaders = new HttpHeaders();
  captureUsersessionData: any;
  userSessionData: any;
  userPermissions: any[] = [];
  isVerified = false;
  pwdRegex: string = '^[A-Za-z]{1,1}[A-Za-z0-9@]{7,20}$';
  pwdRegexMsg: string = 'Please enter valid Password';

  constructor(private matDialog: MatDialog, private sharedSer: SharedService,
    private httpClient: HttpClient, private router: Router, private userManageSer: UserManagementService, private http: HttpClient) {
    this.spinnerVisibility = new BehaviorSubject(false);
  }

  show() {
    setTimeout(() => {
      this.spinnerVisibility.next(true);
    }, 0);
  }
  hideSpinner() {
    setTimeout(() => {
      this.spinnerVisibility.next(false);
    }, 0);
  }

  public clearSessionData() {
    this.userSessionData = undefined;
    this.userManageSer.clearData();
    this.sharedSer.wk = undefined;
    this.sharedSer.wkAck = undefined;
    sessionStorage.removeItem('wk-ack');
    this.removeItemFromCache();

  }

  updateUser(val: any) {
    this.userloginCheck.next(val);
  }


  public logoutServerSession() {
    this.httpClient.get(`${environment.url}system/user/logout`).subscribe({
      next: (resp) => {
        this.router.navigate(['/login']);
        this.clearSessionData();
        this.matDialog.closeAll();
      }, error: (err) => {
        this.router.navigate(['/login']);
        this.clearSessionData();
        this.matDialog.closeAll();
      }
    });
  }

  logout(isConfirmationRequired = false) {
    if (!isConfirmationRequired) {
      this.logoutServerSession();
    } else {
      const dialogRef = this.matDialog.open(DialogComponent, {
        width: "300px",
        data: { "msg": "Do you want to logout?", "type": "confirm" }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.logoutServerSession();
        }
      });
    }
  }

  login(nick: any, password: string) {
    return this.httpClient.post<any>(`${environment.url}system/user/login`, { nick, password }, {
      headers: this.headers
    })
      .pipe(map(res => {
        this.userSessionData = res;

        let roles: any[] = this.userSessionData.data['user']['roles'];
        this.userPermissions = []; // Clear previous permissions

        roles.forEach(role => {
          this.userPermissions.push(...role.permissions);
        });

        this.pwdRegex = res.data.PasswordPolicyRegEx || this.pwdRegex;
        this.pwdRegexMsg = res.data.PasswordPolicyMessage || this.pwdRegexMsg;

        return res;
      }));
  }

  changePassword(request: any) {
    return this.httpClient.post<any>(`${environment.url}system/user/change-password`, request, {
      headers: this.headers
    })
  }
  async removeItemFromCache() {
    caches?.keys().then((resp) => {
    }, (error) => {
      console.error("removeItemFromCache Error " + error);
    })
    for (const entry of await caches.keys()) {
      window?.caches?.open(entry).then(async (cache) => {
        return await cache.delete(entry);
      }, (error) => {
        console.error("removeItemFromCache Error while deleting" + entry);
      });
    }
  }

  systemVersion() {
    return this.httpClient.get<any>(`${environment.url}system/user/who`, { observe: 'response' })
  }

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
}
