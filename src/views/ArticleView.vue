<template>
  <div class="page-articles">
    <!-- 顶部工具栏 -->
    <div class="page-header">
      <div class="page-header__left">
        <h1 class="page-title">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--c-accent)" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          文章数据
        </h1>
        <span class="page-badge">{{ accountStore.articleTotal }} 篇</span>
      </div>
      <div class="page-header__right">
        <!-- 公众号筛选 -->
        <select class="input" style="width:180px" v-model="accountStore.articleBiz" @change="reload">
          <option value="">全部公众号</option>
          <option v-for="a in accountStore.accounts" :key="a.biz" :value="a.biz">{{ a.nickname || a.biz }}</option>
        </select>

        <!-- 批量操作 -->
        <template v-if="selected.size > 0">
          <span class="badge-select">已选 {{ selected.size }} 篇</span>
          <button class="btn btn-danger btn-sm" @click="batchDelete">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
            删除所选
          </button>
          <button class="btn btn-ghost btn-sm" @click="selected.clear()">取消</button>
        </template>
        <button class="btn btn-ghost btn-sm" @click="toggleSelectAll" v-else-if="accountStore.articles.length">
          {{ allSelected ? '取消全选' : '全选' }}
        </button>

        <!-- 导出 -->
        <button class="btn btn-primary btn-sm" @click="handleExport">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          导出 Excel
        </button>
        <!-- 推送 -->
        <button class="btn btn-ghost btn-sm" @click="openPushModal">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          推送数据
        </button>
      </div>
    </div>

    <!-- 表格 -->
    <div class="table-wrapper card">
      <table class="data-table" v-if="accountStore.articles.length">
        <thead>
          <tr>
            <th style="width:36px"><input type="checkbox" :checked="allSelected" @change="toggleSelectAll" /></th>
            <th>标题</th>
            <th style="width:88px">作者</th>
            <th style="width:72px;cursor:pointer" @click="setSort('read_num')">
              阅读 <span class="sort-icon">{{ sortField === 'read_num' ? (sortDesc ? '↓' : '↑') : '↕' }}</span>
            </th>
            <th style="width:72px;cursor:pointer" @click="setSort('like_count')">
              点赞 <span class="sort-icon">{{ sortField === 'like_count' ? (sortDesc ? '↓' : '↑') : '↕' }}</span>
            </th>
            <th style="width:68px;cursor:pointer" @click="setSort('old_like_count')">
              在看 <span class="sort-icon">{{ sortField === 'old_like_count' ? (sortDesc ? '↓' : '↑') : '↕' }}</span>
            </th>
            <th style="width:72px;cursor:pointer" @click="setSort('share_count')">
              分享 <span class="sort-icon">{{ sortField === 'share_count' ? (sortDesc ? '↓' : '↑') : '↕' }}</span>
            </th>
            <th style="width:100px;cursor:pointer" @click="setSort('publish_time')">
              发布时间 <span class="sort-icon">{{ sortField === 'publish_time' ? (sortDesc ? '↓' : '↑') : '↕' }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="a in sortedArticles" :key="a.id" :class="{ selected: selected.has(a.id) }">
            <td @click.stop><input type="checkbox" :checked="selected.has(a.id)" @change="toggleSelect(a.id)" /></td>
            <td class="cell-title" @click="openArticle(a.url)">
              <img v-if="a.cover_url"
                :src="coverProxy(a.cover_url)"
                class="article-cover"
                @error="(e:any) => e.target.style.display='none'" />
              <div>
                <p class="article-title">{{ a.title }}</p>
                <p class="article-digest">{{ a.digest }}</p>
              </div>
            </td>
            <td>{{ a.author }}</td>
            <td><span class="stat-num">{{ formatNum(a.read_num) }}</span></td>
            <td><span class="stat-num">{{ formatNum(a.like_count) }}</span></td>
            <td><span class="stat-num">{{ formatNum((a as any).old_like_count) }}</span></td>
            <td><span class="stat-num">{{ formatNum((a as any).share_count) }}</span></td>
            <td>{{ formatDate(a.publish_time) }}</td>
          </tr>
        </tbody>
      </table>
      <div v-else class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        <p>暂无文章数据</p>
        <p style="font-size:12px">请先在公众号管理中采集文章</p>
      </div>
    </div>

    <!-- 推送弹窗 -->
    <div class="modal-overlay" v-if="pushModal.show" @click.self="pushModal.show = false">
      <div class="push-modal card">
        <div class="modal-header">
          <h3>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--c-accent)" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            推送数据到接口
          </h3>
          <button class="btn-close" @click="pushModal.show = false">✕</button>
        </div>
        <div class="modal-body">
          <!-- 接口地址 -->
          <div class="form-group">
            <label>接口地址 <span class="label-required">*</span></label>
            <input class="input" v-model="pushModal.url"
              placeholder="https://your-api.com/receive" />
            <p class="form-hint">数据将以 POST + JSON 方式推送到此地址</p>
          </div>

          <!-- 推送字段选择 -->
          <div class="form-group">
            <label>推送字段</label>
            <div class="field-grid">
              <label v-for="f in pushFields" :key="f.key" class="field-check" :class="{ disabled: f.required }">
                <input type="checkbox" v-model="f.checked" :disabled="f.required" />
                <span class="field-name">{{ f.label }}</span>
                <code class="field-key">{{ f.key }}</code>
              </label>
            </div>
          </div>

          <!-- 数据格式文档 -->
          <div class="form-group">
            <label>接入文档 <span class="label-hint">（开发者参考）</span></label>
            <div class="api-doc">
              <div class="doc-line"><span class="doc-method">POST</span> <span class="doc-url">{{ pushModal.url || 'https://your-api.com/receive' }}</span></div>
              <div class="doc-section">Content-Type: application/json</div>
              <pre class="doc-body">{{ previewJson }}</pre>
            </div>
          </div>

          <!-- 推送结果 -->
          <div v-if="pushModal.result" class="push-result" :class="pushModal.resultType">
            {{ pushModal.result }}
          </div>
        </div>
        <div class="modal-footer">
          <span class="push-count">将推送 {{ accountStore.articleTotal }} 篇文章</span>
          <button class="btn btn-ghost" @click="pushModal.show = false">取消</button>
          <button class="btn btn-primary" @click="doPush" :disabled="pushModal.pushing || !pushModal.url">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            {{ pushModal.pushing ? '推送中...' : '立即推送' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useAccountStore } from '../stores/accountStore'
import { useAppStore } from '../stores/appStore'
import { showConfirm, showSuccess, showError } from '../utils/dialog'

const accountStore = useAccountStore()
const app = useAppStore()
const api = (window as any).electronAPI

// 多选
const selected = ref<Set<number>>(new Set())
const allSelected = computed(() =>
  accountStore.articles.length > 0 && accountStore.articles.every(a => selected.value.has(a.id))
)
function toggleSelect(id: number) {
  const s = new Set(selected.value)
  s.has(id) ? s.delete(id) : s.add(id)
  selected.value = s
}
function toggleSelectAll() {
  if (allSelected.value) { selected.value = new Set() }
  else { selected.value = new Set(accountStore.articles.map(a => a.id)) }
}

// 排序
const sortField = ref<string>('publish_time')
const sortDesc = ref(true)
function setSort(field: string) {
  if (sortField.value === field) sortDesc.value = !sortDesc.value
  else { sortField.value = field; sortDesc.value = true }
}
const sortedArticles = computed(() => {
  const arr = [...accountStore.articles]
  return arr.sort((a: any, b: any) => {
    const av = a[sortField.value] ?? 0
    const bv = b[sortField.value] ?? 0
    return sortDesc.value ? bv - av : av - bv
  })
})

function coverProxy(url: string) {
  if (!url) return ''
  return `${app.apiBase}/api/proxy/image?url=${encodeURIComponent(url)}`
}

// 批量删除
async function batchDelete() {
  const ids = [...selected.value]
  if (!ids.length) return
  const confirmed = await showConfirm(`确定删除选中的 ${ids.length} 篇文章？`)
  if (!confirmed) return
  try {
    await fetch(`${app.apiBase}/api/articles/batch-delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    })
    selected.value = new Set()
    accountStore.fetchArticles()
  } catch (e) { console.error(e) }
}

function reload() {
  selected.value = new Set()
  accountStore.fetchArticles()
}

async function handleExport() {
  // 生成带时间戳的默认文件名，避免覆盖
  const now = new Date()
  const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`
  const defaultFileName = `wechat_articles_${timestamp}.xlsx`
  
  const result = await api?.saveFileDialog({
    title: '导出文章数据',
    defaultPath: defaultFileName,
    filters: [{ name: 'Excel', extensions: ['xlsx'] }],
  })
  if (result?.canceled) return
  try {
    const resp = await fetch(`${app.apiBase}/api/articles/export`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: result.filePath, biz: accountStore.articleBiz }),
    })
    const data = await resp.json()
    if (resp.ok) await showSuccess(`导出成功！共 ${data.count} 篇文章`)
    else await showError(`导出失败: ${data.detail || '未知错误'}`)
  } catch (e) { console.error(e) }
}

