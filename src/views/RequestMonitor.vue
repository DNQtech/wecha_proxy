<template>
  <div class="page-requests">
    <!-- 顶栏 -->
    <div class="page-header">
      <div class="page-header__left">
        <h1 class="page-title">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--c-accent)" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          请求监控
        </h1>
        <span class="page-badge">{{ requestStore.total }} 条记录</span>
      </div>
      <div class="page-header__right">
        <div class="search-box">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input class="input" v-model="requestStore.search" @input="handleSearch" placeholder="搜索 URL、域名..." />
        </div>
        <button class="btn btn-ghost btn-sm" @click="refreshAll">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
          刷新
        </button>
        <button class="btn btn-danger btn-sm" @click="handleClear">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          清空
        </button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card card">
        <div class="stat-card__icon" style="background: rgba(108, 92, 231, 0.12);">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--c-primary-light)" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        </div>
        <div>
          <p class="stat-card__value">{{ stats.total_requests ?? 0 }}</p>
          <p class="stat-card__label">总请求数</p>
        </div>
      </div>
      <div class="stat-card card">
        <div class="stat-card__icon" style="background: rgba(0, 206, 201, 0.12);">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--c-accent)" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
        <div>
          <p class="stat-card__value">{{ stats.unique_hosts ?? 0 }}</p>
          <p class="stat-card__label">不同域名</p>
        </div>
      </div>
      <div class="stat-card card">
        <div class="stat-card__icon" style="background: rgba(0, 184, 148, 0.12);">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--c-success)" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        </div>
        <div>
          <p class="stat-card__value">{{ stats.success_rate ?? '—' }}%</p>
          <p class="stat-card__label">成功率</p>
        </div>
      </div>
      <div class="stat-card card">
        <div class="stat-card__icon" style="background: rgba(253, 203, 110, 0.12);">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--c-warning)" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
        </div>
        <div>
          <p class="stat-card__value">{{ stats.avg_duration ? stats.avg_duration.toFixed(0) + 'ms' : '—' }}</p>
          <p class="stat-card__label">平均耗时</p>
        </div>
      </div>
    </div>

    <!-- 图表区 -->
    <div class="charts-grid">
      <div class="chart-card card">
        <h3>域名 Top 3</h3>
        <div class="chart-list">
          <div v-for="(item, i) in (stats.top_hosts ?? []).slice(0, 3)" :key="i" class="chart-bar-item">
            <span class="chart-bar-label">{{ item.host }}</span>
            <div class="chart-bar-track">
              <div class="chart-bar-fill" :style="{ width: barWidth(item.count, stats.top_hosts) }" />
            </div>
            <span class="chart-bar-value">{{ item.count }}</span>
          </div>
        </div>
      </div>
      <div class="chart-card card">
        <h3>请求方法分布</h3>
        <div class="method-dist">
          <div v-for="m in (stats.methods ?? [])" :key="m.method" class="method-item">
            <span class="method-badge" :class="'method-' + m.method">{{ m.method }}</span>
            <div class="chart-bar-track" style="flex:1">
              <div class="chart-bar-fill" :style="{ width: barWidth(m.count, stats.methods) }" />
            </div>
            <span class="chart-bar-value">{{ m.count }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 请求表格 -->
    <div class="table-wrapper card">
      <table class="data-table" v-if="requestStore.records.length">
        <thead>
          <tr>
            <th style="width:60px">方法</th>
            <th style="width:80px">状态</th>
            <th>URL</th>
            <th style="width:140px">域名</th>
            <th style="width:80px">类型</th>
            <th style="width:70px">大小</th>
            <th style="width:70px">耗时</th>
            <th style="width:90px">时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in requestStore.records" :key="r.id" @click="requestStore.fetchDetail(r.id)" :class="{ 'is-new': (r as any)._isNew }">
            <td><span class="method-badge" :class="'method-' + r.method">{{ r.method }}</span></td>
            <td><span :class="statusClass(r.status_code)">{{ r.status_code ?? '—' }}</span></td>
            <td class="cell-url" :title="r.url">{{ r.path || r.url }}</td>
            <td>{{ r.host }}</td>
            <td>{{ simplifyType(r.response_content_type) }}</td>
            <td>{{ formatSize(r.response_size) }}</td>
            <td>{{ r.duration_ms ? r.duration_ms.toFixed(0) + 'ms' : '—' }}</td>
            <td>{{ formatTime(r.timestamp) }}</td>
          </tr>
        </tbody>
      </table>
      <div v-else class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        <p>暂无请求数据</p>
        <p style="font-size:12px">请先启动代理服务并打开微信</p>
      </div>
    </div>

    <!-- 请求详情侧滑面板 -->
    <transition name="slide">
      <div v-if="requestStore.detailVisible && requestStore.currentDetail" class="detail-panel glass">
        <div class="detail-panel__header">
          <h2>请求详情</h2>
          <button class="btn btn-icon btn-ghost" @click="requestStore.detailVisible = false">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="detail-panel__body">
          <div class="detail-section">
            <div class="detail-meta">
              <span class="method-badge" :class="'method-' + requestStore.currentDetail.method">{{ requestStore.currentDetail.method }}</span>
              <span :class="statusClass(requestStore.currentDetail.status_code)">{{ requestStore.currentDetail.status_code }}</span>
              <span>{{ requestStore.currentDetail.duration_ms?.toFixed(0) }}ms</span>
            </div>
            <p class="detail-url">{{ requestStore.currentDetail.url }}</p>
          </div>

          <details class="detail-section" open>
            <summary>请求头</summary>
            <pre class="detail-code">{{ formatHeaders(requestStore.currentDetail.request_headers) }}</pre>
          </details>

          <details class="detail-section" v-if="requestStore.currentDetail.request_body">
            <summary>请求体</summary>
            <pre class="detail-code">{{ requestStore.currentDetail.request_body }}</pre>
          </details>

          <details class="detail-section" open>
            <summary>响应头</summary>
            <pre class="detail-code">{{ formatHeaders(requestStore.currentDetail.response_headers) }}</pre>
          </details>

          <details class="detail-section" v-if="requestStore.currentDetail.response_body">
            <summary>响应体</summary>
            <pre class="detail-code">{{ requestStore.currentDetail.response_body }}</pre>
          </details>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRequestStore } from '../stores/requestStore'
