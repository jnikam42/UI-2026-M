import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ManageMerchantService } from 'src/app/services/manage-merchant.service';
import { HelperService } from 'src/app/services/helper.service';
import { RegularExpression } from 'src/app/shared/regular-expression';

@Component({
  selector: 'app-add-merchant-vpa',
  templateUrl: './add-merchant-vpa.component.html',
  styleUrls: ['./add-merchant-vpa.component.scss']
})
export class AddMerchantVpaComponent {

  addForm: FormGroup;
  respData: any;
  constructor(private manageMerchantService: ManageMerchantService, private helper: HelperService, private fb: FormBuilder,
    private router: Router, private location: Location) {
    this.addForm = this.fb.group({
      merchantVpa: ['', [Validators.required, Validators.pattern(RegularExpression.VPA)]],
    });
  }

  onSubmit() {
    if (this.addForm.invalid) {
      this.helper.raiseError("Please Enter Valid Inputs");
      return;
    }
    let vpa = this.addForm.value.merchantVpa;
    this.manageMerchantService.verifyMerchant(vpa).subscribe(
      res => {
        this.respData = res;
        if (res.success) {
          this.helper.raiseSuccess(this.respData.data);
        } else {
          this.helper.raiseError(this.respData.data);
        }
      },
    );
  }

  onClose() {
    this.location.back();
  }
}
