// ==========================================
// AppController 主控制器扩展
// ==========================================
// 注意：此文件扩展 app.js 中已定义的 AppController 对象
// 避免重复定义，只添加新增的方法

// 🚨 核心修复：直接执行扩展逻辑，不套 DOMContentLoaded，确保在 app.js 初始化前完成劫持
if (typeof window.AppController === 'undefined') {
    console.error('❌ app.js 未加载，请检查 index.html 中的 <script> 加载顺序！');
} else {
    // 扩展 AppController
    const AppController = window.AppController;

    // 在 AppController 顶部新增属性
    AppController.isViewingMode = false;

    // 新增方法：切换观赏模式的 UI 限制
    AppController.applyViewingMode = function(isViewing) {
        this.isViewingMode = isViewing;
        window.isViewingMode = isViewing; // 双重全局绑定确保万无一失
        
        const tools = document.querySelectorAll('[id^="tool-"]');
        const clearBtn = document.getElementById('clearBtn');
        
        tools.forEach(t => t.style.display = isViewing ? 'none' : '');
        if (clearBtn) clearBtn.style.display = isViewing ? 'none' : '';
        
        const startBtn = document.querySelector('button[onclick*="saveRoutine"]') || 
                         document.querySelector('button[onclick*="showFinalScoreBoard"]') ||
                         document.getElementById('submitRoutineBtn');
                         
        if (startBtn) {
            startBtn.innerHTML = isViewing ? '🍿 开始观赏成套' : '✅ 完成编排并计算最终成绩';
            if (isViewing) {
                // 🟢 修复：观赏模式下，点击底部大按钮应正式触发动画演示引擎！
                startBtn.onclick = () => {
                    AppController.triggerFinishAnimation();
                };
            } else {
                startBtn.onclick = () => window.saveRoutine();
            }
        }
    };

    // 触发完成动画
    AppController.triggerFinishAnimation = function() {
        // 这里应该包含动画演示逻辑
        if (typeof ToastManager !== 'undefined') {
            ToastManager.show('success', '开始观赏', '🎬 正在启动成套动画演示...', 3000);
        }
        // 注意：如果在 app.js 里已有实际的 triggerFinishAnimation 动画逻辑，
        // 请确保不要用这几行空代码覆盖它。如果 app.js 里没有，就保留这行占位。
    };

    // 模态框数据（如果不存在则创建）
    if (!AppController.modal) {
        AppController.modal = {
            currentTrackId: null,
            skills: [],
            connectionType: 'direct'
        };
    }

    // 🌟 保存原始 init 方法，准备进行“狸猫换太子”
    const originalInit = AppController.init;
    
    // 扩展初始化方法
    AppController.init = function() {
        // 先乖乖调用 app.js 里的原始 init 方法
        if (typeof originalInit === 'function') {
            originalInit.call(this);
        }
        
        // 然后夹带咱们的“私货”：添加额外的初始化逻辑
        if (typeof CoinManager !== 'undefined') {
            CoinManager.checkDailyLogin(); // 每日登录给钱！
        }
        
        // 绑定字典搜索与过滤的监听器
        const searchInput = document.getElementById('searchInput');
        const groupFilter = document.getElementById('groupFilter');
        const diffFilter = document.getElementById('diffFilter');
        
        if (searchInput) searchInput.addEventListener('input', () => this.filterDictionary());
        if (groupFilter) groupFilter.addEventListener('change', () => this.filterDictionary());
        if (diffFilter) diffFilter.addEventListener('change', () => this.filterDictionary());
    };

    console.log('✅ AppController 扩展引擎挂载完成！');
}