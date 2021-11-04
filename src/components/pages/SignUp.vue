<template>
  <div class="signUp">
    <form>
      <div class="form-container">
        <dl>
          <dt><label for="email">メールアドレス</label></dt>
          <dd><input type="text" id="email" name="email" v-model="email" placeholder="abc@example.com" required></dd>
        </dl>
        <dl>
          <dt><label for="password">パスワード（6文字以上の英数字）</label></dt>
          <dd><input type="password" id="password" name="password" v-model="password" required></dd>
        </dl>
        <!-- <dl>
          <dt><label for="confirmPassword">パスワード（確認用）</label></dt>
          <dd><input type="password" id="confirmPassword" name="confirmPassword" v-model="confirmPassword" required></dd>
        </dl>
        <dl>
          <dt><label for="username">名前</label></dt>
          <dd><input type="text" id="username" name="username" v-model="username" required></dd>
        </dl> -->
      </div>
      <button type="button" @click="handleSignUp">登録</button>
    </form>
  </div>
</template>

<script>
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
export default {
  data() {
    return {
      email: "",
      password: ""
    }
  },
  methods: {
    handleSignUp: function() {
      const auth = getAuth()
      createUserWithEmailAndPassword(auth, this.email, this.password)
      .then(() => {
        alert('Create account')
      })
      .catch((error) => {
        alert(error.message)
      })
    }
  }
}
</script>

<style>

</style>