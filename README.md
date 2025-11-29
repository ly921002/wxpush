# 微信推送 Worker

一个基于 Cloudflare Workers 的微信模板消息推送服务，支持通过 API 调用向指定微信用户发送模板消息。

## 功能特性

- 🔔 微信模板消息推送
- ⚡ 基于 Cloudflare Workers，快速响应  
- 🔄 自动缓存 access_token（110分钟）
- 📨 简单的 RESTful API 接口
- 🕐 自动使用北京时间戳

## 快速开始

### 前置要求

1. 微信公众平台账号（服务号或订阅号）
2. Cloudflare 账号
3. 微信模板消息权限（已申请模板）

### 环境变量配置

在 Cloudflare Worker 中设置以下环境变量：

| 变量名 | 说明 | 获取方式 |
|--------|------|----------|
| `APP_ID` | 微信公众号 AppID | 微信公众平台 → 开发 → 基本配置 |
| `APP_SECRET` | 微信公众号 AppSecret | 微信公众平台 → 开发 → 基本配置 |
| `OPENID` | 接收消息的用户 OpenID | 微信公众平台 → 用户管理 |
| `TEMPLATE_ID` | 消息模板 ID | 微信公众平台 → 功能 → 模板消息 |

### 部署步骤

1. 在 Cloudflare Dashboard 中创建新的 Worker
2. 将代码复制到代码编辑器中
3. 在「设置」→「变量」中配置上述环境变量
4. 部署 Worker

## API 使用说明

### 发送消息

**Endpoint:** `POST /send`

**请求体 (JSON):**

json
{
"key": "要发送的消息内容"
}

**成功响应:**

json
{
"errcode": 0,
"errmsg": "ok",
"msgid": 1234567890
}

**示例请求:**

bash
curl -X POST https://your-worker.your-subdomain.workers.dev/send\
-H "Content-Type: application/json" \
-d '{"key": "这是一条测试消息"}'

## 消息模板配置

在微信公众平台配置模板消息，模板需要包含以下变量：

- `time` - 消息发送时间
- `text` - 消息内容

示例模板格式：

发送时间：{{time.DATA}}
消息内容：{{text.DATA}}

## 错误代码说明

| HTTP 状态码 | 说明 |
|------------|------|
| 400 | 缺少 key 参数 |
| 500 | 获取微信 access_token 失败 |

## 使用场景

- 服务器监控告警
- 自动化任务通知  
- 系统状态报告
- 自定义消息推送

## 注意事项

1. 微信模板消息有每日发送限制，请合理使用
2. access_token 会自动缓存，无需手动管理
3. 确保微信公众号已获得模板消息接口权限
4. 用户需要关注公众号才能接收消息

## 许可证

MIT License
