import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutRoutingModule } from './layout-routing.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './home/home.component';
import { ShipmentPlanGeneratorComponent } from './shipment-plan-generator/shipment-plan-generator.component';
import { SummaryChart1Component } from './summary-chart1/summary-chart1.component';
import { SummaryChart2Component } from './summary-chart2/summary-chart2.component';
import { ShipmentService } from '../shared/shipment.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { DropdownModule } from 'primeng/dropdown';
import { CancelShipmentPlanComponent } from './cancel-shipment-plan/cancel-shipment-plan.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import {InputTextModule} from 'primeng/inputtext';
import {ShipmentPlanApprovalComponent} from './shipment-plan-approval/shipment-plan-approval.component';
import { CheckboxModule } from 'primeng/checkbox';
import { ShipmentPlanGenerationComponent } from './shipment-plan-generation/shipment-plan-generation.component';
import { SummaryChart1PlanGenComponent } from './summary-chart1-plan-gen/summary-chart1-plan-gen.component';
import { SummaryChart2PlanGenComponent } from './summary-chart2-plan-gen/summary-chart2-plan-gen.component';
import { ShipmentPlan } from '@shared/shipmentplan.pipe';
import {DialogModule} from 'primeng/dialog';
import {PaginatorModule} from 'primeng/paginator';
import { CancelShipmentPlanApprovalComponent } from './cancel-shipment-plan-approval/cancel-shipment-plan-approval.component';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {RadioButtonModule} from 'primeng/radiobutton';

@NgModule({
  declarations: [
    LayoutComponent,
    HomeComponent,
    ShipmentPlanGeneratorComponent,
    ShipmentPlanGenerationComponent,
    SummaryChart1Component,
    SummaryChart2Component,
    CancelShipmentPlanComponent,
    ShipmentPlanApprovalComponent,
    SummaryChart1PlanGenComponent,
    SummaryChart2PlanGenComponent,
    ShipmentPlan,
    CancelShipmentPlanApprovalComponent
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    NgxSpinnerModule,
    FormsModule,
    MultiSelectModule,
    TableModule,
    CardModule,
    ButtonModule,
    ToolbarModule,
    DropdownModule,
    ConfirmDialogModule,
    MatSidenavModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    Ng2SearchPipeModule,
    InputTextModule,
    CheckboxModule,
    DialogModule,
    PaginatorModule,
    InputTextareaModule,
    RadioButtonModule
     ],
  providers: [ShipmentService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LayoutModule { }
