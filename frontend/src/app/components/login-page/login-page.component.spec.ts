import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { imports } from 'src/app/app.imports';

import { LoginPageComponent } from './login-page.component';

describe('LoginPageComponent', () => {
    let component: LoginPageComponent;
    let fixture: ComponentFixture<LoginPageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LoginPageComponent],
            imports: imports
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LoginPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    
    afterAll(() => {
        clearForm();
    });
    
    it('empty form should be invalid', () => {
        clearForm();
        expect(component.loginForm.valid).toBeFalsy();
    });

    it('invalid email should be flagged', () => {
        fillValidForm();
        expect(component.loginForm.valid).toBeTruthy();
        
        component.lf.email.setValue('email');
        expect(component.loginForm.valid).toBeFalsy();
    });

    it('valid form should go to homepage', () => {
        fillValidForm();
        expect(component.loginForm.valid).toBeTruthy();

        // TODO: test using mock service
    });

    const fillValidForm = function() {
        component.lf.email.setValue('email@test.com');
        component.lf.password.setValue('testing123');
    };

    const clearForm = function() {
        component.lf.email.setValue('');
        component.lf.password.setValue('');
    }
});
