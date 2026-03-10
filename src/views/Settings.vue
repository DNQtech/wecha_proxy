<template>
  <div class="page-settings">
    <h1 class="page-title">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--c-accent)" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68 1.65 1.65 0 0 0 10 3.17V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
      设置
    </h1>

    <div class="settings-sections">
      <!-- 界面设置 -->
      <section class="settings-section card">
        <h2 class="section-title">界面设置</h2>
        
        <div class="setting-row">
          <div class="setting-info">
            <label>主题模式</label>
            <p>选择界面的主题风格</p>
          </div>
          <div class="setting-control">
            <select v-model="currentTheme" @change="changeTheme" class="form-select">
              <option value="dark">暗色主题</option>
              <option value="light">亮色主题</option>
            </select>
          </div>
        </div>
      </section>

      <!-- 产品介绍 -->
      <section class="settings-section card">
        <h2 class="section-title">产品介绍</h2>
        
        <div class="product-intro">
          <div class="intro-item">
            <div class="intro-icon">📊</div>
            <div class="intro-content">
              <h3>专业数据分析</h3>
              <p>深度挖掘公众号数据价值，提供全方位的数据分析和洞察</p>
            </div>
          </div>
          
          <div class="intro-item">
            <div class="intro-icon">⚡</div>
            <div class="intro-content">
              <h3>高效批量处理</h3>
              <p>支持多账号批量管理，大幅提升数据收集和分析效率</p>
            </div>
          </div>
          
          <div class="intro-item">
            <div class="intro-icon">🔒</div>
            <div class="intro-content">
              <h3>安全可靠</h3>
              <p>本地数据存储，隐私安全有保障，支持数据导出和备份</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 功能特色 -->
      <section class="settings-section card">
        <h2 class="section-title">核心功能</h2>
        
        <div class="feature-grid">
          <div class="feature-card">
            <div class="feature-icon">📱</div>
            <h4>账号管理</h4>
            <p>智能绑定多个公众号，统一管理，实时监控状态</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">📈</div>
            <h4>数据采集</h4>
            <p>自动采集文章数据，包括阅读量、点赞数、分享数等</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">📊</div>
            <h4>可视化分析</h4>
            <p>丰富的图表展示，多维度数据分析，趋势一目了然</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">📤</div>
            <h4>数据导出</h4>
            <p>支持Excel导出，方便进一步分析和报告制作</p>
          </div>
        </div>
      </section>

      <!-- 获取完整版 -->
      <section class="settings-section card">
        <h2 class="section-title">获取完整版</h2>
        
        <div class="download-notice">
          <div class="download-content">
            <h3>🎉 体验满意？立即获取完整版！</h3>
            <p>当前为在线展示版本，完整版提供真实的数据采集和分析功能。</p>
            
            <div class="download-features">
              <div class="download-feature">
                <span class="feature-check">✅</span>
                <span>真实数据采集</span>
              </div>
              <div class="download-feature">
                <span class="feature-check">✅</span>
                <span>本地数据存储</span>
              </div>
              <div class="download-feature">
                <span class="feature-check">✅</span>
                <span>批量处理功能</span>
              </div>
              <div class="download-feature">
                <span class="feature-check">✅</span>
                <span>专业技术支持</span>
              </div>
            </div>
            
            <div class="download-actions">
              <button class="btn btn-primary btn-lg">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7,10 12,15 17,10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                立即下载完整版
              </button>
              <button class="btn btn-outline btn-lg">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                联系客服
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAppStore } from '../stores/appStore'

const appStore = useAppStore()
const currentTheme = ref(appStore.theme)

function changeTheme() {
  appStore.setTheme(currentTheme.value)
}

onMounted(() => {
  // 初始化主题
  document.documentElement.setAttribute('data-theme', appStore.theme)
})
</script>

<style scoped>
.page-settings {
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
}

.page-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 32px;
  color: var(--c-text-primary);
}

