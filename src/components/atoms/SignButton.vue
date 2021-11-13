<template>
  <v-btn type="button" color="primary" @click="clickMethod">{{ text }}</v-btn>
</template>

<script>
export default {
  name: 'SignButton',
  props: ['clickMethod', 'text'],
};
</script>

<style scoped>
</style>
