<template>
  <div class="contactChat">
    <v-app>
      <HeaderBar />
      <div>ContactChatページです {{ $route.params.id }}</div>
    </v-app>
  </div>
</template>

<script>
import HeaderBar from '../organisms/HeaderBar.vue';
export default {
  components: {
    HeaderBar,
  },
};
</script>

<style scoped></style>
