/**
 * LEXIO — IndexedDB Storage
 */

const DB = (() => {
  const DB_NAME = 'lexio_v1';
  const DB_VER  = 1;
  let _db = null;

  async function open() {
    if (_db) return _db;
    return new Promise((res, rej) => {
      const req = indexedDB.open(DB_NAME, DB_VER);
      req.onupgradeneeded = e => {
        const d = e.target.result;
        if (!d.objectStoreNames.contains('kv')) {
          d.createObjectStore('kv', { keyPath: 'k' });
        }
      };
      req.onsuccess = e => { _db = e.target.result; res(_db); };
      req.onerror   = () => rej(new Error('DB open failed'));
    });
  }

  async function get(key) {
    const db = await open();
    return new Promise((res) => {
      const tx  = db.transaction('kv', 'readonly');
      const req = tx.objectStore('kv').get(key);
      req.onsuccess = e => res(e.target.result ? e.target.result.v : null);
      req.onerror   = () => res(null);
    });
  }

  async function set(key, value) {
    const db = await open();
    return new Promise((res) => {
      const tx = db.transaction('kv', 'readwrite');
      tx.objectStore('kv').put({ k: key, v: value });
      tx.oncomplete = () => res(true);
      tx.onerror    = () => res(false);
    });
  }

  return { get, set };
})();
