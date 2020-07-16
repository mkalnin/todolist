<template>
  <div>
    <div v-if="TODOS">
      <h1 class="text-center">{{TODOS.name}}</h1>
      <ul class="list-group list-group-flush">
        <li class="list-group-item">
          <div class="form-check">
            <input type="checkbox"
                    @click="toggleMarkAsComplete()"
                    :checked="markAsComplete === 1 || markAsComplete === true"
                    class="form-check-input">
            <label class="form-check-label">
              Mark As Complete
            </label>
          </div>
            <input class="form-control"
                    v-model="NEW_TODO"
                    placeholder="What needs to be done?"
                    maxlength="128"
                    v-on:keyup.enter="create()"
                    />
        </li>
        <li v-for="(todo, index) in FILTERED_TODOS"
            class="list-group-item">
            <div class="form-check p-2">
              <input class="form-check-input"
                      type="radio"
                      @click="toggleComplete(todo.id, index)"
                      :checked="todo.complete != false || todo.complete != 0"
                />
            </div>
            <div class="d-inline-block" v-if="edit[index] == true">
              <input class="form-control"
                v-model="todo.todo"
                @blur="edit[index]=false; updateTodo([todo.id, todo.todo])"
                @keyup.enter="edit[index]=false; updateTodo([todo.id, todo.todo])" />
            </div>
            <div class="d-inline-block" v-else v-on:dblclick="toggleEditMode(index)">
              {{todo.todo}}
            </div>
          <i class="fa fa-times ml-auto float-right"
              @click="deleteTodo([todo.id, index])"
              aria-hidden="true">
          </i>
        </li>
        <li class="list-group-item">
          <span>
            {{ITEMS_LEFT + ' item'}}{{(ITEMS_LEFT != 1) ? 's' : ''}}{{' left'}}
          </span>
          <button class="btn btn-sm btn-secondary" @click="filterByComplete(null)">
            All
          </button>
          <button class="btn btn-sm btn-secondary" @click="filterByComplete(0)">
            Acive
          </button>
          <button class="btn btn-sm btn-secondary" @click="filterByComplete(1)">
            Completed
          </button>
          <button class="btn btn-sm btn-secondary float-right"
                  v-if="ITEMS_COMPLETE > 0"
                  @click="deleteTodo([null, null])">
            Clear completed
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import { required, minLength, maxLength } from 'vuelidate/lib/validators';
  import { mapGetters } from 'vuex';
  export default {
    data() {
      return {
        newTodo        : '',
        edit           : {},
        markAsComplete : 0,
        itemsLeft      : 0
      }
    },
    created() {
      this.$store.dispatch('GET_TODOS', this.$route.params.groupId);
    },
    validations: {
      NEW_TODO: {
        required,
        minLength: minLength(1),
        maxLength: maxLength(128)
      }
    },
    computed: {
      ...mapGetters([
        'TODOS', 'ITEMS_LEFT', 'ITEMS_COMPLETE', 'FILTERED_TODOS'
      ]),
      NEW_TODO : {
        // getter
        get: function () {
          return this.$store.getters.NEW_TODO
        },
        // setter
        set: function (todo) {
          this.$store.commit('SET_NEW_TODO', todo);
        }
      }
    },
    methods:{
      create() {
        this.$v.$touch();
        if (this.$v.$invalid) {
          this.submitStatus = 'ERROR'
        } else {
          this.$store.dispatch('CREATE_TODO', [this.NEW_TODO, this.TODOS.id]);
        }
      },
      toggleEditMode(index) {
        this.$set(this.edit, index, 1)
      },
      updateTodo([id, todo]) {
        this.$store.dispatch('UPDATE_TODO', [id, todo]);
      },
      deleteTodo([ids, index]) {
        if(ids == null) {
          var items = this.TODOS.todos.filter(o => (o.complete == 1 || o.complete == true));
          ids = items.map(a => a.id)
        } else {
          ids = [ids]
        }
        console.log(ids);
        this.$store.dispatch('DELETE_TODO', [ids, index]);
      },
      toggleComplete(ids, index) {
        ids.isArray ? '' : ids   = [ids];
        this.$store.dispatch('TOGGLE_COMPLETE', [ids, null, index]);
      },
      toggleMarkAsComplete() {
        let ids = this.TODOS.todos.map(a => a.id);
        this.markAsComplete = this.markAsComplete === 0 ? 1 : 0;
        this.$store.dispatch('TOGGLE_COMPLETE', [ids, this.markAsComplete ,null]);
      },
      filterByComplete(complete) {
        this.$store.dispatch('FILTER_BY_COMPLETE', complete);
      },
    },
  }
</script>
