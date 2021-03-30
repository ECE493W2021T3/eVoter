import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitePollComponent } from './invite-poll.component';

describe('InvitePollComponent', () => {
  let component: InvitePollComponent;
  let fixture: ComponentFixture<InvitePollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvitePollComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitePollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
