import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerbiViewComponent } from './powerbi-view.component';

describe('PowerbiViewComponent', () => {
  let component: PowerbiViewComponent;
  let fixture: ComponentFixture<PowerbiViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PowerbiViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PowerbiViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
