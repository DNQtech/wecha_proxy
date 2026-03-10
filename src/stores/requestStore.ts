import { defineStore } from 'pinia'
import { ref } from 'vue'
import { demoApi, type RequestRecord } from '../services/mockApi'

export interface RequestDetail extends RequestRecord {
    request_headers: string
    request_body: string
    request_content_type: string
    response_headers: string
    response_body: string
}

export const useRequestStore = defineStore('requests', () => {
    const records = ref<RequestRecord[]>([])
    const currentDetail = ref<RequestDetail | null>(null)
    const loading = ref(false)
    const total = ref(0)
    const page = ref(1)
    const search = ref('')
    const detailVisible = ref(false)

    async function fetchRequests() {
        loading.value = true
        try {
            const data = await demoApi.getRequests(page.value, 50, search.value || undefined)
            records.value = data.records ?? []
            total.value = data.total ?? 0
        } catch (e) { console.error('fetchRequests failed', e) }
        finally { loading.value = false }
    }

    async function fetchDetail(id: number) {
        try {
            currentDetail.value = await demoApi.getRequestDetail(id)
            detailVisible.value = true
        } catch (e) { console.error('fetchDetail failed', e) }
    }

    async function clearRequests() {
        await demoApi.clearRequests()
        records.value = []
        total.value = 0
    }

    function addRequest(r: RequestRecord) {
        records.value.unshift(r)
        if (records.value.length > 200) records.value.pop()
        total.value++
    }

    return { records, currentDetail, loading, total, page, search, detailVisible, fetchRequests, fetchDetail, clearRequests, addRequest }
})
