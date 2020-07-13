import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { MdButton, MdToolbar, MdAvatar, MdIcon, MdLayout, MdField, MdCard, MdBottomBar, MdEmptyState } from 'vue-material/dist/components'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default-dark.css'

Vue.config.productionTip = false

Vue.use(MdToolbar);
Vue.use(MdButton);
Vue.use(MdAvatar);
Vue.use(MdIcon);
Vue.use(MdLayout);
Vue.use(MdField);
Vue.use(MdCard);
Vue.use(MdBottomBar);
Vue.use(MdEmptyState);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
