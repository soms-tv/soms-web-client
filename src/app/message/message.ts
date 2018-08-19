export interface Message<T> {
  static fromBuffer(buffer: any): Message<T>;
  static is(buffer: any): boolean;
  toBuffer(): any;
}
