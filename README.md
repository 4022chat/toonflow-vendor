# Toonflow 非官方供应商列表

> 为 [Toonflow-app](https://github.com/HBAI-Ltd/Toonflow-app) 提供的非官方供应商配置集合。

[Toonflow](https://github.com/HBAI-Ltd/Toonflow-app) 是一款 AI 短剧漫剧工具，可将小说自动转化为剧本，并结合 AI 图片与视频生成能力，完成从文字到影像的短剧创作流程。

---

## 一键导入

将供应商文件 URL 复制到 Toonflow，即可完成导入。

浏览供应商文件：[https://tf.kaipai.vip](https://tf.kaipai.vip)


### 稳定推荐：OpenNexAPI

- 覆盖模型：Gemini、ChatGPT、Claude、Nano Banana、Seedance、Index TTS 等
- 一个 Key 即可接入多类模型
- 速度快、服务稳定、配置简单

前往 [OpenNexAPI](https://api.opennex.top/register?aff=gYGC) 注册账号后即可使用。

### 内测尝鲜：OOPC API

- 覆盖多类模型，一个 Key 即可接入
- 注册赠送 `2` 🔪试用额度，可免费生成 `50` 张 GPT Image 2 图片
- 多渠道接入，价格实惠
- GPT Image 2 生图低至 `0.04`/张
- Nano Banana 生图低至 `0.1`/张

前往 [OOPC API](https://api.oopc.top) 注册账号后即可使用。

> **提示**：暂不对外开放注册；可联系微信 `jxppro` 获取内测账号。

---

## 供应商列表

站点默认展示 **ToonFlow 2.0** 供应商，旧版供应商保留在独立页面，两套适配文件互不干扰。

- **2.0 供应商**：[https://tf.kaipai.vip](https://tf.kaipai.vip) —— 存放于 `media`，适用于 **ToonFlow 2.0 及以上**客户端
- **旧版供应商**：[https://tf.kaipai.vip/legacy](https://tf.kaipai.vip/legacy) —— 后缀 `.ts`，适用于 **ToonFlow 1.1.8 及更早版本**

> **两版适配文件后缀都是 `.ts`**，区别只在存放目录与内部结构（2.0 为 `ProviderDefinition` 对象，旧版为 `vendor` 对象）。**请勿混用** —— 把 2.0 文件导入旧客户端（或反之）会直接报错。

两个版本各自使用独立的 HTML 页面，互不影响：

| 页面 | 文件 | 路由 | 内容 |
| --- | --- | --- | --- |
| 2.0 首页 | [`index.html`](./index.html) | `/` | ToonFlow 2.0 供应商（`.ts`） |
| 旧版页 | [`legacy.html`](./legacy.html) | `/legacy`、`/1.0`、`/1.1`、`/1.1.8`、`/v1` | 旧版供应商（`.ts`） |

`/legacy` 等路由由 [`_redirects`](./_redirects) 转发到 `legacy.html`；页面内的版本切换链接一律使用相对路径（`legacy.html` / `./`），因此即使转发规则未生效，旧版入口依然可以打开。

### ToonFlow 2.0（`media`）

适配文件存放在 [`/media`](./media) 目录，目录名与文件名均等于 `provider.id`。

| 供应商 | 配置目录 | 说明 |
| --- | --- | --- |
| OpenNexAPI | [`./media/opennex`](./media/opennex) | 稳定供应商 |
| OOPC | [`./media/oopc`](./media/oopc) | 内测尝鲜，价格低但不稳定 |

### 旧版（`.ts`，ToonFlow 1.1.8 系统）

适配文件存放在 [`/store`](./store) 目录下（`media` 除外，该目录为早期 2.0 适配文件的备份）。

| 供应商 | 配置目录 | 说明 |
| --- | --- | --- |
| OpenNexAPI | [`./store/opennex`](./store/opennex) | 稳定供应商 |
| Grok2API | [`./store/grok`](./store/grok) | Grok2API |
| minimax-h3 | [`./store/minimax-h3`](./store/minimax-h3) | minimax-h3 |
| OOPC | [`./store/oopc`](./store/oopc) | 内测尝鲜，价格低但不稳定 |


---

## 相关推荐

- [开拍漫剧导航](https://www.kaipai.vip)
- [OPC 工具箱](https://www.oopc.top)
