import {Component, ComponentProps} from "@skaar/ui/src/component/Component";
import {JsObject} from "@skaar/ui/global";
import {_a_, _input_} from "@skaar/ui/h-tags";

export class AddTodo extends Component {
    props = {
        onAdd: (content) => {
        }
    }
    state = {
        content: ''
    }
    onInput = (_, element) => {
        this.setState({
            content: element.value
        })
    }
    onAddClicked = () => {
        this.props.onAdd(this.state.content)
        this.setState({
            content: ''
        })
    }

    render(props: ComponentProps, state: JsObject): any {
        return [
            _input_({
                type: 'text',
                value: state.content,
                onInput: this.onInput,
                onKeyPress: (event: KeyboardEvent) => {
                    (event.key === 'Enter') && this.onAddClicked()
                }
            }),
            _a_({href: '#', onClick: this.onAddClicked}, [
                'Add'
            ])
        ]
    }

}