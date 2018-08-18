import { DoneFn, TestBed, inject } from '@angular/core/testing';

import { CryptoService } from './crypto.service';

declare var TextEncoder: any;

describe('CryptoService', () => {
  const textEncoder = new TextEncoder();
  let service: CryptoService;
  let testMessage: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CryptoService]
    });

    service = TestBed.get(CryptoService);
    testMessage = textEncoder.encode('test message');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate a keypair on demand', (done: DoneFn) => {
    expect(service.keyPairObservable).toBeTruthy();
    service.getOwnPublicKey().subscribe(publicKey => {
      expect(publicKey).toBeTruthy();
      expect(publicKey.type).toBe('public');
      done();
    });
  });

  it('should generate a signature when asked to sign', (done: DoneFn) => {
    service.sign(testMessage).subscribe(signature => {
      expect(signature).toBeTruthy();
      done();
    });
  });
});
