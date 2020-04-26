import { of as observableOf, concat as observableConcat, BehaviorSubject, Observable, Observer } from 'rxjs';
import { take, mergeMap, map, share } from 'rxjs/operators';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PciValidators } from 'src/app/card-capture-app/validators/pci.validators';
import { ContentService } from '@sprint-types/sprint-common/global/content-service';
import { Inject } from '@angular/core';
import { FieldErrorComponent } from 'apps/test-libs/forms/field-error.component';
import { TranslateService } from '@ngx-translate/core';
import { BrowserLocationUtilitiesService } from '@sprint-types/sprint-common';
import { CardCaptureAppService } from './card-capture-app.service';
import { LogType } from '@sprint-types/sprint-common';
import { IServiceLayer } from '@sprint-types/sprint-common/global/service-layer';

const HJSApplID = 'HJS';
const SalesForceAppId = 'SFDC';
const B2BAppId = 'B2B';
const EGAppId = 'EG';
const ActorId = 'WEBSHOP';
const ActorChannel = 'WEBSHOP';

@Component({
  selector: 'sprint-pci-card-capture',
  templateUrl: './card-capture-app.component.html'
})
export class CardCaptureAppComponent implements OnInit {
  public orderId: string;
  public currentAppId: string;
  public redirectUrl: string;
  public showCardAllFieldsForm: boolean;
  public showPageTitle: boolean;
  public token: boolean;
  public cardCaptureForm: FormGroup;
  public cardNumberCaptureForm: FormGroup;
  public readonly cardIconClass$: Observable<string>;
  public isSubmitCardNumberDisabled: boolean;
  public isSubmitCardFormDisabled: boolean;
  public errorText: string;
  public successText: string;
  public processingTokenization: boolean;
  private readonly creditCardType$: BehaviorSubject<string>;
  private creditCardType: CreditCardType | null = blankCreditCard.type;
  private currentLang$: Observable<string>;
  public showCancelButton: boolean;
  public isSalesForceApp: boolean;
  public isB2BApp: boolean;
  public isEGApp: boolean;
  public captchaKeyValue: string;
  public orderAmount$: Observable<string>;
  private showErrorSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  public showError$: Observable<boolean>;
  private showSuccessSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  public showSuccess$: Observable<boolean>;
  private cardCaptureHeader: HTMLElement;
  public externalorderId: string;
  private errorCode: string;
  private errorKey: string;
  @ViewChild('creditCardNumberError', { static: false }) public creditCardNumberError: FieldErrorComponent;

