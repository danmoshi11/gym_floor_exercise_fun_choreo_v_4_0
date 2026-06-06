// ==========================================
// 🎵 音乐模式流转控制器 (严格防呆 + 状态解耦)
// ==========================================

// 关闭音乐抽屉（不退出音乐模式）
window.closeMusicDrawer = function() {
    console.log("%c[音乐模式调试] 🔽 关闭音乐抽屉", "color: white; background: #f59e0b; font-size: 12px;");
    const drawer = document.getElementById('musicDrawer');
    if (drawer) {
        drawer.classList.add('translate-y-full');
    }
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
        
        // ✨ 检查是否已经有绑定的音乐
        if (window.currentRoutineData && (window.currentRoutineData.musicId || window.currentRoutineData.musicUrl)) {
            console.log("[音乐模式调试] 已绑定音乐，直接显示编辑界面，不显示曲库");
            
            // 隐藏曲库列表，显示重新选择按钮
            const libraryList = document.getElementById('musicLibraryList');
            const reselectBtn = document.getElementById('reselectMusicBtn');
            const libraryTitle = document.getElementById('libraryTitle');
            const musicActionButtons = document.getElementById('musicActionButtons');
            const confirmBtn = document.getElementById('musicConfirmBtn');
            const timelineEditor = document.getElementById('timelineEditor');
            const routineEditorBox = document.getElementById('routineEditorBox');
            
            if (libraryList) libraryList.classList.add('hidden');
            if (reselectBtn) reselectBtn.classList.remove('hidden');
            if (libraryTitle) libraryTitle.innerText = '🎵 可用曲库中心';
            if (musicActionButtons) musicActionButtons.classList.remove('hidden');
            if (confirmBtn) confirmBtn.classList.add('hidden');
            if (timelineEditor) timelineEditor.classList.remove('hidden');
            if (routineEditorBox) routineEditorBox.classList.remove('hidden');
            
            // 加载已有的音乐标记
            if (window.currentRoutineData.musicMarkers) {
                window.musicMarkers = JSON.parse(JSON.stringify(window.currentRoutineData.musicMarkers));
                updateTimelineUI();
            }
            
            // 加载音乐
            if (window.currentRoutineData.musicId) {
                window.selectMusic(window.currentRoutineData.musicId, window.currentRoutineData.musicUrl);
            }
            
            ToastManager.show('success', '进入音乐模式', '🎵 已恢复您上次的音乐编排！');
        } else {
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
            AppController.applyViewingMode(false);
        }
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

    // UX 魔法：隐藏确认按钮、收起繁杂的曲库卡片、露出"重新选择"按钮
    const confirmBtn = document.getElementById('musicConfirmBtn');
    const reselectBtn = document.getElementById('reselectMusicBtn');
    const libraryList = document.getElementById('musicLibraryList');
    const libraryTitle = document.getElementById('libraryTitle');
    
    if (confirmBtn) confirmBtn.classList.add('hidden');
    if (libraryList) libraryList.classList.add('hidden');
    if (reselectBtn) reselectBtn.classList.remove('hidden');
    if (libraryTitle) libraryTitle.innerText = '🎵 可用曲库中心';
    
    // 隐藏画线工具，显示拖拽提示栏
    const drawingToolsWrapper = document.getElementById('drawingToolsWrapper');
    const dragHintBar = document.getElementById('dragHintBar');
    if (drawingToolsWrapper) drawingToolsWrapper.classList.add('hidden');
    if (dragHintBar) dragHintBar.classList.remove('hidden');
    
    // 自动切换到拖拽模式
    if (typeof setTool === 'function') {
        setTool('move');
    }

    // 显示时间轴编辑器和编排框
    const timelineEditor = document.getElementById('timelineEditor');
    const routineEditorBox = document.getElementById('routineEditorBox');
    if (timelineEditor) timelineEditor.classList.remove('hidden');
    if (routineEditorBox) routineEditorBox.classList.remove('hidden');

    // 更新时间轴UI
    updateTimelineUI();
    updateRoutineSlots();

    // ✨【FlowStateManager】退出音乐选择模式（先保存再退出）
    if (window.FlowStateManager) {
        window.FlowStateManager.save('music_selecting'); // 先保存，传入明确的 flow 名称
        window.FlowStateManager.exitFlow('music_selecting', true); // 再退出
    }
    
    // 显示教程面板
    const tutorialModal = document.getElementById('musicTutorialModal');
    if (tutorialModal) {
        tutorialModal.classList.remove('hidden');
    }
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

// 8. 更新编排槽位 - 新设计：虚线分割、图标+序号显示
function updateRoutineSlots() {
    const markers = window.musicMarkers || [{ time: 0, label: '开始' }];
    const maxSlots = markers.length - 1;
    const slotsContainer = document.getElementById('routineSlots');
    const filledSlotsEl = document.getElementById('filledSlots');
    const maxSlotsEl = document.getElementById('maxSlots');
    const completeHint = document.getElementById('completeHint');
    
    if (!slotsContainer) return;
    
    // 获取当前已编排的动作
    const placedActions = window.currentRoutineData?.placedActions || [];
    const duration = AudioEngine ? AudioEngine.wavesurfer.getDuration() : 60;
    
    // 计算画板上的线条总数（包含过渡舞蹈！）
    const totalTracks = canvasManager?.tracks?.length || 0;
    
    // ==========================================
    // 计算编排状态
    // ==========================================
    const filledCount = placedActions.filter(Boolean).length;
    const isComplete = filledCount === maxSlots && filledCount === totalTracks && totalTracks > 0;
    
    // ==========================================
    // 渲染槽位（带虚线分割对应时间轴）
    // ==========================================
    let slotsHtml = '';
    
    for (let i = 0; i < maxSlots; i++) {
        const action = placedActions[i];
        const marker = markers[i];
        const nextMarker = markers[i + 1];
        const segmentDuration = nextMarker ? (nextMarker.time - marker.time).toFixed(1) : '?';
        
        // 槽位背景：已放置动作 vs 空槽位
        const hasAction = action !== undefined;
        const slotBg = hasAction ? 'bg-white border-indigo-300' : 'bg-slate-50 border-slate-300';
        
        // 虚线分割线
        const showDash = i > 0;
        
        slotsHtml += `
            ${showDash ? `<div class="w-px h-12 bg-slate-300 border-l border-dashed mx-1 shrink-0"></div>` : ''}
            <div id="slot-${i}" 
                 class="relative flex-1 min-w-[80px] ${slotBg} border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all
                        ${hasAction ? 'border-solid' : 'hover:border-indigo-400 hover:bg-indigo-50'}"
                 ondragover="allowDrop(event)" ondragenter="dragOverSlot(event, ${i})" ondragleave="dragLeaveSlot(event, ${i})" ondrop="dropAction(event, ${i})">
                
                <!-- 槽位序号（在右上角） -->
                <div class="absolute top-1 right-2 text-[10px] font-black text-slate-400">${i + 1}</div>
                
                ${hasAction ? `
                    <!-- 已放置动作 -->
                    <div class="flex flex-col items-center gap-1 p-2">
                        <div class="text-2xl">${action.icon}</div>
                        <div class="text-[9px] font-black text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">${action.trackIndex + 1}</div>
                        <div class="text-[8px] text-slate-400">${segmentDuration}s</div>
                    </div>
                    <!-- 取消按钮 -->
                    <button onclick="removeActionFromSlot(${i})" 
                            class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-[10px] flex items-center justify-center hover:bg-red-600 hover:scale-110 transition-all shadow"
                            title="取消此动作与该段音乐的关联">
                        ×
                    </button>
                ` : `
                    <!-- 空槽位 -->
                    <div class="flex flex-col items-center gap-1">
                        <div class="text-slate-300 text-xl">+</div>
                        <div class="text-[10px] text-slate-400">拖入动作</div>
                    </div>
                `}
            </div>
        `;
    }
    
    slotsContainer.innerHTML = slotsHtml;
    
    // ==========================================
    // 更新提示区域
    // ==========================================
    if (filledSlotsEl) filledSlotsEl.textContent = filledCount;
    if (maxSlotsEl) maxSlotsEl.textContent = maxSlots;
    
    // 槽位满警告
    const slotFullWarning = document.getElementById('slotFullWarning');
    const isSlotsFull = filledCount >= maxSlots && totalTracks > maxSlots;
    if (slotFullWarning) {
        if (isSlotsFull) {
            slotFullWarning.classList.remove('hidden');
        } else {
            slotFullWarning.classList.add('hidden');
        }
    }
    
    // 完成提示
    if (completeHint) {
        if (isComplete) {
            completeHint.innerHTML = `
                <div class="flex items-center gap-2">
                    <span class="text-green-600">✅</span>
                    <span class="text-xs text-green-700 font-bold">
                        编排完成！已匹配全部 ${filledCount} 个动作。
                    </span>
                </div>
            `;
            completeHint.className = 'mt-2 p-2 bg-green-50 border border-green-200 rounded-lg';
            completeHint.classList.remove('hidden');
            
            // 显示"确认编排完毕"按钮
            const confirmBtn = document.getElementById('confirmMusicArrangeBtn');
            if (confirmBtn) confirmBtn.classList.remove('hidden');
        } else if (totalTracks === 0) {
            completeHint.innerHTML = `
                <div class="flex items-center gap-2">
                    <span class="text-blue-500">ℹ️</span>
                    <span class="text-xs text-slate-600 font-bold">
                        请先在画板上绘制动作线条，然后拖入下方槽位进行编排。
                    </span>
                </div>
            `;
            completeHint.className = 'mt-2 p-2 rounded-lg';
            completeHint.classList.remove('hidden');
            
            // 隐藏"确认编排完毕"按钮
            const confirmBtn = document.getElementById('confirmMusicArrangeBtn');
            if (confirmBtn) confirmBtn.classList.add('hidden');
        } else if (filledCount < totalTracks) {
            completeHint.innerHTML = `
                <div class="flex items-center gap-2">
                    <span class="text-orange-500">⚠️</span>
                    <span class="text-xs text-orange-700 font-bold">
                        还差 ${totalTracks - filledCount} 个动作未匹配。请在时间轴上按 [M] 添加更多标记点。
                    </span>
                </div>
            `;
            completeHint.className = 'mt-2 p-2 bg-orange-50 border border-orange-200 rounded-lg';
            completeHint.classList.remove('hidden');
            
            // 隐藏"确认编排完毕"按钮
            const confirmBtn = document.getElementById('confirmMusicArrangeBtn');
            if (confirmBtn) confirmBtn.classList.add('hidden');
        } else {
            completeHint.classList.add('hidden');
            const confirmBtn = document.getElementById('confirmMusicArrangeBtn');
            if (confirmBtn) confirmBtn.classList.add('hidden');
        }
    }
}

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

// 12. 确认编排完毕，开始音乐同步展示
window.confirmMusicArrange = function() {
    const placedActions = window.currentRoutineData?.placedActions || [];
    const markers = window.musicMarkers || [];
    const totalTracks = canvasManager?.tracks?.length || 0;
    
    // 检查条件
    if (placedActions.filter(Boolean).length === 0) {
        ToastManager.show('warning', '尚未编排', '请先将画板上的动作拖入下方槽位！', 2000);
        return;
    }
    
    const filledCount = placedActions.filter(Boolean).length;
    if (filledCount !== totalTracks) {
        ToastManager.show('warning', '未完全匹配', `画板上有 ${totalTracks} 条动作，当前只编排了 ${filledCount} 条。\n请将所有动作都编排到音乐槽位中！`, 3000);
        return;
    }
    
    // 条件满足，开始展示
    console.log('[音乐编排] ✅ 条件满足，开始音乐同步展示！');
    ToastManager.show('info', '🎬 准备展示', `快去看你编好的成套吧！`, 2500);
    
    // 隐藏编排界面和画线工具
    const timelineEditor = document.getElementById('timelineEditor');
    const routineEditorBox = document.getElementById('routineEditorBox');
    const drawingToolsWrapper = document.getElementById('drawingToolsWrapper');
    const dragHintBar = document.getElementById('dragHintBar');
    if (timelineEditor) timelineEditor.classList.add('hidden');
    if (routineEditorBox) routineEditorBox.classList.add('hidden');
    if (drawingToolsWrapper) drawingToolsWrapper.classList.add('hidden');
    if (dragHintBar) dragHintBar.classList.add('hidden');
    
    // 调用新的亮相函数
    if (canvasManager && typeof canvasManager.playMusicSyncShowcase === 'function') {
        canvasManager.playMusicSyncShowcase(() => {
            console.log('[音乐编排] ✅ 音乐同步展示完成！');
            
            // 展示完成后，显示已有E分
            const eReport = window.currentEScoreReport;
            if (eReport) {
                console.log('[音乐编排] 使用已有E分:', eReport.finalEScore);
                // 调用app.js中的显示成绩单函数
                if (window.AppController && typeof window.AppController.showFinalScoreBoard === 'function') {
                    window.AppController.showFinalScoreBoard();
                } else if (typeof showFinalScoreBoard === 'function') {
                    showFinalScoreBoard();
                } else {
                    console.error('[音乐编排] ❌ 无法找到显示成绩单的函数！');
                }
            } else {
                ToastManager.show('warning', '注意', '尚未打E分，请先完成E分评定！\n如果您想修改动作，请先点击"重新选择音乐"退出编排模式。', 4000);
                // 保持画线工具隐藏，提示用户需要退出编排功能
                const drawingToolsWrapper = document.getElementById('drawingToolsWrapper');
                const dragHintBar = document.getElementById('dragHintBar');
                if (drawingToolsWrapper) drawingToolsWrapper.classList.add('hidden');
                if (dragHintBar) dragHintBar.classList.remove('hidden');
            }
        });
    } else {
        console.error('[音乐编排] ❌ canvasManager.playMusicSyncShowcase 函数不存在！');
        ToastManager.show('error', '错误', '展示函数未找到，请刷新页面重试！', 3000);
        
        // 恢复编排界面，保持画线工具隐藏
        if (timelineEditor) timelineEditor.classList.remove('hidden');
        if (routineEditorBox) routineEditorBox.classList.remove('hidden');
        // 保持画线工具隐藏，用户需要退出编排模式才能继续
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

// ✨ 页面加载完成后，立即渲染系统内置音乐库
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(renderLocalMusicList, 100);
    });
} else {
    // DOM 已经就绪，直接调用
    setTimeout(renderLocalMusicList, 100);
}

// ==========================================
// 🎛️ 界面收起/展开功能
// ==========================================

// 收起/展开时间轴编辑器
window.toggleTimelineEditor = function() {
    const content = document.getElementById('timelineContent');
    const toggle = document.getElementById('timelineEditorToggle');
    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        toggle.innerHTML = '▼';
    } else {
        content.classList.add('hidden');
        toggle.innerHTML = '▶';
    }
};

// 收起/展开编排框
window.toggleRoutineEditor = function() {
    const content = document.getElementById('routineContent');
    const toggle = document.getElementById('routineEditorToggle');
    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        toggle.innerHTML = '▼';
    } else {
        content.classList.add('hidden');
        toggle.innerHTML = '▶';
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
