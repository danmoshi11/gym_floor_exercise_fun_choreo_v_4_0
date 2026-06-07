// ==========================================
// 🎵 音乐模式流转控制器 (严格防呆 + 状态解耦)
// ==========================================

// 关闭音乐抽屉
window.closeMusicDrawer = function() {
    const drawer = document.getElementById('musicDrawer');
    if (drawer) drawer.classList.add('translate-y-full');
    
    // 🌟 抽屉收起时，呼出底部的救命把手！
    const handle = document.getElementById('musicDrawerHandle');
    if (handle) handle.classList.remove('translate-y-full');
};

// 打开音乐抽屉
window.openMusicDrawer = function() {
    const drawer = document.getElementById('musicDrawer');
    if (drawer) drawer.classList.remove('translate-y-full');
    
    // 🌟 抽屉打开时，隐藏把手
    const handle = document.getElementById('musicDrawerHandle');
    if (handle) handle.classList.add('translate-y-full');
};
window.backToMusicSelection = function() {
    console.log("%c[音乐模式] ← 返回音乐选择阶段", "color: white; background: #f59e0b; font-size: 12px;");
    
    const selectionPanel = document.getElementById('musicSelectionPanel');
    const arrangementPanel = document.getElementById('musicArrangementPanel');
    if (selectionPanel) selectionPanel.classList.remove('hidden');
    if (arrangementPanel) arrangementPanel.classList.add('hidden');
    
    const subtitle = document.getElementById('musicDrawerSubtitle');
    if (subtitle) subtitle.innerText = '请在下方曲库中选择一首背景音乐...';
    
    const confirmBtn = document.getElementById('musicConfirmBtn');
    const reselectBtn = document.getElementById('reselectMusicBtn');
    const musicActionButtons = document.getElementById('musicActionButtons');
    const libraryList = document.getElementById('musicLibraryList');
    
    if (confirmBtn) confirmBtn.classList.add('hidden');
    if (reselectBtn) reselectBtn.classList.remove('hidden');
    if (musicActionButtons) musicActionButtons.classList.remove('hidden');
    if (libraryList) libraryList.classList.remove('hidden');

    // 🌟 隐藏右侧音乐编排UI，恢复常规画板序列UI
    document.getElementById('normalRoutineHeader').classList.remove('hidden');
    document.getElementById('routineList').classList.remove('hidden');
    document.getElementById('routineEditorBox').classList.add('hidden');
    document.getElementById('musicRoutineContent').classList.add('hidden');
};

// 进入音乐编排阶段
window.enterArrangementPhase = function(fromCache = false) {
    console.log("%c[音乐模式] 🎯 进入音乐编排阶段 (全自动匹配版)", "color: white; background: #8b5cf6; font-size: 12px;");
    
    // 🌟【清洗防线】：进入第二阶段时，立刻将音乐身上可能粘连的第三阶段监听器剥离干净！
    // 这样第二阶段放完音乐，绝对是一场普通的播放结束，死活不会触发展示完的扣分面板！
    if (window.AudioEngine && window.AudioEngine.wavesurfer) {
        const ws = window.AudioEngine.wavesurfer;
        ws.un('play'); ws.un('pause'); ws.un('finish');
    }

    const selectionPanel = document.getElementById('musicSelectionPanel');
    const arrangementPanel = document.getElementById('musicArrangementPanel');
    if (selectionPanel) selectionPanel.classList.add('hidden');
    if (arrangementPanel) arrangementPanel.classList.remove('hidden');
    
    const phaseInfoBar = document.getElementById('phaseInfoBar');
    if (fromCache && phaseInfoBar) phaseInfoBar.classList.remove('hidden');
    else if (phaseInfoBar) phaseInfoBar.classList.add('hidden');
    
    const subtitle = document.getElementById('musicDrawerSubtitle');
    if (subtitle) subtitle.innerText = '按 [M] 键在音乐中打标记点，右侧槽位将全自动落入动作';
    
    // ... 下方原本控制按钮和工具栏的代码保持不变 ...
    const libraryList = document.getElementById('musicLibraryList');
    const confirmBtn = document.getElementById('musicConfirmBtn');
    const reselectBtn = document.getElementById('reselectMusicBtn');
    const musicActionButtons = document.getElementById('musicActionButtons');
    if (libraryList) libraryList.classList.add('hidden');
    if (confirmBtn) confirmBtn.classList.add('hidden');
    if (reselectBtn) reselectBtn.classList.add('hidden'); 
    if (musicActionButtons) musicActionButtons.classList.add('hidden');

    // 画线工具栏正常显示，因为现在我们不需要“假装拖拽”了
    const drawingToolsWrapper = document.getElementById('drawingToolsWrapper');
    const dragHintBar = document.getElementById('dragHintBar');
    if (drawingToolsWrapper) drawingToolsWrapper.classList.remove('hidden');
    if (dragHintBar) dragHintBar.classList.add('hidden');
    if (typeof setTool === 'function') setTool('line');

    // 🌟 显示右侧音乐编排UI，隐藏常规画板UI
    document.getElementById('normalRoutineHeader').classList.add('hidden');
    document.getElementById('routineList').classList.add('hidden');
    document.getElementById('routineEditorBox').classList.remove('hidden');
    document.getElementById('musicRoutineContent').classList.remove('hidden');
    
    if (typeof updateTimelineUI === 'function') updateTimelineUI();
    updateRoutineSlots();
    // 🌟【核心修复点】：进入编排阶段时，无条件确保底部抽屉弹出！
    window.openMusicDrawer();
    
    if (typeof updateTimelineUI === 'function') updateTimelineUI();
    updateRoutineSlots();
};

// 0. 统一的点击处理函数
window.handleMusicModeClick = function(e) {
    console.log("%c[音乐模式调试] 🔍 handleMusicModeClick 被调用", "color: white; background: #8b5cf6; font-size: 12px; padding: 4px;");
    
    const checkbox = document.getElementById('musicModeToggle');
    const wrapper = document.getElementById('musicModeWrapper');
    console.log("[音乐模式调试] checkbox 元素:", checkbox);
    console.log("[音乐模式调试] wrapper 元素:", wrapper);
    console.log("[音乐模式调试] wrapper.classList:", wrapper ? wrapper.classList.toString() : 'null');
    console.log("[音乐模式调试] wrapper 是否有 hidden 类:", wrapper ? wrapper.classList.contains('hidden') : 'null');
    console.log("%c[音乐模式调试] window.currentScoreReport:", "color: white; background: #f59e0b; font-size: 12px;", window.currentScoreReport);
    console.log("%c[音乐模式调试] window.currentEScoreReport:", "color: white; background: #f59e0b; font-size: 12px;", window.currentEScoreReport);
    console.log("%c[音乐模式调试] window.currentRoutineData.musicId:", "color: white; background: #f59e0b; font-size: 12px;", window.currentRoutineData?.musicId);
    
    // 检查资格：如果有音乐ID，不需要检查分数（已有音乐意味着打过分了）
    if (!window.currentScoreReport && !window.currentRoutineData?.musicId) {
        console.error("%c[音乐模式调试] ❌ 拦截原因：window.currentScoreReport 不存在且没有音乐ID！", "color: white; background: red; font-size: 12px;");
        e.preventDefault();
        ToastManager.show('warning', '⚠️ 尚未解锁', '请先点击下方【✅ 完成编排并计算最终成绩】并完成 E分结算，\n然后才能进入音乐模式！', 4500);
        return;
    } else {
        console.log("%c[音乐模式调试] ✅ 通过资格审查（有分数或有音乐ID）", "color: white; background: green; font-size: 12px;");
    }
    
    console.log("%c[音乐模式调试] ✅ 通过资格审查，准备切换 checkbox 状态", "color: white; background: green; font-size: 12px;");
    console.log("[音乐模式调试] 切换前 checkbox.checked:", checkbox.checked);
    
    // 切换 checkbox 状态
    checkbox.checked = !checkbox.checked;
    console.log("[音乐模式调试] 切换后 checkbox.checked:", checkbox.checked);
    
    // 更新 wrapper 的视觉状态（基于 checkbox 的 peer 样式）
    if (checkbox.checked) {
        wrapper.classList.add('bg-indigo-50', 'border-indigo-300');
        wrapper.classList.remove('bg-slate-100', 'border-slate-200');
    } else {
        wrapper.classList.remove('bg-indigo-50', 'border-indigo-300');
        wrapper.classList.add('bg-slate-100', 'border-slate-200');
    }
    
    // 调用实际的切换逻辑
    toggleMusicMode(checkbox);
};

// 1. 点击开关外壳时的前置资格审查（保留作为备用）
window.checkMusicModeEligibility = function(e) {
    console.log("%c[音乐模式调试] ⚠️ checkMusicModeEligibility 被调用（已弃用，请使用 handleMusicModeClick）", "color: white; background: #f59e0b; font-size: 12px; padding: 4px;");
    
    const checkbox = document.getElementById('musicModeToggle');
    console.log("[音乐模式调试] window.currentScoreReport:", window.currentScoreReport);
    
    if (!window.currentScoreReport) {
        e.preventDefault();
        ToastManager.show('warning', '⚠️ 尚未解锁', '请先点击下方【✅ 完成编排并计算最终成绩】并完成 E分结算，\n然后才能进入音乐模式！', 4500);
        return;
    }
};

