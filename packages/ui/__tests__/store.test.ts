import {Store} from "../src/component/Store";

const Actions = {
    ChangeValue: 'CHANGE_VALUE'
}

let store = undefined

beforeEach(()=>{
    store = new Store({value1: 'first value'})
    store.reducers[Actions.ChangeValue] = function (state, payload) {
        state.value1 = payload
    }
})

test('store slice must be defined', ()=>{
    expect(typeof Store).toBe("function")
    expect(typeof new Store<any>({})).toBe("object")
})

test('subscribe to store and dispatch action', (done)=>{
    let first = true

    store.subscribe((state)=>{
        // callback is first called on subscribe with current value
        if (first) {
            first = false
            expect(state.value1).toBe('first value')
            return
        }
        // then called after dispatch with new value
        expect(state.value1).toBe('new value')
        done()
    })

    store.dispatch({action: Actions.ChangeValue, payload: `new value`})

})

test('callback must not be called after unsubscribing', (done)=>{
    let called = 0
    let unsubscribe = store.subscribe((state)=>{
        called++
    })

    unsubscribe()

    store.dispatch({action: Actions.ChangeValue})
    store.dispatch({action: Actions.ChangeValue})
    store.dispatch({action: Actions.ChangeValue})

    setTimeout(()=>{
        expect(called).toBe(1)
        done()
    })
})