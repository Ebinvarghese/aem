import '@sprint-types/sprint-common/global/rxjs';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { CardCaptureAppModule } from './app/card-capture-app/card-capture-app.module';
import 'zone.js';

try {
  if (process.env.NODE_ENV === 'production') {
    enableProdMode();
  }
} catch (error) {
  window.log('Enabling Angular prod mode failed', 'error', error);
}

platformBrowserDynamic()
  .bootstrapModule(CardCaptureAppModule, { preserveWhitespaces: true })
  .catch(error => {
    window.log('Bootstrap of CardCaptureAppModule failed', 'error', error);
  });
