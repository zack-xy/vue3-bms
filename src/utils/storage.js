import config from '@/config';
export default {
  getStorage () {
    const storage = window.localStorage.getItem(config.namespace) || "{}"
    return JSON.parse(storage)
  },
  setItem (key, val) {
    const storage = this.getStorage()
    storage[key] = val
    window.localStorage.setItem(config.namespace, JSON.stringify(storage))
  },
  getItem (key) {
    return this.getStorage()[key]
  },
  clearItem (key) {
    const storage = this.getStorage()
    delete storage[key]
  },
  clearAll () {
    window.localStorage.clear()
  }
}