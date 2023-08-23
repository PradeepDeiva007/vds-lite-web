import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment as env } from 'src/environments/environment';
import { tap } from 'rxjs/operators';
import { Idle } from '@ng-idle/core';
import { Router } from '@angular/router';
import { SwPush } from '@angular/service-worker';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private authGroup = new BehaviorSubject("");
  private userLoggedIn = new BehaviorSubject<boolean>(false);
  private validUser = null;

  private readonly vapidKeys: string = `BIGHUxf8cs4MkZQmTkbCLbSyzb427pK3pZjvgGcfNc0G0DXSFiYQCU93XCwgXUI43jD6K9_SJGc6f0qz5Y79O8M`;

  constructor(private oauthService: OAuthService, private http: HttpClient, private idle: Idle, private router: Router, private swPush: SwPush) {
    this.oauthService.configure(new AuthConfig())
    this.oauthService.setStorage(sessionStorage);
    this.oauthService.tryLogin({});
    if (this.isLoggedIn()) {
      this.userLoggedIn.next(true);
    }
  }
  isLoggedIn() {
    if (this.oauthService.getAccessToken() === null) {
      return false;
    }
    return true;
  }

  loginDirect() {
    //sessionStorage.setItem('access_token', '123');
    return this.getResource('user/');
  }

  obtainAccessToken() {
    this.oauthService.initImplicitFlow();
  }

  getAccessToken() {
    return sessionStorage.getItem('access_token');
  }

  getUserName() {
    const userName = sessionStorage.getItem('user_info');
    return userName !== null ? JSON.parse(userName)['username'] : '';
  }

  getUserId(){
    const userId = sessionStorage.getItem('user_info');
    return userId !== null ? JSON.parse(userId)['id'] : '';
  }
  getUserObj() {
    const userName = sessionStorage.getItem('user_info');
    return userName !== null ? JSON.parse(userName) : null;
  }

  logout() {
    this.idle.stop();
    this.oauthService.logOut();
    this.userLoggedIn.next(false);
    sessionStorage.removeItem('user_info');
    this.router.navigate(['']);
  }

  login(formData: any,process: boolean) {
    sessionStorage.setItem('access_token', '123');
    if(process){
      return this.getResource('user/' + formData['username'].toUpperCase());
    }else {
      return this.getResource('userLogin/' + formData);
    }
  }

  setLoggedUser(data: any) {
    sessionStorage.setItem('user_info', JSON.stringify(data));
    this.setAuthorityGroup(data.authorityGroup);
    this.idle.watch();
    this.userLoggedIn.next(true);
    this.router.navigate(['']);
  }

  getResource(requestUrl: string): Observable<any> {
    return this.http.get(env.resturl + requestUrl, {
      headers: new HttpHeaders()
    }).pipe(
      tap(
        success => console.log('success'),
        error => {
          console.log("error -> ", this.http.get('status'));
          if (error instanceof HttpErrorResponse && error.status === 403) {
            console.log(`error status : ${error.status} ${error.statusText}`);
          }
        }));
  }
  postResource(requestUrl: string, formData: any): Observable<any> {
    return this.http.post(env.resturl + requestUrl, formData).pipe(
      tap(
        success => console.log('success'),
        error => {
          console.log("error", error);
          if (error instanceof HttpErrorResponse && error.status === 403) {
            console.log(`error status : ${error.status} ${error.statusText}`);
          }
        }));
  }

  setAuthorityGroup(groupName: string) {
    this.authGroup.next(groupName);
  }

  getAuthorityGroup(): Observable<string> {
    return this.authGroup.asObservable();
  }

  getIsLoggedIn(): Observable<boolean> {
    return this.userLoggedIn.asObservable();
  }

  getTableWidth(tableData: Array<any>, rowName: string) {
    return tableData.reduce((a, b) => a[rowName].length > b[rowName].length ? a : b).length > 10 ? 'width:200px' : 'width:170px';
  }

  subscribeToNotifications() {
    if (this.swPush.isEnabled) {
      this.swPush.requestSubscription({
        serverPublicKey: this.vapidKeys
      }).then(sub => {
        this.sendEndpointData(sub, this.getUserId());
      })
        .catch(err => console.error('Could not subscribe to notifications', err));
    }
  }

  sendEndpointData(subscription: any, user_id: string) {
    let value = JSON.parse(JSON.stringify(subscription));
    let postData = { userId: user_id, endpoint: value.endpoint, p256dhkey: value?.keys?.p256dh, authKey: value?.keys?.auth };
    this.getDataFormat(postData);
  }

  getDataFormat(data:any){
    this.postResource('notification/subscribe',data).subscribe((data)=>{});
  }

  sendNotificationToUser(process?: string, shipmentPlan?:any[]){
    return this.postResource(`notification/sendNotification/${process}`,shipmentPlan);
  }

  getEnvironmentScreenAccess(){
    return this.getResource(`userLogin/access/`);
  }

}

