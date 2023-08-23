import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CancelShipmentPlanComponent } from './cancel-shipment-plan/cancel-shipment-plan.component';
import { HomeComponent } from './home/home.component';
import { LayoutComponent } from './layout/layout.component';
import { ShipmentPlanGenerationComponent } from './shipment-plan-generation/shipment-plan-generation.component';
import { ShipmentPlanGeneratorComponent } from './shipment-plan-generator/shipment-plan-generator.component';
import { SummaryChart1PlanGenComponent } from './summary-chart1-plan-gen/summary-chart1-plan-gen.component';
import { SummaryChart1Component } from './summary-chart1/summary-chart1.component';
import { SummaryChart2PlanGenComponent } from './summary-chart2-plan-gen/summary-chart2-plan-gen.component';
import {ShipmentPlanApprovalComponent} from './shipment-plan-approval/shipment-plan-approval.component';
import { CancelShipmentPlanApprovalComponent } from './cancel-shipment-plan-approval/cancel-shipment-plan-approval.component';

const routes: Routes = [{
  path: '', component: LayoutComponent, children: [
    { component: HomeComponent, path: 'home' },
    { component: ShipmentPlanGeneratorComponent, path: 'shipmentplan' },
    { component: SummaryChart1Component, path: 'summarychart'},
    { component: CancelShipmentPlanComponent, path: 'CancelShipment'},
    { component: ShipmentPlanApprovalComponent,path:'shipmentplanapproval'},
    { component: ShipmentPlanGenerationComponent, path: 'shipmentplanGen'},
    { component: SummaryChart1PlanGenComponent, path: 'summarychartplan1'},
    { component: SummaryChart2PlanGenComponent, path: 'summarychartplan2'},
    {component:CancelShipmentPlanApprovalComponent,path:'cancelshipmentapproval'}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
