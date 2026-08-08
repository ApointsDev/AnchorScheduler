> 父文档：[API 文档](README.md)

---

## 十四、算法

> 全部需认证，挂载于 `/api/algorithms/*` 🔒

### `POST /api/algorithms/optimize-schedule`
```
Body: { tasks, fixedEvents, availableSlots, dependencies? }
Response: { success, assignments: { taskId: slotId } }
```
个人日程优化：根据任务、固定事件、可用时段给出最优安排。

### `POST /api/algorithms/schedule-meeting`
```
Body: { teamMembers, requirements: { duration, windowStart, windowEnd }, weights }
Response: { success, result: { optimalTime, participants, adjustments, totalCost } }
```
团队会议安排：找到最佳会议时间。

### `POST /api/algorithms/critical-path`
```
Body: { tasks: [{ id, duration, dependencies }], startDate }
Response: { success, result: { criticalPath, projectDuration, slackTimes, ... } }
```
项目关键路径分析。

### `POST /api/algorithms/community-detection`
```
Body: { tasks: [{ id, type, duration, tags }] }
Response: { success, communities }
```
任务社区发现：聚类相关任务。

### `POST /api/algorithms/analyze-energy`
基于历史任务数据识别用户高能时段。

### `POST /api/algorithms/schedule-tasks`
```
Body: { tasks, config: { workHours, preferences } }
Response: { success, scheduledTasks, metrics }
```
完整个人任务调度。

### `POST /api/algorithms/schedule-team-tasks`
```
Body: { members, meetingDetails, config }
Response: { success, result: { schedule, adjustments } }
```
完整团队任务调度。

---

## 十五、豆包多模态

> 全部需认证，挂载于 `/api/doubao/*` 🔒

### `POST /api/doubao/chat`
```
Body: FormData { image?, audio?, prompt }
Response: SSE 流
```
多模态对话（图片/音频 + 文字）。

### `POST /api/doubao/chat/text`
```
Body: { messages, stream? }
Response: SSE 流 或 JSON
```
纯文本豆包对话。

### `GET /api/doubao/status`
```
Response: { available, model }
```
检查豆包 API 状态。

---

## 十六、语音识别（讯飞）

> 全部需认证，挂载于 `/api/speech/*` 🔒  
> 默认模式 `classic`：语音听写流式版（`iat-api.xfyun.cn/v2/iat`）  
> 可选模式 `spark`：大模型多语种（需控制台单独开通，`XFYUN_IAT_MODE=spark`）  
> 限制：音频 ≤60s，格式 PCM(raw) 或 MP3(lame)，采样率 8k/16k，16bit 单声道

### `GET /api/speech/status`
```
Response: { configured, provider, mode, host, supportedFormats, maxDurationSec, sampleRates }
```
检查讯飞语音识别是否已配置。

### `POST /api/speech/recognize`
```
Body (multipart/form-data):
  file | audio: 音频文件（wav/pcm/mp3）
  language?: zh | en | zh_cn | en_us | zh|en
  sampleRate?: 16000 | 8000
  encoding?: raw | lame
  eos?: number  # 静音结束毫秒

Body (JSON 亦可):
  { audio: base64, mimeType?, filename?, language?, sampleRate?, encoding?, eos? }

Response: {
  success: true,
  text: string,
  sid?: string,
  segments?: [{ word, language? }],
  encoding, sampleRate, mode
}
```
上传短音频，返回识别文本。

---

## 十七、MCP

> 挂载于 `/api/mcp/*`

### `GET /api/mcp/sse` 🔒
```
Query: sessionId?
Response: SSE 流
```
启动 MCP SSE 会话。

### `POST /api/mcp/messages`
```
Query: sessionId
Body: JSON-RPC message
```
接收 MCP 客户端消息。

---

## 十八、Ebridge 代理

> 挂载于 `/api/ebridge/*`

### `ALL /api/ebridge/proxy/:domain/:rest*`
反向代理到 XJTLU ebridge/uim 服务。

### `POST /api/ebridge/save-url` 🔒
```
Body: { url }
```
保存课表 URL。

---

## 十三、分享

> 完整接口见 [share.md](share.md)。

### `POST /api/share/create` 🔒
```
Body: { name?, dateStart?, dateEnd?, taskIds?, expiresInDays? }
Response: { token, shareUrl, expiresAt }
```
创建日程分享链接（按日期区间 / 指定任务 / 全部日程）。

### `GET /api/share/list` 🔒
```
Response: { shares: [...] }
```
获取当前用户的所有分享链接。

### `DELETE /api/share/:token` 🔒
删除指定分享链接（仅限本人）。

### `GET /api/share/view/:token`
无需认证。通过 token 查看分享的日程（脱敏数据）。
