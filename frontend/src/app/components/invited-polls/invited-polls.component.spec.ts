import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitedPollsComponent } from './invited-polls.component';

describe('InvitedPollsComponent', () => {
  let component: InvitedPollsComponent;
  let fixture: ComponentFixture<InvitedPollsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvitedPollsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitedPollsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
