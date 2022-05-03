import {Fragment} from "./Fragment";
import {List} from "./List";

export const transformNodeArray = (arr: any[]): Fragment => {
    return new List(arr)
}