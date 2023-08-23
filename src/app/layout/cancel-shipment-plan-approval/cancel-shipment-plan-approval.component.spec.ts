import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelShipmentPlanApprovalComponent } from './cancel-shipment-plan-approval.component';

describe('CancelShipmentPlanApprovalComponent', () => {
  let component: CancelShipmentPlanApprovalComponent;
  let fixture: ComponentFixture<CancelShipmentPlanApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancelShipmentPlanApprovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelShipmentPlanApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
