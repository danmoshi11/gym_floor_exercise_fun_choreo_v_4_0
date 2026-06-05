// ==========================================
// 自由体操 D分计算引擎 (d_score.js)
// ==========================================

const ChoreographyEngine = {
    diffValues: { 'A': 0.1, 'B': 0.2, 'C': 0.3, 'D': 0.4, 'E': 0.5, 'F': 0.6, 'G': 0.7, 'H': 0.8, 'I': 0.9, 'J': 1.0 },

    calculateDScore: function(tracks) {
        let totalDowngradePenalty = 0; 
        tracks.forEach(track => {
            if (!track.skills || track.skills.length === 0) return;
            
            const dJuryDemands = (track.manualDeductions || []).filter(d => d.isDScore);
            // 提取各种 D裁 封锁状态
            track.figNoDV = dJuryDemands.some(d => d.rawAction?.no_dv);
            track.figNoCV = dJuryDemands.some(d => d.rawAction?.no_cv);
            track.figNoCR = dJuryDemands.some(d => d.rawAction?.no_cr);
            track.figNoDMT = dJuryDemands.some(d => d.rawAction?.no_dismount_bonus);
            track.figDowngradeCount = dJuryDemands.filter(d => d.rawAction?.downgrade_to_other).length;

            // 统计降组扣分 (-0.1/次)
            // 统计降组扣分 (现在支持动态读取 penalty 分差，默认 0.1)
            if (track.figDowngradeCount > 0 && !track.figNoDV) {
                // 🟢 修改这里：遍历找具体罚分，取代硬编码的 0.1
                dJuryDemands.forEach(d => {
                    if (d.rawAction && d.rawAction.downgrade_to_other) {
                        totalDowngradePenalty += (d.rawAction.penalty || 0.1);
                    }
                });
            }
            
            // 把被判 0 分的动作打上无效标记
            if (track.figNoDV) {
                track.skills.forEach(s => s.figInvalid = true);
            }
        });
        
        let report = {
            dv: 0, cr: 0, cv: 0, dmtBonus: 0, totalD: 0,
            warnings: [], countedSkills: [],
            crDetails: { cr1: false, cr2: false, cr3: false, cr4: false }
        };

        let allSkills = [];
        let seenIds = new Set();
        let acroLinesCount = 0; 
        let validAcroLines = []; 
        let tuckTurnCount = 0;  
        tracks.forEach(t => t.dmtBonus = 0); // ✨ 先清空所有路线的下法标记 

        tracks.forEach(track => {
            // 纯路线工具，跳过不处理
            if (track.type === 'transit') return;

            let isAcroLine = track.type === 'line' && track.skills.length > 0;
            if (isAcroLine) {
                acroLinesCount++;
                if (acroLinesCount <= 4) validAcroLines.push(track);
                else report.warnings.push(`⛔ 规则限制：第 ${acroLinesCount} 串技巧串超出 4 串限制，不计入 DV！`);
            }

            track.skills.forEach(skill => {
                if (skill.figInvalid || track.figNoCR) return;
                let isDance = skill.id.startsWith('1.') || skill.id.startsWith('2.');
                let isTuckTurn = skill.nameZh.join().includes("蹲转");
                let canCountDV = true;

                if (isAcroLine && acroLinesCount > 4) canCountDV = false;
                if (seenIds.has(skill.id)) {
                    canCountDV = false;
                    report.warnings.push(`⚠️ 动作 [${skill.nameZh[0]}] 重复，只计入第一次 DV。`);
                }
                if (isTuckTurn) {
                    if (tuckTurnCount > 0) {
                        canCountDV = false;
                        report.warnings.push(`⚠️ 蹲转动作全套只能计入一次 DV。`);
                    }
                    tuckTurnCount++;
                }

                if (canCountDV) {
                    seenIds.add(skill.id);
                    allSkills.push({ ...skill, isDance: isDance });
                }
            });
        });

        // 2. 计算 DV
        allSkills.sort((a, b) => this.diffValues[b.difficulty] - this.diffValues[a.difficulty]);
        let danceCount = 0, acroCount = 0;
        
        allSkills.forEach(skill => {
            
            if (report.countedSkills.length >= 8) return; 
            if (skill.isDance && danceCount < 5) {
                report.countedSkills.push(skill);
                danceCount++;
            } else if (!skill.isDance && acroCount < 5) {
                report.countedSkills.push(skill);
                acroCount++;
            }
        });

        report.countedSkills.forEach(skill => report.dv += this.diffValues[skill.difficulty]);
        if (danceCount < 3) report.warnings.push(`⚠️ 舞蹈不足！当前 ${danceCount}/3 个。`);
        if (acroCount < 3) report.warnings.push(`⚠️ 技巧不足！当前 ${acroCount}/3 个。`);

        // 3. 计算 CR
        this.evaluateCR(tracks, allSkills, report);

        // 4. 计算 下法奖励
        if (acroLinesCount === 1) {
            report.dmtBonus = -0.5; 
            report.warnings.push(`⛔ 只有 1 串技巧，认定为【无下法】，D分扣除 0.5 分！`);
        } else if (acroLinesCount === 2) {
            report.dmtBonus = 0;
            report.warnings.push(`⚠️ 只有 2 串技巧，无法获得 0.2 下法加分（需3串及以上）。`);
        } else if (acroLinesCount >= 3) {
            let lastValidLine = validAcroLines[validAcroLines.length - 1]; 
            let highestDmtVal = -1;
            lastValidLine.skills.forEach(s => {
                let val = this.diffValues[s.difficulty];
                if (val > highestDmtVal) highestDmtVal = val;
            });
            if (highestDmtVal >= 0.4) {
                report.dmtBonus = 0.2;
                lastValidLine.dmtBonus = 0.2; // ✨ 核心：将 0.2 的下法加分印章，精准盖在这条路线上！
            } else if (highestDmtVal !== -1) {
                report.warnings.push(`💡 最后一串最高难度未达 D 组，缺少下法 0.2 奖励。`);
            }
        }

        // ==========================================
        // 终极核算：下法加分二次核查与 D裁剥夺拦截
        // ==========================================
        report.dmtBonus = 0;
        tracks.forEach(t => {
            // 🟢 如果这条路线被 D裁判定无下法加分，或整体动作无效
            if (t.figNoDMT || t.figNoDV) {
                t.dmtBonus = 0; // 剥夺加分
            }
            // 累加真正的下法加分（通常只有最后一条技巧串有分）
            if (t.dmtBonus) {
                report.dmtBonus += t.dmtBonus;
            }
        });

        // 格式化精度
        report.dv = parseFloat(report.dv.toFixed(2));
        report.cv = parseFloat(report.cv.toFixed(2));
        
        // ✨ 终极汇总：难度价值 + 编排要求 + 连接加分 + 下法加分 - D裁降组扣分
        report.totalD = parseFloat((report.dv + report.cr + report.cv + report.dmtBonus - totalDowngradePenalty).toFixed(3));
        
        return report;
    },

    evaluateCR: function(tracks, allSkills, report) {
        let hasFwd = false, hasBwd = false;
        tracks.forEach(track => {
            if (track.type === 'curve' && track.skills.length >= 2) {
                let uniqueSkills = new Set(track.skills.map(s => s.id));
                if (uniqueSkills.size >= 2 && track.skills.some(s => s.tags && s.tags.includes('cr1'))) {
                    report.crDetails.cr1 = true;
                }
            }
        });
        if (!report.crDetails.cr1) report.warnings.push(`⚠️ CR1未满足：缺少舞蹈串(含180°劈叉)。`);

        allSkills.forEach(skill => {
            if (skill.tags) {
                if (skill.tags.includes('cr2')) report.crDetails.cr2 = true;
                if (skill.tags.includes('cr3')) report.crDetails.cr3 = true;
                if (skill.tags.includes('fwd')) hasFwd = true;
                if (skill.tags.includes('bwd')) hasBwd = true;
            }
        });

        if (!report.crDetails.cr2) report.warnings.push(`⚠️ CR2未满足：空翻缺≥360°转体。`);
        if (!report.crDetails.cr3) report.warnings.push(`⚠️ CR3未满足：缺双周空翻。`);
        if (hasFwd && hasBwd) report.crDetails.cr4 = true;
        else report.warnings.push(`⚠️ CR4未满足：成套中需同时包含【向前】和【向后】空翻。`);

        if (report.crDetails.cr1) report.cr += 0.5;
        if (report.crDetails.cr2) report.cr += 0.5;
        if (report.crDetails.cr3) report.cr += 0.5;
        if (report.crDetails.cr4) report.cr += 0.5;
    },

    calculateCV: function(tracks) {
        let cvScore = 0;
        // 将难度字母转换为数值，方便做大小比较：A=1, B=2, C=3, D=4, E=5...
        const getVal = (diff) => this.diffValues[diff] * 10; 

        tracks.forEach(track => {
            track.cvValue = 0; // ✨【核心新增】：每次重算前，初始化单条路线的专属 CV 为 0
            if (track.type === 'transit') return; // 纯路线无加分
            
            let trackCv = 0; // ✨【核心新增】：设立单串 CV 计数器
            
            if (track.skills.length >= 2) {
                // 遍历每个技巧串里相邻的两个动作间隙
                for (let i = 0; i < track.skills.length - 1; i++) {
                    let s1 = track.skills[i];
                    let s2 = track.skills[i+1];
                    let v1 = getVal(s1.difficulty);
                    let v2 = getVal(s2.difficulty);
                    
                    // 读取当前颗粒度连接符 (如果没选则默认 direct)
                    let currentConnectType = 'direct';
                    if (track.connections && track.connections[i]) {
                        currentConnectType = track.connections[i];
                    } else if (track.connectionType) {
                        currentConnectType = track.connectionType;
                    }
                    
                    let isDirect = (currentConnectType === 'direct'); 
                    
                    let type1 = s1.id.startsWith('2.') ? 'turn' : (s1.id.startsWith('1.') ? 'dance' : 'acro');
                    let type2 = s2.id.startsWith('2.') ? 'turn' : (s2.id.startsWith('1.') ? 'dance' : 'acro');

                    if (track.type === 'line') { 
                        // ==========================================
                        // 1. 混合连接 (技巧 + 舞蹈，必须直接)
                        // ==========================================
                        if (type1 === 'acro' && type2 === 'dance' && isDirect) {
                            if (v1 === 4 && v2 >= 2) trackCv += 0.1; // 💡 修改：cvScore 改为 trackCv
                            if (v1 >= 5 && v2 >= 1) trackCv += 0.1;  
                        }
                        // ==========================================
                        // 2. 纯技巧连接 (Acro + Acro)
                        // ==========================================
                        else if (type1 === 'acro' && type2 === 'acro') {
                            
                            if (isDirect) { 
                                // 【情况 A： '+' 直接连接】
                                if ((v1 >= 1 && v2 >= 5) || (v1 >= 5 && v2 >= 1)) {
                                    trackCv += 0.2; 
                                } 
                                else if ((v1 >= 2 && v2 >= 4) || (v1 >= 4 && v2 >= 2)) {
                                    trackCv += 0.2; 
                                }
                                else if ((v1 === 1 && v2 === 4) || (v1 === 4 && v2 === 1)) {
                                    trackCv += 0.1; 
                                } 
                                else if (v1 === 3 && v2 === 3) {
                                    trackCv += 0.1; 
                                }
                                
                            } else { 
                                // 【情况 B： '++' 间接连接】
                                let matched3Skill = false;
                                
                                if (i >= 1) {
                                    let s0 = track.skills[i-1];
                                    let type0 = s0.id.startsWith('2.') ? 'turn' : (s0.id.startsWith('1.') ? 'dance' : 'acro');
                                    let prevConnectType = (track.connections && track.connections[i-1]) ? track.connections[i-1] : (track.connectionType || 'direct');
                                    
                                    if (type0 === 'acro' && prevConnectType === 'direct') {
                                        let v0 = getVal(s0.difficulty);
                                        
                                        if (v0 >= 1 && v1 >= 1 && v2 >= 5) {
                                            trackCv += 0.2;
                                            matched3Skill = true;
                                        }
                                        else if (v0 >= 1 && v1 >= 1 && v2 === 4) {
                                            trackCv += 0.1;
                                            matched3Skill = true;
                                        }
                                    }
                                }
                                
                                if (!matched3Skill) {
                                    if ((v1 >= 3 && v2 >= 4) || (v1 >= 4 && v2 >= 3)) {
                                        trackCv += 0.2;
                                    }
                                    else if ((v1 === 2 && v2 === 4) || (v1 === 4 && v2 === 2)) {
                                        trackCv += 0.1;
                                    }
                                }
                            }
                        }
                    } 
                    // ==========================================
                    // 3. 单腿立转连接 (Turn + Turn)
                    // ==========================================
                    else if (track.type === 'point' && type1 === 'turn' && type2 === 'turn' && isDirect) {
                        if (v1 >= 4 && v2 >= 2) trackCv += 0.1;
                    }
                }
            }
            // 🟢 新增：如果 D 裁判定该串无连接价值，CV 强制清零！
            if (track.figNoCV || track.figNoDV) {
                trackCv = 0; 
            }
            // ✨【核心功能点】：将当前行算出的 CV 完美封存进入 track 对象
            track.cvValue = parseFloat(trackCv.toFixed(2));
            // 累加汇总给总D分引擎
            cvScore += track.cvValue;
        });
        return parseFloat(cvScore.toFixed(2));
    }
};