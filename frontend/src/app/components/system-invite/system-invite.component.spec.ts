import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemInviteComponent } from './system-invite.component';

describe('SystemInviteComponent', () => {
    let component: SystemInviteComponent;
    let fixture: ComponentFixture<SystemInviteComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SystemInviteComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SystemInviteComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    // it('should create', () => {
    //     expect(component).toBeTruthy();
    // });
});
