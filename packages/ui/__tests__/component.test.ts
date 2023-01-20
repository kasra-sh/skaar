import { Component } from '../src/component/Component';

class SomeName extends Component {
   render(props: any): any {}
}
describe('component properties', () => {
   test(`class component's "_name" property should match class's name`, () => {
      expect(new SomeName()._name).toBe('SomeName');
   });

   test(`instances of class component should have the same "_proto" property`, () => {
      expect(new SomeName()._proto).toBe(new SomeName()._proto);
   });
});
