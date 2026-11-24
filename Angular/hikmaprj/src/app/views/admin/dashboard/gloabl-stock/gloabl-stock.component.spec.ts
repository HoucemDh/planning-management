import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GloablStockComponent } from './gloabl-stock.component';

describe('GloablStockComponent', () => {
  let component: GloablStockComponent;
  let fixture: ComponentFixture<GloablStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GloablStockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GloablStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
