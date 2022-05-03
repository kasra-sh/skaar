import {DomRenderer} from "../src/view/dom-view/DomRenderer";
import {createNode} from "../src/createNode";
import {DomApi} from "../src/view/dom-view/DomApi";

const {JSDOM} = require("jsdom");
const window = new JSDOM().window;

const nodeDomRenderer = new DomRenderer(new DomApi(window.document));

beforeEach(() => {
    window.document.documentElement.innerHTML = `<div id="root"></div>`;
});

afterEach(() => {
    window.document.documentElement.innerHTML = "";
});


test('set input element value', () => {
    const vnode = createNode('input', {
            attrs: {id: 'test_id', value: 'test value'},
            events: {click: () => console.log('clicked')}
        }
    );
    nodeDomRenderer.render(vnode, window.document.getElementById('root'));

    const element = window.document.getElementById('test_id');
    expect(element).toBe(vnode._viewNode);
    expect(element).toHaveProperty('value', 'test value');
});

