import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/user.service';
import { ConfigData } from 'src/app/models/config_data';
import config from './../../../assets/config.json';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HelperService } from 'src/app/services/helper.service';
import { NgxCaptchaService } from '@binssoft/ngx-captcha';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  USING_TEMP_PASS: boolean = false;
  hide = true;
  type: string = 'password';
  configData: ConfigData = config;
  welcomeMsg: string = config.welcomeMsg;
  loginRequiredForm!: FormGroup;
  otp: any;
  showCaptcha: boolean = false;
  AppStart!: any;
  version: any;
  uiVersion: string = config.uiVersion;
  @ViewChild('captcha') myChild: any;

  captchaStatus: any = null;
  captchaConfig: any = {
    length: 6,
    cssClass: 'custom',
    back: {
      stroke: "#2F9688",
      solid: "#f2efd2"
    },
    font: {
      color: "#000000",
      size: "35px"
    }
  };

  constructor(private router: Router, private http: HttpClient,
    private userService: UserService, private fb: FormBuilder, public dialog: MatDialog, private sharedService: SharedService,
    private snackBar: MatSnackBar, private helper: HelperService, private captchaService: NgxCaptchaService,) { }

  ngOnInit(): void {
    this.sharedService.who().subscribe();
    this.loginRequiredForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  ngAfterViewInit(): void {
    this.showCaptcha = true;
  }

  get f() { return this.loginRequiredForm.controls; }


  login() {
    if (this.loginRequiredForm.invalid) {
      return;
    }

    if (this.myChild.captch_input !== this.myChild.resultCode) {
      this.helper.raiseError("Please enter valid Captcha");
      return;
    }

    let password;
    password = this.sharedService.getEncryptedString(this.f['password'].value);

    this.userService.login(this.f['userName'].value, password)
      .pipe(first())
      .subscribe({
        next: data => {
          this.userService.hideSpinner();
          if (data.success) {

            let roles: any[] = this.userService.userSessionData.data['user']['roles'];
            let permissions: any[] = [];
            roles.forEach(role => {
              permissions.push(...role.permissions);
            });


            let usingTempPass: any = this.userService.userSessionData.data['user']['userProperties']['USING_TEMP_PASS'];

            if (usingTempPass == "Y") {
              this.USING_TEMP_PASS = true;
              this.router.navigate(['/change-password']);
            } else {
              this.USING_TEMP_PASS = false;
              this.router.navigate(['/search-transaction']);
            }
          } else if (data.message) {
            this.helper.raiseError(data.message);
            this.captchaReload();
          }
          else {
            this.snackBar.open("Internal server error, please try again", 'Close');
          }
        }, error: error => {
          this.userService.hideSpinner();
          this.captchaReload();
        }
      });
  }

  hidePassword() {
    this.type = (this.type === 'password') ? 'text' : 'password';
    this.hide = this.type === 'password'
  }
  getRandomNumber(min: number, max: number): number {
    const byteArray = new Uint8Array(1);
    window.crypto.getRandomValues(byteArray);
    const range = max - min;
    const max_range = 256;
    if (byteArray[0] >= Math.floor(max_range / range) * range)
      return this.getRandomNumber(min, max);
    return min + (byteArray[0] % range);
  }

  captchaReload() {
    let element: HTMLElement = document.getElementsByClassName('cpt-btn reload')[0] as HTMLElement;
    element.click();
    this.myChild.captch_input = null;
  }

}
