import { Component } from './Component';

function shallowEqualObjects(obj1, obj2) {
   if (obj1 === obj2) return true;
   const keys1 = Object.keys(obj1);
   const keys2 = Object.keys(obj2);
   if (keys1.length !== keys2.length) return false;
   for (let i = 0; i < keys1.length; i++) {
      const key1 = keys1[i];
      const val2 = obj2[key1];
      if (keys2.indexOf(keys1[i]) < 0 || val2 !== obj1[key1]) return false;
   }
   return true;
}

export abstract class PureComponent extends Component {
   override _shouldUpdate(props?, newProps?, state?, newState?) {
      return !shallowEqualObjects(props, newProps) || !shallowEqualObjects(state, newState);
   }
}
