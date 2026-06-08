import { Component, OnInit } from '@angular/core';
import { BlockCustomer, Institute } from 'src/app/models/block-customer';
import { BlockCustomerService } from 'src/app/services/block-customer.service';
import { MatTableDataSource } from '@angular/material/table';
import { HelperService } from 'src/app/services/helper.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-block-customer',
  templateUrl: './block-customer.component.html',
  styleUrls: ['./block-customer.component.scss']
})
export class BlockCustomerComponent implements OnInit {
  blockCustomerList: BlockCustomer[] = [];
  panelOpen: boolean = true;
  showData: boolean = false;
  dataSource!: MatTableDataSource<any>;
  columns!: any[];

  searchByList = {
    blockType: "Block Type",
    blockValue: "Block Value",
    status: "Status"
  };
  blockTypeDataList: any = {
    MOBILE: "Mobile No",
    VPA: "VPA",
    ACCOUNT_NUMBER: "Account No"
  };
  statusList: any = {
    A: "Active",
    B: "Block"
  };
  searchParams: any = {
    searchByParam: '',
    blockType: '',
    blockValue: '',
    status: ''
  };

  constructor(private blockCustomerService: BlockCustomerService, private helper: HelperService, private router: Router) { }

  ngOnInit(): void {
    this.columns = this.blockCustomerService.blockCustColumns;
  }

  onSubmit() {
    const { blockType, blockValue, status } = this.searchParams;
    if (!blockType && !blockValue && !status) {
      this.helper.raiseError('Please select a parameter to search and fill at least one field to search.');
      return;
    }
    else {
      this.onSearch();
    }
  }

  onSearch() {
    let searchValue = '';
    let callingFn = '';
    const param = this.searchParams.searchByParam;

    if (param === 'blockType') {
      searchValue = this.searchParams.blockType;
      callingFn = 'search-by-block-type';
    } else if (param === 'blockValue') {
      searchValue = this.searchParams.blockValue;
      callingFn = 'search-by-block-value';
    } else if (param === 'status') {
      searchValue = this.searchParams.status;
      callingFn = 'search-by-status';
    } else {
      this.helper.raiseError('Please select a parameter to search.');
      return;
    }

    this.blockCustomerService.searchBlockCustomer(callingFn, searchValue).subscribe(
      (res) => {
        this.handleResponse(res);
      },
      (error) => {
        console.error('Error fetching blockCustomer for :' + searchValue, error);
        this.helper.raiseError(
          'Error fetching blockCustomer. Please try again.'
        );
        this.onReset();
      },
    );
  }

  onReset(): void {
    this.searchParams = {
      searchByParam: '',
      institute: '',
      blockType: '',
      blockValue: '',
      status: ''
    };
    this.dataSource = new MatTableDataSource<any>([]);
    this.showData = false;
  }

  handleResponse(res: any) {
    if (res && res.success) {
      this.blockCustomerList = res.data;
      this.dataSource = new MatTableDataSource<BlockCustomer>(this.blockCustomerList);
      this.showData = true;
    } else {
      this.helper.raiseError('No Matching record found');
      this.onReset();
    }
  }

  add() {
    this.router.navigate(['block-customer/add']);
  }

  edit(id: any) {
    this.router.navigate([`block-customer/edit/${id}`], this.dataSource.filteredData.find((r) => r.id == id));
  }

  view(id: any) {
    this.router.navigate([`block-customer/view/${id}`], this.dataSource.filteredData.find((r) => r.id == id));
  }



}
