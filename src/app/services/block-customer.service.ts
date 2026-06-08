import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable()
export class BlockCustomerService {

  constructor(private httpClient: HttpClient) { }

  blockCustColumns: any[] = [
    { name: 'action', label: 'Action' },
    { name: 'id', label: 'Sr.No' },
    { name: 'institute', label: 'Institute' },
    { name: 'type', label: 'Block Type' },
    { name: 'value', label: 'Block Value' },
    { name: 'status', label: 'Status' },
    { name: 'blockSMS', label: 'Block SMS' },
    { name: 'txnType', label: 'Transaction Type' },
    { name: 'createdDate', label: 'Created Date' },
    { name: 'updateDate', label: 'Updated Date' },
    { name: 'reason', label: 'Reason' },
  ];

  searchBlockCustomer(callingFn: string, searchValue: string) {
    return this.httpClient.get<any>(`${environment.url}upi/blockCustomer/${callingFn}/${searchValue}`);
  }

  saveBlockCustomer(request: any) {
    return this.httpClient.post<any>(`${environment.url}upi/blockCustomer/block-unblock`, request);
  }

  updateBlockCustomer(request: any) {
    return this.httpClient.post<any>(`${environment.url}upi/blockCustomer/block-unblock`, request);
  }


}
