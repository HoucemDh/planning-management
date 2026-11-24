import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CdeachatComponent } from './cdeachat.component';

describe('CdeachatComponent', () => {
  let component: CdeachatComponent;
  let fixture: ComponentFixture<CdeachatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CdeachatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CdeachatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
