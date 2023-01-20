import { VNodeContainer } from './VNodeContainer';
import { T_LIST, VNode } from './VNode';
import { normalizeChildNodes } from './normalizeChildNodes';
import { transformNodeArray } from './transformNodeArray';

export class List extends VNodeContainer {
   props?: undefined;
   _type = T_LIST;
   declare _childNodes: VNode[];
   override _viewNode: never;

   everyChildHasKeyProp() {
      return this._childNodes.every((ch) => ch.props && ch.props.key !== undefined);
   }

   constructor(nodes?: VNode[]) {
      super();
      this._childNodes = normalizeChildNodes(nodes, transformNodeArray, this);
   }
}
