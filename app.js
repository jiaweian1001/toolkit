// 页面内容配置
const PAGE_CONFIGS = {
    'index.html': {
        title: 'Toolkit',
        content: `
            <header>
                <h1>Toolkit</h1>
                <p>提供工具类网页，永久免费，无广告。</p>
            </header>
            <section id="donation">
                <h2>支持我们</h2>
                <p>扫描下方二维码捐赠：</p>
                <div id="qr-code"></div>
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
                    <button onclick="encode()">编码</button>
                    <button onclick="decode()">解码</button>
                </div>
                <textarea id="output" placeholder="结果将显示在这里" readonly></textarea>
            </div>
            <script>
                function encode() {
                    const input = document.getElementById('input').value;
                    const output = encodeURIComponent(input);
                    document.getElementById('output').value = output;
                }
                function decode() {
                    const input = document.getElementById('input').value;
                    const output = decodeURIComponent(input);
                    document.getElementById('output').value = output;
                }
            </script>
        `
    },
    'json.html': {
        title: 'JSON 格式化工具',
        content: `
            <div id="content">
                <h1>JSON 格式化工具</h1>
                <textarea id="input" placeholder="输入需要格式化的JSON内容"></textarea>
                <div>
                    <button onclick="format()">格式化</button>
                </div>
                <textarea id="output" placeholder="结果将显示在这里" readonly></textarea>
            </div>
            <script>
                function format() {
                    try {
                        const input = document.getElementById('input').value;
                        const parsed = JSON.parse(input);
                        const output = JSON.stringify(parsed, null, 2);
                        document.getElementById('output').textContent = output;
                    } catch (error) {
                        document.getElementById('output').textContent = "错误：无效的JSON格式";
                    }
                }
            </script>
        `
    },
    'base64.html': {
        title: 'Base64 编码/解码',
        content: `
            <div id="content">
                <h1>Base64 编码/解码</h1>
                <div>
                    <textarea id="base64-input" placeholder="输入文本"></textarea>
                    <button id="encode-base64-btn">编码</button>
                    <button id="decode-base64-btn">解码</button>
                    <textarea id="output" placeholder="结果将显示在这里" readonly></textarea>
                </div>
            </div>
            <script>
                document.getElementById('encode-base64-btn').addEventListener('click', function () {
                    const input = document.getElementById('base64-input').value;
                    const output = btoa(input);
                    document.getElementById('output').value = output;
                });

                document.getElementById('decode-base64-btn').addEventListener('click', function () {
                    const input = document.getElementById('base64-input').value;
                    const output = atob(input);
                    document.getElementById('output').value = output;
                });
            </script>
        `
    }
};

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