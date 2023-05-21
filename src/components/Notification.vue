<template>
    <v-snackbar
        :timeout="2000"
        color="success"
        variant="outlined"
        v-model="show"
    >

    <strong>{{message}}</strong>
    </v-snackbar>
</template>

<script setup lang="ts">
    import { inject } from "vue";
    const {message,show}:any = inject('message')
</script>