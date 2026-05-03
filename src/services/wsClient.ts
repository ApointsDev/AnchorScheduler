type MessageHandler = (data: any) => void;

class WSClient {
  private socket: WebSocket | null = null;
  private url: string | null = null;
  private token: string | null = null;
  private reconnectDelay = 1000;
  private maxReconnect = 30000;
  private handlers: Map<string, Set<MessageHandler>> = new Map();
  private globalHandlers: Set<MessageHandler> = new Set();
  private isClosing = false;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 50;
  private stableTimer: ReturnType<typeof setTimeout> | null = null;
  private wasStable = false;

  connectIfNeeded(token: string) {
    if (!token) return;
    if (this.socket && this.token === token &&
        (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) return;
    this.token = token;
    const isDev = import.meta.env.VITE_DEV_MODE === 'true';
    const baseUrl = isDev ? 'http://localhost:3000' : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000');
    this.url = baseUrl.replace(/^http/, 'ws').replace(/^https/, 'wss') + `/ws?token=${token}`;
    this.isClosing = false;
    this.reconnectAttempts = 0;
    this.wasStable = false;
    this.setupSocket();
  }

  private setupSocket() {
    if (!this.url) return;
    try {
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;
      }
      if (this.stableTimer) {
        clearTimeout(this.stableTimer);
        this.stableTimer = null;
      }
      if (this.socket) {
        try { this.socket.close(); } catch(_) {}
        this.socket = null;
      }
      this.socket = new WebSocket(this.url);
      this.socket.onopen = () => {
        this.stableTimer = setTimeout(() => {
          this.reconnectDelay = 1000;
          this.reconnectAttempts = 0;
          this.wasStable = true;
        }, 5000);
      };
      this.socket.onmessage = (evt) => {
        try {
          const data = JSON.parse(evt.data);
          if (data && data.type === 'ping') {
            this.send({ type: 'pong' });
          }
          this.dispatch(data);
        } catch (e) {
          // ignore
        }
      };
      this.socket.onclose = () => {
        if (this.isClosing) return;
        if (this.stableTimer) {
          clearTimeout(this.stableTimer);
          this.stableTimer = null;
        }
        this.reconnectAttempts++;
        if (this.reconnectAttempts > this.maxReconnectAttempts) {
          console.warn('WebSocket max reconnect attempts reached, giving up');
          return;
        }
        if (!this.wasStable) {
          this.reconnectDelay = Math.min(this.reconnectDelay * 1.5, this.maxReconnect);
        }
        this.reconnectTimer = setTimeout(() => {
          this.setupSocket();
        }, this.reconnectDelay);
      };
      this.socket.onerror = () => {
        // close will trigger reconnect
      };
    } catch (e) {
      this.reconnectTimer = setTimeout(() => this.setupSocket(), this.reconnectDelay);
    }
  }

  private send(obj: any) {
    try {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify(obj));
      }
    } catch (e) {
      // ignore send errors
    }
  }

  disconnect() {
    this.isClosing = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.stableTimer) {
      clearTimeout(this.stableTimer);
      this.stableTimer = null;
    }
    if (this.socket) {
      try { this.socket.close(); } catch(_) {}
      this.socket = null;
    }
  }

  subscribe(type: string | null, handler: MessageHandler) {
    if (!type) {
      this.globalHandlers.add(handler);
      return () => this.globalHandlers.delete(handler);
    }
    if (!this.handlers.has(type)) this.handlers.set(type, new Set());
    this.handlers.get(type)!.add(handler);
    return () => this.handlers.get(type)!.delete(handler);
  }

  private dispatch(data: any) {
    // call global handlers
    for (const h of this.globalHandlers) {
      try { h(data); } catch(_) {}
    }
    if (!data || !data.type) return;
    const set = this.handlers.get(data.type);
    if (!set) return;
    for (const h of set) {
      try { h(data); } catch(_) {}
    }
  }
}

const wsClient = new WSClient();
export default wsClient;
