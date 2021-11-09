<template>
  <div class="contactList">
    <v-app>
      <HeaderBar />
      <div class="ma-5">
        <h1 class="mb-10">お問い合わせ一覧</h1>
        <div class="mb-10">
          <v-btn
            @click="handleUnsupported"
            class="mr-5"
            :class="unsupport ? 'blue' : 'blue lighten-5'"
            >未対応</v-btn
          >
          <v-btn
            @click="handleSupporting"
            class="mr-5"
            :class="supporting ? 'blue' : 'blue lighten-5'"
            >対応中</v-btn
          >
          <v-btn @click="handleSupported" :class="supported ? 'blue' : 'blue lighten-5'"
            >対応済み</v-btn
          >
        </div>
        <div class="cards">
          <v-card v-for="list in lists" :key="list.id">
            <v-card-text v-if="loginUser.isAdmin">
              <p class="text-h4 text--primary">{{ list.username }}様</p>
              <div class="customer-info">
                <p><span class="subject">メールアドレス</span>：{{ list.email }}</p>
                <p><span class="subject">電話番号</span>：{{ list.phone }}</p>
                <p>
                  <span class="subject">お問い合わせ内容</span>：{{
                    list.content.length <= 100 ? list.content : list.content.substr(0, 100) + '...'
                  }}
                </p>
                <p><span class="subject">お問い合わせ日時</span>：{{ list.created_at }}</p>
              </div>
            </v-card-text>
            <v-card-text v-else>
              <p>
                <span class="subject">お問い合わせ内容</span>：{{
                  list.content.length <= 100 ? list.content : list.content.substr(0, 100) + '...'
                }}
              </p>
              <p><span class="subject">お問い合わせ日時</span>：{{ list.created_at }}</p>
            </v-card-text>
            <v-dialog v-model="dialog" :retain-focus="false" width="500">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  v-bind="attrs"
                  v-on="on"
                  @click="handleFindDetail(list.id, lists)"
                  class="detail-btn"
                >
                  詳細を見る
                </v-btn>
              </template>
              <v-card>
                <v-card-title class="text-h5 grey lighten-2"> 対応情報 </v-card-title>
                <v-card-text class="responder-info">
                  <p><span class="subject">対応状況</span>：{{ targetInquiry.status }}</p>
                  <p><span class="subject">対応者</span>：{{ targetInquiry.responder }}</p>
                  <p><span class="subject">対応日時</span>：{{ targetInquiry.respondTime }}</p>
                  <p><span class="subject">メッセージ</span>：{{ targetInquiry.message }}</p>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" text @click="dialog = false"> 閉じる </v-btn>
                  <v-btn
                    v-if="loginUser.isAdmin"
                    color="primary"
                    text
                    @click="handleManageChat(targetInquiry.id, targetInquiry.responder)"
                  >
                    対応を開始する
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-card>
        </div>
      </div>
    </v-app>
  </div>
</template>

<script>
import HeaderBar from '../organisms/HeaderBar.vue';
import { doc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../../plugins/firebase';

const getInquiryLists = async (status) => {
  const array = [];
  const q = query(collection(db, 'inquiries'), where('status', '==', status));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    array.push({
      id: doc.id,
      username: doc.data().username,
      email: doc.data().email,
      phone: doc.data().phone,
      selection: doc.data().selection,
      content: doc.data().content,
      created_at: doc.data().created_at.toDate().toLocaleString(),
      status: doc.data().status,
      responder: doc.data().responder,
      respondTime: doc.data().respondTime.toDate().toLocaleString(),
      isAdmin: doc.data().isAdmin,
      message: doc.data().message,
    });
  });
  return array;
};

export default {
  data() {
    return {
      dialog: false,
      lists: [],
      targetInquiry: '',
      unsupport: true,
      supporting: false,
      supported: false,
    };
  },
  async mounted() {
    this.lists = await getInquiryLists('未対応');
    this.$store.dispatch('loginCheckAction');
  },
  methods: {
    handleUnsupported: async function () {
      this.lists = await getInquiryLists('未対応');
      this.unsupport = true;
      this.supporting = false;
      this.supported = false;
    },
    handleSupporting: async function () {
      this.lists = await getInquiryLists('対応中');
      this.unsupport = false;
      this.supporting = true;
      this.supported = false;
    },
    handleSupported: async function () {
      this.lists = await getInquiryLists('対応済み');
      this.unsupport = false;
      this.supporting = false;
      this.supported = true;
    },
    handleFindDetail: function (list_id, listArray) {
      const targetList = listArray.find((obj) => obj.id === list_id);
      this.targetInquiry = targetList;
    },
    handleManageChat: function (chat_id, responder) {
      if (this.loginUser.username === responder || responder === '') {
        this.$router.push(`/${chat_id}`);
        updateDoc(doc(db, 'inquiries', chat_id), {
          status: '対応中'
        })
      } else {
        alert('ほかの管理者が対応しています。');
      }
    },
  },
  computed: {
    loginUser: function () {
      return this.$store.state.user;
    },
  },
  components: {
    HeaderBar,
  },
};
</script>

<style scoped>
.subject {
  font-weight: 700;
}
.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 30px;
  row-gap: 30px;
}
.detail-btn {
  margin-bottom: 30px;
  margin-left: 16px;
}
.responder-info {
  margin-top: 20px;
}
</style>
