import {useEffect} from "../src/component/Hooks";
import {_document, SkaarJSDOM} from "../SkaarJSDOM";
import {createNode} from "../src/createNode";

const counters = {
    onceCount: 0,
}


const div = _document.createElement('div')
div.id = 'useEffectRoot'
_document.body.append(div)

describe('useEffect hook', ()=>{

    const TestFNC = () =>{
        useEffect(()=>{
            counters.onceCount++
        }, [])
        return <></>
    }

    it('must run once with [] deps', (done)=>{
        expect(typeof TestFNC).toBe("function")
        SkaarJSDOM.render(createNode(TestFNC), div)
        setTimeout(()=>{
            expect(counters.onceCount).toBe(1)
            SkaarJSDOM.domRenderer.dispose()
            done()
        }, 50)
    })
})