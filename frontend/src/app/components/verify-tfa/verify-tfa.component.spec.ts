import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { imports } from 'src/app/app.imports';

import { VerifyTfaComponent } from './verify-tfa.component';

describe('VerifyTfaComponent', () => {
    let component: VerifyTfaComponent;
    let fixture: ComponentFixture<VerifyTfaComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [VerifyTfaComponent],
            imports: imports
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(VerifyTfaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('empty form should be invalid', () => {
        component.tf.code.setValue('');
        expect(component.TFAForm.valid).toBeFalsy();
    });

    it('valid form should go to homepage', fakeAsync(() => {
        component.tf.code.setValue(123456);
        expect(component.TFAForm.valid).toBeTruthy();
        
        spyOn(component, 'onSubmit');
        let button = fixture.debugElement.nativeElement.querySelector('button');
        button.click();
        tick();
        expect(component.onSubmit).toHaveBeenCalled();
    }));
});
