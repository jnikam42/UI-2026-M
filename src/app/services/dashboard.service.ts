import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SharedService } from './shared.service';

@Injectable()

export class DashboardService {

  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  getCustomers(callingFn: string, searchValue: string) {
    return this.httpClient.get<any>(`${environment.url}upi/customer/search/${callingFn}/${searchValue}`);
  }

  private processResponse(res: any) {
    if (res?.payloadResponse) {
      return JSON.parse(this.sharedService.getDecryptedData(res.payloadResponse));
    }
    return null;
  }
}
