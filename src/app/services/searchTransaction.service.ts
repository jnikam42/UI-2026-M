import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


@Injectable()
export class SearchTransactionService {

  constructor(
    private httpClient: HttpClient,
  ) { }

  transactionColumns: any[] = [
    { name: 'id', label: 'Sr.No' },
    { name: 'txnId', label: 'Transaction Id' },
    { name: 'itc', label: 'Transaction Code (Type)' },
    { name: 'amount', label: 'Amount' },
    { name: 'ssRrn', label: 'RRN' },
    { name: 'tdate', label: 'Date' },
    { name: 'irc', label: 'IRC' },
    { name: 'rc', label: 'RC' },
    { name: 'extrc', label: 'Extra Info' },
    { name: 'status', label: 'Status' },
  ];

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Transaction Data': worksheet },
      SheetNames: ['Transaction Data'],
    };

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const data: Blob = new Blob([excelBuffer], { type: EXCEL_TYPE });
    saveAs(data, excelFileName);
  }

  searchTransaction(apiEndpoint: string, searchValue: string){
    return this.httpClient.get<any>(`${environment.url}upi/master-transaction/${apiEndpoint}/${searchValue}`);
  }

}
