import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';

@Injectable()

export class SharedService {
  wk: any;
  wkAck: any;
  csrfToken: any;
  headers: HttpHeaders;

  constructor(private httpClient: HttpClient) {
    this.generateWK();
    this.generateCsrfToken();
    this.headers = new HttpHeaders();
    this.headers = this.headers.set('Institute', '0');
    this.headers = this.headers.set('Channel', 'channel');
  }

  generateWK() {
    this.wk = this.randomString(16);
  }

  generateCsrfToken() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    length = 100;
    this.csrfToken = Array.from({ length }, () => characters.charAt(Math.floor(Math.random() * characters.length)))
                                      .join('');
    return this.csrfToken;
  }

  who() {
    if (!this.wk)
      this.generateWK();
    this.headers = this.headers.set('wk', this.wk);
    this.headers = this.headers.set('X-Csrf-Token', this.generateCsrfToken());

    return this.httpClient.get<any>(`${environment.url}system/user/who`, {
      observe: 'response',
      headers: this.headers
    })
      .pipe(map(res => {
        sessionStorage.setItem('wk-ack', res.headers.get('wk-ack') || '');
        this.wkAck = this.getWkAck();

      }),
        catchError(error => {
          // Handle 403 Forbidden error
          if (error.status === 403) {
            // Implement your error handling logic here
            console.error('Access Forbidden. Check your permissions.');
          }
          return throwError(error);
        })
      );
  }

  randomString(len: number) {
    let charSet = 'ABCDEF0123456789';
    var randomString = '';

    for (var i = 0; i < len; i++) {
      var randomPoz = Math.floor(Math.random() * charSet.length);
      randomString += charSet.substring(randomPoz, randomPoz + 1);
    }
    return randomString;
  }

  getWkAck(): string {
    let storedwkack = sessionStorage.getItem('wk-ack') || '';
    var key = CryptoJS.enc.Utf8.parse(this.wk); // Shared AES KEY
    var iv = CryptoJS.enc.Utf8.parse("0000000000000000");
    var decrypted = CryptoJS.AES.decrypt(storedwkack, key, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  getEncryptedString(request: string) {
    if (!this.wkAck) {
      this.who().subscribe();
    }
    var key = CryptoJS.enc.Utf8.parse(this.wkAck.substring(0, 16)); // Shared AES KEY
    var ix = this.wkAck.substring(16, 32); // Initialization vector
    var iv = CryptoJS.enc.Utf8.parse(ix);

    var encrypted = CryptoJS.AES.encrypt(request, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
  }

  getDecryptedData(newReq: any) {

    var key = CryptoJS.enc.Utf8.parse(this.wkAck.substring(0, 16)); //Shared AES KEY
    var ix = this.wkAck.substring(16, 32); //Initialization vector
    var iv = CryptoJS.enc.Utf8.parse(ix);

    var key = CryptoJS.enc.Utf8.parse(this.wkAck); //Shared AES KEY
    var iv = CryptoJS.enc.Utf8.parse("0000000000000000");

    return CryptoJS.AES.decrypt(
      newReq, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }).toString(CryptoJS.enc.Utf8);
  }
}