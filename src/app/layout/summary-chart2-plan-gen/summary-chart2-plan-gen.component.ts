import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SummaryChart_1 } from '@shared/model';
import { ShipmentService } from '@shared/shipment.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-summary-chart2-plan-gen',
  templateUrl: './summary-chart2-plan-gen.component.html',
  styleUrls: ['./summary-chart2-plan-gen.component.scss']
})
export class SummaryChart2PlanGenComponent implements OnInit {

  chartedDetails: SummaryChart_1[] = []
  cityDetails: SummaryChart_1[] = [];
  headerList: any[]
  subcription: Subscription
  total: number[] = []
  lastValue: number
  columnCount = [1, 2]
  planNo:string[]
  screenType:string

  constructor(private shipmentService: ShipmentService, private route: Router, private spinner: NgxSpinnerService,
    private appService: AppService,private router: ActivatedRoute) { 
      this.router.queryParams.subscribe((param:Params)=>{
        if (param['planNo'] != undefined) {
          if (param['planNo'].length === 0) {
            this.route.navigate(['/shipmentplanapproval'])
          }
        }
        this.planNo = param['planNo']
        this.screenType = param['screenType']
      })
    }

  ngOnInit(): void {
    this.subcription = this.appService.getAuthorityGroup().subscribe(
      (groupName) => {
        this.total = []
        this.searchResource(groupName)
      }
    )
  }

  searchResource(authGroup: string) {
    this.spinner.show();
    this.subcription = this.shipmentService.getSummaryChartPlan("2", authGroup.toUpperCase(),this.planNo,this.screenType).subscribe((data) => {
      if (data.length === 0 && this.screenType==='Generation') {
        this.route.navigate(['/shipmentplanGen'])
      }else if(data.length === 0 && this.screenType==='Approval'){
        this.route.navigate(['/shipmentplanapproval'])
      }else if(data.length === 0 && this.screenType==='CancelApproval'){
        this.route.navigate(['/cancelshipmentapproval'])
      }
      this.chartedDetails = data
      this.headerList = [... new Set(this.chartedDetails.map(s => s.city))];
      this.headerList.sort((n1, n2) => n1.localeCompare(n2));
      this.headerList.forEach((s) => { this.columnCount.push(3) })
      this.cityDetails = [...new Map(this.chartedDetails.map(item => [item.transportMode, item])).values()]
      for (let i = 0; i < this.cityDetails.length; i++) {
        let count = 0
        this.cityDetails[i].sourceCity?.forEach(e => {
          var v = e.split("~")
          count += (Number(v[1]));
        })
        this.cityDetails[i].totalCount = count;
      }
      this.finsTotalCount(this.headerList.length)
      this.spinner.hide();
    },
      error => {
        this.spinner.hide();
      })
  }

  back() {
    this.route.navigate(['/shipmentplanGen'])
    if (this.screenType === 'Generation') {
      this.route.navigate(['/shipmentplanGen'])
    } else if(this.screenType === 'Approval'){
      this.route.navigate(['/shipmentplanapproval'],{ queryParams: {plan:this.planNo }})
    } else{
      this.route.navigate(['/cancelshipmentapproval'],{ queryParams: {plan:this.planNo }})
    }
  }

  finsTotalCount(headerCount: number) {

    let count = 0
    for (let i = 0; i < headerCount; i++) {
      for (let j = 0; j < this.cityDetails.length; j++) {
        let value: any = this.cityDetails[j].sourceCity
        if (value[i] !== undefined) {
          let c = value[i].split("~")
          count += (Number(c[1]))
        }
      }
      if (count !== 0) {
        this.total.push(count)
      }
      count = 0
    }
    let totalValue = 0
    this.total.forEach(s => {
      totalValue += s
    })
    this.total.push(totalValue)
    this.lastValue = this.total.length

    this.cityDetails.push({ transportMode: 'Total', values: [] = this.total })
  }

  ngOnDestroy(): void {
    this.subcription.unsubscribe();
  }

}

