#!/bin/bash

# 检查 Nginx 是否已安装
if ! command -v nginx &> /dev/null; then
    echo "Nginx 未安装，请先安装 Nginx。"
    exit 1
fi

# 启动 Nginx 并加载配置文件
nginx -c /Users/anjiawei/weiyun/office/mysrc/toolkit/toolkit.conf

echo "Nginx 已启动，网站托管在 http://localhost"