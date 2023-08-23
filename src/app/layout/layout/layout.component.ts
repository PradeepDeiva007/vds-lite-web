import { AfterContentInit } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { ConfirmationService } from 'primeng/api';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, AfterContentInit {

  userLoggedin = false;
  username = '';
  selectedAuthority = '';
  prvAuthvalue = '';
  authorityGroups = [] as any;

  constructor(private idle: Idle, private keepalive: Keepalive, private router: Router, private appService: AppService, private confirmationService: ConfirmationService) {
    idle.setIdle(600);
    idle.setTimeout(360);
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onTimeout.subscribe(() => {
      this.logout();

    });
    idle.onTimeoutWarning.subscribe(() => {
      this.showConfirm();
    });
    keepalive.interval(15);
  }

  ngOnInit() {
    this.appService.getIsLoggedIn().subscribe(data => {
      if (data) {
        this.userLoggedin = true;
        let user = this.appService.getUserObj();
        if (user !== null) {
          this.username = user.username;
          this.selectedAuthority = user.authorityGroup;
          this.prvAuthvalue = this.selectedAuthority;
          this.appService.setAuthorityGroup(this.selectedAuthority)
          if (user.multiAuthorityGroup !== null) {
            user.multiAuthorityGroup.split(",").forEach((groupName: string) => {
              this.authorityGroups.push({ name: groupName });
            });
          }
          else {
            this.authorityGroups.push({ name: this.selectedAuthority });
          }
        } else {
          this.appService.logout()
        }
        this.idle.watch();
      }
      else {
        this.userLoggedin = false;
      }

    });
  }

  logout(): void {
    this.appService.logout();
  }

  changeAuthorityGroup(event: any) {
    if (event) {
      this.confirmationService.confirm({
        message: 'Are you sure you want to change',
        header: 'Continue',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.updateAuthorityGroup(event, this.prvAuthvalue);
        },
        reject: () => {
          this.selectedAuthority = this.prvAuthvalue;
        }
      });
    }
  }

  updateAuthorityGroup(changedAuthGrp: string, prvAuthvalue: string) {
    let userId = this.appService.getUserId();
    this.appService.postResource(`userLogin/changeAuthority?id=${userId}&authGroup=${changedAuthGrp}`, '')
      .subscribe((data) => {
        console.log(data);
        if (data !== null && data.msg.length > 0 && data.status === 'Y') {
          this.appService.setAuthorityGroup(changedAuthGrp);
          this.selectedAuthority = changedAuthGrp;
          this.prvAuthvalue = this.selectedAuthority;
        }else {
          this.selectedAuthority =  prvAuthvalue;
        }
      });
  }

  showConfirm() {
    this.confirmationService.confirm({
      message: 'Your Operation Has Time Out!',
      header: 'Continue',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.reset();
      },
      reject: () => {
        this.logout();
      }
    });
  }

  reset() {
    this.idle.watch();
  }

  ngAfterContentInit() {
    this.appService.subscribeToNotifications();
  }

}
