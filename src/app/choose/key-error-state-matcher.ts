import { ErrorStateMatcher } from '@angular/material';

export class KeyErrorStateMatcher implements ErrorStateMatcher {
  constructor(private componentScope: any, private scopeKey: string) { }

  isErrorState(): boolean {
    return this.componentScope[this.scopeKey];
  }
}
