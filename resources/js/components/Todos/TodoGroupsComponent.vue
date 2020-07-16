<template>
    <div>
        <h1 class="text-center">Todo Groups</h1>
        <div class="card mb-3">
          <ul class="list-group list-group-flush">
            <li class="list-group-item">
              <form v-on:submit.prevent="onSubmit">
                <div class="row">
                  <div class="col-md-9">
                    <input class="form-control"
                            v-model="name"
                            placeholder="Название новой группы"
                            maxlength="128"
                            v-on:keyup.enter="create()"
                            />
                    <div v-if="$v.name.$error" class="invalid-feedback d-block">
                      <span v-if="!$v.name.required">Name is required</span>
                      <span v-if="!$v.name.minLength">
                        Name must be at least 2 characters
                      </span>
                      <span v-if="!$v.name.maxLength">
                        Name must be maximum 128 characters
                      </span>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <button type="button"
                            class="btn btn-success"
                            @click="create()"
                            >
                      Добавить
                    </button>
                  </div>
                </div>
              </form>
            </li>
            <li class="list-group-item">
              <div class="row">
                <div class="col-md-9">
                  <input class="form-control"
                          placeholder="Фильтр по названию"
                          v-model="SEARCH"
                          />
                </div>
                <div class="col-md-3">
                  <button type="button"
                          class="btn btn-info"
                          @click="toggleDateOrder()">
                    Дата
                    <span v-bind:class="
                      [(DATE_ORDER && DATE_ORDER === 'DESC')
                        ? 'fa-chevron-up' :
                        'fa-chevron-down',
                        'fa'
                      ]"></span>
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div v-if="FILTERED_TODO_GROUPS" class="row">
            <div v-for="group in FILTERED_TODO_GROUPS" class="col-md-3" >
              <router-link :to="{ name: 'todoList', params: { groupId: group.id } }">
                <div class="card mb-2">
                  <div class="card-body">
                    <h5 class="card-title">{{ group.name }}</h5>
                    <p class="card-text"
                        v-for="todo in group.todos">
                        <del v-if="todo.complete == 1">{{todo.todo}}</del>
                        <span v-else>{{todo.todo}}</span>
                    </p>
                  </div>
                </div>
              </router-link>
            </div>
        </div>
    </div>
</template>

<script>
    import { required, minLength, maxLength } from 'vuelidate/lib/validators';
    import { mapGetters } from 'vuex';
    export default {
      data() {
        return {
          name    : '',
        }
      },
      validations: {
        name: {
          required,
          minLength: minLength(2),
          maxLength: maxLength(128)
        }
      },
      created() {
        this.$store.dispatch('GET_TODO_GROUPS');
        this.name = this.NEW_GROUP_NAME
      },
      computed: {
        ...mapGetters([
          'FILTERED_TODO_GROUPS',
          'DATE_ORDER'
        ]),
        SEARCH : {
          // getter
          get: function () {
            return this.$store.getters.SEARCH
          },
          // setter
          set: function (search) {
            this.$store.dispatch('CHANGE_SEARCH', search);
          }
        }
      },
      methods:{
        create() {
          this.$v.$touch();
          if (this.$v.$invalid) {
            this.submitStatus = 'ERROR'
          } else {
            this.$store.dispatch('CREATE_TODO_GROUP', this.name);
          }
        },
        toggleDateOrder() {
            this.$store.dispatch('TOGGLE_DATE_ORDER');
        },
        searchTodo() {
          this.$store.dispatch('SEARCH_TODO_GROUP', this.SEARCH);
        }
      },
    }
</script>
