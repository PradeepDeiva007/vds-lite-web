import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SummaryChart } from '@shared/model';
import { ShipmentService } from '@shared/shipment.service';

@Component({
  selector: 'app-summary-chart2',
  templateUrl: './summary-chart2.component.html',
  styleUrls: ['./summary-chart2.component.scss']
})
export class SummaryChart2Component implements OnInit {

  summaryChart: SummaryChart[] = [{
    id: 1, loadNo: 'sdf', city: 'SHANGAI', quantity: '3',
    vlsp: 'CMAL', plannedLocation: 'CQ2VDC2', transportMode: 'Road'
  }];

  constructor(private router: Router, private shipmentService: ShipmentService) { }

  ngOnInit(): void {
    this.shipmentService.getSummaryChart('2');
  }

  back(): void {
    this.router.navigate(['/shipmentplan']);
  }

}
