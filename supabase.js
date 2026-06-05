// ==========================================
// GymChoreo Supabase 全球排行榜引擎 (supabase.js)
// ==========================================


const SupabaseEngine = {
    client: null,
    autoRefreshTimer: null,

    init: function() {
        // 💡【核心修正】：URL 必须是纯净域名，绝对不能加 /rest/v1 后缀！
        const SUPABASE_URL = Config.SUPABASE_URL;
        // 🚨 开发者注意：此处的 KEY 必须是 Supabase 颁发的以 eyJhbG... 开头的超长 JWT 字符串！
        const SUPABASE_KEY = Config.SUPABASE_KEY;
        
        if (typeof supabase === 'undefined') {
            console.error("Supabase SDK 未加载！");
            return;
        }

        this.client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        console.log("✅ Supabase 云端引擎初始化成功！");
        
        // 初始化成功后，立马激活刷新右上角的昵称按钮
        this.updateUserStatusUI();
    },

    // 辅助函数：随机生成 6 位全大写“成套提取码”（排除易混淆的 0, 1, O, I）
    generate6DigitCode: function() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    },

    // ✨ 升级：改造右上角挂件，动态匹配免登录昵称与悬停提示语
    updateUserStatusUI: function() {
        const btn = document.getElementById('cloudAuthBtn');
        if (!btn) return;

        const username = localStorage.getItem('gymUsername');
        
        if (username) {
            btn.innerHTML = `🟢 选手: <span class="text-indigo-600 font-black">${username}</span> <span class="text-[10px] text-slate-400 underline ml-1 hover:text-blue-500">修改</span>`;
            btn.title = `当前全网冲榜昵称：${username} (点击可随时重新修改)`;
        } else {
            btn.innerHTML = `匿名教练 (点击设置)`;
            btn.title = "点击设置您在全球排行榜上公开展示的大师昵称";
        }

        btn.onclick = () => {
            const newName = prompt("🏆 请输入您的全网冲榜昵称 (将公开展示在全球奖牌榜上)：", username || "");
            if (newName && newName.trim() !== "") {
                localStorage.setItem('gymUsername', newName.trim());
                this.updateUserStatusUI(); 
                if (typeof ToastManager !== 'undefined') {
                    ToastManager.show('success', '昵称设置成功', `您的云端冲榜昵称已更新为：${newName.trim()}`);
                }
            }
        };
    },

    // ✨【修复 #4 & #6】区分“私密分享”与“公开冲榜”，并加入防抖 Loading
    uploadRoutine: async function(customRoutineData = null, isPublic = false) {
        if (!this.client) {
            ToastManager.show('error', '云端未连接', '云端未连接，请刷新页面重试！');
            return;
        }

        // 防抖：给用户一个“正在处理”的反馈，防止疯狂连击
        ToastManager.show('info', '📡 云端同步中', '正在与太空网络通信生成 6 位验证码，请稍候...', 2000);

        let username = localStorage.getItem('gymUsername');
        if (!username && isPublic) { // 只有冲榜才强制要求名字，私密分享不用填名
            username = prompt("🏆 冲榜前，请为自己取一个全网响亮的昵称：");
            if (!username || username.trim() === "") {
                ToastManager.show('warning', '昵称必填', '必须输入昵称才能冲榜哦！');
                return;
            }
            localStorage.setItem('gymUsername', username.trim());
            this.updateUserStatusUI();
        }

        let dScore, eScore, totalScore, routineName, brand, shareCode;

        if (customRoutineData) {
            dScore = parseFloat(customRoutineData.dScore) || 0;
            eScore = parseFloat(customRoutineData.eScore) || 0; // 私密分享不关心 E 分
            totalScore = parseFloat((dScore + eScore).toFixed(3));
            routineName = customRoutineData.name;
            brand = customRoutineData.brand;
            shareCode = ShareEngine.generateShareCode(customRoutineData);
        } else {
            const dReport = window.currentScoreReport;
            const eReport = window.currentEScoreReport;
            if (!dReport || !eReport && isPublic) {
                ToastManager.show('error', '数据不完整', '分数数据不完整，请先亮相结算后再上报！');
                return;
            }
            dScore = dReport ? dReport.totalD : 0;
            eScore = eReport ? eReport.finalEScore : 0;
            totalScore = parseFloat((dScore + eScore).toFixed(3));
            routineName = window.currentRoutineData?.name || "未命名成套";
            brand = window.currentRoutineData?.brand || "gymnova";
            shareCode = ShareEngine.generateShareCode();
        }

        const shortCode = this.generate6DigitCode();

        try {
            const { error } = await this.client
                .from('global_leaderboard')
                .insert([
                    {
                        username: username || "匿名用户",
                        routine_name: routineName,
                        d_score: dScore,
                        e_score: eScore,
                        total_score: totalScore,
                        brand: brand,
                        share_code: shareCode,
                        short_code: shortCode,
                        is_public: isPublic // ✨ 核心开关：决定是否上榜
                    }
                ]);

            if (error) throw error;

            // 成功提示也分流
            if (isPublic) {
                ToastManager.show('success', '冲榜成功！', `🎉 您的骄傲之作已打入排行榜！\n专属 6 位提取码为：【 ${shortCode} 】`, 5000);
                if (window.currentTab === 'leaderboard') this.renderLeaderboard();
            } else {
                navigator.clipboard.writeText(shortCode).then(() => {
                    ToastManager.show('success', '分享生成成功！', `🔗 您的专属 6 位提取码为：\n🔥 【 ${shortCode} 】 🔥\n已成功复制到剪贴板！`, 5000);
                }).catch(() => {
                    prompt("已生成！请手动复制以下 6 位提取码：", shortCode);
                });
            }

        } catch (err) {
            ToastManager.show('error', '云端同步失败', `上传失败: ${err.message}`);
        }
    },

    // 4. 核心功能：通过 6 位数提取码从 Supabase 精准提取并载入舞台
    importByShortCode: async function(code) {
        if (!this.client) return;
        const cleanCode = code.trim().toUpperCase();

        try {
            const { data, error } = await this.client
                .from('global_leaderboard')
                .select('share_code, routine_name, username')
                .eq('short_code', cleanCode)
                .maybeSingle();

            if (error) throw error;
            if (!data) {
                ToastManager.show('error', '找不到成套', '⚠️ 未找到该验证码对应的成套，请检查输入是否正确。');
                return;
            }

            // 穿透调用现有的还原算法进行画布平铺
            this.loadRoutine(btoa(data.share_code));
            ToastManager.show('success', '云端导入成功', `👋 已成功还原玩家【${data.username}】分享的成套：《${data.routine_name}》！`, 4000);

        } catch (err) {
            ToastManager.show('error', '导入失败', err.message);
        }
    },

    renderLeaderboard: async function() {
        const container = document.getElementById('leaderboardListGrid');
        if (!container) return;
        container.innerHTML = '<div class="col-span-full text-center py-20 text-slate-400 font-bold animate-pulse">📡 正在调取全球名将实时得分榜...</div>';

        try {
            // ✨ 核心查询修复：只拉取 is_public = true 的数据！
            const { data, error } = await this.client
                .from('global_leaderboard')
                .select('*')
                .eq('is_public', true)
                .order('total_score', { ascending: false })
                .limit(20);

            if (error) throw error;
            container.innerHTML = '';

            if (!data || data.length === 0) {
                container.innerHTML = '<p class="col-span-full text-center text-slate-400 py-10">🌐 奖牌榜空空如也，快来拿下首杀吧！</p>';
                return;
            }

            data.forEach((record, idx) => {
                let medalHtml = `<div class="w-7 h-7 rounded-full bg-slate-100 text-slate-500 font-black text-sm flex items-center justify-center">${idx + 1}</div>`;
                if (idx === 0) medalHtml = `<div class="w-7 h-7 rounded-full bg-amber-100 border border-amber-300 text-amber-600 font-black text-sm flex items-center justify-center shadow-sm">🥇</div>`;
                if (idx === 1) medalHtml = `<div class="w-7 h-7 rounded-full bg-slate-200 border border-slate-300 text-slate-600 font-black text-sm flex items-center justify-center shadow-sm">🥈</div>`;
                if (idx === 2) medalHtml = `<div class="w-7 h-7 rounded-full bg-orange-100 border border-orange-300 text-orange-600 font-black text-sm flex items-center justify-center shadow-sm">🥉</div>`;

                // 在卡片展示区，附带展示这个选手的 6 位验证码（供他人快速复制）
                const displayCode = record.short_code || "GEN25";

                container.innerHTML += `
                    <div class="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-lg hover:border-indigo-300 transition-all relative flex flex-col justify-between group">
                        <div>
                            <div class="flex justify-between items-start mb-3">
                                <div class="flex items-center gap-2 overflow-hidden pr-2">
                                    ${medalHtml}
                                    <h4 class="font-black text-base text-slate-800 truncate" title="${record.routine_name}">${record.routine_name}</h4>
                                </div>
                                <div class="text-right shrink-0">
                                    <div class="text-[10px] text-slate-400 font-bold">TOTAL</div>
                                    <div class="text-xl font-black text-indigo-600 leading-none">${record.total_score.toFixed(3)}</div>
                                </div>
                            </div>
                            <div class="text-xs font-bold text-slate-500 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 flex justify-between items-center mb-4">
                                <div>玩家: <span class="text-slate-800 font-extrabold">${record.username}</span></div>
                                <div class="text-[10px] text-indigo-500 font-black bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">代码: ${displayCode}</div>
                            </div>
                            <div class="grid grid-cols-2 gap-2 mb-4 text-center">
                                <div class="bg-blue-50/50 p-2 rounded-lg border border-blue-100 text-xs"><span class="text-slate-400 block text-[10px]">D 难度</span><span class="font-black text-blue-700">${record.d_score.toFixed(1)}</span></div>
                                <div class="bg-purple-50/50 p-2 rounded-lg border border-purple-100 text-xs"><span class="text-slate-400 block text-[10px]">E 完成</span><span class="font-black text-purple-700">${record.e_score.toFixed(3)}</span></div>
                            </div>
                        </div>
                        <div class="flex gap-2 items-center border-t border-slate-100 pt-3 mt-auto">
                            <button onclick="SupabaseEngine.loadRoutine('${btoa(record.share_code)}')" class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 rounded-xl shadow transition-colors">
                                🎬 舞台重现与回放
                            </button>
                        </div>
                    </div>
                `;
            });

        } catch (err) {
            container.innerHTML = `<div class="col-span-full text-center py-10 text-red-500 font-bold">⚠️ 调取失败: ${err.message}</div>`;
        }
    },

    loadRoutine: function(base64WrappedCode) {
        // 🟢 智能执裁互斥锁：如果画板是空的，直接无视锁定放行！
        const isBoardEmpty = typeof canvasManager === 'undefined' || !canvasManager.tracks || canvasManager.tracks.length === 0;
        
        if (!isBoardEmpty && (window.currentPlaybackMode === 'manual_e' || document.getElementById('manualJuryPanel') || document.getElementById('artistryScoreModal'))) {
            ToastManager.show('error', '操作被拦截 🛑', '当前正在执裁打分中！\n请先完成打分或清空画板，再导入新成套。', 5000);
            return; // 强制熔断
        }

        const rawCode = atob(base64WrappedCode);
        const result = ShareEngine.parseShareCode(rawCode);
        if (!result) return;

        canvasManager.tracks = result.tracks;
        window.currentRoutineData.name = result.name;
        window.currentRoutineData.brand = result.brand;
        window.currentRoutineData.gymnastMode = result.gMode;
        window.currentRoutineData.gymnastName = result.gName;

        // 🟢 核心改动：把原作者的打分报告直接“冻结”到全局变量中
        if (result.dReport) window.currentScoreReport = result.dReport;
        if (result.eReport) {
            window.currentEScoreReport = result.eReport;
            window.currentEScoreReport.isFrozen = true; // ✨ 打上“不可篡改”的思想钢印
        }
        
        if (typeof selectBrand === 'function') selectBrand(result.brand);
        const nameInput = document.getElementById('routineNameInput');
        if (nameInput) nameInput.value = result.name;

        canvasManager.redraw();
        if (typeof AppController !== 'undefined') AppController.updateUIRoutineList();

        // 6. 状态宣发：宣告画板已激活
        isRoutineInitialized = true;

        // ✨【新增核心点】：全网搜捕并强制关闭“选选手/新建成套”的拦截弹窗
        const initModals = ['routineInitModal', 'initModal', 'setupModal', 'welcomeModal', 'setupOverlay'];
        initModals.forEach(modalId => {
            const m = document.getElementById(modalId);
            if (m && !m.classList.contains('hidden')) {
                m.classList.add('hidden');
                m.style.display = 'none';
            }
        });
        if (typeof closeInitModal === 'function') closeInitModal();
        
        // 🟢 强制跳转画板页面核心逻辑
        try {
            const navBtn = document.querySelector('[onclick*="switchTab(\\\'builder\\\')"]');
            if (navBtn) {
                navBtn.click();
            } else if (typeof window.switchTab === 'function') {
                window.switchTab('builder');
            } else if (typeof switchTab === 'function') {
                switchTab('builder');
            }

            // 万能 DOM 强制干预
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
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (e) {
            console.error("页面自动跳转路由异常:", e);
        }

        setTimeout(() => ToastManager.show('success', '云端数据加载完毕', `🎬 动作铺设完毕\n您可以直接为她进行多种执裁模式的回放！`, 4500), 100);
        
        // 开启观赏模式 (锁定编辑)
        if (typeof AppController !== 'undefined' && typeof AppController.applyViewingMode === 'function') {
            AppController.applyViewingMode(true);
        }
    },

    startAutoRefresh: function() {
        if (this.autoRefreshTimer) clearInterval(this.autoRefreshTimer);
        this.autoRefreshTimer = setInterval(() => {
            if (window.currentTab === 'leaderboard') {
                this.renderLeaderboard();
            }
        }, 300000);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        SupabaseEngine.init();
        SupabaseEngine.startAutoRefresh();
    }, 200);
});