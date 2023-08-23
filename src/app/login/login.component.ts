import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute,Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppService } from '../app.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit,OnDestroy {
  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    rememberMe: new FormControl(''),
  });

  invalidlogin: boolean = false;
  submitted = false;
  access_Code: string = '';
  PROD_ENV: boolean = false;
  subscription: Subscription;
  error_msg: string = '';


  constructor(private appService: AppService, private router: Router,private route: ActivatedRoute) { 
  }

  ngOnInit(): void {
    this.error_msg = '';
    this.callScreenAccess();
    if (this.appService.isLoggedIn()) {
      this.router.navigate(['/home']);
    } 
  }

  callScreenAccess(){
    this.subscription = this.appService.getEnvironmentScreenAccess().subscribe((data) =>{
      this.PROD_ENV = data;
      if(!this.PROD_ENV) {
        this.route.queryParams.subscribe((param:Params)=>{
          if (param['code'] != undefined) {
            //alert(param['code'])
            this.access_Code = param['code']
          }
        })
        if(this.access_Code.length > 0){
          this.appService.login(this.access_Code,this.PROD_ENV).subscribe(data => {
            if(data.id === null){
              alert("User do not have access in VDS system.");
              window.open(window.location.href, '_self', '');
              window.close();
            }else {
              this.appService.setLoggedUser(data);
              this.router.navigate(['/home']);
            }
          },
            error => {
              //temporarily security disabled, sent to home irrespective result 
              this.router.navigate(['/home']);
            });
        }
        else{
          /* Wechat PROD Environment URL to get Access CODE: */
          //let ProdURL = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxcee4a837d6537e35&redirect_uri=https%3A%2F%2Fvdsmobility.changanford.cn%3A8443%2Fvds-lite-web%2F&response_type=code&scope=snsapi_base&state=&connect_redirect=1#wechat_redirect';
          //window.open(ProdURL, '_self');

          /***************************************************************/

          /* Wechat QA Environment URL to get Access CODE: */
          let QAURL   = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx4d6ff0f4ef7c3748&redirect_uri=https%3A%2F%2Fvdsapp.changanford.cn%3A8443%2Fvds-lite-web%2F&response_type=code&scope=snsapi_base&state=&connect_redirect=1#wechat_redirect';
          //window.open(QAURL, '_self');
          //let url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxcee4a837d6537e35&redirect_uri=https://vdsapp.changanford.cn:8443/vds-lite-web/&response_type=code&scope=snsapi_base&state=&connect_redirect=1#wechat_redirect";
        } 
           
            // else{
              //   console.log(window.location.href);
              //   this.route.queryParams.subscribe((param:Params)=>{
              //    console.log(param['code'])
              //    if(param['code'] === undefined){    
              //       let url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxcee4a837d6537e35&redirect_uri=https%3A%2F%2Fvdsapp.changanford.cn%3A8443%2Fvds-lite-web%2F%23%2Flogin&response_type=code&scope=snsapi_base&state=&connect_redirect=1#wechat_redirect';
              //       window.open(url, '_self');
              //       console.log(window.location.href) 
              //    }
              //    console.log(window.location.href) 
              //   })
              // }
         
      }
    })
  }

  get loginFormControl() {
    return this.loginForm.controls;
  }
  onSubmit() {
    if (this.loginForm.valid) {
      this.appService.login(this.loginForm.value,this.PROD_ENV).subscribe(data => {
        if(data.id === null){
          this.error_msg = 'User do not have access in VDS system.';
        }else {
          this.appService.setLoggedUser(data);
          this.router.navigate(['/home']);
        }
      },
        error => {
          //temporarily security disabled, sent to home irrespective result 
          this.router.navigate(['/home']);
        });

    }
  }
  

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
