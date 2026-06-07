// ==========================================
// 🧹 智能缓存管理器 - 优化存储占用
// ==========================================

window.CacheManager = {
    // 历史记录最大保存数
    MAX_HISTORY_ITEMS: 20,
    
    // 历史记录自动清理
    cleanOldHistory: function() {
        try {
            let history = JSON.parse(localStorage.getItem('gymChoreoHistory') || '[]');
            
            if (history.length > this.MAX_HISTORY_ITEMS) {
                // 保留最新的记录
                const cleanedHistory = history.slice(-this.MAX_HISTORY_ITEMS);
                localStorage.setItem('gymChoreoHistory', JSON.stringify(cleanedHistory));
                
                console.log(`🧹 缓存清理：删除了 ${history.length - this.MAX_HISTORY_ITEMS} 条旧记录`);
                return cleanedHistory.length;
            }
            
            return history.length;
        } catch (e) {
            console.error('清理历史记录失败', e);
            return 0;
        }
    },
    
    // 获取存储空间使用情况
    getStorageStats: async function() {
        let stats = {
            localStorage: {
                used: 0,
                limit: '5-10MB'
            },
            indexedDB: {
                count: 0,
                totalSize: 0,
                files: []
            }
        };
        
        // localStorage 统计
        try {
            let total = 0;
            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    total += localStorage[key].length * 2; // UTF-16
                }
            }
            stats.localStorage.used = (total / 1024).toFixed(2) + ' KB';
        } catch (e) {
            stats.localStorage.used = '未知';
        }
        
        // IndexedDB 统计
        if (typeof MusicManager !== 'undefined' && MusicManager.db) {
            try {
                const audios = await MusicManager.getAllAudios();
                stats.indexedDB.count = audios.length;
                let totalSize = 0;
                
                audios.forEach(audio => {
                    totalSize += audio.size;
                    stats.indexedDB.files.push({
                        name: audio.name,
                        size: (audio.size / 1024 / 1024).toFixed(2) + ' MB'
                    });
                });
                
                stats.indexedDB.totalSize = (totalSize / 1024 / 1024).toFixed(2) + ' MB';
            } catch (e) {
                // 忽略
            }
        }
        
        return stats;
    },
    
    // 清理缓存（保留最近使用）
    clearAllCache: function(keepRecent = true) {
        if (confirm('🧹 确定要清理缓存吗？\n\n[确定] = 保留最近 5 条编排记录，清空其他\n[取消] = 取消操作')) {
            
            // 清理历史记录
            let history = JSON.parse(localStorage.getItem('gymChoreoHistory') || '[]');
            if (keepRecent && history.length > 5) {
                history = history.slice(-5);
                localStorage.setItem('gymChoreoHistory', JSON.stringify(history));
            } else if (!keepRecent) {
                localStorage.removeItem('gymChoreoHistory');
            }
            
            // 重置教程
            localStorage.removeItem('tutorialStatus');
            
            ToastManager.show('success', '清理完成', '缓存已成功清理！');
            
            return true;
        }
        
        return false;
    },
    
    // 初始化
    init: function() {
        // 页面加载时自动清理
        setTimeout(() => {
            this.cleanOldHistory();
            console.log('🧹 缓存管理器已启动');
        }, 1000);
        
        // 定期检查（每 30 分钟）
        setInterval(() => {
            this.cleanOldHistory();
        }, 30 * 60 * 1000);
    }
};

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    CacheManager.init();
});

// 显示缓存统计
window.showCacheStats = async function() {
    const card = document.getElementById('cacheStatsCard');
    if (card) {
        card.classList.remove('hidden');
        
        const stats = await CacheManager.getStorageStats();
        
        const lsEl = document.getElementById('localStorageSize');
        const hcEl = document.getElementById('historyCount');
        const mfEl = document.getElementById('musicFileCount');
        
        if (lsEl) lsEl.textContent = stats.localStorage.used;
        if (hcEl) hcEl.textContent = (stats.history || []).length + ' 条';
        if (mfEl) mfEl.textContent = stats.indexedDB.count + ' 首';
    }
};
