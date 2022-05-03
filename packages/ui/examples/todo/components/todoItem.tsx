import {Component, ComponentProps} from "@skaar/ui/src/vnode/Component";

export class TodoItem extends Component {
    props = {
        onRemove: () => null,
        onDone: () => null
    }

    render(props: ComponentProps, state: any): any {
        return [
            <li key={props.key}
                style={`cursor: pointer; padding: 5px; display: block; color: ${props.done ? 'gray' : 'black'}`}>
                {props.key} -
                <a href={'javascript:void 0;'} onClick={() => props.onRemove()}>
                    [X]
                </a>
                 : {
                props.done ?
                    <s onClick={() => props.onDone()}>{props.content}</s>
                    :
                    <span onClick={() => props.onDone()}>{props.content}</span>
            }
            </li>
        ]
    }
}