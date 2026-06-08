import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Layouts } from './app.component';
import { LoginComponent } from './component/login/login.component';
import { AuthGuard } from './services/auth.guard';
import { ChangepasswordComponent } from './component/changepassword/changepassword.component';
import { SearchTransactionComponent } from './component/search-transaction/search-transaction.component';
import { SearchCustomerComponent } from './component/search-customer/search-customer.component';
import { BlockCustomerComponent } from './component/block-customer/block-customer.component';
import { UserManagementComponent } from './component/user-and-grants/user-management/user-management.component';
import { AddUserComponent } from './component/user-and-grants/add-user/add-user.component';
import { RoleManagementComponent } from './component/user-and-grants/role-management/role-management.component';
import { AddRoleComponent } from './component/user-and-grants/add-role/add-role.component';
import { AddBlockCustomerComponent } from './component/block-customer/add-block-customer/add-block-customer.component';
import { AddMerchantVpaComponent } from './component/manage-merchant-vpa/add-merchant-vpa/add-merchant-vpa.component';
import { ManageMerchantVpaComponent } from './component/manage-merchant-vpa/manage-merchant-vpa.component';
import { SessionTimeoutGuard } from './services/session-timeout.guard';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
    data: { layout: Layouts.DEFAULT },
  },
  {
    path: 'change-password',
    component: ChangepasswordComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: 'Change Password', route: '' }],
    },
    canActivate: [AuthGuard, SessionTimeoutGuard],
  },
  {
    path: 'search-transaction',
    component: SearchTransactionComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: 'Search Transaction', route: '' }],
      permissions: 'search-trans',
    },
    canActivate: [AuthGuard, SessionTimeoutGuard],
  },
  {
    path: 'search-customers',
    component: SearchCustomerComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: 'Search Customers', route: '' }],
      permissions: 'search-cust'

    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'block-customer',
    component: BlockCustomerComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: 'Block/Unblock Customer', route: '' }],
      permissions: 'manage-block'

    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'user-management',
    component: UserManagementComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: 'User Management', route: '' }],
      permissions: 'manage-user,view-user',
    },
    canActivate: [AuthGuard, SessionTimeoutGuard],
  },
  {
    path: 'user-management/add',
    component: AddUserComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [
        { name: 'User Management', route: 'user-management' },
        { name: 'Add User', route: 'user-management/add' },
      ],
      permissions: 'manage-user',
    },
    canActivate: [AuthGuard, SessionTimeoutGuard],
  },
  {
    path: 'user-management/edit/:id',
    component: AddUserComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [
        { name: 'User Management', route: 'user-management' },
        { name: 'Edit Record', route: 'user-management/edit/:id' },
      ],
      permissions: 'manage-user',
    },
    canActivate: [AuthGuard, SessionTimeoutGuard],
  },
  {
    path: 'user-management/view/:id',
    component: AddUserComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [
        { name: 'User Management', route: 'user-management' },
        { name: 'View User', route: 'user-management/view/:id' },
      ],
    },
    canActivate: [AuthGuard, SessionTimeoutGuard],
  },
  {
    path: 'role-management',
    component: RoleManagementComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: 'Role Management', route: '' }],
      permissions: 'manage-role,view-role',
    },
    canActivate: [AuthGuard, SessionTimeoutGuard],
  },
  {
    path: 'role-management/add',
    component: AddRoleComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [
        { name: 'Role', route: 'role-management' },
        { name: 'Add Role', route: 'role-management/add' },
      ],
      permissions: 'manage-role',
    },
    canActivate: [AuthGuard, SessionTimeoutGuard],
  },
  {
    path: 'role-management/edit/:id',
    component: AddRoleComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [
        { name: 'Role Management', route: 'role-management' },
        { name: 'Edit Record', route: 'role-management/edit/:id' },
      ],
      permissions: 'manage-role',
    },
    canActivate: [AuthGuard, SessionTimeoutGuard],
  },
  {
    path: 'block-customer/add',
    component: AddBlockCustomerComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [
        { name: 'Block/Unblock Customer', route: 'block-customer' },
        { name: 'Add Block Customer', route: 'block-customer/add' },
      ],
      permissions: 'manage-block',
    },
    canActivate: [AuthGuard, SessionTimeoutGuard],
  },
  {
    path: 'block-customer/edit/:id',
    component: AddBlockCustomerComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [
        { name: 'Block/Unblock Customer', route: 'block-customer' },
        { name: 'Edit Block Customer', route: 'block-customer/edit/:id' },
      ],
      permissions: 'manage-block',
    },
    canActivate: [AuthGuard, SessionTimeoutGuard],
  },
  {
    path: 'block-customer/view/:id',
    component: AddBlockCustomerComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [
        { name: 'Block/Unblock Customer', route: 'block-customer' },
        { name: 'View Block Customer', route: 'block-customer/view/:id' },
      ],
    },
    canActivate: [AuthGuard, SessionTimeoutGuard],
  },
  {
    path: 'manage-vae',
    component: ManageMerchantVpaComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: 'Manage Merchant VPA', route: '' }],
      permissions: 'manage-merchant'

    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'manage-vae/add',
    component: AddMerchantVpaComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [
        { name: 'Manage Merchant VPA', route: 'manage-vae' },
        { name: 'Add Merchant VPA', route: 'manage-vae/add' },
      ],
      permissions: 'manage-merchant',
    },
    canActivate: [AuthGuard, SessionTimeoutGuard],
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes,{scrollPositionRestoration: 'top', useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
