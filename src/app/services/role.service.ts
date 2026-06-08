import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable()

export class RoleService {

  roleColumns: any[] = [
    { name: 'id', label: 'Id' },
    { name: 'name', label: 'Role' },
    { name: 'updateDate', label: 'Updated Date' },
    { name: 'createdDate', label: 'Created Date' },
    { name: 'action', label: 'Action' },
  ];

  constructor(private httpClient: HttpClient) { }

  getAllRoles() {
    return this.httpClient.get<any>(`${environment.url}system/role`)
  }

  updateRole(request: any) {
    return this.httpClient.put<any>(`${environment.url}system/role`, request)
  }

  addRole(request: any) {
    return this.httpClient.post<any>(`${environment.url}system/role`, request)
  }

  deleteRole(request: any) {
    return this.httpClient.delete<any>(`${environment.url}system/role/${request}`)
  }

}
