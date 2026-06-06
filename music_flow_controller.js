// ==========================================
// 🎵 音乐模式流转控制器 (严格防呆 + 状态解耦)
// ==========================================

// 1. 点击开关外壳时的前置资格审查
window.checkMusicModeEligibility = function(e) {
    const checkbox = document.getElementById('musicModeToggle');
    // 如果还没出成绩单（即没走过那4个选项之一）
    if (!window.currentScoreReport) {
        e.preventDefault(); // 阻止开关真正被拨动
        ToastManager.show('warning', '⚠️ 尚未解锁', '请先点击下方【✅ 完成编排并计算最终成绩】并完成 E分结算，\n然后才能进入音乐模式！', 4500);
    }
};

// 2. 资格审查通过后，真正的开关状态流转
window.toggleMusicMode = function(checkbox) {
    const drawer = document.getElementById('musicDrawer');
    
    if (checkbox.checked) {
        // 【进入模式：二次确认与锁定】
        if (!confirm("🎵 确定进入音乐现场模式吗？\n进入后，当前的 2D 编排将被锁定（防止数据错乱）。")) {
            checkbox.checked = false; // 用户取消，弹回开关
            return;
        }

        // 锁定 2D 画板
        if (window.AppController && AppController.applyViewingMode) {
            AppController.applyViewingMode(true);
        }
        
        // 滑出音乐抽屉，进入 3D (假设已有相关函数)
        drawer.classList.remove('translate-y-full');
        if (typeof ThreeEngine !== 'undefined') ThreeEngine.transitionTo3D();
        ToastManager.show('success', '进入音乐模式', '编排已安全锁定 🔒。请载入音乐开始您的汇报演出！');

    } else {
        // 【退出模式：询问保存或清空】
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
        drawer.classList.add('translate-y-full');
        
        // 解锁 2D 画板
        if (window.AppController && AppController.applyViewingMode) {
            AppController.applyViewingMode(false);
        }
        if (typeof ThreeEngine !== 'undefined') ThreeEngine.transitionTo2D();
    }
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
                // 退出时清理状态
                if (window.auditionMusicData) {
                    const container = document.getElementById('waveformContainer');
                    if (container) container.innerHTML = '<p class="text-center text-gray-400 text-sm py-4">请在上方选择并试听音乐</p>';
                }
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

    // 初始化时间轴标记
    window.musicMarkers = [{ time: 0, label: '开始' }];
    window.currentRoutineData.musicMarkers = window.musicMarkers;

    ToastManager.show('success', '绑定成功', '🎉 该音乐已正式导入成套！\n现在可以按 [M] 键在音乐中打标记点了！', 3000);

    // UX 魔法：隐藏确认按钮、收起繁杂的曲库卡片、露出“重新选择”按钮
    const confirmBtn = document.getElementById('musicConfirmBtn');
    const reselectBtn = document.getElementById('reselectMusicBtn');
    const libraryList = document.getElementById('musicLibraryList');
    const libraryTitle = document.getElementById('libraryTitle');
    
    if (confirmBtn) confirmBtn.classList.add('hidden');
    if (libraryList) libraryList.classList.add('hidden');
    if (reselectBtn) reselectBtn.classList.remove('hidden');
    if (libraryTitle) libraryTitle.innerText = '🎵 已绑定当前音乐 (可使用[M]键进行打点编排)';

    // 显示时间轴编辑器和编排框
    const timelineEditor = document.getElementById('timelineEditor');
    const routineEditorBox = document.getElementById('routineEditorBox');
    if (timelineEditor) timelineEditor.classList.remove('hidden');
    if (routineEditorBox) routineEditorBox.classList.remove('hidden');

    // 更新时间轴UI
    updateTimelineUI();
    updateRoutineSlots();

    // ✨【FlowStateManager】退出音乐选择模式
    if (window.FlowStateManager) {
        window.FlowStateManager.exitFlow('music_selecting', true); // 强制退出（已确认）
        window.FlowStateManager.save(); // 保存
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
    const duration = AudioEngine.wavesurfer.getDuration();
    
    // 添加标记点
    window.musicMarkers = window.musicMarkers || [{ time: 0, label: '开始' }];
    window.musicMarkers.push({ 
        time: currentTime, 
        label: `标记 ${window.musicMarkers.length}` 
    });
    
    // 按时间排序
    window.musicMarkers.sort((a, b) => a.time - b.time);
    
    // 如果最后一个标记不是结束，添加结束标记
    if (window.musicMarkers[window.musicMarkers.length - 1].time < duration - 0.5) {
        // 确保最后有一个结束标记
    }
    
    // 更新UI
    updateTimelineUI();
    updateRoutineSlots();
    
    ToastManager.show('info', '标记已添加', `📍 在 ${formatTime(currentTime)} 处添加了标记点`, 1500);
};

// 5. 更新时间轴UI
function updateTimelineUI() {
    const markers = window.musicMarkers || [{ time: 0, label: '开始' }];
    const timelineBackground = document.getElementById('timelineBackground');
    const markersContainer = document.getElementById('markersContainer');
    const markerCount = document.getElementById('markerCount');
    const segmentCount = document.getElementById('segmentCount');
    
    if (!markersContainer || !timelineBackground) return;
    
    const duration = AudioEngine ? AudioEngine.wavesurfer.getDuration() : 10;
    
    // 更新时间轴背景分段
    let bgHtml = '';
    markers.forEach((marker, index) => {
        const nextMarker = markers[index + 1];
        if (nextMarker) {
            const segmentWidth = ((nextMarker.time - marker.time) / duration) * 100;
            const colors = ['bg-blue-100', 'bg-purple-100', 'bg-pink-100', 'bg-green-100', 'bg-yellow-100', 'bg-orange-100'];
            const colorClass = colors[index % colors.length];
            bgHtml += `<div class="${colorClass} flex-1 relative overflow-hidden" style="width: ${segmentWidth}%">
                <div class="absolute inset-0 animate-pulse opacity-50"></div>
                <div class="absolute inset-0 flex items-center justify-center">
                    <span class="text-[10px] font-black text-slate-600">${index + 1}</span>
                </div>
            </div>`;
        }
    });
    timelineBackground.innerHTML = bgHtml;
    
    // 更新标记点
    let markersHtml = '';
    markers.forEach((marker, index) => {
        const position = (marker.time / duration) * 100;
        const isStart = index === 0;
        const isEnd = index === markers.length - 1;
        markersHtml += `
            <div class="absolute transform -translate-x-1/2 cursor-pointer group" style="left: ${position}%">
                <div class="${isStart ? 'bg-green-500' : isEnd ? 'bg-red-500' : 'bg-indigo-500'} w-3 h-3 rounded-full shadow-lg border-2 border-white group-hover:scale-150 transition-transform z-10"></div>
                <div class="absolute -top-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    ${marker.label} (${formatTime(marker.time)})
                </div>
                <button onclick="removeMarker(${index})" class="absolute -bottom-5 left-1/2 transform -translate-x-1/2 w-5 h-5 bg-red-500 text-white rounded-full text-[10px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                    ×
                </button>
            </div>
        `;
    });
    markersContainer.innerHTML = markersHtml;
    
    // 更新计数
    if (markerCount) markerCount.textContent = markers.length;
    if (segmentCount) segmentCount.textContent = markers.length - 1 || 1;
    
    // 保存标记到数据
    if (window.currentRoutineData) {
        window.currentRoutineData.musicMarkers = markers;
    }
}

// 6. 删除标记点
window.removeMarker = function(index) {
    const markers = window.musicMarkers || [];
    if (index <= 0 || index >= markers.length - 1) {
        ToastManager.show('warning', '无法删除', '首尾标记点不能删除！', 1500);
        return;
    }
    
    markers.splice(index, 1);
    updateTimelineUI();
    updateRoutineSlots();
    ToastManager.show('success', '已删除', '标记点已移除', 1500);
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

// 8. 更新编排槽位
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
    
    let slotsHtml = '';
    for (let i = 0; i < maxSlots; i++) {
        const action = placedActions[i];
        slotsHtml += `
            <div id="slot-${i}" class="relative aspect-square bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all ${action ? 'border-solid border-indigo-500 bg-white' : ''}" 
                ondragover="allowDrop(event)" ondrop="dropAction(event, ${i})">
                ${action ? `
                    <div class="text-lg">${action.icon || '🎯'}</div>
                    <div class="text-[9px] font-bold text-slate-700 text-center mt-1 truncate px-1">${action.name}</div>
                    <button onclick="removeActionFromSlot(${i})" class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[8px] flex items-center justify-center hover:bg-red-600">×</button>
                ` : `
                    <div class="text-slate-300 text-xs text-center px-1">拖入动作 ${i + 1}</div>
                `}
            </div>
        `;
    }
    
    slotsContainer.innerHTML = slotsHtml;
    
    // 更新计数
    if (filledSlotsEl) filledSlotsEl.textContent = placedActions.length;
    if (maxSlotsEl) maxSlotsEl.textContent = maxSlots;
    
    // 检查是否完成
    const totalTracks = canvasManager?.tracks?.filter(t => t.type !== 'transit').length || 0;
    const isComplete = placedActions.length === maxSlots && placedActions.length === totalTracks;
    
    if (completeHint) {
        completeHint.classList.toggle('hidden', !isComplete);
    }
}

// 9. 拖拽相关函数
window.allowDrop = function(e) {
    e.preventDefault();
};

window.dropAction = function(e, slotIndex) {
    e.preventDefault();
    
    const markers = window.musicMarkers || [{ time: 0, label: '开始' }];
    const maxSlots = markers.length - 1;
    const placedActions = window.currentRoutineData?.placedActions || [];
    
    const trackIndexStr = e.dataTransfer.getData('text/plain');
    if (!trackIndexStr) return;
    
    const trackIndex = parseInt(trackIndexStr, 10);
    if (isNaN(trackIndex) || typeof canvasManager === 'undefined' || !canvasManager.tracks[trackIndex]) return;

    const track = canvasManager.tracks[trackIndex];
    
    if (track.type === 'transit' || !track.skills || track.skills.length === 0) {
        ToastManager.show('warning', '无效操作', '只能将包含具体动作的路线拖入编排小节！', 2000);
        return;
    }

    if (placedActions.filter(Boolean).length >= maxSlots && !placedActions[slotIndex]) {
        ToastManager.show('warning', '数量受限', '音乐小节已满！请按 [M] 键在时间轴上添加更多标记点。', 2500);
        return;
    }
    
    const action = {
        id: track.id,
        trackIndex: trackIndex,
        name: track.skills.map(s => s.nameZh[0]).join(' + '),
        icon: track.type === 'line' ? '📏' : (track.type === 'curve' ? '〰️' : '📍')
    };
    
    const existingIndex = placedActions.findIndex(a => a && a.id === action.id);
    if (existingIndex !== -1 && existingIndex !== slotIndex) {
        ToastManager.show('warning', '已存在', '该路线已在别的音乐小节中，请勿重复编排！', 2000);
        return;
    }
    
    placedActions[slotIndex] = action;
    window.currentRoutineData.placedActions = placedActions;
    
    updateRoutineSlots();
    ToastManager.show('success', '卡点成功', `路线 ${trackIndex + 1} 已与该音乐小节绑定！`, 1500);
};

// 10. 从槽位移除动作
window.removeActionFromSlot = function(slotIndex) {
    const placedActions = window.currentRoutineData?.placedActions || [];
    placedActions.splice(slotIndex, 1);
    window.currentRoutineData.placedActions = placedActions;
    updateRoutineSlots();
    ToastManager.show('info', '已移除', '动作已从编排框移除', 1500);
};

// 11. 格式化时间
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
}

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
