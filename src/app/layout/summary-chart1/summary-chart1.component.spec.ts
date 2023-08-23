import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryChart1Component } from './summary-chart1.component';

describe('SummaryChart1Component', () => {
  let component: SummaryChart1Component;
  let fixture: ComponentFixture<SummaryChart1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummaryChart1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryChart1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
