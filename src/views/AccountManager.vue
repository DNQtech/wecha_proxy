<template>
  <div class="page-accounts">
    <div class="page-header">
      <div class="page-header__left">
        <h1 class="page-title">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--c-accent)" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
          公众号管理
        </h1>
        <span class="page-badge" v-if="accountStore.accounts.length">{{ accountStore.accounts.length }} 个</span>
      </div>
      <div class="page-header__right">
        <!-- 全选 -->
        <label class="select-all" v-if="accountStore.accounts.length">
          <input type="checkbox" :checked="allSelected" @change="toggleSelectAll" />
          <span>全选</span>
        </label>
        <!-- 批量采集 -->
        <button class="btn btn-primary btn-sm" v-if="selectedBizList.length > 0"
          @click="openBatchCollectModal" :disabled="accountStore.batchStatus.status === 'running'">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="10 8 16 12 10 16"/></svg>
          批量采集 ({{ selectedBizList.length }})
        </button>
        <button class="btn btn-ghost btn-sm" @click="accountStore.fetchAccounts()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
          刷新
        </button>
      </div>
    </div>

    <!-- 批量采集进度条 -->
    <div class="batch-progress card" v-if="accountStore.batchStatus.status === 'running'">
      <div class="batch-progress__info">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--c-accent)" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="10 8 16 12 10 16"/></svg>
        <span>批量采集中：<strong>{{ accountStore.batchStatus.current }}</strong></span>
        <span class="batch-progress__count">{{ accountStore.batchStatus.done }} / {{ accountStore.batchStatus.total }}</span>
      </div>
      <div class="batch-progress__bar">
        <div class="batch-progress__fill" :style="{ width: batchPercent + '%' }"></div>
      </div>
    </div>

    <div class="account-grid" v-if="accountStore.accounts.length">
      <div v-for="acc in accountStore.accounts" :key="acc.biz"
        class="account-card card" :class="{ 'is-selected': selectedSet.has(acc.biz) }">
        <div class="account-card__check">
          <input type="checkbox" :checked="selectedSet.has(acc.biz)" @change="toggleSelect(acc.biz)" />
        </div>
        <div class="account-card__avatar">
          <img v-if="acc.head_img"
            :src="coverProxy(acc.head_img)"
            :alt="acc.nickname"
            @error="(e:any) => e.target.style.display='none'" />
          <div v-else class="avatar-placeholder">{{ (acc.nickname || '?')[0] }}</div>
        </div>
        <div class="account-card__info">
          <h3>{{ acc.nickname || '未知公众号' }}</h3>
          <p class="biz-id">{{ acc.biz }}</p>
          <p class="bound-time">绑定于 {{ formatDate(acc.bound_at) }}</p>
          <p class="article-count" v-if="(acc as any).article_count">
            已采集 {{ (acc as any).article_count }} 篇
          </p>
        </div>
        <div class="account-card__actions">
          <button
            class="btn btn-primary btn-sm"
            @click="openCollectModal(acc)"
            :disabled="accountStore.collectingBiz === acc.biz"
          >
            {{ accountStore.collectingBiz === acc.biz ? '采集中...' : '采集文章' }}
          </button>
          <button class="btn btn-ghost btn-sm" @click="handleDelete(acc.biz, acc.nickname)">删除</button>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
      <p>暂无公众号数据</p>
      <p style="font-size:12px">启动代理后，打开微信中的公众号文章将自动识别</p>
    </div>

    <!-- 单个采集弹窗 -->
    <div class="modal-overlay" v-if="collectModal.show" @click.self="collectModal.show = false">
      <div class="modal card">
        <div class="modal-header">
          <h3>采集设置</h3>
          <button class="btn-close" @click="collectModal.show = false">✕</button>
        </div>
        <div class="modal-body">
          <p class="modal-account-name">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--c-accent)" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
            {{ collectModal.account?.nickname || collectModal.account?.biz }}
          </p>
          <!-- 共享表单 -->
          <collect-form :form="collectModal" />
        </div>
        <div class="modal-footer">
          <button class="btn btn-ghost" @click="collectModal.show = false">取消</button>
          <button class="btn btn-primary" @click="startCollect">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="10 8 16 12 10 16"/></svg>
            开始采集
          </button>
        </div>
      </div>
    </div>

    <!-- 批量采集弹窗 -->
    <div class="modal-overlay" v-if="batchModal.show" @click.self="batchModal.show = false">
      <div class="modal card">
        <div class="modal-header">
          <h3>批量采集设置</h3>
          <button class="btn-close" @click="batchModal.show = false">✕</button>
        </div>
        <div class="modal-body">
          <p class="modal-account-name" style="color:var(--c-primary-light)">
            已选择 <strong>{{ selectedBizList.length }}</strong> 个公众号
          </p>
          <!-- 共享表单 -->
          <collect-form :form="batchModal" />
        </div>
        <div class="modal-footer">
          <button class="btn btn-ghost" @click="batchModal.show = false">取消</button>
          <button class="btn btn-primary" @click="startBatchCollect">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="10 8 16 12 10 16"/></svg>
            开始批量采集
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted, defineComponent, h } from 'vue'
import { useAccountStore } from '../stores/accountStore'
import { useAppStore } from '../stores/appStore'
import { showConfirm } from '../utils/dialog'

