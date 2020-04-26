import { of as observableOf, throwError as observableThrowError, Observable } from 'rxjs';
import { ComponentFixture, TestBed, async, fakeAsync } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardCaptureAppComponent } from './card-capture-app.component';
import { Component, Input, NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EventEmitter } from '@angular/core';
import { IServiceLayer } from '@sprint-types/sprint-common/global/service-layer';
import { ContentService } from '@sprint-types/sprint-common';
import { CardCaptureAppService } from './card-capture-app.service';
import { ServiceLayerServiceStub } from 'apps/test-libs/mocks/service-layer-integration/service-layer-stub.service';
import {
  AddressFormComponent,
  SprintContentModule,
  SprintFieldErrorsModule,
  SprintFormMasksModule,
  SprintI18nModule,
  SprintPipesModule,
  SprintSharedFormsModule,
  COMPONENT_ID
} from '@sprint/sprint-angular-modules';
import { RecaptchaModule } from 'ng-recaptcha';
import { RecaptchaFormsModule } from 'ng-recaptcha/forms';

@Component({
  selector: 'sprint-credit-card-form', // tslint:disable-line
  template: ''
})
class MockCreditCardFormComponent {
  @Input() public includeZipCode = '';
  @Input() public parentForm = '';
}

@Component({
  selector: 'sprint-form-field-error', // tslint:disable-line
  template: ''
})
export class MockFieldErrorComponent {
  @Input() public control: any;
  @Input() public showForTheseErrorCodes: string[] = [];
  public errorCode: string | null;
}

const contentServiceStub = {
  getByKey: jest.fn(() => 'en/us/my-sprint')
};

const browserLocationUtilitiesServiceStub = {
  checkQueryString: jest.fn()
};

const cardCaptureAppServiceStub = {
  getToken: jest.fn()
};

interface CreditCard {
  type: CreditCardType | null;
  test: RegExp;
  format: number[];
  validator: RegExp;
  minLength: number;
  maxLength: number;
  cvvLength: number;
}

const blankCreditCard: CreditCard = {
  type: null,
  test: /.*/g,
  format: [16],
  validator: /(?!)/, // Match nothing
  minLength: 13,
  maxLength: 16,
  cvvLength: 3
};

