import routes from './routes.js';

// Create a reactive store for theme toggling
export const store = Vue.reactive({
  dark: JSON.parse(localStorage.getItem('dark')) || false,
  toggleDark() {
    this.dark = !this.dark;
    localStorage.setItem('dark', JSON.stringify(this.dark));
  },
});

const app = Vue.createApp({
  setup() {
    return { store };
  },
});

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes,
});

app.use(router);
app.mount('#app');
