import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DashboardService } from 'src/app/services/dashboard.service';
import { HelperService } from 'src/app/services/helper.service';
import { RegularExpression } from 'src/app/shared/regular-expression';

@Component({
  selector: 'app-search-customer',
  templateUrl: './search-customer.component.html',
  styleUrls: ['./search-customer.component.scss']
})
export class SearchCustomerComponent implements OnInit {

  searchByList = {
    mobileNo: "Mobile Number",
    virtualAdd: "Virtual Address",
    accountNo: "Account Number"
  };
  mobileNoPattern: string = RegularExpression.MOBILE_NO;
  virtualAddPattern: string = RegularExpression.VPA; 
  accountNoPattern: string = RegularExpression.ACCOUNT_NO;
  searchCustForm: FormGroup;
  custData: any[] = [];
  panelOpen:boolean = true;
  showData: boolean = false;

  constructor(private fb: FormBuilder,private dashboardSer: DashboardService, private helper:HelperService) {
    this.searchCustForm = this.fb.group({
      searchByParam: ['', Validators.required],
      mobileNo: ['', [
        Validators.pattern(this.mobileNoPattern), 
        Validators.minLength(10), 
        Validators.maxLength(10)
      ]],
      virtualAdd: ['', [ 
        Validators.pattern(this.virtualAddPattern),
        Validators.maxLength(60)
      ]],
      accountNo: ['', [ 
        Validators.pattern(this.accountNoPattern),
        Validators.maxLength(20)
      ]]
    });
   }

  ngOnInit(): void {
  }

  searchParamChanged(): void {
    this.searchCustForm.get('mobileNo')?.reset();
    this.searchCustForm.get('virtualAdd')?.reset();
    this.searchCustForm.get('accountNo')?.reset();
  }

  onSearch(): void {
    let valid = this.searchCustForm;
    let checkValidData = isNullorUndefined(valid.get('mobileNo')?.value) && 
      isNullorUndefined(valid.get('virtualAdd')?.value) &&
      isNullorUndefined(valid.get('accountNo')?.value);

    if (this.searchCustForm.invalid) {
      this.showData = false;
      return;
    }
    else if (checkValidData) {
      this.showData = false;
      this.helper.raiseError('At least one search criteria is required.');
    }
    else {
      this.searchCustomer();
    }
  }

  searchCustomer(){
    const searchParam = this.searchCustForm.get('searchByParam')?.value;
    let searchValue = '';
    let callingFn = '';
    this.showData = false;

    switch (searchParam) {
      case 'mobileNo':
        searchValue = this.searchCustForm.get('mobileNo')?.value;
        callingFn = 'mobile';
        break;
      case 'virtualAdd':
        searchValue = this.searchCustForm.get('virtualAdd')?.value;
        callingFn = 'vpa';
        break;
      case 'accountNo':
        searchValue = this.searchCustForm.get('accountNo')?.value;
        callingFn = 'accountNo';
        break;
      default:
        this.helper.raiseError('Please select the parameters to search');
        return;
      }

    this.dashboardSer.getCustomers(callingFn, searchValue).subscribe(r => {
      if(r && r.success && typeof(r.data) == 'object'){
        this.custData = r.data;
        this.showData = true;
        this.panelOpen= true;

      }
      else {
        this.showData = false;
        this.helper.raiseError(r.message);
      }
    })
  }

  resetResults(): void {
    this.showData = false;
    this.custData = [];
  }

  reset(): void {
    this.resetResults();
    this.searchCustForm.reset();
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