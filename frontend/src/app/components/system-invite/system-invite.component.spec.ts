import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { imports } from 'src/app/app.imports';

import { SystemInviteComponent } from './system-invite.component';

describe('SystemInviteComponent', () => {
    let component: SystemInviteComponent;
    let fixture: ComponentFixture<SystemInviteComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SystemInviteComponent],
            imports: imports,
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: { registeredVoterEmails: ['email@test.com'] } },
                { provide: MatDialogRef, useValue: {} }
            ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SystemInviteComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('empty form should be invalid', () => {
        component.ef.emails.setValue([]);
        expect(component.emailForm.valid).toBeFalsy();
    });

    it('invalid email should be flagged', () => {
        component.addEmail({ input: null, value: 'email123@test.com' } as unknown as MatChipInputEvent);
        expect(component.emailForm.valid).toBeTruthy();
        
        component.addEmail({ input: null, value: 'email' } as unknown as MatChipInputEvent);
        expect(component.emailForm.valid).toBeFalsy();
    });

    it('existing email should be flagged', () => {
        component.addEmail({ input: null, value: 'email123@test.com' } as unknown as MatChipInputEvent);
        expect(component.emailForm.valid).toBeTruthy();
        
        component.addEmail({ input: null, value: 'email@test.com' } as unknown as MatChipInputEvent);
        expect(component.emailForm.valid).toBeFalsy();
    });

    it('valid form should close dialog', () => {
        component.addEmail({ input: null, value: 'email123@test.com' } as unknown as MatChipInputEvent);
        expect(component.emailForm.valid).toBeTruthy();

        // TODO: test using mock service
    });
});
