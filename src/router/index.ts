import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
    { path: '/', name: 'home', component: () => import('../views/RequestMonitor.vue'), meta: { title: '数据概览', icon: 'signal' } },
    { path: '/accounts', name: 'accounts', component: () => import('../views/AccountManager.vue'), meta: { title: '账号管理', icon: 'users' } },
    { path: '/articles', name: 'articles', component: () => import('../views/ArticleView.vue'), meta: { title: '文章数据', icon: 'file-text' } },
    { path: '/help', name: 'help', component: () => import('../views/HelpGuide.vue'), meta: { title: '使用帮助', icon: 'help' } },
    { path: '/settings', name: 'settings', component: () => import('../views/Settings.vue'), meta: { title: '关于产品', icon: 'settings' } },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router

