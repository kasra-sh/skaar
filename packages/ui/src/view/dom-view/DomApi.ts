import {IViewApi, IViewNodeFactory} from "../View";

export class DomApi implements IViewApi<Text, HTMLElement> {
    private viewNodeFactory: IViewNodeFactory<Text, HTMLElement>

    constructor(viewNodeFactory: IViewNodeFactory<Text, HTMLElement>) {
        this.viewNodeFactory = viewNodeFactory
    }

    setAttribute(el: HTMLElement, k: string, v: any): void {
        el.setAttribute(k, v)
    }

    createTextNode(txt: string): Text {
        return this.viewNodeFactory.createTextNode(txt)
    }

    createElement(tag: string): HTMLElement {
        return this.viewNodeFactory.createElement(tag)
    }

    setValue(el: HTMLInputElement, v: any): void {
        el.value = v
    }

    removeAttribute(el: HTMLElement, k: any): void {
        el.removeAttribute(k)
    }

    setText(el: Text, text: any): void {
        el.textContent = text
    }

    insertBefore(childDom: Text | HTMLElement, newChildDom: Text | HTMLElement): void {
        childDom.parentElement.insertBefore(newChildDom, childDom)
    }

    replaceWith(oldDomNode: Text | HTMLElement, newDom: Text | HTMLElement | Text[] | HTMLElement[]): void {
        if (Array.isArray(newDom)) {
            oldDomNode.replaceWith(...newDom)
        } else {
            oldDomNode.replaceWith(newDom)
        }
    }

    append(parent: HTMLElement, children: Text | HTMLElement | Text[] | HTMLElement[]): void {
        if (!children) return
        if (Array.isArray(children)) {
            children.length > 0 && parent.append(...children)
        } else {
            parent.append(children)
        }
    }

    removeEventListener(el: Text | HTMLElement, ev: string, fn: VoidFunction): void {
        el.removeEventListener(ev, fn)
    }

    addEventListener(el: HTMLElement, ev: string, fn: VoidFunction): void {
        el.addEventListener(ev, fn)
    }

    remove(el: Text | HTMLElement): void {
        el.remove()
    }

    clearChildren(el: HTMLElement): void {
        el.innerHTML = ""
    }

    getAttributeNames(rootDom: HTMLElement): string[] {
        return rootDom.getAttributeNames()
    }

    getAttribute(rootDom: HTMLElement, attrName: string): string {
        return rootDom.getAttribute(attrName)
    }
}