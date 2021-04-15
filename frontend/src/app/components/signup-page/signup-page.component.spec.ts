import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { imports } from 'src/app/app.imports';

import { SignupPageComponent } from './signup-page.component';

describe('SignupPageComponent', () => {
    let component: SignupPageComponent;
    let fixture: ComponentFixture<SignupPageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SignupPageComponent],
            imports: imports
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SignupPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('form should be invalid', () => {
        component.rf.name.setValue('');
        component.rf.email.setValue('');
        component.rf.isHostingPolls.setValue(false);
        component.rf.is2FAEnabled.setValue(false);

        const passwords = component.rf.passwords as FormGroup;
        passwords.controls.password.setValue('');
        passwords.controls.confirmPassword.setValue('');

        const securityQuestions = component.sfa.controls;
        securityQuestions.forEach(control => {
            const c = control as FormGroup;
            c.controls.question.setValue('');
            c.controls.answer.setValue('');
        });

        expect(component.registrationForm.valid).toBeFalsy();
    });

    it('password should be minimum 8 characters', () => {
        fillValidForm();
        expect(component.registrationForm.valid).toBeTruthy();

        const passwords = component.rf.passwords as FormGroup;
        passwords.controls.password.setValue('test');
        passwords.controls.confirmPassword.setValue('test');
        expect(component.registrationForm.valid).toBeFalsy();
    });

    it('passwords should match', () => {
        fillValidForm();
        expect(component.registrationForm.valid).toBeTruthy();

        const passwords = component.rf.passwords as FormGroup;
        passwords.controls.password.setValue('testing123');
        passwords.controls.confirmPassword.setValue('mypass123');
        expect(component.registrationForm.valid).toBeFalsy();
    });

    it('email should be invalid', () => {
        fillValidForm();
        expect(component.registrationForm.valid).toBeTruthy();
        
        component.rf.email.setValue('email');
        expect(component.registrationForm.valid).toBeFalsy();
    });

    it('valid form should go to login page', () => {
        fillValidForm();
        expect(component.registrationForm.valid).toBeTruthy();

        // TODO: test using mock service
    });

    const fillValidForm = function () {
        component.rf.name.setValue('Name');
        component.rf.email.setValue('email@test.com');
        component.rf.isHostingPolls.setValue(false);
        component.rf.is2FAEnabled.setValue(false);

        const passwords = component.rf.passwords as FormGroup;
        passwords.controls.password.setValue('testing123');
        passwords.controls.confirmPassword.setValue('testing123');

        const securityQuestions = component.sfa.controls;
        securityQuestions.forEach(control => {
            const c = control as FormGroup;
            c.controls.question.setValue('security question');
            c.controls.answer.setValue('security answer');
        });
    };
});
