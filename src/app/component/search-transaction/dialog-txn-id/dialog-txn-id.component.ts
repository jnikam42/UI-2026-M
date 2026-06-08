import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-txn-id',
  templateUrl: './dialog-txn-id.component.html',
  styleUrls: ['./dialog-txn-id.component.scss']
})
export class DialogTxnIdComponent implements OnInit {

  transactionDetails: any;
  txnData: any;
  showData: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.transactionDetails = data?.transactionDetails;
  }

  ngOnInit(): void {
  }

  txnStatusMapping: { [key: string]: string } = {
    'N': 'NEW',
    'A': 'ACKNOWLEDGED',
    'P': 'PENDING',
    'I': 'INITIATED',
    'V': 'REJECTED',
    'R': 'REVERSED',
    'C': 'COMPLETED',
    'S': 'SUSPECTED'
  };

}
