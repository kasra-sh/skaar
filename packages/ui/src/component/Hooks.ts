import {FncContext, FnComponent} from "./FnComponent";

export type UseStateTuple<T> = [
    t: T,
    setT: (newVal?: T) => void
]

function getOrInitHookNode(defaultValue: any) {
    const currentContext = FncContext.current
    const currentComponent = FncContext.current.component

    if (!currentContext.hookNode) {
        // if current node is empty, return or create first node
        if (!currentComponent.hookNode) {
            currentComponent.hookNode = {
                data: defaultValue
            }
        }
        currentContext.hookNode = currentComponent.hookNode
    } else {
        // if current node is not empty, return or create next node
        if (!currentContext.hookNode.next) {
            currentContext.hookNode.next = {
                data: defaultValue
            }
        }
        currentContext.hookNode = currentContext.hookNode.next
    }

    return currentContext.hookNode
}

export function useState<T>(initialValue?: T): UseStateTuple<T> {
    // const currentContext = FncContext.current
    const currentComponent = FncContext.current.component

    // get or initialize current hook node from current component
    const currentHookNode = getOrInitHookNode(initialValue)

    return [
        currentHookNode.data,
        (val) => {
            currentHookNode.data = val
            if (currentComponent.__internal.rendering)
                // defer immediate updates until render function has returned (batching)
                currentComponent.__internal.dirty = true
            else {
                currentComponent.__updater.scheduleUpdate(currentComponent)
            }
        }
    ]
}

export type EffectFn = () => (Function | void)

type UseEffectState = {
    cleanup?: Function,
    deps?: Array<any>
}

function depsEqual(newDeps: Array<any>, oldDeps?: Array<any>): boolean {
    let changed = true
    if (oldDeps) {
        if (newDeps.length === oldDeps.length) {
            changed = false
            for (let i = 0; i < newDeps.length; i++) {
                if (!Object.is(newDeps[i],oldDeps[i])) {
                    changed = true
                    break
                }
            }
        }
    }
    return !changed;
}

export function useEffect(effect: EffectFn, deps?: Array<any>) {
    const currentComponent = FncContext.current.component
    const [state, setState] = useState<UseEffectState>({cleanup: undefined, deps: undefined})
    if (state.cleanup) {
        state.cleanup()
    }
    let shouldRun = !depsEqual(deps, state.deps);
    let cleanup: any
    if (shouldRun) {
        cleanup = effect()
        currentComponent._cleaners = currentComponent._cleaners.filter(cl => cl !== state.cleanup)
        if (typeof cleanup === "function")
            currentComponent._cleaners.push(cleanup)
    }
    setState({deps, cleanup})
}

type UseMemoState<T> = {memoizedValue?: T, deps?: Array<any>}

/**
 * Generates new value using the supplied factory, when at least one of the supplied dependencies has changed
 */
export function useMemo<T>(factory: ()=>T, deps?: Array<any>): T {
    const [state, setState] = useState<UseMemoState<T>>({memoizedValue: undefined, deps: undefined})

    let shouldRun = !depsEqual(deps, state.deps);

    let value = state.memoizedValue
    if (shouldRun) {
        value = factory()
    }

    setState({deps, memoizedValue: value})

    return value
}

/**
 * Keeps reference equality of the given callback
 */
export function useCallback<T>(factory: ()=>()=>T, deps?: Array<any>): ()=>T {
    return useMemo<()=>T>(()=>factory(), deps)
}

/**
 * returns current FnComponent instance (aka Fiber)
 */
export function useUnsafeThis(): FnComponent {
    return FncContext.current.component
}

