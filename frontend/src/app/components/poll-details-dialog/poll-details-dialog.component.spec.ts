import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PollDetailsDialogComponent } from './poll-details-dialog.component';

describe('PollDetailsDialogComponent', () => {
  let component: PollDetailsDialogComponent;
  let fixture: ComponentFixture<PollDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PollDetailsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PollDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
