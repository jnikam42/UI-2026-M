import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HelperService } from 'src/app/services/helper.service';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/user.service';
import { CustomValidators } from '../custom-validators';
import { RegularExpression } from 'src/app/shared/regular-expression';
import { ConfigData } from 'src/app/models/config_data';
import config from './../../../assets/config.json';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.scss']
})
export class ChangepasswordComponent {
  changpassword!: FormGroup;
  oldPassword_hide = true;
  newPassword_hide = true;
  confirmPassword_hide = true;
  USING_TEMP_PASS!: boolean;
  pwdPattern!: string;
  pwdRegexMsgValidation!: string;
  type: string = 'password';
  panelOpen: boolean = true;
  configData: ConfigData = config;
  strongPassword: string = config.strongPassword;

  constructor(private builder: FormBuilder, private router: Router, public userService: UserService,
    private sharedService: SharedService, private helper: HelperService, private fb: FormBuilder,) { }

    ngOnInit(): void {
      this.USING_TEMP_PASS = this.userService.userSessionData?.data?.user.userProperties.USING_TEMP_PASS === "Y";
      this.pwdPattern = this.userService.pwdRegex;
      this.pwdRegexMsgValidation = this.userService.pwdRegexMsg;
    
      this.changpassword = this.fb.group({
        oldPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.pattern(RegularExpression.STRONG_PASSWORD)]],
        confirmPassword: ['', Validators.required],
      });
    
      this.changpassword.setValidators(CustomValidators.MatchValidator('newPassword', 'confirmPassword'));
    }
    get f() { return this.changpassword.controls; }

    onSubmit() {
      if (this.changpassword.invalid) {
        return;
      }
      
      let request = {
        id: this.userService.userSessionData?.data?.user.id,
        oldPassword: this.sharedService.getEncryptedString(this.f['oldPassword'].value),
        newPassword: this.sharedService.getEncryptedString(this.f['confirmPassword'].value)
      };
      if (this.changpassword.valid) {
        this.userService.changePassword(request).subscribe(
          data => {
            if (data.success) {
              this.router.navigate(['/login']);
              this.userService.clearSessionData();
              this.helper.raiseSuccess(data.message)
            }
          },
        );
      }
    }

    passwordMatchError() {
      return (
        this.changpassword.getError('mismatch') &&
        this.changpassword.get('confirmPassword')?.touched
      );
    }

    hidePassword() {
      this.type = (this.type === 'password') ? 'text' : 'password';
      this.oldPassword_hide = this.type === 'password';
      this.newPassword_hide = this.type === 'password';
      this.confirmPassword_hide = this.type === 'password';
    }

    close() {
      this.router.navigate(["/search-transaction"]);
    }

}
