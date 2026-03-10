import { defineStore } from 'pinia'
import { ref } from 'vue'
import { demoApi, type Account, type Article } from '../services/mockApi'

export const useAccountStore = defineStore('accounts', () => {
    const accounts = ref<Account[]>([])
    const articles = ref<Article[]>([])
    const articleTotal = ref(0)
    const articlePage = ref(1)
    const articleBiz = ref('')
    const collectingBiz = ref('')

    async function fetchAccounts() {
        try {
            accounts.value = await demoApi.getAccounts()
        } catch (e) { console.error(e) }
    }

    async function deleteAccount(biz: string) {
        await demoApi.deleteAccount(biz)
        accounts.value = accounts.value.filter(a => a.biz !== biz)
    }

    async function collectArticles(biz: string, opts: {
        maxPerDay?: number
        totalCount?: number
        startDate?: string
        endDate?: string
        fetchStats?: boolean
        source?: string
    } = {}) {
        collectingBiz.value = biz
        try {
            const result = await demoApi.collectArticles(biz, opts)
            if (result.status === 'error') { collectingBiz.value = ''; return }

            let attempts = 0
            const poll = () => {
                setTimeout(async () => {
                    try {
                        const s = await demoApi.getCollectStatus(biz)
                        if (s.status === 'done' || s.status === 'error') {
                            collectingBiz.value = ''
                            if (s.status === 'done') fetchAccounts()
                        } else if (++attempts < 90) { poll() }
                        else { collectingBiz.value = '' }
                    } catch { collectingBiz.value = '' }
                }, 2000)
            }
            poll()
        } catch (e) {
            console.error(e)
            collectingBiz.value = ''
        }
    }

    // 批量采集
    const batchStatus = ref<any>({ status: 'idle', total: 0, done: 0, current: '', errors: [] })

    async function batchCollect(bizList: string[], opts: {
        maxPerDay?: number
        totalCount?: number
        startDate?: string
        endDate?: string
        fetchStats?: boolean
        source?: string
    } = {}) {
        try {
            const result = await demoApi.batchCollect(bizList, opts)
            if (result.status === 'started' || result.status === 'running') {
                pollBatchStatus()
            }
        } catch (e) { console.error(e) }
    }

    function pollBatchStatus() {
        const poll = () => {
            setTimeout(async () => {
                try {
                    batchStatus.value = await demoApi.getBatchStatus()
                    if (batchStatus.value.status === 'running') poll()
                    else if (batchStatus.value.status === 'done') fetchAccounts()
                } catch { /* ignore */ }
            }, 2000)
        }
        poll()
    }

    async function fetchArticles() {
        try {
            const data = await demoApi.getArticles(articlePage.value, 20, articleBiz.value || undefined)
            articles.value = data.articles ?? []
            articleTotal.value = data.total ?? 0
        } catch (e) { console.error(e) }
    }

    return { accounts, articles, articleTotal, articlePage, articleBiz, collectingBiz, batchStatus, fetchAccounts, deleteAccount, collectArticles, batchCollect, fetchArticles }
})
