// ==========================================
// 📝 智能提示助手 - 简化复杂功能
// ==========================================

window.HelpAssistant = {
    // 功能说明
    features: {
        'routine': {
            title: '🤸‍♀️ 成套编排',
            content: '先选择"新建成套编排"配置选手和场地，然后在画布上画线标记动作，点击"完成编排"即可计算分数！'
        },
        'music': {
            title: '🎵 音乐功能',
            content: '音乐库分为两栏：左侧是系统自带的精选体操音乐，右侧是您上传的私人音乐。点击任意音乐卡片即可播放！'
        },
        'demo2d': {
            title: '🎬 2D演示',
            content: '编排完动作后，系统会自动演示运动员在场地的运动轨迹，让您直观地检查编排效果！'
        },
        'score': {
            title: '🏆 算分系统',
            content: 'D分表示难度分，越高越难；E分表示完成分，10分制，扣得越少越好。完成编排后会自动计算最终成绩！'
        },
        'upload': {
            title: '📤 上传素材',
            content: '可以上传自己的音乐、图片和视频到系统。点击右下角的问号按钮查看新手教程！'
        }
    },

    // 显示提示
    showTip: function(featureKey) {
        const feature = this.features[featureKey];
        if (feature && typeof ToastManager !== 'undefined') {
            ToastManager.show('info', feature.title, feature.content, 5000);
        }
    },

    // 添加帮助按钮
    addHelpButtons: function() {
        // 在关键功能旁添加小问号按钮
        const helpPoints = [
            { selector: '#navTabs', feature: 'routine', position: 'after' },
            { selector: '#tab-music', feature: 'music', position: 'after' },
            { selector: '#floorContainer', feature: 'demo2d', position: 'before' },
            { selector: '#score-totalD', feature: 'score', position: 'after' }
        ];

        helpPoints.forEach(point => {
            const element = document.querySelector(point.selector);
            if (element) {
                const helpBtn = document.createElement('button');
                helpBtn.innerHTML = '❓';
                helpBtn.className = 'text-xs ml-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer';
                helpBtn.title = '查看帮助';
                helpBtn.onclick = (e) => {
                    e.stopPropagation();
                    this.showTip(point.feature);
                };
                
                if (point.position === 'after') {
                    element.parentNode.insertBefore(helpBtn, element.nextSibling);
                } else {
                    element.parentNode.insertBefore(helpBtn, element);
                }
            }
        });
    },

    // 初始化
    init: function() {
        // 页面加载完成后添加帮助按钮
        setTimeout(() => {
            this.addHelpButtons();
        }, 1000);
    }
};

// 自动初始化
document.addEventListener('DOMContentLoaded', () => {
    if (typeof HelpAssistant !== 'undefined') {
        HelpAssistant.init();
    }
});
