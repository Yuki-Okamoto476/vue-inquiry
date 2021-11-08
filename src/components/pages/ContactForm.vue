<template>
  <div class="contactForm">
    <v-app>
      <HeaderBar />
      <v-card class="card-wrapper">
        <v-card-title class="card-title">お問い合わせフォーム</v-card-title>
        <v-form v-model="valid" class="card-form">
          <v-text-field
            type="text"
            v-model="username"
            :rules="usernameRules"
            label="氏名"
            required
          ></v-text-field>
          <v-text-field
            type="email"
            v-model="email"
            :rules="emailRules"
            label="メールアドレス"
            required
          ></v-text-field>
          <v-text-field
            type="tel"
            v-model="phone"
            :rules="phoneRules"
            label="電話番号"
            required
          ></v-text-field>
          <v-select
            :items="items"
            v-model="selection"
            :rules="selectionRules"
            label="製品種別を選択してください"
            required
          ></v-select>
          <v-textarea
            name="input-7-1"
            v-model="content"
            :rules="contentRules"
            label="お問い合わせ内容"
            required
            no-resize
            maxlength="2000"
          ></v-textarea>
          <v-btn type="button" @click="handleSubmit" color="success">送信</v-btn>
        </v-form>
      </v-card>
    </v-app>
  </div>
</template>

<script>
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../plugins/firebase';
import HeaderBar from '../organisms/HeaderBar.vue';
export default {
  data() {
    return {
      valid: false,
      items: [
        'A001',
        'A002',
        'A003',
        'A004',
        'A005',
        'A006',
        'A007',
        'A008',
        'A009',
        'A010',
        'A011',
        'A012',
        'A013',
        'A014',
        'A015',
      ],
      username: '',
      email: '',
      phone: '',
      selection: '',
      content: '',
      usernameRules: [(v) => !!v || '名前は必須です。'],
      emailRules: [
        (v) => !!v || 'メールアドレスは必須です。',
        (v) => /.+@.+/.test(v) || 'E-mail must be valid',
      ],
      phoneRules: [(v) => !!v || '電話番号は必須です。'],
      selectionRules: [(v) => !!v || '製品種別を選択してください。'],
      contentRules: [(v) => !!v || '問い合わせ内容を入力してください。'],
    };
  },
  methods: {
    handleSubmit: function () {
      addDoc(collection(db, 'inquiries'), {
        username: this.username,
        email: this.email,
        phone: this.phone,
        selection: this.selection,
        content: this.content,
        status: '未対応',
        created_at: serverTimestamp(),
        responder: '',
        respondTime: serverTimestamp(),
        isAdmin: false,
        message: '',
      });
      alert('送信が完了しました');
    },
  },
  components: {
    HeaderBar,
  },
};
</script>

<style></style>
