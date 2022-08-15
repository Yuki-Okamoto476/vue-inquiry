<template>
  <header class="header-bar">
    <h1><router-link to="/" class="header-bar__company">オシリス</router-link></h1>
    <router-link to="/contactForm" class="form-link">お問い合わせフォーム</router-link>
    <router-link to="/contactList">お問い合わせ一覧</router-link>
    <v-btn type="button" color="primary" @click="handleSignOut" class="header-bar__log-out-button"
      >ログアウト</v-btn
    >
  </header>
</template>

<script>
import { getAuth, signOut } from 'firebase/auth';
export default {
  name: 'HeaderBar',
  methods: {
    handleSignOut: function () {
      const auth = getAuth();
      signOut(auth)
        .then(() => {
          this.$router.push('/');
        })
        .catch(() => {
          alert('ログアウトに失敗しました。');
        });
    },
  },
};
</script>

<style scoped>
.header-bar {
  background-color: #bbdefb;
  height: 80px;
  display: flex;
  align-items: center;
  padding: 10px;
}
.header-bar__company {
  text-decoration: none;
  color: black;
  padding-right: 20px;
}
.form-link {
  margin-right: 20px;
}
.header-bar__log-out-button {
  margin: 0 0 0 auto;
}
</style>
