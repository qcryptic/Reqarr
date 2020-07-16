import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { MdButton, MdToolbar, MdAvatar, MdIcon, MdLayout, MdField, MdCard, MdBottomBar, MdEmptyState, MdAutocomplete, MdMenu } from 'vue-material/dist/components'
import 'vue-material/dist/vue-material.min.css'
import '../public/css/theme.scss'
import axios from 'axios';

Vue.config.productionTip = false

const axiosConfig = axios.create({

});

Vue.prototype.$http = axiosConfig;

Vue.use(MdToolbar);
Vue.use(MdButton);
Vue.use(MdAvatar);
Vue.use(MdIcon);
Vue.use(MdLayout);
Vue.use(MdField);
Vue.use(MdCard);
Vue.use(MdBottomBar);
Vue.use(MdEmptyState);
Vue.use(MdAutocomplete);
Vue.use(MdMenu);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
