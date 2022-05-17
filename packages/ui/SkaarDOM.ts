import {DomRenderer} from "@skaar/ui/src/view-dom/DomRenderer";
import {DomApi} from "@skaar/ui/src/view-dom/DomApi";

const domRenderer = new DomRenderer(new DomApi(document))

export const SkaarDOM = {
    domRenderer: domRenderer,
    render: domRenderer.render.bind(domRenderer) as DomRenderer["render"]
}