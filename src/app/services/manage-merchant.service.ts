import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable()
export class ManageMerchantService {

  constructor(private httpClient: HttpClient) { }

  verifyMerchant(vpa: string) {
    return this.httpClient.get<any>(`${environment.url}manage-merchant/verify/${vpa}`);
  }
}
