<template>
  <div class="contactChat">
    <v-app>
      <HeaderBar />
      <div v-for="list in messageLists" :key="list.id">
        ContactChatページです {{ $route.params.id }}
        <p>{{ list.content }}</p>
      </div>
    </v-app>
  </div>
</template>

<script>
import HeaderBar from '../organisms/HeaderBar.vue';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../plugins/firebase';

export default {
  data() {
    return {
      chatId: this.$route.params['id'],
      messageLists: [],
    };
  },
  mounted: function () {
    const unSub = onSnapshot(doc(db, 'inquiries', this.chatId), (doc) => {
      const array = [];
      array.push(doc.data());
      this.messageLists = array;
    });
    return () => unSub();
  },
  components: {
    HeaderBar,
  },
};
</script>

<style scoped></style>
