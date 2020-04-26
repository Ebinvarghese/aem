/* tslint:disable:no-import-side-effect */
// Import global mocks
import 'core-js/es6';
import 'core-js/es7';
import 'jest-preset-angular';
import './mocks/sprintApp.mock';
import 'rxjs';

Object.defineProperty(window, '_saq', {
  value: [],
  writable: true
});
