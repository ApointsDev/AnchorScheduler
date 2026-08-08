> 父文档：[API 文档](README.md)

---

## 文件上传（日程附件存档）

> 全部需认证 🔒，且需 **银锚会员及以上**（`featureAccess.attachments === true`）

用于把文件上传到服务器存档，生成可直接写入日程（Task）`attachments` 数组的 URL。
附件落盘在 `private/uploads/schedule-attachments/`，通过 `/uploads/*` 静态服务对外访问。

### `POST /api/uploads` — 上传文件

```
Body: multipart/form-data，字段 file（单文件）
Response (201): {
  url: string,          // 可直接写入 task.attachments 的完整 URL
  name: string,         // 原始文件名
  size: number,         // 字节数
  mimeType: string,
  uploadedAt: string    // ISO 时间
}
```

- 单文件大小上限 **20MB**
- 仅支持"存档类"文件类型（文档 / 图片 / 压缩包），白名单：

| 类别 | 类型 |
|------|------|
| 文档 | PDF、DOC、DOCX、XLS、XLSX、PPT、PPTX、TXT、MD、CSV、JSON |
| 图片 | JPEG、PNG、GIF、WebP、BMP |
| 压缩包 | ZIP、RAR、7Z、TAR、GZ |

- 拒绝 HTML/JS/SVG/XML 及可执行文件等，避免经静态服务被当作脚本执行或注入
- 返回的 `url`（如 `/uploads/schedule-attachments/sched-<userId>-<ts>-<rand>.pdf`）
  可通过 `PUT /api/tasks/:id` 的 `attachments` 字段绑定到日程（上限 50 项）
- 无权限：`403 { error: "附件上传为银锚会员及以上权益" }`
- 超大小：`400 { error: "文件不能超过 20MB" }`

### `GET /api/uploads` — 列出我的附件

```
Response: { files: Array<{ url, name, size, uploadedAt }> }
```

按上传时间倒序返回当前用户上传的全部附件。

### `DELETE /api/uploads/:filename` — 删除附件

```
Response: { success: true, url }
```

仅允许删除当前用户上传的文件（校验文件名归属）；文件不存在或越权返回 `404`。
删除后请同步从对应日程的 `attachments` 中移除该 URL，避免留下失效引用。
