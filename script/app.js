// 页面内容配置
const PAGE_CONFIGS = {
    'index.html': {
        title: '欢迎使用Toolkit工具集',
        content: `
            <header class="welcome-header">
                <h1>欢迎使用Toolkit工具集</h1>
                <p class="subtitle">一站式解决您的各种在线工具需求</p>
            </header>
            
            <section class="current-features">
                <h2>当前可用工具</h2>
                <div class="feature-grid">
                    <div class="feature-card">
                        <h3>URL编码/解码</h3>
                        <p>快速进行URL编码和解码操作，方便处理网页链接和参数</p>
                        <a href="url.html" class="try-button">立即使用</a>
                    </div>
                    <div class="feature-card">
                        <h3>JSON格式化</h3>
                        <p>美化JSON数据格式，便于阅读和调试</p>
                        <a href="json.html" class="try-button">立即使用</a>
                    </div>
                    <div class="feature-card">
                        <h3>Base64编码/解码</h3>
                        <p>轻松转换文本和Base64编码</p>
                        <a href="base64.html" class="try-button">立即使用</a>
                    </div>
                </div>
            </section>
            
            <section class="future-plans">
                <h2>即将推出的功能</h2>
                <div class="plan-grid">
                    <div class="plan-card">
                        <h3>PDF工具集</h3>
                        <ul>
                            <li>PDF转Word文档</li>
                            <li>PDF转图片</li>
                            <li>PDF提取图片</li>
                            <li>PDF拆分与合并</li>
                            <li>PDF加密/解密</li>
                        </ul>
                    </div>
                    <div class="plan-card">
                        <h3>图片处理</h3>
                        <ul>
                            <li>图片格式转换</li>
                            <li>图片压缩优化</li>
                            <li>图片水印添加</li>
                            <li>批量图片处理</li>
                        </ul>
                    </div>
                    <div class="plan-card">
                        <h3>开发工具</h3>
                        <ul>
                            <li>代码格式化</li>
                            <li>API测试工具</li>
                            <li>正则表达式测试</li>
                            <li>数据加密/解密</li>
                        </ul>
                    </div>
                </div>
            </section>
            
            <section class="feedback">
                <h2>反馈与建议</h2>
                <p>如果您有任何建议或需求，欢迎联系我们。我们将持续改进，为您提供更好的服务！</p>
                <div class="contact-info">
                    <p>邮箱：feedback@toolkit.example.com</p>
                    <p>微信公众号：Toolkit工具集</p>
                </div>
            </section>
        `
    },
    'url.html': {
        title: 'URL 编码/解码工具',
        content: `
            <div id="content">
                <h1>URL 编码/解码工具</h1>
                <textarea id="input" placeholder="输入需要编码或解码的内容"></textarea>
                <div>
                    <button onclick="urlEncode()">编码</button>
                    <button onclick="urlDecode()">解码</button>
                </div>
                <textarea id="output" placeholder="结果将显示在这里" readonly></textarea>
            </div>
        `
    },
    'json.html': {
        title: 'JSON 格式化工具',
        content: `
            <div id="content">
                <h1>JSON 格式化工具</h1>
                <textarea id="input" placeholder="输入需要格式化的JSON内容"></textarea>
                <div>
                    <button onclick="formatJson()">格式化</button>
                </div>
                <textarea id="output" placeholder="结果将显示在这里" readonly></textarea>
            </div>
        `
    },
    'base64.html': {
        title: 'Base64 编码/解码',
        content: `
            <div id="content">
                <h1>Base64 编码/解码</h1>
                <div>
                    <textarea id="base64-input" placeholder="输入文本"></textarea>
                    <button onclick="encodeBase64()">编码</button>
                    <button onclick="decodeBase64()">解码</button>
                    <textarea id="output" placeholder="结果将显示在这里" readonly></textarea>
                </div>
            </div>
        `
    }
};

// URL编码/解码函数
function urlEncode() {
    const input = document.getElementById('input').value;
    const output = encodeURIComponent(input);
    document.getElementById('output').value = output;
}

function urlDecode() {
    const input = document.getElementById('input').value;
    const output = decodeURIComponent(input);
    document.getElementById('output').value = output;
}

// JSON格式化函数
function formatJson() {
    try {
        const input = document.getElementById('input').value;
        const parsed = JSON.parse(input);
        const output = JSON.stringify(parsed, null, 2);
        document.getElementById('output').textContent = output;
    } catch (error) {
        document.getElementById('output').textContent = "错误：无效的JSON格式";
    }
}

// Base64编码/解码函数
function encodeBase64() {
    const input = document.getElementById('base64-input').value;
    const output = btoa(input);
    document.getElementById('output').value = output;
}

function decodeBase64() {
    const input = document.getElementById('base64-input').value;
    const output = atob(input);
    document.getElementById('output').value = output;
}

// 检查Handlebars是否加载
async function ensureHandlebarsLoaded() {
    if (typeof Handlebars !== 'undefined') return;
    
    return new Promise((resolve, reject) => {
        let attempts = 0;
        const interval = setInterval(() => {
            if (typeof Handlebars !== 'undefined') {
                clearInterval(interval);
                resolve();
            } else if (attempts++ > 50) {
                clearInterval(interval);
                reject(new Error('Handlebars failed to load'));
            }
        }, 100);
    });
}

// 获取当前页面配置
function getCurrentPageConfig() {
    const path = window.location.pathname.split('/').pop();
    return PAGE_CONFIGS[path] || PAGE_CONFIGS['index.html'];
}

// 渲染模板
async function renderTemplate() {
    try {
        const template = await fetch('template.hbs').then(r => r.text());
        const compiled = Handlebars.compile(template);
        const context = getCurrentPageConfig();
        
        // 使用document.write替换整个页面
        document.open();
        document.write(compiled(context));
        document.close();
    } catch (error) {
        console.error('Template render failed:', error);
        throw error;
    }
}

// 主入口
async function initApp() {
    try {
        await ensureHandlebarsLoaded();
        await renderTemplate();
    } catch (error) {
        console.error('App initialization failed:', error);
        document.body.innerHTML = `<h1>Error loading page</h1><p>${error.message}</p>`;
    }
}

// 启动应用
document.addEventListener('DOMContentLoaded', initApp);