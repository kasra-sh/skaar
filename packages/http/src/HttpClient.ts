import { HttpMethodName } from './HttpRequestMessage';
import { HttpHeader } from './HttpHeaderCollection';
import { HttpRequestContent } from './HttpRequestContent';

export type HttpRequestProps = {
   url?: string;
   method?: HttpMethodName;
   content?: Partial<HttpRequestContent>;
   headers?: Array<HttpHeader>;
   withCredentials?: boolean;
   onUploadProgress?: (upload: ProgressEvent) => void;
};

export class HttpClient {
   public send(request: HttpRequestProps): Promise<any> {
      const xhr = new XMLHttpRequest();
      xhr.open(request.method, request.url);

      request.headers?.forEach((header) => {
         xhr.setRequestHeader(header.key, header.value);
      });

      let body;
      if (request.content) {
         xhr.setRequestHeader('Content-Type', request.content.type);
         body = request.content.data;
      }

      xhr.withCredentials = request.withCredentials;

      if (request.onUploadProgress) {
         xhr.upload.onprogress = request.onUploadProgress;
      }

      const promise = new Promise<any>((resolve, reject) => {
         xhr.onreadystatechange = function () {
            if (this.readyState === xhr.DONE) {
               resolve(xhr);
            }
         };
         xhr.onabort = xhr.onerror = function () {
            reject(xhr);
         };
      });

      xhr.send(body);

      return Object.assign(promise, {});
   }

   public get(url: string, props?: HttpRequestProps): Promise<any> {
      return this.send({ ...props, method: 'get', url });
   }

   public post(url: string, content?: HttpRequestContent, props?: HttpRequestProps): Promise<any> {
      return this.send({ ...props, method: 'post', url, content });
   }

   public put(url: string, content?: HttpRequestContent, props?: HttpRequestProps): Promise<any> {
      return this.send({ ...props, method: 'put', url, content });
   }

   public delete(url: string, props?: HttpRequestProps): Promise<any> {
      return this.send({ ...props, method: 'delete', url });
   }
}
