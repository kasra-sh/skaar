import {FncContext} from "./FnComponent";

export type UseStateTuple<T> = [
    t: T,
    setT: (newVal?: T) => void
]

export function useState<T>(initialValue?: T): UseStateTuple<T> {
    const currentContext = FncContext.current
    const currentComponent = FncContext.current.component
    if (!currentContext.hookNode) {
        if (!currentComponent.hookNode) {
            currentComponent.hookNode = {
                data: initialValue
            }
        }
        currentContext.hookNode = currentComponent.hookNode
    } else {
        if (!currentContext.hookNode.next) {
            currentContext.hookNode.next = {
                data: initialValue
            }
        }
        currentContext.hookNode = currentContext.hookNode.next
    }

    const curHookNode = currentContext.hookNode;

    return [
        curHookNode.data,
        (val) => {
            curHookNode.data = val
            if (currentComponent.__internal.rendering)
                currentComponent.__internal.dirty = true
            else {
                currentComponent.__updater.scheduleUpdate(currentComponent)
            }
        }
    ]
}

export type EffectFn = () => (Function | void)

export function useEffect(effect: EffectFn, deps?: Array<any>) {
    const currentComponent = FncContext.current.component
    const [state, setState] = useState({cleanup: undefined, deps: undefined})
    if (state.cleanup) {
        state.cleanup()
    }
    let shouldRun = true
    if (state.deps) {
        if (deps.length !== state.deps.length) {
            shouldRun = false
        } else {
            shouldRun = false
            for (let i = 0; i < deps.length; i++) {
                if (deps[i] !== state.deps[i]) {
                    shouldRun = true
                    break
                }
            }
        }
    }
    let cleanup: any
    if (shouldRun) {
        cleanup = effect()
        currentComponent._cleaners = currentComponent._cleaners.filter(cl => cl !== state.cleanup)
        if (typeof cleanup === "function")
            currentComponent._cleaners.push(cleanup)
    }
    setState({deps, cleanup})
}