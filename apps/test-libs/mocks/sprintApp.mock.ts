import { never as observableNever } from 'rxjs';

export class SprintApp {
  authModule = {
    getUser: jest.fn(() => ({
      userAttributes: {
        accountType: 'I',
        accountSubType: 'I'
      }
    })),
    isAuthenticated: jest.fn(() => false),
    getUsersAPIResponse: jest.fn(() => []),
    getSessionAPIResponse: jest.fn(() => ({
      userAttributes: {
        cartPackageWithContract: null
      }
    }))
  };
  headProviders = {
    userService: {
      isAuthenticated: true
    }
  };
  sharedMethods = {
    addressMethods: {
      addressToString: jest.fn(),
      calculateHaversineDistance: jest.fn(),
      degreesToRadians: jest.fn(),
      getStateAbbreviations: jest.fn(),
      getStateNames: jest.fn(),
      kilometersToMiles: jest.fn(),
      milesToKilometers: jest.fn()
    },
    analyticsMethods: {
      closeModal: jest.fn(),
      createAnalyticsItem: jest.fn(),
      getPageBaseAnalytics: jest.fn(),
      saqPush: jest.fn(),
      saqRawPush: jest.fn(),
      setPageBaseAnalytics: jest.fn(),
      trackClick: jest.fn(),
      trackEvent: jest.fn(),
      trackMessage: jest.fn(),
      trackModal: jest.fn(),
      trackPage: jest.fn(),
      trackTransaction: jest.fn(),
      trackUpdate: jest.fn(),
      trackWidget: jest.fn()
    },
    dateMethods: {
      monthDiff: jest.fn()
    },
    imageMethods: {
      lazyLoadImage: jest.fn()
    },
    locationMethods: {
      checkQueryString: jest.fn(),
      encodeQueryParams: jest.fn(),
      getGlobalSharedLink: jest.fn(),
      getGlobalSharedLinkAsync: jest.fn(),
      isRedirectDisabled: jest.fn(),
      redirect: jest.fn(),
      updateQueryString: jest.fn()
    },
    phoneMethods: {
      phoneToString: jest.fn()
    },
    pricingMethods: {
      generateDisplayPrice: jest.fn()
    },
    storageMethods: {
      checkCookie: jest.fn(),
      getItem: jest.fn(),
      localStorageAvailable: jest.fn(),
      removeItem: jest.fn(),
      sessionStorageAvailable: jest.fn(),
      setItem: jest.fn()
    },
    streamMethods: {
      retrieveAEMAccessoryData: jest.fn(),
      retrieveAEMDeviceData: jest.fn(),
      runParallelStreams: jest.fn()
    },
    stringMethods: {
      annotateNumber: jest.fn(),
      convertUtcString: jest.fn(),
      deannotateString: jest.fn()
    }
  };
  createAtgRunTargeterBatch = jest.fn();
  globalSettings = {
    flex2Active: ''
  };
  globalErrorHandler = {
    resetGlobalError: jest.fn(),
    retrieveErrorMessage: jest.fn(),
    triggerGlobalError: jest.fn(),
    triggerGlobalErrorWithLookup: jest.fn()
  };
  globalErrors = [];
  globalMessageHandler = {
    resetGlobalMessage: jest.fn()
  };
  globalMessages = [];
  globalSharedLinks = {};
  nbaProfileOffer = jest.fn();
  rtgResponse$ = observableNever();
  getComponentFactory = jest.fn((key: string) => {
    const factories = {
      SprintStreams: () => ({
        apiConfig: {},
        serviceKeysByTreeId: {},
        serviceKeysByHttpMethod: {},
        sprintServiceList: {},
        sprintStreams: {},
        sprintServices: {},
        authenticate: jest.fn(),
        getStream: jest.fn(),
        getStreamRunner: jest.fn(),
        getStreamRunnerWithCache: jest.fn(),
        clearStreamRunnerCache: jest.fn(),
        getStreamOfType: jest.fn(),
        getMergedStreamsOfType: jest.fn(),
        getErrorStream: jest.fn(),
        getLoadingStream: jest.fn()
      }),
      DeviceService: () => ({
        deviceInfo$: observableNever(),
        deviceContract$: observableNever(),
        deviceCredit$: observableNever(),
        devicePlan$: observableNever(),
        services$: observableNever(),
        deviceStream$: observableNever(),
        plansStream$: observableNever(),
        pricingStream$: observableNever(),
        servicesStream$: observableNever(),
        customerServiceArea$: observableNever(),
        deviceQuantity$: observableNever(),
        setDeviceInfo: jest.fn(),
        setDeviceContract: jest.fn(),
        setDeviceCreditInfo: jest.fn(),
        setDevicePlan: jest.fn(),
        setDeviceServices: jest.fn(),
        setDeviceQuantity: jest.fn(),
        getDeviceDetails: jest.fn(),
        getDevicePricing: jest.fn(),
        getDevicePlans: jest.fn(),
        getAccountPlans: jest.fn(),
        getDeviceServices: jest.fn()
      }),
      GoogleMapsService: () => ({
        options: {},
        addAddressAutoComplete: jest.fn(),
        getCityAndStateByZip: jest.fn(),
        googleAddressToSprintAddress: jest.fn(),
        getLocationByCoordinates: jest.fn(),
        createLocation: jest.fn(),
        createMapLoadOptions: jest.fn(),
        createMap: jest.fn(),
        createMarker: jest.fn()
      })
    };

    return Promise.resolve(factories[key]);
  });
  openTwoFactorAuthModal = jest.fn();
  container = {
    createChild: jest.fn(),
    get: jest.fn(() => ({
      trackModal: jest.fn(),
      closeModal: jest.fn(),
      createAnalyticsItem: jest.fn(),
      getByKey: jest.fn(),
      getById: jest.fn().mockReturnValue(''),
      getGlobalSharedLink: jest.fn(),
      checkQueryString: jest.fn()
    }))
  };
  care = {
    container: this.container.createChild()
  };
}

Object.defineProperty(window, 'sprintApp', {
  value: new SprintApp(),
  writable: true
});
