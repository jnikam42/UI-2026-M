import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { SharedService } from './shared.service';
import config from './../../assets/config.json';
import { DatePipe } from '@angular/common';

@Injectable()

export class HelperService {
  horizontalPosition: MatSnackBarHorizontalPosition = 'end'; 
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(
    private sharedService: SharedService,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe
  ) { }

  public static readonly MY_FORMATS = {
    parse: {
      dateInput: 'DD-MMM-YYYY', 
    },
    display: {
      dateInput: config.dateFormatForTxn,
      monthYearLabel: 'MMMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY',
    },
  };

  public isNullorUndefined(val: any): boolean {
    return val == undefined || val == '' || val == null;
  }

  public formatDate(value: any): string {
    const formattedDate = this.datePipe.transform(value, 'dd-MM-yyyy');
    return formattedDate ?? ''; 
  }

 handleResponse(res: any) {
   const payloadResponse = res?.['payloadResponse'];

   if (payloadResponse) {
     return JSON.parse(this.sharedService.getDecryptedData(payloadResponse));
   } else {
     return null;
   }
 }


  raiseSuccess(message: string) {
    this.snackBar.open('✅  ' + message, '', {
      duration: 5000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  raiseError(message: string) {
    this.snackBar.open('❌  ' + message, '', {
      duration: 5000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: ['mat-snack-bar-container-error'],
    });
  }
}
