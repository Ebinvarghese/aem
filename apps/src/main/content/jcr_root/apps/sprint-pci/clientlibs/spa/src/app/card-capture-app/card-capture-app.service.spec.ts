import { async, fakeAsync, TestBed, inject } from '@angular/core/testing';
import { Component, Input } from '@angular/core';
import { CardCaptureAppService } from './card-capture-app.service';
import { TokenizerService } from '@sprint-types/sprint-common';

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

const tokenizerServiceStub = {
  ephemeralTokenizer: jest.fn()
};

describe('CardCaptureAppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        CardCaptureAppService,
        {
          provide: 'TokenizerService',
          useValue: tokenizerServiceStub
        }
      ]
    });
  }));

  describe('Initialization', () => {
    it('should instantiate', inject([CardCaptureAppService], (cardCaptureAppService: CardCaptureAppService) => {
      expect(cardCaptureAppService).toBeDefined();
    }));
  });

  describe('getToken()', () => {
    it('should get the token for VWI Page', fakeAsync(
      inject(
        [CardCaptureAppService, 'TokenizerService'],
        (cardCaptureAppService: CardCaptureAppService, tokenizerService: TokenizerService) => {
          jest
            .spyOn(tokenizerService, 'ephemeralTokenizer')
            .mockImplementation((cardNumber: string, tokenizationSuccess: any, tokenizationFailed: any) => {
              tokenizationSuccess('HGBt6jdsgyygud78');
            });
          cardCaptureAppService.getToken(
            '4114360123456785',
            () => {},
            () => {}
          );
          expect(tokenizerService.ephemeralTokenizer).toHaveBeenCalled();
        }
      )
    ));
  });
});