  private static htmlLang$: Observable<string> = Observable.create((obs: Observer<string>) => {
    obs.next(document.documentElement.lang || 'en-US');
    obs.complete();
  });
  /**
   * Constructor
   * @param formBuilder
   * @param contentService
   * @param translate
   */
  constructor(
    private formBuilder: FormBuilder,
    private cardCaptureAppService: CardCaptureAppService,
    private readonly translate: TranslateService,
    @Inject('ServiceLayerService') private serviceLayer: IServiceLayer,
    @Inject('ContentService') private readonly contentService: ContentService,
    @Inject('BrowserLocationUtilitiesService')
    private readonly browserLocationUtilitiesService: BrowserLocationUtilitiesService
  ) {
    this.errorText = '';
    this.successText = '';
    this.token = false;
    this.isSubmitCardNumberDisabled = true;
    this.isSubmitCardFormDisabled = true;
    this.showCardAllFieldsForm = !this.contentService.getByKey('card-capture-app-component', 'enableVWIPageFlag');
    this.captchaKeyValue = this.contentService.getByKey('card-capture-app-component-captcha', 'captchaKeyValue');

    this.creditCardType$ = new BehaviorSubject('');
    this.cardIconClass$ = this.creditCardType$.pipe(
      map(ccType => (typeof ccType === 'string' && ccType.length > 0 ? `cc-${ccType.toLowerCase()}` : 'cc-default'))
    );

    // get query param info
    this.orderId = this.browserLocationUtilitiesService.checkQueryString('oid');
    this.currentAppId = this.browserLocationUtilitiesService.checkQueryString('appId');
    this.redirectUrl = this.browserLocationUtilitiesService.checkQueryString('redirectUrl');
    this.isSalesForceApp = this.currentAppId && this.currentAppId.toLowerCase() === SalesForceAppId.toLowerCase();
    this.isB2BApp = this.currentAppId && this.currentAppId.toLowerCase() === B2BAppId.toLowerCase();
    this.isEGApp = this.currentAppId && this.currentAppId.toLowerCase() === EGAppId.toLowerCase();

    // To get the dictionary
    CardCaptureAppComponent.htmlLang$.subscribe(html => {
      if (html === 'en-US') {
        this.currentLang$ = observableConcat(
          observableOf('en_us'),
          this.translate.onLangChange.pipe(map(changeEvent => changeEvent.lang))
        ).pipe(share());
      } else {
        this.currentLang$ = observableConcat(
          CardCaptureAppComponent.htmlLang$,
          this.translate.onLangChange.pipe(map(changeEvent => changeEvent.lang))
        ).pipe(share());
      }
    });
    this.currentLang$.pipe(
      mergeMap(lang => this.translate.getTranslation(lang)),
      take(1),
      map(() => true)
    );
    this.translate.setDefaultLang('en_us');
  }

  /**
   * ngOnInit - Initialize the forms
   */
  public ngOnInit(): void {
    // show page title for specific application users given in pageTitleAppIdList
    const appIdContent = this.contentService.getByKey('card-capture-app-component', 'pageTitleAppIdList');
    const appIdList = appIdContent ? appIdContent.split(',') : [];
    const showPageTitle = appIdList.some(appId => appId === this.currentAppId);
    if (showPageTitle) {
      this.showPageTitle = true;
    }

    // if page url has appId then display header mapped to that application id
    // show default header when there is no application id passed in url
    let headerTitleText = this.contentService.getByKey('card-capture-app-component', 'cardCaptureDefaultHeader');
    const headerTitleMap = this.contentService.getByKey('card-capture-app-component', 'headerInformation');
    const headerTitleArray: Array<{ applicationId: string; applicationHeaderName: string }> = headerTitleMap
      ? Array.from(headerTitleMap)
      : [];
    headerTitleArray.forEach(item => {
      if (item.applicationId === this.currentAppId) {
        headerTitleText = item.applicationHeaderName;
      }
    });
    this.cardCaptureHeader = document.querySelector('[data-card-capture-header]');
    if (this.cardCaptureHeader) {
      this.cardCaptureHeader.textContent = headerTitleText;
    }

    // show cancel button for CLCS users
    const CLCSAppIds = this.contentService.getByKey('card-capture-app-component', 'CLCSAppIdList');
    const CLCSAppIdList = CLCSAppIds ? CLCSAppIds.split(',') : [];
    this.showCancelButton = CLCSAppIdList.some(appId => appId === this.currentAppId);

    this.cardCaptureForm = this.formBuilder.group({
      nameOnCard: [
        '',
        Validators.compose([
          (control: AbstractControl) => {
            return Validators.required(control);
          },
          PciValidators.checkingNameValidator
        ])
      ],
      reCaptcha: [
        '',
        Validators.compose([
          (control: AbstractControl) => {
            return Validators.required(control);
          }
        ])
      ]
    });
    this.cardNumberCaptureForm = this.formBuilder.group({
      cardNumber: [null, Validators.required],
      creditCardType: [null, Validators.required],
      token: [null, null]
    });

    this.cardCaptureForm.valueChanges.subscribe(value => {
      if (this.isSalesForceApp) {
        const orderAmount = this.browserLocationUtilitiesService.checkQueryString('orderAmount');
        this.orderAmount$ = orderAmount ? observableOf(orderAmount) : observableOf();
        this.isSubmitCardFormDisabled = !(
          this.cardCaptureForm.controls.cardNumber.valid &&
          this.cardCaptureForm.controls.expirationDate.valid &&
          this.cardCaptureForm.controls.securityCode.valid &&
          this.cardCaptureForm.controls.creditCardType.value !== null &&
          this.cardCaptureForm.controls.address1.valid &&
          this.cardCaptureForm.controls.zip.valid &&
          this.cardCaptureForm.controls.state.value !== null &&
          this.cardCaptureForm.controls.city.valid
        );
      } else if (this.isB2BApp || this.isEGApp) {
        this.isSubmitCardFormDisabled = !(
          this.cardCaptureForm.controls.cardNumber.valid &&
          this.cardCaptureForm.controls.expirationDate.valid &&
          this.cardCaptureForm.controls.securityCode.valid &&
          this.cardCaptureForm.controls.creditCardType.value !== blankCreditCard.type &&
          this.cardCaptureForm.controls.reCaptcha.value !== '' &&
          this.cardCaptureForm.controls.reCaptcha.value !== null
        );
      } else {
        this.isSubmitCardFormDisabled = !(
          this.cardCaptureForm.controls.cardNumber.valid &&
          this.cardCaptureForm.controls.expirationDate.valid &&
          this.cardCaptureForm.controls.securityCode.valid &&
          this.cardCaptureForm.controls.creditCardType.value !== blankCreditCard.type
        );
      }
    });

    this.cardNumberCaptureForm.valueChanges.subscribe(value => {
      this.isSubmitCardNumberDisabled = !(
        this.cardNumberCaptureForm.controls.cardNumber.valid && this.creditCardType !== blankCreditCard.type
      );
    });
    this.showError$ = this.showErrorSubject.asObservable();
    this.showSuccess$ = this.showSuccessSubject.asObservable();
  }

