import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitResponseComponent } from './submit-response.component';

describe('SubmitResponseComponent', () => {
  let component: SubmitResponseComponent;
  let fixture: ComponentFixture<SubmitResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmitResponseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
