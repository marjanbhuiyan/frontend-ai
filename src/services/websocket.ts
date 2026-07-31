/**
 * WebSocket service — placeholder.
 *
 * Replace this with a real WebSocket connection manager when needed.
 * Typical responsibilities:
 * - Connect / disconnect
 * - Auto-reconnect with backoff
 * - Subscribe / unsubscribe to channels
 * - Dispatch incoming messages to the appropriate feature store
 */

export function createWebSocket(_url: string): {
  connect(): void;
  disconnect(): void;
  send(_data: unknown): void;
  subscribe(_channel: string, _callback: (data: unknown) => void): void;
} {
  // TODO: implement WebSocket connection
  return {
    connect() {},
    disconnect() {},
    send(_data: unknown) {},
    subscribe(_channel: string, _callback: (data: unknown) => void) {},
  };
}