  /**
   * verifyTokenStatus - Verifies the current token status
   */
  public verifyTokenStatus(): void {
    if (!this.cardNumberCaptureForm.controls.cardNumber.valid) {
      this.token = false;
    }
  }

  /**
   * onCardTypeChanged - Set the card type once the cardtype is known or changed
   * @param type
   */
  public onCardTypeChanged(type: CreditCard): void {
    this.creditCardType = type.type;
    this.creditCardType$.next(type.type as string);
    this.cardNumberCaptureForm.controls['creditCardType'].setValue(this.creditCardType);
  }

  /**
   * getToken - Gets the token based on card-number from external resources
   */
  public getToken(): void {
    this.processingTokenization = true;
    this.errorText = '';
    this.successText = '';
    this.showErrorSubject.next(false);
    this.showSuccessSubject.next(false);
    const cardNumber = this.showCardAllFieldsForm
      ? this.cardCaptureForm.controls.cardNumber.value
      : this.cardNumberCaptureForm.controls.cardNumber.value;

    if (!this.showCardAllFieldsForm) {
      this.cardCaptureAppService.getToken(cardNumber, this.setTokenForVWI.bind(this), this.handleError.bind(this));
    } else {
      this.cardCaptureAppService.getToken(cardNumber, this.handleSuccess.bind(this), this.handleError.bind(this));
    }
  }

  /**
   * setTokenForVWI - Sets token for VWI Page and shows on GUI
   * @param token
   */
  private setTokenForVWI(token) {
    this.processingTokenization = false;
    this.token = true;
    this.cardNumberCaptureForm.controls.token.setValue(token);
  }

  /**
   * copyToken - Copies the token to clipboard
   */
  public copyToken(): void {
    const el = document.createElement('textarea');
    el.value = this.cardNumberCaptureForm.controls.token.value;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }

