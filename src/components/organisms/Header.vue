<template>
  <header class="header">
    <h1>オシリス</h1>
    <v-btn type="button" @click="handleSignOut" color="primary" class="header-btn">ログアウト</v-btn>
  </header>
</template>

<script>
import { getAuth, signOut } from "firebase/auth";
export default {
  name: "Header",
  methods: {
    handleSignOut: function() {
      const auth = getAuth()
      signOut(auth)
      .then(() => {
        this.$router.push('/')
      })
      .catch(() => {
        alert('ログアウトに失敗しました。')
      })
    }
  }
}
</script>

<style scoped>
.header {
  background-color: #BBDEFB;
  height: 80px;
  display: flex;
  align-items: center;
  padding: 10px;
}
.header-btn {
  margin: 0 0 0 auto;
}

</style>