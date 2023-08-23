import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { spno } from '@shared/model';
import { ShipmentService } from '@shared/shipment.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { AppService } from 'src/app/app.service';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-shipment-plan-approval',
  templateUrl: './shipment-plan-approval.component.html',
  styleUrls: ['./shipment-plan-approval.component.scss']
})
export class ShipmentPlanApprovalComponent implements OnInit, OnDestroy {

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
  userRole: string = '';
  result: boolean = false;

  constructor(private shipmentService: ShipmentService, public appService: AppService, private spinner: NgxSpinnerService, private route: Router, private confirmationService: ConfirmationService, private router: ActivatedRoute) {
  }

  search(authGroup: string): void {
    this.spinner.show();
    this.shipmentplano = [];
    this.subscription = this.shipmentService.getShipmentPlanapprovalWaiting(this.authGroup,this.userId).subscribe(data => {
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
  // selectedvalue(checkValue: any) {
  //   let selectValue = checkValue.value
  //   if (checkValue.checked) {
  //     this.value.push(selectValue)
  //   } else {
  //     this.value = this.value.filter(s => s !== selectValue)
  //   }
  // }
  // selectedAllvalue(selectALL: any) {
  //   this.value = selectALL
  //   console.log(this.value)
  // }
  select() {
    console.log(this.value)
  }
  pagetablewidth() {

    let largest = '';
    for (let item of this.shipmentplano) {
      if (item.length > largest.length) largest = item
    }
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

  approveSelectedShipmentPlan() {
    this.spinner.show();
    this.subscription = this.shipmentService.ApproveShipmentPlan(this.authGroup, this.userId, this.value, this.approvalcomment)
      .subscribe((data) => {
        this.spinner.hide();
        this.approvalcomment = '';
        console.log(data)
        if (data.status === 'Y') {
          let successplanno = data.msg.split('.')
          let sendPlanNo = successplanno[0].split(',')
          this.sendNotification(sendPlanNo)
          this.confirmationService.confirm({
            message: data.msg,
            header: 'Message',
            icon: 'null',
            acceptLabel: 'OK',
            rejectVisible: false,
            accept: () => {
              this.approvalcomment = '';
              this.value = [];
              this.search(this.authGroup)
            }
          });
        } else if (data.msg.includes('Error') && data.status === 'N') {
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

  cancelShipmentPlan() {
    this.spinner.show();
    this.shipmentService.RejectShipementPlan(this.authGroup, this.userId, this.value, this.approvalcomment)
      .subscribe((data) => {
        this.spinner.hide();
        if (data.status === 'Y') {
          let successplanno = data.msg.split('.')
          let sendPlanNo = successplanno[0].split(',')
          this.sendNotification(sendPlanNo)
          this.confirmationService.confirm({
            message: data.msg,
            header: 'Message',
            icon: 'null',
            acceptLabel: 'OK',
            rejectVisible: false,
            accept: () => {
              this.approvalcomment = '';
              this.value = [];
              this.search(this.authGroup)
            }
          });
        } else if (data.msg.includes('Error') && data.status === 'N') {
          this.errorMsg = data.msg
        }
      },
        error => {
          this.spinner.hide();
        })
  }

  sendNotification(planno: string[]) {
    this.appService.sendNotificationToUser('approval', planno).subscribe((data) => {
      this.result = data;
      if(this.result){
        console.log('Successfully notification send to User');
      }else {
        console.log('Failed to send Notification');
      }
    },
      error => {
       this.result = false;
      })
  }

  moveToSummaryChartPlan(msg: string) {
    if (this.value.length != 0) {
      if (msg === 'SummaryChartPlan1') {
        this.route.navigate(['/summarychartplan1'], { queryParams: { planNo: this.value, screenType: 'Approval' } });
      } else if (msg === 'SummaryChartPlan2') {
        this.route.navigate(['/summarychartplan2'], { queryParams: { planNo: this.value, screenType: 'Approval' } });
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
          this.approveSelectedShipmentPlan();
        } else if (keyValue === 'cancelPlan') {
          this.cancelShipmentPlan();
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
