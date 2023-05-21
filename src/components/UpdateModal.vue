<template>
  <v-row justify="space-around">
    <v-dialog
      persistent
      transition="dialog-bottom-transition"
      width="700"
      v-model="dialog"
    >
      <template v-slot:default="{ isActive }">
        <v-card>
          <v-toolbar
            color="purple"
            title="Update todo title"
          ></v-toolbar>
          <v-card-text>
            <v-row justify="center">
              <v-col md="8" cols="12">
                <v-form @submit.prevent="updateData()" class="my-4" v-model="valid">
                    <v-row class="justify-center">
                        <v-col cols="10">
                            <v-row class="align-center">
                            <v-text-field
                                clearable
                                v-model="editableTitle"
                                :rules="titleRules"
                                :counter="20"
                                label="Title"
                                color="deep-purple-accent-4"
                                variant="underlined"
                                required
                            ></v-text-field>
                            <v-btn
                                type="submit"
                                :loading="loading" :disabled="!valid || loading"
                                class="ml-4"
                                variant="outlined"
                                color="deep-purple-accent-4"
                            >
                                Update
                            </v-btn>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-form>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn
              variant="text"
              @click="isActive.value = false;$emit('closeModal');">Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </v-row>
</template>

<script setup lang="ts">
    import { ref, watch, inject} from "vue";
    import { useTodosStore } from "../store/todos";
    import { Message } from "../types/interface";

    const emit = defineEmits(['closeModal'])
    const editableTitle = ref('');
    const store = useTodosStore();
    const props = defineProps({
        dialog: {
            default: false,
            type: Boolean,
        },
        editItem: {
            default: {},
            type: Object,
        },
    });
    
    const dialog = ref(false);
    
    const {messageShow} = inject('message') as Message

    watch(() => props.dialog, () => {
        if(props.dialog){
            dialog.value = true;
            const {title} = props.editItem
            editableTitle.value = title
        }
        else{
            dialog.value = false;
        }
    })

    const valid = ref(false);
    const loading = ref(false);
    
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

    const updateData = () => {
      loading.value = true
      const data = {
        id: props.editItem.id,
        title: editableTitle.value,
        status: props.editItem.Status,
        _id: props.editItem._id
      }
      store.update(data).then(() => {
        loading.value = false
        emit('closeModal')
        messageShow('Updated successfully')
      }).catch(() => {
        loading.value = false
      })
    }
</script>