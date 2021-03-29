import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
    public settingsForm: FormGroup;

    private subscription: Subscription = new Subscription();

    constructor(
        private dialogRef: MatDialogRef<SettingsComponent>,
        private userService: UserService,
        private formBuilder: FormBuilder,
        private snackBar: MatSnackBar) { }

    ngOnInit(): void {
        this.settingsForm = this.formBuilder.group({
            is2FAEnabled: [false]
        });

        this.subscription.add(this.userService.get2FAConfig().subscribe(is2FAEnabled => {
            this.sf.is2FAEnabled.setValue(is2FAEnabled);
        }));
    }

    // Convenience getters for easy access to form fields
    get sf() { return this.settingsForm.controls; }

    onSubmit() {
        if (this.settingsForm.invalid || this.settingsForm.pending) {
            return;
        }

        this.subscription.add(this.userService.update2FASetting(this.sf.is2FAEnabled.value).subscribe(result => {
            this.dialogRef.close();
        }, error => {
            this.snackBar.open('Failed to save settings.', '', {
                duration: 5000,
                verticalPosition: 'top',
                panelClass: ['error-snackbar']
            });
        }));
    }
}
