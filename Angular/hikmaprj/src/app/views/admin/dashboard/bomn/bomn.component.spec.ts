import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BomNComponent } from './bomn.component';

describe('BomnComponent', () => {
  let component: BomNComponent;
  let fixture: ComponentFixture<BomNComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BomNComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BomNComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