.settings-sections {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.settings-section {
  background: var(--c-bg-secondary);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid var(--c-border);
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  color: var(--c-text-primary);
}

.setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid var(--c-border);
}

.setting-row:last-child {
  border-bottom: none;
}

.setting-info {
  flex: 1;
}

.setting-info label {
  display: block;
  font-weight: 500;
  color: var(--c-text-primary);
  margin-bottom: 4px;
}

.setting-info p {
  color: var(--c-text-secondary);
  font-size: 14px;
  margin: 0;
}

.setting-control {
  display: flex;
  align-items: center;
  gap: 12px;
}

.form-select {
  padding: 8px 12px;
  border: 1px solid var(--c-border);
  border-radius: 6px;
  background: var(--c-bg-primary);
  color: var(--c-text-primary);
  font-size: 14px;
  min-width: 120px;
}

.form-select:focus {
  outline: none;
  border-color: var(--c-accent);
}

.version-info {
  font-family: 'Courier New', monospace;
  color: var(--c-text-secondary);
  font-size: 14px;
}

.tech-stack {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tech-item {
  background: var(--c-accent);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.product-intro {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.intro-item {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.intro-icon {
  font-size: 24px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--c-accent-bg);
  border-radius: 8px;
  flex-shrink: 0;
}

.intro-content h3 {
  margin: 0 0 8px 0;
  color: var(--c-text-primary);
  font-size: 16px;
  font-weight: 600;
}

.intro-content p {
  margin: 0;
  color: var(--c-text-secondary);
  font-size: 14px;
  line-height: 1.5;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.feature-card {
  padding: 20px;
  background: var(--c-bg-primary);
  border: 1px solid var(--c-border);
  border-radius: 8px;
  text-align: center;
}

.feature-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.feature-card h4 {
  margin: 0 0 8px 0;
  color: var(--c-text-primary);
  font-size: 16px;
  font-weight: 600;
}

.feature-card p {
  margin: 0;
  color: var(--c-text-secondary);
  font-size: 14px;
  line-height: 1.5;
}

.download-notice {
  background: linear-gradient(135deg, var(--c-accent-bg) 0%, var(--c-success-bg) 100%);
  border: 1px solid var(--c-accent);
  border-radius: 12px;
  padding: 24px;
}

.download-content h3 {
  margin: 0 0 12px 0;
  color: var(--c-accent);
  font-size: 18px;
  font-weight: 600;
}

.download-content > p {
  margin: 0 0 20px 0;
  color: var(--c-text-secondary);
  font-size: 14px;
  line-height: 1.5;
}

.download-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
  margin-bottom: 24px;
}

.download-feature {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--c-text-primary);
}

.feature-check {
  color: var(--c-success);
  font-weight: 600;
}

.download-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  text-decoration: none;
}

.btn-lg {
  padding: 14px 28px;
  font-size: 16px;
}

.btn-primary {
  background: var(--c-accent);
  color: white;
}

.btn-primary:hover {
  background: var(--c-accent-hover);
  transform: translateY(-1px);
}

.btn-outline {
  background: transparent;
  color: var(--c-accent);
  border: 2px solid var(--c-accent);
}

.btn-outline:hover {
  background: var(--c-accent);
  color: white;
  transform: translateY(-1px);
}

.demo-notice {
  display: flex;
  gap: 16px;
  padding: 20px;
  background: var(--c-info-bg);
  border: 1px solid var(--c-info);
  border-radius: 8px;
}

.notice-content h3 {
  margin: 0 0 8px 0;
  color: var(--c-info);
  font-size: 16px;
  font-weight: 600;
}

.notice-content p {
  margin: 0 0 8px 0;
  color: var(--c-text-secondary);
  font-size: 14px;
  line-height: 1.5;
}

.notice-content p:last-child {
  margin-bottom: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-settings {
    padding: 16px;
  }
  
  .setting-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .setting-control {
    width: 100%;
    justify-content: flex-end;
  }
  
  .demo-notice {
    flex-direction: column;
    gap: 12px;
  }
}
</style>