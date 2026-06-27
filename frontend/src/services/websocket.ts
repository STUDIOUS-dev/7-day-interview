export class WebSocketService {
  private ws: WebSocket | null = null;
  private url: string;
  private onMessageCallback: ((data: any) => void) | null = null;
  private onDisconnectCallback: (() => void) | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;

  constructor(url: string) {
    this.url = url;
  }

  connect(token: string) {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    this.ws = new WebSocket(`${this.url}?token=${token}`);

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (this.onMessageCallback) this.onMessageCallback(data);
      } catch (e) {
        console.error('Failed to parse WS message', e);
      }
    };

    this.ws.onclose = () => {
      if (this.onDisconnectCallback) this.onDisconnectCallback();
      this.reconnect(token);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  private reconnect(token: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        this.connect(token);
      }, Math.pow(2, this.reconnectAttempts) * 1000); // Exponential backoff
    }
  }

  send(data: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  onMessage(callback: (data: any) => void) {
    this.onMessageCallback = callback;
  }

  onDisconnect(callback: () => void) {
    this.onDisconnectCallback = callback;
  }

  disconnect() {
    if (this.ws) {
      this.ws.onclose = null; // Prevent reconnect logic
      this.ws.close();
      this.ws = null;
    }
  }
}
