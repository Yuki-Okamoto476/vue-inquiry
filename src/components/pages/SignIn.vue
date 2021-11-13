<template>
  <div class="signIn">
    <v-app>
      <v-card class="card-wrapper">
        <v-card-title class="card-title">ログイン</v-card-title>
        <v-form v-model="valid" class="card-form">
          <v-text-field type="email" v-model="email" label="メールアドレス" required></v-text-field>
          <v-text-field
            type="password"
            v-model="password"
            label="パスワード"
            required
          ></v-text-field>
          <SignButton :clickMethod="handleSignIn" text="ログイン"/>
          <router-link to="/signUp" class="signUp-link">新規登録はこちら</router-link>
        </v-form>
      </v-card>
    </v-app>
  </div>
</template>

<script>
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import SignButton from "../atoms/SignButton.vue"
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
  components: {
    SignButton
  }
};
</script>

<style scoped>
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
.signUp-link {
  display: block;
  float: right;
}
</style>
