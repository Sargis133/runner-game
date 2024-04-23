import Index from './pages/index.vue'
import {createRouter, createWebHistory} from "vue-router";

const router  =createRouter({
    routes: [
        {
            path: '/',
            name: 'index',
            component: Index,
        },
    ],
    history: createWebHistory()
})
export default router