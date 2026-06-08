import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ngxCsv } from 'ngx-csv';
import { HelperService } from 'src/app/services/helper.service';
import { SearchTransactionService } from 'src/app/services/searchTransaction.service';
import { UserService } from 'src/app/services/user.service';
import { Transaction } from 'src/app/models/transactionInfo';
import { RegularExpression } from 'src/app/shared/regular-expression';
import { DialogTxnIdComponent } from './dialog-txn-id/dialog-txn-id.component';
import config from './../../../assets/config.json';

@Component({
  selector: 'app-search-transaction',
  templateUrl: './search-transaction.component.html',
  styleUrls: ['./search-transaction.component.scss']
})
export class SearchTransactionComponent implements OnInit {
  upiSearchForm: FormGroup;
  searchByList = {
    tranId: 'Transaction Id',
    rrn: 'RRN',
    mobNo: 'Mobile No',
    accountNo: 'Account No',
    vpa: 'Virtual Address',
  };
  showDetails = false;
  panelOpen: boolean = true;
  dataSource!: MatTableDataSource<any>;
  minFromDate: Date = new Date();
  maxFromDate: Date = new Date();
  minToDate: Date = new Date();
  maxToDate: Date = new Date();
  myData: any = [];
  fileName!: string;
  txnData!: Transaction [];
  columns!: any[];

  constructor(
    private fb: FormBuilder,
    private helper: HelperService,
    private searchTranService: SearchTransactionService,
    private user: UserService,
    private helperservice: HelperService,
    public dialog: MatDialog, private datePipe: DatePipe,
  ) {
    this.upiSearchForm = this.fb.group({
      searchByParam: ['', Validators.required],
      tranId: ['', Validators.maxLength(35)],
      rrn: ['', [Validators.pattern(RegularExpression.RRN), Validators.maxLength(12)]],
      mobNo: ['', Validators.pattern(RegularExpression.MOBILE_NO)],
      accountNo: ['',Validators.pattern(RegularExpression.ACCOUNT_NO)],
      vpa: ['', Validators.pattern(RegularExpression.VPA)],
    });
    this.columns = this.searchTranService.transactionColumns;
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<any>([]);
    const today = new Date();
    this.minFromDate.setDate(today.getDate() - config.dateRange);
    this.maxFromDate.setDate(today.getDate());
    this.minToDate.setDate(today.getDate() - config.dateRange);
    this.maxToDate.setDate(today.getDate());
    this.fileName = 'Transaction-data' + ' ' + this.datePipe?.transform(today, 'dd-MM-yyyy');

  }

  searchParamChanged(): void {
    this.upiSearchForm.patchValue({
      tranId: '',
      rrn: '',
      mobNo: '',
      accountNo: '',
      vpa: '',
    });
  }

  onFormSubmit(): void {
    let valid = this.upiSearchForm;
    let checkValidData = isNullorUndefined(valid.get('tranId')?.value) && isNullorUndefined(valid.get('rrn')?.value) &&
      isNullorUndefined(valid.get('mobNo')?.value) &&
      isNullorUndefined(valid.get('accountNo')?.value) &&
      isNullorUndefined(valid.get('vpa')?.value);

    if (this.upiSearchForm.invalid) {
      this.showDetails = false;
      return;
    }
    else if (checkValidData) {
      this.showDetails = false;
      this.helper.raiseError('At least one search criteria is required.');
    }
    else {
      this.dataSource = new MatTableDataSource<any>([]);
      this.searchTransaction();
    }
  }

