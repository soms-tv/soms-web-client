import { Injectable } from '@angular/core';

import { Observable, Observer, fromPromise } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CryptoServiceService {
  private keyPair: any = null;
  private keyPairObservable: any = null;
  private roomKey: any = null;
  private senderKeys = {};

  constructor() {
    if (!window.crypto.subtle) {
      throw new Error('CryptoService requires the Subtle Crypto API');
    }
    this.keyPairObservable = Observable.create((observer: Observer<any>) => {
      if (this.keyPair !== null) {
        return this.keyPair;
      } else {
        window.crypto.subtle.generateKey(
          {
            name: 'ECDSA',
            namedCurve: 'P-521',
          },
          true,
          ['sign', 'verify']
        ).then(keyPair => {
          this.keyPair = keyPair;
          observer.next(keyPair);
        });
      }
    });
  }

  private decrypt(buffer: any, key: any, iv: any): Observable<any> {
    return fromPromise(window.crypto.subtle.decrypt(
      {
        'name': 'AES-CBC',
        'iv': iv
      },
      key,
      buffer
    ));
  }

  decryptRoom(buffer: any, iv: any): Observable<any> {
    return this.decrypt(buffer, this.roomKey, iv);
  }

  private encrypt(buffer: any, key: any): Observable<any[]> {
    const usedIv = window.crypto.getRandomValues(new Uint8Array(16));
    return fromPromise(window.crypto.subtle.encrypt(
      {
        name: 'AES-CBC',
        iv: usedIv
      },
      key,
      buffer
    ).then(ciphertext => {
      return [ciphertext, usedIv];
    }));
  }

  encryptRoom(buffer: any): Observable<any> {
    return this.encrypt(buffer, this.roomKey);
  }

  exportRoomKey(): Observable<any> {
    return fromPromise(window.crypto.subtle.exportKey(
      'raw',
      this.roomKey
    ));
  }

  importRoomKey(keyBuffer: any): Observable<boolean> {
    return fromPromise(window.crypto.subtle.importKey(
      'raw',
      keyBuffer,
      {
        name: 'AES-CBC'
      },
      false,
      ['encrypt', 'decrypt']
    ).then(roomKey => {
      this.roomKey = roomKey;
      return true;
    }));
  }

  importSenderKey(keyBuffer: any, sender: string): Observable<boolean> {
    return fromPromise(window.crypto.subtle.importKey(
      'raw',
      keyBuffer,
      {
        name: 'ECDSA',
        namedCurve: 'P-521'
      },
      false,
      ['verify']
    ).then(senderKey => {
      if (this.senderKeys[sender]) {
        return false;
      }
      this.senderKeys[sender] = senderKey;
      return true;
    }));
  }

  generateRoomKey(): Observable<any> {
    return fromPromise(window.crypto.subtle.generateKey(
      {
        name: 'AES-CBC',
        length: 256
      },
      true,
      ['encrypt', 'decrypt']
    ));
  }

  getRoomKey(): any {
    return this.roomKey;
  }

  getOwnSigningKey(): Observable<any> {
    return this.keyPairObservable.map(key => key.privateKey);
  }

  getOwnPublicKey(): Observable<any> {
    return this.keyPairObservable.map(key => key.publicKey);
  }

  /**
  * Signs a buffer with own signature
  *
  */
  sign(message: any): Observable<any> {
    return Observable.create((observer: Observer<any>) => {
      getSigningKey().subscribe(key => {
        window.crypto.subtle.sign(
          {
            name: 'ECDSA',
            hash: { name: 'SHA-384' }
          },
          key
        ).then((signature) => {
          observer.next(signature);
        });
      });
    });
  }

  /**
  * Verifies that a buffer's signature was signed by a sender
  *
  */
  verify(message: any, signature: any, sender: string): Observable<boolean> {
    const key = this.senderKeys[sender];
    return fromPromise(window.crypto.subtle.verify(
      {
        name: 'ECDSA',
        hash: { name: 'SHA-384' }
      },
      key,
      signature,
      message
    ));
  }
}
