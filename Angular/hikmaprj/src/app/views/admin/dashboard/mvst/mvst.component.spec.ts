import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MvstComponent } from './mvst.component';

describe('MvstComponent', () => {
  let component: MvstComponent;
  let fixture: ComponentFixture<MvstComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MvstComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MvstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
