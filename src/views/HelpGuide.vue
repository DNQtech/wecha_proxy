<template>
  <div class="page-help">
    <h1 class="page-title">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--c-accent)" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
      使用帮助
    </h1>

    <div class="help-sections">
      <!-- 快速开始 -->
      <section class="help-section card">
        <h2 class="section-title">
          <span class="section-icon">🚀</span> 快速开始
        </h2>
        <p class="section-desc">首次使用请按以下步骤操作，完成后即可自动采集公众号数据。</p>
        <div class="steps">
          <div class="step">
            <div class="step-num">1</div>
            <div class="step-content">
              <h3>安装安全证书</h3>
              <p>前往 <strong>设置</strong> → 点击 <strong>「一键安装证书」</strong>，弹出系统提示时点击"是"确认安装。</p>
              <div class="step-tip">⚠️ 首次使用必须安装，否则无法拦截加密请求。</div>
            </div>
          </div>
          <div class="step">
            <div class="step-num">2</div>
            <div class="step-content">
              <h3>启动代理服务</h3>
              <p>前往 <strong>设置</strong> → 点击 <strong>「启动代理」</strong>，等待按钮变为"停止代理"表示启动成功。</p>
            </div>
          </div>
          <div class="step">
            <div class="step-num">3</div>
            <div class="step-content">
              <h3>开启系统代理</h3>
              <p>在设置页面点击 <strong>「开启系统代理」</strong>，使微信流量经过本工具。</p>
              <div class="step-tip">💡 使用完毕后记得关闭系统代理，否则会影响正常上网。</div>
            </div>
          </div>
          <div class="step">
            <div class="step-num">4</div>
            <div class="step-content">
              <h3>打开微信浏览文章</h3>
              <p>在微信 PC 端打开任意公众号的文章，工具将自动拦截并绑定该公众号。</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 如何绑定公众号 -->
      <section class="help-section card">
        <h2 class="section-title">
          <span class="section-icon">🔗</span> 如何绑定公众号
        </h2>
        <div class="guide-block">
          <h3>自动绑定（推荐）</h3>
          <ol>
            <li>确保代理服务和系统代理已开启</li>
            <li>在微信 PC 端，打开目标公众号的<strong>任意一篇文章</strong></li>
            <li>工具会自动识别公众号并绑定到 <strong>「公众号管理」</strong> 页面</li>
            <li>绑定成功后可在公众号管理页面看到该公众号的名称和头像</li>
          </ol>
          <div class="step-tip">💡 打开文章后，请等待文章完全加载，确保数据被完整拦截。</div>
        </div>
        <div class="guide-block">
          <h3>补充信息</h3>
          <ol>
            <li>如果公众号只显示 biz 编码没有显示名称，请再打开一篇该公众号的文章</li>
            <li>每次重启微信后，建议重新打开文章以刷新登录凭证</li>
          </ol>
        </div>
      </section>

      <!-- 如何采集文章 -->
      <section class="help-section card">
        <h2 class="section-title">
          <span class="section-icon">📄</span> 如何采集文章数据
        </h2>
        <div class="guide-block">
          <h3>方式一：自动采集（浏览时自动保存）</h3>
          <p>开启代理后，在微信中浏览公众号的<strong>历史文章列表</strong>时，工具会自动保存经过的文章数据。</p>
        </div>
        <div class="guide-block">
          <h3>方式二：批量采集</h3>
          <ol>
            <li>前往 <strong>「公众号管理」</strong> 页面</li>
            <li>找到已绑定的公众号，点击 <strong>「采集」</strong> 按钮</li>
            <li>设置采集参数（每日篇数、总数上限、日期范围等）</li>
            <li>点击确认，等待采集完成</li>
          </ol>
          <div class="step-tip">⚠️ 批量采集需要有效的登录凭证，请确保最近打开过该公众号的文章。</div>
        </div>
        <div class="guide-block">
          <h3>查看和导出</h3>
          <p>采集完成后，在 <strong>「文章数据」</strong> 页面可查看所有文章，支持按公众号筛选和导出 Excel。</p>
        </div>
      </section>

      <!-- 常见问题 -->
      <section class="help-section card">
        <h2 class="section-title">
          <span class="section-icon">❓</span> 常见问题
        </h2>
        <div class="faq-list">
          <details class="faq-item">
            <summary>微信提示"网络错误"或无法打开文章</summary>
            <p>通常是证书未正确安装。请前往设置页面重新安装安全证书，或重启微信后再试。</p>
          </details>
          <details class="faq-item">
            <summary>公众号绑定了但采集失败</summary>
            <p>登录凭证可能已过期。请在微信中重新打开该公众号的一篇文章，刷新凭证后再次采集。</p>
          </details>
          <details class="faq-item">
            <summary>关闭软件后无法正常上网</summary>
            <p>这是因为系统代理未自动关闭。请前往 <strong>Windows 设置 → 网络 → 代理</strong>，关闭手动代理设置即可。</p>
          </details>
          <details class="faq-item">
            <summary>文章的阅读数/点赞数显示为 0</summary>
            <p>采集时请勾选"获取阅读数据"选项。注意获取阅读数据需要逐篇访问文章页面，速度较慢。</p>
          </details>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.page-help { display: flex; flex-direction: column; gap: 20px; }
