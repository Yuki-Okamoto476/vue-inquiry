<template>
  <div class="messageBox mb-3">
    <v-app>
      <div class="d-flex align-center mt-3">
        <v-avatar><img :src="icon" /></v-avatar>
        <p class="ma-3 pa-5 rounded-lg" :class="isAdmin ? 'blue' : 'blue lighten-3'">
          {{ content }}
        </p>
      </div>
    </v-app>
  </div>
</template>

<script>
export default {
  name: 'MessageBox',
  props: {
    icon: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
    },
  },
};
</script>

<style scoped></style>
