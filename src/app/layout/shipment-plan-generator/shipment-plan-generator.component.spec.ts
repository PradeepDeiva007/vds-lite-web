import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentPlanGeneratorComponent } from './shipment-plan-generator.component';

describe('ShipmentPlanGeneratorComponent', () => {
  let component: ShipmentPlanGeneratorComponent;
  let fixture: ComponentFixture<ShipmentPlanGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShipmentPlanGeneratorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipmentPlanGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
