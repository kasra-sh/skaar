type Selector = (state: Record<any, any>) => any;

type StoreSubscription = {
   callback: (state: Record<any, any>) => void;
   selector: Selector;
};

type Reducer<T> = (state: T, payload: any) => void;

type StateChangedCallback<T> = (state: T) => void;

export class Store<T> {
   state: T;
   subscriptions = Array<StoreSubscription>();
   reducers: Record<any, Reducer<T>> = {
      ['']: () => {},
   };

   constructor(initialState: T) {
      this.state = initialState || ({} as any);
   }

   _triggerCallbacks(stateClone: T) {
      for (const sub of this.subscriptions) {
         sub.callback(stateClone);
      }
   }

   subscribe(callback: StateChangedCallback<T>, selector?: Selector) {
      this.subscriptions.push({ callback, selector });
      const clone = Object.assign({}, this.state);
      setTimeout(() => {
         callback(clone);
      });
      return () => {
         this.unsubscribe(callback);
      };
   }

   unsubscribe(callback: StateChangedCallback<T>) {
      this.subscriptions = this.subscriptions.filter((sub) => sub.callback !== callback);
   }

   dispatch({ action, payload = undefined }) {
      const clone = Object.assign({}, this.state);
      this.reducers[action](clone, payload);
      Object.assign(this.state, clone);

      setTimeout(() => {
         this._triggerCallbacks(clone);
      });
   }
}
