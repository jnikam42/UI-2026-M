import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchTransactionComponent } from './component/search-transaction/search-transaction.component';
import { LoginComponent } from './component/login/login.component';
import { NavigationComponent } from './component/navigation/navigation.component';
import { SearchCustomerComponent } from './component/search-customer/search-customer.component';
import { DialogComponent } from './shared/dialog/dialog.component';
import { ExpandableTableComponent } from './shared/expandable-table/expandable-table.component';
import { TableComponent } from './shared/table/table.component';
import { SharedModule } from './shared/shared.module';
import { CommonModule, Location, DatePipe } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxCaptchaModule } from '@binssoft/ngx-captcha';
import { RecaptchaModule } from "ng-recaptcha";
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatNativeDateModule } from '@angular/material/core';
import { BreakpointObserver, LayoutModule, } from '@angular/cdk/layout';
import { HelperService } from './services/helper.service';
import { HttpCallInterceptor } from './shared/interceptor/http-interceptor';
import { ChangepasswordComponent } from './component/changepassword/changepassword.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BlockCustomerComponent } from './component/block-customer/block-customer.component';
import { AddBlockCustomerComponent } from './component/block-customer/add-block-customer/add-block-customer.component';
import { AddUserComponent } from './component/user-and-grants/add-user/add-user.component';
import { UserManagementComponent } from './component/user-and-grants/user-management/user-management.component';
import { AddRoleComponent } from './component/user-and-grants/add-role/add-role.component';
import { RoleManagementComponent } from './component/user-and-grants/role-management/role-management.component';
import { DashboardService } from './services/dashboard.service';
import { PermissionService } from './services/permission.service';
import { RoleService } from './services/role.service';
import { SearchTransactionService } from './services/searchTransaction.service';
import { SharedService } from './services/shared.service';
import { UserManagementService } from './services/user-management.service';
import { UserService } from './services/user.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CheckPermissionDirective } from './directives/check-permission.directive';
import { DialogTxnIdComponent } from './component/search-transaction/dialog-txn-id/dialog-txn-id.component';
import { ManageMerchantVpaComponent } from './component/manage-merchant-vpa/manage-merchant-vpa.component';
import { AddMerchantVpaComponent } from './component/manage-merchant-vpa/add-merchant-vpa/add-merchant-vpa.component';
import { ManageMerchantService } from './services/manage-merchant.service';
import { BlockCustomerService } from './services/block-customer.service';
import { AuthGuard } from './services/auth.guard';
import { SessionTimeoutGuard } from './services/session-timeout.guard';
import { UserIdleModule } from 'angular-user-idle';
import config from './../assets/config.json';

@NgModule({
  declarations: [
    AppComponent,
    SearchTransactionComponent,
    LoginComponent,
    NavigationComponent,
    SearchCustomerComponent,
    DialogComponent,
    ExpandableTableComponent,
    TableComponent,
    ChangepasswordComponent,
    BlockCustomerComponent,
    AddBlockCustomerComponent,
    AddUserComponent,
    UserManagementComponent,
    AddRoleComponent,
    RoleManagementComponent,
    CheckPermissionDirective,
    DialogTxnIdComponent,
    ManageMerchantVpaComponent,
    AddMerchantVpaComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    MatSnackBarModule,
    MatFormFieldModule,
    NgxCaptchaModule,
    RecaptchaModule,
    CommonModule,
    HttpClientModule,
    MatSidenavModule,
    MatNativeDateModule,
    LayoutModule,
    UserIdleModule.forRoot({ idle: config.idleTime, timeout: config.timeout}),
  ],
  providers: [
    AuthGuard,
    SessionTimeoutGuard,
    HelperService,
    Location,
    BreakpointObserver,
    BlockCustomerService,
    DashboardService,
    HelperService,
    PermissionService,
    RoleService,
    SearchTransactionService,
    SharedService,
    UserManagementService,
    ManageMerchantService,
    UserService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpCallInterceptor,
      multi: true
    },
    DatePipe,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
