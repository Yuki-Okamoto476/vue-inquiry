<template>
  <div class="contactChat">
    <v-app>
      <HeaderBar />
      <div class="wrapper">
        <div class="messageContainer">
          <div v-for="list in inquiryLists" :key="list.id" class="ma-5">
            <h1 v-if="loginUser.isAdmin">{{ list.username }}様</h1>
            <MessageBox
              :icon="require('@/assets/customer.svg')"
              :content="list.content"
              :bg="customerBg"
            />
          </div>
          <div v-for="data in messageLists" :key="data.id">
            <MessageBox
              v-if="data.isAdmin"
              :icon="require('@/assets/manager.svg')"
              :content="data.message"
              :bg="managerBg"
              class="ma-5"
            />
            <MessageBox
              v-else
              :icon="require('@/assets/customer.svg')"
              :content="data.message"
              :bg="customerBg"
              class="ma-5"
            />
          </div>
        </div>
        <div class="d-flex align-center mx-5">
          <v-textarea
            v-model="messageText"
            label="メッセージを入力"
            no-resize
            wrap="hard"
          ></v-textarea>
          <img
            src="@/assets/submit2.svg"
            alt="送信"
            width="40"
            class="mr-5 submitIcon"
            @click="handlePushMessage"
          />
        </div>
      </div>
    </v-app>
  </div>
</template>

<script>
import HeaderBar from '../organisms/HeaderBar.vue';
import MessageBox from '../organisms/MessageBox.vue';
import {
  doc,
  onSnapshot,
  serverTimestamp,
  collection,
  addDoc,
  updateDoc,
  orderBy,
  query,
} from 'firebase/firestore';
import { db } from '../../plugins/firebase';

export default {
  data() {
    return {
      chat_id: this.$route.params['id'],
      inquiryLists: [],
      messageText: '',
      messageLists: [],
      managerBg: 'blue',
      customerBg: 'blue lighten-3',
    };
  },
  mounted: function () {
    this.$store.dispatch('loginCheckAction');
    const unSubInquiry = onSnapshot(doc(db, 'inquiries', this.chat_id), (doc) => {
      const array = [];
      array.push(doc.data());
      this.inquiryLists = array;
    });
    const msgRef = collection(db, 'chats', this.chat_id, 'messages');
    const q = query(msgRef, orderBy('created_at', 'asc'));
    const unSubMessage = onSnapshot(q, (querySnapshot) => {
      const array = [];
      querySnapshot.forEach((doc) => {
        array.push({
          id: doc.id,
          isAdmin: doc.data().isAdmin,
          message: doc.data().message,
        });
      });
      this.messageLists = array;
    });
    return () => {
      unSubInquiry();
      unSubMessage();
    };
  },
  methods: {
    handlePushMessage: function () {
      addDoc(collection(db, 'chats', this.chat_id, 'messages'), {
        uid: this.loginUser.uid,
        isAdmin: this.loginUser.isAdmin,
        username: this.loginUser.username,
        message: this.messageText,
        created_at: serverTimestamp(),
      });
      updateDoc(doc(db, 'inquiries', this.chat_id), {
        responder: this.loginUser.username,
        respondTime: serverTimestamp(),
        isAdmin: this.loginUser.isAdmin,
        message: this.messageText,
        status: '対応済み',
      });
      this.messageText = '';
    },
  },
  computed: {
    loginUser: function () {
      return this.$store.state.user;
    },
  },
  components: {
    HeaderBar,
    MessageBox,
  },
};
</script>

<style scoped>
::v-deep .v-application--wrap {
  min-height: fit-content;
}
.wrapper {
  display: grid;
  height: 100vh;
  grid-template-rows: 1fr auto;
}
.submitIcon:hover {
  opacity: 0.7;
  cursor: pointer;
}
</style>
