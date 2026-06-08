import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Institute } from 'src/app/models/block-customer';
import { BlockCustomerService } from 'src/app/services/block-customer.service';
import { HelperService } from 'src/app/services/helper.service';
import { Location } from '@angular/common';
import { RegularExpression } from 'src/app/shared/regular-expression';

@Component({
  selector: 'app-add-block-customer',
  templateUrl: './add-block-customer.component.html',
  styleUrls: ['./add-block-customer.component.scss']
})
export class AddBlockCustomerComponent implements OnInit {
  mode = 'Add';
  showResult!: boolean;
  addForm: any = FormGroup;
  custData: any;
  isView = false;

  constructor(
    private fb: FormBuilder, private location: Location, private blockCustomerService: BlockCustomerService,
    private helper: HelperService, private router: Router) {
    this.custData = this.router.getCurrentNavigation()?.extras;
    if (router.url.includes('view')) {
      this.isView = true;
    }

  }

  ngOnInit(): void {
    if (this.custData && this.custData.id) {
      this.mode = 'Edit';
    } else {
      this.mode = 'Add';
    }

    if (this.mode === 'Add') {
      this.addForm = this.fb.group({
        type: [{ value: '', disabled: false }, [Validators.required]],
        value: [{ value: '', disabled: false }, [Validators.required, Validators.pattern(RegularExpression.BLOCKVALUE)]],
        status: [{ value: '', disabled: false }, [Validators.required]],
        blockSMS: [{ value: '', disabled: false }],
        txnType: [{ value: '', disabled: false }, [Validators.required]],
        reason: [{ value: '', disabled: false }, [Validators.pattern(RegularExpression.REASON)]],
      });
    } else if (this.mode === 'Edit') {
      this.addForm = this.fb.group({
        type: [{ value: this.custData.type, disabled: this.isView }, [Validators.required]],
        value: [{ value: this.custData.value, disabled: this.isView }, [Validators.required, Validators.pattern(RegularExpression.BLOCKVALUE)]],
        status: [{ value: this.custData.status, disabled: this.isView }, [Validators.required]],
        blockSMS: [{ value: this.custData.blockSMS, disabled: this.isView }],
        txnType: [{ value: this.custData.txnType, disabled: this.isView }, [Validators.required]],
        reason: [{ value: this.custData.reason, disabled: this.isView }, [Validators.pattern(RegularExpression.REASON)]],
      });
    }

  }

  onSubmit(): void {
    if (this.addForm.invalid)
      return;

    if (this.mode === 'Add') {
      let request = {
        type: this.addForm.controls["type"].value,
        value: this.addForm.controls["value"].value,
        status: this.addForm.controls["status"].value,
        blockSMS: this.addForm.controls["blockSMS"].value,
        txnType: this.addForm.controls["txnType"].value,
        reason: this.addForm.controls["reason"].value,
      };

      this.blockCustomerService.saveBlockCustomer(request).subscribe(
        res => {
          if (res.success) {
            this.router.navigate(['block-customer']);
            this.helper.raiseSuccess(res.message);
          } else {
            this.helper.raiseError(res.message);
          }
        },
      );

    } else {
      let request = {
        id: this.custData.id,
        institute: this.custData.institute,
        type: this.addForm.controls["type"].value,
        value: this.addForm.controls["value"].value,
        status: this.addForm.controls["status"].value,
        blockSMS: this.addForm.controls["blockSMS"].value,
        txnType: this.addForm.controls["txnType"].value,
        reason: this.addForm.controls["reason"].value,
        createdDate: this.custData.createdDate,
        updateDate: new Date(),
      };

      this.blockCustomerService.updateBlockCustomer(request).subscribe(
        res => {
          if (res.success) {
            this.router.navigate(['block-customer']);
            this.helper.raiseSuccess(res.message);
          } else {
            this.helper.raiseError(res.message);
          }
        },
      );
    }

  }

  onClose() {
    this.location.back();
  }

}
