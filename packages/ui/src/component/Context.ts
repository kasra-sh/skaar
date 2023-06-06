import { createObjComponent } from './createComponent';

export function reflect_getParentContextProviderState(ctxRef: any) {
   let value = undefined;
   let parent = this._parent;
   while (parent) {
      const parentCtxRef = parent.__contextRef;
      if (parentCtxRef && parentCtxRef === ctxRef) {
         value = parent.state.value;
         break;
      }
      parent = parent._parent;
   }
   return value;
}

export function createContext(defaultValue: any) {
   const currentContextReference = {};
   // const providers = [];
   const Provider = createObjComponent({
      _name: 'ContextProvider',
      state: {
         value: defaultValue,
      },
      onCreate() {
         // providers.push(this);
      },
      onUpdate(props) {
         if (this.state.value !== props) {
            this.setState({
               value: props,
            });
         }
      },
      __contextRef: currentContextReference,
      render(props) {
         return props.children;
      },
   });
   const Consumer = createObjComponent({
      _name: 'ContextConsumer',

      onDestroy() {},

      render({ children }) {
         const value = reflect_getParentContextProviderState(currentContextReference);
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
   return {
      Provider,
      Consumer,
   };
}