// ========== 推送弹窗 ==========

const pushFields = reactive([
  { key: 'title',          label: '标题',   checked: true, required: true },
  { key: 'author',         label: '作者',   checked: true, required: false },
  { key: 'url',            label: '文章链接', checked: true, required: true },
  { key: 'cover_url',      label: '封面图',   checked: true, required: false },
  { key: 'digest',         label: '摘要',   checked: true, required: false },
  { key: 'publish_time',   label: '发布时间', checked: true, required: true },
  { key: 'read_num',       label: '阅读数',  checked: true, required: false },
  { key: 'like_count',     label: '点赞数',  checked: true, required: false },
  { key: 'old_like_count', label: '在看数',  checked: true, required: false },
  { key: 'share_count',    label: '分享数',  checked: true, required: false },
  { key: 'biz',            label: '公众号ID', checked: true, required: false },
])

const pushModal = reactive({
  show: false,
  url: '',
  pushing: false,
  result: '',
  resultType: '',
})

// 加载上次保存的 URL
async function loadSavedUrl() {
  try {
    const resp = await fetch(`${app.apiBase}/api/settings/webhook`)
    const data = await resp.json()
    if (data.url) pushModal.url = data.url
  } catch { /* ignore */ }
}

function openPushModal() {
  pushModal.show = true
  pushModal.result = ''
  pushModal.resultType = ''
  if (!pushModal.url) loadSavedUrl()
}