// 2. 资格审查通过后，真正的开关状态流转
window.toggleMusicMode = function(checkbox, skipConfirm = false) {
    console.log("%c[音乐模式调试] 🎯 toggleMusicMode 被调用", "color: white; background: #3b82f6; font-size: 12px; padding: 4px;");
    console.log("[音乐模式调试] checkbox.checked:", checkbox.checked);
    console.log("[音乐模式调试] skipConfirm:", skipConfirm);
    
    const drawer = document.getElementById('musicDrawer');
    console.log("[音乐模式调试] drawer 元素:", drawer);
    
    if (checkbox.checked) {
        // 【进入模式：直接锁定，不弹确认】
        console.log("[音乐模式调试] 进入模式，锁定画板...");

        // 锁定 2D 画板
        if (window.AppController && AppController.applyViewingMode) {
            console.log("[音乐模式调试] 调用 AppController.applyViewingMode(true)");
            AppController.applyViewingMode(true);
        } else {
            console.warn("[音乐模式调试] ⚠️ AppController 或 applyViewingMode 不存在");
        }
        
        // 滑出音乐抽屉
        if (drawer) {
            drawer.classList.remove('translate-y-full');
        }
        
        // ✨ 智能状态检查：根据已有数据决定显示哪个阶段
        const hasMusic = window.currentRoutineData && (window.currentRoutineData.musicId || window.currentRoutineData.musicUrl);
        const hasArrangement = window.currentRoutineData && window.currentRoutineData.musicMarkers && 
                              window.currentRoutineData.musicMarkers.length >= 2;
        
        console.log("[音乐模式调试] hasMusic:", hasMusic, "hasArrangement:", hasArrangement);
        
        if (hasMusic && hasArrangement) {
            // 已有完整编排：直接进入编排阶段（跳过选择阶段）
            console.log("[音乐模式调试] 🎵 已有完整音乐编排，直接进入编排阶段");
            
            // 加载已有的音乐标记
            window.musicMarkers = JSON.parse(JSON.stringify(window.currentRoutineData.musicMarkers));
            
            // 加载音乐
            if (window.currentRoutineData.musicId) {
                window.selectMusic(window.currentRoutineData.musicId, window.currentRoutineData.musicUrl);
            }
            
            // 直接进入编排阶段（从缓存加载）
            enterArrangementPhase(true);
            
            ToastManager.show('success', '进入音乐模式', '🎵 已恢复您的完整音乐编排！\n可以直接播放成套了！');
            
        } else if (hasMusic) {
            // 只有音乐没有编排：进入编排阶段（跳过选择阶段）
            console.log("[音乐模式调试] 🎶 已有音乐，进入编排阶段");
            
            // 加载音乐
            if (window.currentRoutineData.musicId) {
                window.selectMusic(window.currentRoutineData.musicId, window.currentRoutineData.musicUrl);
            }
            
            // 如果有部分标记，加载它们；否则初始化默认的首尾标记点
            if (window.currentRoutineData.musicMarkers && window.currentRoutineData.musicMarkers.length > 0) {
                window.musicMarkers = JSON.parse(JSON.stringify(window.currentRoutineData.musicMarkers));
            } else {
                // ✨ 恢复默认的首尾标记点
                const duration = AudioEngine && AudioEngine.wavesurfer ? AudioEngine.wavesurfer.getDuration() : 0;
                window.musicMarkers = [
                    { time: 0, label: '开始' },
                    { time: Math.max(0, duration - 0.1), label: '结束' }
                ];
                window.currentRoutineData.musicMarkers = window.musicMarkers;
                console.log("[音乐模式调试] 🎯 已初始化默认的首尾标记点");
            }
            
            // 进入编排阶段（从缓存加载）
            enterArrangementPhase(true);
            
            ToastManager.show('success', '进入音乐模式', '🎵 已恢复您选择的音乐！\n现在可以进行动作编排了。');
            
        } else {
            // 什么都没有：显示选择阶段
            console.log("[音乐模式调试] 🎼 无音乐，显示选择面板");
            
            // 显示选择面板，隐藏编排面板
            const selectionPanel = document.getElementById('musicSelectionPanel');
            const arrangementPanel = document.getElementById('musicArrangementPanel');
            
            if (selectionPanel) selectionPanel.classList.remove('hidden');
            if (arrangementPanel) arrangementPanel.classList.add('hidden');
            
            // 更新副标题
            const subtitle = document.getElementById('musicDrawerSubtitle');
            if (subtitle) subtitle.innerText = '请在下方曲库中选择一首背景音乐...';
            
            // 更新按钮状态
            window.isInPhase3 = false;
            updateMusicModeButtonState();
            
            ToastManager.show('success', '进入音乐模式', '编排已安全锁定 🔒。请载入音乐开始您的汇报演出！');
        }

    } else {
        // 【退出模式：询问保存或清空】
        console.log("[音乐模式调试] 退出模式...");
        // 既然开关被点回去了，必须阻断默认的立刻关闭，先弹窗问清楚
        checkbox.checked = true; // 先强行把开关状态稳住

        const exitChoice = confirm("🚪 准备退出音乐模式。您想要保存当前的音乐编排版本吗？\n\n[确定] = 保存并退出\n[取消] = 清空音乐设置并退出");
        
        if (exitChoice) {
            // ✅ 真正呼叫保存音乐版本的引擎！
            if (typeof AppController !== 'undefined') AppController.saveMusicRoutineVersion();
            ToastManager.show('success', '保存成功', '🎶 音乐编排版本已独立存入历史记录！');
        } else {
            ToastManager.show('info', '已清空退出', '音乐设置已丢弃，已返回纯编排模式。');
        }

        // 无论保存与否，执行真实的退出动作
        checkbox.checked = false; 
        if (drawer) {
            drawer.classList.add('translate-y-full');
        }
        
        // 解锁 2D 画板
        if (window.AppController && AppController.applyViewingMode) {
            console.log("[音乐模式调试] 调用 AppController.applyViewingMode(false) 解锁");
            AppController.applyViewingMode(false);
        }
        
        // 重置阶段标记
        window.isInPhase3 = false;
        
        // 恢复按钮状态
        updateMusicModeButtonState();
        
        // 恢复显示画线工具
        const drawingToolsWrapper = document.getElementById('drawingToolsWrapper');
        const dragHintBar = document.getElementById('dragHintBar');
        if (drawingToolsWrapper) drawingToolsWrapper.classList.remove('hidden');
        if (dragHintBar) dragHintBar.classList.add('hidden');
    }
    
    console.log("%c[音乐模式调试] ✅ toggleMusicMode 执行完成", "color: white; background: green; font-size: 12px;");
};

// 3. 在你原本的 showFinalScoreBoard (结算完毕) 函数的最后一行，加入这句代码解锁开关：
// document.getElementById('musicModeWrapper').classList.remove('grayscale', 'opacity-70');
// document.getElementById('musicModeLabel').innerText = '🎬 现场/音乐模式';

// 3. 渲染本地综合音乐库 (分栏展示：体操、花滑、私人)
window.renderLocalMusicList = async function() {
    // 改为填充到我们抽屉里的专有曲库容器中，保持波形图容器的纯净
    const listContainer = document.getElementById('musicLibraryList');
    if (!listContainer) return;

    let html = '';

    // ==========================================
    // 栏目 A+B：体操选曲 (70%) + 花滑选曲 (30%)
    // ==========================================
    html += `<div class="flex gap-3">`;
    
    // 体操选曲 (70%)
    const gymnasticsMusic = SYSTEM_MUSIC_PRESETS.filter(m => m.genre === 'gymnastics');
    html += `<div class="flex-[7] flex items-center gap-2 overflow-x-auto pb-2">`;
    html += `<div class="shrink-0 flex items-center justify-center w-8 h-12 bg-emerald-50 rounded text-emerald-600 text-xs font-black" style="writing-mode: vertical-lr;">体操选曲</div>`;
    
    if (gymnasticsMusic.length > 0) {
        gymnasticsMusic.forEach(music => {
            html += `
                <div onclick="selectMusic('${music.id}', '${music.url}')" class="bg-white border border-slate-200 hover:border-emerald-500 p-2 rounded-lg shadow-sm w-[150px] shrink-0 cursor-pointer transition-all hover:-translate-y-0.5 group">
                    <div class="text-[10px] font-black text-slate-700 truncate group-hover:text-emerald-600" title="${music.name}">${music.name}</div>
                    <div class="text-[9px] text-slate-400 mt-1">FIG 内置音源</div>
                </div>
            `;
        });
    }
    html += `</div>`;
    
    // 花滑选曲 (30%) - 暂时留空
    html += `<div class="flex-[3] flex items-center gap-2 overflow-x-auto pb-2">`;
    html += `<div class="shrink-0 flex items-center justify-center w-8 h-12 bg-cyan-50 rounded text-cyan-600 text-xs font-black" style="writing-mode: vertical-lr;">花滑选曲</div>`;
    html += `<div class="text-[10px] text-slate-300 italic px-2">暂无内置花滑选曲，期待后续更新...</div>`;
    html += `</div>`;
    
    html += `</div>`;

    // ==========================================
    // 栏目 C：私人本地上传曲库 (IndexedDB 托管)
    // ==========================================
    try {
        if (typeof MusicManager !== 'undefined') {
            const localAudios = await MusicManager.getAllAudios();
            if (localAudios.length > 0) {
                html += `<div class="w-full flex items-center gap-2 overflow-x-auto pb-2 mt-1 border-t border-slate-100 pt-2">`;
                html += `<div class="shrink-0 flex items-center justify-center w-8 h-12 bg-indigo-50 rounded text-indigo-600 text-xs font-black" style="writing-mode: vertical-lr;">私人本地</div>`;
                
                localAudios.forEach(audio => {
                    let sizeMB = (audio.size / 1024 / 1024).toFixed(1);
                    html += `
                        <div onclick="selectMusic('${audio.id}', null)" class="bg-white border border-slate-200 hover:border-indigo-500 p-2 rounded-lg shadow-sm w-[150px] shrink-0 cursor-pointer transition-all hover:-translate-y-0.5 group">
                            <div class="text-[10px] font-black text-slate-700 truncate group-hover:text-indigo-600" title="${audio.name}">${audio.name}</div>
                            <div class="text-[9px] text-indigo-400 font-bold mt-1">${sizeMB} MB (本地)</div>
                        </div>
                    `;
                });
                html += `</div>`;
            }
        }
    } catch(e) {
        console.warn("读取本地私人曲库失败", e);
    }

    listContainer.innerHTML = html;
};

// 全局暂存试听中的音乐数据
window.auditionMusicData = { id: null, url: null };

