// ==========================================
// GymChoreo 独家数据密钥压缩与口令分享引擎 (share_engine.js)
// ==========================================

const ShareEngine = {
    // 1. 【高阶抽样压缩】：将轨迹点集脱水压榨，极大缩减口令长度
    compressTrack: function(t) {
        let sampledPoints = t.points;
        if (t.type === 'curve' && t.points.length > 8) {
            sampledPoints = t.points.filter((_, idx) => idx % 4 === 0);
            if ((t.points.length - 1) % 4 !== 0) sampledPoints.push(t.points[t.points.length - 1]);
        } else if (t.type === 'line' && t.points.length >= 2) {
            sampledPoints = [t.points[0], t.points[t.points.length - 1]];
        }

        // 🟢 撤销洗白：尊重原作者，保留当年拖拽上去的所有红蓝卡片！
        return {
            ty: t.type,
            pts: sampledPoints.map(p => [Math.round(p.x), Math.round(p.y)]), 
            sk: t.skills.map(s => `${s.id}|${s.nameZh[0]}`),
            ct: t.connections || [],
            nd: t.nd || 0,
            md: t.manualDeductions ? t.manualDeductions.map(d => `${d.skillIdx}|${d.deduction}|${d.isArtistry?1:0}|${d.isDScore?1:0}|${d.faultName}`) : []
        };
    },

    // 2. 【双模生成引擎】
    generateShareCode: function(customRoutinePayload = null) {
        let routinePayload;
        if (customRoutinePayload) {
            routinePayload = {
                name: customRoutinePayload.name,
                brand: customRoutinePayload.brand,
                gName: customRoutinePayload.gName || "未知选手",
                gMode: customRoutinePayload.gMode || "none",
                tracks: customRoutinePayload.tracks.map(t => this.compressTrack(t)),
                // ✨ 将历史草稿的成绩单一起封装！
                dReport: customRoutinePayload.dReport || null,
                eReport: customRoutinePayload.eReport || null
            };
        } else {
            if (!canvasManager || canvasManager.tracks.length === 0) return null;
            routinePayload = {
                name: window.currentRoutineData?.name || "未命名成套",
                brand: window.currentRoutineData?.brand || "gymnova",
                gName: window.currentRoutineData?.gymnastName || "未知选手",
                gMode: window.currentRoutineData?.gymnastMode || "none",
                tracks: canvasManager.tracks.map(t => this.compressTrack(t)),
                // ✨ 核心升级：把当前画板上已经算好的、确定的最终成绩单，打包进时空胶囊！
                dReport: window.currentScoreReport || null,
                eReport: window.currentEScoreReport || null
            };
        }

        const jsonStr = JSON.stringify(routinePayload);
        const utf8Bytes = encodeURIComponent(jsonStr).replace(/%([0-9A-F]{2})/g, function(match, p1) {
            return String.fromCharCode('0x' + p1);
        });
        return `#GYM-${btoa(utf8Bytes)}#`;
    },

    // 3. 【解密还原】
    parseShareCode: function(code) {
        try {
            if (!code.startsWith('#GYM-') || !code.endsWith('#')) return null;
            const base64Str = code.slice(5, -1);
            const binaryStr = atob(base64Str);
            const jsonStr = decodeURIComponent(binaryStr.split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            const payload = JSON.parse(jsonStr);
            const restoredTracks = payload.tracks.map(t => {
                const restoredMd = (t.md || []).map(str => {
                    const parts = str.split('|');
                    return {
                        skillIdx: parseInt(parts[0]),
                        deduction: parseFloat(parts[1]),
                        isArtistry: parts[2] === '1',
                        isDScore: parts[3] === '1',
                        faultName: parts.slice(4).join('|')
                    };
                });
                const totalMd = restoredMd.reduce((sum, d) => sum + d.deduction, 0);

                const fullSkills = t.sk.map(item => {
                    if (item.includes('|')) {
                        const [id, name] = item.split('|');
                        return skillsData.find(s => s.id === id && s.nameZh[0] === name);
                    }
                    return skillsData.find(s => s.id === item);
                }).filter(Boolean);
                
                return {
                    id: 'track_' + Date.now() + '_' + Math.random(),
                    type: t.ty,
                    points: t.pts.map(p => ({ x: p[0], y: p[1] })),
                    skills: fullSkills,
                    connections: t.ct,
                    connectionType: 'direct',
                    nd: t.nd,
                    color: t.ty === 'transit' ? '#9ca3af' : canvasManager.morandiColors[Math.floor(Math.random() * 8)],
                    manualDeductions: restoredMd,
                    manualDeductionTotal: totalMd
                };
            });

            return {
                name: payload.name, brand: payload.brand, gName: payload.gName, gMode: payload.gMode,
                tracks: restoredTracks,
                // ✨ 提取原作者的成绩单快照
                dReport: payload.dReport || null,
                eReport: payload.eReport || null
            };
        } catch (e) {
            console.error(e);
            return null;
        }
    },

    // 4. 【异步托管】：提取码直接移交云端引擎
    importRoutineWorkflow: function() {
        // 🟢 智能执裁互斥锁：如果画板是空的，直接无视锁定放行！
        const isBoardEmpty = typeof canvasManager === 'undefined' || !canvasManager.tracks || canvasManager.tracks.length === 0;
        
        if (!isBoardEmpty && (window.currentPlaybackMode === 'manual_e' || document.getElementById('manualJuryPanel') || document.getElementById('artistryScoreModal'))) {
            ToastManager.show('error', '操作被拦截 🛑', '当前正在执裁打分中！\n请先完成打分或清空画板，再导入新成套。', 5000);
            return; // 强制熔断
        }

        const code = prompt("📥 请输入好友分享给您的 6 位数成套提取码 (例如 X7R2Y9)：");
        if (!code || code.trim() === "") return;

        if (typeof SupabaseEngine !== 'undefined') {
            SupabaseEngine.importByShortCode(code.trim());
        } else {
            if(typeof ToastManager !== 'undefined') ToastManager.show('error', '连接失败', '云端引擎尚未准备就绪，请刷新重试！');
        }
    }
};

window.ShareEngine = ShareEngine;