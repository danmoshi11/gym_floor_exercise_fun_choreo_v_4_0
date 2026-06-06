// ==========================================
// 自由体操场地视觉与绘画引擎 (canvas.js)
// ==========================================

const canvasManager = {
    canvas: null,
    ctx: null,
    isDrawing: false,
    dragDist: 0, 
    currentTool: 'line', 
    
    // 【新增】专门用于拖拽功能的状态锁
    draggingTrack: null,
    lastDragPos: null,
    
    tempPath: [], 
    tracks: [], 
    showcaseMarks: [],
    morandiColors: ['#8D99AE', '#D4A373', '#A7C957', '#E5989B', '#9C89B8', '#6C7A89', '#F2CC8F', '#B5C4B1'],
    
    init: function() {
        this.canvas = document.getElementById('floorCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.canvas.addEventListener('mousedown', this.startDraw.bind(this));
        this.canvas.addEventListener('mousemove', this.drawing.bind(this));
        this.canvas.addEventListener('mouseup', this.endDraw.bind(this));
        this.canvas.addEventListener('mouseleave', this.endDraw.bind(this));
        
        this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
        this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
        
        this.redraw();
    },

    handleTouchStart: function(e) { 
        // 🔒【安全防线】：如果 E裁判 面板当前处于激活呼出状态，完全锁死画板绘画行为
        const eDeck = document.getElementById('juryCardDeck');
        if (eDeck && !eDeck.classList.contains('translate-y-full')) {
            console.warn("🔒 正在执裁打分模式，战术画板已进入只读安全锁状态！");
            return;
        }
        e.preventDefault(); this.startDraw(e.touches[0]); },
    handleTouchMove: function(e) { e.preventDefault(); this.drawing(e.touches[0]); },
    handleTouchEnd: function(e) { e.preventDefault(); this.endDraw(); },
    setTool: function(toolName) {
        // ✨ 音乐编排模式：只允许拖拽工具
        if (window.currentRoutineData?.musicId && toolName !== 'move') {
            ToastManager.show('info', '提示', '音乐编排模式下只能使用拖拽工具！', 1500);
            toolName = 'move';
        }
        this.currentTool = toolName;
    },

    clearAll: function() {
        this.tracks = [];
        this.tempPath = [];
        this.showcaseMarks = [];
        this.redraw();
        if (typeof window.updateUIRoutineList === 'function') window.updateUIRoutineList();
        // 在你的清空画板函数内部加上：
        window.currentPlaybackMode = 'auto'; // 恢复默认模式
        const juryPanel = document.getElementById('manualJuryPanel'); if(juryPanel) juryPanel.remove();
        const artModal = document.getElementById('artistryScoreModal'); if(artModal) artModal.remove();
        // ✨【新增】：标记为未初始化状态
        if (window.currentRoutineData) {
            window.currentRoutineData.initialized = false;
        }
    },

    // ✨【新增】：显示空白画板提示
        showEmptyCanvasPrompt: function() {
        if (document.getElementById('emptyCanvasPrompt')) return;
        if (window.currentTab !== 'builder') return;

        const container = document.getElementById('floorContainer');
        if (!container) return;

        const promptDiv = document.createElement('div');
        promptDiv.id = 'emptyCanvasPrompt';
        promptDiv.className = 'absolute inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 rounded-xl';
        promptDiv.innerHTML = `
            <div class="bg-white rounded-3xl p-6 w-11/12 max-w-xs shadow-2xl transform transition-all">
                <div class="text-center mb-5">
                    <div class="text-5xl mb-3">📝</div>
                    <h3 class="text-xl font-black text-slate-800 midnight-weight-fix">开始新成套</h3>
                    <p class="text-xs text-slate-500 mt-2">当前是空白草稿纸，请先配置参数信息</p>
                </div>
                <div class="space-y-3">
                    <button onclick="canvasManager.startNewRoutine()" 
                            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3.5 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm">
                        <span>🎯</span>
                        <span>配置场地与选手</span>
                    </button>
                    <button onclick="canvasManager.closeEmptyCanvasPrompt()" 
                            class="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3.5 px-6 rounded-xl transition-all text-sm">
                        稍后配置
                    </button>
                </div>
            </div>
        `;
        container.appendChild(promptDiv);
    },

    // ✨【新增】：关闭空白画板提示
    closeEmptyCanvasPrompt: function() {
        const el = document.getElementById('emptyCanvasPrompt');
        if (el) el.remove();
    },

    // ✨【新增】：开始新建成套（显示初始化面板）
    startNewRoutine: function() {
        this.closeEmptyCanvasPrompt();
        
        // 标记为已初始化
        if (!window.currentRoutineData) {
            window.currentRoutineData = {};
        }
        window.currentRoutineData.initialized = true;
        
        // 💡【核心修复】：不再直接呼叫残缺的选人小弹窗，而是霸道地展示包含所有配置项（场地、名称、选手）的 setupModal！
        const setupModal = document.getElementById('setupModal');
        if (setupModal) {
            setupModal.classList.remove('hidden');
        }
        
        if (typeof ToastManager !== 'undefined') {
            ToastManager.show('info', '开启新草稿纸', '请在上方配置成套名称与场地环境！', 3000);
        }
    },

    getMousePos: function(evt) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: (evt.clientX - rect.left) * (this.canvas.width / rect.width),
            y: (evt.clientY - rect.top) * (this.canvas.height / rect.height)
        };
    },

    pointToSegmentDist: function(px, py, x1, y1, x2, y2) {
        let l2 = (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
        if (l2 === 0) return Math.hypot(px - x1, py - y1);
        let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
        t = Math.max(0, Math.min(1, t));
        return Math.hypot(px - (x1 + t * (x2 - x1)), py - (y1 + t * (y2 - y1)));
    },

    findHitTrack: function(pos) {
        for (let i = this.tracks.length - 1; i >= 0; i--) {
            let t = this.tracks[i];
            if (t.type === 'point') {
                if (Math.hypot(pos.x - t.points[0].x, pos.y - t.points[0].y) < 20) return t;
            } else {
                for (let j = 0; j < t.points.length - 1; j++) {
                    let d = this.pointToSegmentDist(pos.x, pos.y, t.points[j].x, t.points[j].y, t.points[j+1].x, t.points[j+1].y);
                    if (d < 15) return t; 
                }
            }
        }
        return null;
    },

        startDraw: function(e) {
        const eDeck = document.getElementById('juryCardDeck');
        if (eDeck && !eDeck.classList.contains('translate-y-full')) {
            console.warn("🔒 正在执裁打分模式，战术画板已进入只读安全锁状态！");
            return;
        }

        if (window.ThreeEngine && window.ThreeEngine.isActive) {
            console.warn("🔒 3D 现场演示中，已自动锁定位移，防止 2D 轨迹越权穿透！");
            return;
        }

        if (window.FlowStateManager && window.FlowStateManager.isAnyFlowActive() && window.FlowStateManager.getCurrentFlow() !== 'canvas_editing') {
            window.FlowStateManager.showInterception('画板编辑');
            return;
        }

        // ✨ 检测：如果已经有E分，修改画线将成为新成套
        if (this.currentTool !== 'move' && window.currentEScoreReport) {
            // ✨ 标记为"预画线"状态，暂缓清除E分
            this._pendingNewDraft = true;
            if (!confirm("⚠️ 当前成套已经有E分记录。\n\n修改动作后，这将成为新的草稿，需要重新计算E分。\n\n确定要继续画线吗？")) {
                // 用户取消，恢复状态
                this._pendingNewDraft = false;
                return;
            }
            // 用户确认，清除E分记录
            this._pendingNewDraft = false;
            window.currentEScoreReport = null;
            window.currentScoreReport = null;
            ToastManager.show('info', '新草稿', '已重置为新草稿，修改后将重新计算E分', 2000);
        } else {
            this._pendingNewDraft = false;
        }

        if (this.tracks.length === 0 && !window.currentRoutineData?.initialized) {
            this.showEmptyCanvasPrompt();
            return;
        }const pos = this.getMousePos(e);
        
        // 【核心】拖拽模式入口
        if (this.currentTool === 'move') {
            let hit = this.findHitTrack(pos);
            if (hit) {
                this.draggingTrack = hit;
                this.lastDragPos = pos;
                this.isDrawing = true;
            }
            return; // 成功拦截，不进入下方画线逻辑
        }

        this.isDrawing = true;
        this.tempPath = [pos];
        this.dragDist = 0; 

        if (this.currentTool === 'point') {
            this.isDrawing = false;
            let hit = this.findHitTrack(pos);
            if (hit) {
                this.tempPath = [];
                if (typeof window.openSkillModal === 'function') window.openSkillModal(hit);
            } else {
                this.finishPath();
            }
        }
    },

    drawing: function(e) {
        // ✨【双重保险】：即使 isDrawing=true，裁判台激活时仍强制中断
        const eDeck = document.getElementById('juryCardDeck');
        if (eDeck && !eDeck.classList.contains('translate-y-full')) {
            this.isDrawing = false; // 强制重置状态
            return;
        }
        
        if (!this.isDrawing) return;
        
        // ✨【FlowStateManager】标记数据已修改
        if (window.FlowStateManager) {
            window.FlowStateManager.markDirty('canvas_editing');
        }
        
        const pos = this.getMousePos(e);
        
        // 【核心】拖拽过程（矩阵平移计算）
        if (this.currentTool === 'move' && this.draggingTrack) {
            const dx = pos.x - this.lastDragPos.x;
            const dy = pos.y - this.lastDragPos.y;
            
            // 将线上所有的点统一累加坐标偏移量
            this.draggingTrack.points.forEach(p => {
                p.x += dx;
                p.y += dy;
            });
            
            this.lastDragPos = pos;
            this.redraw();
            return;
        }

        let lastPt = this.tempPath[this.tempPath.length - 1];
        this.dragDist += Math.hypot(pos.x - lastPt.x, pos.y - lastPt.y);

        if (this.currentTool === 'line') this.tempPath[1] = pos;
        else this.tempPath.push(pos);
        this.redraw();
    },

    endDraw: function() {
        // ✨【双重保险】：裁判台激活时跳过 endDraw 逻辑
        const eDeck = document.getElementById('juryCardDeck');
        if (eDeck && !eDeck.classList.contains('translate-y-full')) {
            this.isDrawing = false;
            return;
        }
        
        if (!this.isDrawing) return;
        this.isDrawing = false;

        // ✨【FlowStateManager】标记数据已修改
        if (window.FlowStateManager) {
            window.FlowStateManager.markDirty('canvas_editing');
        }

        // 【核心】拖拽结束
        if (this.currentTool === 'move' && this.draggingTrack) {
            // 重新运行一次界外检测，看看拖拽后有没有出界
            const marginX = this.canvas.width / 14; 
            const marginY = this.canvas.height / 14; 
            let isOOB = this.draggingTrack.points.some(p => p.x < marginX || p.x > this.canvas.width - marginX || p.y < marginY || p.y > this.canvas.height - marginY);
            
            if (isOOB && this.draggingTrack.type !== 'transit') {
                window.pendingOOBTrack = this.draggingTrack;
                document.getElementById('oobModal').classList.remove('hidden');
            } else {
                this.draggingTrack.nd = 0; // 回到界内，清除越界扣分
            }
            
            this.draggingTrack = null;
            this.redraw();
            // 触发侧边栏 UI 更新（包含扣分的变动）
            if (typeof window.updateUIRoutineList === 'function') window.updateUIRoutineList();
            return;
        }

        if (this.dragDist < 5 && this.currentTool !== 'point') {
            let hit = this.findHitTrack(this.tempPath[0]);
            if (hit) {
                this.tempPath = []; 
                this.redraw();
                if (typeof window.openSkillModal === 'function') window.openSkillModal(hit);
                return;
            }
        }

        this.finishPath();
    },

    finishPath: function() {
        if (this.tempPath.length < 1) return;
        if (this.currentTool !== 'point' && this.tempPath.length < 2) {
            this.tempPath = [];
            this.redraw();
            return;
        }

        if (this.currentTool === 'line') {
            const dx = this.tempPath[1].x - this.tempPath[0].x;
            const dy = this.tempPath[1].y - this.tempPath[0].y;
            if (Math.sqrt(dx*dx + dy*dy) < 30) {
                this.tempPath = [];
                this.redraw();
                return;
            }
        }

        const marginX = this.canvas.width / 14; 
        const marginY = this.canvas.height / 14; 
        let isOOB = this.tempPath.some(p => p.x < marginX || p.x > this.canvas.width - marginX || p.y < marginY || p.y > this.canvas.height - marginY);

        let trackColor = this.currentTool === 'transit' ? '#9ca3af' : this.morandiColors[this.tracks.length % this.morandiColors.length];
        
        const newTrack = {
            id: 'track_' + Date.now() + '_' + Math.random(),
            type: this.currentTool,
            points: [...this.tempPath],
            color: trackColor,
            skills: [],
            connectionType: 'direct',
            nd: 0 
        };

        this.tempPath = [];

        if (isOOB && this.currentTool !== 'transit') {
            window.pendingOOBTrack = newTrack;
            document.getElementById('oobModal').classList.remove('hidden');
            this.redraw();
            return;
        }

        // ==========================================
        // ✨【防卡死保护锁】：限制场地物理线条上限
        // ==========================================
        if (this.tracks.length >= 15) {
            ToastManager.show('warning', '达到安全上限', '⚠️ 场地线条数量已达上限 (15条)\n请点击侧边栏 🗑️ 删除多余路线以防卡顿。');
            this.tempPath = [];
            this.redraw();
            return;
        }

        this.tracks.push(newTrack);
        this.redraw();
        if (typeof window.openSkillModal === 'function') window.openSkillModal(newTrack);
    },

    updateTrackSkills: function(trackId, skills, connectionType) {
        const track = this.tracks.find(t => t.id === trackId);
        if (track) {
            track.skills = skills;
            track.connectionType = connectionType;
            this.redraw(); 
            if (typeof window.updateUIRoutineList === 'function') window.updateUIRoutineList();
        }
    },

    redraw: function(highlightIndex = -1, progress = -1) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const marginX = this.canvas.width / 14;
        const marginY = this.canvas.height / 14;
        this.ctx.save();
        const container = document.getElementById('floorContainer');
        if (container) {
            this.ctx.strokeStyle = getComputedStyle(container).borderColor;
        } else {
            this.ctx.strokeStyle = "#ffffff"; // 兜底颜色
        }
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([12, 12]);
        this.ctx.strokeRect(marginX, marginY, this.canvas.width - marginX*2, this.canvas.height - marginY*2);
        this.ctx.restore();
        
        this.tracks.forEach((track, index) => {
            let isDimmed = (highlightIndex !== -1 && highlightIndex !== index);
            let isHighlighted = (highlightIndex === index);
            this.drawTrack(track, index, isDimmed, isHighlighted, progress);
        });

        if (this.tempPath.length > 0) this.drawTempPath();

        // 【新增】绘制成功或失败的标记 (防崩溃渲染)
        if (this.showcaseMarks && Array.isArray(this.showcaseMarks) && this.showcaseMarks.length > 0) {
            this.ctx.save();
            this.ctx.font = "24px sans-serif";
            this.ctx.textAlign = "center";
            this.ctx.textBaseline = "middle";
            this.ctx.shadowColor = "rgba(255,255,255,0.8)";
            this.ctx.shadowBlur = 10;
            
            this.showcaseMarks.forEach(mark => {
                // 确保 mark 数据完整，防止 Canvas 绘制 API 报错卡死
                if(mark && mark.x !== undefined && mark.y !== undefined) {
                    this.ctx.fillText(mark.type === 'fall' ? '❌' : '✅', mark.x, mark.y);
                }
            });
            this.ctx.restore();
        }    
    },

    // ==========================================
    // Phase 3: 音乐时间轴驱动引擎核心算法
    // ==========================================

    // 获取一条轨迹的总物理像素长度
    getTrackLength: function(points) {
        if (!points || points.length < 2) return 0;
        let len = 0;
        for(let i = 0; i < points.length - 1; i++) {
            len += Math.hypot(points[i+1].x - points[i].x, points[i+1].y - points[i].y);
        }
        return len;
    },

    // 给定一个距离，在线段上精准插值寻找坐标点
    getPointAtDistance: function(points, targetDist) {
        if (!points || points.length === 0) return null;
        if (points.length === 1 || targetDist <= 0) return points[0];
        
        let len = 0;
        for(let i = 0; i < points.length - 1; i++) {
            let d = Math.hypot(points[i+1].x - points[i].x, points[i+1].y - points[i].y);
            if (len + d >= targetDist) {
                let p = d === 0 ? 0 : (targetDist - len) / d;
                return {
                    x: points[i].x + (points[i+1].x - points[i].x) * p,
                    y: points[i].y + (points[i+1].y - points[i].y) * p
                };
            }
            len += d;
        }
        return points[points.length - 1]; // 兜底返回终点
    },

    // 终极函数：任意拖拽进度条，画面瞬间就位
    redrawBasedOnTime: function(currentTime) {
        // 1. 清空并画场地底纹
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const marginX = this.canvas.width / 14;
        const marginY = this.canvas.height / 14;
        this.ctx.save();
        const container = document.getElementById('floorContainer');
        this.ctx.strokeStyle = container ? getComputedStyle(container).borderColor : "#ffffff";
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([12, 12]);
        this.ctx.strokeRect(marginX, marginY, this.canvas.width - marginX*2, this.canvas.height - marginY*2);
        this.ctx.restore();

        let activeDot = null;
        let activeColor = '#ffffff';
        const actionTracks = this.tracks.filter(t => t.type !== 'transit');

        // 2. 遍历所有路线，决定它们该画到什么程度
        this.tracks.forEach((track, index) => {
            if (track.type === 'transit') {
                this.drawTrack(track, index, true, false, -1);
                return;
            }

            if (!track.audioSync || track.audioSync.endTime === null) {
                // 还没打过点的线，显示为幽灵暗色
                this.drawTrack(track, index, true, false, -1);
                return;
            }

            let startT = track.audioSync.startTime;
            let endT = track.audioSync.endTime;

            if (currentTime < startT) {
                // 【未开始】：只画出暗色底线
                this.drawTrack(track, index, true, false, -1);
            } else if (currentTime > endT) {
                // 【已结束】：全量画完高亮线，但不画点（传 progress = -1 阻止原有画点逻辑）
                this.drawTrack(track, index, false, true, -1);
            } else {
                // 【正在进行中】：核心插值计算！
                let progress = (currentTime - startT) / (endT - startT);
                this.drawTrack(track, index, false, true, progress);
                
                // 算出小人当前的绝对精确坐标
                if (track.type === 'point') {
                    activeDot = track.points[0];
                } else {
                    let tLen = this.getTrackLength(track.points);
                    activeDot = this.getPointAtDistance(track.points, tLen * progress);
                }
                activeColor = track.color;
                // ======= 【3D 动作字典核心注入】=======
                // 别再只传 track.manualDeductions 了，把整条 track 轨迹和进度一起塞进 3D 引擎！
                if (activeDot && typeof ThreeEngine !== 'undefined' && ThreeEngine.updateGymnastPosition) {
                    ThreeEngine.updateGymnastPosition(activeDot.x, activeDot.y, track, progress);
                }
                // =====================================
                // =====================================
            }
        });

        // 3. 【过渡期空白处理】：如果当前时间不在任何一条动作区间内，小人该在哪？
        if (!activeDot && actionTracks.length > 0) {
            // A. 在两串动作中间的缝隙：隐形匀速走向下一个起点
            for (let i = 0; i < actionTracks.length - 1; i++) {
                let curr = actionTracks[i];
                let next = actionTracks[i+1];
                if (curr.audioSync?.endTime && next.audioSync?.startTime) {
                    if (currentTime > curr.audioSync.endTime && currentTime < next.audioSync.startTime) {
                        let gapStart = curr.audioSync.endTime;
                        let gapEnd = next.audioSync.startTime;
                        let p = (currentTime - gapStart) / (gapEnd - gapStart);
                        
                        let startPt = curr.points[curr.points.length - 1];
                        let endPt = next.points[0];
                        
                        activeDot = {
                            x: startPt.x + (endPt.x - startPt.x) * p,
                            y: startPt.y + (endPt.y - startPt.y) * p
                        };
                        activeColor = '#9ca3af'; // 走路期间变成灰色
                        break;
                    }
                }
            }
            
            // B. 在第一串动作开始前：停在第一个起点待命
            if (!activeDot && actionTracks[0].audioSync?.startTime && currentTime < actionTracks[0].audioSync.startTime) {
                activeDot = actionTracks[0].points[0];
                activeColor = '#9ca3af';
            }
            
            // C. 在所有动作结束后：停在最后一个终点摆 Pose
            if (!activeDot) {
                let last = actionTracks[actionTracks.length - 1];
                if (last.audioSync?.endTime && currentTime > last.audioSync.endTime) {
                    activeDot = last.points[last.points.length - 1];
                    activeColor = last.color;
                }
            }
        }

        // 4. 全局统一绘制小人（剥离了原有的状态耦合）
        if (activeDot) {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(activeDot.x, activeDot.y, 10, 0, Math.PI * 2);
            this.ctx.fillStyle = "#ffffff";
            this.ctx.shadowColor = "#ffffff";
            this.ctx.shadowBlur = 15;
            this.ctx.fill();
            
            this.ctx.beginPath();
            this.ctx.arc(activeDot.x, activeDot.y, 5, 0, Math.PI * 2);
            this.ctx.fillStyle = activeColor;
            this.ctx.shadowBlur = 0;
            this.ctx.fill();
            this.ctx.restore();
        }
    },

    drawTrack: function(track, index, isDimmed, isHighlighted, progress) {
        const ctx = this.ctx;
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        if (track.type === 'transit') {
            ctx.setLineDash([8, 8]);
            ctx.lineWidth = isHighlighted ? 4 : 2;
            ctx.strokeStyle = isDimmed ? 'rgba(156, 163, 175, 0.3)' : track.color;
        } else {
            ctx.setLineDash([]);
            ctx.lineWidth = isHighlighted ? 6 : 4;
            ctx.strokeStyle = track.color;
            if (isDimmed) {
                ctx.globalAlpha = 0.2;
                ctx.strokeStyle = '#9ca3af';
            } else if (isHighlighted) {
                ctx.shadowColor = track.color;
                ctx.shadowBlur = 12;
            }
        }

        ctx.beginPath();
        if (track.type === 'point') {
            ctx.arc(track.points[0].x, track.points[0].y, isHighlighted ? 12 : 8, 0, Math.PI * 2);
            ctx.fillStyle = ctx.strokeStyle;
            ctx.fill();
        } else {
            ctx.moveTo(track.points[0].x, track.points[0].y);
            if (track.type === 'line') ctx.lineTo(track.points[1].x, track.points[1].y);
            else for (let i = 1; i < track.points.length; i++) ctx.lineTo(track.points[i].x, track.points[i].y);
            ctx.stroke();
        }

        if (track.type !== 'transit') {
            let startX = track.points[0].x;
            let startY = track.points[0].y;
            
            ctx.beginPath();
            ctx.arc(startX, startY, 12, 0, Math.PI * 2);
            ctx.fillStyle = isDimmed ? '#e5e7eb' : track.color;
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.font = 'bold 12px Arial';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(index + 1, startX, startY + 1);
        } else {
            // 过渡舞蹈也要显示编号
            let startX = track.points[0].x;
            let startY = track.points[0].y;
            
            ctx.beginPath();
            ctx.arc(startX, startY, 12, 0, Math.PI * 2);
            ctx.fillStyle = isDimmed ? '#e5e7eb' : '#9ca3af';
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.font = 'bold 12px Arial';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(index + 1, startX, startY + 1);
        }

        if (isHighlighted && progress >= 0 && progress <= 1) {
            let dotX, dotY;
            if (track.type === 'point') {
                dotX = track.points[0].x; dotY = track.points[0].y;
            } else {
                let pts = track.points;
                let exactIndex = progress * (pts.length - 1);
                let idx = Math.floor(exactIndex);
                let nextIdx = Math.min(idx + 1, pts.length - 1);
                let t = exactIndex - idx;
                dotX = pts[idx].x + (pts[nextIdx].x - pts[idx].x) * t;
                dotY = pts[idx].y + (pts[nextIdx].y - pts[idx].y) * t;
            }

            ctx.beginPath();
            ctx.arc(dotX, dotY, 10, 0, Math.PI * 2);
            ctx.fillStyle = "#ffffff";
            ctx.shadowColor = "#ffffff";
            ctx.shadowBlur = 15;
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(dotX, dotY, 5, 0, Math.PI * 2);
            ctx.fillStyle = track.color;
            ctx.shadowBlur = 0;
            ctx.fill();
        }

        if (track.skills && track.skills.length > 0 && track.type !== 'transit') {
            const connector = track.connectionType === 'direct' ? ' + ' : ' , ';
            const skillText = track.skills.map(s => s.nameZh[0]).join(connector);
            let midX, midY, angle = 0;

            if (track.type === 'point') {
                midX = track.points[0].x; midY = track.points[0].y - 20; 
            } else if (track.type === 'line') {
                midX = (track.points[0].x + track.points[1].x) / 2;
                midY = (track.points[0].y + track.points[1].y) / 2;
                angle = Math.atan2(track.points[1].y - track.points[0].y, track.points[1].x - track.points[0].x);
                if (angle > Math.PI / 2 || angle < -Math.PI / 2) angle += Math.PI;
            } else if (track.type === 'curve') {
                let midIndex = Math.floor(track.points.length / 2);
                midX = track.points[midIndex].x; midY = track.points[midIndex].y - 20;
            }

            ctx.translate(midX, midY);
            ctx.rotate(angle);
            ctx.font = isHighlighted ? "bold 18px sans-serif" : "bold 15px sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.lineWidth = 4;
            ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
            ctx.strokeText(skillText, 0, -12);
            ctx.fillStyle = isDimmed ? "#9ca3af" : (isHighlighted ? "#1e3a8a" : track.color);
            ctx.fillText(skillText, 0, -12);
        }
        ctx.restore();
    },

    drawTempPath: function() {
        const ctx = this.ctx;
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#3b82f6';
        ctx.setLineDash([8, 8]); 
        
        if (this.currentTool === 'point') {
            ctx.arc(this.tempPath[0].x, this.tempPath[0].y, 6, 0, Math.PI * 2);
            ctx.fillStyle = '#3b82f6';
            ctx.fill();
        } else {
            ctx.moveTo(this.tempPath[0].x, this.tempPath[0].y);
            if (this.currentTool === 'line' && this.tempPath.length === 2) {
                ctx.lineTo(this.tempPath[1].x, this.tempPath[1].y);
            } else {
                for (let i = 1; i < this.tempPath.length; i++) ctx.lineTo(this.tempPath[i].x, this.tempPath[i].y);
            }
            ctx.stroke();
        }
        ctx.restore();
    },

    playHighlightAnimation: function(callback, fallTrackIds) { 
        const safeFallIds = Array.isArray(fallTrackIds) ? fallTrackIds : [];
        
        if (this.tracks.length === 0) {
            if(callback) callback();
            return;
        }
        
        // 设置动画状态标志
        this.isAnimating = true;
        this.showcaseMarks = []; 
        let currentIndex = 0;
        const _this = this;
        const duration = 1200;
        let markAddedForCurrent = false; 
        let isSkipped = false;

        // 🟢 新增：注入跳过按钮
        let skipBtn = null;
        if (window.AppController && window.AppController.isViewingMode) {
            skipBtn = document.createElement('button');
            skipBtn.className = "absolute top-4 left-4 z-[100] bg-white/90 backdrop-blur border border-slate-200 shadow-lg px-4 py-2 rounded-full text-sm font-black text-indigo-600 hover:bg-indigo-50 transition-all flex items-center gap-2 cursor-pointer";
            skipBtn.innerHTML = "⏩ 跳过动画看成绩";
            skipBtn.onclick = () => {
                isSkipped = true;
                if (skipBtn.parentNode) skipBtn.parentNode.removeChild(skipBtn);
                _this.redraw(-1, -1);
                if (callback) callback(); 
            };
            document.getElementById('floorContainer').appendChild(skipBtn);
        }

        function animateTrack(startTime) {
            if (isSkipped) return; // 🟢 拦截动画循环

            let now = Date.now();
            let progress = (now - startTime) / duration;
            if (progress > 1) progress = 1;

            _this.redraw(currentIndex, progress); 

            if (progress === 1 && !markAddedForCurrent) {
                try {
                    let track = _this.tracks[currentIndex];
                    if (track && track.type === 'line' && track.skills && track.skills.length > 0) {
                        let isFall = safeFallIds.includes(track.id);
                        let lastPt = null;
                        if (track.points && track.points.length > 0) {
                            lastPt = track.points[track.points.length - 1];
                        } 
                        
                        if (lastPt && lastPt.x !== undefined && lastPt.y !== undefined) {
                            _this.showcaseMarks.push({ 
                                x: lastPt.x + 15, 
                                y: lastPt.y - 15, 
                                type: isFall ? 'fall' : 'pass' 
                            });

                            // 🟢 新增：如果有历史扣分(manualDeductions)，动态生成飘字 DOM！
                            if (track.manualDeductions && track.manualDeductions.length > 0) {
                                const container = document.getElementById('floorContainer');
                                const floatDiv = document.createElement('div');
                                floatDiv.className = 'absolute pointer-events-none z-[80] flex flex-col items-center gap-0.5 whitespace-nowrap';
                                floatDiv.style.left = `${lastPt.x}px`;
                                floatDiv.style.top = `${lastPt.y - 20}px`;
                                floatDiv.style.transition = 'all 1.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
                                floatDiv.style.opacity = '1';
                                floatDiv.style.transform = 'translate(-50%, 0) scale(0.9)';

                                let floatHtml = '';
                                track.manualDeductions.forEach(d => {
                                    let colorClass = d.isDScore ? 'text-blue-600 bg-blue-50/90 border-blue-200' : 
                                                     (d.isArtistry ? 'text-fuchsia-600 bg-fuchsia-50/90 border-fuchsia-200' : 'text-rose-600 bg-rose-50/90 border-rose-200');
                                    floatHtml += `<div class="text-[10px] font-black px-1.5 py-0.5 rounded border shadow-sm backdrop-blur-sm ${colorClass}">
                                                    -${d.deduction.toFixed(1)} ${d.faultName}
                                                  </div>`;
                                });
                                floatDiv.innerHTML = floatHtml;
                                container.appendChild(floatDiv);

                                requestAnimationFrame(() => {
                                    floatDiv.style.transform = 'translate(-50%, -50px) scale(1.1)';
                                    floatDiv.style.opacity = '0';
                                });
                                setTimeout(() => {
                                    if (floatDiv.parentNode) container.removeChild(floatDiv);
                                }, 1500);
                            }
                        }
                    }
                } catch(e) {
                    console.error("⚠️ 符号渲染已被安全拦截，未影响主流程:", e);
                }
                markAddedForCurrent = true;
            }

            if (progress < 1) {
                requestAnimationFrame(() => animateTrack(startTime));
            } else {
                const goToNextTrack = () => {
                    currentIndex++;
                    markAddedForCurrent = false;
                    if (currentIndex < _this.tracks.length) {
                        setTimeout(() => requestAnimationFrame(() => animateTrack(Date.now())), 300);
                    } else {
                        // 🟢 动画结束，销毁跳过按钮
                        _this.isAnimating = false;
                        if (skipBtn && skipBtn.parentNode) skipBtn.parentNode.removeChild(skipBtn);
                        _this.redraw(-1, -1);
                        if (callback) callback(); 
                    }
                };

                if (window.currentPlaybackMode === 'manual_e' && !window.AppController.isViewingMode) {
                    if (typeof window.showManualEJuryPanel === 'function') {
                        window.showManualEJuryPanel(_this.tracks[currentIndex], currentIndex, goToNextTrack);
                    } else {
                        goToNextTrack();
                    }
                } else {
                    goToNextTrack();
                }
            }
        }
        requestAnimationFrame(() => animateTrack(Date.now()));
    },

    // ==========================================
    // ✨【音乐时间轴卡点引擎】：基于真实音频时间的轨迹演示
    // ==========================================
    playMusicSyncAnimation: function() {
        // 过滤出有音频同步标记的动作轨迹
        const actionTracks = this.tracks.filter(t => t.type !== 'transit' && t.audioSync && t.audioSync.endTime !== null);
        
        if (actionTracks.length === 0) {
            console.warn("⚠️ 音乐模式下缺少时间戳标记，无法执行卡点动画！\n请先在音乐时间轴上为轨迹添加 startTime 和 endTime 标记。");
            return;
        }
        
        this.isAnimating = true;
        
        // 1. 防抖与清理：如果有旧动画在跑，强制掐断
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }

        // 2. 拿到最后一个动作的结束时间，作为整个动画的终点
        const lastTrack = actionTracks[actionTracks.length - 1];
        const totalDuration = lastTrack.audioSync.endTime;

        // 3. 核心逐帧渲染器
        const animate = () => {
            if (!this.isAnimating) return;

            // 🎶 获取真实音频时间（核心：接入 AudioEngine）
            let currentTime = typeof AudioEngine !== 'undefined' ? AudioEngine.getCurrentTime() : 0;

            // 如果音乐播完了，结束动画
            if (currentTime >= totalDuration) {
                this.isAnimating = false;
                this.currentAnimIndex = -1;
                this.redrawBasedOnTime(totalDuration); // 画最后一帧
                return;
            }

            // 🔍 扫描：当前音乐时间落在哪条轨迹的区间里？
            this.currentAnimIndex = actionTracks.findIndex(track => 
                currentTime >= track.audioSync.startTime && currentTime < track.audioSync.endTime
            );

            // 🎯 精确计算进度 (0.00 ~ 1.00)
            if (this.currentAnimIndex !== -1) {
                const currentTrack = actionTracks[this.currentAnimIndex];
                this.animationProgress = (currentTime - currentTrack.audioSync.startTime) / 
                                        (currentTrack.audioSync.endTime - currentTrack.audioSync.startTime);
            }

            // ⚡ 触发基于时间的精准重绘（核心：调用 redrawBasedOnTime）
            this.redrawBasedOnTime(currentTime);
            
            // 请求下一帧继续跑
            this.animationFrameId = requestAnimationFrame(animate);
        };

        // 启动引擎
        animate();
    },

    // 专属的音乐动画停止刹车
    stopMusicSyncAnimation: function() {
        this.isAnimating = false;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        this.currentAnimIndex = -1;
        this.redraw();
    },

    // ==========================================
    // ✨【音乐编排展示函数】：按段落依次亮起，匀速光点
    // ==========================================
    playMusicSyncShowcase: function(callback) {
        const placedActions = window.currentRoutineData?.placedActions || [];
        const markers = window.musicMarkers || [];
        
        // 检查是否有编排数据
        if (placedActions.length === 0 || markers.length < 2) {
            console.warn('[音乐展示] 没有编排数据，跳过音乐同步展示');
            if (callback) callback();
            return;
        }
        
        // 构建段落数据
        const segments = [];
        for (let i = 0; i < markers.length - 1; i++) {
            const startTime = markers[i].time;
            const endTime = markers[i + 1].time;
            const action = placedActions[i];
            segments.push({
                index: i,
                startTime: startTime,
                endTime: endTime,
                duration: endTime - startTime,
                action: action
            });
        }
        
        console.log('[音乐展示] 开始播放，共', segments.length, '个段落');
        
        this.isAnimating = true;
        let currentSegmentIndex = 0;
        const _this = this;
        
        // 播放单个段落
        function playSegment(segment) {
            if (!_this.isAnimating) return;
            
            console.log('[音乐展示] 播放段落', segment.index + 1, '/', segments.length, 
                        segment.action ? `(${segment.action.icon} 路线${segment.action.trackIndex + 1})` : '(空段落)');
            
            // 跳转到该段落起始时间
            if (AudioEngine && AudioEngine.wavesurfer) {
                const duration = AudioEngine.wavesurfer.getDuration();
                AudioEngine.wavesurfer.seekTo(segment.startTime / duration);
            }
            
            const segmentStartTime = Date.now();
            const segmentDuration = segment.duration * 1000; // 转换为毫秒
            
            // 段落内动画
            function animateSegment() {
                if (!_this.isAnimating) return;
                
                const elapsed = Date.now() - segmentStartTime;
                let progress = Math.min(elapsed / segmentDuration, 1);
                
                // 如果该段落有动作，播放该动作
                if (segment.action) {
                    const trackIndex = segment.action.trackIndex;
                    _this.currentAnimIndex = trackIndex;
                    _this.animationProgress = progress;
                } else {
                    _this.currentAnimIndex = -1;
                    _this.animationProgress = 0;
                }
                
                _this.redraw();
                
                if (progress < 1) {
                    _this.animationFrameId = requestAnimationFrame(animateSegment);
                } else {
                    // 段落结束，播放下一个
                    currentSegmentIndex++;
                    if (currentSegmentIndex < segments.length) {
                        setTimeout(() => playSegment(segments[currentSegmentIndex]), 300);
                    } else {
                        // 全部段落播放完毕
                        console.log('[音乐展示] 所有段落播放完毕');
                        _this.isAnimating = false;
                        _this.currentAnimIndex = -1;
                        _this.animationProgress = -1;
                        _this.redraw();
                        if (callback) callback();
                    }
                }
            }
            
            animateSegment();
        }
        
        // 开始播放第一个段落
        playSegment(segments[0]);
    }
};

window.addEventListener('DOMContentLoaded', () => setTimeout(() => canvasManager.init(), 150));

window.setTool = function(tool) {
    canvasManager.setTool(tool);
    // 【修改点】在这里把 'move' 也注册进去，才能响应按钮的高亮激活状态
    ['line', 'curve', 'point', 'transit', 'move'].forEach(t => {
        const btn = document.getElementById(`tool-${t}`);
        if(btn) btn.className = (t === tool) ? 
            "px-4 py-2 rounded-lg text-sm font-bold bg-blue-500 text-white shadow transition-colors" : 
            "px-4 py-2 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-200 transition-colors bg-gray-100";
    });
};
window.clearCanvas = function() { canvasManager.clearAll(); };


