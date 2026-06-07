// ==========================================
// 🚀 网站性能监控系统
// ==========================================

window.PerformanceMonitor = {
    // 记录页面加载完成时间
    pageLoadTime: 0,
    
    // 记录性能数据
    recordPerformance: function() {
        const perfData = performance.timing;
        
        // 计算页面加载时间
        this.pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        
        console.log('🚀 性能数据收集完成');
    },
    
    // 显示性能信息
    showPerformanceStats: function() {
        this.recordPerformance();
        
        // 移除旧面板
        const oldPanel = document.getElementById('performancePanel');
        if (oldPanel) oldPanel.remove();
        
        // 创建面板
        const panel = document.createElement('div');
        panel.id = 'performancePanel';
        panel.className = 'fixed bottom-24 right-6 bg-white rounded-xl shadow-2xl p-5 z-[9997] max-w-xs border border-slate-200';
        panel.innerHTML = `
            <h3 class="font-black text-slate-800 mb-3 flex items-center gap-2">
                🚀 性能监控
            </h3>
            <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                    <span class="text-slate-600 font-bold">页面加载</span>
                    <span class="text-green-600 font-black">${this.pageLoadTime}ms</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-slate-600 font-bold">DOM 加载</span>
                    <span class="text-blue-600 font-black">${performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart}ms</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-slate-600 font-bold">内存使用</span>
                    <span class="text-purple-600 font-black">${this.getMemoryUsage()}</span>
                </div>
            </div>
            <div class="mt-4 flex gap-2">
                <button id="perfCloseBtn" class="flex-1 bg-slate-100 text-slate-700 py-2 rounded-lg font-bold hover:bg-slate-200 transition-all cursor-pointer">
                    关闭
                </button>
                <button id="perfRefreshBtn" class="flex-1 bg-blue-500 text-white py-2 rounded-lg font-bold hover:bg-blue-600 transition-all cursor-pointer">
                    刷新
                </button>
            </div>
        `;
        
        document.body.appendChild(panel);
        
        // 绑定事件
        document.getElementById('perfCloseBtn').addEventListener('click', () => this.close());
        document.getElementById('perfRefreshBtn').addEventListener('click', () => this.refresh());
    },
    
    // 获取内存使用
    getMemoryUsage: function() {
        if (performance.memory) {
            const used = performance.memory.usedJSHeapSize / 1024 / 1024;
            const total = performance.memory.jsHeapSizeLimit / 1024 / 1024;
            return `${used.toFixed(1)}MB / ${total.toFixed(0)}MB`;
        }
        return '不可用';
    },
    
    // 关闭面板
    close: function() {
        const panel = document.getElementById('performancePanel');
        if (panel) panel.remove();
    },
    
    // 刷新
    refresh: function() {
        this.close();
        this.showPerformanceStats();
    }
};

// 页面加载完成后自动记录性能
window.addEventListener('load', () => {
    setTimeout(() => {
        PerformanceMonitor.recordPerformance();
    }, 1000);
});
