import Vue from 'vue';
import App from './App.vue';
import router from './router';
import './components';
import * as plugins from '@/plugins';

Vue.use(plugins.filter);

Vue.config.productionTip = false;

new Vue({
    router,
    vuetify: plugins.vuetify
    // render: h => h(App)
}).$mount('#app');