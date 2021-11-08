<template>
  <header class="headerBar">
    <h1>オシリス</h1>
    <router-link to="/contactForm" class="form-link">お問い合わせフォーム</router-link>
    <router-link to="/contactList">お問い合わせ一覧</router-link>
    <v-btn type="button" @click="handleSignOut" color="primary" class="header-btn"
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
.headerBar {
  background-color: #bbdefb;
  height: 80px;
  display: flex;
  align-items: center;
  padding: 10px;
}
h1 {
  cursor: pointer;
  padding-right: 20px;
}
.form-link {
  margin-right: 20px;
}
.header-btn {
  margin: 0 0 0 auto;
}
</style>
