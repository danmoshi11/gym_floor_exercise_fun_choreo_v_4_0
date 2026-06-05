// ==========================================
// 草稿纸管理器 (WorkspaceManager)
// ==========================================
window.WorkspaceManager = {
    MAX_WORKSPACES: 5,
    workspaces: [],
    currentIndex: 0,

    init: function() {
        // 初始化默认的第一张草稿纸
        this.workspaces = [{
            id: 'ws_' + Date.now(),
            name: '草稿 1',
            routineData: window.currentRoutineData ? JSON.parse(JSON.stringify(window.currentRoutineData)) : {},
            tracks: [] 
        }];
        this.renderSidebar();
    },

    // 核心：静默保存当前画板的一切状态到当前草稿纸
    saveCurrentState: function() {
        if (!this.workspaces[this.currentIndex]) return;
        this.workspaces[this.currentIndex].tracks = JSON.parse(JSON.stringify(typeof canvasManager !== 'undefined' ? canvasManager.tracks : []));
        this.workspaces[this.currentIndex].routineData = JSON.parse(JSON.stringify(window.currentRoutineData || {}));
        // 同步用户可能修改过的成套名称
        this.workspaces[this.currentIndex].name = window.currentRoutineData.name || `草稿 ${this.currentIndex + 1}`;
    },

    // 渲染左侧抽屉 UI
    renderSidebar: function() {
        const countEl = document.getElementById('workspaceCount');
        if (countEl) countEl.innerText = this.workspaces.length;

        const listEl = document.getElementById('workspaceList');
        if (!listEl) return;

        let html = '';
        this.workspaces.forEach((ws, idx) => {
            const isActive = (idx === this.currentIndex);
            const bgClass = isActive ? 'bg-blue-50 border-blue-400' : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50';
            const textClass = isActive ? 'text-blue-700' : 'text-slate-600';
            const indicator = isActive ? '(当前激活)' : '';

            html += `
                <div class="border-2 ${bgClass} p-3 rounded-xl shadow-sm relative group transition-colors">
                    <div class="cursor-pointer" onclick="WorkspaceManager.attemptSwitch(${idx})">
                        <div class="text-xs font-black ${textClass} mb-1">草稿 ${idx + 1} ${indicator}</div>
                        <div class="text-[10px] ${isActive ? 'text-blue-500' : 'text-slate-400'} truncate">${ws.name || '未命名成套'}</div>
                    </div>
                    ${!isActive ? `
                        <button onclick="WorkspaceManager.deleteWorkspace(${idx})" class="absolute top-2 right-2 text-slate-300 hover:text-red-500 hidden group-hover:block transition-colors" title="删除此草稿">
                            🗑️
                        </button>
                    ` : ''}
                </div>
            `;
        });
        listEl.innerHTML = html;
    },

    // 拦截 1：尝试切换到别的草稿纸
    attemptSwitch: function(targetIndex) {
        if (targetIndex === this.currentIndex) return; // 点自己不触发

        const choice = confirm(`⚠️ 切换草稿纸确认\n\n您正在离开【草稿 ${this.currentIndex + 1}】，准备切换到【草稿 ${targetIndex + 1}】。\n\n[确定] = 自动保存当前画板并切换\n[取消] = 留在当前画板继续编辑`);

        if (choice) {
            this.saveCurrentState();
            this.executeSwitch(targetIndex);
        }
    },

    // 拦截 2：尝试新建空白草稿纸
    attemptCreateNew: function() {
        // 严格执行 5 张草稿纸的上限锁
        if (this.workspaces.length >= this.MAX_WORKSPACES) {
            ToastManager.show('warning', '草稿纸数量已达上限', `系统最多仅支持同时开启 ${this.MAX_WORKSPACES} 张草稿纸！\n请先点击右上角的 🗑️ 删掉不需要的草稿，再尝试新建。`, 5000);
            return;
        }

        const choice = confirm(`📄 新建草稿纸确认\n\n您即将开启一张全新的空白草稿纸。\n（系统最多支持 ${this.MAX_WORKSPACES} 张，当前已用 ${this.workspaces.length} 张）。\n\n[确定] = 系统将自动保存您当前的进度，并清空画板为您准备新场地。\n[取消] = 返回当前画板`);

        if (choice) {
            this.saveCurrentState();
            
            // ✨【新增】：新建草稿纸后，询问用户是新建成套还是从历史导入
            this.showNewRoutineOptions();
        }
    },

    // ✨【新增】：新建草稿纸后的选项面板
    showNewRoutineOptions: function() {
        const optionsDiv = document.createElement('div');
        optionsDiv.id = 'newRoutineOptions';
        optionsDiv.innerHTML = `
            <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div class="bg-white rounded-2xl p-6 w-96 shadow-2xl">
                    <h3 class="text-xl font-bold text-slate-800 mb-4 text-center">🎯 开始新成套</h3>
                    <p class="text-sm text-slate-500 mb-6 text-center">请选择开始方式：</p>
                    
                    <div class="space-y-3">
                        <button onclick="WorkspaceManager.startNewBlankRoutine()" 
                                class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3">
                            <span class="text-2xl">📝</span>
                            <span>新建空白成套</span>
                        </button>
                        
                        <button onclick="WorkspaceManager.startFromHistory()" 
                                class="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold py-4 px-6 rounded-xl transition-all border-2 border-emerald-200 flex items-center justify-center gap-3">
                            <span class="text-2xl">📚</span>
                            <span>从历史记录导入</span>
                        </button>
                        
                        <button onclick="WorkspaceManager.closeNewRoutineOptions()" 
                                class="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 px-6 rounded-xl transition-all">
                            取消
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(optionsDiv);
    },

    // ✨【新增】：关闭选项面板
    closeNewRoutineOptions: function() {
        const el = document.getElementById('newRoutineOptions');
        if (el) el.remove();
    },

    // ✨【新增】：开始新建空白成套（显示初始化面板）
    startNewBlankRoutine: function() {
        this.closeNewRoutineOptions();
        
        // 新建配置并推入池子（未初始化状态）
        const newIndex = this.workspaces.length;
        this.workspaces.push({
            id: 'ws_' + Date.now(),
            name: `草稿 ${newIndex + 1}`,
            routineData: { 
                name: "未命名成套", 
                brand: "gymnova", 
                gymnastMode: "none", 
                gymnastName: "纯排位测试 (无E分)",
                initialized: false // ✨【新增】：标记为未初始化状态
            },
            tracks: [],
            scoreReport: null,
            eScoreReport: null,
            playbackMode: 'auto'
        });
        
        this.executeSwitch(newIndex);
        
        ToastManager.show('info', '新建草稿纸', '点击画板开始新建成套，或从历史导入现有成套！', 4000);
    },

    // ✨【新增】：从历史记录导入成套
    startFromHistory: function() {
        this.closeNewRoutineOptions();
        
        // 保存当前状态
        this.saveCurrentState();
        
        // 打开历史记录面板
        AppController.renderHistory();
        
        // 标记即将从历史导入
        window._pendingHistoryImport = true;
    },

    // 核心物理切换执行
    executeSwitch: function(targetIndex) {
        this.currentIndex = targetIndex;
        const targetWs = this.workspaces[targetIndex];

        // 1. 覆盖全局属性
        window.currentRoutineData = JSON.parse(JSON.stringify(targetWs.routineData));
        
        // 2. 暴力替换画板轨道并重绘
        if (typeof canvasManager !== 'undefined') {
            canvasManager.tracks = JSON.parse(JSON.stringify(targetWs.tracks));
            canvasManager.redraw();
        }

        // 3. UI 场地与文字的同步映射
        const nameInput = document.getElementById('routineNameInput');
        if (nameInput) nameInput.value = window.currentRoutineData.name === "未命名成套" ? "" : window.currentRoutineData.name;
        
        const displayRoutineName = document.getElementById('displayRoutineName');
        if (displayRoutineName) displayRoutineName.innerText = window.currentRoutineData.name;

        // 切换场地物理颜色
        if (typeof selectBrand === 'function') {
            selectBrand(window.currentRoutineData.brand || 'gymnova');
        }

        // 强制刷新右侧算分列表
        if (typeof AppController !== 'undefined' && AppController.updateUIRoutineList) {
            AppController.updateUIRoutineList();
        }

        this.renderSidebar();
        ToastManager.show('success', '工作区切换成功', `已为您无缝加载【草稿 ${targetIndex + 1}】！`);
    },

    // 删除非活跃草稿纸
    deleteWorkspace: function(index) {
        if (confirm(`🗑️ 确定要彻底删除【草稿 ${index + 1}】吗？此操作不可逆！`)) {
            this.workspaces.splice(index, 1);
            // 数组坍塌后，动态修正当前索引游标，防止越界错乱
            if (this.currentIndex > index) {
                this.currentIndex--; 
            }
            this.renderSidebar();
        }
    }
};

// ==========================================
// 全局绑定与开机自启
// ==========================================
window.createNewWorkspace = function() {
    WorkspaceManager.attemptCreateNew();
};

document.addEventListener('DOMContentLoaded', () => {
    // 延迟 500ms 启动，确保画板和 AppController 已经挂载完毕
    setTimeout(() => {
        if (typeof WorkspaceManager !== 'undefined') {
            WorkspaceManager.init();
        }
    }, 500);
});