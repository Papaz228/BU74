import { createApp } from 'vue';

import components from '@/components';
import router from '@/router';
import store from '@/store';

import App from './App.vue';

const app = createApp(App);

components.forEach(component => {
    app.component(component.name, component)
})

app
.use(router)
.use(store)
.mount('#app')