  /**
   * handleResponseError - Display the Post Process Token API Errors
   */
  private handleResponseError(errorCode: string): string {
    switch (errorCode) {
      case 'OTP-422-1':
        return 'verificationFailed';
      case 'OTP-422-2':
        return 'invalidOTP';
      case 'OTP-422-3':
        return 'expiredOTP';
      case 'SFDC-422-1':
        return 'unavailableGUID';
      case 'NO_RECORD_FOUND':
        return 'noRecordFound';
      default:
        return 'technicalError';
    }
  }

  /**
   * handleSuccess - redirects the control to methods based on appl ID
   * @param token
   */
  private handleSuccess(token: string): void {
    if (this.currentAppId && this.currentAppId.toLowerCase() === HJSApplID.toLowerCase()) {
      this.handleSuccessForiFrame(token);
    } else if (this.isSalesForceApp) {
      const guid = this.browserLocationUtilitiesService.checkQueryString('guid');
      const otp = this.browserLocationUtilitiesService.checkQueryString('otp');
      const decodedOTP = decodeURI(otp);
      const orderAmount = this.browserLocationUtilitiesService.checkQueryString('orderAmount');
      this.orderAmount$ = orderAmount ? observableOf(orderAmount) : observableOf();
      const inputData = {
        GUID: guid,
        OTP: decodedOTP,
        TempToken: token,
        RemoteMachineAddress: '',
        Address: {
          Street1: this.cardCaptureForm.controls.address1.value,
          Street2: this.cardCaptureForm.controls.address2.value,
          City: this.cardCaptureForm.controls.city.value,
          State: this.cardCaptureForm.controls.state.value,
          Zip: this.cardCaptureForm.controls.zip.value
        },
        CardData: {
          Name: this.cardCaptureForm.controls.nameOnCard.value,
          ExpDate: this.cardCaptureForm.controls.expirationDate.value,
          CVV: this.cardCaptureForm.controls.securityCode.value,
          CreditCardType: this.cardCaptureForm.controls.creditCardType.value
        }
      };

      this.serviceLayer
        .getStreamRunner('postProcessPaymentUsingToken')({
          data: inputData
        })
        .subscribe(
          () => {
            this.processingTokenization = false;
            const cardCaptureForm = document.querySelector('[data-card-capture-form]');
            const paymentSuccessMsg = document.querySelector('[data-confirmation-message]');
            if (cardCaptureForm && paymentSuccessMsg) {
              cardCaptureForm.classList.add('hide');
              paymentSuccessMsg.classList.remove('hide');
            }
          },
          err => {
            this.showErrorSubject.next(true);
            this.errorCode =
              err &&
              err.response &&
              err.response.data &&
              err.response.data.errors[0] &&
              err.response.data.errors[0].errorCode
                ? err.response.data.errors[0].errorCode
                : '';
            this.errorKey = this.handleResponseError(this.errorCode);
            this.errorText = this.contentService.getByKey('card-capture-app-component', this.errorKey);
            this.processingTokenization = false;
            window.log('process payment failed', err);
          }
        );
    } else if (this.isB2BApp || this.isEGApp) {
      const orderId = B2BAppId + Date.now();
      // externalorderId is to display to user on frontend
      this.externalorderId = B2BAppId + Date.now() + '|' + ActorChannel;
      const reCaptchaResponse = grecaptcha.getResponse();
      const usrGroup = this.isB2BApp ? B2BAppId : EGAppId;
      const inputData = {
        externalOrderId: orderId,
        actorChannel: ActorChannel,
        actorId: ActorId,
        nameOnCard: this.cardCaptureForm.controls.nameOnCard.value,
        cardEphemeralToken: token,
        expirationDate: this.cardCaptureForm.controls.expirationDate.value,
        cardVerificationCode: this.cardCaptureForm.controls.securityCode.value,
        userGroup: usrGroup,
        captchaResponse: reCaptchaResponse
      };
      this.serviceLayer
        .getStreamRunner('postGeneratePreOrderToken')({
          data: inputData
        })
        .subscribe(
          () => {
            this.showSuccessSubject.next(true);
            this.cardCaptureForm.reset();
            this.cardCaptureForm.markAsUntouched();
            this.cardCaptureForm.markAsPristine();
            this.processingTokenization = false;
            this.cardCaptureHeader.classList.add('hide');
          },
          err => {
            this.showErrorSubject.next(true);
            this.errorText = this.contentService.getByKey('card-capture-app-component', 'technicalError');
            this.processingTokenization = false;
          }
        );
    } else {
      this.redirectToExternalUrl(token);
    }
  }
  /**
   * redirectToExternalUrl - redirects the control to external URL provided as query param after getting token
   * @param token
   */
  private redirectToExternalUrl(token: string): void {
    this.processingTokenization = false;
    const cardType = this.cardCaptureForm.controls.creditCardType.value;
    const expiryDate = this.cardCaptureForm.controls.expirationDate.value;
    const cvv = this.cardCaptureForm.controls.securityCode.value;
    const cardHolderName = this.cardCaptureForm.controls.nameOnCard.value;

    const queryParams =
      '?oid=' +
      this.orderId +
      '&cardHolderName=' +
      cardHolderName +
      '&token=' +
      token +
      '&expirationDate=' +
      expiryDate +
      '&cvv=' +
      cvv +
      '&cardType=' +
      cardType;
    window.location.assign(this.redirectUrl + queryParams);
  }

