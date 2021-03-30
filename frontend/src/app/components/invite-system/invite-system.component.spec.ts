import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteSystemComponent } from './invite-system.component';

describe('InviteSystemComponent', () => {
  let component: InviteSystemComponent;
  let fixture: ComponentFixture<InviteSystemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InviteSystemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
