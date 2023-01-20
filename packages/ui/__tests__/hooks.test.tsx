import { useEffect } from '../src/component/Hooks';
import { _document, SkaarJSDOM } from '../SkaarJSDOM';

const db = {
   count: 0,
   count5: 0,
};

const div = _document.createElement('div');
div.id = 'useEffectRoot';
_document.body.append(div);

const div2 = _document.createElement('div');
div2.id = 'useEffectRoot2';

_document.body.append(div2);
const TestCount1 = () => {
   useEffect(() => {
      db.count++;
   }, []);
   return <></>;
};

const TestCount5 = () => {
   useEffect(() => {
      if (db.count5 < 5) db.count5++;
   }, [db.count5]);
   return <></>;
};

describe('useEffect hook', () => {
   it("component's useEffect must run once with [] deps", (done) => {
      expect(typeof TestCount1).toBe('function');
      SkaarJSDOM.render(TestCount1, div);
      setTimeout(() => {
         expect(db.count).toBe(1);
         SkaarJSDOM.domRenderer.dispose();
         done();
      }, 50);
   });

   it("component's useEffect must run 6 times and count to 5", (done) => {
      expect(typeof TestCount5).toBe('function');
      SkaarJSDOM.render(TestCount5, div2);
      setTimeout(() => {
         expect(db.count5).toBe(5);
         SkaarJSDOM.domRenderer.dispose();
         done(false);
      }, 200);
   });
});
