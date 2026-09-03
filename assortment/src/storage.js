// Browser replacement for the prototype host's `window.storage` API.
// Values persist locally under a namespace so saved layouts survive reloads.
const prefix = "shelves-builder:";

const storage = {
  async get(key) {
    const value = window.localStorage.getItem(prefix + key);
    return value === null ? null : { value };
  },
  async set(key, value) {
    window.localStorage.setItem(prefix + key, value);
  },
  async delete(key) {
    window.localStorage.removeItem(prefix + key);
  },
  async list(keyPrefix = "") {
    const keys = [];
    for (let index = 0; index < window.localStorage.length; index += 1) {
      const storedKey = window.localStorage.key(index);
      if (storedKey?.startsWith(prefix + keyPrefix)) keys.push(storedKey.slice(prefix.length));
    }
    return { keys };
  },
};

window.storage ??= storage;
