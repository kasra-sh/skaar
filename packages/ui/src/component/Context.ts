import { createObjComponent } from './createComponent';
import { Component } from '@skaar/ui/src/component/Component';

export function reflect_getParentContextProvider(component: any, ctxRef: any) {
   let value = undefined;
   let parent = component._parent;
   while (parent) {
      const parentCtxRef = parent.__contextRef;
      if (parentCtxRef && parentCtxRef === ctxRef) {
         value = parent;
         break;
      }
      parent = parent._parent;
   }
   return value;
}

export function reflect_getParentContextProviderState(component: any, ctxRef: any) {
   return reflect_getParentContextProvider(component, ctxRef).state.value;
}

export type ContextObject<T> = { Provider: Component; Consumer: Component };

export function createContext<T>(defaultValue: T) {
   const context: ContextObject<T> = {
      Provider: undefined,
      Consumer: undefined,
   };

   context.Provider = createObjComponent({
      _name: 'ContextProvider-' + new Date().getMilliseconds() + ((Math.random() * 1000) % 1000),
      state: {
         value: defaultValue,
      },
      onUpdate(props) {
         if (this.state.value !== props) {
            this.setState({
               value: props,
            });
         }
      },
      __contextRef: context,
      render(props) {
         return props.children;
      },
   });

   context.Consumer = createObjComponent({
      _name: 'ContextConsumer',
      render({ children }) {
         const value = reflect_getParentContextProviderState(this, context);
         children = children || [];
         const ch = [];
         for (let child of children) {
            if (typeof child === 'function' && child.toString().indexOf('class ') !== 0) {
               ch.push(child(value));
            }
         }
         return ch;
      },
   });

   return context;
}
