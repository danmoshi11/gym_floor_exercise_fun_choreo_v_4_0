// rules_engine.js (无模块纯前端全局版)
const RulesEngine = {
    // 局部匹配器：给特定动作吐出卡片
    getLocalDeductions: function(selectedSkill) {
        // 安全拦截：从全局 window 读取你清洗出来的扣分库，若无则给空数组，防止崩溃
        const eDeductions = window.e_jury_deductions || [];
        const dDeductions = window.d_jury_deductions || [];

        if (!selectedSkill || !selectedSkill.id) return { eJury: [], dJury: [] };

        let skillType = 'unknown';
        if (selectedSkill.id.startsWith('4.') || selectedSkill.id.startsWith('5.')) skillType = 'acro';
        else if (selectedSkill.id.startsWith('1.')) skillType = 'leaps';
        else if (selectedSkill.id.startsWith('2.')) skillType = 'turns';
        else if (selectedSkill.id.startsWith('3.')) skillType = 'hand_support';

        const eJury = eDeductions.filter(rule => {
            if (rule.target_tags && rule.target_tags.includes("global")) return false;
            const matchId = rule.target_ids && rule.target_ids.includes(selectedSkill.id);
            const matchTag = rule.target_tags && (
                rule.target_tags.includes(skillType) || 
                rule.target_tags.includes('all') ||
                (selectedSkill.tags && rule.target_tags.some(t => selectedSkill.tags.includes(t)))
            );
            return matchId || matchTag;
        });

        const dJury = dDeductions.filter(rule => {
            const matchId = rule.target_ids && rule.target_ids.includes(selectedSkill.id);
            const matchTag = rule.target_tags && (
                rule.target_tags.includes(skillType) || 
                rule.target_tags.includes('all') ||
                (selectedSkill.tags && rule.target_tags.some(t => selectedSkill.tags.includes(t)))
            );
            return matchId || matchTag;
        });

        return { eJury, dJury };
    },

    // 全局扫描器：扫描 tracks 寻找宏观编排错误
    scanGlobalArtistry: function(tracks) {
        let warnings = [];
        const eDeductions = window.e_jury_deductions || [];
        const validTracks = tracks.filter(t => t.skills && t.skills.length > 0);
        if (validTracks.length === 0) return warnings;

        const globalRules = eDeductions.filter(r => r.target_tags && r.target_tags.includes("global"));
        const getRule = (id) => globalRules.find(r => r.id === id);

        const firstTrack = validTracks[0];
        const lastTrack = validTracks[validTracks.length - 1];

        // 1. 开场接技巧
        if (firstTrack.type === 'line') {
            const rule = getRule('artistry_start_with_acro');
            if (rule) warnings.push(rule);
        }

        // 2. 技巧动作收尾
        if (lastTrack.type === 'line') {
            const rule = getRule('artistry_end_with_acro');
            if (rule) warnings.push(rule);
        }

        // 3. 超标技巧串
        let acroLinesCount = validTracks.filter(t => t.type === 'line').length;
        if (acroLinesCount > 4) {
            const rule = getRule('artistry_extra_acro_line');
            if (rule) warnings.push(rule);
        }

        const manualTriggers = globalRules.filter(r => 
            !['artistry_start_with_acro', 'artistry_end_with_acro', 'artistry_extra_acro_line'].includes(r.id)
        );

        return { warnings, manualTriggers };
    }
};

// 挂载到全局
window.RulesEngine = RulesEngine;