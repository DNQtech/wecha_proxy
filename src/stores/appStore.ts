import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/** 全局应用状态 */
export const useAppStore = defineStore('app', () => {
    const sidebarCollapsed = ref(false)
    const theme = ref<'dark' | 'light'>('dark')

    function toggleSidebar() { sidebarCollapsed.value = !sidebarCollapsed.value }
    function setTheme(t: 'dark' | 'light') { theme.value = t; document.documentElement.setAttribute('data-theme', t) }

    return { sidebarCollapsed, theme, toggleSidebar, setTheme }
})