  searchTransaction(): void {
    const searchParam = this.upiSearchForm.get('searchByParam')?.value;
    let searchValue = '';
    let apiEndpoint = '';

    switch (searchParam) {
      case 'tranId':
        searchValue = this.upiSearchForm.get('tranId')?.value;
        apiEndpoint = 'get-trans-using-trans-id';
        break;
      case 'rrn':
        searchValue = this.upiSearchForm.get('rrn')?.value;
        apiEndpoint = 'get-trans-using-rrn';
        break;
      case 'umn':
        searchValue = this.upiSearchForm.get('umn')?.value;
        apiEndpoint = 'get-trans-using-umn';
        break;
      case 'mobNo':
        searchValue = this.upiSearchForm.get('mobNo')?.value;
        apiEndpoint = 'get-trans-using-mob-no';
        break;
      case 'accountNo':
        searchValue = this.upiSearchForm.get('accountNo')?.value;
        apiEndpoint = 'get-trans-using-accountNo';
        break;
      case 'vpa':
        searchValue = this.upiSearchForm.get('vpa')?.value;
        apiEndpoint = 'get-trans-using-vpa';
        break;
      case 'dateRange':
        const fromDate = this.upiSearchForm.get('fromDate')?.value || null;
        const toDate = this.upiSearchForm.get('toDate')?.value || null;
        if (fromDate == null || fromDate == undefined || toDate == null || toDate == undefined) {
          this.helper.raiseError('Please select valid date range!');
          return;
        }
        searchValue = `${this.formatDate(fromDate)}/${this.formatDate(toDate)}`
        apiEndpoint = 'get-trans-using-dateRange';
        break;
      default:
        this.helperservice.raiseError('Please select the parameters to search');
        return;
    }

    if (searchValue && apiEndpoint) {
      this.searchTranService.searchTransaction(apiEndpoint, searchValue).subscribe((res) => {
          this.handleResponse(res);
        },
        (error) => {
          this.helper.raiseError(
            'Error fetching trasactions. Please try again.'
          );
          this.reset();
        },
      );
    } else {
      this.helper.raiseError('Please select the parameters to search and enter valid inputs.');
    }
  }

  onDateChange(): void {
    const fromDate = this.upiSearchForm.get('fromDate')?.value;
    const toDate = this.upiSearchForm.get('toDate')?.value;

    if (fromDate) {
      this.minToDate = new Date(fromDate);
    }

    if (toDate) {
      this.maxFromDate = new Date(toDate);
    }
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString("fr-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });
  }

  downloadAsCSV() {
    let columnNames: string[] = [];
    this.columns.forEach((element: any) => {
      columnNames.push(element.label);
    });
    let data: any[] = [];
    this.txnData.forEach((item: any, index: number) => {
      let row: any[] = [];
      this.columns.forEach((col: any) => {
        let val;
        if (col.name == 'id') {
          val = index + 1;
        }
        else if (col.name.toLowerCase().includes('date')) {
          val = item[col.name] && new Date(item[col.name]).toString() != 'Invalid Date' ? this.datePipe?.transform(new Date(item[col.name]), 'MMM d, y, HH:mm:ss') : ''
        } else {
          val = item[col.name];
        }
        row.push(val == undefined ? '' : val);
      });
      data.push(row);
    });
    var options = {
      title: this.fileName,
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      noDownload: false,
      showTitle: true,
      useBom: true,
      headers: columnNames
    };

    const fileInfo = new ngxCsv(data, this.fileName, options);

  }

  exportAsXLSX(): void {

    let data: any[] = [];
    this.txnData.forEach((item: any, index: number) => {
      let row: any[] = [];
      this.columns.forEach((col: any) => {
        let val;
        if (col.name == 'id') {
          val = index + 1;
        }
        else if (col.name.toLowerCase().includes('date')) {
          val = item[col.name] && new Date(item[col.name]).toString() != 'Invalid Date' ? this.datePipe?.transform(new Date(item[col.name]), 'MMM d, y, HH:mm:ss') : ''
        } else {
          val = item[col.name];
        }
        row[col.label] = val == undefined ? '' : val;
      });
      data.push(row);
    });

     this.searchTranService.exportAsExcelFile(data, this.fileName);
  }

  openDialog(evt: any) {
    const dialogRef = this.dialog.open(DialogTxnIdComponent, {
      width: '50%',
      maxHeight: '90vh',
      data: { "transactionDetails": evt },
      autoFocus: false
    });
  }

  reset(): void {
    this.upiSearchForm.reset({
      searchByParam: ''
    });
    this.dataSource = new MatTableDataSource<any>([]);
    this.showDetails = false;
    this.panelOpen = true;
  }

  handleResponse(res: any) {
    if (res && res.success) {
      this.txnData = res.data;
      this.dataSource =new MatTableDataSource<Transaction>(this.txnData);
      this.showDetails = true;
      this.panelOpen = false;
      this.upiSearchForm.markAsPristine();
    } else {
      this.helper.raiseError('No Matching record found');
      this.reset();
    }
  }

}

function isNullorUndefined(val: any) {
  if (val == undefined)
    return true;
  if (val == '')
    return true;
  if (val == null)
    return true;
  return false;
}
