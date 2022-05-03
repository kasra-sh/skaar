const PREFIX = 'todoapp_'

export const TodoStorage = {
    items: {
        get() {
            return JSON.parse(localStorage.getItem(PREFIX + 'items') || '[]')
        },
        set(val) {
            localStorage.setItem(PREFIX + 'items', JSON.stringify(val))
        }
    },
    idSeq: {
        get() {
            return parseInt(localStorage.getItem(PREFIX + 'idSeq')) || 0
        },
        set(val) {
            localStorage.setItem('todoapp_idSeq', val.toString())
        }
    }
}