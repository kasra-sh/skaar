import {DomRenderer} from "@skaar/ui/src/view-dom/DomRenderer";
import {DomApi} from "@skaar/ui/src/view-dom/DomApi";
import {JSDOM} from "jsdom"

const mockTemplate = `<html lang="en"><head><title>Skaar UI JSDOM</title></head><body></body></html>`

export const _window = new JSDOM(mockTemplate).window
export const _document = new JSDOM(mockTemplate).window.document

const domRenderer = new DomRenderer(new DomApi(_window.document))

export const SkaarJSDOM = {
    domRenderer: domRenderer,
    render: domRenderer.render.bind(domRenderer) as DomRenderer["render"]
}