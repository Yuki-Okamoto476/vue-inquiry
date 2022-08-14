<template>
  <div class="sign-in">
    <v-app>
      <v-card class="card-wrapper">
        <v-card-title class="card-title">ログイン</v-card-title>
        <v-form v-model="valid" class="card-form">
          <v-text-field
            type="email"
            v-model.lazy="email"
            label="メールアドレス"
            required
          ></v-text-field>
          <v-text-field
            type="password"
            v-model.lazy="password"
            label="パスワード"
            required
          ></v-text-field>
          <v-btn type="button" color="primary" @click="handleSignIn">ログイン</v-btn>
          <router-link to="/signUp" class="sign-in__link">新規登録はこちら</router-link>
        </v-form>
      </v-card>
    </v-app>
  </div>
</template>

<script>
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
export default {
  data() {
    return {
      valid: false,
      email: '',
      password: '',
    };
  },
  methods: {
    handleSignIn: function () {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, this.email, this.password)
        .then(() => {
          this.$router.push('/contactForm');
        })
        .catch(() => {
          alert('ログインできませんでした。');
        });
    },
  },
};
</script>

<style scoped>
.sign-in__link {
  display: block;
  float: right;
}
</style>