const accountStore = useAccountStore()
const app = useAppStore()

// ---------- 多选 ----------
const selectedSet = ref<Set<string>>(new Set())
const selectedBizList = computed(() => [...selectedSet.value])
const allSelected = computed(() =>
  accountStore.accounts.length > 0 && accountStore.accounts.every(a => selectedSet.value.has(a.biz))
)
function toggleSelect(biz: string) {
  const s = new Set(selectedSet.value)
  s.has(biz) ? s.delete(biz) : s.add(biz)
  selectedSet.value = s
}
function toggleSelectAll() {
  if (allSelected.value) selectedSet.value = new Set()
  else selectedSet.value = new Set(accountStore.accounts.map(a => a.biz))
}

// ---------- 批量采集进度 ----------
const batchPercent = computed(() => {
  const s = accountStore.batchStatus
  return s.total > 0 ? Math.round((s.done / s.total) * 100) : 0
})

// ---------- 单个采集弹窗 ----------
function coverProxy(url: string) {
  if (!url) return ''
  return `${app.apiBase}/api/proxy/image?url=${encodeURIComponent(url)}`
}

const collectModal = reactive({
  show: false,
  account: null as any,
  source: 'album',
  maxPerDay: 5,
  totalCount: 50,
  startDate: '',
  endDate: '',
  fetchStats: true,
})

function openCollectModal(acc: any) {
  collectModal.account = acc
  collectModal.show = true
}

function startCollect() {
  collectModal.show = false
  accountStore.collectArticles(collectModal.account.biz, {
    source: collectModal.source,
    maxPerDay: collectModal.maxPerDay,
    totalCount: collectModal.totalCount,
    startDate: collectModal.startDate || undefined,
    endDate: collectModal.endDate || undefined,
    fetchStats: collectModal.fetchStats,
  })
}

// ---------- 批量采集弹窗 ----------
const batchModal = reactive({
  show: false,
  source: 'album',
  maxPerDay: 5,
  totalCount: 50,
  startDate: '',
  endDate: '',
  fetchStats: true,
})

function openBatchCollectModal() {
  batchModal.show = true
}

function startBatchCollect() {
  batchModal.show = false
  accountStore.batchCollect(selectedBizList.value, {
    source: batchModal.source,
    maxPerDay: batchModal.maxPerDay,
    totalCount: batchModal.totalCount,
    startDate: batchModal.startDate || undefined,
    endDate: batchModal.endDate || undefined,
    fetchStats: batchModal.fetchStats,
  })
}

// ---------- 公用 ----------
async function handleDelete(biz: string, name: string) {
  const confirmed = await showConfirm(`确定删除公众号「${name || biz}」？`)
  if (confirmed) accountStore.deleteAccount(biz)
}
function formatDate(ts: number) {
  if (!ts) return '—'
  return new Date(ts * 1000).toLocaleDateString('zh-CN')
}

// 本地日期
function toLocalDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

onMounted(() => accountStore.fetchAccounts())

