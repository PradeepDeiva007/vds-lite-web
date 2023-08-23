import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentPlanGenerationComponent } from './shipment-plan-generation.component';

describe('ShipmentPlanGenerationComponent', () => {
  let component: ShipmentPlanGenerationComponent;
  let fixture: ComponentFixture<ShipmentPlanGenerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShipmentPlanGenerationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipmentPlanGenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
