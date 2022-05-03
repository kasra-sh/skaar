import {JsObject} from "@skaar/ui/global";

export interface ComponentUpdater {

    scheduleUpdate(component: any, partialState?: JsObject): void

    updateNow(component: any, partialState?: JsObject): void

}

export const NoopUpdater = {
    scheduleUpdate(component: any, partialState?: JsObject): void {
        // throw Error("NoopUpdater method scheduleUpdate()")
    },

    updateNow(component: any, partialState?: JsObject): void {
        // throw Error("NoopUpdater method updateNow()")
    }

}