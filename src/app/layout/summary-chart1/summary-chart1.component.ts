import { Component, OnInit } from '@angular/core';
import { SummaryChart } from '@shared/model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ShipmentService } from '@shared/shipment.service';

@Component({
  selector: 'app-summary-chart1',
  templateUrl: './summary-chart1.component.html',
  styleUrls: ['./summary-chart1.component.scss']
})
export class SummaryChart1Component implements OnInit {

  summaryChart: SummaryChart[] = [{
    id: 1, loadNo: 'sdf', city: 'SHANGAI', quantity: '3',
    vlsp: 'CMAL', plannedLocation: 'CQ2VDC2', transportMode: 'Road'
  }];

  constructor(private router: Router, private shipmentService: ShipmentService) { 
  }
  ngOnInit(): void {
    this.shipmentService.getSummaryChart('1');
  }

  back(): void {
    this.router.navigate(['/shipmentplan']);
  }

}
