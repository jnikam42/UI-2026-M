import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SharedService } from './shared.service';

@Injectable()

export class PermissionService {

  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  getAll() {
    return this.httpClient.get<any>(`${environment.url}system/permission`)
  }

  update(request: any) {
    return this.httpClient.put<any>(`${environment.url}system/permission`, request)
  }
}
