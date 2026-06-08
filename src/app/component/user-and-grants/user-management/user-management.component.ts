import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { UserManagementService } from 'src/app/services/user-management.service';
import { UserService } from 'src/app/services/user.service';
import { SharedService } from 'src/app/services/shared.service';
import { UserData, UserRoles } from 'src/app/models/user_data';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent {
  userData!: MatTableDataSource<any>;
  expanded = true;
  meta: any;
  showResult: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  columns: any[] = [
    { name: 'id', label: 'Id' },
    { name: 'nick', label: 'Login Id' },
    { name: 'name', label: 'Display Name' },
    { name: 'createdDate', label: 'Created Date' },
    { name: 'updatedDate', label: 'Updated Date' },
    { name: 'status', label: 'Status' },
    { name: 'action', label: 'Action' },
  ];
  roles!: UserRoles[];
  constructor(
    private formBuilder: FormBuilder,
    private userManageSer: UserManagementService,
    private router: Router,
    public dialog: MatDialog,
    private userService: UserService,
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.search();
  }


  search() {
    this.showResult = false;

    this.userManageSer.search('').subscribe((r) => {
      if (r?.success) { 
        const arr: UserData[] = r.data; 

        arr.forEach((obj: any) => {
          obj.status = this.getUserStatus(obj); 
          const names = obj.roles.map((item: any) => item.name);
          obj.roles = names.join(',');
        });

        this.userData = new MatTableDataSource(arr);
        this.expanded = false;
        this.showResult = true;
        this.userData.paginator = this.paginator; 
        this.userData.sort = this.sort; 
      }
    });
  }

  private getUserStatus(obj: any): string {
    if (obj.loginAttempts >= 3) {
      return 'Locked';
    } else if (obj.active) {
      return 'Active';
    } else {
      return 'Inactive';
    }
  }

  add() {
    this.router.navigate(['user-management/add']);
  }

  edit(id: any) {
    this.router.navigate([`user-management/edit/${id}`], this.userData.filteredData.find((r) => r.id == id));
  }

  view(id: any) {
    this.router.navigate([`user-management/view/${id}`], this.userData.filteredData.find((r) => r.id == id));
  }
  
  delete(id: any) {
    let dialogRef = this.dialog.open(DialogComponent, {
      width: "300px",
      data: { "msg": "Do you really want to delete the user?", "type": "confirm" },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userManageSer.deleteUser(id).subscribe(res => {
          this.search();
        })
      }
    });
  }
}
