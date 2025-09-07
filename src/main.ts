import { createApp } from "vue";
import "bootstrap/dist/css/bootstrap.css";
//import "./style.css";
import App from "./App.vue";
import router from "./router";

//import * as bootstrap from 'bootstrap/dist/js/bootstrap.bundle'
import * as bootstrap from "bootstrap";

createApp(App).use(router).provide("bootstrap", bootstrap).mount("#app");
