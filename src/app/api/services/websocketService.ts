/**
 * WebSocket Service
 * Handles real-time data connection from ws://localhost:8080/ws
 */

export interface WebSocketData {
  id?: string;
  timestamp?: number;
  type?: string;
  value?: any;
  [key: string]: any;
}

export interface WebSocketMessage {
  type: string;
  data: WebSocketData;
  timestamp: number;
}

type WebSocketCallback = (data: WebSocketMessage) => void;
type WebSocketStatusCallback = (status: 'connected' | 'disconnected' | 'error') => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private url: string = 'ws://localhost:8080/ws';
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 3000;
  private messageCallbacks: Set<WebSocketCallback> = new Set();
  private statusCallbacks: Set<WebSocketStatusCallback> = new Set();
  private isIntentionallyClosed: boolean = false;

  /**
   * Connect to WebSocket server
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.isIntentionallyClosed = false;
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          console.log('[WebSocket] Connected to server');
          this.reconnectAttempts = 0;
          this.notifyStatusCallbacks('connected');
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data) as WebSocketMessage;
            console.log('[WebSocket] Received message:', message);
            this.notifyMessageCallbacks(message);
          } catch (error) {
            console.error('[WebSocket] Failed to parse message:', error, event.data);
          }
        };

        this.ws.onerror = (error) => {
          console.error('[WebSocket] Error:', error);
          this.notifyStatusCallbacks('error');
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('[WebSocket] Disconnected from server');
          this.notifyStatusCallbacks('disconnected');
          
          // Auto-reconnect if not intentionally closed
          if (!this.isIntentionallyClosed && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.scheduleReconnect();
          }
        };
      } catch (error) {
        console.error('[WebSocket] Connection error:', error);
        reject(error);
      }
    });
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    this.isIntentionallyClosed = true;
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  /**
   * Schedule automatic reconnection
   */
  private scheduleReconnect(): void {
    this.reconnectAttempts++;
    console.log(
      `[WebSocket] Reconnecting... (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`
    );
    
    setTimeout(() => {
      this.connect().catch((error) => {
        console.error('[WebSocket] Reconnection failed:', error);
      });
    }, this.reconnectDelay * this.reconnectAttempts);
  }

  /**
   * Send a message to the server
   */
  send(message: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        const data = typeof message === 'string' ? message : JSON.stringify(message);
        this.ws.send(data);
        console.log('[WebSocket] Message sent:', message);
      } catch (error) {
        console.error('[WebSocket] Failed to send message:', error);
      }
    } else {
      console.warn('[WebSocket] WebSocket is not connected');
    }
  }

  /**
   * Subscribe to WebSocket messages
   */
  onMessage(callback: WebSocketCallback): () => void {
    this.messageCallbacks.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.messageCallbacks.delete(callback);
    };
  }

  /**
   * Subscribe to connection status changes
   */
  onStatusChange(callback: WebSocketStatusCallback): () => void {
    this.statusCallbacks.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.statusCallbacks.delete(callback);
    };
  }

  /**
   * Notify all message callbacks
   */
  private notifyMessageCallbacks(message: WebSocketMessage): void {
    this.messageCallbacks.forEach((callback) => {
      try {
        callback(message);
      } catch (error) {
        console.error('[WebSocket] Error in message callback:', error);
      }
    });
  }

  /**
   * Notify all status callbacks
   */
  private notifyStatusCallbacks(status: 'connected' | 'disconnected' | 'error'): void {
    this.statusCallbacks.forEach((callback) => {
      try {
        callback(status);
      } catch (error) {
        console.error('[WebSocket] Error in status callback:', error);
      }
    });
  }

  /**
   * Get current connection status
   */
  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  /**
   * Get WebSocket ready state
   */
  getReadyState(): number {
    return this.ws?.readyState ?? WebSocket.CLOSED;
  }
}

export const websocketService = new WebSocketService();
export default websocketService;
