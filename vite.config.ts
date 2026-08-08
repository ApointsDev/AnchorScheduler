import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // 远程/SSH 挂载文件系统下 chokidar 事件通知不可靠，
    // 启用轮询以正确检测新建/变更文件（如新增的样式文件）
    watch: {
      usePolling: true,
      interval: 300,
    },
    proxy: {
      '/api/ebridge': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      '/api': {
        target: 'https://api.schedule.apoints.cn',
        changeOrigin: true
      }
    }
  }
})
