import Vue from 'vue';
import Vuex from 'vuex';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from "firebase/firestore"
import { db } from './plugins/firebase'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {},
  },
  mutations: {
    loginCheck: function (state) {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user?.uid) {
          const getData = async() => {
            const docRef = doc(db, "users", user.uid)
            const docSnap = await getDoc(docRef)
            state.user = docSnap.data()
          }
          getData()
        }
      });
    },
  },
  actions: {
    loginCheckAction: function(context) {
      context.commit('loginCheck')
    }
  }
});
