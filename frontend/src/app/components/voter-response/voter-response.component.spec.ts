import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoterResponseComponent } from './voter-response.component';

describe('VoterResponseComponent', () => {
    let component: VoterResponseComponent;
    let fixture: ComponentFixture<VoterResponseComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [VoterResponseComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(VoterResponseComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    // it('should create', () => {
    //     expect(component).toBeTruthy();
    // });
});
