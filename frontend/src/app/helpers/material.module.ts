import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
	declarations: [],
	imports: [
		CommonModule,
		MatSidenavModule,
		MatListModule,
		MatIconModule,
		MatButtonModule,
		MatToolbarModule,
		MatMenuModule,
		MatStepperModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		MatSlideToggleModule,
		MatCardModule,
		MatSnackBarModule
	],
	exports: [
		MatSidenavModule,
		MatListModule,
		MatIconModule,
		MatButtonModule,
		MatToolbarModule,
		MatMenuModule,
		MatStepperModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		MatSlideToggleModule,
		MatCardModule,
		MatSnackBarModule
	]
})
export class MaterialModule { }
