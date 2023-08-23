import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ShipmentService } from '@shared/shipment.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { AppService } from 'src/app/app.service';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-cancel-shipment-plan-approval',
  templateUrl: './cancel-shipment-plan-approval.component.html',
  styleUrls: ['./cancel-shipment-plan-approval.component.scss']
})
export class CancelShipmentPlanApprovalComponent implements OnInit, OnDestroy {

  authGroup = '';
  spno = '';
  subscription: Subscription;
  shipmentplano: string[] = [];
  value: string[] = [];
  approval = 'approval';
  tableWidth: string = '';
  test = false;
  selectplanno: string[] = [];
  errorMsg: string = '';
  approvalcomment: string;
  userId: string;
  userRole: string;
  result: boolean = false;

  constructor(private shipmentService: ShipmentService, public appService: AppService, private spinner: NgxSpinnerService, private route: Router, private confirmationService: ConfirmationService, private router: ActivatedRoute) {
  }

  search(authGroup: string): void {
    this.spinner.show();
    this.shipmentplano = [];
    this.subscription = this.shipmentService.getcancelShipmentPlanapprovalWaiting(this.authGroup,this.userId).subscribe(data => {
      if (data.length > 0) {
        this.userRole = data[0].split('~')[1];
        let j = 0;
        for (let i in data) {
          this.shipmentplano[j++] = data[i].split('~')[0]
        }
        this.test = false;
      } else {
        this.shipmentplano = []
        this.testingmethod()
      }
      this.spinner.hide();
    },
      error => {
        this.spinner.hide();
      });
  }
  testingmethod() {
    this.test = true
  }

  ngOnInit(): void {
    this.approvalcomment = '';
    this.shipmentplano = [];
    this.spno = '';
    this.subscription = this.router.queryParams.subscribe((param: Params) => {
      if (param['plan'] != undefined) {
        if (param['plan'].length != 0) {
          this.value = param['plan']
        }
      }
    })
    this.subscription = this.appService.getAuthorityGroup().subscribe(
      (groupName) => {
        this.authGroup = groupName;
        this.userId = this.appService.getUserId();
        if (this.authGroup.length !== 0) {
          this.search(this.authGroup)
        }
      }
    );
  }

  select() {
    console.log(this.value)
  }

  pagetablewidth() {

    let largest = '';
    for (let item of this.shipmentplano) {
      if (item.length > largest.length) largest = item
    }
    console.log(largest)
    this.tableWidth = largest.length > 15 ? 'width:200px;' : 'width:130px;'
  }

  approveshipmentplan() {
    this.spinner.show()
    if (this.value.length == 0) {
      this.spinner.hide()
      this.alertPopupToDisplay('Please select atleast one shipment plan no to approve')
    } else if (this.approvalcomment.length == 0) {
      this.spinner.hide()
      this.alertPopupToDisplay('Please give approval comments to approve/reject')
    } else {
      this.confirmPopupToDispay('Alert', 'Do you want to approve the selected Shipment Plan', 'approvePlan')
    }
  }

  approveCancelShipmentPlan() {
    this.spinner.show();
    this.shipmentService.CancelApproveShipmentPlan(this.authGroup, this.userId, this.value, this.approvalcomment)
      .subscribe((data) => {
        this.approvalcomment = '';
        this.spinner.hide();
        if (data.status === 'Y') {
          let successplanno = data.msg.split('.')
          let sendPlanNo = successplanno[0].split(',')
          this.sendNotification(sendPlanNo)
          this.confirmationService.confirm({
            message: data.msg,
            icon: 'null',
            header: 'Message',
            acceptLabel: 'OK',
            rejectVisible: false,
            accept: () => {
              this.search(this.authGroup)
            }
          });
        } else if (data.msg.includes('Error') && data.status === 'N') {
          this.spinner.hide();
          this.errorMsg = data.msg
        }
      },
        error => {
          this.spinner.hide();
        })
  }



  RejectShipementPlan() {
    if (this.value.length == 0) {
      this.alertPopupToDisplay('Please select atleast one shipmentplan to reject')
    } else if (this.approvalcomment.length == 0) {
      this.spinner.hide()
      this.alertPopupToDisplay('Please give approval comments to approve/reject')
    } else {
      this.confirmPopupToDispay('Warning', 'Do you want to cancel the selected Shipment Plan', 'cancelPlan')
    }
  }

  rejectCancelShipmentPlan() {
    this.spinner.show();
    this.shipmentService.cancelRejectShipmentPlan(this.authGroup, this.userId, this.value, this.approvalcomment)
      .subscribe((data) => {
        this.spinner.hide();
        if (data.status === 'Y') {
          let successplanno = data.msg.split('.')
          let sendPlanNo = successplanno[0].split(',')
          this.sendNotification(sendPlanNo)
          this.confirmationService.confirm({
            message: data.msg,
            header: 'Message',
            acceptLabel: 'OK',
            rejectVisible: false,
            accept: () => {
              this.search(this.authGroup)
            }
          });
        } else if (data.msg.includes('Error') && data.status === 'N') {
          this.spinner.hide();
          this.errorMsg = data.msg
        }
      },
        error => {
          this.spinner.hide();
        })
  }

  sendNotification(planno: string[]): any {
    this.appService.sendNotificationToUser('approval', planno).subscribe((data) => {
      this.result = data;
      if(this.result){
        console.log('Successfully notification send to User');
      }else {
        console.log('Failed to send Notification');
      }
    },
      error => {
        this.result =  false;
      })
  }

  moveToSummaryChartPlan(msg: string) {
    if (this.value.length != 0) {
      if (msg === 'SummaryChartPlan1') {
        this.route.navigate(['/summarychartplan1'], { queryParams: { planNo: this.value, screenType: 'CancelApproval' } });
      } else if (msg === 'SummaryChartPlan2') {
        this.route.navigate(['/summarychartplan2'], { queryParams: { planNo: this.value, screenType: 'CancelApproval' } });
      }
    } else {
      this.alertPopupToDisplay('Please select Shipment Plan No');
    }
  }

  alertPopupToDisplay(displayMsg: string) {
    this.confirmationService.confirm({
      message: displayMsg,
      header: 'Message',
      acceptLabel: 'OK',
      rejectVisible: false,
      accept: () => {

      }
    });
  }

  confirmPopupToDispay(headerMsg: string, confirmMsg: string, keyValue: string) {
    this.confirmationService.confirm({
      message: confirmMsg,
      header: headerMsg,
      icon: 'pi pi-question-circle',
      accept: () => {
        if (keyValue === 'approvePlan') {
          this.approveCancelShipmentPlan();
        } else if (keyValue === 'cancelPlan') {
          this.rejectCancelShipmentPlan();
        }
      },
      reject: () => {
        this.spinner.hide();
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}