.page-title { display: flex; align-items: center; gap: 8px; font-size: 18px; font-weight: 700; }
.help-sections { display: flex; flex-direction: column; gap: 16px; max-width: 700px; }
.help-section { padding: 24px; }
.section-title {
  font-size: 15px; font-weight: 600; margin-bottom: 14px;
  padding-bottom: 10px; border-bottom: 1px solid var(--border-subtle);
  display: flex; align-items: center; gap: 8px;
}
.section-icon { font-size: 18px; }
.section-desc { font-size: 13px; color: var(--text-muted); margin-bottom: 20px; }

/* 步骤 */
.steps { display: flex; flex-direction: column; gap: 0; }
.step {
  display: flex; gap: 16px; padding: 16px 0;
  border-bottom: 1px solid var(--border-subtle);
}
.step:last-child { border-bottom: none; }
.step-num {
  width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
  background: linear-gradient(135deg, var(--c-primary), var(--c-accent));
  color: #fff; font-size: 14px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
}
.step-content h3 { font-size: 14px; font-weight: 600; margin-bottom: 6px; }
.step-content p { font-size: 13px; color: var(--text-secondary); line-height: 1.6; }
.step-tip {
  margin-top: 8px; font-size: 12px; color: var(--c-warning);
  background: rgba(253, 203, 110, 0.08); padding: 8px 12px;
  border-radius: var(--radius-sm); border-left: 3px solid var(--c-warning);
}

/* 指南块 */
.guide-block { margin-bottom: 20px; }
.guide-block:last-child { margin-bottom: 0; }
.guide-block h3 { font-size: 14px; font-weight: 600; margin-bottom: 8px; }
.guide-block p { font-size: 13px; color: var(--text-secondary); line-height: 1.6; }
.guide-block ol {
  padding-left: 20px; font-size: 13px; color: var(--text-secondary);
  line-height: 2;
}
.guide-block ol li::marker { color: var(--c-primary-light); font-weight: 600; }

/* FAQ */
.faq-list { display: flex; flex-direction: column; gap: 4px; }
.faq-item {
  border: 1px solid var(--border-subtle); border-radius: var(--radius-sm);
  overflow: hidden; transition: all var(--duration-fast);
}
.faq-item[open] { border-color: var(--c-primary); background: rgba(108, 92, 231, 0.04); }
.faq-item summary {
  padding: 12px 16px; font-size: 13px; font-weight: 500;
  cursor: pointer; user-select: none; color: var(--text-primary);
  transition: color var(--duration-fast);
}
.faq-item summary:hover { color: var(--c-primary-light); }
.faq-item p {
  padding: 0 16px 14px; font-size: 13px;
  color: var(--text-secondary); line-height: 1.7;
}
</style>
