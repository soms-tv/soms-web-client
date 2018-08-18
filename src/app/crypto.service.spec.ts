import { TestBed, inject } from '@angular/core/testing';

import { forkJoin } from 'rxjs';
import { flatMap } from 'rxjs/operators';

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

  it('should import new signatures for nonregistered senders', (done: DoneFn) => {
    service.exportPublicKey().subscribe(publicKey => {
      service.importSenderKey(publicKey, 'self').subscribe(success => {
        expect(success).toBeTruthy();
        done();
      });
    });
  });

  it('should reject new signatures if a sender is already registered', (done: DoneFn) => {
    service.exportPublicKey().subscribe(publicKey => {
      forkJoin(service.importSenderKey(publicKey, 'self'), service.importSenderKey(publicKey, 'self'))
        .subscribe(results => {
          expect(results[0]).not.toBe(results[1]);
          done();
        });
    });
  });

  it('should accept valid signatures', (done: DoneFn) => {
    service.exportPublicKey().subscribe(publicKey => {
        service.importSenderKey(publicKey, 'self').subscribe(success => {
        service.sign(testMessage).subscribe(signature => {
          service.verify(testMessage, signature, 'self').subscribe(valid => {
            expect(valid).toBeTruthy();
            done();
          });
        });
      });
    });
  });

  it('should reject invalid signatures', (done: DoneFn) => {
    service.exportPublicKey().subscribe(publicKey => {
        service.importSenderKey(publicKey, 'self').subscribe(success => {
        service.sign(testMessage).subscribe(signature => {
          const view = new Int8Array(signature);
          view[0] = 0;
          view[1] = 0;
          view[20] = 0;
          service.verify(testMessage, signature, 'self').subscribe(valid => {
            expect(valid).not.toBeTruthy();
            done();
          });
        });
      });
    });
  });

  it('should generate a room key when requested', (done: DoneFn) => {
    service.generateRoomKey().subscribe(roomKey => {
      expect(service.getRoomKey()).toBeTruthy();
      expect(service.roomKey).toBeTruthy();
      done();
    });
  });

  it('should be able to encrypt and decrypt using the room key', (done: DoneFn) => {
    service.generateRoomKey().subscribe(_roomKey => {
      service.encryptRoom(testMessage).pipe(flatMap(pair => service.decryptRoom(pair[0], pair[1]))).subscribe(decryptedMessage => {
        expect(testMessage).toEqual(new Uint8Array(decryptedMessage));
        done();
      });
    });
  });
});
