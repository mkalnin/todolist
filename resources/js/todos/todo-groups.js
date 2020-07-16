import axios from 'axios';

const state = {
  todoGroups         : {},
  filteredTodoGroups : {},
  dateOrder          : 'ASC',
  search             : ''
};

const getters = {
  TODO_GROUPS          : state => state.todoGroups,
  FILTERED_TODO_GROUPS : state => state.filteredTodoGroups,
  DATE_ORDER           : state => state.dateOrder,
  SEARCH               : state => state.search
};

const mutations = {
  SET_TODO_GROUPS : (state, payload) => {
    state.todoGroups = payload;
    state.filteredTodoGroups = payload;
  },
  CHANGE_TODO_GROUPS_ORDER : (state, order) => {
    state.filteredTodoGroups.sort(function(a, b){
      return order === 'ASC' ? a.id - b.id : b.id - a.id;
    });
  },
  FILTER_TODO_GROUPS : (state) => {
    var results =  state.todoGroups.filter(o => o.name.includes(state.search));
    state.filteredTodoGroups = results;
  },
  SET_DATE_ORDER : (state, payload) => {
    state.dateOrder = payload;
  },
  PUSH_TODO_GROUP : (state, group) => {
    state.todoGroups.push(group);
  },
  SET_TODO_SEARCH : (state, search) => {
    state.search = search;
  },
};

const actions = {
  GET_TODO_GROUPS: async (context, pyload) => {
    var {data} = await axios.get('/api/todo-group');
    if(!data.errors) {
      context.commit('SET_TODO_GROUPS', data);
    }
  },
  TOGGLE_DATE_ORDER: async (context) => {
    var order = state.dateOrder === 'ASC' ? 'DESC' : 'ASC';
    context.commit('SET_DATE_ORDER', order);
    context.commit('CHANGE_TODO_GROUPS_ORDER', order);
  },
  SEARCH_TODO_GROUP: async (context, search) => {
    context.commit('FILTER_TODO_GROUPS', search);
  },
  CREATE_TODO_GROUP: async (context, name) => {
    var {data} = await axios.post('/api/todo-group/create', {
      name : name
    });
    if(!data.errors) {
      context.commit('PUSH_TODO_GROUP', data);
      context.commit('FILTER_TODO_GROUPS');
    }
  },
  CHANGE_SEARCH: async (context, search) => {
    context.commit('SET_TODO_SEARCH', search);
    context.commit('FILTER_TODO_GROUPS', search);
  },
};

export default {
  state,
  getters,
  mutations,
  actions
}
