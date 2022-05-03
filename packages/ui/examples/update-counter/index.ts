import {Component, createNode, SkaarDOM} from "../../index";
import {JsObject} from "../../global";
import {ComponentProps} from "../../src/vnode/Component";

class UpdateCounter extends Component {
    state = {
        count: 0,
        size: 10000
    }

    onCreate() {
        this.setState()
    }

    onUpdate(props: ComponentProps) {
        this.setState({count: this.state.count + 1 / this.state.size})
    }

    render(props: ComponentProps, state: JsObject): any {
        let counters = []
        for (let i = 0; i < 10; i++) {
            counters.push(
                createNode('b', {}, [`Counter ${i + 1}`]),
                createNode('br'),
                createNode('span', {}, [`Count: ${state.count | 0} x ${this.state.size} updates`]),
                createNode('br')
            )
        }
        return counters
    }
}

SkaarDOM.render(createNode(UpdateCounter, {}), document.getElementById('root'))