/**
 * 展示数据服务
 * 提供界面展示所需的示例数据，仅用于演示
 */

export interface Account {
  biz: string
  nickname: string
  head_img: string
  status: string
  bound_at: number
  updated_at: number
  article_count: number
}

export interface Article {
  id: number
  biz: string
  title: string
  author: string
  digest: string
  url: string
  cover_url: string
  publish_time: number
  read_num: number
  like_count: number
  old_like_count: number
  share_count: number
  comment_count: number
  collect_count: number
}

export interface RequestRecord {
  id: number
  timestamp: number
  method: string
  url: string
  host: string
  path: string
  scheme: string
  status_code: number | null
  response_content_type: string
  response_size: number
  duration_ms: number
}

// 示例账号数据
const demoAccounts: Account[] = [
  {
    biz: 'demo_account_1',
    nickname: '科技前沿',
    head_img: 'https://via.placeholder.com/64x64/4F46E5/FFFFFF?text=科技',
    status: 'active',
    bound_at: Date.now() / 1000 - 86400 * 7,
    updated_at: Date.now() / 1000 - 3600,
    article_count: 156
  },
  {
    biz: 'demo_account_2',
    nickname: '财经观察',
    head_img: 'https://via.placeholder.com/64x64/059669/FFFFFF?text=财经',
    status: 'active',
    bound_at: Date.now() / 1000 - 86400 * 15,
    updated_at: Date.now() / 1000 - 7200,
    article_count: 89
  },
  {
    biz: 'demo_account_3',
    nickname: '生活美学',
    head_img: 'https://via.placeholder.com/64x64/DC2626/FFFFFF?text=生活',
    status: 'active',
    bound_at: Date.now() / 1000 - 86400 * 3,
    updated_at: Date.now() / 1000 - 1800,
    article_count: 234
  }
]

// 示例文章数据
const demoArticles: Article[] = [
  {
    id: 1,
    biz: 'demo_account_1',
    title: 'AI 技术的最新突破：GPT-4 在各行业的应用实践',
    author: '科技前沿',
    digest: '探讨人工智能技术在医疗、教育、金融等领域的创新应用，分析未来发展趋势...',
    url: 'https://example.com/article/1',
    cover_url: 'https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=AI技术',
    publish_time: Date.now() / 1000 - 3600 * 2,
    read_num: 15420,
    like_count: 892,
    old_like_count: 856,
    share_count: 234,
    comment_count: 67,
    collect_count: 445
  },
  {
    id: 2,
    biz: 'demo_account_2',
    title: '2024年投资策略：如何在不确定性中寻找机会',
    author: '财经观察',
    digest: '分析当前经济形势，为投资者提供专业的投资建议和风险控制策略...',
    url: 'https://example.com/article/2',
    cover_url: 'https://via.placeholder.com/300x200/059669/FFFFFF?text=投资策略',
    publish_time: Date.now() / 1000 - 3600 * 6,
    read_num: 8765,
    like_count: 543,
    old_like_count: 521,
    share_count: 123,
    comment_count: 89,
    collect_count: 321
  },
  {
    id: 3,
    biz: 'demo_account_3',
    title: '极简生活：如何通过断舍离获得内心平静',
    author: '生活美学',
    digest: '介绍极简主义生活方式，分享如何通过整理物品和思维来提升生活质量...',
    url: 'https://example.com/article/3',
    cover_url: 'https://via.placeholder.com/300x200/DC2626/FFFFFF?text=极简生活',
    publish_time: Date.now() / 1000 - 3600 * 12,
    read_num: 12340,
    like_count: 1205,
    old_like_count: 1156,
    share_count: 456,
    comment_count: 234,
    collect_count: 789
  }
]

// 示例请求记录数据
const demoRequests: RequestRecord[] = [
  {
    id: 1,
    timestamp: Date.now() - 1000 * 60 * 5,
    method: 'GET',
    url: 'https://example.com/api/articles',
    host: 'example.com',
    path: '/api/articles',
    scheme: 'https',
    status_code: 200,
    response_content_type: 'application/json',
    response_size: 45678,
    duration_ms: 234
  },
  {
    id: 2,
    timestamp: Date.now() - 1000 * 60 * 3,
    method: 'POST',
    url: 'https://example.com/api/collect',
    host: 'example.com',
    path: '/api/collect',
    scheme: 'https',
    status_code: 200,
    response_content_type: 'application/json',
    response_size: 12345,
    duration_ms: 567
  }
]

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * 展示数据服务类
 */
