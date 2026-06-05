/**
 * FlowStateManager - 功能状态管理系统 (增强版)
 * 
 * 【核心特性】
 * 1. 状态隔离：每个草稿纸拥有独立的状态
 * 2. 可逆性：支持流程内的多步撤销（撤销栈）
 * 3. 流程栈：记录完整的流程历史，支持回溯
 * 4. 自动感知：自动跟随当前草稿纸切换上下文
 */

(function() {
    'use strict';

    // ========================================
    // 1. 功能状态定义
    // ========================================
    const FlowStates = {
        IDLE: 'idle',                     // 空闲状态
        CANVAS_EDITING: 'canvas_editing', // 画板编辑模式
        JUDGING: 'judging',               // 裁判打分模式
        MUSIC_SELECTING: 'music_selecting', // 音乐选择模式
        SCORE_REVIEW: 'score_review',     // 成绩查看模式
        PLAYBACK_3D: '3d_playback',       // 3D回放模式
        DRAFT_SAVING: 'draft_saving',      // 草稿保存模式
        HISTORY_VIEWING: 'history_viewing' // 历史记录查看模式
    };

    // 流程顺序定义（用于强制流程约束）
    const FlowOrder = {
        [FlowStates.CANVAS_EDITING]: 1,
        [FlowStates.MUSIC_SELECTING]: 2,
        [FlowStates.JUDGING]: 3,
        [FlowStates.SCORE_REVIEW]: 4,
        [FlowStates.PLAYBACK_3D]: 5
    };

    // ========================================
    // 2. FlowStateManager 主体 (方案 B)
    // ========================================
    window.FlowStateManager = {
        // 【核心改进】按 workspace 隔离的状态存储
        _workspacesFlows: {},
        _currentWorkspaceId: null,
        
        _initWorkspaceIfNeeded: function(workspaceId) {
            if (!workspaceId) return;
            
            if (!this._workspacesFlows[workspaceId]) {
                this._workspacesFlows[workspaceId] = {
                    currentFlow: FlowStates.IDLE,
                    undoStack: [],
                    redoStack: [],
                    flowHistory: [],
                    snapshots: {},
                    metadata: {},
                    isDirty: false,
                    lastSaveTime: null
                };
            }
            
            return this._workspacesFlows[workspaceId];
        },

        _getCurrentWorkspaceState: function() {
            const wsId = this._currentWorkspaceId || 'default';
            return this._workspacesFlows[wsId] || this._initWorkspaceIfNeeded(wsId);
        },

        setCurrentWorkspace: function(workspaceId) {
            const oldWsId = this._currentWorkspaceId;
            this._currentWorkspaceId = workspaceId;
            this._initWorkspaceIfNeeded(workspaceId);
            
            console.log(`[FlowState] 工作区切换: ${oldWsId || '无'} -> ${workspaceId}`);
            this._updateFlowIndicator();
        },

        enterFlow: function(flowName, options = {}) {
            const state = this._getCurrentWorkspaceState();
            
            if (state.currentFlow && state.currentFlow !== FlowStates.IDLE && state.currentFlow !== flowName) {
                this.showInterception(flowName, {
                    type: 'enter',
                    currentFlow: state.currentFlow,
                    targetFlow: flowName
                });
                return false;
            }

            if (options.checkOrder !== false && !this._checkFlowOrder(flowName, state)) {
                return false;
            }

            if (state.currentFlow !== FlowStates.IDLE) {
                state.undoStack.push({
                    flow: state.currentFlow,
                    snapshot: state.snapshots[state.currentFlow] ? 
                              JSON.parse(JSON.stringify(state.snapshots[state.currentFlow])) : null,
                    timestamp: Date.now()
                });
                if (state.undoStack.length > 50) {
                    state.undoStack.shift();
                }
            }

            state.flowHistory.push({
                flow: flowName,
                enterTime: Date.now(),
                fromFlow: state.currentFlow
            });

            if (options.snapshot) {
                state.snapshots[flowName] = JSON.parse(JSON.stringify(options.snapshot));
            }

            state.currentFlow = flowName;
            state.metadata[flowName] = {
                enterTime: Date.now(),
                options: options,
                isDirty: false
            };
            state.isDirty = false;

            this._bindKeyboardShortcuts(flowName);

            if (options.onEnter && typeof options.onEnter === 'function') {
                options.onEnter();
            }

            if (options.autoSave) {
                this._startAutoSave(flowName);
            }

            this._updateFlowIndicator();

            console.log(`[FlowState] 进入功能: ${flowName}`);
            return true;
        },

        exitFlow: function(flowName, force = false) {
            const state = this._getCurrentWorkspaceState();
            
            if (state.currentFlow !== flowName) return true;

            if (!force && state.metadata[flowName]?.isDirty) {
                this.showUnsavedChangesDialog(flowName);
                return false;
            }

            const metadata = state.metadata[flowName];
            
            if (metadata?.options?.onExit && typeof metadata.options.onExit === 'function') {
                metadata.options.onExit();
            }

            this._stopAutoSave(flowName);
            this._unbindKeyboardShortcuts(flowName);

            const lastSnapshot = state.snapshots[flowName];
            state.snapshots = {};
            if (lastSnapshot) {
                state.snapshots[flowName] = lastSnapshot;
            }

            state.currentFlow = FlowStates.IDLE;
            this._updateFlowIndicator();

            console.log(`[FlowState] 退出功能: ${flowName}`);
            return true;
        },

        undo: function() {
            const state = this._getCurrentWorkspaceState();
            
            if (state.undoStack.length === 0) {
                ToastManager?.show('warning', '撤销失败', '没有可撤销的操作');
                return null;
            }

            if (state.currentFlow !== FlowStates.IDLE) {
                state.redoStack.push({
                    flow: state.currentFlow,
                    snapshot: state.snapshots[state.currentFlow] ? 
                              JSON.parse(JSON.stringify(state.snapshots[state.currentFlow])) : null
                });
            }

            const undoItem = state.undoStack.pop();
            
            ToastManager?.show('info', '撤销成功', `已撤销到 ${undoItem.flow || '上一个状态'}`);
            
            return undoItem;
        },

        redo: function() {
            const state = this._getCurrentWorkspaceState();
            
            if (state.redoStack.length === 0) {
                ToastManager?.show('warning', '重做失败', '没有可重做的操作');
                return null;
            }

            const redoItem = state.redoStack.pop();
            
            if (state.currentFlow !== FlowStates.IDLE) {
                state.undoStack.push({
                    flow: state.currentFlow,
                    snapshot: state.snapshots[state.currentFlow] ? 
                              JSON.parse(JSON.stringify(state.snapshots[state.currentFlow])) : null
                });
            }

            ToastManager?.show('info', '重做成功', `已重做 ${redoItem.flow}`);
            
            return redoItem;
        },

        getFlowHistory: function() {
            const state = this._getCurrentWorkspaceState();
            return state.flowHistory;
        },

        getUndoStackSize: function() {
            const state = this._getCurrentWorkspaceState();
            return state.undoStack.length;
        },

        getRedoStackSize: function() {
            const state = this._getCurrentWorkspaceState();
            return state.redoStack.length;
        },

        isAnyFlowActive: function() {
            const state = this._getCurrentWorkspaceState();
            return state.currentFlow !== null && state.currentFlow !== FlowStates.IDLE;
        },

        getCurrentFlow: function() {
            const state = this._getCurrentWorkspaceState();
            return state.currentFlow;
        },

        isDirty: function() {
            const state = this._getCurrentWorkspaceState();
            return state.isDirty;
        },

        markDirty: function(flowName = null) {
            const state = this._getCurrentWorkspaceState();
            const targetFlow = flowName || state.currentFlow;
            if (targetFlow && state.metadata[targetFlow]) {
                state.metadata[targetFlow].isDirty = true;
                state.isDirty = true;
            }
        },

        markClean: function(flowName = null) {
            const state = this._getCurrentWorkspaceState();
            const targetFlow = flowName || state.currentFlow;
            if (targetFlow && state.metadata[targetFlow]) {
                state.metadata[targetFlow].isDirty = false;
                state.isDirty = false;
            }
            state.lastSaveTime = Date.now();
        },

        save: function(flowName = null) {
            const state = this._getCurrentWorkspaceState();
            const targetFlow = flowName || state.currentFlow;

            if (!targetFlow || targetFlow === FlowStates.IDLE) {
                ToastManager?.show('error', '保存失败', '当前没有活动功能');
                return false;
            }

            if (window.currentRoutineData) {
                state.snapshots[targetFlow] = JSON.parse(JSON.stringify(window.currentRoutineData));
            }

            this.markClean(targetFlow);
            ToastManager?.show('success', '保存成功', `${this._getFlowDisplayName(targetFlow)} 已保存`);
            return true;
        },

        cancel: function(flowName = null) {
            const state = this._getCurrentWorkspaceState();
            const targetFlow = flowName || state.currentFlow;
            
            this.exitFlow(targetFlow, true);
            
            const snapshot = state.snapshots[targetFlow];
            if (snapshot && window.currentRoutineData) {
                Object.assign(window.currentRoutineData, snapshot);
                if (typeof window.updateUIRoutineList === 'function') {
                    window.updateUIRoutineList();
                }
            }

            ToastManager?.show('warning', '操作取消', `已取消 ${this._getFlowDisplayName(targetFlow)} 并恢复数据`);
        },

        _checkFlowOrder: function(targetFlow, state) {
            const currentOrder = FlowOrder[state.currentFlow] || 0;
            const targetOrder = FlowOrder[targetFlow] || 0;
            
            if (targetOrder < currentOrder - 1) {
                ToastManager?.show('warning', '流程顺序错误', 
                    `请先完成【${this._getFlowDisplayName(state.currentFlow)}】，再进行【${this._getFlowDisplayName(targetFlow)}】`);
                return false;
            }
            
            return true;
        },

        getFlowProgress: function() {
            const state = this._getCurrentWorkspaceState();
            const currentOrder = FlowOrder[state.currentFlow] || 0;
            const totalSteps = Object.keys(FlowOrder).length;
            
            return {
                current: state.currentFlow,
                currentOrder: currentOrder,
                totalSteps: totalSteps,
                progress: Math.round((currentOrder / totalSteps) * 100)
            };
        },

        showInterception: function(targetFlow, context = {}) {
            const state = this._getCurrentWorkspaceState();
            const currentFlowName = this._getFlowDisplayName(state.currentFlow);
            const targetFlowName = this._getFlowDisplayName(targetFlow);

            this._showInterceptionModal(currentFlowName, targetFlowName, context);
        },

        showUnsavedChangesDialog: function(flowName) {
            const flowDisplayName = this._getFlowDisplayName(flowName);
            
            const modal = document.createElement('div');
            modal.id = 'flowStateUnsavedModal';
            modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]';
            modal.innerHTML = `
                <div class="bg-white rounded-xl shadow-2xl p-6 max-w-md mx-4">
                    <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        💾 未保存的更改
                    </h3>
                    <p class="text-gray-600 mb-6">
                        您在【${flowDisplayName}】中有未保存的更改。是否保存后再退出？
                    </p>
                    <div class="flex gap-3">
                        <button id="flowStateSaveBtn" class="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition font-bold">
                            💾 保存
                        </button>
                        <button id="flowStateDiscardBtn" class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition font-bold">
                            🗑️ 放弃
                        </button>
                        <button id="flowStateCancelBtn" class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 py-2 px-4 rounded-lg transition font-bold">
                            取消
                        </button>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            const self = this;
            modal.querySelector('#flowStateSaveBtn').onclick = () => {
                self.save(flowName);
                self.exitFlow(flowName, true);
                modal.remove();
            };

            modal.querySelector('#flowStateDiscardBtn').onclick = () => {
                self.exitFlow(flowName, true);
                modal.remove();
            };

            modal.querySelector('#flowStateCancelBtn').onclick = () => {
                modal.remove();
            };
        },

        _showInterceptionModal: function(currentFlow, targetFlow, context) {
            const modal = document.createElement('div');
            modal.id = 'flowStateInterceptionModal';
            modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]';
            modal.innerHTML = `
                <div class="bg-white rounded-xl shadow-2xl p-6 max-w-md mx-4">
                    <div class="text-5xl mb-4 text-center">🚫</div>
                    <h3 class="text-lg font-bold text-gray-800 mb-4 text-center">操作被拦截</h3>
                    <p class="text-gray-600 mb-4 text-center">
                        您正在进行【${currentFlow}】，无法切换到【${targetFlow}】。
                    </p>
                    <div class="text-sm text-gray-500 mb-4 bg-gray-50 p-3 rounded-lg space-y-1">
                        <p><strong>💾 保存并退出</strong> - 保存当前进度后切换</p>
                        <p><strong>🗑️ 放弃并退出</strong> - 放弃更改并切换</p>
                        <p><strong>继续当前操作</strong> - 留在当前流程</p>
                    </div>
                    <div class="flex gap-3">
                        <button id="flowStateSaveExitBtn" class="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition font-bold">
                            💾 保存并退出
                        </button>
                        <button id="flowStateCancelExitBtn" class="flex-1 bg-red-400 hover:bg-red-500 text-white py-2 px-4 rounded-lg transition font-bold">
                            🗑️ 放弃并退出
                        </button>
                    </div>
                    <button id="flowStateContinueBtn" class="w-full mt-3 bg-gray-100 hover:bg-gray-200 text-gray-600 py-2 px-4 rounded-lg transition font-bold">
                        继续【${currentFlow}】
                    </button>
                </div>
            `;

            document.body.appendChild(modal);

            const self = this;
            modal.querySelector('#flowStateSaveExitBtn').onclick = () => {
                self.save();
                self.exitFlow(self.getCurrentFlow(), true);
                modal.remove();
            };

            modal.querySelector('#flowStateCancelExitBtn').onclick = () => {
                self.cancel();
                modal.remove();
            };

            modal.querySelector('#flowStateContinueBtn').onclick = () => {
                modal.remove();
            };
        },

        _updateFlowIndicator: function() {
            const state = this._getCurrentWorkspaceState();
            const indicator = document.getElementById('flowStateIndicator');
            
            if (!indicator) return;

            const currentFlow = state.currentFlow || FlowStates.IDLE;
            const isActive = currentFlow !== FlowStates.IDLE;

            // 根据是否有活动流程来显示/隐藏指示器
            if (isActive) {
                indicator.classList.remove('hidden');
                indicator.innerHTML = `
                    <span class="text-xs font-bold text-slate-500">当前流程：</span>
                    <span class="px-2 py-0.5 rounded-full text-xs font-bold ${
                        currentFlow === FlowStates.CANVAS_EDITING ? 'bg-blue-100 text-blue-700' :
                        currentFlow === FlowStates.JUDGING ? 'bg-amber-100 text-amber-700' :
                        currentFlow === FlowStates.MUSIC_SELECTING ? 'bg-purple-100 text-purple-700' :
                        currentFlow === FlowStates.PLAYBACK_3D ? 'bg-green-100 text-green-700' :
                        currentFlow === FlowStates.SCORE_REVIEW ? 'bg-indigo-100 text-indigo-700' :
                        'bg-gray-100 text-gray-700'
                    }">
                        ${this._getFlowDisplayName(currentFlow)}
                    </span>
                    <div class="flex items-center gap-1">
                        <span class="text-xs text-gray-400">撤销</span>
                        <span class="px-1.5 py-0.5 rounded text-xs font-bold ${state.undoStack.length > 0 ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-300'}">
                            ${state.undoStack.length}
                        </span>
                    </div>
                `;
            } else {
                // 空闲时隐藏指示器
                indicator.classList.add('hidden');
            }
        },

        getStateSummary: function() {
            const state = this._getCurrentWorkspaceState();
            return {
                currentFlow: state.currentFlow,
                isDirty: state.isDirty,
                undoStackSize: state.undoStack.length,
                flowHistory: state.flowHistory,
                lastSaveTime: state.lastSaveTime
            };
        },

        restoreFromSummary: function(summary) {
            const state = this._getCurrentWorkspaceState();
            
            if (summary) {
                if (summary.currentFlow) {
                    state.currentFlow = summary.currentFlow;
                }
                if (summary.flowHistory) {
                    state.flowHistory = summary.flowHistory;
                }
                if (summary.lastSaveTime) {
                    state.lastSaveTime = summary.lastSaveTime;
                }
            }
            
            this._updateFlowIndicator();
        },
        
        /**
         * 根据历史记录数据推断流程状态
         * 用于在加载历史时判断该历史记录完成到了哪一步
         */
        inferStateFromData: function(routine) {
            // 优先级：从高到低
            // 1. 有 scoreReport + eScoreReport → 已完成打分（SCORE_REVIEW）
            // 2. 有 musicUrl 或 musicId → 已选择音乐（MUSIC_SELECTING）
            // 3. 有 tracks 且 tracks.length > 0 → 已完成编排（CANVAS_EDITING）
            // 4. 其他 → 空闲（IDLE）
            
            if (routine.scoreReport && routine.eScoreReport) {
                return FlowStates.SCORE_REVIEW;
            }
            if (routine.musicUrl || routine.musicId) {
                return FlowStates.MUSIC_SELECTING;
            }
            if (routine.tracks && routine.tracks.length > 0) {
                return FlowStates.CANVAS_EDITING;
            }
            return FlowStates.IDLE;
        },
        
        /**
         * 获取历史记录的状态描述
         */
        getStateDescription: function(routine) {
            const state = this.inferStateFromData(routine);
            const descriptions = {
                [FlowStates.IDLE]: '新建中',
                [FlowStates.CANVAS_EDITING]: '已编排',
                [FlowStates.MUSIC_SELECTING]: '已配乐',
                [FlowStates.SCORE_REVIEW]: '已完成'
            };
            return descriptions[state] || '未知';
        },

        _getFlowDisplayName: function(flowName) {
            const displayNames = {
                [FlowStates.IDLE]: '空闲',
                [FlowStates.CANVAS_EDITING]: '画板编辑',
                [FlowStates.JUDGING]: '裁判打分',
                [FlowStates.MUSIC_SELECTING]: '音乐选择',
                [FlowStates.SCORE_REVIEW]: '成绩查看',
                [FlowStates.PLAYBACK_3D]: '3D演示',
                [FlowStates.DRAFT_SAVING]: '草稿保存',
                [FlowStates.HISTORY_VIEWING]: '历史查看'
            };
            return displayNames[flowName] || flowName || '空闲';
        },

        _bindKeyboardShortcuts: function(flowName) {
            const self = this;
            
            this._shortcutsHandler = (e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                    e.preventDefault();
                    self.save();
                }
                if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
                    e.preventDefault();
                    self.undo();
                }
                if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
                    e.preventDefault();
                    self.redo();
                }
                if (e.key === 'Escape') {
                    e.preventDefault();
                    if (self.isDirty()) {
                        self.showUnsavedChangesDialog(flowName);
                    }
                }
            };

            document.addEventListener('keydown', this._shortcutsHandler);
        },

        _unbindKeyboardShortcuts: function(flowName) {
            if (this._shortcutsHandler) {
                document.removeEventListener('keydown', this._shortcutsHandler);
                this._shortcutsHandler = null;
            }
        },

        _startAutoSave: function(flowName) {
            const self = this;
            
            this._autoSaveTimer = setInterval(() => {
                const state = self._getCurrentWorkspaceState();
                if (state.metadata[flowName]?.isDirty) {
                    self.save();
                    console.log(`[FlowState] 自动保存: ${flowName}`);
                }
            }, 30000);
        },

        _stopAutoSave: function(flowName) {
            if (this._autoSaveTimer) {
                clearInterval(this._autoSaveTimer);
                this._autoSaveTimer = null;
            }
        }
    };

    window.FlowStateManager.FlowStates = FlowStates;
    window.FlowStateManager.FlowOrder = FlowOrder;

    document.addEventListener('DOMContentLoaded', () => {
        // 初始化工作区状态
        const currentWsId = window.WorkspaceManager?.workspaces?.[window.WorkspaceManager?.currentIndex]?.id;
        if (currentWsId) {
            window.FlowStateManager.setCurrentWorkspace(currentWsId);
        }
        
        // 初始化流程指示器
        setTimeout(() => {
            window.FlowStateManager._updateFlowIndicator();
        }, 100);
        
        const originalExecuteSwitch = window.WorkspaceManager?.executeSwitch;
        if (originalExecuteSwitch) {
            window.WorkspaceManager.executeSwitch = function(...args) {
                const currentWsId = window.WorkspaceManager.workspaces[window.WorkspaceManager.currentIndex]?.id;
                if (currentWsId && window.FlowStateManager.isAnyFlowActive()) {
                    window.FlowStateManager.save();
                }
                
                const result = originalExecuteSwitch.apply(this, args);
                
                const newWsId = this.workspaces[this.currentIndex]?.id;
                if (newWsId) {
                    window.FlowStateManager.setCurrentWorkspace(newWsId);
                }
                
                return result;
            };
        }

        console.log('[FlowStateManager] 功能状态管理系统已加载（增强版 - 支持 workspace 隔离）');
    });

})();
