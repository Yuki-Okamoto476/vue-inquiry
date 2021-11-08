<template>
  <div class="signUp">
    <v-app>
      <v-card class="card-wrapper">
        <v-card-title class="card-title">新規登録</v-card-title>
        <v-form v-model="valid" class="card-form">
          <v-text-field
            type="email"
            v-model="email"
            :rules="emailRules"
            label="メールアドレス"
            required
          ></v-text-field>
          <v-text-field
            type="password"
            v-model="password"
            :rules="passwordRules"
            label="パスワード"
            required
          ></v-text-field>
          <v-text-field
            type="password"
            v-model="confirmPassword"
            label="パスワード（確認用）"
            required
          ></v-text-field>
          <v-text-field
            type="text"
            v-model="username"
            :rules="usernameRules"
            label="名前"
            required
          ></v-text-field>
          <v-btn type="button" @click="handleSignUp" color="success">登録</v-btn>
        </v-form>
      </v-card>
    </v-app>
  </div>
</template>

<script>
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../plugins/firebase';
export default {
  data() {
    return {
      valid: false,
      email: '',
      password: '',
      confirmPassword: '',
      username: '',
      emailRules: [
        (v) => !!v || 'メールアドレスは必須です。',
        (v) => /.+@.+/.test(v) || 'E-mail must be valid',
      ],
      passwordRules: [(v) => !!v || 'パスワードは必須です。'],
      usernameRules: [(v) => !!v || '名前は必須です。'],
    };
  },
  methods: {
    handleSignUp: function () {
      if (this.password !== this.confirmPassword) {
        alert('パスワードが一致しません。');
        return false;
      }
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, this.email, this.password)
        .then((result) => {
          const user = result.user;
          if (user) {
            const uid = user.uid;
            const initialData = {
              email: this.email,
              uid: uid,
              username: this.username,
              isAdmin: false
            };
            setDoc(doc(db, 'users', uid), initialData);
          }
          alert('アカウントが作成されました');
          this.$router.push('/contactForm');
        })
        .catch((error) => {
          alert(error.message);
        });
    },
  },
};
</script>

<style>
.card-wrapper {
  width: 80%;
  margin: auto;
  padding: 30px;
}
.card-form {
  width: 100%;
}
.card-title {
  font-weight: 700;
}
</style>
