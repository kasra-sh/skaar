export const MediaType = Object.freeze({
   TEXT: Object.freeze({
      CSS: 'text/css',
      CSV: 'text/csv',
      HTML: 'text/html',
      PLAIN: 'text/plain',
      XML: 'text/xml',
   }),
   APPLICATION: Object.freeze({
      JSON: 'application/json',
      XML: 'application/xml',
      XHTML_XML: 'application/xhtml+xml',
      OCTET_STREAM: 'application/octet-stream',
      FORM_URLENCODED: 'application/x-www-form-urlencoded',
   }),
   MULTIPART: Object.freeze({
      FORM_DATA: 'multipart/form-data',
      MIXED: 'multipart/mixed',
      ALTERNATIVE: 'multipart/alternative',
   }),
});

export class HttpRequestContent {
   public data: any;
   /**
    * Content-Type header value
    */
   public type: string = MediaType.TEXT.PLAIN;

   constructor(type: string, data: any) {
      this.data = data;
      this.type = type;
   }

   public static jsonContentRaw(data: string) {
      return new HttpRequestContent(MediaType.APPLICATION.JSON, data);
   }

   public static jsonContent(data: any) {
      return HttpRequestContent.jsonContentRaw(JSON.stringify(data));
   }

   public static xmlContentRaw(data: string) {
      return new HttpRequestContent(MediaType.APPLICATION.XML, data);
   }

   public static xmlContent(data: Document) {
      return this.xmlContentRaw(new XMLSerializer().serializeToString(data));
   }
}
