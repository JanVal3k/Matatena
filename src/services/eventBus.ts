type EventCallback = (...args: any[]) => void;
type EventMap = Record<string, EventCallback[]>;

class EventBus {
  private events: EventMap = {};

  on(event: string, callback: EventCallback) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(callback);
    return this;
  }

  emit(event: string, ...args: any[]) {
    const callbacks = this.events[event];
    if (callbacks) {
      callbacks.forEach((cb) => cb(...args));
    }
    return this;
  }

  off(event: string, callback: EventCallback) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter((c) => c !== callback);
    return this;
  }
}

export const eventBus = new EventBus();