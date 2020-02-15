import Vue from 'vue'
import App from './App'
import mixins from './vuex/mixins'
import store from './vuex/store'
import vuex from 'vuex'
import navBar from './components/NavBar.vue'
import mallItem from './components/MallItem.vue'
import timeLine from './components/TimeLine.vue'
import emptyImage from './components/EmptyImage.vue'
import timeText from './components/TimeText.vue'

Vue.config.productionTip = false
App.mpType = 'app'

Vue.mixin(mixins)
Vue.use(vuex)
Vue.component('navBar', navBar)
Vue.component('mallItem', mallItem)
Vue.component('timeLine', timeLine)
Vue.component('timeText', timeText)
Vue.component('emptyImage', emptyImage)

Vue.prototype.$store = store

const app = new Vue(App)
app.$mount()
