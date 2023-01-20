import { VElement, VElementProps } from './VElement';

export function createVElement(t: string, props: VElementProps, children?: any[]): VElement {
   if (typeof t === 'string') {
      props = props || {};
      props.children = children || [];
      return new VElement(t, props);
   }
}
