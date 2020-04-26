import { Injectable, Inject } from '@angular/core';
import { TokenizerService } from '@sprint-types/sprint-common';

@Injectable()
export class CardCaptureAppService {
  constructor(@Inject('TokenizerService') private readonly tokenizerService: TokenizerService) {}

  /**
   * getToken - gets the token from external resources based on card number
   * @param cardNumber
   * @param onTokenizationSuccess - function which must be called when call to token API gives a success
   * @param onTokenizationFailure - function which must handle errors if tokenization API returns an error
   */
  public getToken(cardNumber: string, onTokenizationSuccess: any, onTokenizationFailure: any) {
    this.tokenizerService.ephemeralTokenizer(cardNumber, onTokenizationSuccess, onTokenizationFailure);
  }
}
