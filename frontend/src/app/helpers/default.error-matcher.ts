import { FormControl, FormGroupDirective, NgForm } from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";

export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const invalidCtrl = !!(control?.invalid && control?.parent?.dirty && control?.touched);
        const invalidParent = !!(control?.parent?.invalid && control?.parent?.dirty && control?.parent?.touched);

        return invalidCtrl || invalidParent;
    }
}