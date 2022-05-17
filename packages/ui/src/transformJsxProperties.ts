export function transformJsxProperties(props: any) {
    const attrs: any = {}
    const events: any = {}
    for (let pk in props) {
        if (pk === 'children') continue
        if (/on[A-Z][A-Za-z]+/g.test(pk)) {
            events[pk.slice(2).toLowerCase()] = props[pk]
        } else {
            attrs[pk] = props[pk]
        }
    }
    return {attrs, events}
}