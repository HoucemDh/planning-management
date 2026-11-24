import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamhistoryComponent } from './teamhistory.component';

describe('TeamhistoryComponent', () => {
  let component: TeamhistoryComponent;
  let fixture: ComponentFixture<TeamhistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeamhistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamhistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
