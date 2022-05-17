import {Component, h} from "@skaar/ui/index";
import {SkaarDOM} from "@skaar/ui/SkaarDOM";
import {_div_, _ul_} from "@skaar/ui/h-tags";

import {AddTodo} from "./components/addTodo";
import {TodoItem} from "./components/todoItem";
import {TodoStorage} from "./storage";

import "./bootstrap-grid.css"

class TodoApp extends Component {
    state = {
        todos: Array<{ id: number, content: string, done?: boolean }>(),
        idSeq: 0
    }

    onCreate() {
        this.setState({
            todos: TodoStorage.items.get()
        })
        this.setState({
            idSeq: TodoStorage.idSeq.get()
        })
    }

    onAddItem = (content) => {
        if (('' + content).replace(/\s+/g, '') === '')
            return
        this.setState({
            todos: this.state.todos.concat({id: this.state.idSeq++, content})
        })
    }

    onUpdate(props) {
        TodoStorage.items.set(this.state.todos)
        TodoStorage.idSeq.set(this.state.idSeq)
    }

    prepareTodos() {
        let todoItems = this.state.todos.map(
            (todoItem, i) => h(TodoItem, {
                key: todoItem.id,
                content: todoItem.content,
                done: todoItem.done,
                onRemove: () => {
                    this.setState({
                        todos: this.state.todos.filter(t => t.id !== todoItem.id)
                    })
                },
                onDone: () => {
                    todoItem.done = !todoItem.done
                    this.setState({})
                }
            })
        )
        return _ul_({},
            todoItems
        )
    }

    render(props, state): any {
        return [
            _div_({style: 'display: block; padding: 10px',}, [
                h(AddTodo, {onAdd: this.onAddItem})
            ]),
            this.prepareTodos()
        ]
    }

}

SkaarDOM.render(
    h(TodoApp, {}),
    document.getElementById('root')
)