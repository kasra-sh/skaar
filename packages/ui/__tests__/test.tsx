import { h } from '../index';

test('should render jsx', () => {
   // @ts-ignore
   expect((<a></a>)._tag).toBe(h('a')._tag);
});
