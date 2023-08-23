import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryChart1SpapprovalComponent } from './summary-chart1-spapproval.component';

describe('SummaryChart1SpapprovalComponent', () => {
  let component: SummaryChart1SpapprovalComponent;
  let fixture: ComponentFixture<SummaryChart1SpapprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummaryChart1SpapprovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryChart1SpapprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
