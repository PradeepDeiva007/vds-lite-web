import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryChart2PlanGenComponent } from './summary-chart2-plan-gen.component';

describe('SummaryChart2PlanGenComponent', () => {
  let component: SummaryChart2PlanGenComponent;
  let fixture: ComponentFixture<SummaryChart2PlanGenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummaryChart2PlanGenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryChart2PlanGenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
