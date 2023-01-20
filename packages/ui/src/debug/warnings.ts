import { globalScope } from '../globalScope';
import { T_CLASS_COMPONENT, T_FN_COMPONENT, VNode } from '../vnode/VNode';
import { List } from '../vnode/List';

const warnedRecursiveRender = [];

export function warnRecursiveRender(component: { _name: string }) {
   if (!globalScope.SUI_DEBUG) return;
   if (warnedRecursiveRender.indexOf(component._name) >= 0) return;
   console.warn(`[WARN] Too many re-renders! [[${component._name}]]`, Error().stack.slice(5));
   warnedRecursiveRender.push(component._name);
}

export function warnListItemsWithoutKey(list: List) {
   if (!globalScope.SUI_DEBUG) return;
   let parentComponent;
   let node: VNode = list;
   while (node._parent) {
      if (node._parent._type === T_CLASS_COMPONENT || node._parent._type === T_FN_COMPONENT) {
         parentComponent = node._parent;
         break;
      }
      node = node._parent;
   }
   console.warn(`[WARN] List items without key property may affect performance! Component:[[${parentComponent._name}]]`, Error().stack.slice(5));
}
