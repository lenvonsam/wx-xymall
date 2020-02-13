// import httpUtil from '../../utils/httpUtil'
// import apiList from '../../utils/apiList'
export default {
  actions: {
    setUser ({ commit }, usr) {
      commit('SETUSER', usr)
    },
    exitUser ({ commit }) {
      commit('EXITUSER')
    },
    autoUser ({ commit }) {
      commit('AUTOUSER')
    },
    refreshUser ({ commit }) {
      commit('REFRESHUSER')
    }
  },
  state: {
    currentUser: {},
    isLogin: false
  },
  mutations: {
    SETUSER (state, usr) {
      try {
        mpvue.setStorageSync('currentUser', usr)
        state.currentUser = usr
        state.isLogin = true
      } catch (e) {
        console.error('setuser:>>', e)
        state.currentUser = {}
        state.isLogin = false
      }
    },
    EXITUSER (state) {
      try {
        mpvue.removeStorageSync('currentUser')
      } catch (e) {
        console.error('exituser:>>', e)
      }
      state.currentUser = {}
      state.isLogin = false
    },
    AUTOUSER (state) {
      try {
        const value = wx.getStorageSync('currentUser')
        console.log('value:>>', value)
        if (value.id > 0) {
          state.currentUser = value
          state.isLogin = true
        } else {
          state.isLogin = false
        }
      } catch (e) {
        console.error('autouser:>>', e)
        state.isLogin = false
      }
    },
    REFRESHUSER (state) {
      //   httpUtil
      //     .requestDecode(
      //       'erp',
      //       httpUtil.proxy.erp + apiList.erp.driverInfo,
      //       {
      //         body: JSON.stringify({ driverCode: state.currentUser.driverCode })
      //       },
      //       'post'
      //     )
      //     .then(res => {
      //       console.log('refresh user:>>', res)
      //       state.currentUser = res[0]
      //       mpvue.setStorageSync('currentUser', state.currentUser)
      //     })
      //     .catch(err => {
      //       console.error('更新用户信息失败', err)
      //     })
    }
  }
}
