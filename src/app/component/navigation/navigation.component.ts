import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router, RoutesRecognized } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import config from './../../../assets/config.json';
import { ConfigData, NavItem } from 'src/app/models/config_data';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );
  panelOpenState = false;
  notifications: string[] = [];
  configData: ConfigData = config;
  breadcrumbList: any = [{ name: 'Search Transaction', route: 'search-transaction' }];
  initialClose: boolean = true;
  menuItems: NavItem[] = config.sidemenu_item;
  lastLoginDate: string;

  constructor(
    private breakpointObserver: BreakpointObserver,
    public route: Router,
    public dialog: MatDialog,
    public userService: UserService,
    private router: Router
  ) {
    this.notifications = [];
    this.lastLoginDate = this.userService.userSessionData?.data?.UserLastLogin;
  }

  ngOnInit(): void {
    this.router.events.subscribe((val: any) => {
      if (val instanceof RoutesRecognized) {
        this.breadcrumbList = val.state.root.firstChild?.data['breadcrumb'];
      }
    });
  }

  logout(): void {
    this.userService.logout(true);
  }

  panelToggle(i: number) {
    if (i == 0) this.initialClose = false;
  }
}
