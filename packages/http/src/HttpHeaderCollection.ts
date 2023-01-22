import { warnDuplicateHeader } from './internal/warnings';

export type HttpHeaderValue = string | undefined | null;

export type HttpHeader = { key: string; value: HttpHeaderValue };

export class HttpHeaderCollection {
   private readonly _headers = Array<HttpHeader>();

   constructor(headers?: Array<HttpHeader>) {
      if (!!headers) {
         for (const header of headers) {
            this.set(header.key.toLowerCase(), header.value);
         }
      }
   }

   public keys(): Array<string> {
      return this._headers.map((h) => h.key);
   }

   public values(): Array<string> {
      return this._headers.map((v) => v.value);
   }

   public list(): Array<HttpHeader> {
      return [...this._headers];
   }

   public get(key: string): HttpHeaderValue {
      key = key.toLowerCase();
      return this._headers.find((h) => h.key === key)?.value;
   }

   public getContentType() {
      return this.get('content-type');
   }

   /**
    * get array of set-cookie header values
    */
   public getCookies() {
      return this._headers.filter((h) => h.key === 'set-cookie').map((h) => h.value);
   }

   public set(key: string, value: HttpHeaderValue): void {
      key = key.toLowerCase();
      let header = this._headers.find((h) => h.key === key);
      if (!!header) {
         // override value of existing header
         warnDuplicateHeader(key);
         header.value = value;
         return;
      }

      this._headers.push({ key, value });
   }
}
