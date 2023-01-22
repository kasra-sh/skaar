import { HttpHeaderCollection } from './HttpHeaderCollection';

export class HttpResponse {
   constructor(
      private statusCode: number,
      private statusMessage,
      private headers: HttpHeaderCollection
   ) {}

   public json() {
      if (this.headers.get('content-type')) {
      }
   }

   public xml() {
      if (this.headers.get('content-type')) {
      }
   }
}