describe('CardCaptureAppComponent', () => {
  let component: CardCaptureAppComponent;
  let fixture: ComponentFixture<CardCaptureAppComponent>;
  let contentService: ContentService;
  let cardCaptureAppService: CardCaptureAppService;
  let serviceLayer: IServiceLayer;
  let mockGetStreamRunner: jest.Mock<() => any>;
  const showErrorBoolean: boolean = true;
  const showSuccessBoolean: boolean = true;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CardCaptureAppComponent, MockCreditCardFormComponent, AddressFormComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        SprintI18nModule.forRoot(),
        SprintPipesModule,
        SprintContentModule,
        SprintFieldErrorsModule,
        SprintSharedFormsModule,
        SprintFormMasksModule,
        RecaptchaModule,
        RecaptchaFormsModule
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        FormBuilder,
        {
          provide: COMPONENT_ID,
          useValue: 'card-capture-app-component'
        },
        {
          provide: 'ContentService',
          useValue: contentServiceStub
        },
        {
          provide: TranslateService,
          useClass: TranslateServiceStub
        },
        {
          provide: CardCaptureAppService,
          useValue: cardCaptureAppServiceStub
        },
        {
          provide: 'BrowserLocationUtilitiesService',
          useValue: browserLocationUtilitiesServiceStub
        },
        {
          provide: 'ServiceLayerService',
          useClass: ServiceLayerServiceStub
        }
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CardCaptureAppComponent);
        serviceLayer = TestBed.get('ServiceLayerService');
        component = fixture.componentInstance;
        component.cardCaptureForm = new FormBuilder().group({
          cardNumber: ['6767635635763'],
          securityCode: ['567'],
          expirationDate: ['10/21'],
          nameOnCard: ['MNO'],
          creditCardType: ['VISA'],
          address1: ['2019 Fox Drive'],
          address2: [''],
          city: ['Kansas'],
          state: ['Kansas'],
          zip: ['60001']
        });
        component.cardNumberCaptureForm = new FormBuilder().group({
          cardNumber: ['6767635635767', Validators.required],
          creditCardType: ['VISA'],
          token: []
        });
        component.cardCaptureForm.valueChanges.subscribe(value => {
          if (component.isSalesForceApp) {
            component.isSubmitCardFormDisabled = !(
              component.cardCaptureForm.controls.cardNumber.valid &&
              component.cardCaptureForm.controls.expirationDate.valid &&
              component.cardCaptureForm.controls.securityCode.valid &&
              component.cardCaptureForm.controls.creditCardType.value !== null &&
              component.cardCaptureForm.controls.address1.valid &&
              component.cardCaptureForm.controls.zip.valid &&
              component.cardCaptureForm.controls.state.value !== null &&
              component.cardCaptureForm.controls.city.valid
            );
          } else {
            component.isSubmitCardFormDisabled = !(
              component.cardCaptureForm.controls.cardNumber.valid &&
              component.cardCaptureForm.controls.expirationDate.valid &&
              component.cardCaptureForm.controls.securityCode.valid &&
              component.cardCaptureForm.controls.creditCardType.value !== blankCreditCard.type
            );
          }
        });
        contentService = fixture.componentRef.injector.get('ContentService');
        cardCaptureAppService = fixture.componentRef.injector.get(CardCaptureAppService);
      });
  }));

  describe('Initialization', () => {
    it('should instantiate', () => {
      expect(component).toBeDefined();
    });
  });

  describe('ngOnInit()', () => {
    it('should init component', async(() => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(component).toBeDefined();
      });
    }));
  });

  describe('verifyTokenStatus()', () => {
    it('should not set token to empty if card number is valid ', fakeAsync(() => {
      component.token = true;
      component.cardNumberCaptureForm.controls.cardNumber.setValue('');
      component.verifyTokenStatus();
      expect(component.token).toEqual(false);
    }));

    it('should set token to empty if the card number is changed and becomes invalid in the process', fakeAsync(() => {
      component.cardNumberCaptureForm.controls.cardNumber.setValue('5432678965435632');
      component.token = true;
      component.verifyTokenStatus();
      expect(component.token).toEqual(true);
    }));
  });

  describe('onCardTypeChanged()', () => {
    it('should not set token to empty if card number is valid', fakeAsync(() => {
      component.onCardTypeChanged(creditCard);
      expect(component.cardNumberCaptureForm.controls.creditCardType.value).toEqual(null);
    }));
  });

  describe('getToken()', () => {
    it('should get the token for VWI Page', fakeAsync(() => {
      component.token = false;
      component.showCardAllFieldsForm = false;
      component.cardCaptureForm.controls.cardNumber.setValue('5432678965435632');
      jest
        .spyOn(cardCaptureAppService, 'getToken')
        .mockImplementation((cardNumber: string, tokenizationSuccess: any, tokenizationFailed: any) => {
          tokenizationSuccess('HGBt6jdsgyygud78');
        });
      component.getToken();
      expect(component.token).toEqual(true);
    }));
    it('should get the token for SMSP Page and redirect to external URL', fakeAsync(() => {
      component.token = false;
      component.showCardAllFieldsForm = true;
      component.cardCaptureForm.controls.cardNumber.setValue('5432678965435632');
      window.location.assign = jest.fn();
      jest
        .spyOn(cardCaptureAppService, 'getToken')
        .mockImplementation((cardNumber: string, tokenizationSuccess: any, tokenizationFailed: any) => {
          tokenizationSuccess('HGBt6jdsgyygud78');
        });
      component.getToken();
      expect(window.location.assign).toHaveBeenCalled();
    }));
    it('should show the error banner in case of any techical issue occurred with API', fakeAsync(() => {
      jest.spyOn(contentService, 'getByKey');
      component.cardCaptureForm.controls.cardNumber.setValue('5432678965435632');
      jest
        .spyOn(cardCaptureAppService, 'getToken')
        .mockImplementation((cardNumber: string, tokenizationSuccess: any, tokenizationFailed: any) => {
          tokenizationFailed('403', '290001', 'Error', 'ErrorDetails');
        });
      component.getToken();
      expect(showErrorBoolean).toEqual(true);
    }));
    it('should show the field error in case of Invalid card data enetered for SMSP Page', fakeAsync(() => {
      jest.spyOn(contentService, 'getByKey');
      jest.spyOn(component.cardCaptureForm, 'get');
      component.showCardAllFieldsForm = true;
      jest
        .spyOn(cardCaptureAppService, 'getToken')
        .mockImplementation((cardNumber: string, tokenizationSuccess: any, tokenizationFailed: any) => {
          tokenizationFailed('403', '290000', 'Error', 'ErrorDetails');
        });
      component.getToken();
      expect(contentService.getByKey).toHaveBeenCalled();
      expect(component.cardCaptureForm.get).toHaveBeenCalled();
    }));
    it('should show the field error in case of Invalid card data enetered for VWI Page', fakeAsync(() => {
      jest.spyOn(contentService, 'getByKey');
      jest.spyOn(component.cardNumberCaptureForm, 'get');
      component.showCardAllFieldsForm = false;
      jest
        .spyOn(cardCaptureAppService, 'getToken')
        .mockImplementation((cardNumber: string, tokenizationSuccess: any, tokenizationFailed: any) => {
          tokenizationFailed('403', '290000', 'Error', 'ErrorDetails');
        });
      component.getToken();
      expect(contentService.getByKey).toHaveBeenCalled();
      expect(component.cardNumberCaptureForm.get).toHaveBeenCalled();
    }));
    it('tokenizer success for HJS', fakeAsync(() => {
      jest.spyOn(contentService, 'getByKey');
      jest.spyOn(component.cardNumberCaptureForm, 'get');
      component.currentAppId = 'HJS';
      component.showCardAllFieldsForm = true;
      window.parent.postMessage = jest.fn();
      jest
        .spyOn(cardCaptureAppService, 'getToken')
        .mockImplementation((cardNumber: string, tokenizationSuccess: any, tokenizationFailed: any) => {
          tokenizationSuccess('HGBt6jdsgyygud78');
        });
      component.getToken();
      expect(component.processingTokenization).toEqual(false);
      expect(window.parent.postMessage).toHaveBeenCalled();
    }));
    it('tokenizer success for all apps except HJS', fakeAsync(() => {
      jest.spyOn(contentService, 'getByKey');
      jest.spyOn(component.cardNumberCaptureForm, 'get');
      component.currentAppId = 'SMSP';
      component.showCardAllFieldsForm = true;
      jest
        .spyOn(cardCaptureAppService, 'getToken')
        .mockImplementation((cardNumber: string, tokenizationSuccess: any, tokenizationFailed: any) => {
          tokenizationSuccess('HGBt6jdsgyygud78');
        });
      component.getToken();
      expect(component.processingTokenization).toEqual(false);
    }));
    it('post process payment error case', () => {
      const err = {
        status: 422,
        response: {
          data: {
            errors: [
              {
                errorCode: '1234',
                errorMessage: 'API Error'
              }
            ]
          }
        }
      };
      mockGetStreamRunner = jest.fn(() => () => observableThrowError(err));
      window.sprintApp.getComponentFactory = jest.fn(() =>
        Promise.resolve(() => ({
          getStreamRunner: mockGetStreamRunner
        }))
      );
      component.getToken();
      expect(showErrorBoolean).toBe(true);
    });
    it('post process payment response', () => {
      document.body.innerHTML = `
      <div data-card-capture-form class="hide"></div>
      <div data-confirmation-message class=""></div>
      `;
      const response = {
        status: 200,
        response: {
          data: {
            Status: 'Submitted',
            GUID: '012345678901234567',
            LogId: 'b7d9ac2c-7f50-4ed5-985b-55542fe98261',
            StatusDetail: []
          }
        }
      };
      mockGetStreamRunner = jest.fn(() => () => observableOf(response));
      window.sprintApp.getComponentFactory = jest.fn(() =>
        Promise.resolve(() => ({
          getStreamRunner: mockGetStreamRunner
        }))
      );
      component.getToken();
      const captureForm = document.querySelector('[data-card-capture-form]');
      const confirmationMsg = document.querySelector('[data-confirmation-message]');
      expect(captureForm.classList.contains('hide')).toBe(true);
      expect(confirmationMsg.classList.contains('hide')).toBe(false);
      expect(component.processingTokenization).toBe(false);
    });
    it('generate preorder token error response', () => {
      const err = {
        status: 422,
        response: {
          data: {
            errors: [
              {
                errorCode: 'duplicateOrderId',
                errorMessage: 'Duplicate Order Id'
              }
            ]
          }
        }
      };
      mockGetStreamRunner = jest.fn(() => () => observableThrowError(err));
      window.sprintApp.getComponentFactory = jest.fn(() =>
        Promise.resolve(() => ({
          getStreamRunner: mockGetStreamRunner
        }))
      );
      component.getToken();
      expect(showErrorBoolean).toBe(true);
    });
    it('generate preorder token success response', () => {
      const response = {
        status: 200,
        response: {
          data: {
            status: 'success'
          }
        }
      };
      mockGetStreamRunner = jest.fn(() => () => observableOf(response));
      window.sprintApp.getComponentFactory = jest.fn(() =>
        Promise.resolve(() => ({
          getStreamRunner: mockGetStreamRunner
        }))
      );
      component.getToken();
      expect(showSuccessBoolean).toBe(true);
    });
  });
});

type CreditCardType = 'VISA' | 'MASTERCARD' | 'AMEX' | 'DINERS' | 'DISCOVER';
const creditCard = {
  type: null,
  test: new RegExp('^\\d$'),
  format: [4, 5],
  validator: new RegExp('^\\d$'),
  minLength: 16,
  maxLength: 16,
  cvvLength: 3
};
export interface LangChangeEvent {
  lang: string;
  translations: any;
}

class TranslateServiceStub {
  public onLangChange: EventEmitter<LangChangeEvent> = new EventEmitter<LangChangeEvent>();
  constructor() {
    this.onLangChange.emit({
      lang: 'en-us',
      translations: {}
    });
  }
  public setDefaultLang(lang: string): void {}
  public getTranslation(lang: string): Observable<any> {
    return observableOf({});
  }
}
