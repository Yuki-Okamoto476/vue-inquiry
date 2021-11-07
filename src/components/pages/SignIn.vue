<template>
  <div class="signIn">
   <v-app>
    <v-card class="card-wrapper">
      <v-card-title class="card-title">ログイン</v-card-title>
      <v-form v-model="valid" class="card-form">
        <v-text-field
          type="email"
          v-model="email"
          label="メールアドレス"
          required
        ></v-text-field>
        <v-text-field
          type="password"
          v-model="password"
          label="パスワード"
          required
        ></v-text-field>
        <v-btn type="button" @click="handleSignIn" color="success">ログイン</v-btn>
        <router-link to="/signUp" class="signUp-link">新規登録はこちら</router-link>
      </v-form>
      </v-card>
    </v-app>
  </div>
</template>

<script>
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
export default {
  data() {
    return {
      valid: false,
      email: "",
      password: ""
    }
  },
  methods: {
    handleSignIn: function() {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, this.email, this.password)
      .then(() => {
        alert('ログインできました。')
        this.$router.push('/contactForm')
      })
      .catch(() => {
        alert('ログインできませんでした。')
      })
    }
  }
}
</script>

<style scoped>
.signUp-link {
  display: block;
  float: right;
}
</style>