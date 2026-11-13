// Binary comic artwork stays in IndexedDB rather than inflating the project JSON.
const AssetStore = {
  database: null,
  open() {
    if (this.database) return Promise.resolve(this.database);
    if (!('indexedDB' in window)) return Promise.reject(new Error('This browser does not support local image storage.'));
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('comicforge-assets', 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('images')) db.createObjectStore('images', { keyPath: 'id' });
      };
      request.onsuccess = () => { this.database = request.result; resolve(this.database); };
      request.onerror = () => reject(request.error || new Error('Could not open local image storage.'));
    });
  },
  async save(id, file) {
    if (!file || !file.type.startsWith('image/')) throw new Error('Choose an image file.');
    if (file.size > 15 * 1024 * 1024) throw new Error('Images must be 15 MB or smaller.');
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('images', 'readwrite');
      tx.objectStore('images').put({ id, name: file.name, type: file.type, blob: file, updatedAt: new Date().toISOString() });
      tx.oncomplete = () => resolve(id);
      tx.onerror = () => reject(tx.error || new Error('Could not save image.'));
      tx.onabort = () => reject(tx.error || new Error('Image save was cancelled.'));
    });
  },
  async get(id) {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const request = db.transaction('images', 'readonly').objectStore('images').get(id);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error || new Error('Could not read image.'));
    });
  },
  async delete(id) {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('images', 'readwrite');
      tx.objectStore('images').delete(id);
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error || new Error('Could not delete image.'));
    });
  }
};
