import { error } from '@angular/compiler/src/util';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Dropdown, ExportExcel, InvalidList, SummaryChart } from '@shared/model';
import { ShipmentService } from '@shared/shipment.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AppService } from 'src/app/app.service';
import { Router } from '@angular/router';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-shipment-plan-generation',
  templateUrl: './shipment-plan-generation.component.html',
  styleUrls: ['./shipment-plan-generation.component.scss']
})
export class ShipmentPlanGenerationComponent implements OnInit, OnDestroy {

  draftPlan: SummaryChart[] = []
  loadList: Dropdown[] = []
  cities: Dropdown[] = []
  locationList: Dropdown[] = []
  transportMode: Dropdown[] = []
  vlspList: Dropdown[] = []
  quantityList: Dropdown[] = []
  runOptions: string[] = [];
  subscription: Subscription
  authGroup = ''
  totalQuantity: number
  filterQuantity: number
  shipmentPlanNo?: string
  planType?: string
  totalVins?: string
  totalDeliveryCost?: string
  generatedBy?: string
  selectedRows: SummaryChart[] = []
  display: boolean = false
  invalidLocationValidate: boolean = false
  invalidCityValidate: boolean = false
  invalidLocationList: InvalidList[] = []
  errorMsg: string = ''
  userId: string
  exportDraftPlanList: ExportExcel[] = []
  selectValue?: (string | undefined)[] = []
  result:boolean = false
  radioPlanType: string

  showDialog() {
    this.display = true
  }

  // selectRow(checkValue: any) {
  //   let selectValue = checkValue.value.loadNo
  //   if (checkValue.checked) {
  //     this.selectedRows.push(selectValue);
  //     this.selectedRows = [...new Set(this.selectedRows.map(s => s))];
  //   } else {
  //     this.selectedRows = this.selectedRows.filter(s => s !== selectValue)
  //   }
  // }

  constructor(private shipmentService: ShipmentService, private spinner: NgxSpinnerService, public appService: AppService, private confirmationService: ConfirmationService,
    private router: Router) { }

  ngOnInit(): void {
    this.subscription = this.appService.getAuthorityGroup().subscribe(
      (groupName) => {
        this.runOptions = []
        this.authGroup = groupName;
        this.userId = this.appService.getUserId()
        if (this.authGroup.length !== 0) {
          this.searchResource(this.authGroup)
        }
      }
    );
  }

  validateButton(id: string){
    
    if(id == 'et'){
      this.runOptions = [];
      this.runOptions.push(this.radioPlanType);
    }else {
      this.runOptions = this.runOptions.filter(x => x != this.radioPlanType)
      this.radioPlanType = ''
    }
  }

  searchResource(authGroup: string) {

    this.spinner.show();
    this.shipmentService.getDraftShipmentPlan(authGroup.toUpperCase()).subscribe((data) => {
      this.draftPlan = data;
      this.addDetailsIntoList();
      this.initDropdownValue();
      this.calculateTotalQuantity();
      this.errorMsg = ''
      this.spinner.hide();
    },
      error => {
        this.spinner.hide();
      })

  }

  initDropdownValue() {
    this.loadList = [...new Set(this.draftPlan.map(s => s.loadNo))].map(name => ({ name }))
    this.cities = [...new Set(this.draftPlan.map(s => s.city))].map(name => ({ name }))
    this.quantityList = [...new Set(this.draftPlan.map(s => s.quantity))].map(name => ({ name }))
    this.locationList = [...new Set(this.draftPlan.map(s => s.plannedLocation))].map(name => ({ name }))
    this.transportMode = [...new Set(this.draftPlan.map(s => s.transportMode))].map(name => ({ name }))
    this.vlspList = [...new Set(this.draftPlan.map(s => s.vlsp))].map(name => ({ name }));
    if (this.draftPlan.length > 0) {
      this.shipmentPlanNo = this.draftPlan[0].shipmentPlanNo;
      this.generatedBy = this.draftPlan[0].generatedBy;
      this.totalVins = this.draftPlan[0].totalVins
      this.totalDeliveryCost = this.draftPlan[0].totalDeliveryCost
      let type = this.shipmentPlanNo?.substring(2, 4)
      this.planType = type === 'FL' ? 'Full Load' : type === 'ML' ? 'Mix Load' :
        type === 'MR' ? 'Milk Run Same City' : type === 'FX' ? 'Full and Mix Load' :
          type === 'FR' ? 'Full and Milk Run Same City' : type === 'MM' ? 'Mix Load and Milk Run' : 
            type === 'XS' ? 'Expedite Transport' : 'Full, Mix and Milk Run Same City';

    }

  }

