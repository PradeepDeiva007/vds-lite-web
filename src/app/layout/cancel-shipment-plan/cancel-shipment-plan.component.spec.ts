import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelShipmentPlanComponent } from './cancel-shipment-plan.component';

describe('CancelShipmentPlanComponent', () => {
  let component: CancelShipmentPlanComponent;
  let fixture: ComponentFixture<CancelShipmentPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancelShipmentPlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelShipmentPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