// 1. 试听模式：只加载波形图，绝不修改当前成套的数据
window.selectMusic = async function(audioId, sysUrl) {
    // ✨【FlowStateManager】先检查是否有其他活动功能
    if (window.FlowStateManager && window.FlowStateManager.isAnyFlowActive() && window.FlowStateManager.getCurrentFlow() !== 'music_selecting') {
        window.FlowStateManager.showInterception('音乐试听');
        return;
    }

    // ✨【FlowStateManager】进入音乐选择模式（如果还没有进入）
    if (window.FlowStateManager && !window.FlowStateManager.isAnyFlowActive()) {
        window.FlowStateManager.enterFlow('music_selecting', {
            autoSave: false,
            snapshot: window.currentRoutineData,
            onExit: () => {
                // 退出时不清空波形图，因为用户需要继续使用它来打点编排
            }
        });
    }

    if (typeof AudioEngine === 'undefined') return;
    
    // 暂存到试听区
    window.auditionMusicData = { id: audioId, url: sysUrl };

    if (sysUrl) {
        ToastManager.show('info', '🎧 试听模式', '正在加载高保真音源，请点击左侧按钮试听...', 1500);
        AudioEngine.loadAudio(sysUrl, true); 
    } else {
        const localAudios = await MusicManager.getAllAudios();
        const record = localAudios.find(a => a.id === audioId);
        if (!record) return;
        ToastManager.show('info', '🎧 试听私人音频', '正在解冻数据流，请试听...', 1500);
        AudioEngine.loadAudio(record.blob, false); 
    }
    
    // 展现【✅ 确认导入该音乐】的按钮
    const actionButtons = document.getElementById('musicActionButtons');
    const confirmBtn = document.getElementById('musicConfirmBtn');
    const reselectBtn = document.getElementById('reselectMusicBtn');
    if (actionButtons) actionButtons.classList.remove('hidden');
    if (confirmBtn) confirmBtn.classList.remove('hidden');
    if (reselectBtn) reselectBtn.classList.add('hidden');
};

// 2. 正式绑定：用户满意了，点击“确认导入”，锁定 UI
window.confirmMusicBinding = function() {
    // ✨【FlowStateManager】先检查功能状态
    if (window.FlowStateManager && window.FlowStateManager.isAnyFlowActive() && window.FlowStateManager.getCurrentFlow() !== 'music_selecting') {
        window.FlowStateManager.showInterception('音乐绑定');
        return;
    }

    window.currentRoutineData = window.currentRoutineData || {};
    // 将试听数据正式盖章绑定到成套身上
    window.currentRoutineData.musicId = window.auditionMusicData.id;
    window.currentRoutineData.musicUrl = window.auditionMusicData.url;

    // 初始化时间轴标记 - 首尾两点自动设置好
    const duration = AudioEngine ? AudioEngine.wavesurfer.getDuration() : 0;
    window.musicMarkers = [
        { time: 0, label: '开始' },
        { time: Math.max(0, duration - 0.1), label: '结束' }
    ];
    window.currentRoutineData.musicMarkers = window.musicMarkers;

    ToastManager.show('success', '绑定成功', '🎉 该音乐已正式导入成套！\n现在可以按 [M] 键在音乐中打标记点了！', 3000);

    // ✨【FlowStateManager】退出音乐选择模式（先保存再退出）
    if (window.FlowStateManager) {
        window.FlowStateManager.save('music_selecting'); // 先保存，传入明确的 flow 名称
        window.FlowStateManager.exitFlow('music_selecting', true); // 再退出
    }
    
    // 进入编排阶段
    enterArrangementPhase();
};

// 3. 重新选择：用户想反悔换音乐，重置 UI
window.reselectMusic = function() {
    // 撕毁绑定契约
    if(window.currentRoutineData) {
        window.currentRoutineData.musicId = null;
        window.currentRoutineData.musicUrl = null;
        window.currentRoutineData.musicMarkers = null;
    }
    
    // 清空标记
    window.musicMarkers = [];

    ToastManager.show('warning', '解绑成功', '音乐已移除，请重新在下方选择一首歌。', 2000);

    // UX 魔法：隐藏“重新选择”按钮、展开曲库卡片
    const reselectBtn = document.getElementById('reselectMusicBtn');
    const libraryList = document.getElementById('musicLibraryList');
    const libraryTitle = document.getElementById('libraryTitle');
    const timelineEditor = document.getElementById('timelineEditor');
    const routineEditorBox = document.getElementById('routineEditorBox');
    
    if (reselectBtn) reselectBtn.classList.add('hidden');
    if (libraryList) libraryList.classList.remove('hidden');
    if (libraryTitle) libraryTitle.innerText = '🎵 可用曲库中心 (试听并选择)';
    if (timelineEditor) timelineEditor.classList.add('hidden');
    if (routineEditorBox) routineEditorBox.classList.add('hidden');
    
    // 恢复画线工具栏，隐藏拖拽提示栏
    const drawingToolsWrapper = document.getElementById('drawingToolsWrapper');
    const dragHintBar = document.getElementById('dragHintBar');
    if (drawingToolsWrapper) drawingToolsWrapper.classList.remove('hidden');
    if (dragHintBar) dragHintBar.classList.add('hidden');
    
    // 恢复默认工具（画线）
    if (typeof setTool === 'function') {
        setTool('line');
    }
    
    // ✨ 清除音乐编排状态，允许用户继续画线
    if (window.currentRoutineData) {
        window.currentRoutineData.musicId = null;
        window.currentRoutineData.musicUrl = null;
        window.currentRoutineData.placedActions = {};
        window.musicMarkers = [{ time: 0, label: '开始' }];
    }
    
    // 如果播放器在响，给它停掉
    if (typeof AudioEngine !== 'undefined' && AudioEngine.wavesurfer) {
        AudioEngine.wavesurfer.pause();
    }
    // ✨【修复 #3】：清空波形图 DOM，防止视觉混淆
    const container = document.getElementById('waveformContainer');
    if (container) container.innerHTML = '<p class="text-center text-gray-400 text-sm py-4">请在上方选择并试听音乐</p>';
};

// 4. 时间轴打点功能
window.handleMusicMarking = function() {
    if (!AudioEngine || !AudioEngine.wavesurfer) return;
    
    const currentTime = AudioEngine.wavesurfer.getCurrentTime();
    
    // 添加标记点（首尾两点已初始化，这里只添加中间点）
    window.musicMarkers = window.musicMarkers || [{ time: 0, label: '开始' }];
    window.musicMarkers.push({ 
        time: currentTime, 
        label: `标记 ${window.musicMarkers.length - 1}` 
    });
    
    // 按时间排序
    window.musicMarkers.sort((a, b) => a.time - b.time);
    
    // 更新UI
    updateTimelineUI();
    updateRoutineSlots();
    
    ToastManager.show('info', '标记已添加', `📍 在 ${formatTime(currentTime)} 处添加了标记点`, 1500);
};