// ---------- 采集表单子组件（共享） ----------
const CollectForm = defineComponent({
  name: 'CollectForm',
  props: { form: { type: Object, required: true } },
  setup(props) {
    function setQuickDate(days: number) {
      const end = new Date(); const start = new Date()
      start.setDate(start.getDate() - days)
      props.form.endDate = toLocalDate(end)
      props.form.startDate = toLocalDate(start)
    }
    function clearDates() { props.form.startDate = ''; props.form.endDate = '' }

    return () => h('div', { class: 'collect-form' }, [
      // 每天采集篇数
      h('div', { class: 'form-group' }, [
        h('label', {}, ['每天最多采集篇数 ', h('span', { class: 'label-hint' }, '（同一天发布的文章超过此数量则截断）')]),
        h('div', { class: 'count-options' },
          [3, 5, 10, 20].map(n =>
            h('button', { class: ['btn', 'btn-sm', props.form.maxPerDay === n ? 'btn-primary' : 'btn-ghost'], onClick: () => { props.form.maxPerDay = n } }, `${n} 篇/天`)
          ).concat([h('input', { class: 'input count-input', type: 'number', value: props.form.maxPerDay, min: 1, max: 100, placeholder: '自定义', onInput: (e: any) => { props.form.maxPerDay = Number(e.target.value) } })])
        ),
      ]),
      // 总采集上限
      h('div', { class: 'form-group' }, [
        h('label', {}, ['总采集上限 ', h('span', { class: 'label-hint' }, '（每个公众号合计不超过此数）')]),
        h('div', { class: 'count-options' },
          [20, 50, 100, 200].map(n =>
            h('button', { class: ['btn', 'btn-sm', props.form.totalCount === n ? 'btn-primary' : 'btn-ghost'], onClick: () => { props.form.totalCount = n } }, `${n} 篇`)
          ).concat([h('input', { class: 'input count-input', type: 'number', value: props.form.totalCount, min: 1, max: 1000, placeholder: '自定义', onInput: (e: any) => { props.form.totalCount = Number(e.target.value) } })])
        ),
      ]),
      // 日期范围
      h('div', { class: 'form-group' }, [
        h('label', {}, ['日期范围 ', h('span', { class: 'label-hint' }, '（留空则不限制）')]),
        h('div', { class: 'date-range' }, [
          h('div', { class: 'date-field' }, [h('span', {}, '开始日期'), h('input', { class: 'input', type: 'date', value: props.form.startDate, max: props.form.endDate || undefined, onInput: (e: any) => { props.form.startDate = e.target.value } })]),
          h('span', { class: 'date-sep' }, '至'),
          h('div', { class: 'date-field' }, [h('span', {}, '结束日期'), h('input', { class: 'input', type: 'date', value: props.form.endDate, min: props.form.startDate || undefined, onInput: (e: any) => { props.form.endDate = e.target.value } })]),
        ]),
        h('div', { class: 'quick-dates' }, [
          h('button', { class: 'btn btn-ghost btn-sm', onClick: () => setQuickDate(7) }, '近 7 天'),
          h('button', { class: 'btn btn-ghost btn-sm', onClick: () => setQuickDate(30) }, '近 30 天'),
          h('button', { class: 'btn btn-ghost btn-sm', onClick: () => setQuickDate(90) }, '近 3 个月'),
          h('button', { class: 'btn btn-ghost btn-sm', onClick: () => clearDates() }, '不限日期'),
        ]),
      ]),
      // 采集阅读数据
      h('div', { class: 'form-group' }, [
        h('label', {}, '采集阅读数据'),
        h('div', { class: 'toggle-row' }, [
          h('input', { type: 'checkbox', id: 'batchFetchStats', checked: props.form.fetchStats, onChange: (e: any) => { props.form.fetchStats = e.target.checked } }),
          h('label', { for: 'batchFetchStats', style: 'font-size:13px;font-weight:400;margin-bottom:0' }, '采集每篇文章的阅读数/点赞数/分享数（更慢，约每篇 1.5 秒）'),
        ]),
      ]),
    ])
  },
})
</script>

<script lang="ts">
export default { components: { CollectForm: {} } }
</script>

