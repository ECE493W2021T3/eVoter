import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PollInviteComponent } from './poll-invite.component';

describe('PollInviteComponent', () => {
    let component: PollInviteComponent;
    let fixture: ComponentFixture<PollInviteComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PollInviteComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PollInviteComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    // it('should create', () => {
    //     expect(component).toBeTruthy();
    // });
});
