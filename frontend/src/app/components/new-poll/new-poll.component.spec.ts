import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSelect } from '@angular/material/select';
import { By } from '@angular/platform-browser';
import { imports } from 'src/app/app.imports';

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
    
    // it('election poll should have anonymous voting on', () => {
    //     fillPollConfigForm();
        
        // const typeDropdown: MatSelect = fixture.debugElement.query(By.css('mat-select[formControlName="type"]')).nativeElement.click();
        // typeDropdown.value = typeDropdown.options[1].value;
        // typeDropdown.dispatchEvent(new Event('change'));
        // fixture.detectChanges();
        // fixture.whenStable().then(() => {
        //     let text = typeDropdown.options[typeDropdown.selectedIndex].label;
        //     expect(text).toBe('Election');
        // })

        // expect(component.pcf.type.value).toBe("Election")
    // });

    const fillPollConfigForm = function() {
        component.pcf.title.setValue('Title');
        component.pcf.type.setValue('Survey');
        component.pcf.accessLevel.setValue('Public');
        component.pcf.endDate.setValue('2021-03-25T23:45:00.000Z');
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
