// ==========================================
// 裁判打分系统 (ManualJurySystem)
// ==========================================
window.ManualJurySystem = {
    currentTrack: null,
    nextCallback: null,
    currentDeductions: 0,
    appliedFaults: [], 
    activeGhostNode: null, // 用于暂存残影节点，防止垃圾回收导致拖拽闪退
    isMinimized: false,   // 面板折叠状态

    // 追加在 ManualJurySystem 对象内部
    abortJury: function() {
        // 1. 清空当前 E 分数据
        if (window.currentEScoreReport) {
            window.currentEScoreReport.details = [];
            window.currentEScoreReport.totalDeduction = 0;
            window.currentEScoreReport.finalEScore = 10.0;
        }
        
        // 2. 界面数字重置
        const totalDisplay = document.getElementById('juryDeckTotalDeduction');
        if (totalDisplay) totalDisplay.innerText = '-0.0';
        
        // 3. 关闭抽屉
        const deck = document.getElementById('juryCardDeck');
        if (deck) deck.classList.add('translate-y-full');
        
        ToastManager.show('info', '已取消执裁', '您已退出 E 分手动打分，分数已重置。', 3000);
    },
    
    // 1. 智能套牌牌库加载
    // ==========================================
    initCardDeck: function() {
        const container = document.getElementById('juryCardContainer');
        if (!container) return;
        
        // ==========================================
        // 1. 数据规整化与映射 (修复 D 裁没有扣分数值导致的崩溃)
        // ==========================================
        const eDeductions = (window.e_jury_deductions || []).map(r => ({
            ...r, 
            isDScore: false, 
            displayName: r.name || r.full_description || "未命名",
            displayCat: r.category || 'general',
            deductionNum: r.deduction || 0 // E裁保留数值
        }));
        
        const dDeductions = (window.d_jury_deductions || []).map(r => ({
            ...r, 
            isDScore: true, 
            displayName: r.fault_condition || r.description || "未命名",
            displayCat: r.element_category || 'general',
            deductionNum: 0 // 🟢 D裁无具体分值，赋为 0 防崩溃
        }));
        
        // 过滤掉包含 'global' 标签的全局艺术分
        let allRules = [...eDeductions, ...dDeductions].filter(r => !(r.target_tags && r.target_tags.includes("global")));

        // ==========================================
        // 2. 靶向匹配当前路线的动作 (根据 target_ids 强过滤)
        // ==========================================
        const searchVal = (document.getElementById('juryCardSearch')?.value || '').toLowerCase();
        
        // 获取当前打分路线包含的动作 ID 集合
        let trackSkillIds = [];
        if (this.currentTrack && this.currentTrack.skills) {
            trackSkillIds = this.currentTrack.skills.map(s => String(s.id));
        }

        let filtered = allRules.filter(rule => {
            if (searchVal && !rule.displayName.toLowerCase().includes(searchVal)) return false;
            
            // 🟢 极其严格的靶向匹配逻辑：彻底解决转体卡片乱入空翻的问题
            let hasMatch = false;

            if (rule.target_tags && rule.target_tags.includes("all")) {
                hasMatch = true; // 全局规则始终放行
            } else {
                // 1. 如果有 target_ids，必须完全命中
                if (rule.target_ids && rule.target_ids.length > 0) {
                    if (rule.target_ids.some(id => trackSkillIds.includes(String(id)))) {
                        hasMatch = true;
                    }
                }
                // 2. 如果有 target_tags (如 turns, acro)，按动作的首位 ID 前缀来判断
                if (rule.target_tags && rule.target_tags.length > 0) {
                    if (rule.target_tags.includes('turns') && trackSkillIds.some(id => id.startsWith('2.'))) hasMatch = true;
                    if (rule.target_tags.includes('acro') && trackSkillIds.some(id => id.startsWith('4.') || id.startsWith('5.'))) hasMatch = true;
                    if (rule.target_tags.includes('leaps') && trackSkillIds.some(id => id.startsWith('1.'))) hasMatch = true;
                }
            }

            // 如果这条规则不属于当前路线里做的任何动作大类，直接拦截！
            if (trackSkillIds.length > 0 && !hasMatch) return false;

            return true;
        });

        // ==========================================
        // 3. 按照文件的 Category 完美归类分组
        // ==========================================
        const groups = { D_Jury: {}, E_Jury: {} };
        
        // 中文美化映射表
        const catMap = {
            'general': '通用规则/姿态',
            'acro': '技巧动作',
            'dance': '舞蹈/跳步',
            'artistry': '艺术编排',
            'landing': '落地/出界',
            'turns': '转体动作',
            '通用规则 (General)': '通用规则',
            '所有单腿立转 (Turns on 1 leg)': '单腿立转',
            '所有跳跃 (Leaps and Jumps)': '跳跃动作'
        };

        filtered.forEach(rule => {
            let targetGroup = rule.isDScore ? groups.D_Jury : groups.E_Jury;
            // 采用原文件的 category，如果能查到中文翻译就用中文
            let cnCat = catMap[rule.displayCat] || rule.displayCat; 
            
            if (!targetGroup[cnCat]) targetGroup[cnCat] = [];
            targetGroup[cnCat].push(rule);
        });

        const renderGroupCards = (groupObj, isDZone) => {
            let html = '';
            for (const [catName, rules] of Object.entries(groupObj)) {
                // E 裁按扣分数值从大到小排，D裁按顺序不动
                if (!isDZone) rules.sort((a, b) => a.deductionNum - b.deductionNum);
                
                let chipsHtml = '';
                rules.forEach(rule => {
                    let colorClass = isDZone ? 'bg-blue-50 text-blue-700 border-blue-300 hover:border-blue-500' :
                        (rule.deductionNum >= 1.0 ? 'bg-rose-100 text-rose-700 border-rose-300 hover:border-rose-500' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400');
                    
                    const payload = JSON.stringify({ 
                        name: rule.displayName, 
                        deduction: rule.deductionNum, 
                        isArtistry: false, 
                        isDScore: rule.isDScore 
                    });
                    
                    // 🟢 D裁卡片特殊视觉：显示警告符号取代 -0.0
                    const displayValue = isDZone ? '<span class="text-blue-500 text-[10px]">⚠️ 降组/无效</span>' : `-${rule.deductionNum.toFixed(1)}`;
                    
                    chipsHtml += `
                        <div draggable="true" ondragstart="ManualJurySystem.dragStart(event, '${encodeURIComponent(payload)}')" ondragend="ManualJurySystem.dragEnd(event)" title="${rule.displayName}"
                             class="${colorClass} border px-2 py-1.5 rounded cursor-grab active:cursor-grabbing transition-transform hover:-translate-y-0.5 flex flex-col items-center justify-between gap-1 w-24 text-center shadow-sm">
                            <span class="text-[10px] font-bold leading-tight w-full overflow-hidden text-ellipsis" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
                                ${rule.displayName}
                            </span>
                            <span class="text-xs font-black">${displayValue}</span>
                        </div>
                    `;
                });

                let headerBorder = isDZone ? 'border-blue-200' : 'border-rose-200';
                let headerBg = isDZone ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800';

                html += `
                    <div class="bg-white border ${headerBorder} rounded-xl p-2 shrink-0 flex flex-col gap-1 w-fit min-w-[120px] max-w-[280px] shadow-sm">
                        <div class="text-[10px] font-black ${headerBg} px-2 py-0.5 rounded text-center mb-1 sticky top-0" title="${catName}">${catName}</div>
                        <div class="flex flex-wrap gap-1 justify-center">${chipsHtml}</div>
                    </div>
                `;
            }
            return html || `<div class="text-slate-400 text-xs w-full text-center mt-6">该动作暂无专属${isDZone?'降组':'扣分'}项</div>`;
        };

        // ==========================================
        // 4. 渲染双区布局 🟢 (严格的 3:7 宽度配比)
        // ==========================================
        container.innerHTML = `
            <div class="flex w-full gap-3 pb-2 min-h-[500px] max-h-[50vh]">
                <div style="flex: 3;" class="bg-blue-50/50 p-2 rounded-xl border border-blue-100 flex flex-col min-w-0">
                    <div class="text-xs font-black text-blue-700 border-b border-blue-200 pb-1 mb-2 shrink-0">🟦 D裁 (降组/无效)</div>
                    <div class="flex flex-wrap gap-2 overflow-y-auto items-start min-w-0 custom-scrollbar content-start flex-1 p-1">
                        ${renderGroupCards(groups.D_Jury, true)}
                    </div>
                </div>
                <div style="flex: 7;" class="bg-rose-50/50 p-2 rounded-xl border border-rose-100 flex flex-col min-w-0">
                    <div class="text-xs font-black text-rose-700 border-b border-rose-200 pb-1 mb-2 shrink-0">🟥 E裁 (执行扣分)</div>
                    <div class="flex flex-wrap gap-2 overflow-y-auto items-start min-w-0 custom-scrollbar content-start flex-1 p-1">
                        ${renderGroupCards(groups.E_Jury, false)}
                    </div>
                </div>
            </div>
        `;
    },

    bindScrollEvents: function() {
        const container = document.getElementById('juryCardContainer');
        if (!container || container.dataset.scrollBound === 'true') return;
        let isDown = false, startX, scrollLeft;

        container.addEventListener('mousedown', (e) => {
            if (e.target.closest('[draggable="true"]')) return;
            isDown = true; container.classList.add('cursor-grabbing');
            startX = e.pageX - container.offsetLeft; scrollLeft = container.scrollLeft;
        });
        container.addEventListener('mouseleave', () => { isDown = false; container.classList.remove('cursor-grabbing'); });
        container.addEventListener('mouseup', () => { isDown = false; container.classList.remove('cursor-grabbing'); });
        container.addEventListener('mousemove', (e) => {
            if (!isDown) return; e.preventDefault();
            const x = e.pageX - container.offsetLeft;
            container.scrollLeft = scrollLeft - (x - startX) * 1.5;
        });
        container.dataset.scrollBound = 'true';
    },

    // ==========================================
    // 2. HTML5 拖拽安全升级（绝不拒绝、绝不闪退）
    // ==========================================
    dragStart: function(event, encodedPayload) {
        event.dataTransfer.setData('text/plain', encodedPayload);
        event.dataTransfer.effectAllowed = 'copy';
        const data = JSON.parse(decodeURIComponent(encodedPayload));

        // 🛡️ 核心修复：创建残影，挂载到隐藏区域，绝不瞬间回收
        const ghost = document.createElement('div');
        ghost.className = "bg-white border-2 border-indigo-500 text-indigo-700 font-black px-3 py-1.5 rounded-lg shadow-xl flex items-center gap-1.5 pointer-events-none select-none text-xs";
        ghost.style.position = 'fixed'; ghost.style.top = '-500px'; ghost.style.left = '-500px';
        ghost.innerHTML = `<span>⚖️ ${data.name}</span> <span class="bg-rose-100 text-rose-600 px-1 rounded">-${data.deduction.toFixed(1)}</span>`;
        document.body.appendChild(ghost);
        
        event.dataTransfer.setDragImage(ghost, 40, 15);
        this.activeGhostNode = ghost; // 固化引用，阻断 GC 垃圾回收机制

        setTimeout(() => event.target.classList.add('opacity-40', 'scale-90'), 0);
    },
    
    dragEnd: function(event) {
        event.target.classList.remove('opacity-40', 'scale-90');
        // 🛡️ 拖拽彻底结束，安全销毁残影节点
        if (this.activeGhostNode && this.activeGhostNode.parentNode) {
            this.activeGhostNode.parentNode.removeChild(this.activeGhostNode);
            this.activeGhostNode = null;
        }
    },
    
    dragOver: function(event) {
        event.preventDefault(); 
        event.dataTransfer.dropEffect = 'copy';
        const dropZone = event.target.closest('.drop-zone');
        if (dropZone) dropZone.classList.add('bg-indigo-50', 'border-indigo-400', 'scale-[1.01]', 'shadow-inner');
    },
    
    dragLeave: function(event) {
        const dropZone = event.target.closest('.drop-zone');
        if (dropZone) dropZone.classList.remove('bg-indigo-50', 'border-indigo-400', 'scale-[1.01]', 'shadow-inner');
    },
    
    drop: function(event, skillIndex) {
        event.preventDefault();
        const dropZone = event.target.closest('.drop-zone');
        if (dropZone) dropZone.classList.remove('bg-indigo-50', 'border-indigo-400', 'scale-[1.01]', 'shadow-inner');
        
        const rawPayload = event.dataTransfer.getData('text/plain');
        if (!rawPayload || rawPayload === 'remove_fault') return;
        
        try {
            const data = JSON.parse(decodeURIComponent(rawPayload));
            this.appliedFaults[skillIndex].push(data);
            this.currentDeductions += data.deduction;
            this.updateDropZoneUI(skillIndex);
            this.updateTotalUI();
        } catch (e) { console.error(e); }
    },

    dragFaultStart: function(event, skillIndex, faultIndex) {
        event.dataTransfer.setData('text/plain', 'remove_fault');
        event.dataTransfer.effectAllowed = 'move';
        const fault = this.appliedFaults[skillIndex][faultIndex];

        const ghost = document.createElement('div');
        ghost.className = "bg-rose-50 border-2 border-rose-500 text-rose-700 font-black px-3 py-1.5 rounded-lg shadow-xl pointer-events-none select-none text-xs";
        ghost.style.position = 'fixed'; ghost.style.top = '-500px'; ghost.style.left = '-500px';
        ghost.innerHTML = `<span>🗑️ 撤销: ${fault.name}</span>`;
        document.body.appendChild(ghost);
        
        event.dataTransfer.setDragImage(ghost, 40, 15);
        this.activeGhostNode = ghost;

        setTimeout(() => event.target.classList.add('opacity-30', 'scale-90'), 0);
    },

    dragFaultEnd: function(event, skillIndex, faultIndex) {
        event.target.classList.remove('opacity-30', 'scale-90');
        if (this.activeGhostNode && this.activeGhostNode.parentNode) {
            this.activeGhostNode.parentNode.removeChild(this.activeGhostNode);
            this.activeGhostNode = null;
        }
        if (event.dataTransfer.dropEffect === 'none') {
            this.removeFault(skillIndex, faultIndex);
            ToastManager.show('info', '销毁成功', '卡片已移出，扣分已撤销！', 1500);
        }
    },

    // ==========================================
    // 3. 【新增】：面板高保真折叠收纳控制器
    // ==========================================
    toggleMinimize: function() {
        const deck = document.getElementById('juryCardDeck');
        const arrow = document.getElementById('juryToggleArrow');
        const text = document.getElementById('juryToggleText');
        if (!deck) return;

        this.isMinimized = !this.isMinimized;

        if (this.isMinimized) {
            // 极限折叠：利用 CSS Calc 仅露出 55px 高度的头部栏，卡牌隐藏
            deck.style.transform = 'translateY(calc(100% - 55px))';
            if (arrow) arrow.style.transform = 'rotate(180deg)';
            if (text) text.innerText = '展开';
        } else {
            // 完全恢复原状
            deck.style.transform = 'translateY(0)';
            if (arrow) arrow.style.transform = 'rotate(0deg)';
            if (text) text.innerText = '收起';
        }
    },

    removeFault: function(skillIndex, faultIndex) {
        const fault = this.appliedFaults[skillIndex][faultIndex];
        this.currentDeductions -= fault.deduction;
        this.appliedFaults[skillIndex].splice(faultIndex, 1);
        this.updateDropZoneUI(skillIndex);
        this.updateTotalUI();
    },

    updateDropZoneUI: function(skillIndex) {
        const zone = document.getElementById(`dropZone_${skillIndex}`);
        if (!zone) return;
        const faults = this.appliedFaults[skillIndex];
        
        if (faults.length === 0) {
            zone.innerHTML = `<div class="text-slate-400 font-bold text-[10px] pointer-events-none flex flex-col items-center gap-0.5"><span class="text-sm">📥</span> 将扣分卡片拖放于此</div>`;
            return;
        }
        
        let html = '<div class="flex flex-wrap gap-1 w-full p-0.5">';
        faults.forEach((f, idx) => {
            let colorClass = f.deduction >= 1.0 ? 'bg-rose-100 text-rose-700 border-rose-200' : 'bg-white text-slate-700 border-slate-200';
            let textColor = 'text-rose-500';
            
            // ✨ 根据卡片属性赋色
            if (f.isDScore) {
                colorClass = 'bg-blue-100 text-blue-700 border-blue-300';
                textColor = 'text-blue-600';
            } else if (f.isArtistry) {
                colorClass = 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-300';
                textColor = 'text-fuchsia-600';
            }

            html += `
                <div draggable="true"
                     ondragstart="ManualJurySystem.dragFaultStart(event, ${skillIndex}, ${idx})"
                     ondragend="ManualJurySystem.dragFaultEnd(event, ${skillIndex}, ${idx})"
                     class="${colorClass} border px-1.5 py-1 rounded-md text-[10px] font-bold shadow-sm flex items-center gap-1 group transform transition-all cursor-grab active:cursor-grabbing hover:scale-105">
                    <span>${f.name} <span class="${textColor} ml-0.5">-${f.deduction.toFixed(1)}</span></span>
                    <button onclick="ManualJurySystem.removeFault(${skillIndex}, ${idx})" class="text-slate-300 hover:text-red-500 bg-white/50 rounded-full w-3 h-3 flex items-center justify-center hidden group-hover:flex transition-colors">&times;</button>
                </div>
            `;
        });
        html += '</div>';
        zone.innerHTML = html;
    },

    updateTotalUI: function() {
        this.currentDeductions = Math.round(this.currentDeductions * 10) / 10;
        document.getElementById('juryDeckTotalDeduction').innerText = `-${this.currentDeductions.toFixed(1)}`;
    },

    showPanel: function(track, index, nextCallback) {
        if (track.type === 'transit' || !track.skills || track.skills.length === 0) {
            nextCallback(); 
            return;
        }

        this.currentTrack = track;
        this.nextCallback = nextCallback;
        this.currentDeductions = 0;
        this.appliedFaults = track.skills.map(() => []); 
        this.isMinimized = false; 
        
        const deck = document.getElementById('juryCardDeck');
        const arrow = document.getElementById('juryToggleArrow');
        const text = document.getElementById('juryToggleText');
        if(deck) deck.style.transform = 'translateY(0)';
        if(arrow) arrow.style.transform = 'rotate(0deg)';
        if(text) text.innerText = '收起';

        this.updateTotalUI();
        this.initCardDeck();
        this.bindScrollEvents();

        const searchInput = document.getElementById('juryCardSearch');
        const filterSelect = document.getElementById('juryCardFilter');
        if(searchInput) searchInput.oninput = () => this.initCardDeck();
        if(filterSelect) filterSelect.onchange = () => this.initCardDeck();

        if(deck) {
            deck.classList.remove('translate-y-full');
            deck.classList.add('translate-y-0');
        }

        this.renderJuryDropZones(track, index);

        // ✨【FlowStateManager】进入裁判打分模式
        if (window.FlowStateManager) {
            window.FlowStateManager.enterFlow('judging', {
                autoSave: true,
                snapshot: window.currentRoutineData,
                onExit: () => {
                    // 退出时自动收起裁判面板
                    this.hidePanel();
                }
            });
        }

        // ✨ 核心黑科技：裁判面板弹出时，扫描艺术违规并弹窗警告！
        setTimeout(() => {
            let validTracks = canvasManager.tracks.filter(t => t.skills && t.skills.length > 0);
            let isLastTrack = track.id === validTracks[validTracks.length - 1].id;
            
            // 警报 1：开场直接技巧
            if (index === 0 && track.type === 'line') {
                ToastManager.show('warning', '艺术分违规提示', '🎭 选手开场直接进入技巧串，缺乏舞蹈铺垫！\\n建议在【艺术与编排】分类中拖拽罚分。', 5500);
            }
            // 警报 2：结尾没有舞蹈
            if (isLastTrack && track.type === 'line') {
                ToastManager.show('warning', '艺术分违规提示', '🎭 选手以技巧串直接结束成套，缺乏舞蹈收尾！\\n建议在【艺术与编排】分类中拖拽罚分。', 5500);
            }
            // 警报 3：技巧串超限
            let acroCount = canvasManager.tracks.filter((t, i) => i <= index && t.type === 'line' && t.skills.length > 0).length;
            if (track.type === 'line' && acroCount > 4) {
                ToastManager.show('warning', '编排违规提示', '⚠️ 这是本成套的第 ' + acroCount + ' 串技巧！\\n多余的技巧串应予以编排扣分！', 5500);
            }
        }, 500);
    },

    renderJuryDropZones: function(track, trackIndex) {
        const list = document.getElementById('routineList');
        let html = `
            <div class="bg-indigo-600 p-3 mb-3 rounded-xl shadow-md text-white border border-indigo-500 relative overflow-hidden select-none">
                <h3 class="font-black text-sm mb-0.5 relative z-10">E裁模式：路线 ${trackIndex + 1}</h3>
                <p class="text-indigo-200 text-[10px] font-bold relative z-10">请从下方牌库拖拽卡片至下方相应的动作虚线框</p>
            </div>
        `;

        track.skills.forEach((skill, idx) => {
            html += `
                <div class="mb-3 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden transform transition-all duration-300">
                    <div class="bg-slate-50 px-2.5 py-2 border-b border-slate-100 flex justify-between items-center select-none">
                        <div class="font-black text-slate-800 text-xs flex items-center gap-1.5">
                            <span class="bg-white border border-slate-200 w-5 h-5 rounded-full flex items-center justify-center text-[9px] shadow-sm text-slate-400">${idx+1}</span> 
                            ${skill.nameZh[0]}
                        </div>
                        <span class="text-[9px] font-bold bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-500 shadow-sm">${skill.difficulty} 组</span>
                    </div>
                    <div class="p-2 bg-white">
                        <div id="dropZone_${idx}" 
                             class="drop-zone border-2 border-dashed border-slate-300 rounded-xl min-h-[60px] flex flex-col items-center justify-center p-1.5 transition-all duration-200 bg-slate-50"
                             ondragover="ManualJurySystem.dragOver(event)"
                             ondragleave="ManualJurySystem.dragLeave(event)"
                             ondrop="ManualJurySystem.drop(event, ${idx})">
                            <div class="text-slate-400 font-bold text-xs pointer-events-none flex flex-col items-center gap-0.5">
                                <span class="text-base">📥</span> 将扣分卡片拖拽放置于此
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        list.innerHTML = html;
        
        // 🛡️ 核心注入：在 CSS 树中封杀所有 drop-zone 子元素的鼠标事件，实现 100% 精准释放吸入！
        const styleId = "dropZoneFixStyle";
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.innerHTML = `.drop-zone * { pointer-events: none !important; }`;
            document.head.appendChild(style);
        }
    },

    confirmAndContinue: function() {
        let manualFaults = [];
        this.appliedFaults.forEach((faultsForSkill, skillIdx) => {
            faultsForSkill.forEach(f => {
                manualFaults.push({ skillIdx: skillIdx, faultName: f.name, deduction: f.deduction, isArtistry: f.isArtistry });
            });
        });
        
        this.currentTrack.manualDeductions = manualFaults;
        this.currentTrack.manualDeductionTotal = this.currentDeductions;

        const deck = document.getElementById('juryCardDeck');
        if(deck) {
            deck.classList.remove('translate-y-0');
            deck.classList.add('translate-y-full');
            deck.style.transform = ''; 
        }

        if (typeof AppController !== 'undefined') AppController.updateUIRoutineList();
        if (this.nextCallback) this.nextCallback();
    },

    // ✨【FlowStateManager】隐藏裁判面板（退出裁判模式）
    hidePanel: function(force = false) {
        const deck = document.getElementById('juryCardDeck');
        if(deck) {
            deck.classList.remove('translate-y-0');
            deck.classList.add('translate-y-full');
            deck.style.transform = ''; 
        }

        // ✨【FlowStateManager】退出裁判打分模式
        if (window.FlowStateManager) {
            window.FlowStateManager.exitFlow('judging', force);
        }
    }
};

window.showManualEJuryPanel = function(track, index, nextCallback) {
    ManualJurySystem.showPanel(track, index, nextCallback);
};