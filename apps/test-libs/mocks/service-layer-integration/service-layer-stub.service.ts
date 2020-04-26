import { of as observableOf, Observable, ConnectableObservable, Subscriber } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class ServiceLayerServiceStub {
  public getServiceLayer: any;
  public getLoadingStream: jest.Mock<{}>;
  public generateLoadingStream: jest.Mock<{}>;
  public getServiceLayerPromise: any;
  public getStreamRunnerWithCache: any;
  public generateAutoConnectObservable: jest.Mock<{}>;
  public getMergedStreamsOfType: jest.Mock<{}>;
  public getStreamOfType: jest.Mock<{}>;
  public dispatchServiceEvent: jest.Mock<{}>;
  constructor() {
    this.getServiceLayer = jest.fn();
    this.generateLoadingStream = jest.fn(this.fakeGenerateLoadingStream);
    this.getLoadingStream = jest.fn(this.fakeGetLoadingStream);
    this.getServiceLayerPromise = jest.fn();
    this.getStreamRunnerWithCache = jest.fn();
    this.dispatchServiceEvent = jest.fn();
    this.generateAutoConnectObservable = jest.fn();
    this.getStreamOfType = jest.fn(this.fakeGetStreamOfType);
    this.generateUpdateStream = jest.fn();
    this.getMergedStreamsOfType = jest.fn(this.fakeGetMergedStreamsOfType);
  }

  //noinspection JSMethodCanBeStatic
  public fakeGenerateLoadingStream(): Observable<boolean> {
    return observableOf(false);
  }

  public fakeGenerateAutoConnectObservable<T>(source: ConnectableObservable<T>): Observable<T> {
    return Observable.create((subscriber: Subscriber<T>) => {
      source.subscribe(
        next => {
          subscriber.next(next);
        },
        error => {
          subscriber.error(error);
        },
        () => {
          console.warn('ConnectableObservable wrapped as AutoConnectObservable completed. This may cause errors.');
          subscriber.complete();
        }
      );

      source.connect();
    });
  }

  public getStreamsByType(): Observable<any> {
    return observableOf({});
  }

  public getStreamRunner(): Observable<any> {
    return observableOf({});
  }

  public generateUpdateStream(): Observable<any> {
    return observableOf({});
  }

  public fakeGetMergedStreamsOfType(): Observable<any> {
    return observableOf(false);
  }

  public fakeGetLoadingStream(): Observable<any> {
    return observableOf(false);
  }

  public fakeGetStreamOfType(): Observable<any> {
    return observableOf(false);
  }
}
