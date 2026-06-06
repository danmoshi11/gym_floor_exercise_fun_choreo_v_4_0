// ==========================================
// 自由体操系统 中枢控制台 (app.js)
// ==========================================

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📚 项目代码拆分说明 (重要！请先阅读)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//
// 为了代码的可维护性和可扩展性，本项目采用模块化拆分架构。
// 以下是完整的目录结构和代码编写规范。
//
// 【⚠️ 重要规则】
// 1. 禁止在 app.js 中添加新功能代码
// 2. 所有新功能必须写入对应的独立文件中
// 3. 在 index.html 中按依赖顺序引入新文件
// 4. 所有全局对象必须使用 window.XXX 方式暴露
//
// 【📁 目录结构】
// ├── index.html                    # HTML 入口文件（引入所有 JS）
// ├── app.js                        # 主入口文件（仅包含杂项功能）
// ├── canvas.js                     # 画布引擎
// ├── d_score.js                    # D分计算引擎
// ├── e_score.js                    # E分计算引擎
// ├── flow_state_manager.js         # 功能状态管理系统
// ├── rules_engine.js                # 规则引擎
// ├── data.js                       # 基础数据
// ├── e_jury_deductions.js          # E裁扣分数据
// ├── d_jury_deductions.js          # D裁扣分数据
// ├── e_score_data.js               # E分数据
// ├── share_engine.js               # 分享引擎
// ├── supabase.js                   # Supabase 集成
// │
// ├── controllers/                  # 【控制器层】
// │   ├── app_controller.js         # 应用主控制器
// │   ├── workspace_controller.js    # 草稿纸管理控制器
// │   ├── jury_controller.js        # 裁判打分控制器
// │   └── audio_controller.js        # 音频引擎控制器
// │
// └── managers/                      # 【管理器层】
//     └── music_recorder.js          # 音乐录制管理器
//
// 【🎯 新增功能的正确位置】
// ┌─────────────────────────────────────────────────────────────┐
// │ 新增功能类型          │ 应写入文件                          │
// ├─────────────────────────────────────────────────────────────┤
// │ 页面切换/UI控制       │ controllers/app_controller.js       │
// │ 草稿纸管理            │ controllers/workspace_controller.js │
// │ 裁判打分/扣分卡片     │ controllers/jury_controller.js       │
// │ 音频播放/波形显示     │ controllers/audio_controller.js     │
// │ 音乐录制/编辑        │ managers/music_recorder.js           │
// │ 3D动画/模型加载      │ 直接写入 app.js (ThreeEngine)        │
// │ Hero引擎/首页特效    │ 直接写入 app.js (HeroEngine)         │
// │ 新增独立引擎         │ 在 managers/ 下新建 XXX_manager.js  │
// │ 新增独立控制器       │ 在 controllers/ 下新建 XXX_controller.js │
// └─────────────────────────────────────────────────────────────┘
//
// 【📝 在 index.html 中引入新文件】
// 在 index.html 的 <script> 标签中，按以下顺序添加：
// <!-- 基础引擎 -->
// <script src="data.js"></script>
// <script src="d_score.js"></script>
// <script src="canvas.js"></script>
// ...（其他基础文件）
//
// <!-- 功能状态管理 -->
// <script src="flow_state_manager.js"></script>
//
// <!-- 控制器层（按依赖顺序）-->
// <script src="controllers/app_controller.js"></script>
// <script src="controllers/workspace_controller.js"></script>
// <script src="controllers/jury_controller.js"></script>
// <script src="controllers/audio_controller.js"></script>
//
// <!-- 管理器层 -->
// <script src="managers/music_recorder.js"></script>
//
// <!-- 杂项引擎 -->
// <script src="share_engine.js"></script>
//
// 【💡 命名规范】
// • 控制器：window.XXXController = { ... }
// • 管理器：window.XXXManager = { ... }
// • 引擎：window.XXXEngine = { ... }
// • 常量：const XXX_STATES = { ... }
//
// 【🔧 代码模板】
// // 在新建的文件中，使用以下模板：
// (function() {
//     'use strict';
//
//     // 你的代码...
//
//     // 暴露到全局
//     window.MyNewController = {
//         init: function() { ... },
//         method1: function() { ... }
//     };
// })();
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const ToastManager = {
    timer: null,
    // type: 'success' | 'error' | 'warning' | 'info' | 'coin'
    show: function(type, title, message, duration = 3500) {
        const toast = document.getElementById('globalToast');
        if (!toast) return;

        const iconBox = document.getElementById('toastIconBox');
        const titleEl = document.getElementById('toastTitle');
        const msgEl = document.getElementById('toastMessage');

        // 基础重置
        toast.className = "fixed top-6 left-1/2 transform -translate-x-1/2 -translate-y-40 opacity-0 z-[9999] bg-white border-2 rounded-2xl shadow-2xl p-4 flex items-center gap-4 transition-all duration-500 pointer-events-none min-w-[300px] max-w-[90%]";
        iconBox.className = "w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-inner shrink-0";

        // 核心：根据不同类型动态上色
        if (type === 'success') {
            toast.classList.add('border-emerald-300');
            iconBox.classList.add('bg-gradient-to-br', 'from-emerald-100', 'to-teal-100', 'border', 'border-emerald-200');
            iconBox.innerHTML = '✅';
        } else if (type === 'error') {
            toast.classList.add('border-rose-300');
            iconBox.classList.add('bg-gradient-to-br', 'from-rose-100', 'to-red-100', 'border', 'border-rose-200');
            iconBox.innerHTML = '❌';
        } else if (type === 'warning') {
            toast.classList.add('border-amber-300');
            iconBox.classList.add('bg-gradient-to-br', 'from-amber-100', 'to-orange-100', 'border', 'border-amber-200');
            iconBox.innerHTML = '⚠️';
        } else if (type === 'coin') {
            toast.classList.add('border-amber-300');
            iconBox.classList.add('bg-gradient-to-br', 'from-amber-100', 'to-yellow-100', 'border', 'border-amber-200');
            iconBox.innerHTML = '🎁';
        } else {
            toast.classList.add('border-blue-300');
            iconBox.classList.add('bg-gradient-to-br', 'from-blue-100', 'to-indigo-100', 'border', 'border-blue-200');
            iconBox.innerHTML = '💡';
        }

        titleEl.innerText = title;
        // 支持 HTML 标签注入和换行
        msgEl.innerHTML = message.replace(/\n/g, '<br>');

        // 丝滑滑入
        toast.classList.remove('-translate-y-40', 'opacity-0');
        toast.classList.add('translate-y-0', 'opacity-100');

        // 清除旧定时器，防止连续点击导致闪烁
        if (this.timer) clearTimeout(this.timer);

        // 丝滑滑出
        this.timer = setTimeout(() => {
            toast.classList.remove('translate-y-0', 'opacity-100');
            toast.classList.add('-translate-y-40', 'opacity-0');
        }, duration);
    }
};
const CoinManager = {
    getCoins: function() { 
        return parseInt(localStorage.getItem('gymCoins') || '0'); 
    },
    addCoins: function(amount) {
        let current = this.getCoins();
        localStorage.setItem('gymCoins', current + amount);
        this.updateUI();
    },
    deductCoins: function(amount) {
        let current = this.getCoins();
        if (current >= amount) {
            localStorage.setItem('gymCoins', current - amount);
            this.updateUI();
            return true;
        }
        return false;
    },
    checkDailyLogin: function() {
        const todayStr = new Date().toLocaleDateString();
        const lastLogin = localStorage.getItem('gymLastLogin');
        
        if (lastLogin !== todayStr) {
            this.addCoins(100);
            localStorage.setItem('gymLastLogin', todayStr);
            // 调用全局引擎，炫酷发钱！
            setTimeout(() => {
                ToastManager.show('coin', '每日签到成功！', '系统已为您发放 <span class="text-amber-500 text-sm font-black bg-amber-50 px-1.5 rounded border border-amber-100 ml-0.5">100 🪙</span>');
            }, 1500);
        }
        this.updateUI();
    },
    // ✨ 新增：控制悬浮窗滑入和滑出的动画函数
    showCoinToast: function() {
        const toast = document.getElementById('coinToast');
        if (!toast) return;
        
        // 滑下来显示
        toast.classList.remove('-translate-y-32', 'opacity-0');
        toast.classList.add('translate-y-0', 'opacity-100');
        
        // 停留 3.5 秒后，自动滑上去隐藏
        setTimeout(() => {
            toast.classList.remove('translate-y-0', 'opacity-100');
            toast.classList.add('-translate-y-32', 'opacity-0');
        }, 3500);
    },
    updateUI: function() {
        const el = document.getElementById('coinDisplay');
        if (el) el.innerText = this.getCoins();
    }
};

