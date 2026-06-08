import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SharedService } from './shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { UserData, UserPermissions } from '../models/user_data';
import { HelperService } from './helper.service';

interface UserDataOld {
  id: string;
  name: string;
  nick: string;
  email: string;
  roles: string;
  last_activity: string;
  status: string;
}
export interface UserRolesOld {
  id: string;
  name: string;
  permissions: string;
  deleted: boolean;
  updatedDate: string;
}
@Injectable()

export class UserManagementService {
  displayedColumns: string[] = ['id', 'name', 'email'];
  userDataOld!: MatTableDataSource<UserDataOld>;
  userData!: MatTableDataSource<UserData>;
  userRoles!: MatTableDataSource<UserRolesOld>;
  userPermissions!: MatTableDataSource<UserPermissions>;

  permissionColumns: string[] = ['id', 'value', 'action'];

  constructor(private httpClient: HttpClient, private sharedSer: SharedService, private helperService: HelperService) { }

  searchUserData(filter: any) {
    this.httpClient.get<any>(`${environment.url}system/user`)
    let users = Array.from({ length: 100 }, (_, k) => createNewUser(k + 1));
    // Assign the data to the data source for the table to render
    this.userDataOld = new MatTableDataSource(users);
    return this.userDataOld;
  }
  search(filter: any) {
    return this.httpClient.get<any>(`${environment.url}system/user/`)
  }
  searchLDAPUser(filter: string) {
    return this.httpClient.post<any>(`${environment.url}system/user/search-ldap-user/${filter}`, {})
  }
  getAll() {
    return this.httpClient.get<any>(`${environment.url}system/institute`);
  }
  addUser(request: any) {
    return this.httpClient.post<any>(`${environment.url}system/user`, request)
  }

  update(request: any) {
    return this.httpClient.put<any>(`${environment.url}system/user`, request)
  }

  searchUserRoles() {
    let roles = Array.from({ length: 100 }, (_, k) => createNewRoles(k + 1));
    this.userRoles = new MatTableDataSource(roles);
    return this.userRoles;
  }

  clearData() {
    this.displayedColumns = [];
    this.userData = new MatTableDataSource(undefined);
    this.userRoles = new MatTableDataSource(undefined);
    this.userPermissions = new MatTableDataSource(undefined);
  }
  unlockUser(id: number) {
    return this.httpClient.post<any>(`${environment.url}system/user/unlock`, { id: id })
  }
  deleteUser(request: any) {
    return this.httpClient.delete<any>(`${environment.url}system/user/${request}`)
  }
}

function createNewRoles(id: number): UserRolesOld {
  const name =
    NAMES[Math.round(Math.random() * (NAMES.length - 1))] +
    ' ' +
    NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) +
    '.';

  return {
    id: id.toString(),
    name: name,
    permissions: ROLES[Math.round(Math.random() * (ROLES.length - 1))],
    deleted: false,
    updatedDate: new Date().toDateString()
  };
}
/** Builds and returns a new User. */
function createNewUser(id: number): UserDataOld {
  const name =
    NAMES[Math.round(Math.random() * (NAMES.length - 1))] +
    ' ' +
    NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) +
    '.';

  let status: string;

  // Extracting the nested ternary operation into an independent statement
  if (id === 3) {
    status = "Inactive";
  } else if (id === 4) {
    status = "locked";
  } else {
    status = "Active";
  }

  return {
    id: id.toString(),
    name: name,
    nick: name,
    roles: ROLES[Math.round(Math.random() * (ROLES.length - 1))],
    email: "test@test.com",
    last_activity: "",
    status: status // Using the extracted status
  };
}

const ROLES: string[] = [
  'admin',
  'Corp BC',
  'ca',
  'ap',
  'admin',
  'agent',
  'agent',
  'corp bc',
];
const NAMES: string[] = [
  'Maia',
  'Asher',
  'Olivia',
  'Atticus',
  'Amelia',
  'Jack',
  'Charlotte',
  'Theodore',
  'Isla',
  'Oliver',
  'Isabella',
  'Jasper',
  'Cora',
  'Levi',
  'Violet',
  'Arthur',
  'Mia',
  'Thomas',
  'Elizabeth',
];
