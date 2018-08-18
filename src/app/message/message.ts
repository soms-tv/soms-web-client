export interface Message<T> {
  encapsulate(message: T): any;
  decapsulate(buffer: any): T;
  filter(): (buffer: any) => boolean;
}
