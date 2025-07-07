// 页面内容配置
const PAGE_CONFIGS = {
    'index.html': {
        title: '欢迎使用Toolkit工具集',
        contentFile: 'index_content.html'
    },
    'url.html': {
        title: 'URL 编码/解码工具',
        contentFile: 'url_content.html'
    },
    'json.html': {
        title: 'JSON 格式化工具',
        contentFile: 'json_content.html'
    },
    'base64.html': {
        title: 'Base64 编码/解码',
        contentFile: 'base64_content.html'
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
    const useGzip = document.getElementById('use-gzip').checked;
    try {
        let processedInput = input;
        if (useGzip) {
            try {
                const compressed = pako.gzip(new TextEncoder().encode(input));
                processedInput = btoa(String.fromCharCode(...compressed));
            } catch (e) {
                processedInput = btoa(unescape(encodeURIComponent(input)));
                console.warn('Gzip压缩失败，使用普通Base64编码:', e);
            }
        } else {
            processedInput = btoa(unescape(encodeURIComponent(processedInput)));
        }
        document.getElementById('output').value = processedInput;
    } catch (e) {
        document.getElementById('output').value = "编码失败，内容可能包含无法处理的字符";
    }
}

function decodeBase64() {
    const input = document.getElementById('base64-input').value;
    const useGzip = document.getElementById('use-gzip').checked;
    try {
        let decoded = '';
        if (useGzip) {
            try {
                const binaryString = atob(input);
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }
                const decompressed = pako.ungzip(bytes);
                decoded = new TextDecoder().decode(decompressed);
            } catch (e) {
                decoded = decodeURIComponent(escape(atob(input)));
                console.warn('Gzip解压失败，使用普通Base64解码:', e);
            }
        } else {
            try {
                decoded = decodeURIComponent(escape(atob(input)));
            } catch (e) {
                let partialInput = input;
                while (partialInput.length > 0) {
                    try {
                        decoded = decodeURIComponent(escape(atob(partialInput)));
                        break;
                    } catch (innerError) {
                        partialInput = partialInput.slice(0, -1);
                    }
                }
                if (partialInput.length === 0) {
                    throw new Error('无法解码任何部分');
                }
            }
        }
        document.getElementById('output').value = decoded;
    } catch (e) {
        document.getElementById('output').value = `解码失败：${e.message}`;
    }
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

// 渲染模板，动态加载内容文件
async function renderTemplate() {
    try {
        const template = await fetch('template.hbs').then(r => r.text());
        const compiled = Handlebars.compile(template);
        const context = getCurrentPageConfig();
        let contentHtml = '';
        if (context.contentFile) {
            contentHtml = await fetch(context.contentFile).then(r => r.text());
        }
        const renderContext = { ...context, content: contentHtml };
        // 使用document.write替换整个页面
        document.open();
        document.write(compiled(renderContext));
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