import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CdeComponent } from './cde.component';

describe('CdeComponent', () => {
  let component: CdeComponent;
  let fixture: ComponentFixture<CdeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CdeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CdeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
