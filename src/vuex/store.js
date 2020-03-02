import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import user from './modules/user'
import vendor from './modules/vendor'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: state,
  actions: {
    configVal ({ commit }, { key, val }) {
      commit('CONFIGVAL', { key: key, val: val })
      if (key === 'oldVersion') {
        mpvue.setStorageSync('oldVersion', val)
      }
    }
  },
  mutations: {
    CONFIGVAL (state, { key, val }) {
      state[key] = val
    }
  },
  modules: {
    user,
    vendor
  }
})

export default store
