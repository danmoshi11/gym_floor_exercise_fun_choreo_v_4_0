// ==========================================
// 📚 完整功能演示教程 - 包含编排、E分、音乐
// ==========================================
(function() {
    'use strict';

    let currentStep = 0;
    let isDemoMode = false;
    let isQuickMode = false;
    
    // 快速教程
    const QUICK_STEPS = [
        {
            title: '👋 欢迎使用 GymChoreo',
            content: '这是一个自由体操编排与评分系统！\n\n您可以选择：\n• 「快速教程」了解基本功能\n• 「完整演示」观看系统自动走完所有功能',
            button: '快速教程',
            secondary: '完整演示'
        },
        {
            title: '🎨 画板功能',
            content: '在「🎨 画板」标签下，您可以：\n\n• 在场地画线表示动作\n• 点击动作卡片添加编排\n• 完成后计算最终得分',
            button: '明白了'
        },
        {
            title: '🎵 音乐库',
            content: '在「🎵 音乐库」标签下，您可以：\n\n• 欣赏精选体操音乐\n• 上传自己的私人音乐\n• 使用播放器控制播放',
            button: '下一步'
        },
        {
            title: '🎯 开始使用',
            content: '🎉 您已了解基本功能！\n\n点击「进入工作台」开始您的创作吧！\n\n💡 提示：右下角「❓」随时可以重新观看教程',
            button: '开始使用'
        }
    ];
    
    // 完整演示数据
    const DEMO_DATA = {
        routine: {
            name: '2025全锦赛决赛',
            gymnast: '🏆 周雅琴 (中国)',
            brand: 'gymnova'
        },
        skills: [
            { type: 'curve', points: [{x: 200, y: 200}, {x: 300, y: 150}, {x: 400, y: 200}], skillName: '1组-交换腿结环跳(A)' },
            { type: 'line', points: [{x: 400, y: 200}, {x: 500, y: 250}], skillName: '3组-前手翻(A)' },
            { type: 'line', points: [{x: 500, y: 250}, {x: 450, y: 350}], skillName: '5组-后团一周(D)' },
            { type: 'curve', points: [{x: 450, y: 350}, {x: 350, y: 400}, {x: 300, y: 500}], skillName: '2组-狼跳(C)' }
        ]
    };
    
    // 完整演示步骤
    const DEMO_STEPS = [
        {
            title: '🎬 完整功能演示',
            content: '现在让我为您演示系统的所有核心功能！\n\n📋 演示内容：\n1️⃣ 创建编排 & 画动作\n2️⃣ 打E分（完成分扣分）\n3️⃣ 插入音乐 & 欣赏\n4️⃣ 音乐卡点编排\n\n点击「开始演示」观看完整流程！',
            button: '开始演示',
            auto: false
        },
        {
            title: '🚀 第一步：进入工作台',
            content: '首先，点击「进入工作台」进入编排系统...',
            auto: true,
            action: 'enterSystem'
        },
        {
            title: '✨ 第二步：配置编排信息',
            content: '配置我们的演示编排：\n• 名称：2025全锦赛决赛\n• 选手：周雅琴\n• 场地：Gymnova',
            auto: true,
            action: 'setupRoutine'
        },
        {
            title: '🎨 第三步：进入画布',
            content: '点击「进入编排战术板」开始画动作...',
            auto: true,
            action: 'enterBuilder'
        },
        {
            title: '🎯 第四步：画动作 #1',
            content: '🏃 现在画第一个动作：交换腿结环跳...',
            auto: true,
            action: 'drawSkill1'
        },
        {
            title: '🎯 第五步：画动作 #2',
            content: '🏃 现在画第二个动作：前手翻...',
            auto: true,
            action: 'drawSkill2'
        },
        {
            title: '🎯 第六步：画动作 #3',
            content: '🎯 现在画第三个动作：后团一周...',
            auto: true,
            action: 'drawSkill3'
        },
        {
            title: '🎯 第七步：画动作 #4',
            content: '🏃 最后画第四个动作：狼跳...',
            auto: true,
            action: 'drawSkill4'
        },
        {
            title: '🏆 第八步：计算D分',
            content: '✅ 编排完成！现在计算难度分（D分）...\n\n系统会自动识别动作难度并计算总分！',
            auto: true,
            action: 'calcDScore'
        },
        {
            title: '📝 第九步：打E分',
            content: '📋 现在进入E分（完成分）评判环节！\n\n裁判可以根据以下项目扣分：\n• 大失误 (0.5分)\n• 中失误 (0.3分)\n• 小失误 (0.1分)',
            auto: true,
            action: 'openEScore'
        },
        {
            title: '💔 第十步：添加E分扣分',
            content: '💔 假设运动员在这个动作落地时有一小失误...\n\n点击「小失误」添加0.1分扣分。\n\n这样E分就会从10分变为9.9分。',
            auto: true,
            action: 'addEDeduction'
        },
        {
            title: '🎵 第十一步：选择音乐',
            content: '🎵 现在进入音乐环节！\n\n点击「🎵 音乐库」标签，进入音乐选择页面...\n\n这里可以选择体操比赛专用音乐！',
            auto: true,
            action: 'goToMusic'
        },
        {
            title: '🎶 第十二步：欣赏音乐',
            content: '🎧 在音乐库中，您可以：\n\n• 试听各种体操音乐\n• 上传自己的私人音乐\n• 点击播放按钮欣赏\n\n现在点击一首音乐开始播放！',
            auto: true,
            action: 'selectMusic'
        },
        {
            title: '🎯 第十三步：音乐卡点编排',
            content: '🎵 现在回到画板，开始音乐卡点编排！\n\n音乐卡点功能可以帮您：\n• 在音乐的特定时间点插入动作\n• 确保动作与音乐节奏完美配合\n\n点击「🎨 画板」返回...',
            auto: true,
            action: 'backToBuilder'
        },
        {
            title: '⏱️ 第十四步：设置音乐卡点',
            content: '⏱️ 现在为您的动作设置音乐卡点！\n\n点击音乐播放按钮，系统会：\n1️⃣ 播放音乐\n2️⃣ 在当前时间点记录卡点\n3️⃣ 将卡点应用到选定动作\n\n点击「设置卡点」按钮开始...',
            auto: true,
            action: 'setMusicCue'
        },
        {
            title: '🎊 第十五步：完成！',
            content: '🎊 恭喜！\n\n您已完成完整的编排流程：\n✅ 创建编排\n✅ 画4个动作\n✅ 计算D分\n✅ 打E分扣分\n✅ 选择音乐\n✅ 音乐卡点编排\n\n这就是系统的全部核心功能！',
            auto: false
        },
        {
            title: '🎉 演示完成！',
            content: '🎉 恭喜您观看完所有演示！\n\n现在您已经了解了系统的完整功能。\n\n快去试试创建您自己的编排吧！\n\n💡 提示：右下角「❓」随时可以重新观看教程',
            button: '开始使用'
        }
    ];

    function createUI() {
        const overlay = document.createElement('div');
        overlay.id = 'simpleTutorialOverlay';
        overlay.className = 'fixed inset-0 bg-black/40 z-[9999] hidden pointer-events-none';
        overlay.innerHTML = `
            <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 z-[10000] pointer-events-auto">
                <div class="flex justify-between items-center mb-4">
                    <h3 id="tutorialTitle" class="text-xl font-black text-slate-800"></h3>
                    <button id="tutorialSkipBtn" class="text-slate-400 hover:text-slate-600 text-sm font-bold px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                        ✕ 跳过
                    </button>
                </div>
                
                <p id="tutorialContent" class="text-sm text-slate-600 mb-6 whitespace-pre-line leading-relaxed"></p>
                
                <div id="tutorialActions" class="flex justify-between items-center">
                    <div id="progressDots" class="flex gap-1"></div>
                    <div id="tutorialButtons" class="flex gap-2"></div>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        document.getElementById('tutorialSkipBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            SimpleTutorial.skip();
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && currentState === 'in_progress') {
                SimpleTutorial.skip();
            }
        });
    }
    
    let currentState = 'not_started';
    
    function showStep() {
        const overlay = document.getElementById('simpleTutorialOverlay');
        const steps = isDemoMode ? DEMO_STEPS : QUICK_STEPS;
        
        if (currentStep >= steps.length) {
            SimpleTutorial.complete();
            return;
        }
        
        const step = steps[currentStep];
        
        overlay.classList.remove('hidden');
        document.getElementById('tutorialTitle').textContent = step.title;
        document.getElementById('tutorialContent').textContent = step.content;
        
        // 进度点
        const dotsContainer = document.getElementById('progressDots');
        dotsContainer.innerHTML = steps.map((_, i) => `
            <div class="w-2 h-2 rounded-full transition-all ${i === currentStep ? 'bg-blue-500 scale-125' : i < currentStep ? 'bg-green-500' : 'bg-slate-200'}"></div>
        `).join('');
        
        // 按钮
        let buttonsHtml = '';
        
        // 自动执行步骤显示"继续"按钮
        if (step.auto) {
            buttonsHtml += `<button id="tutorialSkipAutoBtn" class="bg-slate-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-slate-600 transition-all shadow-sm cursor-pointer">继续</button>`;
        }
        
        if (currentStep === 0 && step.secondary) {
            // 第一步总是显示两个选项
            buttonsHtml += `<button id="tutorialSecondaryBtn" class="bg-emerald-500 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-emerald-600 transition-all shadow-sm cursor-pointer">${step.secondary}</button>`;
        }
        if (step.button) {
            buttonsHtml += `<button id="tutorialNextBtn" class="bg-blue-500 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-600 transition-all shadow-sm cursor-pointer">${step.button}</button>`;
        }
        document.getElementById('tutorialButtons').innerHTML = buttonsHtml;
        
        // 绑定事件
        const nextBtn = document.getElementById('tutorialNextBtn');
        const secondaryBtn = document.getElementById('tutorialSecondaryBtn');
        const skipAutoBtn = document.getElementById('tutorialSkipAutoBtn');
        
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                handleNext();
            });
        }
        
        if (secondaryBtn) {
            secondaryBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                startDemo();
            });
        }
        
        if (skipAutoBtn) {
            skipAutoBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                currentStep++;
                showStep();
            });
        }
        
        // 自动执行
        if (isDemoMode && step.auto) {
            setTimeout(() => {
                if (SimpleTutorial.isShowing()) {
                    performAction(step.action);
                }
            }, 2000);
        }
    }
    
    function handleNext() {
        if (!isDemoMode && currentStep === 0) currentStep++;
        currentStep++;
        const steps = isDemoMode ? DEMO_STEPS : QUICK_STEPS;
        if (currentStep >= steps.length) {
            SimpleTutorial.complete();
        } else {
            showStep();
        }
    }
    
    function startDemo() {
        isDemoMode = true;
        isQuickMode = false;
        currentStep = 0;
        showStep();
    }
    
    function performAction(action) {
        const overlay = document.getElementById('simpleTutorialOverlay');
        overlay.style.pointerEvents = 'none';
        
        const delay = (callback, time) => setTimeout(callback, time);
        
        switch(action) {
            case 'enterSystem':
                if (typeof enterSystem === 'function') enterSystem();
                delay(() => { currentStep++; showStep(); }, 1500);
                break;
                
            case 'setupRoutine':
                const nameInput = document.getElementById('routineNameInput') || document.getElementById('routineName');
                if (nameInput) nameInput.value = DEMO_DATA.routine.name;
                if (typeof selectBrand === 'function') selectBrand(DEMO_DATA.routine.brand);
                delay(() => { currentStep++; showStep(); }, 1500);
                break;
                
            case 'enterBuilder':
                delay(() => {
                    const builderBtn = document.getElementById('enterBuilderBtn');
                    if (builderBtn) builderBtn.click();
                    delay(() => { currentStep++; showStep(); }, 1500);
                }, 1000);
                break;
                
            case 'drawSkill1':
            case 'drawSkill2':
            case 'drawSkill3':
            case 'drawSkill4':
                delay(() => {
                    const skillIndex = parseInt(action.replace('drawSkill', '')) - 1;
                    drawDemoSkill(DEMO_DATA.skills[skillIndex]);
                    delay(() => { currentStep++; showStep(); }, 2000);
                }, 1500);
                break;
                
            case 'calcDScore':
                delay(() => {
                    const calcBtn = document.getElementById('calcDScoreBtn') || 
                                   document.querySelector('button[onclick*="calculateD"]') ||
                                   document.querySelector('button:has-text("计算难度")');
                    if (calcBtn) calcBtn.click();
                    delay(() => { currentStep++; showStep(); }, 2000);
                }, 1000);
                break;
                
            case 'openEScore':
                delay(() => {
                    const eBtn = document.getElementById('openEScoreBtn') ||
                                document.querySelector('button[onclick*="EScore"]') ||
                                document.querySelector('button:has-text("E分")');
                    if (eBtn) eBtn.click();
                    delay(() => { currentStep++; showStep(); }, 1500);
                }, 1000);
                break;
                
            case 'addEDeduction':
                delay(() => {
                    const dedBtn = document.querySelector('button:has-text("小失误")') ||
                                  document.querySelector('[data-deduction="0.1"]');
                    if (dedBtn) dedBtn.click();
                    delay(() => { currentStep++; showStep(); }, 1500);
                }, 1000);
                break;
                
            case 'goToMusic':
                delay(() => {
                    if (typeof switchTab === 'function') switchTab('music');
                    delay(() => { currentStep++; showStep(); }, 1500);
                }, 1000);
                break;
                
            case 'selectMusic':
                delay(() => {
                    const musicItem = document.querySelector('.music-item') ||
                                     document.querySelector('[data-music]');
                    if (musicItem) musicItem.click();
                    delay(() => { currentStep++; showStep(); }, 2000);
                }, 1500);
                break;
                
            case 'backToBuilder':
                delay(() => {
                    if (typeof switchTab === 'function') switchTab('builder');
                    delay(() => { currentStep++; showStep(); }, 1500);
                }, 1000);
                break;
                
            case 'setMusicCue':
                delay(() => {
                    const cueBtn = document.getElementById('setMusicCueBtn') ||
                                  document.querySelector('button:has-text("卡点")');
                    if (cueBtn) cueBtn.click();
                    delay(() => { currentStep++; showStep(); }, 2000);
                }, 1500);
                break;
        }
        
        setTimeout(() => {
            overlay.style.pointerEvents = 'auto';
        }, 3000);
    }
    
    function drawDemoSkill(skill) {
        const canvas = document.getElementById('floorCanvas');
        if (!canvas || !canvas.getContext) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        if (typeof setTool === 'function') {
            setTool(skill.type === 'curve' ? 'curve' : 'line');
        }
        
        const rect = canvas.getBoundingClientRect();
        const scaleX = rect.width / canvas.width;
        const scaleY = rect.height / canvas.height;
        
        ctx.strokeStyle = '#3B82F6';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        ctx.beginPath();
        ctx.moveTo(skill.points[0].x * scaleX, skill.points[0].y * scaleY);
        
        for (let i = 1; i < skill.points.length; i++) {
            ctx.lineTo(skill.points[i].x * scaleX, skill.points[i].y * scaleY);
        }
        
        ctx.stroke();
        
        if (typeof ToastManager !== 'undefined') {
            ToastManager.show('success', '教程演示', `已添加：${skill.skillName}`, 2000);
        }
    }

    window.SimpleTutorial = {
        start: function(force = false) {
            const status = localStorage.getItem('simpleTutorialStatus');
            if (!force && status === 'completed') return;
            
            currentStep = 0;
            isDemoMode = false;
            isQuickMode = false;
            currentState = 'in_progress';
            showStep();
        },
        
        startDemo: function() {
            startDemo();
        },
        
        skip: function() {
            this.complete();
        },
        
        complete: function() {
            const overlay = document.getElementById('simpleTutorialOverlay');
            if (overlay) overlay.classList.add('hidden');
            currentState = 'completed';
            localStorage.setItem('simpleTutorialStatus', 'completed');
        },
        
        isShowing: function() {
            return currentState === 'in_progress';
        }
    };

    document.addEventListener('DOMContentLoaded', () => {
        createUI();
        
        // 帮助按钮
        const helpBtn = document.createElement('button');
        helpBtn.id = 'simpleHelpBtn';
        helpBtn.className = 'fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white w-14 h-14 rounded-full shadow-xl hover:scale-110 transition-all z-[9998] flex flex-col items-center justify-center font-bold cursor-pointer';
        helpBtn.innerHTML = '❓<span class="text-[10px]">教程</span>';
        helpBtn.onclick = () => SimpleTutorial.start(true);
        document.body.appendChild(helpBtn);
        
        // 首次访问显示教程
        const status = localStorage.getItem('simpleTutorialStatus');
        if (!status) {
            setTimeout(() => SimpleTutorial.start(), 3000);
        }
    });
})();
