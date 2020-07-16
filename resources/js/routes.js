import TodoGroups from './components/Todos/TodoGroupsComponent.vue';
import TodoList   from './components/Todos/TodoListComponent.vue';
export const routes = [
  {
    path: '/',
    component: TodoGroups
  },
  {
    path: '/:groupId',
    name: 'todoList',
    component: TodoList
  }
]
