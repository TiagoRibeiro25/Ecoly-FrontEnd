// Change the createApp line to this
import Vue, { createApp } from "@vue/compat";
import { createPinia } from "pinia";
import VueLazyLoad from "vue3-lazyload";
import App from "./App.vue";
import router from "./router";

// Import BootstrapVue and its default styles
import BootstrapVue from "bootstrap-vue";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "bootstrap/dist/css/bootstrap.css";
import "./assets/fonts.css";
import "./assets/main.css";

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue);

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(VueLazyLoad, {
	loading: "../assets/images/loading.gif",
	error: "../assets/images/error.png",
	lazyComponent: true
});
app.use(router);

app.mount("#app");
