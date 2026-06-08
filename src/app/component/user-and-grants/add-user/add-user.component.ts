import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { HelperService } from 'src/app/services/helper.service';
import { RoleService } from 'src/app/services/role.service';
import { Location } from '@angular/common';
import { Role } from 'src/app/models/role';
import { UserManagementService } from 'src/app/services/user-management.service';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/user.service';
import { RegularExpression } from 'src/app/shared/regular-expression';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent {
  stored: any = [];
  ctrlPress = false;
  isMultidragging = false;
  disabled = false;
  mode = 'Add';
  showResult!: boolean;
  userForm: FormGroup;
  userData: any;
  roles!: Array<Role>;
  availableRoles: any = [];
  assignedRoles: any[] = [];
  tList: any = [];
  existingRoles: any = [];
  mobileNo: any;
  isView = false;
  type: string = 'password';
  passwd_hide = true;
  institutes: any;


  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private fb: FormBuilder, private location: Location, private userService: UserService, private sharedService: SharedService,
    private userManageSer: UserManagementService, private roleService: RoleService, private router: Router, private helper: HelperService,

  ) {
    this.userData = this.router.getCurrentNavigation()?.extras;
    if (router.url.includes('view')) {
      this.isView = true;
    }

    this.userForm = this.fb.group({
      institute: ['', Validators.required],
      nick: ['', [Validators.required, Validators.pattern(RegularExpression.NICK)]],
      name: ['', [Validators.required, Validators.pattern(RegularExpression.USER_NAME)]],
      email: ['', [Validators.required, Validators.pattern(RegularExpression.EMAIL)]],
    })

  }

  stringifyJson(obj: any): string {
    return JSON.stringify(obj, null, 2);
  }

  ngOnInit(): void {
    this.disabled = true;

    this.getInstitute();
    this.existingRoles = this.userData.roles;

    if (this.userData && this.userData.id) {
      this.mode = 'Edit';
    } else {
      this.mode = 'Add';
    }

    if (this.mode === 'Add') {
      this.userForm = this.fb.group({
        institute: [{ value: '', disabled: false }],
        name: [{ value: '', disabled: false }],
        nick: [{ value: '', disabled: this.isView }],
        email: [{ value: '', disabled: false }],
        mobileNo: [{ value: '', disabled: false }],
        active: [{ value: false, disabled: this.isView }], 
        textPassword: [''], 
      });
    } else if (this.mode === 'Edit') {
      this.institutes = this.userData.institute.id;
      this.userForm = this.fb.group({
        institute: [{ value: this.institutes, disabled: true }],
        name: [{ value: this.userData.name, disabled: false }],
        nick: [{ value: this.userData.userID || this.userData.nick, disabled: this.isView || this.mode === 'Edit' }],
        email: [{ value: this.userData.email, disabled: this.isView }],
        mobileNo: [{ value: this.userData.mobileNo, disabled: this.isView }],
        active: [{ value: this.userData.status === 'Active', disabled: this.isView }],
        textPassword: [''],
      });
    }

    this.roleService.getAllRoles().subscribe(
      res => {
        if (this.existingRoles?.length > 0) {
          let assignedRolesArray = this.existingRoles.split(',')
          assignedRolesArray.forEach((element: any) => {
            if (res.data.find((x: any) => x.name === element).length != 0) {
              this.assignedRoles.push(res.data.find((x: any) => x.name === element))
              res.data.forEach((item: any, index: any) => {
                if (item.name === element)
                  res.data.splice(index, 1);
              })

            }
          });
          this.roles = res.data;
        } else {
          this.roles = res.data;
        }
        this.tList = res.data;
        this.availableRoles = res.data.sort((a: { name: any; }, b: { name: any; }) => { return a.name.localeCompare(b.name) });
      },
    );
  }

  getInstitute() {
    this.userManageSer.getAll().subscribe((res) => {
      this.institutes = res.data;
      if (this.mode === 'Edit' && this.userData) {
        this.userForm.controls['institute'].setValue(this.userData.institute.id);
      }
    });
  }



  search() {
    this.showResult = true;
  }

  get f() { return this.userForm.controls; }
  onSubmit() {
    const assignRole = this.assignedRoles.length;
    if (assignRole == 0) {
      this.helper.raiseError("Please select atleast one Role");
      return;
    }

    let editedRoles: any[] = [];
    this.assignedRoles.forEach(item => {
      editedRoles.push( item );
    });
    let temporaryPassword = this.sharedService.getEncryptedString(this.f['textPassword'].value);
    if (this.mode == 'Add') {
      let institute: any[] = [];
      this.assignedRoles.forEach(item => {
        editedRoles.push(  item  )

      })
      let request = {
        institute: { id: this.userForm.controls["institute"].value},
        nick: this.userForm.controls["nick"].value,
        email: this.userForm.controls["email"].value,
        name: this.userForm.controls["name"].value,
        active: this.userForm.controls["active"].value,
        textPassword: temporaryPassword, 
        password: temporaryPassword,
        roles: editedRoles,
        deleted: false,
        verified: true,
        loginAttempts: 0,
        authType: this.userData.userID ? 1 : 0
      };

      this.userManageSer.addUser(request).subscribe(
        data => {
          this.router.navigate(['user-management']);
        },

      );
      this.userService.reloadCurrentRoute();
    }
    else {
      let editedRoles: any[] = [];
      this.assignedRoles.forEach(item => {
        editedRoles.push(  item  )

      })
      let request = this.userData;
      request.email = this.userForm.controls["email"].value;
      request.name = this.userForm.controls["name"].value;
      request.password = temporaryPassword;
      request.textPassword = temporaryPassword;
      request.roles = editedRoles;
      request.active = true;
      request.deleted = false;
      request.verified = true;
      request.loginAttempts = 0;
      this.userManageSer.update(request).subscribe(
        data => {
          this.router.navigate(['user-management']);
        },
      );
    }
  }

  onClose() {
    this.router.navigate(['user-management']);
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {

      if (this.stored.length > 0) {
        event.previousContainer.data.slice(0).reverse().forEach(function (item, idx) {
          if (item.selected) {
            event.previousContainer.data.splice(event.previousContainer.data.indexOf(item), 1);

            event.container.data.splice(event.currentIndex, 0, item)
            event.container.data.forEach(function (d) {
              d.isMultidragging = false;
              d.selected = false;
            })

          }
        });
        this.stored = [];

      } else {

        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
      }

    }
  }
  test(event: any) {

    if (this.ctrlPress !== false && this.stored.length > 0) {
      for (let item of event.source.dropContainer.data) {
        if (item.selected) {
          item.isMultidragging = true;
        } else {
          item.isMultidragging = false;
        }
      }
    }

  }
  onKeyDown(e: any, item: any, data: any) {
    this.ctrlPress = e.ctrlKey;
    if (e.ctrlKey && this.stored.indexOf(item) == -1) {
      item.selected = true;
      let idx = data.indexOf(item);
      item.selected = true;
      item.index = idx;

      this.stored.push(item)

    }
    else {
      item.selected = false;
      let idx = data.indexOf(item);
      item.selected = false;
      item.index = idx;

      this.stored.pop(item)

    }
  }
}