// 5. 更新时间轴UI - 新设计：分段线段、呼吸动画、序号
function updateTimelineUI() {
    const markers = window.musicMarkers || [{ time: 0, label: '开始' }];
    const timelineBg = document.getElementById('timelineBackground');
    const markersContainer = document.getElementById('markersContainer');
    const markerCountEl = document.getElementById('markerCount');
    const segmentCountEl = document.getElementById('segmentCount');
    
    if (!markersContainer || !timelineBg) return;
    
    const duration = AudioEngine ? AudioEngine.wavesurfer.getDuration() : 60;
    const placedActions = window.currentRoutineData?.placedActions || [];
    
    // ==========================================
    // 渲染分段线段（带呼吸动画）
    // ==========================================
    let segmentsHtml = '';
    const segmentColors = [
        'from-blue-400 to-blue-500',    // 蓝
        'from-purple-400 to-purple-500', // 紫
        'from-pink-400 to-pink-500',    // 粉
        'from-green-400 to-green-500',   // 绿
        'from-yellow-400 to-yellow-500', // 黄
        'from-orange-400 to-orange-500'  // 橙
    ];
    
    markers.forEach((marker, index) => {
        const nextMarker = markers[index + 1];
        if (nextMarker) {
            const startPos = (marker.time / duration) * 100;
            const endPos = (nextMarker.time / duration) * 100;
            const width = endPos - startPos;
            const colorClass = segmentColors[index % segmentColors.length];
            const hasAction = placedActions[index] !== undefined;
            
            // 呼吸动画：未分配动作时闪烁，已分配后微亮
            const animationClass = hasAction ? 'opacity-40' : 'segment-breathe opacity-50';
            const glowClass = hasAction ? 'shadow-sm' : 'shadow-lg shadow-indigo-300';
            
            segmentsHtml += `
                <div class="absolute h-1.5 rounded-full bg-gradient-to-r ${colorClass} ${glowClass} ${animationClass}" 
                     style="left: ${startPos}%; width: ${width}%;">
                    <!-- 线段序号（在线段中心） -->
                    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                                w-5 h-5 rounded-full bg-white text-slate-700 text-[10px] font-black 
                                flex items-center justify-center shadow-md">
                        ${index + 1}
                    </div>
                </div>
            `;
        }
    });
    timelineBg.innerHTML = segmentsHtml;
    
    // ==========================================
    // 渲染标记点（可点击跳转播放）
    // ==========================================
    let pointsHtml = '';
    markers.forEach((marker, index) => {
        const position = (marker.time / duration) * 100;
        const isStart = index === 0;
        const isEnd = index === markers.length - 1;
        const colorClass = isStart ? 'bg-green-500' : (isEnd ? 'bg-red-500' : 'bg-indigo-500');
        
        // 计算该点左右线段是否有动作（用于判断能否删除）
        const leftHasAction = placedActions[index - 1] !== undefined;
        const rightHasAction = placedActions[index] !== undefined;
        const canDelete = !isStart && !isEnd && !leftHasAction && !rightHasAction;
        
        pointsHtml += `
            <div class="absolute transform -translate-x-1/2 cursor-pointer group z-10" style="left: ${position}%">
                <!-- 标记点 -->
                <div class="${colorClass} w-4 h-4 rounded-full shadow-lg border-2 border-white group-hover:scale-150 transition-transform"></div>
                
                <!-- 序号标签（在点上方） -->
                <div class="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-[10px] font-black px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    ${index + 1}
                </div>
                
                <!-- 时间提示（悬停显示） -->
                <div class="absolute -top-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    ${marker.label} (${formatTime(marker.time)})
                </div>
                
                <!-- 删除按钮（仅中间点可显示） -->
                ${!isStart && !isEnd ? `
                    <button onclick="removeMarker(${index})" 
                            class="absolute -top-2 -right-2 w-4 h-4 rounded-full text-[10px] flex items-center justify-center transition-all z-30
                                   ${canDelete ? 'bg-red-500 text-white hover:bg-red-600 opacity-0 group-hover:opacity-100' : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-0 group-hover:opacity-50'}"
                            title="${canDelete ? '删除此点（相邻线段无动作）' : '无法删除（相邻线段已有动作，需先删除动作）'}">
                        ×
                    </button>
                ` : ''}
                
                <!-- 点击跳转播放提示 -->
                <div class="absolute top-5 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-indigo-600 text-white text-[9px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    点击跳转
                </div>
            </div>
        `;
    });
    markersContainer.innerHTML = pointsHtml;
    
    // ==========================================
    // 添加点击跳转功能
    // ==========================================
    markersContainer.querySelectorAll('.absolute.cursor-pointer').forEach((point, index) => {
        point.onclick = (e) => {
            // 排除按钮点击
            if (e.target.tagName === 'BUTTON') return;
            const marker = markers[index];
            if (AudioEngine && AudioEngine.wavesurfer) {
                AudioEngine.wavesurfer.seekTo(marker.time / AudioEngine.wavesurfer.getDuration());
            }
        };
    });
    
    // 更新计数
    if (markerCountEl) markerCountEl.textContent = markers.length;
    if (segmentCountEl) segmentCountEl.textContent = markers.length - 1 || 1;
    
    // 保存标记到数据
    if (window.currentRoutineData) {
        window.currentRoutineData.musicMarkers = markers;
    }
}

// 6. 删除标记点（带左右线段检测）
window.removeMarker = function(index) {
    const markers = window.musicMarkers || [];
    const placedActions = window.currentRoutineData?.placedActions || [];
    
    // 首尾点不能删除
    if (index <= 0 || index >= markers.length - 1) {
        ToastManager.show('warning', '无法删除', '首尾标记点不能删除！', 1500);
        return;
    }
    
    // 检测左右线段是否有动作
    const leftSegmentHasAction = placedActions[index - 1] !== undefined; // 第 index-1 个槽位
    const rightSegmentHasAction = placedActions[index] !== undefined;     // 第 index 个槽位
    
    if (leftSegmentHasAction || rightSegmentHasAction) {
        let hint = '';
        if (leftSegmentHasAction) hint += `第 ${index} 个音乐段落 `;
        if (rightSegmentHasAction) hint += `第 ${index + 1} 个音乐段落 `;
        ToastManager.show('warning', '无法删除', `请先移除 ${hint}中的动作！`, 2000);
        return;
    }
    
    // 安全删除
    markers.splice(index, 1);
    updateTimelineUI();
    updateRoutineSlots();
    ToastManager.show('success', '已删除', `时间标记点已移除（该段落已合并）`, 1500);
};

// 7. 清空所有标记
window.clearAllMarkers = function() {
    if (!confirm('确定要清空所有标记点吗？')) return;
    
    const duration = AudioEngine ? AudioEngine.wavesurfer.getDuration() : 10;
    window.musicMarkers = [
        { time: 0, label: '开始' },
        { time: duration, label: '结束' }
    ];
    updateTimelineUI();
    updateRoutineSlots();
    ToastManager.show('info', '已清空', '所有标记点已移除', 1500);
};

// 🌟【核心重写】：全自动匹配算法，淘汰旧版拖拽
window.updateRoutineSlots = function() {
    const markers = window.musicMarkers || [{ time: 0, label: '开始' }];
    const maxSlots = Math.max(1, markers.length - 1); 
    const slotsContainer = document.getElementById('routineSlots');
    const filledSlotsEl = document.getElementById('filledSlots');
    const maxSlotsEl = document.getElementById('maxSlots');
    const completeHint = document.getElementById('completeHint');
    const confirmBtn = document.getElementById('confirmMusicArrangeBtn');
    const matchWarning = document.getElementById('actionMatchWarning');
    
    if (!slotsContainer) return;
    slotsContainer.innerHTML = ''; 
    
    // 🐛【致命Bug修复1】：使用 typeof 检查 const 变量，绕开 window 作用域陷阱！
    const activeTracks = (typeof canvasManager !== 'undefined' && canvasManager.tracks) ? canvasManager.tracks : [];
    const totalTracks = activeTracks.length;
    
    let placedActions = [];
    let filledCount = 0;

    for (let i = 0; i < maxSlots; i++) {
        const track = activeTracks[i];
        
        if (track) {
            filledCount++;
            let icon = '🎯', name = '未知动作';
            if (track.type === 'transit') {
                icon = '🚶‍♀️'; name = '移动路线';
            } else {
                icon = track.type === 'line' ? '📏' : (track.type === 'curve' ? '〰️' : '📍');
                name = track.skills?.map(s => s.nameZh?.[0] || '动作').join(' + ') || '空动作串';
            }
            
            placedActions.push({ id: track.id, trackIndex: i, name: name, icon: icon, category: track.type });

            slotsContainer.innerHTML += `
                <div class="p-2.5 rounded-xl border border-indigo-200 bg-indigo-50/70 text-indigo-900 shadow-sm text-xs flex items-center justify-between transition-all">
                    <div class="flex items-center gap-2 min-w-0">
                        <span class="w-5 h-5 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-[10px] shrink-0">${i + 1}</span>
                        <span class="text-base shrink-0">${icon}</span>
                        <span class="font-black truncate">${name}</span>
                    </div>
                    <span class="text-[9px] bg-indigo-100 text-indigo-600 font-bold px-1.5 py-0.5 rounded-full shrink-0">已自动匹配</span>
                </div>
            `;
        } else {
            slotsContainer.innerHTML += `
                <div class="p-2.5 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 text-slate-400 text-xs flex items-center gap-2 transition-all">
                    <span class="w-5 h-5 bg-slate-200 text-slate-400 rounded-full flex items-center justify-center font-bold text-[10px]">${i + 1}</span>
                    <span class="font-medium italic text-[11px]">等待画板输出第 ${i + 1} 个路线...</span>
                </div>
            `;
        }
    }

    if (window.currentRoutineData) window.currentRoutineData.placedActions = placedActions;

    if (filledSlotsEl) filledSlotsEl.textContent = filledCount;
    if (maxSlotsEl) maxSlotsEl.textContent = maxSlots;
    
    if (matchWarning) {
        const remaining = maxSlots - totalTracks;
        matchWarning.classList.remove('hidden');
        if (remaining > 0) {
            matchWarning.className = "text-[10px] text-orange-600 font-bold bg-orange-50 px-1.5 py-0.5 rounded truncate max-w-[180px]";
            matchWarning.innerText = `⚠️ 缺 ${remaining} 个动作`;
        } else if (totalTracks > maxSlots) {
            matchWarning.className = "text-[10px] text-red-600 font-bold bg-red-50 px-1.5 py-0.5 rounded truncate max-w-[180px]";
            matchWarning.innerText = `⚠️ 画板超标 ${totalTracks - maxSlots} 个`;
        } else {
            matchWarning.className = "text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded truncate max-w-[180px]";
            matchWarning.innerText = `✅ 完美匹配`;
        }
    }

    if (totalTracks > 0 && filledCount === maxSlots && totalTracks === maxSlots) {
        if (completeHint) completeHint.classList.add('hidden');
        if (confirmBtn) confirmBtn.classList.remove('hidden');
    } else {
        if (completeHint) completeHint.classList.remove('hidden');
        if (confirmBtn) confirmBtn.classList.add('hidden');
    }
};

// 9. 拖拽相关函数
window.allowDrop = function(e) {
    e.preventDefault();
};

// 拖拽进入槽位
window.dragOverSlot = function(e, slotIndex) {
    e.preventDefault();
    const slot = document.getElementById(`slot-${slotIndex}`);
    if (slot) {
        slot.classList.add('slot-drag-over');
    }
};

// 拖拽离开槽位
window.dragLeaveSlot = function(e, slotIndex) {
    const slot = document.getElementById(`slot-${slotIndex}`);
    if (slot) {
        slot.classList.remove('slot-drag-over');
    }
};

window.dropAction = function(e, slotIndex) {
    e.preventDefault();
    
    const markers = window.musicMarkers || [{ time: 0, label: '开始' }];
    const maxSlots = markers.length - 1;
    const placedActions = window.currentRoutineData?.placedActions || [];
    const totalTracks = canvasManager?.tracks?.length || 0;
    
    const trackIndexStr = e.dataTransfer.getData('text/plain');
    if (!trackIndexStr) {
        console.error('[拖拽调试] 未获取到轨迹数据');
        return;
    }
    
    const trackIndex = parseInt(trackIndexStr, 10);
    if (isNaN(trackIndex) || typeof canvasManager === 'undefined' || !canvasManager.tracks[trackIndex]) {
        console.error('[拖拽调试] 轨迹数据无效:', trackIndex);
        return;
    }

    const track = canvasManager.tracks[trackIndex];
    
    // 允许过渡类型，只检查是否有效（只要是canvasManager.tracks里的都可以拖）
    if (!track) {
        ToastManager.show('warning', '无效操作', '无效的轨迹！', 2000);
        return;
    }

    // 检查槽位是否已满（考虑当前槽位是否已被占用）
    const filledCount = placedActions.filter(Boolean).length;
    if (filledCount >= maxSlots && !placedActions[slotIndex]) {
        ToastManager.show('warning', '槽位已满', `当前只有 ${maxSlots} 个音乐段落。请在时间轴上按 [M] 添加更多标记点！`, 2500);
        return;
    }
    
    // 检查画板线条数量是否足够
    if (filledCount >= totalTracks) {
        ToastManager.show('warning', '线条不足', `画板上只有 ${totalTracks} 条动作线条。请先绘制更多动作，或减少音乐标记点！`, 2500);
        return;
    }
    
    // 根据动作类型确定图标
    let icon, name;
    if (track.type === 'transit') {
        // 过渡舞蹈类型
        icon = '🚶‍♀️';
        name = '移动路线';
    } else {
        // 常规类型
        const actionType = track.skills[0]?.category || track.type;
        const iconMap = {
            'vault': '📏',      // 技巧
            'jump': '〰️',       // 跳步
            'turn': '📍',       // 转体
            'dance': '🚶‍♀️',     // 过渡
            'line': '📏',       // 直线
            'curve': '〰️',     // 曲线
            'circle': '📍'      // 圆
        };
        icon = iconMap[actionType] || iconMap[track.type] || '🎯';
        name = track.skills.map(s => s.nameZh?.[0] || s.name || '动作').join(' + ');
    }
    
    const action = {
        id: track.id,
        trackIndex: trackIndex,
        name: name,
        icon: icon,
        category: track.type
    };
    
    // 检查是否已在其他槽位中存在
    const existingIndex = placedActions.findIndex(a => a && a.id === action.id);
    if (existingIndex !== -1 && existingIndex !== slotIndex) {
        ToastManager.show('warning', '已存在', `路线 ${trackIndex + 1} 已在第 ${existingIndex + 1} 个音乐段落中，请勿重复编排！`, 2000);
        return;
    }
    
    // 放置动作到槽位
    placedActions[slotIndex] = action;
    window.currentRoutineData.placedActions = placedActions;
    
    // 更新UI
    updateRoutineSlots();
    updateTimelineUI(); // 同时更新时间轴的呼吸动画状态
    
    ToastManager.show('success', '卡点成功', `${icon} 路线 ${trackIndex + 1} 已与音乐段落 ${slotIndex + 1} 绑定！`, 1500);
};

// 10. 从槽位移除动作
window.removeActionFromSlot = function(slotIndex) {
    const placedActions = window.currentRoutineData?.placedActions || [];
    if (!placedActions[slotIndex]) return; // 已经是空槽位
    
    const removedAction = placedActions[slotIndex];
    placedActions.splice(slotIndex, 1);
    window.currentRoutineData.placedActions = placedActions;
    
    // 更新两个UI
    updateRoutineSlots();
    updateTimelineUI(); // 恢复该段落的呼吸动画
    
    ToastManager.show('info', '已移除', `${removedAction.icon} 路线 ${removedAction.trackIndex + 1} 已解除绑定`, 1500);
};

// 11. 格式化时间
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
}

