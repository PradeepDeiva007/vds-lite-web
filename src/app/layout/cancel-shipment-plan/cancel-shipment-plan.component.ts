import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { CancelChart, Dropdown } from '@shared/model';
import { AppService } from 'src/app/app.service';
import { ShipmentService } from '@shared/shipment.service';
import { ConfirmationService } from 'primeng/api';
import {DropdownModule} from 'primeng/dropdown';
@Component({
  selector: 'app-cancel-shipment-plan',
  templateUrl: './cancel-shipment-plan.component.html',
  styleUrls: ['./cancel-shipment-plan.component.scss']
})
export class CancelShipmentPlanComponent implements OnInit {
 
  shipmentplano: Dropdown[]=[];
  selectedSP : Dropdown;
  cities: Dropdown[] = [];
  transportModes: Dropdown[] = [];
  locationList: Dropdown[] = [];
  vlspList: Dropdown[] = [];
  loadList: Dropdown[] = [];
  quantityList: Dropdown[] = []
  selectedCity = [];
  selectedVlsp = [];
  selectedtransport = [];
  selectedLoad = [];
  selectedlocation = [];
  runOptions: string[] = [];
  subscription: Subscription;
  cancelChart: CancelChart[] = [];
  authGroup = '';
  plan = '';
  totalQuantity: number;
  totalVins: number;
  planNo?: string;
  message = false;
  errorMessage = false;
  errorMsgValue = "";
  cancelPlanNo = '';
  userId: string;
  approvalcomment:string;

  constructor(private shipmentService: ShipmentService, public appService: AppService, private spinner: NgxSpinnerService, private confirmationService: ConfirmationService) {
  }

  ngOnInit(): void {
    this.subscription = this.appService.getAuthorityGroup().subscribe(
      (groupName) => {
        this.authGroup = groupName;
        this.userId = this.appService.getUserId();
        this.cancelChart = [];
        this.errorMessage = false;
        this.message = false;        
        this.loadcancelSP();
      }
    );
  }

  searchPlan(plan:any) {
    // console.log("planno"+ JSON.stringify(this.selectedSP) + plan)
    if(plan !== undefined){
      this.search(plan.name)
      this.approvalcomment = ''
    }else {
      this.confirmationService.confirm({
        message: 'Please select atleast one Shipment Plan No',
        header: 'Warning',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'OK',
        rejectVisible: false,
        accept: () => {
          
        }
      });
    }
  }
  loadcancelSP()
  {
    this.spinner.show();
    this.subscription = this.shipmentService.loadcancelShipmentPlan(this.authGroup).subscribe(data=>{
      this.spinner.hide();
      this.shipmentplano = []
      if(data.length>0)
      {
        let value : string[] = data;
        this.shipmentplano = [...new Set(value.map(s => s))].map(name => ({ name }))
        this.spinner.hide();
      }
    },error => {
      this.spinner.hide();
    })
  }

  CancelSP(cancel: HTMLInputElement) {
    this.spinner.show();
    console.log(cancel.value)
    if ((cancel.value).length === 0) {
      this.confirmationService.confirm({
        message: 'Mandatory to enter reason',
        header: 'Warning',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'OK',
        rejectVisible: false,
        accept: () => {
          
        }
      });
      this.spinner.hide();
    } else {
      if (this.cancelChart.length !== 0) {
        console.log(this.cancelChart)
        this.planNo = this.cancelChart[0].shipmentNo
        this.errorMessage = false;

        this.shipmentService.postcancelPlan(this.planNo, this.authGroup, this.userId, this.approvalcomment).subscribe((data) => {
          console.log(data)
          this.spinner.hide();
          if (data.status === 'Y') {
            if (this.sendNotification() === true) {
              console.log("Successfully send message to Manager")
            }
            this.spinner.hide();
            this.confirmationService.confirm({
              message: data.msg,
              header: 'Success',
              icon: 'null',
              acceptLabel: 'OK',
              rejectVisible: false,
              accept: () => {
                this.cancelChart = [];
                this.cancelPlanNo = '';
                this.loadcancelSP();
              }
            });
          } else {
            this.errorMessage = true;
            this.errorMsgValue = data.msg;
          }
        },
          error => {
            this.spinner.hide();
          })
      }

    }
  }

  search(plan: string): void {
    this.spinner.show();
    this.errorMessage = false;
    this.shipmentService.searchCancel(this.authGroup, plan).subscribe(data => {
      if (data.length === 0) {
        this.cancelChart = data;
        this.message = true;
      } else {
        this.cancelChart = data;
        this.message = false;
        this.initDropdownValues();
      }
      this.spinner.hide();
    },
      error => {
        this.spinner.hide();
      });
  }
  initDropdownValues() {
    this.loadList = [...new Set(this.cancelChart.map(s => s.loadNo))].map(name => ({ name }))
    this.cities = [...new Set(this.cancelChart.map(s => s.city))].map(name => ({ name }))
    this.locationList = [...new Set(this.cancelChart.map(s => s.plannedLocation))].map(name => ({ name }))
    this.transportModes = [...new Set(this.cancelChart.map(s => s.transportMode))].map(name => ({ name }))
    this.vlspList = [...new Set(this.cancelChart.map(s => s.vlsp))].map(name => ({ name }));
    this.quantityList = [...new Set(this.cancelChart.map(s => s.quantity))].map(name => ({ name }))
    this.calculateTotalQuantity();
  }
  calculateTotalQuantity() {
    let total = 0
    for (let plan of this.cancelChart) {
      total += (Number(plan.quantity))
    }
    this.totalQuantity = total
    this.totalVins = total
  }

  sendNotification(): any { 
    let shipmentPlan: any = []
    shipmentPlan.push(this.planNo)
    this.appService.sendNotificationToUser("Cancel_plan", shipmentPlan).subscribe((data) => {
     let returnValue:boolean = data
      return returnValue;
    },
    error => {
      return false;
    })
  }

  changeTotalQuantity(event: any) {

    let selectList: CancelChart[] = event.filteredValue

    let total = 0
    if (selectList.length > 0) {
      for (let list of selectList) {
        total += (Number(list.quantity))
      }
      this.totalQuantity = total
    } else {
      this.totalQuantity = 0
    }

  }
}