<style scoped>
.page-accounts { display: flex; flex-direction: column; gap: 20px; }
.page-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
.page-header__left { display: flex; align-items: center; gap: 12px; }
.page-header__right { display: flex; align-items: center; gap: 8px; }
.page-title { display: flex; align-items: center; gap: 8px; font-size: 18px; font-weight: 700; }
.page-badge { padding: 3px 10px; border-radius: var(--radius-full); font-size: 11px; background: rgba(0,206,201,0.12); color: var(--c-accent); font-weight: 600; }
.select-all { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--text-secondary); cursor: pointer; }
.select-all input { accent-color: var(--c-primary); }

/* 批量进度 */
.batch-progress { padding: 14px 20px; display: flex; flex-direction: column; gap: 10px; }
.batch-progress__info { display: flex; align-items: center; gap: 8px; font-size: 13px; }
.batch-progress__count { margin-left: auto; font-family: var(--font-mono); color: var(--c-accent); font-weight: 600; }
.batch-progress__bar { height: 6px; background: var(--bg-input); border-radius: var(--radius-full); overflow: hidden; }
.batch-progress__fill { height: 100%; background: linear-gradient(90deg, var(--c-primary), var(--c-accent)); border-radius: var(--radius-full); transition: width 0.5s ease; }

/* 卡片 */
.account-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
.account-card { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 24px 20px; gap: 10px; position: relative; transition: border-color 0.15s; }
.account-card.is-selected { border-color: var(--c-primary); box-shadow: 0 0 0 1px var(--c-primary); }
.account-card__check { position: absolute; top: 12px; left: 12px; }
.account-card__check input { accent-color: var(--c-primary); width: 16px; height: 16px; }
.account-card__avatar img { width: 64px; height: 64px; border-radius: 50%; object-fit: cover; border: 2px solid var(--border-default); }
.avatar-placeholder { width: 64px; height: 64px; border-radius: 50%; background: linear-gradient(135deg, var(--c-primary), var(--c-accent)); display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 700; color: #fff; }
.account-card__info h3 { font-size: 15px; font-weight: 600; }
.biz-id { font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); margin-top: 4px; }
.bound-time { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
.article-count { font-size: 12px; color: var(--c-accent); }
.account-card__actions { display: flex; gap: 8px; margin-top: 4px; }

/* 弹窗 */
.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,.55);
  display: flex; align-items: center; justify-content: center; z-index: 1000;
}
.modal {
  width: 460px; max-width: 95vw;
  padding: 0; overflow: hidden;
  animation: modalIn .2s cubic-bezier(.34,1.56,.64,1);
}
@keyframes modalIn { from { transform: scale(.92); opacity: 0; } to { transform: scale(1); opacity: 1; } }
.modal-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 20px; border-bottom: 1px solid var(--border-subtle);
}
.modal-header h3 { font-size: 15px; font-weight: 700; }
.btn-close { background: none; border: none; color: var(--text-muted); font-size: 16px; cursor: pointer; padding: 0 4px; }
.modal-body { padding: 20px; display: flex; flex-direction: column; gap: 20px; }
.modal-account-name { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: var(--c-accent); }
.modal-footer { padding: 12px 20px; border-top: 1px solid var(--border-subtle); display: flex; justify-content: flex-end; gap: 8px; }

/* 表单公共样式 */
.form-group { display: flex; flex-direction: column; gap: 8px; }
.form-group > label { font-size: 13px; font-weight: 600; }
.label-hint { font-weight: 400; color: var(--text-muted); font-size: 11px; }
.count-options { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
.count-input { width: 90px; }
.date-range { display: flex; align-items: center; gap: 10px; }
.date-field { display: flex; flex-direction: column; gap: 4px; flex: 1; }
.date-field span { font-size: 11px; color: var(--text-muted); }
.date-sep { color: var(--text-muted); font-size: 12px; flex-shrink: 0; }
.quick-dates { display: flex; gap: 6px; flex-wrap: wrap; }
.toggle-row { display: flex; align-items: center; gap: 8px; }
.collect-form { display: flex; flex-direction: column; gap: 20px; }
</style>