export class DemoDataService {
  
  // ========== 账号相关 ==========
  
  async getAccounts(): Promise<Account[]> {
    await delay(300)
    return [...demoAccounts]
  }
  
  async deleteAccount(biz: string): Promise<void> {
    await delay(200)
    const index = demoAccounts.findIndex(a => a.biz === biz)
    if (index > -1) {
      demoAccounts.splice(index, 1)
    }
  }
  
  async collectArticles(biz: string, options: any): Promise<{ status: string }> {
    await delay(500)
    console.log(`[演示] 开始采集账号 ${biz} 的文章`, options)
    return { status: 'started' }
  }
  
  async getCollectStatus(biz: string): Promise<{ status: string; progress?: number }> {
    await delay(100)
    // 模拟采集进度
    const random = Math.random()
    if (random < 0.3) return { status: 'running', progress: 45 }
    if (random < 0.6) return { status: 'running', progress: 78 }
    return { status: 'done' }
  }
  
  async batchCollect(bizList: string[], options: any): Promise<{ status: string }> {
    await delay(800)
    console.log(`[演示] 开始批量采集 ${bizList.length} 个账号`, options)
    return { status: 'started' }
  }
  
  async getBatchStatus(): Promise<{ status: string; total: number; done: number; current: string; errors: string[] }> {
    await delay(100)
    return {
      status: 'running',
      total: 3,
      done: 1,
      current: '科技前沿',
      errors: []
    }
  }
  
  // ========== 文章相关 ==========
  
  async getArticles(page: number = 1, perPage: number = 20, biz?: string): Promise<{ articles: Article[]; total: number }> {
    await delay(400)
    
    let filteredArticles = [...demoArticles]
    if (biz) {
      filteredArticles = filteredArticles.filter(a => a.biz === biz)
    }
    
    const start = (page - 1) * perPage
    const end = start + perPage
    
    return {
      articles: filteredArticles.slice(start, end),
      total: filteredArticles.length
    }
  }
  
  async deleteArticles(ids: number[]): Promise<void> {
    await delay(200)
    console.log(`[演示] 删除文章`, ids)
  }
  
  // ========== 请求监控相关 ==========
  
  async getRequests(page: number = 1, perPage: number = 50, search?: string): Promise<{ records: RequestRecord[]; total: number }> {
    await delay(300)
    
    let filteredRequests = [...demoRequests]
    if (search) {
      filteredRequests = filteredRequests.filter(r => 
        r.url.toLowerCase().includes(search.toLowerCase()) ||
        r.host.toLowerCase().includes(search.toLowerCase())
      )
    }
    
    const start = (page - 1) * perPage
    const end = start + perPage
    
    return {
      records: filteredRequests.slice(start, end),
      total: filteredRequests.length
    }
  }
  
  async getRequestDetail(id: number): Promise<RequestRecord & { request_headers: string; response_headers: string; request_body: string; response_body: string }> {
    await delay(200)
    const record = demoRequests.find(r => r.id === id)
    if (!record) throw new Error('Request not found')
    
    return {
      ...record,
      request_headers: 'User-Agent: Mozilla/5.0\nAccept: application/json\nAccept-Language: zh-CN,zh;q=0.9',
      response_headers: 'Content-Type: application/json; charset=utf-8\nCache-Control: no-cache',
      request_body: '',
      response_body: '{"status": "success", "data": {...}}'
    }
  }
  
  async clearRequests(): Promise<void> {
    await delay(100)
    demoRequests.length = 0
  }
  
  // ========== 系统状态相关 ==========
  
  async getSystemStatus(): Promise<{ python_running: boolean; proxy_running: boolean }> {
    await delay(100)
    return {
      python_running: true,
      proxy_running: true
    }
  }
  
  async startProxy(): Promise<{ success: boolean; message: string }> {
    await delay(1000)
    return { success: true, message: '服务已启动' }
  }
  
  async stopProxy(): Promise<{ success: boolean; message: string }> {
    await delay(500)
    return { success: true, message: '服务已停止' }
  }
  
  async installCert(): Promise<{ success: boolean; message: string }> {
    await delay(2000)
    return { success: true, message: '安装成功' }
  }
  
  async uninstallCert(): Promise<{ success: boolean; message: string }> {
    await delay(1000)
    return { success: true, message: '卸载成功' }
  }
}

// 导出单例
export const demoApi = new DemoDataService()