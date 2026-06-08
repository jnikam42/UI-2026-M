import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HelperService } from 'src/app/services/helper.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-manage-merchant-vpa',
  templateUrl: './manage-merchant-vpa.component.html',
  styleUrls: ['./manage-merchant-vpa.component.scss']
})
export class ManageMerchantVpaComponent implements OnInit {

  panelOpen: boolean = true;
  showData: boolean = false;
  dataSource!: MatTableDataSource<any>;

  constructor(private helper: HelperService, private router: Router) { }

  ngOnInit(): void { }

  add() {
    this.router.navigate(['manage-vae/add']);
  }
}