// 12. 确认编排完毕，进入第三阶段
// 确认编排完毕（纯粹的封存状态，不抢跑！）
window.confirmMusicArrange = function() {
    const placedActions = window.currentRoutineData?.placedActions || [];
    const totalTracks = (typeof canvasManager !== 'undefined' && canvasManager.tracks) ? canvasManager.tracks.length : 0;
    
    if (placedActions.length !== totalTracks) {
        if (typeof ToastManager !== 'undefined') ToastManager.show('warning', '未完全匹配', `请确保音乐打点数恰好包裹所有的动作！`, 3000);
        return;
    }
    
    // 将时间轴数据注入给画板路线
    const markers = window.musicMarkers || [];
    if (typeof canvasManager !== 'undefined' && canvasManager.tracks) {
        placedActions.forEach((action, i) => {
            const track = canvasManager.tracks[action.trackIndex];
            if (track && markers[i] && markers[i+1]) {
                track.audioSync = {
                    startTime: markers[i].time,
                    endTime: markers[i+1].time
                };
            }
        });
    }

    // 第二阶段彻底踩死刹车，声音归零
    if (window.AudioEngine && window.AudioEngine.wavesurfer) {
        window.AudioEngine.wavesurfer.pause();
        window.AudioEngine.wavesurfer.seekTo(0);
    }
    
    console.log('[音乐编排] ✅ 时间轴数据已硬连接，封存编排进入只读观赏准备态！');
    window.isInPhase3 = true; 
    
    // 1. 隐藏打点专用的底部抽屉和顶部提示条
    window.closeMusicDrawer();
    const phaseInfoBar = document.getElementById('phaseInfoBar');
    if (phaseInfoBar) phaseInfoBar.classList.add('hidden');
    
    // 2. 隐藏右侧打点框，恢复为最干净的“动作列表展示”
    document.getElementById('routineEditorBox')?.classList.add('hidden');
    document.getElementById('musicRoutineContent')?.classList.add('hidden');
    document.getElementById('normalRoutineHeader')?.classList.remove('hidden');
    document.getElementById('routineList')?.classList.remove('hidden');

    // 3. 确保第三阶段的观赏面板躲在屏幕外边，等用户按爆米花再弹出来
    const showcasePanel = document.getElementById('musicShowcaseControlPanel');
    if (showcasePanel) showcasePanel.classList.add('hidden');
    
    // 4. 🌟 灵魂大转折：立刻命令底部全局主按钮变成「🍿 开始观赏成套」！
    if (window.AppController && typeof window.AppController.applyViewingMode === 'function') {
        window.AppController.applyViewingMode(true); 
    }

    // 优雅提示，引导用户点击大按钮
    if (typeof ToastManager !== 'undefined') ToastManager.show('success', '编排已封存', '🎬 动作已全部锁定！\\n请点击底部「🍿 开始观赏成套」触发播放演示！', 4000);
};
// 🌟【新增特性】：监听画板动作更新，实时自动刷新右侧槽位！
const originalUpdateUIRoutineList = window.updateUIRoutineList;
window.updateUIRoutineList = function() {
    // 先执行原有的更新逻辑（保持原本左侧常规UI的更新）
    if (typeof originalUpdateUIRoutineList === 'function') {
        originalUpdateUIRoutineList.apply(this, arguments);
    }
    // 如果我们当前正处于“音乐编排第二阶段”，顺便让音乐槽位也跟着刷新
    const routineEditorBox = document.getElementById('routineEditorBox');
    if (routineEditorBox && !routineEditorBox.classList.contains('hidden')) {
        if (typeof window.updateRoutineSlots === 'function') window.updateRoutineSlots();
    }
};

// 退出并清空当前编排状态
window.clearAllArrangementAndExit = function() {
    window.musicMarkers = [];
    if (window.currentRoutineData) {
        window.currentRoutineData.musicMarkers = [];
        window.currentRoutineData.placedActions = [];
    }
    window.closeMusicDrawer();
    const checkbox = document.getElementById('musicModeToggle');
    if (checkbox) checkbox.checked = false;
    window.isInPhase3 = false;
    updateMusicModeButtonState();
    
    document.getElementById('normalRoutineHeader').classList.remove('hidden');
    document.getElementById('routineList').classList.remove('hidden');
    document.getElementById('routineEditorBox').classList.add('hidden');
    document.getElementById('musicRoutineContent').classList.add('hidden');
    
    ToastManager.show('info', '已退出', '自动对齐数据已清空，返回普通画板模式！', 2000);
};

