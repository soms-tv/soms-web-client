import { TestBed, inject } from '@angular/core/testing';

import { forkJoin, from } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { SharedService } from './shared.service';

declare var TextEncoder: any;
declare var TextDecoder: any;

describe('SharedService', () => {
  const textEncoder = new TextEncoder();
  let service: SharedService;
  let testMessage: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SharedService]
    });

    service = TestBed.get(SharedService);
    testMessage = textEncoder.encode('test message');

    const socketObservable = null;
    service.socketObservable = socketObservable;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should do nothing', (done: DoneFn) => {
    done();
  });
});
