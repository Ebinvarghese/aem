import { Component, Input } from '@angular/core';

/* tslint:disable:component-selector */
@Component({
  selector: 'sprint-form-field-error',
  template: ``
})
export class FieldErrorComponent {
  @Input() public control: any;
  @Input() public showForTheseErrorCodes: string[] = [];

  public errorCode: string | null;
}
/* tslint:enable:component-selector */
