import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostedPollsComponent } from './hosted-polls.component';

describe('HostedPollsComponent', () => {
  let component: HostedPollsComponent;
  let fixture: ComponentFixture<HostedPollsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HostedPollsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostedPollsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
