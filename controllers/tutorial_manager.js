// ==========================================
// 📚 智能演示教程系统 - 完整流程演示版
// ==========================================
(function() {
    'use strict';

    const TUTORIAL_STATES = {
        NOT_STARTED: 'not_started',
        IN_PROGRESS: 'in_progress',
        COMPLETED: 'completed'
    };

    // 完整的演示教程步骤
    const DEMO_ROUTINE = {
        name: '2025全锦赛决赛',
        gymnast: '🏆 周雅琴 (中国)',
        brand: 'gymnova',
        skills: [
            { type: 'curve', points: [{x: 200, y: 200}, {x: 300, y: 150}, {x: 400, y: 200}], skillName: '1组-交换腿结环跳(A)' },
            { type: 'line', points: [{x: 400, y: 200}, {x: 500, y: 250}], skillName: '3组-前手翻(A)' },
            { type: 'line', points: [{x: 500, y: 250}, {x: 450, y: 350}], skillName: '5组-后团一周(D)' },
            { type: 'curve', points: [{x: 450, y: 350}, {x: 350, y: 400}, {x: 300, y: 500}], skillName: '2组-狼跳(C)' }
        ]
    };

    // 教程步骤
    const TUTORIAL_STEPS = [
        {
            id: 'welcome',
            title: '🎉 欢迎来到 GymChoreo',
            content: '让我为您演示一个完整的自由体操编排流程！\n\n我们将创建一个包含4个动作的成套编排，包括跳步、转体、空翻等元素。\n\n点击「开始演示」观看完整流程！',
            type: 'modal',
            actions: [
                { text: '跳过，直接进入系统', type: 'secondary', action: 'skip' },
                { text: '开始演示', type: 'primary', action: 'startDemo' }
            ]
        },
        {
            id: 'step1_welcome',
            title: '🚀 第一步：进入编排系统',
            content: '这是系统首页！点击右下角的按钮可以上传私人音乐和素材。\n\n点击「下一步」开始创建我们的演示编排...',
            element: '#heroSection',
            type: 'highlight',
            actions: [
                { text: '下一步', type: 'primary', action: 'next' }
            ]
        },
        {
            id: 'step2_enter_builder',
            title: '🚀 点击「进入工作台」',
            content: '点击主按钮进入编排工作台...\n\n（系统将自动点击进入）',
            element: 'button:has-text("进入工作台")',
            type: 'click',
            autoAction: 'clickEnter',
            actions: [
                { text: '我自己来', type: 'secondary', action: 'next' }
            ]
        },
        {
            id: 'step3_create_routine',
            title: '✨ 第二步：创建新编排',
            content: '欢迎来到编排工作台！\n\n点击「新建成套编排」开始创建我们的演示编排...',
            element: '#newRoutineBtn',
            type: 'highlight',
            actions: [
                { text: '知道了', type: 'primary', action: 'next' }
            ]
        },
        {
            id: 'step4_setup_routine',
            title: '📝 配置编排信息',
            content: '现在配置我们的演示编排：\n• 名称：2025全锦赛决赛\n• 选手：周雅琴 (中国)\n• 场地：Gymnova\n\n（系统将自动填写这些信息）',
            element: '#viewSetup',
            type: 'highlight',
            autoAction: 'autoFillSetup',
            actions: [
                { text: '我自己填', type: 'secondary', action: 'next' }
            ]
        },
        {
            id: 'step5_enter_canvas',
            title: '🎨 第三步：进入画布',
            content: '配置完成！\n\n点击「进入编排战术板」进入画布，开始编排动作...\n\n（系统将自动进入）',
            element: 'button:has-text("进入编排战术板")',
            type: 'click',
            autoAction: 'clickEnterBuilder',
            actions: [
                { text: '我自己进', type: 'secondary', action: 'next' }
            ]
        },
        {
            id: 'step6_draw_skill1',
            title: '🎯 第四步：编排动作 #1',
            content: '🏃 现在开始演示画线！\n\n我们将画一个「交换腿结环跳」的路线...\n\n在画布上画一条曲线来表示跳步路线。\n\n（系统将在2秒后自动画线）',
            element: '#floorCanvas',
            type: 'highlight',
            autoAction: 'drawSkill1',
            actions: [
                { text: '我自己画', type: 'secondary', action: 'next' }
            ]
        },
        {
            id: 'step7_see_sequence',
            title: '📋 查看动作序列',
            content: '✅ 动作已添加！\n\n右侧的动作序列面板显示了刚才画的「1组-交换腿结环跳(A)」\n\n这就是你的成套动作之一！继续添加更多动作...',
            element: '#routineList',
            type: 'highlight',
            actions: [
                { text: '继续演示', type: 'primary', action: 'next' }
            ]
        },
        {
            id: 'step8_draw_skill2',
            title: '🎯 编排动作 #2 - 技巧',
            content: '🏃 现在画一个「前手翻」的技巧动作...\n\n用直线表示技巧连接。\n\n（系统将在2秒后自动画线）',
            element: '#floorCanvas',
            type: 'highlight',
            autoAction: 'drawSkill2',
            actions: [
                { text: '继续', type: 'primary', action: 'next' }
            ]
        },
        {
            id: 'step9_draw_skill3',
            title: '🎯 编排动作 #3 - 空翻',
            content: '翻空翻！画一个「后团一周」的动作...\n\n（系统将在2秒后自动画线）',
            element: '#floorCanvas',
            type: 'highlight',
            autoAction: 'drawSkill3',
            actions: [
                { text: '继续', type: 'primary', action: 'next' }
            ]
        },
        {
            id: 'step10_draw_skill4',
            title: '🎯 编排动作 #4 - 结束',
            content: '最后画一个「狼跳」作为结束动作...\n\n（系统将在2秒后自动画线，然后完成编排）',
            element: '#floorCanvas',
            type: 'highlight',
            autoAction: 'drawSkill4',
            actions: [
                { text: '我自己画', type: 'secondary', action: 'next' }
            ]
        },
        {
            id: 'step11_complete',
            title: '🎊 编排完成！',
            content: '🎉 演示编排已完成！\n\n右侧动作序列显示了我们添加的4个动作。\n\n现在点击「完成编排并计算最终成绩」来查看分数！',
            element: 'button:has-text("完成编排")',
            type: 'highlight',
            autoAction: 'clickComplete',
            actions: [
                { text: '我自己点', type: 'secondary', action: 'next' }
            ]
        },
        {
            id: 'step12_scores',
            title: '🏆 第五步：查看成绩',
            content: '📊 成绩已计算完成！\n\n• DV (难度值): 1.5\n• CR (连接价值): 0.2\n• CV (编排价值): 0.5\n• D分: 2.2\n• E分: 8.0 (示例)\n• 总分: 10.2\n\n这就是你的成套最终得分！',
            element: '#score-totalD',
            type: 'highlight',
            actions: [
                { text: '太棒了！', type: 'primary', action: 'next' }
            ]
        },
        {
            id: 'step13_music',
            title: '🎵 第六步：使用音乐库',
            content: '🎵 现在点击顶部的「音乐库」标签\n\n你可以：\n• 欣赏精选体操音乐\n• 上传自己的音乐\n• 使用内置播放器播放',
            element: '#tab-music',
            type: 'click',
            autoAction: 'clickMusicTab',
            actions: [
                { text: '我自己点', type: 'secondary', action: 'next' }
            ]
        },
        {
            id: 'step14_music_explain',
            title: '🎶 音乐库功能说明',
            content: '🎶 音乐库功能：\n\n【左侧】精选体操音乐\n• 包含世界顶级选手的比赛音乐\n• 点击即可播放欣赏\n\n【右侧】我的音乐库\n• 上传自己的私人音乐\n• 点击播放\n\n【顶部】播放器\n• 显示当前播放的音乐\n• 可以暂停、调节音量',
            element: '#musicPlayer',
            type: 'highlight',
            actions: [
                { text: '继续', type: 'primary', action: 'next' }
            ]
        },
        {
            id: 'step15_demo',
            title: '🎬 第七步：2D演示功能',
            content: '🎬 重要功能：2D演示！\n\n编排完成后，系统可以演示运动员在场地的运动轨迹！\n\n这帮助您直观地检查编排效果。\n\n（通常在画布下方有演示按钮）',
            element: '#floorContainer',
            type: 'highlight',
            actions: [
                { text: '继续', type: 'primary', action: 'next' }
            ]
        },
        {
            id: 'step16_tips',
            title: '💡 使用技巧',
            content: '💡 几个实用小技巧：\n\n1️⃣ 点击动作卡片可查看动作详情\n2️⃣ 使用「拖拽」工具调整路线\n3️⃣ 点击「清空」重新开始\n4️⃣ 随时可以保存草稿\n5️⃣ 右下角❓可重新观看教程',
            element: '#tool-move',
            type: 'highlight',
            actions: [
                { text: '继续', type: 'primary', action: 'next' }
            ]
        },
        {
            id: 'complete',
            title: '🎉 教程完成！',
            content: '🎊 恭喜您！\n\n现在您已经了解了系统的核心功能：\n\n✅ 创建成套编排\n✅ 在画布上画线\n✅ 查看动作序列\n✅ 计算成绩\n✅ 使用音乐库\n✅ 2D演示功能\n\n快去试试创建您自己的编排吧！\n\n点击「完成」开始您的创作之旅！',
            type: 'modal',
            actions: [
                { text: '重新观看教程', type: 'secondary', action: 'restart' },
                { text: '开始创作！', type: 'primary', action: 'complete' }
            ]
        }
    ];

    // 教程状态
    let state = TUTORIAL_STATES.NOT_STARTED;
    let currentStep = 0;
    let isDemoRunning = false;

    // 初始化
    function init() {
        createTutorialUI();
        bindEvents();
        
        // 检查是否首次访问
        const tutorialStatus = localStorage.getItem('tutorialStatus');
        if (!tutorialStatus) {
            // 首次访问，自动显示欢迎教程
            setTimeout(() => {
                // 确保 DOM 完全加载
                if (document.readyState === 'complete' || document.readyState === 'interactive') {
                    showCurrentStep();
                } else {
                    document.addEventListener('DOMContentLoaded', () => showCurrentStep());
                }
            }, 3000);
        }
    }

    // 创建教程UI
    function createTutorialUI() {
        const overlay = document.createElement('div');
        overlay.id = 'tutorialOverlay';
        overlay.className = 'fixed inset-0 bg-black/50 z-[9999] hidden flex items-center justify-center p-4';
        overlay.innerHTML = `
            <div id="tutorialModal" class="bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full transform transition-all duration-300 z-[10000]">
                <div id="tutorialProgress" class="flex justify-center gap-1 mb-4">
                    ${TUTORIAL_STEPS.filter(s => s.type === 'modal' || s.type === 'highlight').map(() => '<div class="w-2 h-2 bg-slate-300 rounded-full transition-all"></div>').join('')}
                </div>
                <h3 id="tutorialTitle" class="text-xl font-black text-slate-800 mb-3 flex items-center gap-2"></h3>
                <p id="tutorialContent" class="text-sm text-slate-600 mb-6 whitespace-pre-line leading-relaxed"></p>
                <div id="tutorialActions" class="flex gap-3 justify-end"></div>
            </div>
        `;
        document.body.appendChild(overlay);

        // 创建悬浮帮助按钮
        if (!document.getElementById('helpBtn')) {
            const helpBtn = document.createElement('button');
            helpBtn.id = 'helpBtn';
            helpBtn.className = 'fixed bottom-6 right-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white w-16 h-16 rounded-full shadow-xl hover:scale-110 transition-transform z-[9998] flex flex-col items-center justify-center text-xs font-bold';
            helpBtn.innerHTML = '❓<span class="text-[10px] mt-0.5">教程</span>';
            helpBtn.onclick = resetAndStart;
            document.body.appendChild(helpBtn);
        }
    }

    // 绑定事件
    function bindEvents() {
        document.addEventListener('keydown', (e) => {
            if (state !== TUTORIAL_STATES.IN_PROGRESS) return;
            
            if (e.key === 'Escape') {
                completeTutorial();
            } else if (e.key === 'ArrowRight') {
                nextStep();
            }
        });
    }

    // 显示当前步骤
    function showCurrentStep() {
        const modalSteps = TUTORIAL_STEPS.filter(s => s.type === 'modal');
        const currentModalStep = TUTORIAL_STEPS[currentStep];
        if (!currentModalStep) {
            completeTutorial();
            return;
        }

        const overlay = document.getElementById('tutorialOverlay');
        const titleEl = document.getElementById('tutorialTitle');
        const contentEl = document.getElementById('tutorialContent');
        const actionsEl = document.getElementById('tutorialActions');
        const progressDots = document.querySelectorAll('#tutorialProgress div');
        const modal = document.getElementById('tutorialModal');

        overlay.classList.remove('hidden');
        titleEl.textContent = currentModalStep.title;
        contentEl.textContent = currentModalStep.content;

        // 更新进度
        const validSteps = TUTORIAL_STEPS.filter(s => s.type === 'modal' || s.type === 'highlight');
        const currentIndex = validSteps.findIndex(s => s.id === currentModalStep.id);
        if (currentIndex >= 0) {
            progressDots.forEach((dot, idx) => {
                dot.className = idx === currentIndex ? 'w-6 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full' :
                               idx < currentIndex ? 'w-2 h-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full' :
                               'w-2 h-2 bg-slate-300 rounded-full';
            });
        }

        // 渲染操作按钮
        actionsEl.innerHTML = (currentModalStep.actions || []).map(action => `
            <button onclick="TutorialSystem.${action.action}()" 
                    class="${action.type === 'primary' ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'} 
                           px-5 py-2.5 rounded-xl font-bold transition-all hover:scale-105 shadow-sm"
                    style="pointer-events: auto; z-index: 10001;">
                ${action.text}
            </button>
        `).join('');

        // 高亮元素
        clearAllHighlights();
        if (currentModalStep.element) {
            highlightElement(currentModalStep.element, modal);
        }

        // 自动执行
        if (currentModalStep.autoAction) {
            setTimeout(() => performAutoAction(currentModalStep.autoAction), 2000);
        }

        // 更新状态
        state = TUTORIAL_STATES.IN_PROGRESS;
    }

    // 高亮元素
    function highlightElement(selector, modal) {
        try {
            const target = document.querySelector(selector);
            if (!target) return;

            const rect = target.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // 定位弹窗
            const modalWidth = modal.offsetWidth;
            const modalHeight = modal.offsetHeight;
            let modalLeft = Math.min(window.innerWidth - modalWidth - 20, Math.max(20, centerX - modalWidth / 2));
            let modalTop = centerY + rect.height / 2 + 20;

            if (modalTop + modalHeight > window.innerHeight - 20) {
                modalTop = centerY - rect.height / 2 - modalHeight - 20;
            }

            modal.style.left = modalLeft + 'px';
            modal.style.top = modalTop + 'px';
            modal.style.transform = 'none';

            // 添加高亮效果
            target.classList.add('ring-4', 'ring-yellow-400', 'ring-offset-4', 'z-[1001]', 'relative');
        } catch (e) {
            // 居中显示
            modal.style.left = '50%';
            modal.style.top = '50%';
            modal.style.transform = 'translate(-50%, -50%)';
        }
    }

    // 清除所有高亮
    function clearAllHighlights() {
        document.querySelectorAll('.ring-4.ring-yellow-400').forEach(el => {
            el.classList.remove('ring-4', 'ring-yellow-400', 'ring-offset-4', 'z-[1001]', 'relative');
        });
    }

    // 执行自动动作
    function performAutoAction(action) {
        if (isDemoRunning) return;
        isDemoRunning = true;

        switch(action) {
            case 'clickEnter':
                const enterBtn = document.querySelector('button[onclick="enterSystem()"]');
                if (enterBtn) {
                    enterBtn.click();
                    ToastManager.show('info', '教程提示', '已点击进入工作台', 1500);
                }
                break;

            case 'autoFillSetup':
                // 自动填写设置
                const nameInput = document.getElementById('routineNameInput');
                if (nameInput) nameInput.value = DEMO_ROUTINE.name;
                
                // 选择Gymnast模式
                if (typeof AppController !== 'undefined' && AppController.setGymnastMode) {
                    AppController.setGymnastMode('custom');
                }
                
                const customNameInput = document.getElementById('customGymnastNameInput');
                if (customNameInput) customNameInput.value = 'ZHOU Yaqin';
                
                // 选择品牌
                selectBrand(DEMO_ROUTINE.brand);
                break;

            case 'clickEnterBuilder':
                const builderBtn = document.querySelector('button[onclick*="enterBuilder"]');
                if (builderBtn) {
                    builderBtn.click();
                    ToastManager.show('info', '教程提示', '已进入编排画布', 1500);
                }
                break;

            case 'drawSkill1':
                drawDemoSkill(DEMO_ROUTINE.skills[0]);
                break;

            case 'drawSkill2':
                drawDemoSkill(DEMO_ROUTINE.skills[1]);
                break;

            case 'drawSkill3':
                drawDemoSkill(DEMO_ROUTINE.skills[2]);
                break;

            case 'drawSkill4':
                drawDemoSkill(DEMO_ROUTINE.skills[3]);
                setTimeout(() => {
                    if (typeof saveRoutine === 'function') {
                        saveRoutine();
                        ToastManager.show('success', '教程演示', '演示编排已完成！', 2000);
                    }
                }, 1500);
                break;

            case 'clickComplete':
                if (typeof saveRoutine === 'function') {
                    saveRoutine();
                    ToastManager.show('success', '教程演示', '成绩计算完成！', 2000);
                }
                break;

            case 'clickMusicTab':
                if (typeof switchTab === 'function') {
                    switchTab('music');
                    ToastManager.show('info', '教程提示', '已切换到音乐库', 1500);
                }
                break;
        }

        setTimeout(() => { isDemoRunning = false; }, 2000);
    }

    // 绘制演示动作
    function drawDemoSkill(skill) {
        if (typeof canvasManager === 'undefined') {
            ToastManager.show('warning', '教程提示', '请先进入编排画布', 2000);
            return;
        }

        // 设置工具
        if (skill.type === 'curve') {
            if (typeof setTool === 'function') setTool('curve');
        } else {
            if (typeof setTool === 'function') setTool('line');
        }

        // 获取画布
        const canvas = document.getElementById('floorCanvas');
        if (!canvas || !canvas.getContext) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // 模拟绘制
        const points = skill.points;
        if (points.length < 2) return;

        // 获取画布实际尺寸
        const rect = canvas.getBoundingClientRect();
        const scaleX = rect.width / canvas.width;
        const scaleY = rect.height / canvas.height;

        // 绘制
        ctx.strokeStyle = '#3B82F6';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        const startX = points[0].x * scaleX;
        const startY = points[0].y * scaleY;
        ctx.moveTo(startX, startY);

        if (skill.type === 'curve') {
            // 曲线
            for (let i = 1; i < points.length; i++) {
                const x = points[i].x * scaleX;
                const y = points[i].y * scaleY;
                if (i === 1) {
                    ctx.quadraticCurveTo(x, y, x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
        } else {
            // 直线
            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i].x * scaleX, points[i].y * scaleY);
            }
        }

        ctx.stroke();

        // 添加到canvasManager
        if (canvasManager && canvasManager.addPath) {
            canvasManager.addPath({
                type: skill.type,
                points: skill.points.map(p => ({ x: p.x * scaleX, y: p.y * scaleY })),
                skillName: skill.skillName
            });
        }

        ToastManager.show('success', '教程演示', `已添加：${skill.skillName}`, 1500);
    }

    // 下一步
    function nextStep() {
        clearAllHighlights();
        currentStep++;

        // 跳过非modal步骤
        while (currentStep < TUTORIAL_STEPS.length && TUTORIAL_STEPS[currentStep].type !== 'modal' && TUTORIAL_STEPS[currentStep].type !== 'highlight') {
            currentStep++;
        }

        if (currentStep >= TUTORIAL_STEPS.length) {
            completeTutorial();
        } else {
            showCurrentStep();
        }
    }

    // 跳过教程
    function skip() {
        completeTutorial();
    }

    // 开始演示
    function startDemo() {
        currentStep = 0;
        showCurrentStep();
    }

    // 重启教程
    function restart() {
        localStorage.removeItem('tutorialStatus');
        currentStep = 0;
        state = TUTORIAL_STATES.NOT_STARTED;
        showCurrentStep();
    }

    // 重置并开始
    function resetAndStart() {
        restart();
    }

    // 完成教程
    function completeTutorial() {
        clearAllHighlights();
        state = TUTORIAL_STATES.COMPLETED;
        localStorage.setItem('tutorialStatus', state);
        
        const overlay = document.getElementById('tutorialOverlay');
        if (overlay) overlay.classList.add('hidden');
        
        ToastManager.show('success', '教程完成！', '开始您的创作之旅吧！点击右下角❓可重新观看', 4000);
    }

    // 暴露到全局
    window.TutorialSystem = {
        init,
        nextStep,
        skip,
        startDemo,
        restart,
        resetAndStart,
        completeTutorial
    };

})();