  calculateTotalQuantity() {
    let total = 0
    for (let plan of this.draftPlan) {
      total += (Number(plan.quantity))
    }
    this.totalQuantity = total
  }

  changeTotalQuantity(event: any) {

    let selectList: SummaryChart[] = event.filteredValue

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

  submitPlan() {
    this.errorMsg = ''
    this.displayPopupBeforeConfirm('Confirmation', 'Please click submit to confirm the plan', 'ConfirmProcess')
  }

  submitPlanProcess() {
    this.spinner.show();
    this.shipmentService.generateShipementPlan(this.shipmentPlanNo, this.authGroup, this.userId)
      .subscribe((data) => {
        if (data !== null && data.status === 'Y') {
          this.sendNotification();
          this.successPopupToDisplay(data.msg)
        } else if (data !== null && data.status === 'P') {
          setTimeout(()=>{
            this.alertPopupToDisplay(data.msg)
          },1000)
        } else if (data !== null && data.status === 'N' && data.msg.includes('Error')) {
          this.spinner.hide();
          this.errorMsg = data.msg
        } else {
          this.spinner.hide();
          this.errorMsg = "Error while Submit the Draft Plan"
        }
      },
        error => {
          this.spinner.hide();
        })

  }

  sendNotification(): any {
    let shipmentPlan: any = []
    shipmentPlan.push(this.shipmentPlanNo)
    this.appService.sendNotificationToUser('Confirm_Plan', shipmentPlan).subscribe((data) => {
      this.result = data;
      if(this.result){
        console.log('Successfully notification send to User');
      }else {
        console.log('Failed to send Notification');
      }
    },
      error => {
       this.result = false
      })

  }

  cancelPlan() {
    this.errorMsg = ''
    this.displayPopupBeforeConfirm('Message', ' Do you want to Cancel the Draft Plan', 'CancelProcess')

  }

  cancelPlanProcess() {
    this.spinner.show();
    this.shipmentService.cancelShipementPlan(this.shipmentPlanNo, this.authGroup, this.userId)
      .subscribe((data) => {
        if (data !== null && data.status === 'Y') {
          this.successPopupToDisplay(this.shipmentPlanNo + ' Cancelled Successfully')
        } else if (data !== null && data.status === 'P') {
          setTimeout(() => {
            this.alertPopupToDisplay(data.msg)
          },1000);
        } else if (data !== null && data.status === 'N' && data.msg.includes('Error')) {
          // this.shipmentService.setDisplayErrorMsg(data.msg)
          // this.router.navigate(['/errorView'])
          this.spinner.hide()
          this.errorMsg = data.msg
        } else {
          this.spinner.hide();
          this.errorMsg = "Error while Cancel the Draft Plan"
        }
      },
        error => {
          this.spinner.hide();
        })
  }

  removeLoad() {
    this.errorMsg = ''
    this.selectValue = this.selectedRows.map(val => val.loadNo);
    console.log(this.selectValue)
    if (this.selectedRows.length === 0 && this.selectValue.length === 0) {
      this.alertPopupToDisplay('Please select atleast one load number to remove')
    } else {
      this.displayPopupBeforeConfirm('Warning', 'Do you want to remove load from Shipment Plan', 'RemoveLoadProcess')
    }
  }

  removeLoadProcess() {
    this.spinner.show();
    this.shipmentService.removeLoadNumber(this.shipmentPlanNo, this.authGroup, this.userId, this.selectValue)
      .subscribe((data) => {
        if (data !== null && data.status === 'Y') {
          this.successPopupToDisplay(data.msg)
        } else if (data !== null && data.status === 'N' && data.msg.includes('Error')) {
          this.spinner.hide();
          this.errorMsg = data.msg
        } else {
          this.spinner.hide();
          this.errorMsg = "Error while Remove Load from Draft Plan"
        }
      },
        error => {
          this.spinner.hide();
        })
  }

  generateDraftPlan() {
    this.errorMsg = ''
    if (this.runOptions.length === 0) {
      this.alertPopupToDisplay('Please select atleast one plan to generate')
    } else {
      this.displayPopupBeforeConfirm('Alert', 'Do you want to generate shipment plan', '')
    }

  }

  generateDraftPlanProcess(process: string) {
    this.invalidLocationList = []
    this.checkValidation(false)
    this.checkCityValidation(false)
    this.spinner.show()
    this.shipmentService.createDraftPlan(this.authGroup, this.runOptions, this.userId, process).subscribe((data) => {
      if (data !== null && data.status === 'Y') {
        if (data.msg.split('~').length == 2 && data.msg.split('~')[0] == 'FinalMessage ') {
          let confirmMsg = data.msg.split("~")
          let alertValue = '';
          for (let i = 0; i < confirmMsg[1].split('.').length; i++) {
            alertValue += confirmMsg[1].split('.')[i] + '<br/>'
          }
          let displayMsg = alertValue + 'Do you really want to generate shipment plan?';
          this.callPopupToDisplay(displayMsg)
        } else if (data.msg === 'InvalidAuthority') {
          this.alertPopupToDisplay('Authority Group is not defined! So we cannot generate plan for you.')
        } else if (data.msg === 'AgeingDaysNotMaintained') {
          this.alertPopupToDisplay('Ageing Days for Days Priority is not maintained in LOV.')
        } else if (data.msg === 'NOLOADSGENERATED') {
          this.alertPopupToDisplay('No Plan Generated, Please check whether sufficient VLSP capacity and VINs are available for planning.')
        } else if (data.msg === 'NODPLOADSGENERATED') {
          this.alertPopupToDisplay('No Plan Generated, Please check whether sufficient VLSP capacity and Priority VINs are available for planning.')
        } else if (data.msg === 'ExportVinsAvailableForPlanGeneration') {
          this.callPopupToDisplay('Export VIN(s) are eligible for shipment, do you still need to continue domestic plan generation?')
        } else if (data.msg === 'constructionMode') {
          this.alertPopupToDisplay('This mode is under construction')
        } else if (data.msg.split('=').length == 2 && data.msg.split('=')[0] == 'InvalidLocation') {
          let invalidDeatils = data.msg.split('=')[1]
          let invalidLocation = invalidDeatils.split(',')
          for (let i = 0; i < invalidLocation.length; i++) {
            let details = invalidLocation[i].split("~")
            let missingdata = {
              vin: details[0],
              allocatedDealer: details[1],
              defaultVSC: details[2],
              costAtLocation: details[3],
              currentLocation: details[4]
            }
            this.invalidLocationList.push(missingdata);
          }
          this.checkValidation(true)
        } else if (data.msg.split('=').length == 2 && data.msg.split('=')[0] == 'InvalidCityVins') {
          let invalidDeatils = data.msg.split('=')[1]
          let invalidCity = invalidDeatils.split(',')
          for (let i = 0; i < invalidCity.length; i++) {
            let details = invalidCity[i].split("~")
            let missingdata = {
              destinationCity: details[0],
              sourceCity: details[1],
              distance: details[2],
              quantity: details[3],
              transportMode: details[4],
              vlsp: details[5],
              model: details[6],
              price: details[7],
              insurance: details[8],
              priceType: details[9]
            }
            this.invalidLocationList.push(missingdata);
          }
          this.checkCityValidation(true)
        } else if (data.msg.split('-')[0] === 'DRAFT') {
          this.alertPopupToDisplay(data.msg.split('-')[1])
        } else if (data.msg.split('-')[0] === 'DRAFT1') {
          this.alertPopupToDisplay(data.msg.split('-')[1])
        } else if (data.msg.split('-')[0] === 'DRAFT2') {
          this.alertPopupToDisplay(data.msg.split('-')[1])
        } else if (data.msg.split('-')[0] === 'PRICETYPE') {
          this.alertPopupToDisplay('Some of the city freight contains both Unit Price and Fixed Price, correct it before generating shipment plan.')
        } else if (data.msg === 'NOLOADSGENERATED') {
          this.alertPopupToDisplay('No Plan Generated, Please check whether sufficient VLSP capacity and VINs are available for planning.')
        } else if (data.msg === 'NODPLOADSGENERATED') {
          this.alertPopupToDisplay('No Plan Generated, Please check whether sufficient VLSP capacity and Priority VINs are available for planning.')
        } else if (data.msg === 'ExpediteVinsAvailableForPlanGeneration') {
          this.callPopupToDisplay('Expedite Transport VIN(s) are eligible for shipment, do you still need to continue Shipment plan generation?')
        }else {
          this.successPopupToDisplay('Shipment Plan is Generated.Plan Number is ' + data.msg + '. Click ok to view/confirm Plan')
        }
      } else if (data !== null && data.status === 'N' && data.msg.includes('Error')) {
        this.errorMsg = data.msg
        this.spinner.hide()
      } else {
        this.spinner.hide();
        this.errorMsg = "Error while generate Draft Plan"
      }
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  callPopupToDisplay(displayMsg: string) {
    setTimeout(() => {
      this.spinner.hide();
      this.confirmationService.confirm({
        message: displayMsg,
        header: 'Alert',
        icon: 'pi pi-question-circle',
        accept: () => {
          if (displayMsg.includes('Export VIN(s)')) {
            this.generateDraftPlanProcess('PreValidation')
          } else if (displayMsg.includes('Expedite Transport VIN(s)')){
            this.generateDraftPlanProcess('precheckExpediteValidation')
          }else {
            this.generateDraftPlanProcess('PreMasterValidation')
          }
        },
        reject: () => {
          this.runOptions = []
        }
      });
    }, 1000)
  }

  displayPopupBeforeConfirm(titleMsg: string, displayMsg: string, process: string) {
    this.confirmationService.confirm({
      message: displayMsg,
      header: titleMsg,
      icon: 'pi pi-question-circle',
      accept: () => {
        if (process === 'CancelProcess') {
          this.cancelPlanProcess()
        } else if (process === 'RemoveLoadProcess') {
          this.removeLoadProcess()
        } else if (process === 'ConfirmProcess') {
          this.submitPlanProcess()
        } else {
          this.generateDraftPlanProcess('Validation')
        }
      },
      reject: () => {
        this.runOptions = []
        this.spinner.hide()
      }
    });

  }

  alertPopupToDisplay(displayMsg: string) {
    this.spinner.hide();
    this.confirmationService.confirm({
      message: displayMsg,
      header: 'Warning',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'OK',
      rejectVisible: false,
      accept: () => {
        this.runOptions = []
        if (displayMsg.includes('Shipment Plan is Generated')) {
          this.searchResource(this.authGroup)
        }
      }
    });
  }

  successPopupToDisplay(displayMsg: string) {
    setTimeout(() => {
      this.spinner.hide();
      this.confirmationService.confirm({
        message: displayMsg,
        header: 'Message',
        icon: 'null',
        acceptLabel: 'OK',
        rejectVisible: false,
        accept: () => {
          this.searchResource(this.authGroup)
        }
      });
    }, 1000)
  }

  checkValidation(view: boolean) {
    this.spinner.hide();
    this.invalidLocationValidate = view
  }

  checkCityValidation(view: boolean) {
    this.spinner.hide();
    this.invalidCityValidate = view
  }

  getClass() {
    let value: number = Number(this.planType?.length)
    return { 'spaceSize': value >= 28, 'space': value <= 27 }
  }

  exportExcel() {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.exportDraftPlanList);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "DraftPlanDetails");
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }

  addDetailsIntoList() {
    this.exportDraftPlanList = [];
    let exportPlan: any = [];
    if (this.draftPlan.length !== 0) {
      exportPlan = this.draftPlan[0].exportDraftPlan;
      for (let i = 0; i < exportPlan.length; i++) {
        this.exportDraftPlanList.push({
          shipmentPlanNo: exportPlan[i].shipmentPlanNo,
          loadNo: exportPlan[i].loadNo,
          vin: exportPlan[i].vinNo,
          vin_Cost: exportPlan[i].vinCost,
          plannedLocation: exportPlan[i].plannedLocation,
          dealer: exportPlan[i].dealer,
          destinationCity: exportPlan[i].destinationCity,
          model: exportPlan[i].model,
          vlsp: exportPlan[i].vlsp,
          transportMode: exportPlan[i].transportMode
        })
      }
    }
  }

}
