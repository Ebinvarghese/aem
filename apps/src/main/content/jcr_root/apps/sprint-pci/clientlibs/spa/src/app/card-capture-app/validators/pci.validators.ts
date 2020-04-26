import { AbstractControl } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable()
export class PciValidators {
  public static checkingNameValidator(control: AbstractControl) {
    if (!control || !control.value || control.value.length === 0) {
      return { invalidName: 'invalidName' };
    }

    // all printable ascii characters are allowed in name
    return /^[ -~]{4,30}$/.test(control.value.trim()) ? null : { invalidName: control.value };
  }
}
