<template>
  <v-main>
    <Notification/>
    <router-view />
  </v-main>
</template>

<script lang="ts" setup>
  import Notification from '@/components/Notification.vue';
</script>
