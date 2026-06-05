// ==========================================
// 音乐大文件本地存储引擎 (music_manager.js)
// 基于 IndexedDB，突破 5MB 限制
// ==========================================

const MusicManager = {
    dbName: 'GymChoreoMusicDB',
    storeName: 'audioFiles',
    db: null,

    init: function() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    // keyPath 使用 id，方便后续读取
                    db.createObjectStore(this.storeName, { keyPath: 'id' });
                }
            };
            
            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve(this.db);
            };
            
            request.onerror = (event) => {
                console.error('IndexedDB 初始化失败', event);
                reject(event);
            };
        });
    },

    // 校验并保存音频 (限制 10MB，仅支持 mp3/wav/ogg)
    saveAudio: async function(file) {
        const MAX_SIZE = 10 * 1024 * 1024; // 10MB
        const validTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg'];

        if (!validTypes.includes(file.type)) {
            ToastManager.show('error', '格式不支持', '仅支持 MP3, WAV 或 OGG 格式的音频！');
            return null;
        }

        if (file.size > MAX_SIZE) {
            ToastManager.show('warning', '文件过大', '为了保证流畅度，请上传 10MB 以内的音频文件！');
            return null;
        }

        const audioId = 'music_' + Date.now();
        const record = {
            id: audioId,
            name: file.name,
            blob: file,
            size: file.size,
            uploadTime: new Date().getTime()
        };

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.add(record);

            request.onsuccess = () => {
                ToastManager.show('success', '上传成功', '音频已成功存入本地绝密档案库！');
                resolve(record);
            };
            request.onerror = () => reject('保存失败');
        });
    },

    // 获取所有本地音频列表
    getAllAudios: function() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject('读取失败');
        });
    },

    // 获取单个音频
    getAudio: function(audioId) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.get(audioId);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject('读取失败');
        });
    },

    // 删除音频
    deleteAudio: function(audioId) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.delete(audioId);

            request.onsuccess = () => resolve();
            request.onerror = () => reject('删除失败');
        });
    }
};

// 页面加载时初始化数据库
document.addEventListener('DOMContentLoaded', () => {
    MusicManager.init().catch(e => console.error(e));
});