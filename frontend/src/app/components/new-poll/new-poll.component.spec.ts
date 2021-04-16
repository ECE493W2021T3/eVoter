import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { imports } from 'src/app/app.imports';
import { PollService } from 'src/app/services/poll.service';

import { NewPollComponent } from './new-poll.component';

describe('NewPollComponent', () => {
    let component: NewPollComponent;
    let fixture: ComponentFixture<NewPollComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [NewPollComponent],
            imports: imports
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(NewPollComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('empty poll config form should be invalid', () => {
        clearConfigForm();
        expect(component.pollConfigForm.valid).toBeFalsy();
    });

    it('test valid poll config', () => {
        fillPollConfigForm();
        expect(component.pollConfigForm.valid).toBeTruthy();
    });

    it('test valid question form', () => {
        fillPollConfigForm();
        expect(component.pollConfigForm.valid).toBeTruthy();

        component.addQuestion();
        expect(component.qfa.length == 1).toBeTruthy();

        const questions = component.qfa.controls;
        questions.forEach(control => {
            const c = control as FormGroup;
            c.controls.question.setValue('question');
            c.controls.questionType.setValue('Short Answer');
        });

        expect(component.questionForm.valid).toBeTruthy();
    });

    it('test invalid question form', () => {
        fillPollConfigForm();
        expect(component.pollConfigForm.valid).toBeTruthy();

        component.addQuestion();
        expect(component.qfa.length == 1).toBeTruthy();

        const questions = component.qfa.controls;
        questions.forEach(control => {
            const c = control as FormGroup;
            c.controls.question.setValue('');
            c.controls.questionType.setValue('Short Answer');
        });

        component.onSubmit();

        expect(component.questionForm.valid).toBeFalsy();
    });

    it('test valid submission and redirect to homepage', fakeAsync(() => {
        fillPollConfigForm();
        expect(component.pollConfigForm.valid).toBeTruthy();

        component.addQuestion();
        expect(component.qfa.length == 1).toBeTruthy();

        const questions = component.qfa.controls;
        questions.forEach(control => {
            const c = control as FormGroup;
            c.controls.question.setValue('question');
            c.controls.questionType.setValue('Short Answer');
        });

        let pollService = fixture.debugElement.injector.get(PollService);
        spyOn(pollService, "createPoll").and.callFake(() => {
            return of({}).pipe(delay(300));
        });

        let router = fixture.debugElement.injector.get(Router);
        spyOn(router, "navigate");

        component.onSubmit();

        tick(300);

        expect(pollService.createPoll).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith(['/hosted-polls']);
    }));

    const fillPollConfigForm = function() {
        component.pcf.title.setValue('Title');
        component.pcf.type.setValue('Survey');
        component.pcf.accessLevel.setValue('Public');
        component.pcf.endDate.setValue(new Date('2021-08-25T23:45:00.000Z'));
        component.pcf.endTime.setValue('11:00 PM');
        component.pcf.isAnonymousModeOn.setValue(false);
        component.pcf.isHiddenUntilDeadline.setValue(false);
        component.pcf.canVotersSeeResults.setValue(false);
    };

    const clearConfigForm = function() {
        component.pcf.title.setValue('');
        component.pcf.type.setValue('');
        component.pcf.accessLevel.setValue('');
        component.pcf.endDate.setValue('');
        component.pcf.endTime.setValue('');
        component.pcf.isAnonymousModeOn.setValue(false);
        component.pcf.isHiddenUntilDeadline.setValue(false);
        component.pcf.canVotersSeeResults.setValue(false);
    };
});