const AppController = {
    // 在 AppController 顶部新增属性
    isViewingMode: false,

    // ✨ 辅助函数：生成默认E分记录名称
    _generateDefaultEScoreName: function() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hour = String(now.getHours()).padStart(2, '0');
        const minute = String(now.getMinutes()).padStart(2, '0');
        return `${year}年${month}月${day}日${hour}:${minute}的E分演示`;
    },

    // ✨ 查看E分历史记录弹窗
    showEScoreHistoryModal: function(routineId) {
        const history = JSON.parse(localStorage.getItem('gymChoreoHistory') || '[]');
        const routine = history.find(r => r.id === routineId);
        if (!routine) return;

        const eScoreHistory = routine.eScoreHistory || [];
        const hasEScore = routine.eScoreReport || eScoreHistory.length > 0;

        if (!hasEScore) {
            ToastManager.show('info', '暂无记录', '该成套还没有E分记录', 2000);
            return;
        }

        // 创建弹窗
        const modalHtml = `
            <div id="escoreHistoryModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onclick="if(event.target.id==='escoreHistoryModal')AppController.closeEScoreHistoryModal()">
                <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
                    <!-- 标题栏 -->
                    <div class="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4 flex items-center justify-between">
                        <div>
                            <h2 class="text-xl font-black text-white">📊 E分历史记录</h2>
                            <p class="text-emerald-100 text-xs mt-1">${routine.name}</p>
                        </div>
                        <button onclick="AppController.closeEScoreHistoryModal()" class="text-white/80 hover:text-white text-2xl">&times;</button>
                    </div>
                    
                    <!-- 内容区 -->
                    <div class="p-6 overflow-y-auto max-h-[60vh]">
                        ${eScoreHistory.length === 0 ? `
                            <div class="text-center py-8 text-slate-400">
                                <p class="text-4xl mb-2">📭</p>
                                <p>暂无历史E分记录</p>
                            </div>
                        ` : `
                            <div class="space-y-3">
                                ${eScoreHistory.map((record, index) => `
                                    <div class="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:border-emerald-300 transition-colors">
                                        <div class="flex items-center justify-between mb-2">
                                            <div class="flex items-center gap-2">
                                                <span class="w-6 h-6 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center">${index + 1}</span>
                                                <input type="text" id="escore_name_${record.id}" value="${record.name}" 
                                                       class="text-sm font-bold text-slate-700 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-emerald-400 outline-none"
                                                       onchange="AppController.renameEScoreRecord('${routineId}', '${record.id}', this.value)"
                                                       title="点击修改名称">
                                            </div>
                                            <div class="flex items-center gap-2">
                                                <span class="text-xs text-slate-400">${record.date}</span>
                                                <span class="px-2 py-0.5 rounded text-xs font-bold ${record.playbackMode === 'manual_e' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}">${record.playbackMode === 'manual_e' ? '手打' : '自动'}</span>
                                            </div>
                                        </div>
                                        <div class="flex items-center gap-4 mb-2">
                                            <span class="text-2xl font-black text-emerald-600">E分: ${record.eScoreReport.finalEScore.toFixed(3)}</span>
                                            <span class="text-sm text-slate-500">扣分: ${(10 - record.eScoreReport.finalEScore).toFixed(3)}</span>
                                        </div>
                                        <div class="flex gap-2 mt-3">
                                            <button onclick="AppController.viewEScoreDetails('${record.id}', '${routineId}')" 
                                                    class="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 font-bold text-xs py-2 rounded-lg transition-colors">
                                                📋 查看扣分详情
                                            </button>
                                            <button onclick="AppController.printEScoreDetails('${record.id}', '${routineId}')" 
                                                    class="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs py-2 rounded-lg transition-colors">
                                                🖨️ 打印扣分清单
                                            </button>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        `}
                    </div>
                    
                    <!-- 底部按钮 -->
                    <div class="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
                        <button onclick="AppController.closeEScoreHistoryModal()" 
                                class="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg transition-colors">
                            关闭
                        </button>
                    </div>
                </div>
            </div>
        `;

        // 添加到页面
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    },

    // ✨ 关闭E分历史记录弹窗
    closeEScoreHistoryModal: function() {
        const modal = document.getElementById('escoreHistoryModal');
        if (modal) modal.remove();
    },

    // ✨ 重命名E分记录
    renameEScoreRecord: function(routineId, recordId, newName) {
        let history = JSON.parse(localStorage.getItem('gymChoreoHistory') || '[]');
        const routineIndex = history.findIndex(r => r.id === routineId);
        if (routineIndex === -1) return;

        const routine = history[routineIndex];
        const recordIndex = routine.eScoreHistory.findIndex(r => r.id === recordId);
        if (recordIndex === -1) return;

        routine.eScoreHistory[recordIndex].name = newName.trim() || AppController._generateDefaultEScoreName();
        
        localStorage.setItem('gymChoreoHistory', JSON.stringify(history));
        ToastManager.show('success', '已重命名', `记录名称已更新为: ${routine.eScoreHistory[recordIndex].name}`, 1500);
    },

    // ✨ 查看E分扣分详情
    viewEScoreDetails: function(recordId, routineId) {
        const history = JSON.parse(localStorage.getItem('gymChoreoHistory') || '[]');
        const routine = history.find(r => r.id === routineId);
        if (!routine) return;

        const record = routine.eScoreHistory.find(r => r.id === recordId);
        if (!record) return;

        const eReport = record.eScoreReport;
        const details = eReport.details || [];

        // 创建详情弹窗
        const detailsHtml = `
            <div id="escoreDetailsModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[110] flex items-center justify-center p-4" onclick="if(event.target.id==='escoreDetailsModal')document.getElementById('escoreDetailsModal').remove()">
                <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-hidden">
                    <div class="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 flex items-center justify-between">
                        <div>
                            <h2 class="text-lg font-black text-white">📋 E分扣分详情</h2>
                            <p class="text-amber-100 text-xs mt-1">${record.name}</p>
                        </div>
                        <button onclick="document.getElementById('escoreDetailsModal').remove()" class="text-white/80 hover:text-white text-2xl">&times;</button>
                    </div>
                    <div class="p-6 overflow-y-auto max-h-[60vh]">
                        <div class="text-center mb-4">
                            <p class="text-slate-400 text-sm">最终E分</p>
                            <p class="text-5xl font-black text-emerald-600">${eReport.finalEScore.toFixed(3)}</p>
                        </div>
                        <div class="bg-slate-50 rounded-xl p-4 mb-4">
                            <h3 class="font-bold text-slate-700 mb-2">📝 扣分详情</h3>
                            ${details.length === 0 ? `
                                <p class="text-slate-400 text-center py-4">完美完成！无扣分项</p>
                            ` : `
                                <ul class="space-y-2">
                                    ${details.map(d => `
                                        <li class="flex items-center gap-2 text-sm">
                                            <span class="w-2 h-2 rounded-full bg-red-400"></span>
                                            <span class="text-slate-600">${d}</span>
                                        </li>
                                    `).join('')}
                                </ul>
                            `}
                        </div>
                        ${eReport.fallCount > 0 ? `
                            <div class="bg-red-50 rounded-xl p-4">
                                <h3 class="font-bold text-red-700 mb-1">🤸 摔倒统计</h3>
                                <p class="text-red-600">摔倒 ${eReport.fallCount} 次，扣 ${eReport.fallDeduction.toFixed(1)} 分</p>
                            </div>
                        ` : ''}
                    </div>
                    <div class="px-6 py-4 bg-slate-50 border-t border-slate-200 flex gap-2">
                        <button onclick="AppController.printEScoreDetails('${recordId}', '${routineId}')" 
                                class="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 rounded-lg transition-colors">
                            🖨️ 打印扣分清单
                        </button>
                        <button onclick="document.getElementById('escoreDetailsModal').remove()" 
                                class="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg transition-colors">
                            关闭
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', detailsHtml);
    },

    // ✨ 打印E分扣分清单
    printEScoreDetails: function(recordId, routineId) {
        const history = JSON.parse(localStorage.getItem('gymChoreoHistory') || '[]');
        const routine = history.find(r => r.id === routineId);
        if (!routine) return;

        const record = routine.eScoreHistory.find(r => r.id === recordId);
        if (!record) return;

        const eReport = record.eScoreReport;
        const details = eReport.details || [];

        // 生成打印内容
        const printContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${record.name}</title>
    <style>
        body { font-family: 'Microsoft YaHei', sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
        h1 { color: #333; border-bottom: 2px solid #10b981; padding-bottom: 10px; }
        .info { color: #666; margin-bottom: 20px; }
        .score { font-size: 48px; color: #10b981; text-align: center; margin: 20px 0; }
        .details { background: #f9fafb; padding: 20px; border-radius: 8px; }
        .detail-item { padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
        .detail-item:last-child { border-bottom: none; }
        .fall { color: #ef4444; font-weight: bold; }
        @media print { body { padding: 0; } }
    </style>
</head>
<body>
    <h1>${record.name}</h1>
    <div class="info">
        <p>成套名称: ${routine.name}</p>
        <p>记录时间: ${record.date}</p>
        <p>打分方式: ${record.playbackMode === 'manual_e' ? '手动打分' : '自动打分'}</p>
    </div>
    <div class="score">E分: ${eReport.finalEScore.toFixed(3)}</div>
    <div class="details">
        <h2>📋 扣分详情</h2>
        ${details.length === 0 ? '<p>完美完成！无扣分项</p>' : ''}
        ${details.map(d => `<div class="detail-item">${d}</div>`).join('')}
    </div>
    ${eReport.fallCount > 0 ? `
    <div class="fall" style="margin-top: 20px; padding: 15px; background: #fef2f2; border-radius: 8px;">
        <strong>🤸 摔倒统计:</strong> 摔倒 ${eReport.fallCount} 次，扣 ${eReport.fallDeduction.toFixed(1)} 分
    </div>
    ` : ''}
</body>
</html>
        `;

        // 打开新窗口进行打印
        const printWindow = window.open('', '_blank');
        printWindow.document.write(printContent);
        printWindow.document.close();
        setTimeout(() => {
            printWindow.print();
        }, 500);
    },

    // 新增方法：切换观赏模式的 UI 限制
    applyViewingMode: function(isViewing) {
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
        this.updateUIRoutineList();
    },
    
    showArtistryPanel: function() {
        // 拉取所有包含 global 标签的艺术扣分项
        const artistryRules = (window.e_jury_deductions || []).filter(r => r.target_tags && r.target_tags.includes("global"));
        
        // 构建全屏模态框让裁判点选艺术扣分...
        const modalHtml = `
            <div id="artistryScoreModal" class="fixed inset-0 bg-black/80 flex items-center justify-center z-[300] backdrop-blur-sm">
                <div class="bg-white rounded-2xl shadow-2xl p-6 w-11/12 max-w-2xl border-t-8 border-fuchsia-500">
                    <h2 class="text-2xl font-black text-slate-800 mb-2">🎭 全局艺术与编排总评</h2>
                    <p class="text-sm text-slate-500 mb-4">路线演示已结束，请基于全套表现给予艺术扣分：</p>
                    
                    <div class="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto p-2" id="artistryCheckboxes">
                        ${artistryRules.map(r => `
                            <label class="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-fuchsia-50 transition-colors">
                                <input type="checkbox" class="w-5 h-5 text-fuchsia-600 rounded" value="${r.deduction}" data-name="${r.name}">
                                <div class="flex flex-col">
                                    <span class="font-bold text-sm text-slate-700">${r.name}</span>
                                    <span class="text-[10px] text-fuchsia-600 font-black">-${r.deduction.toFixed(1)}</span>
                                </div>
                            </label>
                        `).join('')}
                    </div>
                    
                    <div class="mt-6 flex justify-end">
                        <button onclick="AppController.confirmArtistryAndFinish()" class="bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white font-black px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all">
                            确认打分并生成成绩单
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    },

    confirmArtistryAndFinish: function() {
        const checkboxes = document.querySelectorAll('#artistryCheckboxes input:checked');
        let artDeductions = [];
        checkboxes.forEach(cb => {
            artDeductions.push({ name: cb.dataset.name, deduction: parseFloat(cb.value) });
        });
        
        // 将扣分注入到当前的 E 分报告中，然后再弹成绩单
        if (!window.currentEScoreReport.details) window.currentEScoreReport.details = [];
        artDeductions.forEach(d => {
            window.currentEScoreReport.totalDeduction += d.deduction;
            window.currentEScoreReport.finalEScore -= d.deduction;
            window.currentEScoreReport.details.push(`[全局艺术] ${d.name} : -${d.deduction.toFixed(1)}`);
        });
        
        document.getElementById('artistryScoreModal').remove();
        
        // ✨ 艺术打分完成，重新启用"完成编排并亮相"按钮
        const finishBtn = document.getElementById('finishRoutineBtn');
        if (finishBtn) {
            finishBtn.disabled = false;
            finishBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            finishBtn.classList.add('hover:-translate-y-0.5');
        }
        
        this.showFinalScoreBoard();
    },

    modal: {
        currentTrackId: null,
        skills: [],
        connectionType: 'direct'
    },

    init: function() {
        CoinManager.checkDailyLogin();
        this.renderDictionary(skillsData);
        this.renderHistory();
        document.getElementById('searchInput').addEventListener('input', () => this.filterDictionary());
        document.getElementById('groupFilter').addEventListener('change', () => this.filterDictionary());
        document.getElementById('diffFilter').addEventListener('change', () => this.filterDictionary());
    
        // 【新增】初始化加载选手名单
        const selector = document.getElementById('gymnastSelector');
        if (selector && typeof gymnastsData !== 'undefined') {
            gymnastsData.forEach(g => {
                const option = document.createElement('option');
                option.value = g.id;
                option.textContent = `${g.country} | ${g.nameEn}`;
                selector.appendChild(option);
            });
        }
        window.currentRoutineData = window.currentRoutineData || {};
        // ✨【新增】初始化修改标记
        window.routineNeedsRecalculation = false;
        this.setGymnastMode('none');
    },

    // ==========================================
    // 🎯 成套修改检测与状态管理
    // ==========================================
    
    // 标记成套已修改，需要重新算分
    markRoutineModified: function() {
        window.routineNeedsRecalculation = true;
        // 清除已冻结的分数（如果存在）
        if (window.currentEScoreReport) {
            window.currentEScoreReport.isFrozen = false;
        }
    },
    
    // 检查是否需要重新算分
    needsRecalculation: function() {
        return window.routineNeedsRecalculation === true;
    },
    
    // 标记算分完成
    markCalculationComplete: function() {
        window.routineNeedsRecalculation = false;
        if (window.currentEScoreReport) {
            window.currentEScoreReport.isFrozen = true;
        }
    },

    // ==========================================
    // 附加模块：选手身份管家与国旗 Emoji 引擎
    // ==========================================
    getFlag: function(code) {
        // 映射国家代码到 ISO 3166-1 alpha-2 格式
        const flagMap = {
            'CHN': 'cn', 'USA': 'us', 'BRA': 'br', 'FRA': 'fr', 'ITA': 'it', 'JPN': 'jp',
            'GBR': 'gb', 'ROU': 'ro', 'CAN': 'ca', 'PHI': 'ph', 'KOR': 'kr', 'NED': 'nl',
            'AUS': 'au', 'ESP': 'es', 'GER': 'de', 'ALG': 'dz', 'AUT': 'at', 'BEL': 'be',
            'COL': 'co', 'CZE': 'cz', 'EGY': 'eg', 'HAI': 'ht', 'HUN': 'hu', 'MEX': 'mx',
            'NZL': 'nz', 'PAN': 'pa', 'POR': 'pt', 'PRK': 'kp', 'RSA': 'za', 'SLO': 'si',
            'SUI': 'ch', 'UKR': 'ua'
        };
        const iso = flagMap[code];
        if (iso) {
            // 直接返回高清国旗图片标签
            return `<img src="https://flagcdn.com/w40/${iso}.png" class="inline-block w-5 h-3.5 rounded-[2px] object-cover shadow-sm align-middle" alt="${code}">`;
        }
        return '🏳️'; 
    },

    setGymnastMode: function(mode) {
        window.currentRoutineData.gymnastMode = mode;
        
        // ✨【新增】切换选手后标记需要重新算分
        if (mode !== 'none' && window.currentRoutineData.gymnastMode !== mode) {
            this.markRoutineModified();
        }
        
        const display = document.getElementById('setupGymnastDisplay');
        const customInput = document.getElementById('customGymnastNameInput');
        const avatarBox = document.getElementById('setupGymnastAvatar');
        
        if (mode === 'none') {
            display.classList.remove('hidden');
            if(customInput) customInput.classList.add('hidden');
            avatarBox.innerHTML = '<span class="text-slate-400">🙈</span>';
            document.getElementById('setupGymnastFlag').innerHTML = '';
            document.getElementById('setupGymnastName').innerText = '纯排位测试 (无E分)';
            document.getElementById('setupGymnastStats').innerText = '系统将仅计算 D 分';
        } else if (mode === 'custom') {
            display.classList.add('hidden');
            if(customInput) customInput.classList.remove('hidden');
        } else {
            // 从数据库选定
            const g = gymnastsData.find(x => x.id === mode);
            display.classList.remove('hidden');
            if(customInput) customInput.classList.add('hidden');
            
            
            // 【核心修改】：动态拼接 assets 路径，并加上 onerror 容错保护
            const imgPath = `./assets/${g.id}.png`; // 如果你存的是 jpg，请改为 .jpg
            avatarBox.innerHTML = `<img src="${imgPath}" class="w-full h-full object-cover" onerror="this.outerHTML='<span class=\\'text-slate-300\\'>👤</span>'">`;
            
            document.getElementById('setupGymnastFlag').innerHTML = this.getFlag(g.country);
            document.getElementById('setupGymnastName').innerText = g.nameEn;
            document.getElementById('setupGymnastStats').innerText = `已载入该选手专属模型`;
            const currentBrand = window.currentRoutineData ? window.currentRoutineData.brand : 'gymnova';
            if (currentBrand === 'gaofei' && g.country !== 'CHN') {
                ToastManager.show('warning', '器材切换提示', '当前选中选手为非中国籍，无法适应高飞场地，系统已自动切回默认 Gymnova 场地。');
                if (typeof selectBrand === 'function') selectBrand('gymnova');
            }
            
        }
    },

    openGymnastModal: function() {
        document.getElementById('gymnastModal').classList.remove('hidden');
        this.renderGymnastList(gymnastsData);
        
        // 绑定搜索逻辑
        document.getElementById('gymnastSearch').oninput = (e) => {
            const q = e.target.value.toLowerCase();
            const filtered = gymnastsData.filter(g => 
                g.nameEn.toLowerCase().includes(q) || g.country.toLowerCase().includes(q)
            );
            this.renderGymnastList(filtered);
        };
    },

    closeGymnastModal: function() {
        document.getElementById('gymnastModal').classList.add('hidden');
    },

    // ✨【新增】：恢复全局状态
    restoreGlobalState: function(routine) {
        // 恢复得分报告
        if (routine.scoreReport) {
            window.currentScoreReport = JSON.parse(JSON.stringify(routine.scoreReport));
        }
        if (routine.eScoreReport) {
            window.currentEScoreReport = JSON.parse(JSON.stringify(routine.eScoreReport));
        }
        
        // 恢复播放模式
        if (routine.playbackMode) {
            window.currentPlaybackMode = routine.playbackMode;
        }
        
        // 恢复体操运动员显示
        this.updateGymnastDisplay();
        
        // 如果有得分报告，显示音乐模式开关
        if (routine.scoreReport) {
            const musicModeWrapper = document.getElementById('musicModeWrapper');
            const musicModeLabel = document.getElementById('musicModeLabel');
            if (musicModeWrapper) {
                musicModeWrapper.classList.remove('hidden');
                musicModeWrapper.classList.remove('grayscale', 'opacity-70');
            }
            if (musicModeLabel) {
                musicModeLabel.innerText = '🎬 现场/音乐模式';
            }
        }
    },

    // ✨【新增】：更新体操运动员显示面板
    updateGymnastDisplay: function() {
        const display = document.getElementById('setupGymnastDisplay');
        const avatarBox = document.getElementById('setupGymnastAvatar');
        
        if (!display || !avatarBox) return;
        
        const mode = window.currentRoutineData?.gymnastMode || 'none';
        const gymnastName = window.currentRoutineData?.gymnastName || '纯排位测试 (无E分)';
        
        if (mode === 'none' || mode === 'custom') {
            display.classList.remove('hidden');
            avatarBox.innerHTML = '<span class="text-slate-400">🙈</span>';
            document.getElementById('setupGymnastFlag').innerHTML = '';
            document.getElementById('setupGymnastName').innerText = gymnastName;
            document.getElementById('setupGymnastStats').innerText = mode === 'none' ? '系统将仅计算 D 分' : '自定义选手';
        } else {
            // 从数据库选定
            const g = gymnastsData.find(x => x.id === mode);
            if (g) {
                display.classList.remove('hidden');
                const imgPath = `./assets/${g.id}.png`;
                avatarBox.innerHTML = `<img src="${imgPath}" class="w-full h-full object-cover" onerror="this.outerHTML='<span class=\\'text-slate-300\\'>👤</span>'">`;
                document.getElementById('setupGymnastFlag').innerHTML = this.getFlag(g.country);
                document.getElementById('setupGymnastName').innerText = g.nameEn;
                document.getElementById('setupGymnastStats').innerText = `已载入该选手专属模型`;
            }
        }
    },

    renderGymnastList: function(data) {
        const grid = document.getElementById('gymnastListGrid');
        grid.innerHTML = '';
        if (data.length === 0) {
            grid.innerHTML = '<p class="col-span-full text-center text-slate-400 py-10">未找到相关选手...</p>';
            return;
        }
        data.forEach(g => {
            const flag = this.getFlag(g.country);
            const imgPath = `./assets/${g.id}.png`; // 这里拼接路径
            
            grid.innerHTML += `
                <div onclick="AppController.selectGymnast('${g.id}')" class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-400 cursor-pointer flex items-center gap-4 transition-all transform hover:-translate-y-1">
                    <div class="w-14 h-14 rounded-full bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex justify-center items-center text-3xl shadow-inner">
                        <img src="${imgPath}" class="w-full h-full object-cover" onerror="this.outerHTML='<span class=\\'text-slate-300 flex items-center justify-center w-full h-full\\'>👤</span>'">
                    </div>
                    <div class="flex-1 overflow-hidden">
                        <div class="text-[10px] font-bold text-slate-400 mb-0.5 tracking-widest flex items-center gap-1">${g.country}</div>
                        <div class="font-black text-slate-800 text-base truncate flex items-center gap-2" title="${g.nameEn}">
                            <span>${flag}</span>
                            <span class="truncate">${g.nameEn}</span>
                        </div>
                        <div class="text-xs text-blue-600 font-bold mt-1 bg-blue-50 inline-block px-2 py-0.5 rounded-md border border-blue-100">已内置数据</div>
                    </div>
                </div>
            `;
        });
    },

    selectGymnast: function(id) {
        this.setGymnastMode(id);
        this.closeGymnastModal();
    },

    // 【新增】监听选手选择下拉框变化
    handleGymnastChange: function() {
        const val = document.getElementById('gymnastSelector').value;
        const customInput = document.getElementById('customGymnastName');
        if (val === 'custom') {
            customInput.classList.remove('hidden');
        } else {
            customInput.classList.add('hidden');
        }
    },
    

    renderDictionary: function(data) {
        const grid = document.getElementById('skillsGrid');
        grid.innerHTML = '';
        if (data.length === 0) {
            grid.innerHTML = `<p class="col-span-full text-center py-10 text-gray-400">未找到匹配的动作</p>`;
            return;
        }
        data.forEach(skill => {
            const isAcro = skill.id.startsWith('4.') || skill.id.startsWith('5.');
            const bgClass = isAcro ? 'bg-blue-50' : 'bg-green-50'; 
            grid.innerHTML += `
                <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                    <div class="${bgClass} p-2 flex justify-center">
                        <img src="${skill.image}" class="h-24 object-contain mix-blend-multiply" alt="${skill.nameZh[0]}">
                    </div>
                    <div class="p-3">
                        <div class="flex justify-between items-center mb-1">
                            <span class="text-xs font-mono text-gray-400">ID: ${skill.id}</span>
                            <span class="px-2 py-0.5 bg-diff-${skill.difficulty} text-white font-bold rounded-md text-xs">${skill.difficulty} (${skill.value})</span>
                        </div>
                        <h4 class="font-bold text-gray-800 text-sm mb-1 truncate" title="${skill.nameZh[0]}">${skill.nameZh[0]}</h4>
                    </div>
                </div>
            `;
        });
    },

    filterDictionary: function() {
        const query = document.getElementById('searchInput').value.toLowerCase();
        const group = document.getElementById('groupFilter').value;
        const diff = document.getElementById('diffFilter').value;
        const filtered = skillsData.filter(skill => {
            const matchName = skill.nameZh.join(" ").toLowerCase().includes(query) || skill.nameEn.toLowerCase().includes(query);
            const matchGroup = group === 'all' || skill.id.startsWith(group + '.');
            const matchDiff = diff === 'all' || skill.difficulty === diff;
            return matchName && matchGroup && matchDiff;
        });
        this.renderDictionary(filtered);
    },

    // 【新增】：侧边栏点击一键呼出弹窗
    openModalById: function(trackId) {
        const track = canvasManager.tracks.find(t => t.id === trackId);
        if (track) {
            this.openModal(track);
        }
    },

    openModal: function(track) {
        if (track.type === 'transit') {
            canvasManager.updateTrackSkills(track.id, [{nameZh: ["移动路线"], difficulty: "-"}], 'direct');
            this.updateUIRoutineList();
            return;
        }

        this.modal.currentTrackId = track.id;
        const isEditing = track.skills && track.skills.length > 0;
        this.modal.skills = track.skills ? [...track.skills] : [];
        this.modal.connections = track.connections ? [...track.connections] : Array(Math.max(0, this.modal.skills.length - 1)).fill('direct');
        document.getElementById('skillModal').classList.remove('hidden');
        
        let availableSkills = [];
        let title = "";
        let prefix = isEditing ? "✏️ 修改" : "➕ 配置";
        
        if (track.type === 'line') {
            title = `${prefix}技巧空翻串`;
            availableSkills = skillsData.filter(s => /^[345]\./.test(s.id));
        } else if (track.type === 'curve') {
            title = `${prefix}舞蹈跳步串`;
            availableSkills = skillsData.filter(s => s.id.startsWith('1.'));
        } else if (track.type === 'point') {
            title = `${prefix}定点立转`;
            availableSkills = skillsData.filter(s => s.id.startsWith('2.'));
        }

        if (isEditing) {
            let trackIndex = canvasManager.tracks.findIndex(t => t.id === track.id) + 1;
            title = `${title} (路线 ${trackIndex})`;
        }

        document.getElementById('modalTitle').innerText = title;
        document.getElementById('modalConfirmBtn').innerText = isEditing ? "保存修改" : "写入画板";

        this.generateRecommendations(track.type);
        
        // ✨【核心改造】：将总库交由弹窗引擎管理，初始化默认难度过滤为 'all'
        this.modal.availableSkills = availableSkills;
        this.modal.currentDiffFilter = 'all';
        
        this.renderModalDiffFilter(); // 渲染 A-J 按钮
        this.filterModalList();       // 替代直接渲染，走一道过滤网

        // 更新搜索框绑定事件
        document.getElementById('modalSearch').oninput = () => this.filterModalList();
        this.updateCartUI();
    },

    // ✨【新增 1】渲染 A-J 难度按钮
    renderModalDiffFilter: function() {
        const bar = document.getElementById('modalDiffFilterBar');
        if (!bar) return;
        const diffs = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
        
        let html = `<button onclick="AppController.setModalDiffFilter('all')" class="px-3 py-1 rounded-lg text-xs font-bold transition-colors shrink-0 ${this.modal.currentDiffFilter === 'all' ? 'bg-slate-800 text-white shadow-sm' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}">所有难度</button>`;
        
        diffs.forEach(d => {
            let isSelected = this.modal.currentDiffFilter === d;
            html += `<button onclick="AppController.setModalDiffFilter('${d}')" class="px-3 py-1 rounded-lg text-xs font-bold transition-colors shrink-0 ${isSelected ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}">${d} 组</button>`;
        });
        bar.innerHTML = html;
    },

    // ✨【新增 2】切换难度标签状态
    setModalDiffFilter: function(diff) {
        this.modal.currentDiffFilter = diff;
        this.renderModalDiffFilter(); // 重新渲染高亮
        this.filterModalList();       // 触发过滤
    },

    // ✨【新增 3】联合搜素 (搜索框 + 难度按钮)
    filterModalList: function() {
        const q = (document.getElementById('modalSearch').value || '').toLowerCase();
        const diff = this.modal.currentDiffFilter;
        
        const filtered = this.modal.availableSkills.filter(s => {
            const matchQ = s.nameZh.join(" ").toLowerCase().includes(q) || s.nameEn.toLowerCase().includes(q);
            const matchD = diff === 'all' || s.difficulty === diff;
            return matchQ && matchD;
        });
        
        this.renderModalList(filtered);
    },

    generateRecommendations: function(trackType) {
        const bar = document.getElementById('recommendationBar');
        bar.innerHTML = '';
        let recs = [];
        if (trackType === 'line') {
            const lineCount = canvasManager.tracks.filter(t => t.type === 'line').length;
            if (lineCount === 1) recs = skillsData.filter(s => /^[45]\./.test(s.id) && ['F','G','H','I','J'].includes(s.difficulty));
            else if (lineCount === 2) recs = skillsData.filter(s => /^[45]\./.test(s.id) && ['E','F'].includes(s.difficulty));
            else recs = skillsData.filter(s => /^[45]\./.test(s.id) && ['C','D'].includes(s.difficulty));
        } else if (trackType === 'curve') {
            recs = skillsData.filter(s => s.id.startsWith('1.') && s.tags && s.tags.includes('cr1'));
        } else {
            recs = skillsData.filter(s => s.id.startsWith('2.') && ['C','D','E'].includes(s.difficulty));
        }
        recs.sort(() => 0.5 - Math.random()).slice(0, 5).forEach(skill => {
            bar.innerHTML += `<button onclick="AppController.addToCart('${skill.id}', '${skill.nameZh[0]}')" class="flex-shrink-0 bg-white border border-blue-200 hover:border-blue-500 rounded-lg px-3 py-1.5 flex items-center gap-2 shadow-sm transition-colors"><span class="text-xs font-bold text-blue-600">${skill.difficulty}</span><span class="text-sm text-gray-700">${skill.nameZh[0]}</span></button>`;
        });
    },

    renderModalList: function(skills) {
        const list = document.getElementById('modalSkillList');
        list.innerHTML = '';
        skills.forEach(skill => {
            list.innerHTML += `
                <div onclick="AppController.addToCart('${skill.id}', '${skill.nameZh[0]}')" class="bg-white p-3 rounded-xl border border-gray-100 shadow-sm hover:shadow-md cursor-pointer flex justify-between items-center transition-all hover:border-blue-300">
                    <div>
                        <div class="flex items-center gap-2 mb-1">
                            <span class="text-[10px] font-mono bg-gray-100 px-1.5 rounded text-gray-500">${skill.id}</span>
                            <span class="text-xs font-bold bg-diff-${skill.difficulty} text-white px-1.5 rounded">${skill.difficulty}</span>
                        </div>
                        <h4 class="font-bold text-gray-800 text-sm">${skill.nameZh[0]}</h4>
                    </div>
                    <img src="${skill.image}" class="h-10 w-10 object-contain mix-blend-multiply opacity-50">
                </div>
            `;
        });
    },

    // 修改 C：接收两个参数，实行【ID + 名字】的高精度双重绑定！
    addToCart: function(skillId, skillName) {
        if (this.modal.skills.length >= 6) { ToastManager.show('warning', '动作数量已达上限', '一条轨迹最多配置 6 个动作！'); return; }
        
        // ✨【核心修改】：双重筛选，彻底避免相同 ID 动作互相顶替的 Bug！
        const fullSkillObj = skillsData.find(s => s.id === skillId && s.nameZh[0] === skillName);
        if (!fullSkillObj) return;

        this.modal.skills.push(fullSkillObj);
        if (this.modal.skills.length > 1) this.modal.connections.push('direct');
        this.updateCartUI();
        
        // 选完动作后自动清空搜索框
        const searchInput = document.getElementById('modalSearch');
        if (searchInput && searchInput.value !== '') {
            searchInput.value = '';
            searchInput.dispatchEvent(new Event('input')); 
        }
    },

    removeFromCart: function(index) {
        this.modal.skills.splice(index, 1);
        if (this.modal.connections.length > 0) {
            let connIndex = Math.max(0, index - 1);
            this.modal.connections.splice(connIndex, 1);
        }
        this.updateCartUI();
    },

    toggleConnection: function(index) {
        this.modal.connections[index] = this.modal.connections[index] === 'direct' ? 'indirect' : 'direct';
        this.updateCartUI();
    },

    updateCartUI: function() {
        const cart = document.getElementById('modalCurrentQueue');
        if (!cart) return;
        cart.innerHTML = '';
        if (this.modal.skills.length === 0) {
            cart.innerHTML = '<span class="text-gray-400 text-sm">尚未选择动作...</span>';
            return;
        }
        this.modal.skills.forEach((skill, index) => {
            cart.innerHTML += `
                <div class="flex items-center gap-1 bg-white px-3 py-1.5 rounded border border-gray-200 shadow-sm shrink-0">
                    <span class="text-xs font-bold text-blue-600">${skill.difficulty}</span>
                    <span class="text-sm text-gray-700">${skill.nameZh[0]}</span>
                    <button onclick="AppController.removeFromCart(${index})" class="text-red-400 hover:text-red-600 ml-1">&times;</button>
                </div>`;
            if (index < this.modal.skills.length - 1) {
                let isDirect = this.modal.connections[index] === 'direct';
                let symbol = isDirect ? '+' : '++';
                let colorClass = isDirect ? 'bg-blue-100 text-blue-600 border-blue-200 hover:bg-blue-200' : 'bg-orange-100 text-orange-600 border-orange-200 hover:bg-orange-200';
                cart.innerHTML += `<button onclick="AppController.toggleConnection(${index})" class="px-2 py-0.5 text-xs font-black rounded border cursor-pointer transition-colors ${colorClass}">${symbol}</button>`;
            }
        });

        // ==================================================
        // ✨【全新黑科技】：动作弹窗队列，实时无感动态演练 CV
        // ==================================================
        let modalTitleText = document.getElementById('modalTitle').innerText;
        let mockType = modalTitleText.includes('技巧') ? 'line' : (modalTitleText.includes('转体') ? 'point' : 'curve');
        
        // 封存为一个临时的虚拟 Track 镜像
        let mockTrack = {
            type: mockType,
            skills: this.modal.skills,
            connections: this.modal.connections,
            connectionType: 'direct'
        };
        
        // 扔给引擎单独跑一次
        let estimatedCV = ChoreographyEngine.calculateCV([mockTrack]);
        
        // 如果触发了连接加分，直接在弹窗底部的动作序列右侧，闪烁飙出炫酷绿标提示！
        if (estimatedCV > 0) {
            cart.innerHTML += `
                <div class="text-xs font-black text-green-600 bg-green-50 border-2 border-green-300 px-2.5 py-1.5 rounded-lg shadow-sm ml-auto shrink-0 animate-pulse flex items-center gap-1">
                    🔥 连击达成 CV: +${estimatedCV.toFixed(1)}
                </div>
            `;
        }
    },

    confirmModal: function() {
        const track = canvasManager.tracks.find(t => t.id === this.modal.currentTrackId);
        if (track) {
            track.skills = [...this.modal.skills];
            track.connections = [...this.modal.connections]; 
            canvasManager.redraw();
        }
        this.closeModal();
        this.updateUIRoutineList(); 
    },

    closeModal: function() {
        document.getElementById('skillModal').classList.add('hidden');
        if (this.modal.currentTrackId) {
            const track = canvasManager.tracks.find(t => t.id === this.modal.currentTrackId);
            if (track && track.skills.length === 0) {
                canvasManager.tracks = canvasManager.tracks.filter(t => t.id !== this.modal.currentTrackId);
                canvasManager.redraw();
            }
        }
    },

    updateUIRoutineList: function() {
        // ✨【生命周期校准】：先计算最新数据，再渲染 HTML！
        this.runScoringEngine();

        const list = document.getElementById('routineList');
        let html = '';
        let validCount = 0;

        // 🟢 观赏模式状态：决定是否隐藏编辑/删除按钮
        const isViewing = this.isViewingMode;
        const hideControls = isViewing ? 'hidden' : '';

        canvasManager.tracks.forEach((track, index) => {
            if (track.skills.length === 0) return;
            
            // 🟢 如果是观赏模式，清空拖拽属性，防止用户乱拖
            const dragAttributes = isViewing ? '' : `
                draggable="true"
                ondragstart="SidebarInteraction.dragStartTrack(event, ${index})"
                ondragover="SidebarInteraction.dragOverTrack(event)"
                ondrop="SidebarInteraction.dropTrack(event, ${index})"
                ondragend="SidebarInteraction.dragEndTrack(event)"
            `;

            if (track.type === 'transit') {
                html += `
                    <div class="track-card ${isViewing ? '' : 'cursor-move'} transition-all duration-200 flex items-center justify-between p-2 border border-gray-100 bg-gray-50 rounded group" ${dragAttributes}>
                        <div class="flex gap-2 overflow-hidden pr-2 flex-1 ${isViewing ? '' : 'cursor-pointer'}" title="${isViewing ? '' : '点击重新编辑此路线'}">
                            <div class="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0" style="color: ${track.color}">${index + 1}</div>
                            <div class="flex-1 text-sm text-gray-400 italic">🚶‍♀️ 移动路线 (无难度)</div>
                        </div>
                        <div class="shrink-0 flex items-center opacity-0 group-hover:opacity-100 transition-opacity mt-0.5 ${hideControls}">
                            <button onclick="SidebarInteraction.deleteTrack(${index})" class="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50" title="删除路线">🗑️</button>
                        </div>
                    </div>`;
                return;
            }

            let trackCV = track.cvValue || 0.0; 
            let trackDMT = track.dmtBonus || 0.0; 
            
            // ==========================================
            // 1. 顶部徽章区 (完整保留你原有的加分和扣分逻辑)
            // ==========================================
            let statsHTML = `<div class="flex gap-1 ml-2 shrink-0">`;
            if (track.skills.length >= 2 && trackCV > 0) { 
                statsHTML += `<span class="text-[10px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded font-bold border border-green-200 shadow-sm">CV +${trackCV.toFixed(1)}</span>`; 
            } 
            if (trackDMT > 0) {
                statsHTML += `<span class="text-[10px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded font-bold border border-amber-200 shadow-sm animate-pulse">下法 +0.2</span>`;
            }
            if (track.manualDeductionTotal > 0) {
                statsHTML += `<span class="text-[10px] bg-rose-50 text-rose-600 px-1.5 py-0.5 rounded font-bold border border-rose-200 shadow-sm">总扣 -${track.manualDeductionTotal.toFixed(1)}</span>`;
            }
            statsHTML += `</div>`;

            const connector = track.connectionType === 'direct' ? ' + ' : ' / '; 
            
            // ==========================================
            // 2. 动作渲染区 (完整保留你原有的下方悬挂扣分红框逻辑)
            // ==========================================
            const skillsText = track.skills.map((s, skillIndex) => {
                let skillHtml = `
                    <span class="group relative inline-flex items-center hover:bg-gray-200 px-1 rounded transition-colors ${isViewing ? '' : 'cursor-pointer'}">
                        <span class="font-bold text-gray-800">${s.nameZh[0]}</span> 
                        <span class="text-[10px] bg-gray-200 group-hover:bg-gray-300 px-1 rounded ml-1">${s.difficulty}</span>
                        <button onclick="event.stopPropagation(); AppController.removeSkillFromTrack('${track.id}', ${skillIndex})" class="hidden group-hover:flex absolute -top-1.5 -right-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full w-4 h-4 text-[10px] items-center justify-center shadow z-10 ${hideControls}">&times;</button>
                    </span>`;
                
                let faultsForThisSkill = (track.manualDeductions || []).filter(f => f.skillIdx === skillIndex);
                
                if (faultsForThisSkill.length > 0) {
                    let totalDed = faultsForThisSkill.reduce((sum, f) => sum + f.deduction, 0);
                    let faultTags = faultsForThisSkill.map(f => {
                        let tagColor = f.isArtistry ? 'text-fuchsia-600 border-fuchsia-200 bg-fuchsia-50' : 'text-rose-500 border-rose-200 bg-white';
                        return `<span class="text-[9px] ${tagColor} px-1 rounded shadow-sm whitespace-nowrap">${f.faultName}</span>`;
                    }).join('');
                    
                    skillHtml += `
                        <div class="mt-1 flex flex-wrap items-center gap-1 bg-rose-50 p-1 rounded-md border border-rose-100 shadow-sm w-full">
                            <span class="text-[10px] font-black text-white bg-rose-500 px-1 py-0.5 rounded">-${totalDed.toFixed(1)}</span>
                            ${faultTags}
                        </div>`;
                }
                return `<div class="inline-flex flex-col items-start align-top">${skillHtml}</div>`;
                
            }).join(`<span class="mx-1 self-start mt-0.5 text-gray-400 font-bold">${connector}</span>`);
            
            let icon = track.type === 'line' ? '📏' : (track.type === 'curve' ? '〰️' : '📍'); 
            let ndWarning = track.nd < 0 ? `<span class="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold ml-2 shadow-sm border border-red-200 shrink-0">出界 ${track.nd}</span>` : ''; 
            validCount += track.skills.length; 

            // ==========================================
            // 3. 卡片外层包裹 (注入了 isViewing 判断)
            // ==========================================
            html += `
                <div class="track-card ${isViewing ? '' : 'cursor-move'} transition-all duration-200 flex items-start justify-between p-2 border-b border-gray-50 hover:bg-gray-100 rounded group" ${dragAttributes}>
                    
                    <div class="flex gap-2 overflow-hidden pr-2 flex-1 ${isViewing ? '' : 'cursor-pointer'}" ${isViewing ? '' : `onclick="AppController.openModalById('${track.id}')"`} title="${isViewing ? '' : '点击重新编辑此路线'}">
                        <div class="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0 mt-0.5" style="color: ${track.color}">${index + 1}</div>
                        
                        <div class="text-sm leading-relaxed flex flex-col w-full gap-1.5">
                            <div class="flex items-center w-full">
                                ${icon} ${statsHTML} ${ndWarning}
                            </div>
                            <div class="flex flex-wrap items-start gap-y-2 w-full">
                                ${skillsText}
                            </div>
                        </div>
                    </div>
                    
                    <div class="shrink-0 flex items-center opacity-0 group-hover:opacity-100 transition-opacity mt-0.5 ${hideControls}">
                        <button onclick="AppController.openModalById('${track.id}')" class="text-blue-400 hover:text-blue-600 p-1.5 rounded hover:bg-blue-50" title="编辑编排">✏️</button>
                        <button onclick="SidebarInteraction.deleteTrack(${index})" class="text-gray-400 hover:text-red-500 p-1.5 rounded hover:bg-red-50" title="删除路线">🗑️</button>
                    </div>
                </div>
            `; 
        });

        if (html === '') html = '<p class="text-center text-gray-400 py-10">在左侧场地上画线开始编排</p>'; 
        list.innerHTML = html; 
        document.getElementById('skillCount').innerText = `${validCount}/8 有效`; 
    },

    deleteTrack: function(trackId) {
        canvasManager.tracks = canvasManager.tracks.filter(t => t.id !== trackId);
        canvasManager.redraw();
        this.updateUIRoutineList();
    },

    removeSkillFromTrack: function(trackId, skillIndex) {
        const track = canvasManager.tracks.find(t => t.id === trackId);
        if (track) {
            track.skills.splice(skillIndex, 1);
            if (track.connections && track.connections.length > 0) {
                let connIndex = Math.max(0, skillIndex - 1);
                track.connections.splice(connIndex, 1);
            }
            if (track.skills.length === 0) this.deleteTrack(trackId);
            else { canvasManager.redraw(); this.updateUIRoutineList(); }
        }
    },

    runScoringEngine: function() {
        const report = ChoreographyEngine.calculateDScore(canvasManager.tracks);
        let totalND = canvasManager.tracks.reduce((sum, t) => sum + (t.nd || 0), 0);

        document.getElementById('score-totalD').innerText = report.totalD.toFixed(2);
        document.getElementById('score-dv').innerText = report.dv.toFixed(2);
        document.getElementById('score-cr').innerText = report.cr.toFixed(2);
        document.getElementById('score-cv').innerText = report.cv.toFixed(2);
        document.getElementById('score-dmt').innerText = report.dmtBonus.toFixed(2);
        document.getElementById('score-nd').innerText = totalND.toFixed(2);

        const warningPanel = document.getElementById('warningsPanel');
        if (report.warnings.length > 0) {
            warningPanel.classList.remove('hidden');
            warningPanel.innerHTML = report.warnings.map(w => `<p>• ${w}</p>`).join('');
        } else {
            warningPanel.classList.add('hidden');
        }
        window.currentScoreReport = report;
    },

    triggerFinishAnimation: function() {
        console.log("%c[雷达1] 🚀 triggerFinishAnimation 被成功触发！", "color: white; background: #3b82f6; font-size: 14px; padding: 4px;");
        
        if(canvasManager.tracks.length === 0) { 
            console.warn("[雷达拦截] 画板上没有轨迹！");
            ToastManager.show('warning', '操作拦截', '你还没编排动作呢！'); 
            return; 
        }

        const mode = window.currentRoutineData?.gymnastMode || 'none';
        console.log(`%c[雷达2] 🔍 当前读取到的模式(mode)是: [${mode}]`, "color: #f59e0b; font-weight: bold; font-size: 14px;");
        
        const actualDScore = window.currentScoreReport ? window.currentScoreReport.totalD : 0;

        try {
            if (mode === 'none') {
                console.log("[雷达3] 进入 'none' (无名将) 模式，准备算分...");
                window.currentRoutineData.gymnastName = "无";
                if (typeof ExecutionEngine !== 'undefined') {
                    window.currentEScoreReport = ExecutionEngine.calculateEScore('none', canvasManager.tracks, actualDScore);
                }
                console.log("[雷达4] 准备调用 playShowcase() !");
                this.playShowcase();

            } else if (mode === 'custom') {
                console.log("[雷达3] 进入 'custom' (自定义) 模式，弹出输入框");
                const customName = document.getElementById('customGymnastNameInput')?.value || "佚名选手";
                window.currentRoutineData.gymnastName = customName;
                document.getElementById('customScoreModal')?.classList.remove('hidden');

            } else {
                console.log("[雷达3] 进入名将模式，准备在 gymnastsData 中查找...");
                const gymnast = typeof gymnastsData !== 'undefined' ? gymnastsData.find(g => g.id === mode) : null;
                
                if (!gymnast) {
                    console.error(`%c[致命错误] 找不到 id 为 ${mode} 的名将！代码将在此处静默中止！`, "color: white; background: red; font-size: 14px; padding: 4px;");
                    ToastManager.show('error', '选手丢失', '未找到对应的名将数据，请检查配置！');
                    return; // 🚨 这里就是最可能引发你问题的静默杀手！
                }
                
                console.log(`[雷达4] 成功找到选手: ${gymnast.nameEn}，准备算分...`);
                window.currentRoutineData.gymnastName = gymnast.nameEn;
                if (typeof ExecutionEngine !== 'undefined') {
                    window.currentEScoreReport = ExecutionEngine.calculateEScore(mode, canvasManager.tracks, actualDScore);
                }
                
                console.log("[雷达5] 算分完毕，立刻调用 playShowcase() !");
                this.playShowcase();
            }
        } catch (error) {
            console.error("%c[雷达异常] 算分引擎崩溃，触发降级保护！", "background: red; color: white;", error);
            window.currentEScoreReport = { fallTrackIds: [], finalEScore: 10, details: ["安全模式"] };
            this.playShowcase(); 
        }
    },
    
    showFinalScoreBoard: function() {
        const dReport = window.currentScoreReport || { totalD: 0 };
        const gymnastMode = window.currentRoutineData?.gymnastMode || 'none';
        const playbackMode = window.currentPlaybackMode || 'auto_e';

        // ==========================================
        // 🟢 修复 E 分引擎缺失与报错问题，精准锁定状态
        // ==========================================
        if (this.isViewingMode && window.currentEScoreReport && window.currentEScoreReport.isFrozen) {
            // 完美冻结版（来自最新的分享口令），绝对不重算，直接通过
        } 
        else if (this.isViewingMode) {
            // 兼容老版本：如果分享码里没冻结分数，从案底提取当年扣分拼装
            let totalEDed = 0;
            let historyDetails = [];
            let hasManualEHistory = false;
            
            canvasManager.tracks.forEach((t, i) => {
                if (t.manualDeductions && t.manualDeductions.length > 0) {
                    t.manualDeductions.forEach(d => {
                        if (!d.isDScore) {
                            hasManualEHistory = true;
                            totalEDed += d.deduction;
                            historyDetails.push(`[路线${i+1}] ${d.faultName} : -${d.deduction.toFixed(1)}`);
                        }
                    });
                }
            });

            if (hasManualEHistory) {
                window.currentEScoreReport = {
                    finalEScore: 10.0 - totalEDed,
                    totalDeduction: totalEDed,
                    details: historyDetails,
                    isFrozen: true
                };
            } else {
                // 如果是没带案底的最古老自动打分口令，安全调用摇号机重新计算
                if (typeof ExecutionEngine !== 'undefined') {
                    // 🚨 修复错用的函数名，正确的方法名是 calculateEScore
                    window.currentEScoreReport = ExecutionEngine.calculateEScore(gymnastMode, canvasManager.tracks, dReport.totalD);
                    window.currentEScoreReport.isFrozen = true; 
                }
            }
        } 
        else {
            // 自己在工作台编辑时：如果不是手动打分，强制调用摇号机拿最新 E分
            if (playbackMode !== 'manual_e' && playbackMode !== 'no_e') {
                if (typeof ExecutionEngine !== 'undefined') {
                    // 🚨 修复错用的函数名
                    window.currentEScoreReport = ExecutionEngine.calculateEScore(gymnastMode, canvasManager.tracks, dReport.totalD);
                }
            }
        }

        const eReport = window.currentEScoreReport || { finalEScore: 10.0, details: [] };
        const finalTotal = dReport.totalD + eReport.finalEScore;
        
        // ✨【新增】标记算分完成，冻结分数状态
        if (!this.isViewingMode && playbackMode !== 'no_e') {
            this.markCalculationComplete();
        }
        
        // 🟢 核心修复：把保存草稿的行为，放在出分这一刻。观赏模式绝不往自己的历史库里塞垃圾！
        if (!this.isViewingMode) {
            this.saveRoutineToHistory(playbackMode === 'no_e' ? null : finalTotal.toFixed(3));
            this.exportToImage();
        }

        if (!dReport || !eReport) {
            ToastManager.show('error', '数据不完整', '成绩数据不完整，请先编排动作！');
            return;
        }

        // ==========================================
        // 以下拼接弹窗 DOM 结构
        // ==========================================
        let eScoreHtml = '';
        if (playbackMode !== 'no_e') {
            eScoreHtml = `
            <div class="bg-emerald-50 w-full py-4 rounded-xl border border-emerald-100">
                <p class="text-[10px] font-bold text-emerald-500 uppercase">E 分 (完成)</p>
                <p class="text-3xl font-black text-emerald-700">${eReport.finalEScore.toFixed(3)}</p>
            </div>`;
        }

        let detailsHtml = '';
        if (playbackMode !== 'no_e' && eReport.details && eReport.details.length > 0) {
            detailsHtml = `
            <div class="text-left bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6 max-h-40 overflow-y-auto shadow-inner">
                <h4 class="text-sm font-bold text-slate-700 mb-2 border-b border-slate-200 pb-1">📋 E分扣分明细：</h4>
                <ul class="text-sm text-slate-600 space-y-1">
                    ${eReport.details.map(d => `<li class="flex items-start"><span class="mr-2 text-red-500">•</span> ${d}</li>`).join('')}
                </ul>
            </div>`;
        }

        const routineNameForShare = window.currentRoutineData?.name || "未命名成套";
        const finalScoreText = playbackMode === 'no_e' ? `D分 ${dReport.totalD.toFixed(1)}` : `总分 ${finalTotal.toFixed(2)}`;

        let uploadBtnHtml = '';
        if (playbackMode === 'auto_e' || playbackMode === 'skip_to_d') {
            uploadBtnHtml = `
            <button onclick="AppController.attemptUploadLeaderboard()" class="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black py-3 rounded-xl text-sm transition shadow-lg flex justify-center items-center gap-1.5 transform hover:-translate-y-0.5">
                <span>🚀 付费冲榜</span>
            </button>`;
        } else {
            uploadBtnHtml = `
            <div class="flex-1 bg-slate-100 text-slate-400 font-bold py-3 rounded-xl text-xs flex justify-center items-center cursor-not-allowed border border-slate-200">
                🚫 非自动打分不可冲榜
            </div>`;
        }

        let html = `
        <div id="finalScoreModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center transition-opacity">
            <div class="bg-white p-8 rounded-[2rem] shadow-2xl max-w-lg w-full text-center border border-slate-100">
                <h2 class="text-3xl font-black text-slate-800 mb-6">成套已出分！🎉</h2>
                
                <!-- 分数卡片 -->
                <div class="flex justify-center gap-3 mb-6">
                    <div class="bg-blue-50 w-full py-4 rounded-xl border border-blue-100">
                        <p class="text-[10px] font-bold text-blue-500 uppercase">D 分 (难度)</p>
                        <p class="text-3xl font-black text-blue-700">${dReport.totalD.toFixed(3)}</p>
                    </div>
                    ${eScoreHtml}
                    ${playbackMode !== 'no_e' ? `
                    <div class="bg-slate-800 w-full py-4 rounded-xl border border-slate-900 shadow-lg transform scale-105">
                        <p class="text-[10px] font-bold text-slate-400 uppercase">最终总分</p>
                        <p class="text-3xl font-black text-white">${finalTotal.toFixed(3)}</p>
                    </div>` : ''}
                </div>
                
                ${detailsHtml}
                
                <!-- 第一排按钮 -->
                <div class="space-y-3">
                    <button onclick="startNewRoutine()" class="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 shadow-md transition-all flex justify-center items-center gap-2">
                        🎯 清空画板，编排下一套
                    </button>
                    <button onclick="document.getElementById('finalScoreModal').remove()" class="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 shadow-md transition-all flex justify-center items-center gap-2">
                        🎬 继续进行音乐编排或修改动作
                    </button>
                </div>
                
                <!-- 第二排按钮 -->
                <div class="flex gap-3 mt-3">
                    <button onclick="AppController.generateDetailImage()" class="flex-1 bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl text-sm transition flex justify-center items-center gap-1.5">
                        📸 下载明细单
                    </button>
                    ${uploadBtnHtml}
                    <button onclick="AppController.shareRoutinePlaceholder('${routineNameForShare}', '${finalScoreText}')" class="flex-1 bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl text-sm transition flex justify-center items-center gap-1.5">
                        🔗 复制口令
                    </button>
                </div>
            </div>
        </div>
        `;

        const existing = document.getElementById('finalScoreModal');
        if (existing) existing.remove();
        
        const modalDiv = document.createElement('div');
        modalDiv.innerHTML = html;
        document.body.appendChild(modalDiv.firstElementChild);
        
        // ✨ 显示音乐模式开关，并添加闪烁动画
        const musicModeWrapper = document.getElementById('musicModeWrapper');
        console.log("%c[showFinalScoreBoard 调试] 🔍 musicModeWrapper 元素:", "color: white; background: #ec4899; font-size: 12px; padding: 4px;", musicModeWrapper);
        
        if (musicModeWrapper) {
            musicModeWrapper.classList.remove('hidden');
            musicModeWrapper.classList.remove('grayscale', 'opacity-70');
            console.log("[showFinalScoreBoard 调试] ✅ musicModeWrapper 已显示，classList:", musicModeWrapper.classList.toString());
            
            // ✨ 3秒闪烁动画（熄灭→显示→熄灭→显示→熄灭→显示）
            let blinkCount = 0;
            const blinkInterval = setInterval(() => {
                if (blinkCount >= 6) {
                    clearInterval(blinkInterval);
                    musicModeWrapper.classList.remove('opacity-0');
                    console.log("[showFinalScoreBoard 调试] 闪烁动画结束，opacity 已恢复");
                } else {
                    musicModeWrapper.classList.toggle('opacity-0');
                    blinkCount++;
                }
            }, 500); // 每500ms切换一次，共3秒
            
            // ✨ 添加悬停提示
            musicModeWrapper.title = '点击开启音乐模式，您的编排将与音乐同步演示！\n首次使用建议查看帮助文档了解如何使用。';
        } else {
            console.error("%c[showFinalScoreBoard 调试] ❌ musicModeWrapper 元素不存在！", "color: white; background: red; font-size: 12px;");
        }
        
        const musicModeLabel = document.getElementById('musicModeLabel');
        console.log("[showFinalScoreBoard 调试] musicModeLabel 元素:", musicModeLabel);
        if (musicModeLabel) {
            musicModeLabel.innerText = '🎬 现场/音乐模式';
        }
        
        console.log("%c[showFinalScoreBoard 调试] 📊 当前 window.currentScoreReport:", "color: white; background: #10b981; font-size: 12px;", window.currentScoreReport);
        
        // ✨ 音乐编排模式：保持画线工具隐藏，提示用户退出编排功能
        if (window.currentRoutineData?.musicId) {
            const drawingToolsWrapper = document.getElementById('drawingToolsWrapper');
            const dragHintBar = document.getElementById('dragHintBar');
            // 不恢复画线工具，保持隐藏状态
            if (drawingToolsWrapper) drawingToolsWrapper.classList.add('hidden');
            if (dragHintBar) dragHintBar.classList.remove('hidden'); // 显示拖拽提示
            // 提示用户
            ToastManager.show('warning', '请先退出编排', '⚠️ 当前正在音乐编排中，画线功能已被锁定。\n请点击"重新选择音乐"按钮退出编排模式后，才能继续画线。', 4000);
        }
    },

    // ✨【新增】：冲榜扣费与拦截系统
    attemptUploadLeaderboard: function() {
        const mode = window.currentRoutineData.gymnastMode;
        
        // ==========================================
        // 🚨 资格检查：必须是数据库选手才能冲榜
        // ==========================================
        if (mode === 'none') {
            ToastManager.show('error', '冲榜失败', '❌ 纯排位测试模式不可冲榜！\n请在设置页面选择数据库中的真实选手。', 4000);
            return;
        }
        
        if (mode === 'custom') {
            ToastManager.show('error', '冲榜失败', '❌ 自定义选手不可冲榜！\n请在设置页面选择数据库中的真实选手。', 4000);
            return;
        }
        
        // ==========================================
        // 🚨 资格检查：必须是自动打分模式
        // ==========================================
        const playbackMode = window.currentPlaybackMode || 'auto_e';
        if (playbackMode !== 'auto_e') {
            ToastManager.show('error', '冲榜失败', '❌ 只有【系统自动算E分】模式可参与排行榜！', 4000);
            return;
        }
        
        // ==========================================
        // 🚨 资格检查：必须完成完整算分流程
        // ==========================================
        if (!window.currentEScoreReport || !window.currentEScoreReport.isFrozen) {
            ToastManager.show('error', '冲榜失败', '❌ 请先完成【编排完成】→【亮相】流程！', 4000);
            return;
        }
        
        // ==========================================
        // 🚨 资格检查：成套未被修改
        // ==========================================
        if (AppController.needsRecalculation()) {
            ToastManager.show('error', '冲榜失败', '❌ 成套已被修改，请重新完成【编排完成】→【亮相】流程！', 4000);
            return;
        }

        // 从数据库查这个人的出场费。如果你没在数据里写 cost，默认收 20 块门票费。
        const gymnast = typeof gymnastsData !== 'undefined' ? gymnastsData.find(g => g.id === mode) : null;
        const cost = (gymnast && gymnast.cost !== undefined) ? gymnast.cost : 20;
        const name = gymnast ? gymnast.nameEn : '当前选手';

        const currentCoins = CoinManager.getCoins();

        if (currentCoins < cost) {
            ToastManager.show('error', '金币不足', `余额: ${currentCoins} 🪙 | 需要: ${cost} 🪙\n穷鬼教练，请明天再来领取每日低保吧！`, 4000);
            return;
        }

        if (confirm(`🏆 冲榜确认\n派遣【${name}】打入全球排行榜，将消耗您 ${cost} 🪙 出场费。\n是否确认支付并上传？`)) {
            // 扣钱
            CoinManager.deductCoins(cost);
            // 关掉成绩单弹窗
            document.getElementById('finalScoreModal').remove();
            // 呼叫上一阶段写的云端上传接口！
            if (typeof SupabaseEngine !== 'undefined') {
                SupabaseEngine.uploadRoutine(); 
            } else {
                ToastManager.show('error', '上传失败', '云端连接失败，可能是网络问题。金币已扣除但未上传。');
            }
        }
    },

    // 【新增】处理自定义填分提交
    confirmCustomScore: function() {
        const val = parseFloat(document.getElementById('customEScoreInput').value);
        if (isNaN(val) || val < 0 || val > 10) {
            ToastManager.show('error', '输入无效', '请输入 0 到 10 之间的有效 E 分！');
            return;
        }
        document.getElementById('customScoreModal').classList.add('hidden');
        
        // 伪造一个数据给动画和算分面板
        window.currentEScoreReport = {
            gymnastNameEn: window.currentRoutineData.gymnastName,
            isCustom: true,
            fallTrackIds: [], // 自定义选手不进行随机摔倒判定
            finalEScore: val
        };
        this.playShowcase();
    },

    playShowcase: function() {
        const container = document.getElementById('floorContainer');
        
        // 动态创建亮相覆盖层
        const overlay = document.createElement('div');
        overlay.id = "showcaseOverlay";
        overlay.className = "absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-md text-white font-black tracking-widest pointer-events-none transition-opacity duration-500 opacity-0";
        overlay.innerHTML = `<span class="text-5xl md:text-6xl drop-shadow-2xl scale-50 transition-transform duration-500" id="showcaseText">✨成套亮相✨</span>`;
        container.appendChild(overlay);

        requestAnimationFrame(() => {
            overlay.classList.remove('opacity-0');
            document.getElementById('showcaseText').classList.remove('scale-50');
            document.getElementById('showcaseText').classList.add('scale-100');
        });

        setTimeout(() => {
            overlay.classList.add('opacity-0');
            setTimeout(() => { if (container.contains(overlay)) container.removeChild(overlay); }, 500);

            let fallIds = window.currentEScoreReport ? window.currentEScoreReport.fallTrackIds : [];
            
            // 修复：添加回调函数和 fallTrackIds 参数
            canvasManager.playHighlightAnimation(() => {
                if (overlay && overlay.parentNode) {
                    overlay.classList.add('opacity-0');
                    setTimeout(() => { if(overlay.parentNode) container.removeChild(overlay); }, 500);
                }
                
                // 动画结束后的处理：显示分数面板
                if (window.currentPlaybackMode === 'manual_e' && !window.AppController.isViewingMode) {
                    AppController.showArtistryPanel();
                } else {
                    AppController.showFinalScoreBoard();
                }
                
            }, fallIds); 
        }, 800); 
    },

    // ✨【新增】：暂存草稿功能
    saveDraft: function() {
        if (canvasManager.tracks.length === 0) {
            ToastManager.show('warning', '操作拦截', '画板上还没有任何动作，不需要保存草稿哦~');
            return;
        }
        if (!canvasManager || !canvasManager.tracks) return;
        // 执行深拷贝，将当前的 2D 编排轨迹完整备份到全局临时的草稿箱中
        window.routineDraftBackup = JSON.parse(JSON.stringify(canvasManager.tracks));
        console.log("[版本控制] 当前编排已安全备份至云端草稿箱 🔒");

        let history = JSON.parse(localStorage.getItem('gymChoreoHistory') || '[]');
        let currentName = window.currentRoutineData?.name || "未命名成套";
        
        // 自动加上草稿后缀
        if (!currentName.endsWith("(草稿)")) {
            currentName += " (草稿)";
        }

        // ✨【改进】：保存当前得分状态
        let scoreText = "暂存";
        if (window.currentScoreReport) {
            scoreText = `D分 ${window.currentScoreReport.totalD.toFixed(3)}`;
            if (window.currentEScoreReport && window.currentPlaybackMode !== 'no_e') {
                scoreText += ` | E分 ${window.currentEScoreReport.finalEScore.toFixed(2)}`;
            }
        }

        let routine = {
            id: 'routine_' + Date.now(),
            name: currentName,
            brand: window.currentRoutineData?.brand || "gymnova",
            date: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString().slice(0,5),
            score: scoreText, // ✨ 保存实际得分
            tracks: JSON.parse(JSON.stringify(canvasManager.tracks)), // ✨ 深拷贝
            // ✨【新增】：保存体操运动员信息
            gymnastMode: window.currentRoutineData?.gymnastMode || "none",
            gymnastName: window.currentRoutineData?.gymnastName || "纯排位测试 (无E分)",
            // ✨【新增】：保存音乐配置
            musicId: window.currentRoutineData?.musicId || null,
            musicUrl: window.currentRoutineData?.musicUrl || null,
            // ✨【新增】：保存音乐标记和编排数据
            musicMarkers: window.currentRoutineData?.musicMarkers ? JSON.parse(JSON.stringify(window.currentRoutineData.musicMarkers)) : null,
            placedActions: window.currentRoutineData?.placedActions ? JSON.parse(JSON.stringify(window.currentRoutineData.placedActions)) : null,
            // ✨【新增】：保存完整得分报告
            scoreReport: window.currentScoreReport ? JSON.parse(JSON.stringify(window.currentScoreReport)) : null,
            eScoreReport: window.currentEScoreReport ? JSON.parse(JSON.stringify(window.currentEScoreReport)) : null,
            playbackMode: window.currentPlaybackMode || 'auto',
            // ✨【新增】：E分历史记录数组
            eScoreHistory: window.currentEScoreReport ? [{
                id: 'escore_' + Date.now(),
                name: this._generateDefaultEScoreName(),
                date: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString().slice(0,5),
                timestamp: Date.now(),
                eScoreReport: JSON.parse(JSON.stringify(window.currentEScoreReport)),
                playbackMode: window.currentPlaybackMode || 'auto'
            }] : []
        };
        
        history.unshift(routine); 
        localStorage.setItem('gymChoreoHistory', JSON.stringify(history));
        this.renderHistory();

        // ✨【FlowStateManager】标记数据已保存
        if (window.FlowStateManager) {
            window.FlowStateManager.markClean();
        }

        ToastManager.show('success', '保存成功', '💾 草稿已安全保存！\n可随时在【我的成套】中点击加载。');
    },

    saveRoutineToHistory: function(finalTotalScore) {
        let history = JSON.parse(localStorage.getItem('gymChoreoHistory') || '[]');
        
        // ✨【核心修改】：如果有总分传入（且不是只看D分模式），把总分拼接到历史记录的徽章里
        let scoreText = `D分 ${window.currentScoreReport.totalD.toFixed(3)}`;
        if (finalTotalScore && window.currentPlaybackMode !== 'no_e') {
            scoreText += ` | 总分 ${finalTotalScore}`;
        }

        let routine = {
            id: 'routine_' + Date.now(),
            name: window.currentRoutineData?.name || "未命名成套",
            brand: window.currentRoutineData?.brand || "gymnova",
            date: new Date().toLocaleDateString(),
            score: scoreText,
            tracks: JSON.parse(JSON.stringify(canvasManager.tracks)), // ✨ 深拷贝
            // ✨【新增】：保存体操运动员信息
            gymnastMode: window.currentRoutineData?.gymnastMode || "none",
            gymnastName: window.currentRoutineData?.gymnastName || "纯排位测试 (无E分)",
            // ✨【新增】：保存音乐配置
            musicId: window.currentRoutineData?.musicId || null,
            musicUrl: window.currentRoutineData?.musicUrl || null,
            // ✨【新增】：保存音乐标记和编排数据
            musicMarkers: window.currentRoutineData?.musicMarkers ? JSON.parse(JSON.stringify(window.currentRoutineData.musicMarkers)) : null,
            placedActions: window.currentRoutineData?.placedActions ? JSON.parse(JSON.stringify(window.currentRoutineData.placedActions)) : null,
            // ✨【新增】：保存完整得分报告
            scoreReport: window.currentScoreReport ? JSON.parse(JSON.stringify(window.currentScoreReport)) : null,
            eScoreReport: window.currentEScoreReport ? JSON.parse(JSON.stringify(window.currentEScoreReport)) : null,
            playbackMode: window.currentPlaybackMode || 'auto',
            // ✨【新增】：E分历史记录数组
            eScoreHistory: window.currentEScoreReport ? [{
                id: 'escore_' + Date.now(),
                name: AppController._generateDefaultEScoreName(),
                date: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString().slice(0,5),
                timestamp: Date.now(),
                eScoreReport: JSON.parse(JSON.stringify(window.currentEScoreReport)),
                playbackMode: window.currentPlaybackMode || 'auto'
            }] : []
        };
        history.unshift(routine); 
        localStorage.setItem('gymChoreoHistory', JSON.stringify(history));
        this.renderHistory();
    },
    // ==========================================
    // ✨【追加】：专门保存“音乐卡点与 3D 现场版”的存档引擎
    // ==========================================
    saveMusicRoutineVersion: function() {
        if (typeof canvasManager === 'undefined' || canvasManager.tracks.length === 0) return;

        let history = JSON.parse(localStorage.getItem('gymChoreoHistory') || '[]');
        let currentName = window.currentRoutineData?.name || "未命名成套";
        
        // 核心：为音乐版打上专属的 🎶 后缀和标识
        let routine = {
            id: 'routine_music_' + Date.now(),
            name: currentName + " (🎶 音乐现场版)",
            brand: window.currentRoutineData?.brand || "gymnova",
            date: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString().slice(0,5),
            score: window.currentScoreReport ? `D分 ${window.currentScoreReport.totalD.toFixed(3)}` : "已锁定编排",
            tracks: JSON.parse(JSON.stringify(canvasManager.tracks)), // 深度拷贝包含时间戳的轨迹
            hasMusicSync: true, // ⚠️ 专属标记：证明它包含音乐和时间轴数据
            // ✨【新增】：保存体操运动员信息
            gymnastMode: window.currentRoutineData?.gymnastMode || "none",
            gymnastName: window.currentRoutineData?.gymnastName || "纯排位测试 (无E分)",
            // ✨【新增】：保存音乐配置
            musicId: window.currentRoutineData?.musicId || null,
            musicUrl: window.currentRoutineData?.musicUrl || null,
            // ✨【新增】：保存音乐标记和编排数据
            musicMarkers: window.currentRoutineData?.musicMarkers ? JSON.parse(JSON.stringify(window.currentRoutineData.musicMarkers)) : null,
            placedActions: window.currentRoutineData?.placedActions ? JSON.parse(JSON.stringify(window.currentRoutineData.placedActions)) : null,
            // ✨【新增】：保存完整得分报告
            scoreReport: window.currentScoreReport ? JSON.parse(JSON.stringify(window.currentScoreReport)) : null,
            eScoreReport: window.currentEScoreReport ? JSON.parse(JSON.stringify(window.currentEScoreReport)) : null,
            playbackMode: window.currentPlaybackMode || 'auto',
            // ✨【新增】：E分历史记录数组
            eScoreHistory: window.currentEScoreReport ? [{
                id: 'escore_' + Date.now(),
                name: AppController._generateDefaultEScoreName(),
                date: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString().slice(0,5),
                timestamp: Date.now(),
                eScoreReport: JSON.parse(JSON.stringify(window.currentEScoreReport)),
                playbackMode: window.currentPlaybackMode || 'auto'
            }] : []
        };
        
        history.unshift(routine); 
        localStorage.setItem('gymChoreoHistory', JSON.stringify(history));
        this.renderHistory();
    },

    // ✨【修复 #1】私密分享草稿 (不再上榜)
    shareFromHistory: function(id) {
        let history = JSON.parse(localStorage.getItem('gymChoreoHistory') || '[]');
        let routine = history.find(r => r.id === id);
        if (!routine) return;

        // ✨【安全解析】：防止草稿数据导致 split 返回 undefined
        let rawD = 0;
        if (routine.score && routine.score.includes('D分 ')) {
            const parsed = routine.score.split('D分 ')[1];
            rawD = parseFloat(parsed) || 0;
        }
        const payload = {
            name: routine.name.replace(" (草稿)", ""),
            brand: routine.brand,
            dScore: rawD,
            eScore: 0, 
            tracks: routine.tracks
        };
        // 注意：第二个参数传 false，代表【不上榜】
        SupabaseEngine.uploadRoutine(payload, false);
    },

    // ✨【修复 #5】历史记录的“冲榜”校验器
    uploadFromHistory: function(id) {
        let history = JSON.parse(localStorage.getItem('gymChoreoHistory') || '[]');
        let routine = history.find(r => r.id === id);
        if (!routine) return;

        // 【核心拦截】：必须是数据库选手 + 自动打 E 分 才能冲榜
        if (routine.gMode === 'none' || routine.gMode === 'custom' || !routine.score.includes('总分')) {
            ToastManager.show('error', '资格不符', '❌ 只有使用【数据库名将】且由【系统自动算E分】的成套，才能参与全网排行榜保证公平！');
            return;
        }

        // ✨【安全解析】：防止草稿数据导致 split 返回 undefined
        let rawD = 0;
        let rawTotal = 0;
        if (routine.score && routine.score.includes('D分 ')) {
            rawD = parseFloat(routine.score.split('D分 ')[1]) || 0;
        }
        if (routine.score && routine.score.includes('总分 ')) {
            rawTotal = parseFloat(routine.score.split('总分 ')[1]) || 0;
        }
        
        const payload = {
            name: routine.name,
            brand: routine.brand,
            dScore: rawD,
            eScore: rawTotal - rawD, // 逆向算出 E 分
            tracks: routine.tracks
        };
        
        // 扣门票钱
        const cost = 20; // 统一定价 20 金币
        if (CoinManager.getCoins() < cost) {
            ToastManager.show('error', '金币不足', `冲榜需要 ${cost} 🪙，请明天签到再来吧！`);
            return;
        }

        if (confirm(`🏆 冲榜确认\n上传《${routine.name}》打入全球排行榜，将消耗 ${cost} 🪙。\n是否支付？`)) {
            CoinManager.deductCoins(cost);
            // 注意：第二个参数传 true，代表【公开上榜】
            SupabaseEngine.uploadRoutine(payload, true);
        }
    },

    renderHistory: function() {
        // 注意：不再自动进入历史查看模式
        // 只有用户主动切换到历史选项卡时才进入该模式
        const grid = document.getElementById('historyGrid');
        let history = JSON.parse(localStorage.getItem('gymChoreoHistory') || '[]');
        if (history.length === 0) {
            grid.innerHTML = '<p class="text-gray-400 col-span-full text-center py-10 text-sm">暂无保存的成套，去"战术画板"编排一套吧！</p>';
            return;
        }
        grid.innerHTML = '';
        
        history.forEach(routine => {
            let actionButtonsHTML = '';
            
            // ✨【完美回滚与融合】：判断这条成套是否绑定了音乐
            const hasMusic = !!(routine.musicId || routine.musicUrl || routine.isMusicVersion);

            if (hasMusic) {
                // 🎶 如果是音乐版：保留编辑功能 + 音乐现场回放
                actionButtonsHTML = `
                    <button onclick="AppController.loadRoutine('${routine.id}', true)" 
                            class="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs py-2 rounded-lg transition-all shadow-sm flex items-center justify-center gap-1"
                            title="加载此音乐版本，并进入展示模式">
                        <span>🎵 导入与展示</span>
                    </button>
                    <button onclick="AppController.loadRoutine('${routine.id}', false)" 
                            class="flex-1 bg-white border border-blue-200 hover:bg-blue-50 text-blue-600 font-black text-xs py-2 rounded-lg transition-all shadow-sm flex items-center justify-center gap-1">
                        <span>✏️ 覆盖</span>
                    </button>
                    <button onclick="AppController.shareFromHistory('${routine.id}')" 
                            class="px-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800 font-bold text-xs py-2 rounded-lg transition-all shadow-sm">
                        <span>🔗</span>
                    </button>
                    <button onclick="AppController.uploadFromHistory('${routine.id}')" 
                            class="px-2.5 bg-purple-50 text-purple-600 hover:bg-purple-100 font-bold text-xs py-2 rounded-lg transition-all shadow-sm">
                        <span>🚀</span>
                    </button>
                    <button onclick="AppController.deleteHistory('${routine.id}')" 
                            class="px-2.5 bg-red-50 text-red-400 hover:text-red-600 hover:bg-red-100 font-bold text-xs py-2 rounded-lg transition-all">
                        <span>🗑️</span>
                    </button>
                `;
            } else {
                // ✏️ 如果是普通编排版：保留你原本的所有优秀功能（编辑、分享、冲榜）
                actionButtonsHTML = `
                    <button onclick="AppController.loadRoutine('${routine.id}', true)" 
                            class="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-black text-xs py-2 rounded-lg transition-all shadow-sm flex items-center justify-center gap-1">
                        <span>📥 导入到新草稿纸</span>
                    </button>
                    <button onclick="AppController.loadRoutine('${routine.id}', false)" 
                            class="flex-1 bg-white border border-blue-200 hover:bg-blue-50 text-blue-600 font-black text-xs py-2 rounded-lg transition-all shadow-sm flex items-center justify-center gap-1">
                        <span>✏️ 覆盖当前编辑</span>
                    </button>
                    <button onclick="AppController.shareFromHistory('${routine.id}')" 
                            class="px-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800 font-bold text-xs py-2 rounded-lg transition-all shadow-sm">
                        <span>🔗</span>
                    </button>
                    <button onclick="AppController.uploadFromHistory('${routine.id}')" 
                            class="px-2.5 bg-purple-50 text-purple-600 hover:bg-purple-100 font-bold text-xs py-2 rounded-lg transition-all shadow-sm">
                        <span>🚀</span>
                    </button>
                    <button onclick="AppController.deleteHistory('${routine.id}')" 
                            class="px-3 bg-red-50 text-red-400 hover:text-red-600 hover:bg-red-100 font-bold text-xs py-2 rounded-lg transition-all">
                        <span>🗑️</span>
                    </button>
                `;
            }

            grid.innerHTML += `
                <div class="bg-gray-50 border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all relative overflow-hidden group">
                    <div class="absolute top-0 left-0 w-2 h-full bg-blue-500 group-hover:bg-indigo-500 transition-colors"></div>
                    <div class="flex justify-between items-start mb-2">
                        <h4 class="font-black text-base text-gray-800 truncate pr-4">${routine.name}</h4>
                        <span class="bg-blue-50 text-blue-700 border border-blue-200 font-bold px-2 py-0.5 rounded text-xs shrink-0">${routine.score}</span>
                        ${window.FlowStateManager ? `<span class="shrink-0 ml-1 px-2 py-0.5 rounded text-xs font-bold ${
                            routine.scoreReport ? 'bg-green-100 text-green-700 border border-green-200' :
                            routine.musicUrl || routine.musicId ? 'bg-purple-100 text-purple-700 border border-purple-200' :
                            routine.tracks && routine.tracks.length > 0 ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                            'bg-gray-100 text-gray-500 border border-gray-200'
                        }">${
                            routine.scoreReport ? '✓ 已完成' :
                            routine.musicUrl || routine.musicId ? '♪ 已配乐' :
                            routine.tracks && routine.tracks.length > 0 ? '✎ 已编排' :
                            '○ 新建'
                        }</span>` : ''}
                    </div>
                    <p class="text-[11px] text-slate-400 mb-4">保存时间: ${routine.date} | 场地: ${routine.brand.toUpperCase()}</p>
                    ${(routine.eScoreHistory && routine.eScoreHistory.length > 0) ? `
                        <button onclick="AppController.showEScoreHistoryModal('${routine.id}')" 
                                class="w-full mb-3 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 font-bold text-xs rounded-lg transition-colors border border-emerald-200 flex items-center justify-center gap-1">
                            <span>📊</span> 查看E分历史 (${routine.eScoreHistory.length}条)
                        </button>
                    ` : ''}
                    <div class="flex flex-wrap gap-1.5 mt-2">
                    ${actionButtonsHTML}
                </div>
                </div>
            `;
        });
    },

    // ✨ 替换原来的画饼占位函数，实现真正的口令一键复制
    shareRoutinePlaceholder: function(name, score) {
        // 临时将当前草稿加载到舞台（为了提取 tracks 数据）
        const code = ShareEngine.generateShareCode();
        if(!code) {
            ToastManager.show('warning', '操作拦截', '只能在画板里直接点击分享，或者先加载草稿后再分享哦！');
            return;
        }

        // 复制到剪贴板
        navigator.clipboard.writeText(code).then(() => {
            ToastManager.show('success', '口令生成成功', `复制成功！\n发给好友，他们点击“导入口令”即可重现。`, 5000);
        }).catch(err => {
            // 降级兼容保护：如果浏览器禁用了剪贴板 API，弹窗让用户手动手动复制
            prompt("复制失败，请手动复制以下口令：", code);
        });
    },

    // ✨【新增】：逆向工程，将历史记录完全还原到工作台
    // toNewWorkspace: true = 导入到新草稿纸, false = 覆盖当前编辑
    loadRoutine: function(id, toNewWorkspace = false) {
        let history = JSON.parse(localStorage.getItem('gymChoreoHistory') || '[]');
        let routine = history.find(r => r.id === id);
        if (!routine) return;

        // 如果当前有内容，且不是导入到新草稿纸，需要确认
        if (canvasManager.tracks.length > 0 && !toNewWorkspace) {
            if (!confirm("加载历史记录将覆盖您当前画板上的所有进度，确定要加载吗？")) return;
        }

        // 导入到新草稿纸模式
        if (toNewWorkspace) {
            // 检查草稿纸数量上限
            if (typeof WorkspaceManager !== 'undefined' && WorkspaceManager.workspaces.length >= WorkspaceManager.MAX_WORKSPACES) {
                ToastManager.show('warning', '草稿纸数量已达上限', `系统最多仅支持同时开启 ${WorkspaceManager.MAX_WORKSPACES} 张草稿纸！`, 5000);
                return;
            }
            
            // ✨ 标记即将从历史导入，让 WorkspaceManager 直接创建草稿纸
            window._pendingHistoryImport = true;
            
            // ✨ 创建新的草稿纸
            if (typeof createNewWorkspace === 'function') {
                createNewWorkspace();
            } else if (typeof WorkspaceManager !== 'undefined' && typeof WorkspaceManager.createNewWorkspace === 'function') {
                WorkspaceManager.createNewWorkspace();
            }
        }

        // 1. 恢复核心轨迹数据（加上空数组兜底，防崩溃）
        canvasManager.tracks = routine.tracks || [];
        console.log("%c[loadRoutine 调试] ✅ 恢复轨迹数据", "color: white; background: #10b981; font-size: 12px;", `tracks 数量: ${routine.tracks?.length || 0}`);

        // 2. 安全恢复全局状态与名称 (增加对旧版本没有 name 字段的防雷保护)
        const safeName = routine.name || "未命名成套";
        window.currentRoutineData.name = safeName.replace(" (草稿)", "");
        window.currentRoutineData.brand = routine.brand || 'gymnova';
        window.currentRoutineData.musicId = routine.musicId || null;
        window.currentRoutineData.musicUrl = routine.musicUrl || null;
        window.currentRoutineData.gymnastMode = routine.gymnastMode || 'none';
        window.currentRoutineData.gymnastName = routine.gymnastName || "";
        window.currentRoutineData.eScoreHistory = routine.eScoreHistory || [];
        window.currentRoutineData.initialized = true;
        
        // 恢复最新的E分记录到当前E分
        if (routine.eScoreHistory && routine.eScoreHistory.length > 0) {
            const latestRecord = routine.eScoreHistory[routine.eScoreHistory.length - 1];
            window.currentEScoreReport = JSON.parse(JSON.stringify(latestRecord.eScoreReport));
            window.currentScoreReport = JSON.parse(JSON.stringify(latestRecord.eScoreReport));
            window.currentPlaybackMode = latestRecord.playbackMode || 'auto';
            console.log("%c[loadRoutine 调试] ✅ 从 eScoreHistory 恢复分数", "color: white; background: #10b981; font-size: 12px;", window.currentScoreReport);
        } else {
            window.currentEScoreReport = routine.eScoreReport ? JSON.parse(JSON.stringify(routine.eScoreReport)) : null;
            window.currentScoreReport = routine.scoreReport ? JSON.parse(JSON.stringify(routine.scoreReport)) : null;
            window.currentPlaybackMode = routine.playbackMode || 'auto';
            console.log("%c[loadRoutine 调试] ✅ 从 scoreReport/eScoreReport 恢复分数", "color: white; background: #10b981; font-size: 12px;", window.currentScoreReport);
        }
        
        console.log("%c[loadRoutine 调试] ✅ window.currentScoreReport 设置完成:", "color: white; background: #f59e0b; font-size: 12px;", window.currentScoreReport);

        // 3. 恢复场地 UI 和颜色
        if (typeof selectBrand === 'function') {
            selectBrand(window.currentRoutineData.brand);
        }

        // 4. 同步顶部控制台的名字
        const nameInput = document.getElementById('routineNameInput');
        if (nameInput) nameInput.value = window.currentRoutineData.name;
        const displayRoutineName = document.getElementById('displayRoutineName');
        if (displayRoutineName) displayRoutineName.innerText = window.currentRoutineData.name;

        const displayGymnastName = document.getElementById('displayGymnastName');
        const displayGymnastFlag = document.getElementById('displayGymnastFlag');
        const avatarEl = document.getElementById('displayGymnastAvatar');
        const placeholderEl = document.getElementById('displayGymnastPlaceholder');

        if (displayGymnastName) displayGymnastName.innerText = window.currentRoutineData.gymnastName || "纯排位测试";
        if (displayGymnastFlag) displayGymnastFlag.innerHTML = "";
        if (avatarEl) avatarEl.classList.add('hidden');
        if (placeholderEl) {
            placeholderEl.innerText = "🙈";
            placeholderEl.classList.remove('hidden');
        }

        // 6. 暴力唤醒重绘与侧边栏算分 (加入 try-catch 防止旧数据的脏数据报错阻断切页)
        try {
            canvasManager.redraw();
            this.updateUIRoutineList();
        } catch (error) {
            console.error("🚨 历史数据渲染遇到瑕疵，但不阻碍进入画板:", error);
        }

        // 8. 强行切回战术板
        isRoutineInitialized = true;
        switchTab('builder');

        // ✨【新增】：如果成套已有分数，直接显示音乐模式开关，不需要重新打分
        console.log("%c[loadRoutine 调试] 检查分数状态", "color: white; background: #3b82f6; font-size: 12px;");
        console.log("[loadRoutine 调试] window.currentScoreReport:", window.currentScoreReport);
        console.log("[loadRoutine 调试] window.currentEScoreReport:", window.currentEScoreReport);
        console.log("[loadRoutine 调试] window.currentRoutineData.musicId:", window.currentRoutineData.musicId);
        
        if (window.currentScoreReport || window.currentEScoreReport || window.currentRoutineData.musicId) {
            const musicModeWrapper = document.getElementById('musicModeWrapper');
            const musicModeLabel = document.getElementById('musicModeLabel');
            if (musicModeWrapper) {
                musicModeWrapper.classList.remove('hidden');
                musicModeWrapper.classList.remove('grayscale', 'opacity-70');
                console.log("[loadRoutine 调试] ✅ 已显示音乐模式开关");
            }
            if (musicModeLabel) {
                musicModeLabel.innerText = '🎬 现场/音乐模式';
            }
            
            // ✨【新增】：如果有音乐数据，显示音乐编辑界面
            if (window.currentRoutineData.musicId && window.currentRoutineData.musicMarkers) {
                console.log("[loadRoutine 调试] ✅ 发现音乐数据，恢复音乐编辑界面");
                
                // 隐藏曲库列表，显示重新选择按钮
                const libraryList = document.getElementById('musicLibraryList');
                const reselectBtn = document.getElementById('reselectMusicBtn');
                const libraryTitle = document.getElementById('libraryTitle');
                const musicActionButtons = document.getElementById('musicActionButtons');
                const timelineEditor = document.getElementById('timelineEditor');
                const routineEditorBox = document.getElementById('routineEditorBox');
                const confirmBtn = document.getElementById('musicConfirmBtn');
                
                if (libraryList) libraryList.classList.add('hidden');
                if (reselectBtn) reselectBtn.classList.remove('hidden');
                if (libraryTitle) libraryTitle.innerText = '🎵 可用曲库中心';
                if (musicActionButtons) musicActionButtons.classList.remove('hidden');
                if (timelineEditor) timelineEditor.classList.remove('hidden');
                if (routineEditorBox) routineEditorBox.classList.remove('hidden');
                if (confirmBtn) confirmBtn.classList.add('hidden');
                
                // 更新时间轴UI
                if (typeof updateTimelineUI === 'function') {
                    updateTimelineUI();
                }
                if (typeof updateRoutineSlots === 'function') {
                    updateRoutineSlots();
                }
                
                // 隐藏画线工具，显示拖拽提示栏
                const drawingToolsWrapper = document.getElementById('drawingToolsWrapper');
                const dragHintBar = document.getElementById('dragHintBar');
                if (drawingToolsWrapper) drawingToolsWrapper.classList.add('hidden');
                if (dragHintBar) dragHintBar.classList.remove('hidden');
                
                // 显示"确认编排完毕"按钮
                const confirmMusicArrangeBtn = document.getElementById('confirmMusicArrangeBtn');
                if (confirmMusicArrangeBtn) confirmMusicArrangeBtn.classList.remove('hidden');
                
                ToastManager.show('success', '数据加载完毕', `进度已成功还原到画板！\n🎵 已恢复您的音乐编排，可直接点击音乐模式开关进行展示！`, 4000);
            } else {
                ToastManager.show('success', '数据加载完毕', `进度已成功还原到画板！\n已为您保留原有的分数，可直接开启音乐模式。`, 4000);
            }
        } else {
            // 延迟给一个小弹窗，让用户感到安心
            const eScoreInfo = routine.eScoreHistory && routine.eScoreHistory.length > 0 
                ? `\n该成套有 ${routine.eScoreHistory.length} 条E分历史记录。` 
                : '';
            setTimeout(() => ToastManager.show('success', '还原成功', `进度已成功还原到画板！您可以继续编辑了。${eScoreInfo}`), 100);
        }
    },

    // ✨【新增】：将历史记录导入到新草稿纸（切换到设置面板）
    loadRoutineToNewWorkspace: function(routine) {
        // 检查草稿纸数量上限
        if (WorkspaceManager.workspaces.length >= WorkspaceManager.MAX_WORKSPACES) {
            ToastManager.show('warning', '草稿纸数量已达上限', `系统最多仅支持同时开启 ${WorkspaceManager.MAX_WORKSPACES} 张草稿纸！`, 5000);
            return;
        }

        // 切换到设置面板
        switchTab('setup');
        
        // 预填充设置数据
        window.currentRoutineData = {
            name: routine.name.replace(" (草稿)", "").replace(" (🎶 音乐现场版)", ""),
            brand: routine.brand || "gymnova",
            gymnastMode: routine.gymnastMode || "none",
            gymnastName: routine.gymnastName || "",
            musicId: routine.musicId || null,
            musicUrl: routine.musicUrl || null,
            initialized: false // 未完成设置，需要用户确认
        };
        
        // 填充表单
        const routineNameInput = document.getElementById('routineNameInput');
        if (routineNameInput) routineNameInput.value = window.currentRoutineData.name;
        
        // 应用地板品牌
        if (typeof selectBrand === 'function') {
            selectBrand(window.currentRoutineData.brand);
        }
        
        ToastManager.show('info', '导入数据已填充', '请检查配置并点击"进入编排战术板"！', 3000);
    },

    // ✨【新增】：恢复成套数据到当前草稿纸
    restoreRoutineData: function(routine) {
        // 1. 恢复核心轨迹数据（深拷贝）
        canvasManager.tracks = JSON.parse(JSON.stringify(routine.tracks));
        
        // 2. 恢复全局状态与名称 (如果是草稿，去掉草稿后缀让用户接着编)
        const cleanName = routine.name.replace(" (草稿)", "").replace(" (🎶 音乐现场版)", "");
        window.currentRoutineData.name = cleanName;
        window.currentRoutineData.brand = routine.brand || "gymnova";
        
        // ✨【新增】：恢复体操运动员信息
        window.currentRoutineData.gymnastMode = routine.gymnastMode || "none";
        window.currentRoutineData.gymnastName = routine.gymnastName || "纯排位测试 (无E分)";
        
        // ✨【新增】：恢复全局音乐记忆
        window.currentRoutineData.musicId = routine.musicId || null;
        window.currentRoutineData.musicUrl = routine.musicUrl || null;
        
        // ✨【新增】：恢复音乐标记
        if (routine.musicMarkers) {
            window.currentRoutineData.musicMarkers = JSON.parse(JSON.stringify(routine.musicMarkers));
            window.musicMarkers = JSON.parse(JSON.stringify(routine.musicMarkers));
        }
        
        // ✨【新增】：恢复音乐编排数据
        if (routine.placedActions) {
            window.currentRoutineData.placedActions = JSON.parse(JSON.stringify(routine.placedActions));
        }
        
        // ✨【新增】：恢复得分报告
        if (routine.scoreReport) {
            window.currentScoreReport = JSON.parse(JSON.stringify(routine.scoreReport));
        }
        if (routine.eScoreReport) {
            window.currentEScoreReport = JSON.parse(JSON.stringify(routine.eScoreReport));
        }
        
        // ✨【新增】：恢复播放模式
        if (routine.playbackMode) {
            window.currentPlaybackMode = routine.playbackMode;
        }
        
        // 3. 恢复场地 UI 和颜色
        if (typeof selectBrand === 'function') {
            selectBrand(routine.brand || 'gymnova');
        }
        
        // 4. 同步顶部控制台的名字
        const nameInput = document.getElementById('routineNameInput');
        if (nameInput) nameInput.value = window.currentRoutineData.name;
        const displayRoutineName = document.getElementById('displayRoutineName');
        if (displayRoutineName) displayRoutineName.innerText = window.currentRoutineData.name;
        
        // 5. 恢复体操运动员显示
        this.updateGymnastDisplay();
        
        // 6. 暴力唤醒重绘与侧边栏算分
        canvasManager.redraw();
        this.updateUIRoutineList();
        
        // 6. 状态宣发：宣告画板已激活（必须在跳转前设置，防止系统再次呼出初始化弹窗）
        isRoutineInitialized = true; 
        
        // ✨【新增核心点】：全网搜捕并强制关闭“选选手/新建成套”的拦截弹窗或页面
        // 尝试常见的初始化弹窗 ID，如果你的 ID 比较特殊，可以自己加在这个数组里
        const initModals = ['routineInitModal', 'initModal', 'setupModal', 'welcomeModal', 'setupOverlay'];
        initModals.forEach(modalId => {
            const m = document.getElementById(modalId);
            if (m && !m.classList.contains('hidden')) {
                m.classList.add('hidden');
                m.style.display = 'none'; // 双重保险
            }
        });
        // 如果你的代码里原本就有专门关闭弹窗的全局函数，也顺手调一下
        if (typeof closeInitModal === 'function') closeInitModal();

        // 🟢 强制跳转画板页面核心逻辑
        try {
            // 第一套方案：模拟用户真实点击导航栏的“工作台”按钮（这是最完美、最不会破坏原有逻辑的方法）
            const navBtn = document.querySelector('[onclick*="switchTab(\\\'builder\\\')"]');
            if (navBtn) {
                navBtn.click();
            } else if (typeof window.switchTab === 'function') {
                window.switchTab('builder');
            }

            // 第二套方案：万能 DOM 强制干预 (防止函数未生效)
            const allViews = ['viewLeaderboard', 'viewProfile', 'viewStart'];
            allViews.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.classList.add('hidden');
            });
            
            const viewBuilder = document.getElementById('viewBuilder');
            if (viewBuilder) {
                viewBuilder.classList.remove('hidden');
                viewBuilder.style.opacity = '1';
            }
            window.currentTab = 'builder';

            // 页面平滑滚动回顶部
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (e) {
            console.error("页面自动跳转路由异常:", e);
        }

        // 合并为一次弹窗提示
        setTimeout(() => ToastManager.show('success', '数据加载完毕', `进度已成功还原到画板！\n您可以直接为她进行回放与执裁！`, 4000), 100);
        
        // 开启观赏模式 (锁定编辑)
        if (window.AppController && typeof window.AppController.applyViewingMode === 'function') {
            AppController.applyViewingMode(true);
        }
    },

    // ✨【新增】：纯粹亮相模式 (跳过 E 分打分，直接只读回放 2D/3D 动画)
    showcaseRoutine: function(id) {
        // 静默加载数据到画板，不弹覆盖警告
        this.loadRoutine(id, true);
        
        ToastManager.show('info', '正在准备亮相', '正在为您重构成套轨迹...', 1500);
        
        // 延迟 600ms 等待 UI 切换完毕后，自动触发【只看成套不打分】模式
        setTimeout(() => {
            if (typeof window.startPlayback === 'function') {
                window.startPlayback('no_e');
            }
        }, 600);
    },

    deleteHistory: function(id) {
        if(confirm("确定要删除这条成套记录吗？")) {
            let history = JSON.parse(localStorage.getItem('gymChoreoHistory') || '[]');
            history = history.filter(r => r.id !== id);
            localStorage.setItem('gymChoreoHistory', JSON.stringify(history));
            this.renderHistory();
        }
    },

    exportToImage: function() {
        const targetDOM = document.getElementById('viewBuilder');
        if (!targetDOM || typeof html2canvas === 'undefined') return;

        const watermark = document.createElement('div');
        watermark.innerHTML = `<h2 class="text-2xl font-black">GymChoreo 智能编排</h2><p class="text-lg">成套：${window.currentRoutineData?.name} | D分: ${window.currentScoreReport.totalD.toFixed(2)}</p>`;
        watermark.className = "absolute bottom-10 right-10 text-gray-400 opacity-50 pointer-events-none";
        targetDOM.appendChild(watermark);

        html2canvas(targetDOM, { backgroundColor: '#f9fafb', scale: 2 }).then(canvas => {
            let link = document.createElement('a');
            link.download = `GymChoreo_${window.currentRoutineData?.name || '编排'}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
            targetDOM.removeChild(watermark);
        });
    },

    generateDetailImage: function() {
        if (typeof html2canvas === 'undefined') {
            ToastManager.show('error', '导出失败', '缺少 html2canvas 渲染库！');
            return;
        }
        ToastManager.show('info', '正在生成', '正在拼装明细长图，请稍候...', 2000);

        const dReport = window.currentScoreReport;
        const totalTotal = dReport ? dReport.totalD + (window.currentEScoreReport ? window.currentEScoreReport.finalEScore : 0) : 0;

        // 创建隐藏的 DOM 容器
        const receiptContainer = document.createElement('div');
        receiptContainer.className = "bg-slate-50 p-8 text-slate-800";
        receiptContainer.style.width = '600px'; 
        receiptContainer.style.position = 'absolute';
        receiptContainer.style.left = '-9999px';
        
        let detailsHtml = '';
        
        canvasManager.tracks.forEach((track, tIdx) => {
            if (!track.skills || track.skills.length === 0) return;
            let skillNames = track.skills.map(s => `<span class="font-bold text-indigo-700">${s.nameZh[0]}</span> <span class="text-[10px] text-slate-400">${s.difficulty}</span>`).join(' + ');
            
            let deductionHtml = '';
            if (track.manualDeductions && track.manualDeductions.length > 0) {
                deductionHtml = `<ul class="mt-2 space-y-1">`;
                track.manualDeductions.forEach(d => {
                    let color = d.isDScore ? 'text-blue-600 bg-blue-50' : (d.isArtistry ? 'text-fuchsia-600 bg-fuchsia-50' : 'text-rose-600 bg-rose-50');
                    deductionHtml += `<li class="text-xs flex items-center gap-2"><span class="px-1.5 py-0.5 rounded ${color} font-black">-${d.deduction.toFixed(1)}</span> <span class="text-slate-600">${d.faultName}</span></li>`;
                });
                deductionHtml += `</ul>`;
            } else {
                deductionHtml = `<div class="text-xs text-emerald-500 mt-2 font-bold">✅ 完美执行 (无扣分)</div>`;
            }

            detailsHtml += `
                <div class="mb-4 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                    <div class="text-[10px] text-slate-400 font-black mb-1">路线 ${tIdx + 1}</div>
                    <div class="text-sm border-b border-slate-100 pb-2 mb-2">${skillNames}</div>
                    ${deductionHtml}
                </div>
            `;
        });

        // 注入全局艺术分扣除（如果存在的话）
        let globalArts = window.currentEScoreReport?.details?.filter(d => d.includes('[全局')) || [];
        if (globalArts.length > 0) {
            detailsHtml += `
                <div class="mb-4 bg-fuchsia-50 border border-fuchsia-200 rounded-xl p-4 shadow-sm">
                    <div class="text-xs text-fuchsia-600 font-black mb-2 border-b border-fuchsia-200 pb-2">🎭 全局编排与艺术扣分</div>
                    <ul class="space-y-1">
                        ${globalArts.map(art => `<li class="text-xs text-slate-700">${art}</li>`).join('')}
                    </ul>
                </div>
            `;
        }

        receiptContainer.innerHTML = `
            <div class="border-b-4 border-indigo-600 pb-4 mb-6 flex justify-between items-end">
                <div>
                    <h1 class="text-2xl font-black text-slate-900 leading-none">GymChoreo 执裁明细</h1>
                    <div class="text-sm text-slate-500 mt-2">${window.currentRoutineData?.name || '未命名成套'} | 选手: ${window.currentRoutineData?.gymnastName || '佚名'}</div>
                </div>
                <div class="text-right">
                    <div class="text-[10px] font-black text-slate-400">总分 TOTAL</div>
                    <div class="text-3xl font-black text-indigo-600 leading-none">${totalTotal.toFixed(3)}</div>
                </div>
            </div>
            ${detailsHtml}
            <div class="text-center text-xs text-slate-400 mt-6 pt-4 border-t border-slate-200">
                Generated by GymChoreo | ${new Date().toLocaleString()}
            </div>
        `;

        document.body.appendChild(receiptContainer);

        html2canvas(receiptContainer, { scale: 2, backgroundColor: '#f8fafc' }).then(canvas => {
            let link = document.createElement('a');
            link.download = `执裁明细_${window.currentRoutineData?.name || '成套'}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
            document.body.removeChild(receiptContainer);
        });
    },

    processOOB: function(choice) {
        const track = window.pendingOOBTrack;
        document.getElementById('oobModal').classList.add('hidden');
        if (!track) return;

        if (choice === 'single') track.nd = -0.1;
        else if (choice === 'double') track.nd = -0.3;
        else if (choice === 'snap') {
            const marginX = canvasManager.canvas.width / 14 + 1;
            const marginY = canvasManager.canvas.height / 14 + 1;
            track.points = track.points.map(p => ({
                x: Math.max(marginX, Math.min(canvasManager.canvas.width - marginX, p.x)),
                y: Math.max(marginY, Math.min(canvasManager.canvas.height - marginY, p.y))
            }));
            track.nd = 0;
        }

        // 【关键修复】查重保护机制！
        // 如果这本身就是一条旧线（通过拖拽触发），不要重复 push。只在画新线出界时 push。
        if (!canvasManager.tracks.includes(track)) {
            canvasManager.tracks.push(track);
        }

        canvasManager.redraw();
        window.pendingOOBTrack = null;
        
        // 智能分流：如果是新画的线出界，弹窗配动作；如果是旧线拖拽出界，只静默刷新侧边栏算分即可
        if (!track.skills || track.skills.length === 0) {
            this.openModal(track);
        } else {
            this.updateUIRoutineList();
        }
    }
};

window.addEventListener('DOMContentLoaded', () => { AppController.init(); });
window.openSkillModal = function(track) { AppController.openModal(track); };
window.closeModal = function() { AppController.closeModal(); };
window.confirmModalSelection = function() { AppController.confirmModal(); };
window.updateUIRoutineList = function() { AppController.updateUIRoutineList(); };
// ==========================================
// 替换 app.js 中的 saveRoutine，并新增 startPlayback
// ==========================================

window.saveRoutine = function() { 
    // 不再直接触发动画，而是先弹窗询问裁判模式
    const modal = document.getElementById('playbackOptionsModal');
    if (modal) modal.classList.remove('hidden');
};

window.startPlayback = function(mode) {
    console.log("%c[startPlayback 调试] 🚀 startPlayback 被调用，mode:", "color: white; background: #f59e0b; font-size: 12px; padding: 4px;", mode);
    
    document.getElementById('playbackOptionsModal').classList.add('hidden');
    // ✨【Bug 修复】：重新播放时，强制将可能未收回的 E裁判 面板踢回底部！
    const deck = document.getElementById('juryCardDeck');
    if (deck) {
        deck.classList.remove('translate-y-0');
        deck.classList.add('translate-y-full');
    }
    window.currentPlaybackMode = mode;
    
    // ✨ 关键修复：无论哪种模式，都需要先确保 currentScoreReport 被设置
    console.log("[startPlayback 调试] 调用 AppController.updateUIRoutineList()...");
    AppController.updateUIRoutineList(); // 确保 D 分最新
    console.log("[startPlayback 调试] updateUIRoutineList 执行后，window.currentScoreReport:", window.currentScoreReport);
    
    if (mode === 'skip_to_d') {
        // 【秒结算模式】：跳过所有动画，直接弹成绩单！
        console.log("[startPlayback 调试] 进入 skip_to_d 模式");
        const gymnastMode = window.currentRoutineData.gymnastMode || 'none';
        const actualDScore = window.currentScoreReport ? window.currentScoreReport.totalD : 0;
        
        // 即便是跳过，也跑一遍引擎算出结果
        window.currentEScoreReport = ExecutionEngine.calculateEScore(gymnastMode, canvasManager.tracks, actualDScore);
        
        console.log("[startPlayback 调试] 调用 showFinalScoreBoard()...");
        // 直接弹窗！
        AppController.showFinalScoreBoard(); 
    } else {
        // 启动 Canvas 动画系统，老老实实看表演/打分
        console.log("[startPlayback 调试] 调用 triggerFinishAnimation()...");
        AppController.triggerFinishAnimation(); 
    }
};

window.startNewRoutine = function() {
    document.getElementById('saveConfirmModal').classList.add('hidden');
    if (typeof window.resetBuilderFlow === 'function') window.resetBuilderFlow();
    AppController.applyViewingMode(true);
};
window.renderHistory = function() { AppController.renderHistory(); };
window.handleOOBChoice = function(choice) { AppController.processOOB(choice); };
window.AppController = AppController;

// ==========================================
// 追加到 app.js 最底部，或独立成文件
// ==========================================
window.SidebarInteraction = {
    
    // 1. 一键删除整条路线
    deleteTrack: function(trackIndex) {
        if (!confirm('🗑️ 确定要删除这条动作路线吗？')) return;
        
        if (typeof canvasManager !== 'undefined' && canvasManager.tracks) {
            // 从底层数组中彻底抹除这条线
            canvasManager.tracks.splice(trackIndex, 1);
            
            // 核心联动：重新绘制画布，刷新分数和编排列表！
            canvasManager.redraw();
            if (typeof AppController !== 'undefined' && AppController.updateUIRoutineList) {
                AppController.updateUIRoutineList();
            }
        }
    },

    // 2. 抓起路线卡片 (开始拖拽)
    dragStartTrack: function(event, trackIndex) {
        event.dataTransfer.setData('text/plain', trackIndex.toString());
        event.dataTransfer.effectAllowed = 'move';
        
        setTimeout(() => {
            const card = event.target.closest('.track-card');
            if(card) card.classList.add('opacity-40', 'scale-[0.98]', 'shadow-lg');
        }, 0);
    },

    // 3. 拖拽经过其他卡片上方
    dragOverTrack: function(event) {
        event.preventDefault(); 
        event.dataTransfer.dropEffect = 'move';
    },

    // 4. 拖拽松手但未成功
    dragEndTrack: function(event) {
        const card = event.target.closest('.track-card');
        if(card) card.classList.remove('opacity-40', 'scale-[0.98]', 'shadow-lg');
    },

    // 5. 成功放下卡片：执行数组互换
    dropTrack: function(event, targetIndex) {
        event.preventDefault();
        
        const card = event.target.closest('.track-card');
        if(card) card.classList.remove('opacity-40', 'scale-[0.98]', 'shadow-lg');

        const sourceIndex = parseInt(event.dataTransfer.getData('text/plain'), 10);
        if (isNaN(sourceIndex) || sourceIndex === targetIndex) return;

        if (typeof canvasManager !== 'undefined' && canvasManager.tracks) {
            const tracks = canvasManager.tracks;
            
            // 执行数组内部元素的剪切与插入（重排路线顺序）
            const [movedTrack] = tracks.splice(sourceIndex, 1);
            tracks.splice(targetIndex, 0, movedTrack);

            console.log(`🔄 战术路线重排成功：从位置 ${sourceIndex} 移动到 ${targetIndex}`);
            
            // 【补全联动】顺序变了，画布上的连线顺序和右侧分值必须立刻重算
            canvasManager.redraw();
            if (typeof AppController !== 'undefined' && AppController.updateUIRoutineList) {
                AppController.updateUIRoutineList();
            }
        }
    }
};
// ==========================================
// 附加模块：E裁判手动打分系统控制台
// ==========================================

// ==========================================
// 史诗级：E裁判拖拽判罚系统引擎 (ManualJurySystem)
// ==========================================

// E裁判手动打分系统已拆分到 jury_system.js


// ==========================================
// 🚪 场景切换：工作台 Logo 渐变返回首页
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const workbenchLogo = document.getElementById('workbench-logo');
    const heroSection = document.getElementById('heroSection');
    const mainNav = document.getElementById('mainNav');
    const mainBody = document.getElementById('mainBody');

    if (workbenchLogo && heroSection && mainNav) {
        workbenchLogo.addEventListener('click', () => {
            // 安全检查：确保 window.currentTab 有效
            const currentTab = window.currentTab || 'dictionary';
            const tabId = currentTab.charAt(0).toUpperCase() + currentTab.slice(1);
            
            // 获取当前正在显示的工作台界面
            const currentView = document.getElementById('view' + tabId);
            
            // 1. 导航栏和当前工作台开始淡出 (0.5秒)
            mainNav.style.opacity = '0';
            if (currentView) {
                currentView.style.transition = 'opacity 0.5s ease-out';
                currentView.style.opacity = '0';
            }

            // 2. 彻底消失后，切换显示层级
            setTimeout(() => {
                mainNav.classList.add('hidden');
                mainNav.style.opacity = '1'; // 恢复备用
                if (currentView) {
                    currentView.classList.add('hidden');
                    currentView.style.opacity = '1'; // 恢复备用
                }

                // 唤醒首页
                mainBody.classList.add('overflow-hidden');
                heroSection.classList.remove('hidden');
                
                // 3. 极短延迟后，首页优雅淡入 (0.8秒)
                setTimeout(() => {
                    heroSection.style.opacity = '1';
                }, 50);

            }, 500); 
        });
    }
});

// ==========================================
// 🎵 音乐同步引擎：曲库资产配置与综合渲染
// ==========================================

// 1. 系统内置曲库资产 (严格匹配你提供的音乐文件，全部归为体操)
const SYSTEM_MUSIC_PRESETS = [
    { id: 'sys_Ou_2019', name: '欧钰珊 2019', genre: 'gymnastics', url: './music/gym/2019_Ou.mp3' },
    { id: 'sys_Angelina_Melnikova_2021', name: '梅尔尼科娃 2021', genre: 'gymnastics', url: './music/gym/2021_Angelina_Melnikova.mp3' },
    { id: 'sys_Lu_2021', name: '芦玉菲 2021', genre: 'gymnastics', url: './music/gym/2021_Lu.mp3' },
    { id: 'sys_Rebeca_Andrade_2021', name: '安德拉德 2021', genre: 'gymnastics', url: './music/gym/2021_Rebeca_Andrade.mp3' },
    { id: 'sys_Simone_Biles_2021', name: '拜尔斯 2021', genre: 'gymnastics', url: './music/gym/2021_Simone_Biles.mp3' },
    { id: 'sys_Tang_2021', name: '唐茜靖 2021', genre: 'gymnastics', url: './music/gym/2021_Tang.mp3' },
    { id: 'sys_Alice_D_Amato_2023', name: '达马托 2023', genre: 'gymnastics', url: './music/gym/2023_Alice_D_Amato.mp3' },
    { id: 'sys_Alice_Kinsella_2023', name: '金塞拉 2023', genre: 'gymnastics', url: './music/gym/2023_Alice_Kinsella.mp3' },
    { id: 'sys_Ou_2023', name: '欧钰珊 2023', genre: 'gymnastics', url: './music/gym/2023_Ou.mp3' },
    { id: 'sys_Qiu_2023', name: '邱祺缘 2023', genre: 'gymnastics', url: './music/gym/2023_Qiu.mp3' },
    { id: 'sys_Rebeca_Andrade_2023', name: '安德拉德 2023', genre: 'gymnastics', url: './music/gym/2023_Rebeca_Andrade.mp3' },
    { id: 'sys_Zhou_2023', name: '周雅琴 2023', genre: 'gymnastics', url: './music/gym/2023_Zhou.mp3' },
    { id: 'sys_Zhou_2024', name: '周雅琴 2024', genre: 'gymnastics', url: './music/gym/2024_Zhou.mp3' },
    { id: 'sys_Lia_Monica_Fontaine_2025', name: 'Lia Monica Fontaine 2025', genre: 'gymnastics', url: './music/gym/2025_Lia_Monica_Fontaine.mp3' },
    { id: 'sys_Sabrina_Maneca_Voinea_2025', name: 'Sabrina Maneca Voinea 2025', genre: 'gymnastics', url: './music/gym/2025_Sabrina_Maneca_Voinea.mp3' }
];

// 音乐模式流转控制器已拆分到 music_flow_controller.js

// (音乐模式流转控制器已拆分到 music_flow_controller.js)

// ==========================================
// 🎵 音乐同步引擎 (Phase 2: WaveSurfer 与打点系统)
// ==========================================

const AudioEngine = {
    wavesurfer: null,
    wsRegions: null,
    currentTrackIndex: 0, // 记录当前打点到第几条路线了
    isReady: false,

    init: function() {
        // 如果已经有一个实例，先销毁，防止重复叠加
        if (this.wavesurfer) {
            this.wavesurfer.destroy();
        }

        this.wavesurfer = WaveSurfer.create({
            container: '#waveformContainer',
            waveColor: '#cbd5e1',     
            progressColor: '#6366f1', 
            cursorColor: '#4f46e5',
            barWidth: 2,
            barGap: 2,
            barRadius: 2,
            height: 70, // 稍微调矮一点，给下方的刻度尺留出空间
            minPxPerSec: 60, // 🌟 【核心魔法】：每秒占用 60 像素，自动撑出横向滚动条！
            normalize: true,          
        });

        this.wsRegions = this.wavesurfer.registerPlugin(WaveSurfer.Regions.create());
        
        // 🌟 【新增】：注册时间轴插件
        this.wavesurfer.registerPlugin(WaveSurfer.Timeline.create({
            height: 20,
            timeInterval: 10,       // 每 10 秒一个大刻度
            primaryLabelInterval: 10,
            style: { fontSize: '10px', color: '#64748b' }
        }));

        this.wavesurfer.on('ready', () => {
            this.isReady = true;
            ToastManager.show('success', '音乐加载完成 🎵', '波形图就绪！\n【Space空格】播放/暂停，【M键】标记动作起止。', 4500);
            
            this.currentTrackIndex = 0;
            this.wsRegions.clearRegions();
            
            // 如果这个成套以前已经打过点了，把它们渲染出来
            this.renderExistingRegions();
        });
        this.wavesurfer.on('finish', () => {
            ToastManager.show('success', '成套演示结束', '正在调用您的 E 分智能计算器进行结算...', 2000);
            
            // 延迟 1 秒让 3D 小人摆好结束 Pose，然后弹你的算分板！
            setTimeout(() => {
                // ✨【修复 #2】：双重确保解除只读锁
                if (typeof AppController !== 'undefined') {
                    // 强制解除观赏模式的死锁，允许 E 分计算器读取数据
                    AppController.isViewingMode = false;
                    window.isViewingMode = false;
                    AppController.applyViewingMode(false); 
                    
                    // 呼叫你的核心结算面板 (如果是 auto_e，这里会自动走你的扣分逻辑)
                    if (typeof AppController.showFinalScoreBoard === 'function') {
                        AppController.showFinalScoreBoard();
                    } else if (typeof showFinalScoreBoard === 'function') {
                        showFinalScoreBoard();
                    }
                }
            }, 1000);
        });
        // 【Phase 3 追加】：监听音乐实时播放进度
        this.wavesurfer.on('audioprocess', (currentTime) => {
            // 只要是在音乐模式下，Canvas 完全被音频时间轴接管
            if (window.AppController && window.AppController.isViewingMode) {
                if (typeof canvasManager !== 'undefined' && canvasManager.redrawBasedOnTime) {
                    canvasManager.redrawBasedOnTime(currentTime);
                }
            }
        });

        // 【Phase 3 追加】：监听用户鼠标随意拖拽进度条 (Seek) 的瞬间
        this.wavesurfer.on('seek', (progress) => {
            const currentTime = progress * this.wavesurfer.getDuration();
            if (window.AppController && window.AppController.isViewingMode) {
                 if (typeof canvasManager !== 'undefined' && canvasManager.redrawBasedOnTime) {
                    // 时间轴跳跃，画面瞬间重置对齐！
                    canvasManager.redrawBasedOnTime(currentTime);
                }
            }
        });
        

        // 监听：如果用户用鼠标拖拽微调了波形图上的色块，实时更新底层 Track 数据
        this.wsRegions.on('region-updated', (region) => {
            const track = canvasManager.tracks.find(t => t.id === region.id);
            if (track && track.audioSync) {
                track.audioSync.startTime = region.start;
                track.audioSync.endTime = region.end;
            }
        });

        this.bindKeyboardControls();
    },

    loadAudio: function(source, isUrl) {
        const container = document.getElementById('waveformContainer');
        container.innerHTML = ''; 
        
        this.init();
        // 如果是URL直接加载，如果是Blob则需要转换成数据流链接
        const audioUrl = isUrl ? source : URL.createObjectURL(source);
        this.wavesurfer.load(audioUrl);
    },

    bindKeyboardControls: function() {
        if (this._keydownBound) return; // 防止重复绑定
        
        document.addEventListener('keydown', (e) => {
            // 如果用户正在输入框里打字（如重命名成套），不要触发快捷键
            if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
            
            // 只有当音乐模式开关打开，且波形图加载完毕时才响应
            const toggle = document.getElementById('musicModeToggle');
            if (!toggle || !toggle.checked || !this.isReady) return;

            if (e.code === 'Space') {
                e.preventDefault();
                this.wavesurfer.playPause();
            } else if (e.code === 'KeyM') {
                e.preventDefault();
                // 调用音乐编排控制器的打点函数
                if (typeof window.handleMusicMarking === 'function') {
                    window.handleMusicMarking();
                } else {
                    // 降级到原有的 handleMarking
                    this.handleMarking();
                }
            }
        });
        this._keydownBound = true;
    },

    // 核心卡点逻辑 (打拍子)
    handleMarking: function() {
        // 过滤掉过渡路线，我们只给有实质动作的线卡点
        const validTracks = canvasManager.tracks.filter(t => t.type !== 'transit');
        
        if (this.currentTrackIndex >= validTracks.length) {
            ToastManager.show('info', '全部完成', '所有动作都已完成卡点！您可以播放检阅。');
            return;
        }

        const track = validTracks[this.currentTrackIndex];
        const currentTime = this.wavesurfer.getCurrentTime();

        if (!track.audioSync) {
            // ===================================
            // 第一次按下 M：记录起点
            // ===================================
            track.audioSync = { startTime: currentTime, endTime: null };
            
            // 在波形图上生成一个带颜色的占位色块
            this.wsRegions.addRegion({
                id: track.id,
                start: currentTime,
                end: currentTime + 0.3, // 暂时给一个微小的宽度
                color: track.color + '66', // 拼接 66 赋予颜色 40% 的透明度
                drag: false,   // 录制中禁止拖拽
                resize: false,
                content: `🔴 路线 ${this.currentTrackIndex + 1} (录制中)`
            });

            ToastManager.show('info', '起点已标记', `🔴 路线 ${this.currentTrackIndex + 1} 开始！动作该结束时再次按 M。`, 1500);

        } else if (track.audioSync.endTime === null) {
            // ===================================
            // 第二次按下 M：记录终点
            // ===================================
            
            // 容错机制：防止按太快，最小保证 0.2 秒的时间差
            let endT = currentTime;
            if (endT - track.audioSync.startTime < 0.2) {
                endT = track.audioSync.startTime + 0.2;
            }
            
            track.audioSync.endTime = endT;

            // 抓取刚刚那个占位色块，把它的终点定死，并放开拖拽权限
            const regions = this.wsRegions.getRegions();
            const currentRegion = regions.find(r => r.id === track.id);
            if (currentRegion) {
                currentRegion.setOptions({
                    end: endT,
                    drag: true,   // 允许用户事后用鼠标微调拖拽
                    resize: true, // 允许改变长度
                    content: `✔️ 路线 ${this.currentTrackIndex + 1}`
                });
            }

            // 【防手忙脚乱机制】：动作打点结束，立刻自动暂停音乐！
            this.wavesurfer.pause();
            
            ToastManager.show('success', '标记锁定', `✔️ 路线 ${this.currentTrackIndex + 1} 录制完毕！\n音乐已自动暂停。请看一眼下一串是什么，准备好后按【空格】继续。`, 3500);

            // 推进到下一串动作
            this.currentTrackIndex++;
        }
    },

    // 重新渲染已经打过点的数据（比如从历史记录里提取）
    renderExistingRegions: function() {
        const validTracks = canvasManager.tracks.filter(t => t.type !== 'transit');
        let maxIndex = 0;
        
        validTracks.forEach((track, idx) => {
            if (track.audioSync && track.audioSync.endTime !== null) {
                this.wsRegions.addRegion({
                    id: track.id,
                    start: track.audioSync.startTime,
                    end: track.audioSync.endTime,
                    color: track.color + '66', 
                    drag: true,
                    resize: true,
                    content: `✔️ 路线 ${idx + 1}`
                });
                maxIndex = idx + 1;
            }
        });
        // 接续进度
        this.currentTrackIndex = maxIndex;
    }
};




document.addEventListener('DOMContentLoaded', () => {
    // 延迟 500ms 启动，确保画板和 AppController 已经挂载完毕
    setTimeout(() => {
        if (typeof WorkspaceManager !== 'undefined') {
            WorkspaceManager.init();
        }
    }, 500);
});

// ==========================================
// 🍿 独立 3D 视觉引擎 (真实骨骼动画最终版)
// ==========================================
window.ThreeEngine = {
    scene: null, camera: null, renderer: null,
    model: null, mixer: null, clock: null,
    animationFrameId: null, isActive: false,
    actions: {}, 
    currentActionName: null,
    
    // 锁：确保一个高难度动作做完前，不被常规移动打断
    isHandlingAnimation: false, 
    
    // 📖 【核心翻译大脑】：将 2D 画板里的中文动作，映射为你 eeeee.glb 里的真实英文动作名！
    ActionDictionary: {
        // 因为你目前只放了 ChickenDance，我们就把跳步和体操舞蹈都映射给它来测试！
        "交换腿跳": "ChickenDance",
        "屈腿跳": "ChickenDance",
        "开场亮相": "ChickenDance"
    },

    initAndEnter3D: function() {
        // ✅ 3D功能暂未开放，显示提示
        if (typeof ToastManager !== 'undefined') {
            ToastManager.show('warning', '功能暂未开放', '🎬 3D 舞台功能正在开发中，敬请期待！', 3000);
        }
        return;
        
        this.isActive = true;
        const container = document.getElementById('canvas3DContainer');
        const canvas2D = document.getElementById('floorCanvas');
        const loaderUI = document.getElementById('modelLoaderUI');
        
        container.classList.remove('hidden');
        if (canvas2D) canvas2D.style.opacity = '0.7'; // 保持 2D 画板高亮清晰
        if (loaderUI) loaderUI.classList.remove('hidden', 'opacity-0');

        this.clock = new THREE.Clock();
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('#0f172a'); 

        // 调整摄像机视角，俯瞰全场
        this.camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
        this.camera.position.set(0, 10, 10); 
        this.camera.lookAt(0, 0, 0);

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        const existingCanvas = container.querySelector('canvas');
        if (existingCanvas) container.removeChild(existingCanvas);
        container.appendChild(this.renderer.domElement);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
        dirLight.position.set(5, 10, 5);
        this.scene.add(ambientLight, dirLight);

        // 场地底板
        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(12, 12),
            new THREE.MeshStandardMaterial({ color: '#1e293b' })
        );
        floor.rotation.x = -Math.PI / 2;
        this.scene.add(floor);

        // ==========================================
        // 🌟 加载你的测试模型
        // ==========================================
        const loader = new THREE.GLTFLoader();
        // ⚠️ 这里写死了你刚才说的 eeeee.glb
        const myModelUrl = './assets/eeeee.glb'; 

        loader.load(myModelUrl, (gltf) => {
            if (!this.isActive) return; 
            
            this.model = gltf.scene;
            this.model.scale.set(1.0, 1.0, 1.0); 
            this.scene.add(this.model);

            this.mixer = new THREE.AnimationMixer(this.model);
            this.actions = {};

            console.log("📥 模型动作列表：");
            gltf.animations.forEach((clip) => {
                console.log(" - " + clip.name);
                this.actions[clip.name] = this.mixer.clipAction(clip);
            });

            // ⚠️ 模型刚进场时，如果没有 Idle 动作，咱们就让她静止，或者强制播放第一个动作
            const defaultAnim = this.actions['Idle'] || this.actions[gltf.animations[0].name];
            if (defaultAnim) {
                defaultAnim.play();
                this.currentActionName = defaultAnim.getClip().name;
            }

            if (loaderUI) loaderUI.classList.add('opacity-0');
            ToastManager.show('success', '3D 模型就绪', '体操运动员已入场！', 2000);
        });

        this.animate();
    },

    // 🌟 核心动作混合器：实现丝滑的 0.2 秒动画过渡
    playAnimation: function(targetName, fadeDuration = 0.2) {
        if (!this.mixer || !this.actions[targetName]) {
            console.warn(`⚠️ 找不到动作：${targetName}`);
            return;
        }

        const nextAction = this.actions[targetName];
        const currentAction = this.actions[this.currentActionName];

        if (currentAction && currentAction !== nextAction) {
            currentAction.fadeOut(fadeDuration);
        }

        // 每次播放都从头开始播放 (reset)
        nextAction.reset().setEffectiveTimeScale(1).fadeIn(fadeDuration).play();
        
        // ⚠️ 特殊处理：如果是摔倒，播放一遍就停在地上，不要无限循环摔倒！
        if (targetName === 'FallingToLanding') {
            nextAction.setLoop(THREE.LoopOnce, 1);
            nextAction.clampWhenFinished = true; // 播完停在最后一帧（躺在地上）
        }

        this.currentActionName = targetName;
    },

    // 🌐 接收 2D 坐标与动作指令
    updateGymnastPosition: function(x2D, y2D, track, progress) {
        if (!this.model) return;
        
        // 1. 如果正在跳舞或摔倒，锁定位移，让她在原地做完动作！
        if (this.isHandlingAnimation) return;

        // 2. 坐标换算 (800 像素 -> 12 米)
        const scale = 12 / 800;
        const x3D = (x2D - 400) * scale;
        const z3D = (y2D - 400) * scale;

        // 3. 计算朝向，让她面向前进方向
        const dx = x3D - this.model.position.x;
        const dz = z3D - this.model.position.z;
        if (Math.abs(dx) > 0.001 || Math.abs(dz) > 0.001) {
            this.model.rotation.y = Math.atan2(dx, dz);
        }
        this.model.position.set(x3D, 0, z3D);

        if (!track) return;

        // A. 率先嗅探裁判扣分：走到路线 92% 时，如果被裁判打了跌倒，立刻执行！
        if (progress > 0.92) {
            let hasFall = false;
            if (track.manualDeductions && track.manualDeductions.length > 0) {
                hasFall = track.manualDeductions.some(d => d.deduction >= 0.8 || d.faultName?.includes('跌倒'));
            }
            if (!hasFall && window.currentEScoreReport && window.currentEScoreReport.fallTrackIds) {
                hasFall = window.currentEScoreReport.fallTrackIds.includes(track.id);
            }

            if (hasFall) {
                this.executePenalty3D('fall');
                return;
            }
        }

        // B. 嗅探编排动作库：走到路线 50% 时，触发动作字典！
        if (progress > 0.45 && progress < 0.70 && track.skills && track.skills.length > 0) {
            const skillName = track.skills[0].nameZh ? track.skills[0].nameZh[0] : track.skills[0]; 
            
            for (let key in this.ActionDictionary) {
                if (skillName.includes(key)) {
                    this.executeSkill3D(this.ActionDictionary[key], skillName);
                    break;
                }
            }
        }
    },

    // 🤸‍♂️ 彻底抛弃物理形变，呼叫真实的 .glb 骨骼动作！
    executeSkill3D: function(actionType, originalName) {
        this.isHandlingAnimation = true;
        ToastManager.show('coin', `⚡ 触发技术动作`, `正在执行：[${originalName}] -> 映射动画：${actionType}`, 1500);

        // 呼叫你的 ChickenDance
        this.playAnimation(actionType, 0.2);

        // 获取动作实际时长（秒），动态计算等待时间
        const action = this.actions[actionType];
        const duration = action ? action.getClip().duration : 3; // 默认3秒
        const waitTime = (duration + 0.5) * 1000; // 动作时长 + 0.5秒缓冲

        setTimeout(() => {
            this.isHandlingAnimation = false;
            // 如果你有跑步动作就切 Run，没有就切你列表里的第一个动作防报错
            this.playAnimation('Idle', 0.4); 
        }, waitTime);
    },

    // ❌ 执行真实骨骼的摔倒！
    executePenalty3D: function(type) {
        if (type === 'fall') {
            this.isHandlingAnimation = true;
            ToastManager.show('error', '⚠️ 严重失误', '触发 [跌倒] 联动！', 2000);

            // 呼叫你的 FallingToLanding
            this.playAnimation('FallingToLanding', 0.2);

            // 获取摔倒动画实际时长，动态计算等待时间
            const fallAction = this.actions['FallingToLanding'];
            const fallDuration = fallAction ? fallAction.getClip().duration : 2.5;
            const waitTime = (fallDuration + 0.5) * 1000;

            setTimeout(() => {
                this.isHandlingAnimation = false;
                this.playAnimation('Idle', 0.5); 
            }, waitTime);
        }
    },

    animate: function() {
        if (!this.isActive) return;
        this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
        if (this.mixer) this.mixer.update(this.clock.getDelta());
        if (this.renderer) this.renderer.render(this.scene, this.camera);
    },

    exit3DMode: function() {
        this.isActive = false;
        if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
        
        const container = document.getElementById('canvas3DContainer');
        const canvas2D = document.getElementById('floorCanvas');
        if (container) container.classList.add('hidden');
        if (canvas2D) canvas2D.style.opacity = '1';

        if (this.scene) {
            this.scene.traverse((object) => {
                if (object.isMesh) {
                    if (object.geometry) object.geometry.dispose();
                    if (object.material) {
                        if (Array.isArray(object.material)) object.material.forEach(m => m.dispose());
                        else object.material.dispose();
                    }
                }
            });
        }
        if (this.renderer && this.renderer.domElement) {
            this.renderer.dispose();
            if (this.renderer.domElement.parentNode) this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
        }
        
        this.scene = null; this.camera = null; this.renderer = null;
        this.model = null; this.mixer = null;
    }
};



// ==========================================
// 📦 夹带私货 - 暂存与上传逻辑引擎
// ==========================================
let stagedUploadFiles = [];

// 处理文件选择
window.handleMediaSelect = function(input) {
    if (!input.files || input.files.length === 0) return;
    
    for (let i = 0; i < input.files.length; i++) {
        let file = input.files[i];
        // 判断类型给图标
        let icon = '📄';
        if (file.type.startsWith('image/')) icon = '🖼️';
        else if (file.type.startsWith('video/')) icon = '🎬';
        else if (file.type.startsWith('audio/')) icon = '🎵';

        // 推入暂存区
        stagedUploadFiles.push({
            id: Date.now() + i + Math.random(), // 唯一ID
            file: file,
            icon: icon
        });
    }
    input.value = ''; // 清空 input，允许重复选同一个文件
    renderStagedFiles();
};

// 渲染暂存列表
function renderStagedFiles() {
    const container = document.getElementById('selectedFiles');
    const countLabel = document.getElementById('fileCount');
    if (!container || !countLabel) return;

    countLabel.innerText = stagedUploadFiles.length;

    if (stagedUploadFiles.length === 0) {
        container.innerHTML = '<p class="text-center text-slate-400 text-xs font-bold py-6">暂无待上传文件，快去上方添加吧！</p>';
        return;
    }

    container.innerHTML = stagedUploadFiles.map(item => `
        <div class="flex items-center justify-between bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm transition-all hover:border-emerald-300">
            <div class="flex items-center gap-3 overflow-hidden">
                <div class="text-xl bg-slate-50 w-8 h-8 rounded flex items-center justify-center shrink-0 border border-slate-100">${item.icon}</div>
                <div class="flex flex-col overflow-hidden">
                    <span class="text-xs font-bold text-slate-700 truncate">${item.file.name}</span>
                    <span class="text-[9px] text-slate-400 shrink-0 mt-0.5">大小: ${(item.file.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
            </div>
            <button onclick="removeStagedFile(${item.id})" class="text-slate-300 hover:text-red-500 hover:bg-red-50 w-6 h-6 flex items-center justify-center rounded transition-colors" title="移除此文件">✖</button>
        </div>
    `).join('');
}

// 移除单个暂存文件
window.removeStagedFile = function(id) {
    stagedUploadFiles = stagedUploadFiles.filter(f => f.id !== id);
    renderStagedFiles();
};

// 清空所有文件和状态
window.clearUploadFiles = function() {
    stagedUploadFiles = [];
    renderStagedFiles();
    
    // 重置进度条 UI
    const progContainer = document.getElementById('uploadProgressContainer');
    if(progContainer) progContainer.classList.add('hidden');
    document.getElementById('uploadProgressBar').style.width = '0%';
    document.getElementById('uploadProgressText').innerText = '0%';
    
    // 恢复上传按钮
    const btn = document.getElementById('confirmUploadBtn');
    if(btn) {
        btn.disabled = false;
        btn.innerHTML = '✅ 确认上传';
        btn.classList.remove('opacity-50', 'cursor-not-allowed');
    }
};

// 确认上传并播放进度条动画
window.confirmUpload = function() {
    if (stagedUploadFiles.length === 0) {
        if (typeof ToastManager !== 'undefined') ToastManager.show('warning', '提示', '您还没有选择任何私货哦！');
        return;
    }

    // 禁用上传按钮，防止连点
    const btn = document.getElementById('confirmUploadBtn');
    btn.disabled = true;
    btn.innerHTML = '⏳ 上传中...';
    btn.classList.add('opacity-50', 'cursor-not-allowed');

    // 显示进度条
    const progContainer = document.getElementById('uploadProgressContainer');
    const progBar = document.getElementById('uploadProgressBar');
    const progText = document.getElementById('uploadProgressText');
    progContainer.classList.remove('hidden');
    
    // 模拟平滑的上传进度
    let progress = 0;
    const interval = setInterval(() => {
        // 随机增加进度，假装在上传
        progress += Math.random() * 12 + 3; 
        
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            progBar.style.width = '100%';
            progText.innerText = '100%';
            
            // 延迟 0.5 秒给用户看 100% 满格的快感，然后关闭
            setTimeout(() => {
                if (typeof ToastManager !== 'undefined') {
                    ToastManager.show('success', '上传成功', '🎉 您的私货已成功发送到服务器！等待审核即可。');
                }
                document.getElementById('uploadModal').classList.add('hidden');
                clearUploadFiles(); // 传完自动清空
            }, 600);
        } else {
            progBar.style.width = progress + '%';
            progText.innerText = Math.floor(progress) + '%';
        }
    }, 200);
};

// 初始化教程系统
window.addEventListener('load', () => {
    if (typeof TutorialSystem !== 'undefined') {
        TutorialSystem.init();
    }
});

