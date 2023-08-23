import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentPlanApprovalComponent } from './shipment-plan-approval.component';

describe('ShipmentPlanApprovalComponent', () => {
  let component: ShipmentPlanApprovalComponent;
  let fixture: ComponentFixture<ShipmentPlanApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShipmentPlanApprovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipmentPlanApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
