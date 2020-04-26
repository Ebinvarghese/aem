// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import './polyfills.ts';
import '@sprint-types/sprint-common/global/rxjs';

import 'zone.js/dist/long-stack-trace-zone';
import 'zone.js/dist/proxy.js';
import 'zone.js/dist/sync-test';
import 'zone.js/dist/jasmine-patch';
import 'zone.js/dist/async-test';
import 'zone.js/dist/fake-async-test';
import { getTestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

// Unfortunately there's no typing for the `__karma__` variable. Just declare it as any.
declare var __karma__: any;
declare var require: any;

__karma__.loaded = () => {
  // Prevent Karma from running prematurely.
};

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

// Then we load all source files, including specs
const aemComponentsContext = require.context(
  '../node_modules/@sprint-types/sprint-common/global',
  true,
  /^.*\/index\.ts$/
);
const appContext = require.context('./app', true, /\.ts$/);
const sharedContext = require.context('./shared', true, /\.ts$/);

// And load the modules.
aemComponentsContext.keys().map(aemComponentsContext);
appContext.keys().map(appContext);
sharedContext.keys().map(sharedContext);

// Finally, start Karma to run the tests.
__karma__.start();