  /**
   * handleSuccessForiFrame - call the postMessage function that is available on iframe parent modal
   * This FTW page will be opened as a modal on iframe for HJS. The parent page will be
   * responsible for closing the modal once data is read from this form
   * @param token
   */
  private handleSuccessForiFrame(token: string): void {
    this.processingTokenization = false;
    const expiryDate = this.cardCaptureForm.controls.expirationDate.value;
    const cvvValue = this.cardCaptureForm.controls.securityCode.value;
    try {
      const domain = document.referrer;
      const ICreditCardInfo = { creditcard: token, cvv: cvvValue, expiry: expiryDate };
      window.parent.postMessage(ICreditCardInfo, domain);
    } catch (err) {
      window.log('Error posting message to iframe ', err, LogType.ERROR);
    }
  }

  /**
   * handleError - Handles error on the page for the API errors
   * @param httpStatus
   * @param errorCode
   * @param errorMessage
   * @param errorDetails
   */
  private handleError(httpStatus: string, errorCode: string, errorMessage: string, errorDetails: any) {
    if (errorCode === '290000') {
      if (!this.showCardAllFieldsForm) {
        this.cardNumberCaptureForm.get(['cardNumber']).setErrors({
          INVALID_PAYMENT_CARD_DATA: this.contentService.getByKey('card-capture-app-component', 'invalidCardError')
        });
      } else {
        this.cardCaptureForm.get(['cardNumber']).setErrors({
          INVALID_PAYMENT_CARD_DATA: this.contentService.getByKey('card-capture-app-component', 'invalidCardError')
        });
      }
    } else {
      this.showErrorSubject.next(true);
      this.errorText = this.contentService.getByKey('card-capture-app-component', 'technicalError');
    }
    this.processingTokenization = false;
  }

  /**
   * redirectToOriginalApp - Cancel payment and direct user back to original app
   */
  public redirectToOriginalApp(): void {
    const queryParams = '?oid=' + this.orderId + '&cancel=true';
    window.location.assign(this.redirectUrl + queryParams);
  }

  public hideMessage(messageType: string): void {
    if (messageType === 'error') {
      this.showErrorSubject.next(false);
    } else {
      this.showSuccessSubject.next(false);
    }
  }
}

type CreditCardType = 'VISA' | 'MASTERCARD' | 'AMEX' | 'DINERS' | 'DISCOVER';

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

type CreditCards = Record<CreditCardType, CreditCard>;
