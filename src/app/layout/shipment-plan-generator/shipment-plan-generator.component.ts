import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { Dropdown, SummaryChart } from '@shared/model';
import { ShipmentService } from '@shared/shipment.service';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-shipment-plan-generator',
  templateUrl: './shipment-plan-generator.component.html',
  styleUrls: ['./shipment-plan-generator.component.scss']
})
export class ShipmentPlanGeneratorComponent implements OnInit {

  cities: Dropdown[] = [];
  transportModes: Dropdown[] = [];
  locationList: Dropdown[] = [];
  vlspList: Dropdown[] = [];
  loadList: Dropdown[] = [];

  selectedCity = [];
  selectedVlsp = [];
  selectedtransport = [];
  selectedLoad = [];
  selectedlocation = [];
  runOptions: string[] = [];
  subscription: Subscription;
  summaryChart: SummaryChart[] = [];
  authGroup = '';
  constructor(private shipmentService: ShipmentService, public appService: AppService, private spinner: NgxSpinnerService) {
    // this.initDropdownValues();
    this.subscription = this.appService.getAuthorityGroup().subscribe(
      (groupName) => {
        this.authGroup = groupName;
        this.search();
      }
    );
  }

  ngOnInit(): void {
  }

  initDropdownValues(): void {
    this.cities = [...new Set(this.summaryChart.map(s => s.city))].map(name => ({ name }));
    this.locationList = [...new Set(this.summaryChart.map(s => s.plannedLocation))].map(name => ({ name }));
    this.transportModes = [...new Set(this.summaryChart.map(s => s.transportMode))].map(name => ({ name }));
    this.vlspList = [...new Set(this.summaryChart.map(s => s.vlsp))].map(name => ({ name }));
    // locationListresult.forEach
  }

  search(): void {
    this.spinner.show();
    this.shipmentService.searchShipment(this.authGroup).subscribe(data => {
      this.summaryChart = data;
      this.initDropdownValues();
      this.spinner.hide();
    },
      error => {
        this.summaryChart = [];
        this.spinner.hide();
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
