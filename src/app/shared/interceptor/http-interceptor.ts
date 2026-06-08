import { Injectable, Injector } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { UserService } from '../../services/user.service';
import { SharedService } from 'src/app/services/shared.service';
import { HelperService } from 'src/app/services/helper.service';
import config from './../../../assets/config.json';

@Injectable()
export class HttpCallInterceptor implements HttpInterceptor {
  separator: any;
  getModifiedUrl: any;
  institute: string = config.institute;
  channel: string = config.channel;

  constructor(
    private userService: UserService,
    private helper: HelperService,
    private sharedService: SharedService
  ) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.userService.show();
    const admin = this.userService.userSessionData;

    if (request.method == 'POST' || request.method == 'PATCH' || request.method == 'PUT' || request.method == 'DELETE') {
      let encryptedBody = this.sharedService.getEncryptedString(JSON.stringify(request.body));
      if (admin && admin.data && admin.data.ck && admin.data.sk && this.sharedService.wk) {
        if (request.url?.includes('bulk-upload')) {
          request = request.clone({
            setHeaders: {
              ck: admin.data.ck,
              sk: admin.data.sk,
              institute: this.institute,
              channel: this.channel,
            },
          });
        } else if (request.url?.includes('store')) {
          request = request.clone({
            setHeaders: {
              ck: admin.data.ck,
              sk: admin.data.sk,
              institute: this.institute,
              channel: this.channel,
              uer: this.channel,
            },
          });
        } else
          request = request.clone({
            setHeaders: {
              ck: admin.data.ck,
              sk: admin.data.sk,
              wk: this.sharedService.wk,
              institute: this.institute,
              channel: this.channel,
            },
          });
      } else if (this.sharedService.wk) {
        request = request.clone({
          setHeaders: {
            wk: this.sharedService.wk,
            institute: this.institute,
            channel: this.channel,
          },
        });
      }
    } else {
      if (
        admin &&
        admin.data &&
        admin.data.ck &&
        admin.data.sk &&
        this.sharedService.wk
      ) {

        request = request.clone({
          setHeaders: {
            ck: admin.data.ck,
            sk: admin.data.sk,
            wk: this.sharedService.wk,
            institute: this.institute,
            channel: this.channel,
          },
        });
      } else if (this.sharedService.wk) {
        request = request.clone({
          setHeaders: {
            wk: this.sharedService.wk,
            institute: this.institute,
            channel: this.channel,
          },
        });
      }
    }

    return next.handle(request).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          if (event.body && event.body['payloadResponse']) {
            event = event.clone({
              body: JSON.parse(
                this.sharedService.getDecryptedData(
                  event.body['payloadResponse']
                )
              ),
            });
          }
          if (
            event.body &&
            event.body.success &&
            request.method !== 'GET' &&
            event.body?.message
          ) {
            this.helper.raiseSuccess(event.body?.message);
          }
          this.userService.hideSpinner();
        }
      }),
      catchError((error: HttpErrorResponse) => {
        this.userService.hideSpinner();
        var errObj;
        if (error.error && error.error.payloadResponse) {
          errObj = JSON.parse(
            this.sharedService.getDecryptedData(error.error.payloadResponse)
          );
        }
        if (error.status === 403) {
          this.userService.logout();
        } else if (errObj && errObj.message) {
          this.helper.raiseError(errObj.message);
        } else if (error.error && error.error.message)
          this.helper.raiseError(error.error.message);
        else if (error.status === 304) {
          this.helper.raiseError('No Changes in Data');
          setTimeout(() => {
            window.close();
          }, 3000);
        } else if (error.status === 400) {
          this.helper.raiseError('Some fields have invalid data');
        } else if (error.status === 500 && request.url.includes('logout')) {
          this.helper.raiseError('Session expired!');
        } else if (error.status === 500) {
          this.helper.raiseError('Internal server error');
        } else {
          this.helper.raiseError(error.statusText);
        }
        const err = error.error ? error.error.message : error.statusText;
        return throwError(err);
      })
    );
  }
}
