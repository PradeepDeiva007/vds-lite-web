import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryChart1PlanGenComponent } from './summary-chart1-plan-gen.component';

describe('SummaryChart1PlanGenComponent', () => {
  let component: SummaryChart1PlanGenComponent;
  let fixture: ComponentFixture<SummaryChart1PlanGenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummaryChart1PlanGenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryChart1PlanGenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
