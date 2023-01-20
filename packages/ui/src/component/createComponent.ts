import { Component, ComponentClass, ComponentProps } from './Component';
import { JsObject } from '../../global';
import { VNode } from '../vnode/VNode';
import { FnComponent } from './FnComponent';

export function createComponent(component: ComponentClass, props: JsObject, children?: (VNode | string | unknown)[]): Component {
   const instance = new component();
   props = props || {};
   if (children) {
      props.children = children;
   }
   instance._setProps(props);
   return instance;
}

class ObjectComponent extends Component {
   state = {};

   constructor(def: Partial<Component> & JsObject) {
      super();
      Object.assign(this, def);
   }

   render(props: ComponentProps, state: JsObject): any {}
}

export function createObjComponent(def: Partial<Component> & JsObject): Component {
   return new ObjectComponent(def);
}

export function cloneComponent(instance: Component, props: JsObject, children?: (VNode | string | unknown)[]): Component {
   instance = Object.assign(new instance._proto(), instance);
   instance._parent = undefined;
   instance.state = Object.assign({}, instance.state);
   props = props || {};
   if (children) {
      props.children = children;
   }
   instance._setProps(props);
   return instance;
}

export function createFnComponent(renderFunction: Function, props: JsObject, children?: (VNode | string | unknown)[]): FnComponent {
   const instance = new FnComponent(renderFunction);
   props = props || {};
   if (children) {
      props.children = children;
   }
   instance.props = props;
   // instance._setProps(props)
   return instance;
}

export function cloneFnComponent(fn: Function, props, children) {
   if (!fn['_createInstance']) {
      const proto = (fn['_proto'] = new FnComponent(fn));
      fn['_createInstance'] = function () {
         const instance = Object.assign({}, proto);
         Object.setPrototypeOf(instance, Object.getPrototypeOf(proto));
         instance.props = { ...props, children };
         instance.hookNode = undefined;
         return instance;
      };
   }
   return fn['_createInstance']();
}
