<template>
  <div class="messageBox mb-3">
    <v-app>
      <div class="d-flex align-center mt-3">
        <v-avatar><img :src="icon" /></v-avatar>
        <p class="ma-3 pa-5 rounded-lg" :class="bg">{{ content }}</p>
      </div>
    </v-app>
  </div>
</template>

<script>
export default {
  name: 'MessageBox',
  props: ['icon', 'content', 'bg'],
};
</script>

<style scoped>

</style>
