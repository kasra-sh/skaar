import { HttpRequestContent } from './HttpRequestContent';
import { HttpHeaderCollection } from './HttpHeaderCollection';

export type HttpMethodName = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'head' | 'options';

export class HttpRequestMessage {
   constructor(
      public method: HttpMethodName,
      public url: string,
      public content?: HttpRequestContent,
      public headers?: HttpHeaderCollection
   ) {}
}
