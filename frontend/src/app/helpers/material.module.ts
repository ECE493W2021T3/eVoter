import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
	declarations: [],
	imports: [
		CommonModule,
		MatSidenavModule,
		MatListModule,
		MatIconModule,
		MatButtonModule,
		MatToolbarModule,
		MatMenuModule
	],
	exports: [
		MatSidenavModule,
		MatListModule,
		MatIconModule,
		MatButtonModule,
		MatToolbarModule,
		MatMenuModule
	]
})
export class MaterialModule { }
