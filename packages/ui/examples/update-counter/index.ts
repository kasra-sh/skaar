import {Component, createNode} from "@skaar/ui/index";
import {SkaarDOM} from "@skaar/ui/SkaarDOM";
import {JsObject} from "@skaar/ui/global";

class UpdateCounter extends Component {
    state = {
        count: 0,
        size: 10000
    }

    onCreate() {
        this.setState()
    }

    onUpdate(props) {
        this.setState({count: this.state.count + 1 / this.state.size})
    }

    render(props, state: JsObject): any {
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