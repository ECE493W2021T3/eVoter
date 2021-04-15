import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyTfaComponent } from './verify-tfa.component';

describe('VerifyTfaComponent', () => {
    let component: VerifyTfaComponent;
    let fixture: ComponentFixture<VerifyTfaComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [VerifyTfaComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(VerifyTfaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    // it('should create', () => {
    //     expect(component).toBeTruthy();
    // });
});
