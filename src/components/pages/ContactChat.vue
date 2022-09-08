<template>
  <div class="contact-chat">
    <v-app>
      <Header />
      <div class="contact-chat__contents-wrapper">
        <div>
          <div v-for="item in inquiryList" :key="item.id" class="ma-5">
            <h1 v-if="loginUser.isAdmin">{{ item.username }}様</h1>
            <MessageBox
              :icon="require('@/assets/customer.svg')"
              :content="item.content"
              :isAdmin="false"
            />
          </div>
          <div v-for="item in messageList" :key="item.id">
            <MessageBox
              v-if="item.isAdmin"
              :icon="require('@/assets/manager.svg')"
              :content="item.message"
              :isAdmin="true"
              class="ma-5"
            />
            <MessageBox
              v-else
              :icon="require('@/assets/customer.svg')"
              :content="item.message"
              :isAdmin="false"
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
            class="mr-5 contact-chat__submit-icon"
            @click="sendMessage"
          />
        </div>
      </div>
    </v-app>
  </div>
</template>

<script>
import Header from '../organisms/Header.vue';
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
      chatId: this.$route.params['id'],
      inquiryList: [],
      messageText: '',
      messageList: [],
    };
  },
  computed: {
    loginUser() {
      return this.$store.state.user;
    },
  },
  mounted() {
    this.getInquiry();
    this.getMessage();
  },
  methods: {
    getInquiry() {
      const unSubInquiry = onSnapshot(doc(db, 'inquiries', this.chatId), (doc) => {
        const result = [];
        result.push(doc.data());
        this.inquiryList = result;
      });
      return () => unSubInquiry();
    },
    getMessage() {
      const msgRef = collection(db, 'chats', this.chatId, 'messages');
      const q = query(msgRef, orderBy('created_at', 'asc'));
      const unSubMessage = onSnapshot(q, (querySnapshot) => {
        const result = [];
        querySnapshot.forEach((doc) => {
          result.push({
            id: doc.id,
            isAdmin: doc.data().isAdmin,
            message: doc.data().message,
          });
        });
        this.messageList = result;
      });
      return () => unSubMessage();
    },
    sendMessage() {
      addDoc(collection(db, 'chats', this.chatId, 'messages'), {
        uid: this.loginUser.uid,
        isAdmin: this.loginUser.isAdmin,
        username: this.loginUser.username,
        message: this.messageText,
        created_at: serverTimestamp(),
      });
      updateDoc(doc(db, 'inquiries', this.chatId), {
        responder: this.loginUser.username,
        respondTime: serverTimestamp(),
        isAdmin: this.loginUser.isAdmin,
        message: this.messageText,
        status: '対応済み',
      });
      this.messageText = '';
    },
  },
  components: {
    Header,
    MessageBox,
  },
};
</script>

<style scoped>
::v-deep .v-application--wrap {
  min-height: fit-content;
}
.contact-chat__contents-wrapper {
  display: grid;
  height: 100vh;
  grid-template-rows: 1fr auto;
}
.contact-chat__submit-icon:hover {
  opacity: 0.7;
  cursor: pointer;
}
</style>