// ═══════════════════════════════════════════════════════════════════════════
// 【按钮状态管理函数】：根据三个阶段动态切换按钮文字和行为
// 阶段1（无音乐）：显示"✅ 完成编排并计算最终成绩"
// 阶段2（有音乐未完成编排）：显示"⏳ 正在进行音乐编排，请完成后再欣赏成套"
// 阶段3（已完成编排）：显示"🍿 欣赏成套"
// ═══════════════════════════════════════════════════════════════════════════
window.updateMusicModeButtonState = function() {
    const finishBtn = document.getElementById('finishRoutineBtn');
    if (!finishBtn) return;
    
    const hasMusic = window.currentRoutineData && (window.currentRoutineData.musicId || window.currentRoutineData.musicUrl);
    const isInPhase3 = window.isInPhase3;
    
    if (isInPhase3) {
        // 第三阶段：显示"欣赏成套"按钮
        finishBtn.innerHTML = '🍿 欣赏成套';
        finishBtn.onclick = function() {
            startMusicShowcasePhase3();
        };
    } else if (hasMusic) {
        // 第一二阶段：显示提示文字
        finishBtn.innerHTML = '⏳ 正在进行音乐编排，请完成后再欣赏成套';
        finishBtn.onclick = function() {
            ToastManager.show('info', '请先完成编排', '请先完成音乐编排，点击「确认编排完毕」后再欣赏成套！', 2000);
        };
    } else {
        // 默认：恢复原按钮
        finishBtn.innerHTML = '✅ 完成编排并计算最终成绩';
        finishBtn.onclick = function() {
            saveRoutine();
        };
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// 【音乐同步展示入口函数】：第三阶段入口
// 触发场景：点击"🍿 欣赏成套"按钮（仅在 isInPhase3=true 时显示）
// 调用链：startMusicShowcasePhase3 → canvasManager.playMusicSyncShowcase → E分面板
// 作用：隐藏工具按钮 → 调用音乐同步展示 → 展示完成后显示E分
// ═══════════════════════════════════════════════════════════════════════════
window.startMusicShowcasePhase3 = function() {
    ToastManager.show('info', '🎬 开始展示', '正在播放音乐同步展示！', 2000);
    
    // 隐藏所有工具按钮
    const drawingToolsWrapper = document.getElementById('drawingToolsWrapper');
    const dragHintBar = document.getElementById('dragHintBar');
    if (drawingToolsWrapper) drawingToolsWrapper.classList.add('hidden');
    if (dragHintBar) dragHintBar.classList.add('hidden');
    
    // 初始化控制面板
    initShowcaseControlPanel();
    
    // 调用音乐同步展示函数（传递控制函数）
    if (canvasManager && typeof canvasManager.playMusicSyncShowcase === 'function') {
        canvasManager.playMusicSyncShowcase({
            onProgress: updateShowcaseProgress,
            onPause: onShowcasePaused,
            onResume: onShowcaseResumed,
            onSegmentChange: updateShowcaseSegment,
            onComplete: onShowcaseComplete,
            onSpeedChange: onShowcaseSpeedChange
        });
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// 【展示控制面板初始化】：设置初始状态
// ═══════════════════════════════════════════════════════════════════════════
window.initShowcaseControlPanel = function() {
    // 重置播放状态
    window.showcaseIsPlaying = true;
    window.showcaseIsPaused = false;
    window.showcaseSpeed = 1;
    
    // 获取总时长
    const duration = AudioEngine && AudioEngine.wavesurfer ? 
                     AudioEngine.wavesurfer.getDuration() : 90;
    
    // 更新时间显示
    const totalTimeEl = document.getElementById('showcaseTotalTime');
    if (totalTimeEl) totalTimeEl.textContent = formatTime(duration);
    
    // 重置播放按钮
    const playPauseBtn = document.getElementById('showcasePlayPauseBtn');
    if (playPauseBtn) playPauseBtn.innerHTML = '⏸';
    
    // 重置倍速按钮状态
    updateSpeedButtons(1);
    
    // 重置进度
    updateShowcaseProgress(0, duration);
    updateShowcaseSegment(1, 1, null);
}

// ═══════════════════════════════════════════════════════════════════════════
// 【更新展示进度】：音乐播放时实时更新进度条
// ═══════════════════════════════════════════════════════════════════════════
window.updateShowcaseProgress = function(currentTime, totalDuration) {
    const progressPercent = (currentTime / totalDuration) * 100;
    
    // 更新音频进度条
    const audioProgress = document.getElementById('showcaseAudioProgress');
    if (audioProgress) audioProgress.style.width = `${progressPercent}%`;
    
    // 更新拖动手柄位置
    const seekHandle = document.getElementById('showcaseSeekHandle');
    if (seekHandle) seekHandle.style.left = `${progressPercent}%`;
    
    // 更新时间显示
    const currentTimeEl = document.getElementById('showcaseCurrentTime');
    if (currentTimeEl) currentTimeEl.textContent = formatTime(currentTime);
    
    // 更新段落进度（如果有的话）
    const markers = window.musicMarkers || [];
    const placedActions = window.currentRoutineData?.placedActions || [];
    
    for (let i = 0; i < markers.length - 1; i++) {
        const startTime = markers[i].time;
        const endTime = markers[i + 1].time;
        
        if (currentTime >= startTime && currentTime < endTime) {
            const segmentDuration = endTime - startTime;
            const segmentProgress = ((currentTime - startTime) / segmentDuration) * 100;
            
            // 更新段落进度
            const segmentProgressEl = document.getElementById('showcaseSegmentProgress');
            if (segmentProgressEl) segmentProgressEl.style.width = `${segmentProgress}%`;
            
            // 更新时间
            const segmentTimeEl = document.getElementById('showcaseSegmentTime');
            if (segmentTimeEl) segmentTimeEl.textContent = formatTime(currentTime - startTime);
            
            const segmentDurationEl = document.getElementById('showcaseSegmentDuration');
            if (segmentDurationEl) segmentDurationEl.textContent = formatTime(segmentDuration);
            
            break;
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// 【更新段落信息】：当播放到新段落时更新显示
// ═══════════════════════════════════════════════════════════════════════════
window.updateShowcaseSegment = function(segmentIndex, totalSegments, action) {
    const currentSegmentEl = document.getElementById('showcaseCurrentSegment');
    if (currentSegmentEl) currentSegmentEl.textContent = `${segmentIndex}/${totalSegments}`;
    
    const currentTrackEl = document.getElementById('showcaseCurrentTrack');
    if (currentTrackEl) {
        if (action) {
            currentTrackEl.textContent = `${action.icon} 路线${action.trackIndex + 1}`;
        } else {
            currentTrackEl.textContent = '⏸️ 空段落';
        }
    }
    
    // 重置段落进度
    const segmentProgress = document.getElementById('showcaseSegmentProgress');
    if (segmentProgress) segmentProgress.style.width = '0%';
}


// ═══════════════════════════════════════════════════════════════════════════
// 【暂停展示】
// ═══════════════════════════════════════════════════════════════════════════
window.pauseShowcase = function() {
    window.showcaseIsPaused = true;
    
    // 暂停音乐
    if (AudioEngine && AudioEngine.wavesurfer) {
        AudioEngine.wavesurfer.pause();
    }
    
    // 暂停画板动画
    if (canvasManager && canvasManager.pauseAnimation) {
        canvasManager.pauseAnimation();
    }
    
    // 更新按钮
    const playPauseBtn = document.getElementById('showcasePlayPauseBtn');
    if (playPauseBtn) playPauseBtn.innerHTML = '▶';
    
    ToastManager.show('info', '已暂停', '音乐展示已暂停，点击▶继续', 1000);
}

// ═══════════════════════════════════════════════════════════════════════════
// 【继续播放】
// ═══════════════════════════════════════════════════════════════════════════
window.resumeShowcase = function() {
    window.showcaseIsPaused = false;
    
    // 继续播放音乐
    if (AudioEngine && AudioEngine.wavesurfer) {
        AudioEngine.wavesurfer.play();
    }
    
    // 继续画板动画
    if (canvasManager && canvasManager.resumeAnimation) {
        canvasManager.resumeAnimation();
    }
    
    // 更新按钮
    const playPauseBtn = document.getElementById('showcasePlayPauseBtn');
    if (playPauseBtn) playPauseBtn.innerHTML = '⏸';
    
    ToastManager.show('info', '继续播放', '音乐展示继续中...', 1000);
}

// ═══════════════════════════════════════════════════════════════════════════
// 【设置播放倍速】
// ═══════════════════════════════════════════════════════════════════════════
window.setShowcaseSpeed = function(speed) {
    window.showcaseSpeed = speed;
    
    // 设置音乐倍速
    if (AudioEngine && AudioEngine.wavesurfer) {
        AudioEngine.wavesurfer.setPlaybackRate(speed);
    }
    
    // 更新按钮状态
    updateSpeedButtons(speed);
    
    ToastManager.show('info', '倍速设置', `播放速度: ${speed}x`, 1000);
}

// ═══════════════════════════════════════════════════════════════════════════
// 【更新倍速按钮状态】
// ═══════════════════════════════════════════════════════════════════════════
window.updateSpeedButtons = function(activeSpeed) {
    const speeds = [1, 1.5, 2];
    speeds.forEach(speed => {
        const btn = document.getElementById(`speed${speed}Btn`);
        if (btn) {
            if (speed === activeSpeed) {
                btn.className = 'px-2 py-1 text-[10px] font-bold bg-indigo-600 text-white rounded transition-colors';
            } else {
                btn.className = 'px-2 py-1 text-[10px] font-bold bg-slate-700 hover:bg-slate-600 text-slate-400 rounded transition-colors';
            }
        }
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// 【跳到指定时间】
// ═══════════════════════════════════════════════════════════════════════════
window.seekShowcase = function(event) {
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percent = clickX / rect.width;
    
    // 获取总时长
    const duration = AudioEngine && AudioEngine.wavesurfer ? 
                     AudioEngine.wavesurfer.getDuration() : 90;
    const seekTime = percent * duration;
    
    // 跳转到指定时间
    if (AudioEngine && AudioEngine.wavesurfer) {
        AudioEngine.wavesurfer.seekTo(percent);
    }
    
    // 更新画板动画（根据新时间计算当前段落）
    if (canvasManager && canvasManager.seekAnimation) {
        canvasManager.seekAnimation(seekTime);
    }
    
    // 更新进度显示
    updateShowcaseProgress(seekTime, duration);
    
    // 找到当前段落并更新
    const markers = window.musicMarkers || [];
    const placedActions = window.currentRoutineData?.placedActions || [];
    
    for (let i = 0; i < markers.length - 1; i++) {
        if (seekTime >= markers[i].time && seekTime < markers[i + 1].time) {
            updateShowcaseSegment(i + 1, markers.length - 1, placedActions[i]);
            break;
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// 【开始拖动（鼠标按下）】
// ═══════════════════════════════════════════════════════════════════════════
window.startShowcaseSeek = function(event) {
    window.showcaseIsSeeking = true;
    seekShowcase(event);
}

// ═══════════════════════════════════════════════════════════════════════════
// 【更新拖动预览（鼠标移动）】
// ═══════════════════════════════════════════════════════════════════════════
window.updateShowcaseSeekPreview = function(event) {
    if (!window.showcaseIsSeeking) return;
    
    seekShowcase(event);
}

// ═══════════════════════════════════════════════════════════════════════════
// 【结束拖动（鼠标松开）】
// ═══════════════════════════════════════════════════════════════════════════
window.endShowcaseSeek = function(event) {
    if (window.showcaseIsSeeking) {
        window.showcaseIsSeeking = false;
        // 确保最后一次拖动生效
        seekShowcase(event);
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// 【跳过下一个段落】
// ═══════════════════════════════════════════════════════════════════════════
window.skipNextSegment = function() {
    const markers = window.musicMarkers || [];
    const currentTime = AudioEngine && AudioEngine.wavesurfer ? 
                        AudioEngine.wavesurfer.getCurrentTime() : 0;
    
    // 找到下一个段落的起始时间
    for (let i = 0; i < markers.length - 1; i++) {
        if (currentTime < markers[i + 1].time) {
            // 跳到下一个段落
            if (AudioEngine && AudioEngine.wavesurfer) {
                const duration = AudioEngine.wavesurfer.getDuration();
                AudioEngine.wavesurfer.seekTo(markers[i + 1].time / duration);
            }
            
            // 更新画板动画
            if (canvasManager && canvasManager.seekAnimation) {
                canvasManager.seekAnimation(markers[i + 1].time);
            }
            
            // 更新进度
            updateShowcaseProgress(markers[i + 1].time, 
                                  AudioEngine && AudioEngine.wavesurfer ? 
                                  AudioEngine.wavesurfer.getDuration() : 90);
            
            ToastManager.show('info', '已跳过', `已跳到第 ${i + 2} 个段落`, 1000);
            return;
        }
    }
    
    // 如果已经在最后一个段落，跳到结尾
    ToastManager.show('info', '提示', '已在最后一个段落', 1000);
}

// ═══════════════════════════════════════════════════════════════════════════
// 【跳过整个展示】
// ═══════════════════════════════════════════════════════════════════════════
window.skipShowcase = function() {
    if (confirm('确定要跳过展示吗？将直接显示E分结果。')) {
        // 停止音乐
        if (AudioEngine && AudioEngine.wavesurfer) {
            AudioEngine.wavesurfer.pause();
        }
        
        // 停止动画
        if (canvasManager) {
            canvasManager.stopAnimation();
        }
        
        // 显示E分
        const eReport = window.currentEScoreReport;
        if (eReport) {
            if (window.AppController && typeof window.AppController.showFinalScoreBoard === 'function') {
                window.AppController.showFinalScoreBoard();
            } else if (typeof showFinalScoreBoard === 'function') {
                showFinalScoreBoard();
            }
        }
        
        ToastManager.show('info', '已跳过', '已跳过展示，直接显示结果', 1000);
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// 【重新播放】
// ═══════════════════════════════════════════════════════════════════════════
window.replayShowcase = function() {
    // 停止当前播放
    if (AudioEngine && AudioEngine.wavesurfer) {
        AudioEngine.wavesurfer.pause();
        AudioEngine.wavesurfer.seekTo(0);
    }
    
    // 停止画板动画
    if (canvasManager) {
        canvasManager.stopAnimation();
    }
    
    // 重新开始
    ToastManager.show('info', '重新播放', '正在重新播放...', 1000);
    
    // 重新初始化并播放
    initShowcaseControlPanel();
    startMusicShowcasePhase3();
}

// ═══════════════════════════════════════════════════════════════════════════
// 【展示暂停回调】
// ═══════════════════════════════════════════════════════════════════════════
window.onShowcasePaused = function() {
    const playPauseBtn = document.getElementById('showcasePlayPauseBtn');
    if (playPauseBtn) playPauseBtn.innerHTML = '▶';
}

// ═══════════════════════════════════════════════════════════════════════════
// 【展示继续回调】
// ═══════════════════════════════════════════════════════════════════════════
window.onShowcaseResumed = function() {
    const playPauseBtn = document.getElementById('showcasePlayPauseBtn');
    if (playPauseBtn) playPauseBtn.innerHTML = '⏸';
}

// ═══════════════════════════════════════════════════════════════════════════
// 【展示完成回调】
// ═══════════════════════════════════════════════════════════════════════════
window.onShowcaseComplete = function() {
    console.log('[音乐编排] ✅ 音乐同步展示完成！');
    
    // 重置播放按钮
    const playPauseBtn = document.getElementById('showcasePlayPauseBtn');
    if (playPauseBtn) playPauseBtn.innerHTML = '▶';
    
    // 显示E分面板（只有第三阶段才显示）
    const eReport = window.currentEScoreReport;
    if (eReport) {
        console.log('[音乐编排] 使用已有E分:', eReport.finalEScore);
        if (window.AppController && typeof window.AppController.showFinalScoreBoard === 'function') {
            window.AppController.showFinalScoreBoard();
        } else if (typeof showFinalScoreBoard === 'function') {
            showFinalScoreBoard();
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// 【倍速改变回调】
// ═══════════════════════════════════════════════════════════════════════════
window.onShowcaseSpeedChange = function(speed) {
    // 倍速改变时更新按钮状态
    updateSpeedButtons(speed);
}

// ═══════════════════════════════════════════════════════════════════════════
// 【工具函数：格式化时间显示】
// 输入：秒数（如 90.5）
// 输出：字符串（如 "1:30"）
// ═══════════════════════════════════════════════════════════════════════════
window.formatTime = function(seconds) {
    if (isNaN(seconds) || seconds < 0) seconds = 0;
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ═══════════════════════════════════════════════════════════════════════════
// 【工具函数：限制小数点位数】
// ═══════════════════════════════════════════════════════════════════════════
window.limitDecimalPlaces = function(input, maxDecimals) {
    if (!input || !input.value) return;
    
    let value = input.value.toString();
    
    // 移除非数字字符（除了小数点）
    value = value.replace(/[^\d.]/g, '');
    
    // 只保留第一个小数点
    const parts = value.split('.');
    if (parts.length > 2) {
        value = parts[0] + '.' + parts.slice(1).join('');
    }
    
    // 限制小数位数
    if (parts.length === 2 && parts[1].length > maxDecimals) {
        value = parts[0] + '.' + parts[1].substring(0, maxDecimals);
    }
    
    input.value = value;
}

// ═══════════════════════════════════════════════════════════════════════════
// 【展示控制面板收起/拉出切换】
// ═══════════════════════════════════════════════════════════════════════════
// =========================================================================
// 🎬 第三阶段：音乐展示面板 (满血交互与桥接逻辑)
// =========================================================================

window.toggleShowcasePanel = function() {
    const content = document.getElementById('showcasePanelContent');
    const toggleBtn = document.getElementById('showcasePanelToggle');
    if (content) {
        if (content.classList.contains('translate-x-full')) {
            content.classList.remove('translate-x-full');
            if (toggleBtn) toggleBtn.innerHTML = '▶';
        } else {
            content.classList.add('translate-x-full');
            if (toggleBtn) toggleBtn.innerHTML = '◀';
        }
    }
};

window.toggleShowcasePlayPause = function() {
    const btn = document.getElementById('showcasePlayPauseBtn');
    const ws = window.AudioEngine?.wavesurfer;
    if (!ws) return;

    if (ws.isPlaying()) {
        if (canvasManager && typeof canvasManager.pauseAnimation === 'function') canvasManager.pauseAnimation();
        else ws.pause();
        if (btn) btn.innerHTML = '▶';
    } else {
        if (canvasManager && typeof canvasManager.resumeAnimation === 'function') canvasManager.resumeAnimation();
        else ws.play();
        if (btn) btn.innerHTML = '⏸';
    }
};

// 🌟 新增：快进/快退功能
window.seekShowcaseOffset = function(offsetSec) {
    if (!window.AudioEngine || !window.AudioEngine.wavesurfer) return;
    const ws = window.AudioEngine.wavesurfer;
    const duration = ws.getDuration() || 1;
    let newTime = ws.getCurrentTime() + offsetSec;
    newTime = Math.max(0, Math.min(newTime, duration));
    ws.seekTo(newTime / duration);
    if (canvasManager && typeof canvasManager.redrawBasedOnTime === 'function') {
        canvasManager.redrawBasedOnTime(newTime); // 让光点瞬间瞬移跟上！
    }
};

// 🌟 新增：点方块直接跳段落功能
window.jumpToShowcaseSegment = function(idx) {
    const markers = window.musicMarkers || [];
    if (markers[idx] && window.AudioEngine?.wavesurfer) {
        const ws = window.AudioEngine.wavesurfer;
        const duration = ws.getDuration() || 1;
        ws.seekTo(markers[idx].time / duration);
        if (canvasManager && typeof canvasManager.redrawBasedOnTime === 'function') {
            canvasManager.redrawBasedOnTime(markers[idx].time); // 光点跳跃
        }
    }
};

// 5. 接管文件上传事件 (事件监听员)
document.addEventListener('DOMContentLoaded', () => {
    const uploader = document.getElementById('audioUploader');
    if (uploader) {
        uploader.addEventListener('change', async function(e) {
            const file = e.target.files[0];
            if (!file) return;

            // 拦截文件，交给 MusicManager 验证大小并存入数据库
            const record = await MusicManager.saveAudio(file);
            if (record) {
                // 上传成功后，立刻刷新底部的音乐列表
                renderLocalMusicList(); 
            }
            
            // 清空 input，允许用户重复选择同一个文件
            e.target.value = ''; 
        });
    }
});

// =========================================================================
// 🌟 终极智能生命周期绑定 (替换你文件最底部的 DOMContentLoaded 监听块)
// =========================================================================
function bindMusicFlowElements() {
    const checkbox = document.getElementById('musicModeToggle');
    const drawer = document.getElementById('musicDrawer');
    
    if (checkbox) {
        // 🔒【防呆拦截器】：如果用户收起了面板，再次点击侧边栏开关，意图是“摇上来”而不是“关闭模式”
        checkbox.addEventListener('click', function(e) {
            if (!this.checked && drawer && drawer.classList.contains('translate-y-full')) {
                e.preventDefault();       // 🛑 拦截关闭行为！
                this.checked = true;       // 强行保持勾选状态
                if (typeof window.openMusicDrawer === 'function') {
                    window.openMusicDrawer(); // 直接把抽屉从地下拉出来弹起！
                }
                console.log("[音乐模式] 检测到抽屉处于隐藏状态，已拦截关闭行为，改为弹起抽屉。");
            }
        });

        // 常规状态切换
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                console.log("[音乐模式] 🎵 唤醒音乐控制中心");
                if (typeof window.openMusicDrawer === 'function') window.openMusicDrawer();
            } else {
                if (typeof window.clearAllArrangementAndExit === 'function') window.clearAllArrangementAndExit();
            }
        });
    }

    // 绑定底部手柄可拖拽调整面板高度的逻辑（保持你原本的代码）
    const resizeHandle = document.getElementById('musicEditorResizeHandle');
    if (resizeHandle) {
        resizeHandle.addEventListener('mousedown', initResize);
        resizeHandle.addEventListener('touchstart', initResize, { passive: true });
    }
}

// 确保在任何生命周期下都能正确加载绑定
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindMusicFlowElements);
} else {
    bindMusicFlowElements();
}

// ==========================================
// 🎛️ 界面收起/展开功能
// ==========================================

// 收起/展开时间轴编辑器
window.toggleTimelineEditor = function() {
    console.log("[音乐模式调试] toggleTimelineEditor 被调用");
    const content = document.getElementById('timelineContent');
    const toggle = document.getElementById('timelineEditorToggle');
    console.log("[音乐模式调试] timelineContent:", content);
    console.log("[音乐模式调试] timelineEditorToggle:", toggle);
    
    if (content && toggle) {
        if (content.classList.contains('hidden')) {
            content.classList.remove('hidden');
            toggle.innerHTML = '▼';
            console.log("[音乐模式调试] 时间轴编辑器已展开");
        } else {
            content.classList.add('hidden');
            toggle.innerHTML = '▶';
            console.log("[音乐模式调试] 时间轴编辑器已收起");
        }
    } else {
        console.error("[音乐模式调试] 无法找到 timelineContent 或 timelineEditorToggle 元素");
    }
};

// 收起/展开编排框
window.toggleRoutineEditor = function() {
    console.log("[音乐模式调试] toggleRoutineEditor 被调用");
    const content = document.getElementById('routineContent');
    const toggle = document.getElementById('routineEditorToggle');
    console.log("[音乐模式调试] routineContent:", content);
    console.log("[音乐模式调试] routineEditorToggle:", toggle);
    
    if (content && toggle) {
        if (content.classList.contains('hidden')) {
            content.classList.remove('hidden');
            toggle.innerHTML = '▼';
            console.log("[音乐模式调试] 编排框已展开");
        } else {
            content.classList.add('hidden');
            toggle.innerHTML = '▶';
            console.log("[音乐模式调试] 编排框已收起");
        }
    } else {
        console.error("[音乐模式调试] 无法找到 routineContent 或 routineEditorToggle 元素");
    }
};

// ==========================================
// 🎚️ 可拖动调整音乐编辑面板大小
// ==========================================
(function() {
    let isResizing = false;
    let startY = 0;
    let startHeight = 0;
    let musicEditorPanel = null;
    
    // 初始化拖动功能
    function initResizeHandle() {
        const handle = document.getElementById('musicEditorResizeHandle');
        if (!handle) return;
        
        // 找到包含时间轴编辑器和编排框的父容器
        const timelineEditor = document.getElementById('timelineEditor');
        const routineEditorBox = document.getElementById('routineEditorBox');
        
        // 如果父容器不存在，我们创建一个或者直接调整这两个元素的大小
        musicEditorPanel = {
            timelineEditor: timelineEditor,
            routineEditorBox: routineEditorBox
        };
        
        handle.addEventListener('mousedown', startResize);
        handle.addEventListener('touchstart', startResize, { passive: false });
    }
    
    function startResize(e) {
        e.preventDefault();
        isResizing = true;
        
        // 获取起始位置
        if (e.type === 'touchstart') {
            startY = e.touches[0].clientY;
        } else {
            startY = e.clientY;
        }
        
        // 记录当前高度（用 padding 来调整）
        if (musicEditorPanel.timelineEditor) {
            startHeight = parseInt(window.getComputedStyle(musicEditorPanel.timelineEditor).paddingTop) || 12;
        }
        
        // 添加事件监听
        document.addEventListener('mousemove', doResize);
        document.addEventListener('touchmove', doResize, { passive: false });
        document.addEventListener('mouseup', stopResize);
        document.addEventListener('touchend', stopResize);
        
        // 添加视觉反馈
        const handle = document.getElementById('musicEditorResizeHandle');
        if (handle) handle.classList.add('bg-slate-300');
    }
    
    function doResize(e) {
        if (!isResizing) return;
        e.preventDefault();
        
        let currentY;
        if (e.type === 'touchmove') {
            currentY = e.touches[0].clientY;
        } else {
            currentY = e.clientY;
        }
        
        const deltaY = startY - currentY;
        
        // 调整时间轴编辑器的 padding（让它看起来更紧凑或更大）
        if (musicEditorPanel.timelineEditor) {
            const newPadding = Math.max(4, Math.min(24, startHeight + deltaY * 0.3));
            musicEditorPanel.timelineEditor.style.padding = `${newPadding}px`;
        }
        
        // 调整编排框的 padding
        if (musicEditorPanel.routineEditorBox) {
            const newPadding = Math.max(4, Math.min(24, startHeight + deltaY * 0.3));
            musicEditorPanel.routineEditorBox.style.padding = `${newPadding}px`;
        }
    }
    
    function stopResize() {
        isResizing = false;
        
        // 移除事件监听
        document.removeEventListener('mousemove', doResize);
        document.removeEventListener('touchmove', doResize);
        document.removeEventListener('mouseup', stopResize);
        document.removeEventListener('touchend', stopResize);
        
        // 移除视觉反馈
        const handle = document.getElementById('musicEditorResizeHandle');
        if (handle) handle.classList.remove('bg-slate-300');
    }
    
    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initResizeHandle);
    } else {
        initResizeHandle();
    }
})();

// =========================================================================
// 🎬 第三阶段：音乐展示面板 UI 交互与桥接逻辑
// =========================================================================

// 面板侧滑拉出/收起
window.toggleShowcasePanel = function() {
    const content = document.getElementById('showcasePanelContent');
    const toggleBtn = document.getElementById('showcasePanelToggle');
    
    if (content) {
        if (content.classList.contains('translate-x-full')) {
            content.classList.remove('translate-x-full');
            if (toggleBtn) toggleBtn.innerHTML = '▶';
        } else {
            content.classList.add('translate-x-full');
            if (toggleBtn) toggleBtn.innerHTML = '◀';
        }
    }
};

// 核心初始化：唤醒第三阶段全功能控制台
window.initShowcaseControlPanel = function() {
    const content = document.getElementById('showcasePanelContent');
    const toggleBtn = document.getElementById('showcasePanelToggle');
    if (content) content.classList.remove('translate-x-full');
    if (toggleBtn) toggleBtn.innerHTML = '▶';
    
    const playBtn = document.getElementById('showcasePlayPauseBtn');
    if (playBtn) playBtn.innerHTML = '▶'; // 🌟 初始设置为暂停态播放图标

    // 动态生成网格按钮（保持原样）
    const grid = document.getElementById('showcaseSegmentGrid');
    const placedActions = window.currentRoutineData?.placedActions || [];
    if (grid) {
        grid.innerHTML = '';
        placedActions.forEach((action, i) => {
            grid.innerHTML += `<button id="segBtn_${i}" onclick="jumpToShowcaseSegment(${i})" class="text-[11px] font-black py-1 bg-slate-100 text-slate-500 rounded hover:bg-indigo-100 hover:text-indigo-600 transition-colors shadow-sm border border-slate-200/50">${i+1}</button>`;
        });
    }

    const formatTime = (sec) => {
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    // 绑定全新静默开机的卡点展示引擎
    if (canvasManager && typeof canvasManager.playMusicSyncShowcase === 'function') {
        canvasManager.playMusicSyncShowcase({
            onProgress: (currentTime, totalTime) => {
                document.getElementById('showcaseCurrentTime').innerText = formatTime(currentTime);
                document.getElementById('showcaseTotalTime').innerText = formatTime(totalTime);
                if (totalTime > 0) document.getElementById('showcaseAudioProgress').style.width = `${(currentTime/totalTime)*100}%`;
            },
            onSegmentChange: (current, total, action) => {
                document.getElementById('showcaseCurrentSegment').innerText = `${current}/${total}`;
                document.getElementById('showcaseCurrentTrack').innerText = action ? (action.icon + ' ' + action.name) : '🏃 过渡 / 准备';
                document.getElementById('showcaseSegmentProgress').style.width = `${(current/total)*100}%`;
                
                for(let i=0; i<total; i++) {
                    const btn = document.getElementById(`segBtn_${i}`);
                    if(btn) {
                        if (i === current - 1) {
                            btn.className = "text-[11px] font-black py-1 bg-indigo-500 text-white rounded border border-indigo-600 transition-colors shadow-sm";
                        } else {
                            btn.className = "text-[11px] font-black py-1 bg-slate-100 text-slate-500 rounded hover:bg-indigo-100 hover:text-indigo-600 transition-colors shadow-sm border border-slate-200/50";
                        }
                    }
                }
            },
            onPause: () => { if (playBtn) playBtn.innerHTML = '▶'; },
            onResume: () => { if (playBtn) playBtn.innerHTML = '⏸'; },
            onComplete: () => {
                if (playBtn) playBtn.innerHTML = '▶';
                document.getElementById('showcaseAudioProgress').style.width = '100%';
                // 🎬 展示圆满结束，在这里才会优雅召唤出最终的 E分/扣分 结算报告面板！
                if (typeof showFinishScoreReport === 'function') {
                    showFinishScoreReport();
                }
            }
        });
        
        // ❌ 【大快人心】：彻底删掉原来的 setTimeout 强制踩刹车脏代码！
        // 现在的引擎初始化完就是绝对静止的，根本不会发生任何卡死和线程冲突！
    }
};

// =========================================================================
// 🌟【逆向流转引擎】：从第三阶段全自动回滚到第二阶段重新打点编排
// =========================================================================
window.returnToPhase2 = function() {
    console.log("%c[状态机逆向] 🔄 观赏中止！正在撕毁完结标签，回滚至第二阶段...", "color: white; background: #ea580c; font-size: 12px;");
    
    // 1. 掐断当前画布上可能正在狂奔的 2D 动画帧，并强制让音频归零重置
    if (typeof canvasManager !== 'undefined' && typeof canvasManager.stopAnimation === 'function') {
        canvasManager.stopAnimation();
    }
    if (window.AudioEngine && window.AudioEngine.wavesurfer) {
        window.AudioEngine.wavesurfer.pause();
        window.AudioEngine.wavesurfer.seekTo(0); 
    }
    
    // 2. 隐藏右侧的第三阶段观赏面板
    const showcasePanel = document.getElementById('musicShowcaseControlPanel');
    if (showcasePanel) showcasePanel.classList.add('hidden');
    
    // 3. 🚨 灵魂抹除：撕掉当前运行时的 placedActions 完结证章！
    // 这一步是告诉分流器：它现在又是一个可以随意蹂躏、可以重新画线打点的“未完结草稿”了！
    if (window.currentRoutineData) {
        window.currentRoutineData.placedActions = null; 
    }
    
    // 4. 正式唤醒底部的第二阶段时间轴和打点抽屉
    if (typeof window.enterArrangementPhase === 'function') {
        window.enterArrangementPhase(true); // 传入 true，让它自动更新并对齐最新的画板路线
    }
    
    // 5. 将工作台按钮由只读观赏态变回编辑编制态（“完成编排并计算最终成绩”）
    if (window.AppController && typeof window.AppController.applyViewingMode === 'function') {
        window.AppController.applyViewingMode(false); 
    }
    
    ToastManager.show('info', '已回到打点编辑阶段', '📂 编制锁已解除！您可以继续在场地上补线、按 [M] 修改音乐卡点时间轴。', 3000);
};