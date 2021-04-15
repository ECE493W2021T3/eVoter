import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsvDownloaderComponent } from './csv-downloader.component';

describe('CsvDownloaderComponent', () => {
    let component: CsvDownloaderComponent;
    let fixture: ComponentFixture<CsvDownloaderComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CsvDownloaderComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CsvDownloaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    // it('should create', () => {
    //     expect(component).toBeTruthy();
    // });
});
