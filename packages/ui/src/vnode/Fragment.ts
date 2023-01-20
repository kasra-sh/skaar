import { VNodeContainer } from './VNodeContainer';
import { T_FRAGMENT, VNode } from './VNode';
import { normalizeChildNodes } from './normalizeChildNodes';
import { transformNodeArray } from './transformNodeArray';

export class Fragment extends VNodeContainer {
   props?: any;
   _type = T_FRAGMENT;
   declare _childNodes: VNode[];
   override _viewNode: never;

   constructor(nodes?: (VNode | string | unknown)[]) {
      super();
      this._childNodes = normalizeChildNodes(nodes, transformNodeArray, this);
   }
}
