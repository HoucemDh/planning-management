import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfencComponent } from './ofenc.component';

describe('OfencComponent', () => {
  let component: OfencComponent;
  let fixture: ComponentFixture<OfencComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OfencComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfencComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
