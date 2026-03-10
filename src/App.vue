<template>
  <div class="app-shell" :class="{ collapsed: app.sidebarCollapsed }">
    <!-- ===== 自定义标题栏 ===== -->
    <header class="titlebar">
      <div class="titlebar__left">
        <div class="titlebar__logo">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--c-accent)" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
          <span class="titlebar__title">微信公众号数据助手 - 在线体验版</span>
        </div>
      </div>
      <div class="titlebar__center">
        <div class="status-indicator active">
          <span class="status-dot" />
          <span>演示模式</span>
        </div>
      </div>
    </header>

    <!-- ===== 侧边栏 ===== -->
    <aside class="sidebar glass">
      <button class="sidebar__toggle" @click="app.toggleSidebar">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>

      <nav class="sidebar__nav">
        <router-link v-for="item in navItems" :key="item.path" :to="item.path" class="sidebar__item" active-class="sidebar__item--active">
          <span class="sidebar__icon" v-html="item.icon" />
          <span class="sidebar__label">{{ item.label }}</span>
        </router-link>
      </nav>

      <div class="sidebar__bottom">
        <!-- 联系我们二维码 -->
        <div class="sidebar__qrcode">
          <div class="qrcode-container">
            <img :src="contactQrCode" alt="联系我们" class="qrcode-image" />
            <div class="qrcode-label">联系我们</div>
          </div>
        </div>
        
        <button class="sidebar__item" @click="toggleTheme">
          <span class="sidebar__icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          </span>
          <span class="sidebar__label">切换主题</span>
        </button>
      </div>
    </aside>

    <!-- ===== 主内容区 ===== -->
    <main class="content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAppStore } from './stores/appStore'
import contactQrCode from './assets/contact_me_qr.png'

const app = useAppStore()

const navItems = [
  { path: '/', label: '数据概览', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>' },
  { path: '/accounts', label: '账号管理', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>' },
  { path: '/articles', label: '文章数据', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>' },
  { path: '/help', label: '使用帮助', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>' },
  { path: '/settings', label: '关于产品', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68 1.65 1.65 0 0 0 10 3.17V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>' },
]

function toggleTheme() { app.setTheme(app.theme === 'dark' ? 'light' : 'dark') }

onMounted(() => {
  // 设置默认主题
  document.documentElement.setAttribute('data-theme', app.theme)
})
</script>

<style scoped>
/* ===== 全局布局 ===== */
.app-shell {
  display: grid;
  grid-template-columns: var(--sidebar-width) 1fr;
  grid-template-rows: var(--titlebar-height) 1fr;
  grid-template-areas: "titlebar titlebar" "sidebar content";
  height: 100vh;
  transition: grid-template-columns var(--duration-slow) var(--ease-out);
}
.app-shell.collapsed {
  grid-template-columns: var(--sidebar-collapsed) 1fr;
}

/* ===== 标题栏 ===== */
.titlebar {
  grid-area: titlebar;
  position: relative;
  background: var(--bg-titlebar);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-subtle);
  z-index: 100;
  padding: 0 16px;
  user-select: none;
}

.titlebar__left { display: flex; align-items: center; }
.titlebar__logo { display: flex; align-items: center; gap: 8px; }
.titlebar__title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: 0.5px;
}
.titlebar__center { flex: 1; display: flex; justify-content: center; }

.status-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text-muted);
}
.status-indicator.active { color: var(--c-accent); }
.status-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: var(--text-muted);
}
.status-indicator.active .status-dot {
  background: var(--c-accent);
  animation: glow 2s ease-in-out infinite;
}

@keyframes glow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* ===== 侧边栏 ===== */
.sidebar {
  grid-area: sidebar;
  display: flex;
  flex-direction: column;
  padding: 8px;
  gap: 2px;
  overflow: hidden;
  z-index: 50;
  border-right: 1px solid var(--border-subtle);
}
.sidebar__toggle {
  display: flex; align-items: center; justify-content: center;
  padding: 10px;
  background: transparent; border: none;
  color: var(--text-secondary);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--duration-fast);
  margin-bottom: 8px;
}
.sidebar__toggle:hover { background: var(--bg-glass-hover); color: var(--text-primary); }
.sidebar__nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.sidebar__item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
  transition: all var(--duration-fast) var(--ease-out);
  cursor: pointer;
  border: none;
  background: transparent;
  width: 100%;
  text-align: left;
  font-family: var(--font-sans);
  white-space: nowrap;
  overflow: hidden;
}
.sidebar__item:hover { background: var(--bg-glass-hover); color: var(--text-primary); }
.sidebar__item--active {
  background: linear-gradient(135deg, rgba(108, 92, 231, 0.15), rgba(0, 206, 201, 0.08));
  color: var(--c-primary-light);
  box-shadow: inset 3px 0 0 var(--c-primary);
}
.sidebar__icon { display: flex; align-items: center; flex-shrink: 0; }
.sidebar__label {
  transition: opacity var(--duration-normal);
}
.collapsed .sidebar__label { opacity: 0; width: 0; }
.sidebar__bottom {
  border-top: 1px solid var(--border-subtle);
  padding-top: 8px;
}

/* 侧边栏二维码 */
.sidebar__qrcode {
  padding: 12px 16px 16px;
  display: flex;
  justify-content: center;
}
.qrcode-container {
  position: relative;
  padding: 8px;
  background: linear-gradient(135deg, rgba(108, 92, 231, 0.1), rgba(0, 206, 201, 0.1));
  border-radius: var(--radius-md);
  border: 1px solid var(--border-default);
  transition: all var(--duration-normal);
  cursor: pointer;
}
.qrcode-container:hover {
  border-color: var(--c-primary);
  box-shadow: 0 4px 12px rgba(108, 92, 231, 0.2);
  transform: translateY(-2px);
}
.qrcode-image {
  display: block;
  width: 100px;
  height: 100px;
  border-radius: var(--radius-sm);
  background: #fff;
}
.qrcode-label {
  text-align: center;
  margin-top: 6px;
  font-size: 11px;
  font-weight: 500;
  color: var(--c-primary-light);
}
.collapsed .sidebar__qrcode {
  padding: 8px;
}
.collapsed .qrcode-image {
  width: 40px;
  height: 40px;
}
.collapsed .qrcode-label {
  display: none;
}

/* ===== 主内容区 ===== */
.content {
  grid-area: content;
  overflow-y: auto;
  padding: 20px;
  background: var(--bg-root);
}

/* ===== 页面切换动画 ===== */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>