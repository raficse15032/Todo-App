<template>
  <div>
    <v-row class="justify-center mt-4">
      <v-col cols="12" md="8" lg="6">
        <v-card>
          <v-form ref="form" @submit.prevent="saveData()" class="my-4" v-model="valid">
              <v-row class="justify-center">
                <v-col cols="8" md="6">
                  <v-row class="align-center">
                    <v-text-field
                      clearable
                      v-model="title"
                      :rules="titleRules"
                      :counter="20"
                      label="Title"
                      color="deep-purple-accent-4"
                      variant="underlined"
                      required
                    ></v-text-field>
                    <v-btn type="submit" :loading="loading" :disabled="!valid || loading" class="ml-4" variant="outlined" color="deep-purple-accent-4">
                      Add
                    </v-btn>
                  </v-row>
                </v-col>
              </v-row>
          </v-form>
          <v-tabs v-model="tab" color="deep-purple-accent-4" align-tabs="center">
            <v-tab :value="1">All</v-tab>
            <v-tab :value="2">Pending</v-tab>
            <v-tab :value="3">Complete</v-tab>
          </v-tabs>
          <v-window v-model="tab">
            <v-window-item :value="1">
              <v-container>
                <v-list lines="one">
                  <v-list-item density="compact" v-for="todo in allTodos" :key="todo.id">
                    <template #prepend>
                      <v-list-item-action start>
                        <v-checkbox-btn @click="handleCheckboxChange(todo.id,!todo.status)" v-model="todo.status" color="deep-purple-accent-4"></v-checkbox-btn>
                      </v-list-item-action>
                    </template>
                    <v-list-item-title class="text-black"><p class="text-high-emphasis" :class="{'text-decoration-line-through':todo.status}">{{ todo.title }}</p></v-list-item-title>
                    <template #append>
                      <v-menu >
                        <template v-slot:activator="{ props }">
                          <v-btn variant="text" icon="mdi-dots-vertical" v-bind="props"></v-btn>
                        </template>

                        <v-list>
                          <v-list-item><v-btn @click="dialog = true; editItem = todo" variant="text">Edit</v-btn></v-list-item>
                          <v-list-item><v-btn @click="removeData(todo.id,todo._id)" variant="text">Delete</v-btn></v-list-item>
                        </v-list>
                      </v-menu>
                    </template>
                  </v-list-item>
                </v-list>
              </v-container>
            </v-window-item>
            <v-window-item :value="2">
              <v-container>
                <v-list lines="one">
                  <v-list-item density="compact" v-for="todo in pendingTodos" :key="todo.id">
                    <template #prepend>
                      <v-list-item-action start>
                        <v-checkbox-btn @click="handleCheckboxChange(todo.id,!todo.status)" v-model="todo.status" color="deep-purple-accent-4"></v-checkbox-btn>
                      </v-list-item-action>
                    </template>
                    <v-list-item-title class="text-black"><p class="text-high-emphasis" :class="{'text-decoration-line-through':todo.status}">{{ todo.title }}</p></v-list-item-title>
                    <template #append>
                      <v-menu >
                        <template v-slot:activator="{ props }">
                          <v-btn variant="text" icon="mdi-dots-vertical" v-bind="props"></v-btn>
                        </template>

                        <v-list>
                          <v-list-item><v-btn @click="dialog = true; editItem = todo" variant="text">Edit</v-btn></v-list-item>
                          <v-list-item><v-btn @click="removeData(todo.id,todo._id)" variant="text">Delete</v-btn></v-list-item>
                        </v-list>
                      </v-menu>
                    </template>
                  </v-list-item>
                </v-list>
              </v-container>
            </v-window-item>
            <v-window-item :value="3">
              <v-container>
                <v-list lines="one">
                  <v-list-item density="compact" v-for="todo in completeTodos" :key="todo.id">
                    <template #prepend>
                      <v-list-item-action start>
                        <v-checkbox-btn @click="handleCheckboxChange(todo.id,!todo.status)" v-model="todo.status" color="deep-purple-accent-4"></v-checkbox-btn>
                      </v-list-item-action>
                    </template>
                    <v-list-item-title class="text-black"><p class="text-high-emphasis" :class="{'text-decoration-line-through':todo.status}">{{ todo.title }}</p></v-list-item-title>
                    <template #append>
                      <v-menu >
                        <template v-slot:activator="{ props }">
                          <v-btn variant="text" icon="mdi-dots-vertical" v-bind="props"></v-btn>
                        </template>

                        <v-list>
                          <v-list-item><v-btn @click="dialog = true; editItem = todo" variant="text">Edit</v-btn></v-list-item>
                          <v-list-item><v-btn @click="removeData(todo.id,todo._id)" variant="text">Delete</v-btn></v-list-item>
                        </v-list>
                      </v-menu>
                    </template>
                  </v-list-item>
                </v-list>
              </v-container>
            </v-window-item>
          </v-window>
        </v-card>
      </v-col>
    </v-row>
    <UpdateModal  @closeModal="dialog = false" :editItem="editItem" :dialog="dialog"></UpdateModal>
  </div>
</template>

<script setup lang="ts">
  import { Message } from "../types/interface";
  import { ref, computed, defineAsyncComponent, onMounted, inject} from "vue";
  const UpdateModal = defineAsyncComponent(() => import('./UpdateModal.vue'))
  import { useTodosStore } from "../store/todos";
  const store = useTodosStore();
  const {messageShow} = inject('message') as Message
  const form = ref<any>(null)
  const loading = ref(false)
  const tab = ref(null);
  const dialog = ref(false);
  const editItem = ref({});
  const valid = ref(false);
  const title = ref('');
  const allTodos = computed(() => [...store.$state.todos])
  const pendingTodos = computed(() => [...store.pendingTodos()])
  const completeTodos = computed(() => [...store.completeTodos()])
  const handleCheckboxChange = (id:number,status:boolean) => {
    store.uspdateStatus(id,status)
  };
  const titleRules = [
    (value:any) => {
      if (value) return true
      return 'Title is requred.'
    },
    (value:any) => {
      if (value?.length <= 20) return true

      return 'Title must be less than 20 characters.'
    },
  ]
  const saveData = async () => {
    loading.value = true
    const data = {
      id: new Date().getTime(),
      title: title.value,
      status: false,
      _id:''
    }
    store.create(data).then(()=>{
      loading.value = false
      form.value.reset()
      messageShow("Created successfully")
    }).catch(()=>{
      loading.value = false
    })
    
  }
  const removeData = (id:number,_id:string) => {
    store.remove(id,_id).then(() => {
      messageShow("Deleted successfully")
    })
  }
  onMounted(()=>{
    store.read()
  })
</script>
