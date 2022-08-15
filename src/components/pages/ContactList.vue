<template>
  <div class="contact-list">
    <v-app>
      <HeaderBar />
      <div class="ma-5">
        <h1 class="mb-10">お問い合わせ一覧</h1>
        <div class="mb-10">
          <v-btn
            @click="handleUnsupported"
            class="mr-5"
            :class="unsupported ? 'blue' : 'blue lighten-5'"
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
        <div v-show="loading">Loading...</div>
        <div v-show="!loading" class="contact-list__cards">
          <v-card v-for="inquiryItem in inquiryList" :key="inquiryItem.id">
            <v-card-text v-if="loginUser.isAdmin">
              <p class="text-h4 text--primary">{{ inquiryItem.username }}様</p>
              <div class="customer-info">
                <p>
                  <span class="contact-list__cards-subject">メールアドレス</span>：{{
                    inquiryItem.email
                  }}
                </p>
                <p>
                  <span class="contact-list__cards-subject">電話番号</span>：{{ inquiryItem.phone }}
                </p>
                <p>
                  <span class="contact-list__cards-subject">お問い合わせ内容</span>：{{
                    inquiryItem.content.length <= 100
                      ? inquiryItem.content
                      : inquiryItem.content.substr(0, 100) + '...'
                  }}
                </p>
                <p>
                  <span class="contact-list__cards-subject">お問い合わせ日時</span>：{{
                    inquiryItem.created_at
                  }}
                </p>
              </div>
            </v-card-text>
            <v-card-text v-else>
              <p>
                <span class="contact-list__cards-subject">お問い合わせ内容</span>：{{
                  inquiryItem.content.length <= 100
                    ? inquiryItem.content
                    : inquiryItem.content.substr(0, 100) + '...'
                }}
              </p>
              <p>
                <span class="contact-list__cards-subject">お問い合わせ日時</span>：{{
                  inquiryItem.created_at
                }}
              </p>
            </v-card-text>
            <v-dialog v-model="dialog" :retain-focus="false" width="500">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  v-bind="attrs"
                  v-on="on"
                  @click="handleFindDetail(inquiryItem.id, inquiryList)"
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
                  <v-btn color="primary" text @click="dialog = false">閉じる</v-btn>
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

export default {
  data() {
    return {
      dialog: false,
      inquiryList: [],
      targetInquiry: '',
      unsupported: true,
      supporting: false,
      supported: false,
      loading: true,
    };
  },
  computed: {
    loginUser: function () {
      return this.$store.state.user;
    },
  },
  async mounted() {
    this.inquiryList = await this.getInquiryList('未対応');
    this.$store.dispatch('loginCheckAction');
  },
  methods: {
    async handleUnsupported() {
      this.loading = true
      this.inquiryList = await this.getInquiryList('未対応');
      this.unsupported = true;
      this.supporting = false;
      this.supported = false;
    },
    async handleSupporting() {
      this.loading = true
      this.inquiryList = await this.getInquiryList('対応中');
      this.unsupported = false;
      this.supporting = true;
      this.supported = false;
    },
    async handleSupported() {
      this.loading = true
      this.inquiryList = await this.getInquiryList('対応済み');
      this.unsupported = false;
      this.supporting = false;
      this.supported = true;
    },
    handleFindDetail(list_id, listArray) {
      const targetList = listArray.find((obj) => obj.id === list_id);
      this.targetInquiry = targetList;
    },
    handleManageChat(chat_id, responder) {
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
      const array = [];
      const q = query(collection(db, 'inquiries'), where('status', '==', status));
      try {
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
        this.loading = false
        return array;
      } catch {
        alert('データの取得に失敗しました。ブラウザの再読み込みをしてください。');
      }
    },
  },
  components: {
    HeaderBar,
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
  font-weight: 700;
}
.contact-list__cards-button {
  margin-bottom: 30px;
  margin-left: 16px;
}
.contact-list__cards-information {
  margin-top: 20px;
}
</style>
