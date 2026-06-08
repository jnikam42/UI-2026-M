import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { RoleService } from 'src/app/services/role.service';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-role-management',
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.scss']
})
export class RoleManagementComponent {
  displayedColumns!: any[];
  dataSource!: MatTableDataSource<any>;
  showResult: boolean = false;
  meta: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(public dialog: MatDialog, private role: RoleService, private router: Router, public dialogg: MatDialog, private roleop: RoleService, private helperService: HelperService) { }


  ngOnInit(): void {
    this.displayedColumns = this.roleop.roleColumns;
    this.loadRoles();
  }

  loadRoles() {
    this.role.getAllRoles().subscribe(res => {
      const data = res?.data?.map((x: any) => {
        x.permission = x?.permissions?.map((y: any) => y.value).join(', ');
        return x;
      });
      this.dataSource = new MatTableDataSource(data);
      this.showResult = true;
    }
    );
  }

  edit(id: any) {
    this.router.navigate([`role-management/edit/${id}`], this.dataSource.filteredData.find(r => r.id == id));
  }

  view(id: any) {
    this.router.navigate([`role-management/view`]);
    const selectedRecord = this.dataSource.filteredData.find(r => r.id === id);
  }


  get() {
    this.role.getAllRoles().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        this.helperService.raiseError("Error while fetching the data");
      }
    });
  }

  delete(id: any) {
    const dialogRef = this.dialogg.open(DialogComponent, {
      width: "300px",
      data: { msg: "Do you really want to delete the role?", type: "confirm" }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.roleop.deleteRole(id).subscribe(res => {
          if (res?.success) {  
            this.ngOnInit();
            this.dialogg.open(DialogComponent, {
              width: "300px",
              data: { msg: "Role has been deleted successfully", type: "info" }
            });
          }
        });
      }
    });
  }


  add() {
    this.router.navigate(["role-management/add"]);

  }
}