import { useAppStore } from '../stores/appStore'
import { showConfirm } from '../utils/dialog'

const requestStore = useRequestStore()
const app = useAppStore()
const stats = ref<any>({})

async function fetchStats() {
  try {
    const resp = await fetch(`${app.apiBase}/api/stats`)
    const raw = await resp.json()
    // 映射后端字段到前端展示字段
    const hosts = raw.hosts ?? []
    const methods = raw.methods ?? []
    const statusCodes = raw.status_codes ?? []
    const total = raw.total ?? 0
    const successCount = statusCodes
      .filter((s: any) => s.code >= 200 && s.code < 400)
      .reduce((sum: number, s: any) => sum + s.count, 0)
    stats.value = {
      total_requests: total,
      unique_hosts: hosts.length,
      success_rate: total > 0 ? Math.round((successCount / total) * 100) : 0,
      avg_duration: raw.avg_duration ?? null,
      top_hosts: hosts.slice(0, 10),
      methods: methods,
    }
  } catch (e) { console.error(e) }
}

function barWidth(count: number, items: any[]) {
  const max = Math.max(...(items?.map((i: any) => i.count) ?? [1]))
  return Math.round((count / max) * 100) + '%'
}

function refreshAll() {
  requestStore.fetchRequests()
  fetchStats()
}

