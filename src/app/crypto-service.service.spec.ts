import { TestBed, inject } from '@angular/core/testing';

import { CryptoServiceService } from './crypto-service.service';

describe('CryptoServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CryptoServiceService]
    });
  });

  it('should be created', inject([CryptoServiceService], (service: CryptoServiceService) => {
    expect(service).toBeTruthy();
  }));
});
