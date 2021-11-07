<template>
  <div class="contactList">
    <v-app>
      <Header />
      <h1>お問い合わせ一覧</h1>
      <div v-for="list in lists" :key="list.id" class="list-info">
        <v-card>
          <v-card-text>
            <p class="text-h4 text--primary">{{ list.username }}様</p>
            <div class="customer-info">
              <p><span class="subject">メールアドレス</span>：{{ list.email }}</p>
              <p><span class="subject">電話番号</span>：{{ list.phone }}</p>
              <p><span class="subject">お問い合わせ内容</span>：{{ list.content }}</p>
              <p><span class="subject">お問い合わせ日時</span>：{{ list.created_at.toDate() }}</p>
            </div>
          </v-card-text>
          <v-dialog v-model="dialog" :retain-focus="false" width="500">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark v-bind="attrs" v-on="on" class="detail-btn">
                詳細を見る
              </v-btn>
            </template>
            <v-card>
              <v-card-title class="text-h5 grey lighten-2"> 対応情報 </v-card-title>
              <v-card-text class="responder-info">
                <p><span class="subject">対応状況</span>：{{ list.status }}</p>
                <p>
                  <span class="subject">対応者</span>：{{
                    list.responder === '' ? '対応者はいません' : list.responder
                  }}
                </p>
                <p><span class="subject">対応日時</span>：{{ list.respondTime.toDate() }}</p>
                <p><span class="subject">メッセージ</span>：{{ list.message }}</p>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="dialog = false"> 閉じる </v-btn>
                <v-btn color="primary" text> 対応を開始する </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-card>
      </div>
    </v-app>
  </div>
</template>

<script>
import Header from '../organisms/Header.vue';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../plugins/firebase';

export default {
  data() {
    return {
      dialog: false,
      lists: [],
    };
  },
  async mounted() {
    const querySnapshot = await getDocs(collection(db, 'inquiries'));
    const array = [];
    querySnapshot.forEach((doc) => {
      array.push(doc.data());
    });
    this.lists = array;
  },
  components: {
    Header,
  },
};
</script>

<style scoped>
h1 {
  margin-top: 40px;
  margin-bottom: 40px;
}
.subject {
  font-weight: 700;
}
.detail-btn {
  margin-bottom: 30px;
  margin-left: 16px;
}
.responder-info {
  margin-top: 20px;
}
</style>
