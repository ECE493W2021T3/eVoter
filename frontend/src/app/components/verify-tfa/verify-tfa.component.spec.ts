import { ComponentFixture, TestBed } from '@angular/core/testing';
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

    it('valid form should go to homepage', () => {
        component.tf.code.setValue(123456);
        expect(component.TFAForm.valid).toBeTruthy();

        // TODO: test using mock service
    });
});
