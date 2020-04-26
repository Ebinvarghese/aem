import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  SprintContentModule,
  SprintI18nModule,
  SprintPipesModule,
  SprintFieldErrorsModule,
  SprintSharedFormsModule,
  SprintFormMasksModule,
  SprintGoogleMapsModule,
  SprintTooltipModule,
  AddressFormComponent,
  CreditCardFormComponent,
  COMPONENT_ID
} from '@sprint/sprint-angular-modules';
import { RecaptchaModule } from 'ng-recaptcha';
import { RecaptchaFormsModule } from 'ng-recaptcha/forms';
import { CardCaptureAppComponent } from './card-capture-app.component';
import { CardCaptureAppService } from './card-capture-app.service';

/* Pci modules & declarations */
@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    SprintI18nModule.forRoot(),
    SprintPipesModule,
    SprintContentModule,
    SprintFieldErrorsModule,
    SprintSharedFormsModule,
    SprintFormMasksModule,
    SprintGoogleMapsModule,
    SprintTooltipModule,
    RecaptchaModule,
    RecaptchaFormsModule
  ],
  declarations: [CardCaptureAppComponent, AddressFormComponent, CreditCardFormComponent],
  providers: [
    {
      provide: COMPONENT_ID,
      useValue: 'card-capture-app-component'
    },
    {
      provide: 'ContentService',
      useFactory: () => window.sprintApp.container.get('ContentService')
    },
    {
      provide: 'BrowserLocationUtilitiesService',
      useFactory: () => window.sprintApp.container.get('BrowserLocationUtilitiesService')
    },
    {
      provide: 'AddressUtilitiesService',
      useFactory: () => window.sprintApp.container.get('AddressUtilitiesService')
    },
    {
      provide: 'ServiceLayerService',
      useFactory: () => window.sprintApp.container.get('ServiceLayerService')
    },
    {
      provide: 'TokenizerService',
      useFactory: () => window.sprintApp.container.get('TokenizerService')
    },
    {
      provide: 'GoogleMapsService',
      useFactory: window.sprintApp.container.get('GoogleMapsService')
    },
    CardCaptureAppService
  ],
  bootstrap: [CardCaptureAppComponent]
})
export class CardCaptureAppModule {}
