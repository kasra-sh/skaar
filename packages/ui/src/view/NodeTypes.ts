export type IViewNode = any;

export interface IViewElement extends IViewNode {}

export interface IViewText extends IViewNode {
   textContent: string;
}
