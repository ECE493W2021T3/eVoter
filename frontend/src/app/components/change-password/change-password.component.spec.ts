import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { imports } from 'src/app/app.imports';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

import { ChangePasswordComponent } from './change-password.component';

describe('ChangePasswordComponent', () => {
    let component: ChangePasswordComponent;
    let fixture: ComponentFixture<ChangePasswordComponent>;
    let user: User = {
        _id: "userID",
        name: "Name",
        email: "user@email.com",
        password: "mypass123",
        role: "Admin",
        is2FAEnabled: false,
        securityQuestions: [{
            question: "question1",
            answer: "answer1"
        }, {
            question: "question2",
            answer: "answer2"
        }, {
            question: "question3",
            answer: "answer3"
        }]
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ChangePasswordComponent],
            imports: imports
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ChangePasswordComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('all fields initially empty', () => {
        expect(component).toBeTruthy();
        expect(component.emailForm.valid).toBeFalsy();
        expect(component.securityQuestionsValid).toBeFalsy();
        expect(component.passwordForm.valid).toBeFalsy();
    });

    it('valid email should go through onEmailSubmit', fakeAsync(() => {
        fillInEmail();

        tick(300);

        expect(component).toBeTruthy();
        expect(component.emailForm.valid).toBeTruthy();
        expect(component.securityQuestionsValid).toBeFalsy();
        expect(component.sfa.length == 3).toBeTruthy();
        expect(component.passwordForm.valid).toBeFalsy();
    }));

    it('valid questions should go through onQuestionsSubmit', fakeAsync(() => {
        fillInEmail();
        fillInQuestions();

        tick(300);

        expect(component).toBeTruthy();
        expect(component.emailForm.valid).toBeTruthy();
        expect(component.securityQuestionsValid).toBeTruthy();
        expect(component.sfa.length == 3).toBeTruthy();
        expect(component.passwordForm.valid).toBeFalsy();
    }));

    it('invalid passwords should not go through onPasswordSubmit', fakeAsync(() => {
        fillInEmail();
        fillInQuestions();

        component.pf.password.setValue('mypass123');
        component.pf.confirmPassword.setValue('test12345');

        component.onPasswordSubmit();

        tick(300);

        expect(component).toBeTruthy();
        expect(component.emailForm.valid).toBeTruthy();
        expect(component.securityQuestionsValid).toBeTruthy();
        expect(component.sfa.length == 3).toBeTruthy();
        expect(component.passwordForm.valid).toBeFalsy();
    }));

    it('valid passwords should go through onPasswordSubmit and redirect to login', fakeAsync(() => {        
        fillInEmail();
        fillInQuestions();

        let userService = fixture.debugElement.injector.get(UserService);
        spyOn(userService, "updatePassword").and.callFake(() => {
            return of({});
        });

        let router = fixture.debugElement.injector.get(Router);
        spyOn(router, "navigate");

        component.pf.password.setValue('mypass123');
        component.pf.confirmPassword.setValue('mypass123');
        component.user = user;

        component.onPasswordSubmit();

        tick(300);

        expect(component).toBeTruthy();
        expect(component.emailForm.valid).toBeTruthy();
        expect(component.securityQuestionsValid).toBeTruthy();
        expect(component.sfa.length == 3).toBeTruthy();
        expect(component.passwordForm.valid).toBeTruthy();
        expect(userService.updatePassword).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith(['/login']);
    }));

    const fillInEmail = function() {
        component.ef.email.setValue('user@email.com');

        let userService = fixture.debugElement.injector.get(UserService);
        spyOn(userService, "getUserByEmail").and.callFake(() => {
            return of(user).pipe(delay(300));
        });

        component.onEmailSubmit();
    };

    const fillInQuestions = function () {
        const securityQuestions = component.sfa.controls;
        securityQuestions.forEach(control => {
            const c = control as FormGroup;
            c.controls.answer.setValue('security answer');
        });
        
        component.onQuestionsSubmit();
    };
});
