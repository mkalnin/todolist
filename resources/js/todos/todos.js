import axios from 'axios';

const state = {
  todos        : {},
  filteredTodos: [],
  newTodo : '',
  itemsLeft: '',
  itemsComplete: '',
  toggleByCompleteVal: null
};

const getters = {
  TODOS : state => state.todos,
  FILTERED_TODOS : state => state.filteredTodos,
  NEW_TODO : state => state.newTodo,
  ITEMS_LEFT : function (state) {
    if(state.todos.todos) {
      var left = state.todos.todos.map(a => (a.complete == 0 || a.complete == false)).filter(x => x == true);
      return Object.keys(left).length;
    }
  },
  ITEMS_COMPLETE : function (state) {
    if(state.todos.todos) {
      var left = state.todos.todos.map(a => (a.complete == 1 || a.complete == true)).filter(x => x == true);
      return Object.keys(left).length;
    }
  },
  TOGGLE_BY_COMPLETE_VAL : state => state.toggleByCompleteVal
};

const mutations = {
  SET_TODOS : (state, payload) => {
    state.todos = payload;
  },
  SET_NEW_TODO : (state, payload) => {
    state.newTodo = payload;
  },
  PUSH_TODO : (state, todo) => {
    state.todos.todos.push(todo);
  },
  SET_TODO_ITEMS : (state, [todoItems, value, index]) => {

    if(index !== null) {
      state.todos.todos[index].complete = todoItems[0].complete;
    } else {
      state.todos.todos = todoItems;
    }
  },
  FILTER_TODOS : (state, complete) => {
    state.toggleByCompleteVal = complete;
    if(state.toggleByCompleteVal == 0) {
      var filtered = state.todos.todos.filter(x => (x.complete == 0 || x.complete == false));
    } else if (state.toggleByCompleteVal == 1) {
      var filtered = state.todos.todos.filter(x => (x.complete == 1 || x.complete == true));
    } else {
      var filtered = state.todos.todos;
    }
    state.filteredTodos = filtered
  },
};

const actions = {
  GET_TODOS: async (context, groupId) => {
    let {data} = await axios.get('/api/todo', {
      params: {
        groupId: groupId
      }
    });
    if(!data.errors) {
      await context.commit('SET_TODOS', data);
      context.commit('FILTER_TODOS', null);
    }
  },
  CREATE_TODO: async (context, [todo, groupId]) => {
    let {data} = await axios.post('/api/todo/create', {
        todo   : todo,
        groupId: groupId
    });
    if(!data.errors) {
      context.commit('PUSH_TODO', data);
    }
  },
  UPDATE_TODO: async (context, [id, todo]) => {
    let {data} = await axios.post('/api/todo/update', {
        todoId   : id,
        todo     : todo
    });
  },
  DELETE_TODO: async (context, [ids, index]) => {
    let {data} = await axios.delete('/api/todo', {
      params: {
        todoIds: ids
      }
    });
    if(!data.errors) {
      var todoItems = state.filteredTodos;
      for (var i = 0; i < ids.length; i++) {
        var todoItems = todoItems.filter(x => x.id !== ids[i]);
      }
      console.log(todoItems);
      context.commit('SET_TODO_ITEMS', [todoItems, null, null]);
      context.commit('FILTER_TODOS', context.state.toggleByCompleteVal);
    }
  },
  TOGGLE_COMPLETE: async (context, [ids, value, index]) => {
    let {data} = await axios.post('/api/todo/toggle-complete', {
        todoIds: ids,
        value  : value
    });
    if(!data.errors) {
      context.commit('SET_TODO_ITEMS', [data, value, index]);
      context.commit('FILTER_TODOS', context.state.toggleByCompleteVal);
    }
  },
  FILTER_BY_COMPLETE: async (context, complete) => {
    if(typeof complete === undefined) {var complete = null}
    context.commit('FILTER_TODOS', complete);
  }
};

export default {
  state,
  getters,
  mutations,
  actions
}
