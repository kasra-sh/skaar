import {createNode, SkaarDOM} from "@skaar/ui/index";
import {useEffect, useState} from "@skaar/ui/src/vnode/Hooks";

const UpdateCounter = () => {
    const [count, setCount] = useState(0);
    const [val, setVal] = useState();

    useEffect(() => {
        console.log('only once')
    }, [])

    useEffect(() => {
        setCount(count + 0.0001)
    })

    useEffect(() => {
        console.log('val changed effect', val)
    }, [val])

    let counters = []
    for (let i = 0; i < 10; i++) {
        counters.push(
            createNode('input', {
                attrs: {type: 'text'}, events: {
                    input: (event, element) => {
                        setVal(element.value)
                    }
                }
            }),
            createNode('b', {}, [`Counter ${i + 1}`]),
            createNode('br'),
            createNode('span', {}, [`Count: ${count | 0} x ${10000} updates`]),
            createNode('br')
        )
    }
    return counters
}

window["SUI_DEBUG"] = true

SkaarDOM.render(createNode(UpdateCounter, {}), document.getElementById('root'))