export interface IViewNodeFactory<TextNodeType, ElementNodeType> {
   createTextNode(text: string): TextNodeType;

   createElement(tag: string): ElementNodeType;
}
