class PubSub<T> {
  private subscribers = new Map<string, Set<(data: T) => void>>()

  on(topic: string, callback: (data: T) => void) {
    if (!this.subscribers.has(topic)) {
      this.subscribers.set(topic, new Set())
    }
    this.subscribers.get(topic)?.add(callback)
  }

  emit(topic: string, data: T) {
    this.subscribers.get(topic)?.forEach((callback) => callback(data))
  }

  off(topic: string, callback: (data: T) => void) {
    this.subscribers.get(topic)?.delete(callback)
  }
}

export const errorBus = new PubSub<string>()