const previewJson = computed(() => {
  const selectedKeys = pushFields.filter(f => f.checked).map(f => f.key)
  const sampleArticle: Record<string, any> = {}
  for (const k of selectedKeys) {
    if (k === 'title') sampleArticle[k] = '文章标题示例'
    else if (k === 'author') sampleArticle[k] = '作者名'
    else if (k === 'url') sampleArticle[k] = 'https://mp.weixin.qq.com/s/...'
    else if (k === 'cover_url') sampleArticle[k] = 'https://mmbiz.qpic.cn/...'
    else if (k === 'digest') sampleArticle[k] = '文章摘要...'
    else if (k === 'publish_time') sampleArticle[k] = 1709884800
    else if (k === 'biz') sampleArticle[k] = 'MzYz...'
    else sampleArticle[k] = 1234
  }
  return JSON.stringify({
    source: 'wechat_proxy',
    total: 'N',
    fields: selectedKeys,
    articles: [sampleArticle, '...']
  }, null, 2)
})

async function doPush() {
  pushModal.pushing = true
  pushModal.result = ''
  try {
    // 先保存 URL
    await fetch(`${app.apiBase}/api/settings/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: pushModal.url, enabled: true }),
    })

    const selectedKeys = pushFields.filter(f => f.checked).map(f => f.key)
    const resp = await fetch(`${app.apiBase}/api/webhook/push`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        biz: accountStore.articleBiz,
        fields: selectedKeys,
      }),
    })
    const result = await resp.json()
    if (resp.ok) {
      pushModal.result = `✅ 推送成功！共 ${result.pushed} 篇文章，服务器响应码 ${result.response_code}`
      pushModal.resultType = 'result-ok'
    } else {
      pushModal.result = `❌ ${result.detail || '推送失败'}`
      pushModal.resultType = 'result-err'
    }
  } catch (e: any) {
    pushModal.result = `❌ 推送失败: ${e.message}`
    pushModal.resultType = 'result-err'
  } finally { pushModal.pushing = false }
}

function openArticle(url: string) { if (url) api?.openExternal(url) }
function formatNum(n: number) {
  if (!n) return '0'
  if (n >= 100000) return (n / 10000).toFixed(1) + '万'
  return n.toLocaleString()
}
function formatDate(ts: number) {
  if (!ts) return '—'
  return new Date(ts * 1000).toLocaleDateString('zh-CN')
}

onMounted(() => {
  accountStore.fetchAccounts()
  accountStore.fetchArticles()
})
</script>

<style scoped>
.page-articles { display: flex; flex-direction: column; gap: 16px; height: 100%; }
.page-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
.page-header__left { display: flex; align-items: center; gap: 12px; }
.page-header__right { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.page-title { display: flex; align-items: center; gap: 8px; font-size: 18px; font-weight: 700; }
.page-badge { padding: 3px 10px; border-radius: var(--radius-full); font-size: 11px; background: rgba(0,206,201,0.12); color: var(--c-accent); font-weight: 600; }
.badge-select { font-size: 12px; color: var(--c-warning); font-weight: 600; }
.table-wrapper { flex: 1; overflow: auto; }
.cell-title { display: flex !important; align-items: center; gap: 12px; white-space: normal !important; cursor: pointer; }
.cell-title:hover .article-title { color: var(--c-accent); }
.article-cover { width: 48px; height: 32px; object-fit: cover; border-radius: 4px; flex-shrink: 0; background: var(--bg-input); }
.article-title { font-size: 13px; color: var(--text-primary); font-weight: 500; transition: color 0.15s; }
.article-digest { font-size: 11px; color: var(--text-muted); margin-top: 2px; overflow: hidden; text-overflow: ellipsis; -webkit-line-clamp: 1; display: -webkit-box; -webkit-box-orient: vertical; }
.stat-num { font-family: var(--font-mono); font-size: 12px; }
.sort-icon { font-size: 10px; opacity: 0.5; }
tr.selected { background: rgba(108, 92, 231, 0.08); }
.btn-danger { background: rgba(220, 53, 69, 0.15); color: #f87171; border: 1px solid rgba(220, 53, 69, 0.3); }
.btn-danger:hover { background: rgba(220, 53, 69, 0.25); }

/* 推送弹窗 */
.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,.55);
  display: flex; align-items: center; justify-content: center; z-index: 1000;
}
.push-modal {
  width: 560px; max-width: 95vw; max-height: 85vh; overflow-y: auto;
  padding: 0;
  animation: modalIn .2s cubic-bezier(.34,1.56,.64,1);
}
@keyframes modalIn { from { transform: scale(.92); opacity: 0; } to { transform: scale(1); opacity: 1; } }
.modal-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 20px; border-bottom: 1px solid var(--border-subtle);
}
.modal-header h3 { font-size: 15px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
.btn-close { background: none; border: none; color: var(--text-muted); font-size: 16px; cursor: pointer; padding: 0 4px; }
.modal-body { padding: 20px; display: flex; flex-direction: column; gap: 18px; }
.modal-footer {
  padding: 12px 20px; border-top: 1px solid var(--border-subtle);
  display: flex; align-items: center; gap: 8px;
}
.push-count { font-size: 12px; color: var(--text-muted); margin-right: auto; }

/* 表单 */
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group > label { font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 4px; }
.label-required { color: var(--c-danger, #f87171); }
.label-hint { font-weight: 400; color: var(--text-muted); font-size: 11px; }
.form-hint { font-size: 11px; color: var(--text-muted); }

/* 字段网格 */
.field-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
.field-check {
  display: flex; align-items: center; gap: 6px;
  padding: 6px 10px; border-radius: var(--radius-sm);
  background: var(--bg-input); font-size: 12px; cursor: pointer;
  transition: all 0.15s;
}
.field-check:hover { background: rgba(108, 92, 231, 0.08); }
.field-check.disabled { opacity: 0.7; cursor: default; }
.field-check input { accent-color: var(--c-primary); }
.field-name { color: var(--text-primary); font-weight: 500; }
.field-key { color: var(--c-accent); font-size: 10px; font-family: var(--font-mono); background: rgba(0,206,201,0.08); padding: 1px 5px; border-radius: 3px; margin-left: auto; }

/* API 文档 */
.api-doc {
  background: var(--bg-input); border-radius: var(--radius-sm);
  padding: 14px; font-family: var(--font-mono); font-size: 11px;
  border: 1px solid var(--border-subtle);
}
.doc-line { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
.doc-method {
  background: var(--c-primary); color: #fff; padding: 2px 8px;
  border-radius: 3px; font-size: 10px; font-weight: 700;
}
.doc-url { color: var(--c-accent); word-break: break-all; }
.doc-section { color: var(--text-muted); margin-bottom: 8px; }
.doc-body {
  background: rgba(0,0,0,.2); padding: 12px; border-radius: 4px;
  color: var(--text-secondary); white-space: pre-wrap; word-break: break-all;
  max-height: 180px; overflow-y: auto; margin: 0;
  line-height: 1.5;
}

/* 推送结果 */
.push-result { font-size: 13px; padding: 10px 14px; border-radius: var(--radius-sm); }
.result-ok { background: rgba(0,206,201,0.08); color: var(--c-accent); border-left: 3px solid var(--c-accent); }
.result-err { background: rgba(220,53,69,0.08); color: #f87171; border-left: 3px solid #f87171; }
</style>
