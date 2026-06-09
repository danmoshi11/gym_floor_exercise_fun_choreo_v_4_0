// ==========================================
// 自由体操 E分(执行分) 计算引擎 (e_score.js)
// 包含物理场地特性、标签系统与【D分体力阈值系统】
// ==========================================

const ExecutionEngine = {
    
    // 模拟单个裁判打分：引入标签影响 + 阈值影响
    generateJudgeScore: function(baseScore, tags = [], deltaD = 0) {
        let fluctuation = 0;

        // 核心：每次亮相，先摇一次总骰子，摇出 0.0 到 1.0 之间的数
        let roll = Math.random(); 

        if (tags.includes('erratic')) {
            // ==========================================
            // 神经刀选手 (你调整后的参数)
            // ==========================================
            if (roll < 0.20) { 
                fluctuation = (Math.random() * 0.4) - 0.4; // 范围 [-0.4 到 -0.0)
            } else if (roll < 0.35) { 
                fluctuation = (Math.random() * 0.2);       // 范围 [0.0 到 +0.2)
            } else { 
                fluctuation = (Math.random() * 0.8) - 0.4; // 范围 [-0.4 到 +0.4)
            }
        } else if (tags.includes('stable')) {
            // ==========================================
            // 大心脏选手 (你调整后的参数: -0.2 到 +0.3)
            // ==========================================
            fluctuation = (Math.random() * 0.5) - 0.2; 
        } else {
            // ==========================================
            // 普通选手 (-0.3 到 +0.3)
            // ==========================================
            fluctuation = (Math.random() * 0.6) - 0.3; 
        }

        // ==========================================
        // 【新增】D分体力阈值干预 (超难度压分，降难度抬分)
        // ==========================================
        if (deltaD >= 0.4) {
            let shift = -0.5 * deltaD; // 差值偏移 (超0.5难度，E分中枢降0.1)
            let spread = 0.1 * Math.abs(deltaD); // 波动扩大
            let extraFluctuation = shift + (Math.random() * spread * 2) - spread;
            fluctuation += extraFluctuation;
        } else if (deltaD <= -0.4) {
            let shift = -0.5 * deltaD; // 降难度时给予正向偏移（抬分）
            let spread = 0.04 * Math.abs(deltaD); // 降难度时波动范围缩小
            let extraFluctuation = shift + (Math.random() * spread * 2) - spread;
            fluctuation += extraFluctuation;
        }

        let finalScore = baseScore + fluctuation;
        if (finalScore > 10.0) finalScore = 10.0;
        return parseFloat(finalScore.toFixed(1)); 
    },

    // 核心 E 分计算公式 (接收 actualD 实际D分参数)
    calculateEScore: function(gymnastId, tracks, actualD = 0) {
        // ==================================================
        // 🌟 新增拦截：手动打分模式 (Manual E-Jury)
        // ==================================================
        if (window.currentPlaybackMode === 'manual_e') {
            let report = {
                baseScore: 10.0,
                fallCount: 0,
                fallDeduction: 0,
                totalDeduction: 0,
                finalEScore: 10.0,
                fallTrackIds: [],
                details: [],      // 记录扣分明细
                judgesScores: []  // 记录6个裁判分
            };

            let localDeduction = 0;
            
            // 汇总用户在打分面板点选的扣分
            tracks.forEach((track, index) => {
                if (track.manualDeductionTotal > 0) {
                    localDeduction += track.manualDeductionTotal;
                    if (track.manualDeductions) {
                        track.manualDeductions.forEach(fault => {
                            // 扣 1.0 的记为摔倒，告诉动画去扑街
                            if (fault.deduction === 1.0) {
                                report.fallCount++;
                                if (!report.fallTrackIds.includes(track.id)) {
                                    report.fallTrackIds.push(track.id);
                                }
                            }
                            report.details.push(`[路线${index+1}] ${fault.faultName} : -${fault.deduction.toFixed(1)}`);
                        });
                    }
                }
            });

            // 自动汇总全局编排艺术扣分
            let globalArtistry = window.RulesEngine ? window.RulesEngine.scanGlobalArtistry(tracks) : { warnings: [] };
            let globalDeduction = 0;
            
            globalArtistry.warnings.forEach(warning => {
                globalDeduction += warning.deduction;
                report.details.push(`[全局编排] ${warning.name} : -${warning.deduction.toFixed(1)}`);
            });

            // 结算成绩
            report.fallDeduction = report.fallCount * 1.0; 
            report.totalDeduction = localDeduction + globalDeduction;
            report.finalEScore = Math.max(0, 10.0 - report.totalDeduction);
            report.finalEScore = Math.round(report.finalEScore * 1000) / 1000; 
            report.judgesScores = Array(6).fill(report.finalEScore);

            return report; // 直接返回结果，绝不干扰你下面的玄学代码！
        }
        // ===================== 拦截结束 =====================

        // 👇👇👇 下面是你原本的 let report = {...}; 和所有大心脏/神经刀逻辑，一行都不用改！👇👇👇
        
        // 【修复Bug】：当 gymnastId 是 'none' 或 'custom' 时，使用默认选手数据
        let gymnast = gymnastsData.find(g => g.id === gymnastId);
        if (!gymnast) {
            // 'none' 或 'custom' 模式使用一个平均水平的默认选手
            // 使用 Rebeca Andrade 的数据作为基准（edBase: 8.3, adMean: 0.2, stable）
            gymnast = {
                id: gymnastId,
                name: gymnastId === 'none' ? '纯排位测试' : '自定义选手',
                country: 'TST',
                adMean: 0.3,
                edBase: 8.3,
                usualD: 0,
                cost: 10,
                tags: ['stable']
            };
        }

        const currentBrand = window.currentRoutineData ? window.currentRoutineData.brand : 'gymnova';
        const tags = gymnast.tags || []; 

        // ==================================================
        // 【新增】获取该选手的常用 D分，计算体力阈值差
        // ==================================================
        const usualD = gymnast.usualD || 0; 
        let deltaD = 0;
        if (usualD > 0 && actualD > 0) {
            deltaD = actualD - usualD;
            
            // 🛑 【防逃课机制：不对称极值限制】
            // 玩家超难度时：最多承受 +1.2 的惩罚差值
            // 玩家逃课降难度时：最多只能享受 -0.5 的奖励差值（降再多也不会继续涨 E 分了）
            deltaD = Math.max(-1.0, Math.min(2.0, deltaD));
        }

        // ==================================================
        // 核心玄学 A：艺术分(AD)计算
        // ==================================================
        let finalAD = gymnast.adMean;
        let adRand = Math.random();
        if (adRand < 0.15) finalAD += 0.1; 
        else if (adRand < 0.30) finalAD -= 0.1;
        
        finalAD = Math.round(finalAD * 10) / 10;
        if (finalAD < 0) finalAD = 0;

        let report = {
            gymnastNameEn: gymnast.nameEn,
            country: gymnast.country,
            judges: [],           
            averageScore: 0,      
            artisticDeduction: finalAD, 
            fallCount: 0,         
            fallDeduction: 0,     
            fallTrackIds: [],     
            finalEScore: 0        
        };

        // ==================================================
        // 生成裁判平均分 (将 deltaD 传给裁判)
        // ==================================================
        for (let i = 0; i < 3; i++) {
            report.judges.push(this.generateJudgeScore(gymnast.edBase, tags, deltaD));
        }
        let sum = report.judges.reduce((a, b) => a + b, 0);
        report.averageScore = parseFloat((sum / 3).toFixed(3));

        // ==================================================
        // 核心玄学 B：计算最终摔倒概率 (保留了你修改的数值)
        // ==================================================
        
        // 技巧串摔倒概率（受场地因素影响）
        let lineFallProbability = 0.05; 
        if (currentBrand === 'taishan') lineFallProbability += 0.03; 
        if (tags.includes('fall')) lineFallProbability += 0.05; 
        if (tags.includes('stable')) lineFallProbability = Math.max(0.01, lineFallProbability - 0.03); 

        // 【新增】超负荷摔倒惩罚：如果难度超了常用难度 0.4 以上，额外增加 5% 摔倒率！
        if (deltaD > 0.4) {
            lineFallProbability += 0.05; 
        }

        // 跳步和舞蹈摔倒概率（不受场地因素影响，只受选手属性影响，基础概率 3%）
        let nonLineFallProbability = 0.03;
        if (tags.includes('fall')) nonLineFallProbability += 0.05;
        if (tags.includes('stable')) nonLineFallProbability = Math.max(0.005, nonLineFallProbability - 0.02);

        tracks.forEach(track => {
            if (track.skills && track.skills.length > 0) {
                let currentFallProbability = 0;
                
                if (track.type === 'line') {
                    // 技巧串：使用完整的摔倒概率
                    currentFallProbability = lineFallProbability;
                } else if (track.type === 'point' || track.type === 'curve') {
                    // 跳步和舞蹈：使用较低的摔倒概率，不受场地因素影响
                    currentFallProbability = nonLineFallProbability;
                }
                
                if (currentFallProbability > 0 && Math.random() < currentFallProbability) {
                    report.fallCount++;
                    report.fallDeduction += 1.0; 
                    report.fallTrackIds.push(track.id); 
                }
            }
        });

        // ==================================================
        // 核心玄学 C：计算额外 E 分扣罚 (保留了你修改的数值)
        // ==================================================
        let extraEDeduction = 0;
        
        if (currentBrand === 'spieth') {
            if (Math.random() < 0.15) {
                extraEDeduction += parseFloat((Math.random() * 0.2 + 0.1).toFixed(1));
            }
        }

        if (tags.includes('strict')) {
            extraEDeduction += parseFloat((Math.random() * 0.2).toFixed(1));
        }

        // ==================================================
        // 终极结算
        // ==================================================
        report.finalEScore = report.averageScore - report.artisticDeduction - report.fallDeduction - extraEDeduction;
        
        if (report.finalEScore < 0) report.finalEScore = 0;
        report.finalEScore = parseFloat(report.finalEScore.toFixed(3));

        return report;
    }
};