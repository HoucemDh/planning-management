import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RotationMpComponent } from './rotation-mp.component';

describe('RotationMpComponent', () => {
  let component: RotationMpComponent;
  let fixture: ComponentFixture<RotationMpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RotationMpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RotationMpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