let searchTimer: any = null
function handleSearch() {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => requestStore.fetchRequests(), 300)
}
async function handleClear() {
  const confirmed = await showConfirm('确定清空所有请求记录？')
  if (confirmed) {
    requestStore.clearRequests()
    fetchStats()
  }
}
function statusClass(code: number | null) {
  if (!code) return ''
  if (code < 300) return 'status-2xx'
  if (code < 400) return 'status-3xx'
  if (code < 500) return 'status-4xx'
  return 'status-5xx'
}
function simplifyType(ct: string) {
  if (!ct) return '—'
  if (ct.includes('json')) return 'JSON'
  if (ct.includes('html')) return 'HTML'
  if (ct.includes('xml')) return 'XML'
  if (ct.includes('javascript')) return 'JS'
  if (ct.includes('css')) return 'CSS'
  if (ct.includes('image')) return 'IMG'
  return ct.split('/').pop()?.split(';')[0] ?? ct
}
function formatSize(bytes: number) {
  if (!bytes) return '—'
  if (bytes < 1024) return bytes + 'B'
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + 'KB'
  return (bytes / 1048576).toFixed(1) + 'MB'
}
function formatTime(ts: number) {
  if (!ts) return ''
  const d = new Date(ts * 1000)
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`
}
function formatHeaders(raw: string) {
  try {
    const obj = JSON.parse(raw)
    return Object.entries(obj).map(([k, v]) => `${k}: ${v}`).join('\n')
  } catch { return raw || '—' }
}

onMounted(() => {
  requestStore.fetchRequests()
  fetchStats()
})
</script>

<style scoped>
.page-requests { position: relative; height: 100%; display: flex; flex-direction: column; gap: 16px; }
.page-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
.page-header__left { display: flex; align-items: center; gap: 12px; }
.page-header__right { display: flex; align-items: center; gap: 8px; }
.page-title { display: flex; align-items: center; gap: 8px; font-size: 18px; font-weight: 700; }
.page-badge {
  padding: 3px 10px; border-radius: var(--radius-full); font-size: 11px;
  background: rgba(108, 92, 231, 0.12); color: var(--c-primary-light); font-weight: 600;
}
.search-box {
  display: flex; align-items: center; gap: 8px;
  background: var(--bg-input); border: 1px solid var(--border-default);
  border-radius: var(--radius-sm); padding: 0 12px;
  color: var(--text-muted);
}
.search-box .input { border: none; background: transparent; padding: 7px 0; width: 200px; }
.search-box .input:focus { box-shadow: none; }

/* 统计卡片 */
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; }
.stat-card { display: flex; align-items: center; gap: 14px; padding: 18px 20px; }
.stat-card__icon {
  width: 44px; height: 44px; border-radius: var(--radius-md);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.stat-card__value { font-size: 22px; font-weight: 700; font-family: var(--font-mono); }
.stat-card__label { font-size: 12px; color: var(--text-muted); margin-top: 2px; }

/* 图表区 */
.charts-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
@media (max-width: 800px) { .charts-grid { grid-template-columns: 1fr; } }
.chart-card { padding: 20px; }
.chart-card h3 { font-size: 14px; font-weight: 600; margin-bottom: 16px; }
.chart-list, .method-dist { display: flex; flex-direction: column; gap: 10px; }
.chart-bar-item, .method-item { display: flex; align-items: center; gap: 10px; }
.chart-bar-label { font-size: 12px; color: var(--text-secondary); width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.chart-bar-track { flex: 1; height: 6px; background: var(--bg-input); border-radius: var(--radius-full); overflow: hidden; }
.chart-bar-fill {
  height: 100%; border-radius: var(--radius-full);
  background: linear-gradient(90deg, var(--c-primary), var(--c-accent));
  transition: width var(--duration-slow) var(--ease-out);
}
.chart-bar-value { font-size: 12px; font-family: var(--font-mono); color: var(--text-muted); min-width: 36px; text-align: right; }

/* 请求表格 */
.table-wrapper { flex: 1; overflow: auto; }
.cell-url { font-family: var(--font-mono); font-size: 12px; color: var(--text-primary) !important; }

/* 详情面板 */
.detail-panel {
  position: fixed; right: 0; top: var(--titlebar-height); bottom: 0;
  width: 520px; z-index: 80; display: flex; flex-direction: column;
  box-shadow: var(--shadow-lg); border-left: 1px solid var(--border-default);
}
.detail-panel__header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 20px; border-bottom: 1px solid var(--border-subtle);
}
.detail-panel__header h2 { font-size: 15px; font-weight: 600; }
.detail-panel__body { flex: 1; overflow-y: auto; padding: 16px 20px; }
.detail-section { margin-bottom: 16px; }
.detail-section summary {
  font-size: 12px; font-weight: 600; color: var(--text-muted);
  text-transform: uppercase; letter-spacing: 0.8px; cursor: pointer;
  padding: 6px 0; user-select: none;
}
.detail-meta { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; font-size: 13px; }
.detail-url {
  font-family: var(--font-mono); font-size: 12px;
  word-break: break-all; color: var(--c-primary-light);
  background: var(--bg-input); padding: 8px 12px;
  border-radius: var(--radius-sm);
}
.detail-code {
  background: var(--bg-input); padding: 12px;
  border-radius: var(--radius-sm); font-size: 11px;
  font-family: var(--font-mono); color: var(--text-secondary);
  white-space: pre-wrap; word-break: break-all;
  max-height: 300px; overflow-y: auto; margin-top: 8px;
}
</style>
