<template>
  <div class="contact-list">
    <v-app>
      <Header />
      <div class="ma-5">
        <h1 class="mb-10">お問い合わせ一覧</h1>
        <v-btn
          v-for="(item, index) in tabs"
          :key="index"
          class="mr-5 mb-10"
          :class="category === item.value ? 'blue' : 'blue lighten-5'"
          @click="tabClickHandler(item.value)"
          >{{ item.value }}</v-btn
        >
        <div v-show="loading">Loading...</div>
        <div v-show="!loading" class="contact-list__cards">
          <v-card v-for="item in filterInquiryList" :key="item.id">
            <v-card-text v-if="loginUser.isAdmin">
              <p class="text-h4 text--primary">{{ item.username }}様</p>
              <div class="customer-info">
                <p>
                  <span class="contact-list__cards-subject">メールアドレス</span>：{{ item.email }}
                </p>
                <p><span class="contact-list__cards-subject">電話番号</span>：{{ item.phone }}</p>
                <p>
                  <span class="contact-list__cards-subject">お問い合わせ内容</span>：{{
                    item.content.length <= 100 ? item.content : item.content.substr(0, 100) + '...'
                  }}
                </p>
                <p>
                  <span class="contact-list__cards-subject">お問い合わせ日時</span>：{{
                    item.created_at
                  }}
                </p>
              </div>
            </v-card-text>
            <v-card-text v-else>
              <p>
                <span class="contact-list__cards-subject">お問い合わせ内容</span>：{{
                  item.content.length <= 100 ? item.content : item.content.substr(0, 100) + '...'
                }}
              </p>
              <p>
                <span class="contact-list__cards-subject">お問い合わせ日時</span>：{{
                  item.created_at
                }}
              </p>
            </v-card-text>
            <v-dialog v-model="isDialog" :retain-focus="false" width="500">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  v-bind="attrs"
                  v-on="on"
                  @click="findDetailInformation(item.id, inquiryList)"
                  class="contact-list__cards-button"
                >
                  詳細を見る
                </v-btn>
              </template>
              <v-card>
                <v-card-title class="text-h5 grey lighten-2">対応情報</v-card-title>
                <v-card-text class="contact-list__cards-information">
                  <p>
                    <span class="contact-list__cards-subject">対応状況</span>：{{
                      targetInquiry.status
                    }}
                  </p>
                  <p>
                    <span class="contact-list__cards-subject">対応者</span>：{{
                      targetInquiry.responder
                    }}
                  </p>
                  <p>
                    <span class="contact-list__cards-subject">対応日時</span>：{{
                      targetInquiry.respondTime
                    }}
                  </p>
                  <p>
                    <span class="contact-list__cards-subject">メッセージ</span>：{{
                      targetInquiry.message
                    }}
                  </p>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" text @click="closeDialog">閉じる</v-btn>
                  <v-btn
                    v-if="loginUser.isAdmin"
                    color="primary"
                    text
                    @click="startChat(targetInquiry.id, targetInquiry.responder)"
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
import Header from '../organisms/Header.vue';
import { doc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../../plugins/firebase';

const CATEGORY = {
  UNSUPPORTED: '未対応',
  SUPPORTING: '対応中',
  SUPPORTED: '対応済み',
};

export default {
  data() {
    return {
      isDialog: false,
      inquiryList: [],
      targetInquiry: '',
      category: '',
      loading: true,
    };
  },
  computed: {
    loginUser() {
      return this.$store.state.user;
    },
    tabs() {
      return [
        { category: 'unsupported', value: CATEGORY.UNSUPPORTED },
        { category: 'supporting', value: CATEGORY.SUPPORTING },
        { category: 'supported', value: CATEGORY.SUPPORTED },
      ];
    },
    filterInquiryList() {
      return this.inquiryList.filter((item) => item.status === this.category);
    },
    hasCategory() {
      return this.inquiryList.some((item) => item.status === this.category);
    },
  },
  mounted() {
    this.$store.dispatch('GET_LOGIN_STATE');
    this.category = CATEGORY.UNSUPPORTED;
    this.getInquiryList(this.category);
  },
  methods: {
    tabClickHandler(value) {
      this.category = value;
      if (this.hasCategory) return;
      this.loading = true;
      this.getInquiryList(value);
    },
    findDetailInformation(id, list) {
      this.targetInquiry = list.find((item) => item.id === id);
    },
    startChat(chat_id, responder) {
      if (this.loginUser.username === responder || responder === '') {
        this.$router.push(`/${chat_id}`);
        updateDoc(doc(db, 'inquiries', chat_id), {
          status: '対応中',
        });
      } else {
        alert('ほかの管理者が対応しています。');
      }
    },
    async getInquiryList(status) {
      const q = query(collection(db, 'inquiries'), where('status', '==', status));
      try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          this.inquiryList.push({
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
        this.loading = false;
      } catch {
        this.loading = false;
        alert('データの取得に失敗しました。ブラウザの再読み込みをしてください。');
      }
    },
    closeDialog() {
      this.isDialog = false
    },
  },
  components: {
    Header,
  },
};
</script>

<style scoped>
.contact-list__cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 30px;
  row-gap: 30px;
}

.contact-list__cards-subject {
  font-weight: bold;
}
.contact-list__cards-button {
  margin-bottom: 30px;
  margin-left: 16px;
}
.contact-list__cards-information {
  margin-top: 20px;
}
</style>
