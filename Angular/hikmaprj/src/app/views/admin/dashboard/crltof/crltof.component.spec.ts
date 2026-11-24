import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrltofComponent } from './crltof.component';

describe('CrltofComponent', () => {
  let component: CrltofComponent;
  let fixture: ComponentFixture<CrltofComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CrltofComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrltofComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
