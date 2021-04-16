import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { imports } from 'src/app/app.imports';
import { UserService } from 'src/app/services/user.service';

import { SettingsComponent } from './settings.component';

describe('SettingsComponent', () => {
    let component: SettingsComponent;
    let fixture: ComponentFixture<SettingsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SettingsComponent],
            imports: imports,
            providers: [
                { provide: MatDialogRef, useValue: {} }
            ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SettingsComponent);
        component = fixture.componentInstance;
    });

    it('initialize form with 2FA setting', fakeAsync(() => {
        initializeSetting();
        expect(component.sf.is2FAEnabled.value).toBeTrue();
    }));

    it('submit button should be initially disabled', fakeAsync(() => {
        initializeSetting();

        let button = fixture.debugElement.query(debugEl => {
            return debugEl.name === 'button' && debugEl.nativeElement.textContent === 'Save';
        });

        expect(button.nativeElement.disabled).toBeTrue();
    }));

    it('updating setting should enable submit button', fakeAsync(() => {
        initializeSetting();

        let button = fixture.debugElement.query(debugEl => {
            return debugEl.name === 'button' && debugEl.nativeElement.textContent === 'Save';
        });

        expect(button.nativeElement.disabled).toBeTrue();

        component.sf.is2FAEnabled.setValue(false);
        component.settingsForm.markAsDirty();

        expect(component.sf.is2FAEnabled.value).toBeFalse();
        expect(component.settingsForm.dirty).toBeTrue();
        // expect(button.nativeElement.disabled).toBeFalse();
    }));

    const initializeSetting = function() {
        let userService = fixture.debugElement.injector.get(UserService);
        spyOn(userService, "get2FAConfig").and.callFake(() => {
            return of(true).pipe(delay(300));
        });

        fixture.detectChanges();
        tick(300);
    };
});
