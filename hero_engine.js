// ==========================================
// ✨ 终极巨幕跨媒体引擎 (防内存泄漏 + 柔和淡入版)
// ==========================================
window.HeroEngine = {
    // 📁 视频总库 (精准时长)
    allVideos: [
        { src: './videos/vani_ferrari.mp4', duration: 15 },
        { src: './videos/angi_mel.mp4', duration: 13 },
        { src: './videos/sabrina_voinea.mp4', duration: 10 },
        { src: './videos/zhou_yaqin.mp4', duration: 10 },
        { src: './videos/mai_murakami.mp4', duration: 9 },
        { src: './videos/zhang_jin.mp4', duration: 9 },
        { src: './videos/ruby_evans.mp4', duration: 8 },
        { src: './videos/vlada_ura.mp4', duration: 8 },
        { src: './videos/jade_carey.mp4', duration: 7 },
        { src: './videos/suni_lee.mp4', duration: 7 },
        { src: './videos/sui_han.mp4', duration: 11 },
        { src: './videos/rebw_and.mp4', duration: 4 },
        { src: './videos/sui_lu.mp4', duration: 8 }
    ],
    activeVideos: [],
    videoDeck: [],

    classicImages: [
        './images/classic/Simone_Biles_Showcast.jpeg', 
        './images/classic/Rebeca_Andrade_Showcast.jpg', 
        './images/classic/Ruby_Evans_Showcast.jpg', 
        './images/classic/Ou_Yushan_Showcast.jpg', 
        './images/classic/Brooklyn_Moors_Showcast.jpg'
    ],
    
    // 📁 剧场小图库 (✅ 已删除 Kishi_Rina_Showcase1.png)
    galleryImages: [
        './images/gallery/Zhou_Yaqin_Showcast.jpg', './images/gallery/Zhou_Yaqin_Showcast2.jpg',
        './images/gallery/Zhang_Yihan_Showcast.jpg', './images/gallery/Zhang_Yihan_Showcast2.jpg', 
        './images/gallery/Kishi_Rina_Showcast.jpg', 
        // ✨ 新增选手图片
        './images/gallery/Ou_Yushan.jpg', './images/gallery/Ke_Qinqin.jpeg',
        './images/gallery/Chen_Xinyi.jpg', './images/gallery/Yang_Jingxi.jpg',
        './images/gallery/Jin_Xiaoxuan.jpg', './images/gallery/Zhou_Yaqin.jpg',
        './images/gallery/Qin_Xinyi.jpg','./images/gallery/Alice_DAmato_Showcast.png', './images/gallery/Kaylia_Nemour_Showcast.jpg',
        './images/gallery/Angelina_Melnikova_Showcast.png', './images/gallery/Aiko_Sugihara_Showcast.jpg', 
        './images/gallery/Maiana_Prat_Showcast.png', './images/gallery/Sabrina_Voinea_Showcast.png',
        './images/gallery/Ellie_Black_Showcast.png', './images/gallery/Skye_Blakely_Showcast.png',
        './images/gallery/Aiko_Sugihara_Showcast2.jpg', './images/gallery/Jordan_Chiles_Showcast.jpeg', 
        './images/gallery/Shilese_Jones_Showcast.png', './images/gallery/Zhang_Yihan_Showcast3.jpg',
        './images/gallery/Ana_Barbosu_Showcast.png'
        
    ],

    classicDeck: [],
    galleryDeck: [],

    // ✨ 新增：记忆上一任是谁，用来防重叠
    lastPlayedVideo: null,
    lastPlayedClassic: null,

    // 调整后的导演时间轴：3视频 -> 3剧场(gallery) -> 3大图(classic)
    sequence: ['video', 'video', 'video', 'gallery', 'gallery', 'gallery', 'classic', 'classic', 'classic'],
    stepIndex: 0,

    // ==========================================
    // ⚡ 定时器追杀系统 + DOM 清道夫
    // ==========================================
    sceneTimers: [], 
    
    addSceneTimer: function(fn, delay) {
        const id = setTimeout(fn, delay);
        this.sceneTimers.push(id);
        return id;
    },
    
    // ✨ 核心修复：不仅杀定时器，还强制清理幽灵节点！
    clearSceneTimers: function() {
        this.sceneTimers.forEach(id => clearTimeout(id));
        this.sceneTimers = [];
        
        // DOM 清道夫：无情拔除舞台上所有残留的旧视频，杜绝重叠！
        const stage = document.getElementById('heroStage');
        if (stage) {
            const ghostVideos = stage.querySelectorAll('video');
            ghostVideos.forEach(v => {
                if (v.parentNode) v.parentNode.removeChild(v);
            });
        }
    },

    init: function() {
        const stage = document.getElementById('heroStage');
        if (!stage) return;
        
        this.clearSceneTimers(); 

        const shuffledVideos = [...this.allVideos].sort(() => 0.5 - Math.random());
        this.activeVideos = shuffledVideos.slice(0, 6); 

        this.executeNextScene();
    },

    getVideo: function() {
        if (this.videoDeck.length === 0) {
            this.videoDeck = [...this.activeVideos].sort(() => 0.5 - Math.random());
            
            // ✨ 防连播核心逻辑：
            // 如果洗牌后，即将被抽出的视频（数组最后一个）等于上一次播的视频
            if (this.lastPlayedVideo && this.videoDeck[this.videoDeck.length - 1].src === this.lastPlayedVideo) {
                // 把它和牌堆底部的视频（数组第一个）强制互换位置！
                const temp = this.videoDeck[this.videoDeck.length - 1];
                this.videoDeck[this.videoDeck.length - 1] = this.videoDeck[0];
                this.videoDeck[0] = temp;
            }
        }
        const videoObj = this.videoDeck.pop();
        this.lastPlayedVideo = videoObj.src; // 记录进大脑
        return videoObj; 
    },

    getClassicImage: function() {
        if (this.classicDeck.length === 0) {
            this.classicDeck = [...this.classicImages].sort(() => 0.5 - Math.random());
            
            // ✨ 大图也加入同样的防连播逻辑
            if (this.lastPlayedClassic && this.classicDeck[this.classicDeck.length - 1] === this.lastPlayedClassic) {
                const temp = this.classicDeck[this.classicDeck.length - 1];
                this.classicDeck[this.classicDeck.length - 1] = this.classicDeck[0];
                this.classicDeck[0] = temp;
            }
        }
        const src = this.classicDeck.pop();
        this.lastPlayedClassic = src; // 记录进大脑
        return src;
    },
    getGalleryImages: function(count) {
        if (this.galleryDeck.length < count) this.galleryDeck = [...this.galleryImages].sort(() => 0.5 - Math.random());
        const selected = [];
        for(let i=0; i<count; i++) selected.push(this.galleryDeck.pop());
        return selected;
    },

    executeNextScene: function() {
        this.clearSceneTimers(); // 每次开场前，进行全场消毒
        
        const currentMode = this.sequence[this.stepIndex];
        const nextIndex = (this.stepIndex + 1) % this.sequence.length;
        const nextMode = this.sequence[nextIndex];
        
        const isSwitchingToNext = (currentMode !== nextMode);
        this.stepIndex = nextIndex;

        if (currentMode === 'video') {
            this.playVideoMode(isSwitchingToNext);
        } else if (currentMode === 'classic') {
            this.playClassicMode();
            this.scheduleNext(isSwitchingToNext, 6500);
        } else if (currentMode === 'gallery') {
            this.playGalleryMode();
            this.scheduleNext(isSwitchingToNext, 6500);
        }
    },

    scheduleNext: function(isSwitchingToNext, duration) {
        this.addSceneTimer(() => {
            if (isSwitchingToNext) {
                this.clearStage(true); 
                this.addSceneTimer(() => this.executeNextScene(), 1000); 
            } else {
                this.clearStage(false); 
                this.executeNextScene(); 
            }
        }, duration);
    },

    clearStage: function(isSwitchingMode) {
        const oldNodes = Array.from(document.getElementById('heroStage').children);
        
        oldNodes.forEach(node => {
            if (isSwitchingMode) {
                node.style.opacity = '0';
                // ✨ 修复 1：用 all 替代单指 opacity，防止中断正在进行的放大动画
                node.style.transition = 'all 1s ease-out'; 
            } else {
                if (node.classList.contains('gallery-blurred')) {
                    const currentTransform = node.style.transform || 'scale(1)';
                    node.style.transform = currentTransform + ' scale(1.1)';
                    node.style.filter = 'blur(12px)'; 
                    node.style.opacity = '0';
                    node.style.transition = 'all 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
                } else {
                    node.style.filter = 'blur(6px)';
                    node.style.opacity = '0';
                    // ✨ 修复 2：用 all 替代单指 opacity 和 filter
                    node.style.transition = 'all 1.2s ease-out'; 
                    // ✨ 修复 3：不仅不急刹车，反而让它在退场时继续放大到 1.15 倍！
                    node.style.transform = 'scale(1.15)'; 
                }
            }
        });
        
        setTimeout(() => {
            oldNodes.forEach(node => { if(node.parentNode) node.parentNode.removeChild(node); });
        }, 1600);
    },

    // ==========================================
    // 🎬 1. 视频模式 (全屏 100% 实色遮挡，纯净播放)
    // ==========================================
    playVideoMode: function(isSwitchingToNext) {
        // ✨ 播视频时：让底层玻璃球彻底熄灭
        const blobs = document.getElementById('ambientBlobs');
        if (blobs) blobs.style.opacity = '0';

        const stage = document.getElementById('heroStage');
        stage.style.transition = 'background-color 1s ease-in-out';
        // ✨ 用极其深邃的实色背景遮住一切，视频绝对纯净清晰！
        stage.style.backgroundColor = '#020617';
        
        const videoObj = this.getVideo(); 
        const videoEl = document.createElement('video');
        videoEl.src = videoObj.src;
        videoEl.muted = true; 
        videoEl.playsInline = true;
        videoEl.preload = "auto";
        videoEl.className = 'absolute inset-0 w-full h-full object-cover';
        
        videoEl.style.opacity = '0';
        videoEl.style.transition = 'opacity 0.8s ease-in-out'; 
        stage.appendChild(videoEl);

        let isReady = false;
        const durationMs = videoObj.duration * 1000;

        videoEl.oncanplay = () => {
            if (isReady) return;
            isReady = true;

            const loader = document.getElementById('globalLoader');
            if (loader && !loader.classList.contains('opacity-0')) {
                const progress = document.getElementById('loaderProgress');
                if(progress) progress.style.width = '100%';
                setTimeout(() => {
                    loader.classList.add('opacity-0');
                    setTimeout(() => loader.remove(), 700);
                }, 200);
            }

            this.addSceneTimer(() => { videoEl.style.opacity = '1'; }, 0); // 视频100%纯净不透明
            this.addSceneTimer(() => { videoEl.play().catch(e => console.log(e)); }, 200);

            const finishTime = 200 + durationMs;
            this.addSceneTimer(() => {
                videoEl.style.transition = 'opacity 1s ease-in-out';
                videoEl.style.opacity = '0';
            }, finishTime);

            this.addSceneTimer(() => {
                if(videoEl.parentNode) videoEl.parentNode.removeChild(videoEl);
                if (isSwitchingToNext) stage.style.backgroundColor = 'transparent';
                this.executeNextScene();
            }, finishTime + 1300); 
        };

        this.addSceneTimer(() => {
            if (!isReady) {
                isReady = true;
                const loader = document.getElementById('globalLoader');
                if (loader && !loader.classList.contains('opacity-0')) {
                    loader.classList.add('opacity-0');
                    setTimeout(() => loader.remove(), 700);
                }
                if(videoEl.parentNode) videoEl.parentNode.removeChild(videoEl);
                if (isSwitchingToNext) stage.style.backgroundColor = 'transparent';
                this.clearSceneTimers();
                this.executeNextScene();
            }
        }, 10000); 
        
        videoEl.onerror = () => {
            if (!isReady) {
                isReady = true;
                const loader = document.getElementById('globalLoader');
                if (loader && !loader.classList.contains('opacity-0')) {
                    loader.classList.add('opacity-0');
                    setTimeout(() => loader.remove(), 700);
                }
                if (isSwitchingToNext) stage.style.backgroundColor = 'transparent';
                this.clearSceneTimers();
                this.executeNextScene();
            }
        };
    },

    // ==========================================
    // 🖼️ 2. 大图模式 (绝对清晰 + 流光溢彩渗透)
    // ==========================================
    playClassicMode: function() {
        // ✨ 播照片时：唤醒底层的彩色玻璃球
        const blobs = document.getElementById('ambientBlobs');
        if (blobs) blobs.style.opacity = '1';

        const stage = document.getElementById('heroStage');
        stage.style.backgroundColor = 'transparent'; // 舞台变透明，露出底下的球
        
        const imgEl = document.createElement('img');
        const src = this.getClassicImage();
        imgEl.src = src;
        imgEl.className = 'absolute inset-0 w-full h-full object-cover';
        
        // 🚨 核心黑科技回归：找回你当年的滤色模式！
        imgEl.style.mixBlendMode = 'screen'; 
        
        imgEl.style.opacity = '0';
        imgEl.style.filter = 'blur(8px)';
        imgEl.style.transform = 'scale(1)';
        imgEl.style.transition = 'opacity 1.5s ease-out, filter 1.5s ease-out, transform 6.5s linear';
        
        imgEl.onerror = () => {
            imgEl.onerror = null; 
            imgEl.src = this.getClassicImage();
        };

        stage.appendChild(imgEl);

        this.addSceneTimer(() => {
            imgEl.style.opacity = '0.80'; // ✨ 配合 screen，0.85透明度让光斑透出，且照片刀锋般锐利！
            imgEl.style.filter = 'blur(0px)';
            imgEl.style.transform = 'scale(1.15)'; 
        }, 50);
    },

    // ==========================================
    // 🎭 3. 剧场小图模式 (通透背景错落)
    // ==========================================
    playGalleryMode: function() {
        // ✨ 播剧场小图时：唤醒底层玻璃球
        const blobs = document.getElementById('ambientBlobs');
        if (blobs) blobs.style.opacity = '1';

        const stage = document.getElementById('heroStage');
        stage.style.backgroundColor = 'transparent'; // 舞台透明
        
        const selected = this.getGalleryImages(3);

        const layouts = [
            [ {x: 5, y: 5, w: 38}, {x: 35, y: 45, w: 35}, {x: 60, y: 10, w: 38} ],
            [ {x: 5, y: 45, w: 35}, {x: 35, y: 5, w: 42}, {x: 62, y: 45, w: 32} ],
            [ {x: 2, y: 20, w: 45}, {x: 55, y: 5, w: 30}, {x: 55, y: 50, w: 32} ],
            [ {x: 5, y: 5, w: 30}, {x: 5, y: 50, w: 32}, {x: 50, y: 20, w: 45} ],
            [ {x: 8, y: 8, w: 32}, {x: 36, y: 32, w: 40}, {x: 65, y: 50, w: 30} ],
            [ {x: 8, y: 50, w: 32}, {x: 36, y: 25, w: 40}, {x: 65, y: 5, w: 30} ]
        ];

        const currentLayout = layouts[Math.floor(Math.random() * layouts.length)];
        const delayOrder = [0, 1, 2].sort(() => 0.5 - Math.random());

        selected.forEach((src, idx) => {
            const imgEl = document.createElement('img');
            imgEl.src = src;
            imgEl.className = 'absolute gallery-blurred drop-shadow-2xl'; 

            const layout = currentLayout[idx];
            const startX = layout.x + (Math.random() * 4 - 2);
            const startY = layout.y + (Math.random() * 4 - 2);
            const widthPercent = layout.w + (Math.random() * 2 - 1); 
            
            const moveDistX = (35 - startX) * (0.3 + Math.random() * 0.2); 
            const moveDistY = (25 - startY) * (0.3 + Math.random() * 0.2);
            const endScale = 1 + (Math.random() * 0.3 - 0.1); 
            const startRotate = -12 + Math.random() * 24;
            const endRotate = startRotate + (Math.random() > 0.5 ? 8 : -8);

            imgEl.style.width = `${widthPercent}vw`;
            imgEl.style.left = `${startX}%`;
            imgEl.style.top = `${startY}%`;
            
            imgEl.style.opacity = '0';
            imgEl.style.filter = 'blur(10px)';
            imgEl.style.transform = `translate(0%, 0%) scale(1) rotate(${startRotate}deg)`;
            imgEl.style.transition = 'opacity 1.5s ease-out, filter 1.5s ease-out, transform 8s cubic-bezier(0.2, 0.8, 0.2, 1)';

            imgEl.onerror = () => {
                imgEl.onerror = null; 
                imgEl.src = this.getGalleryImages(1)[0]; 
            };

            stage.appendChild(imgEl);

            this.addSceneTimer(() => {
                imgEl.style.opacity = '0.95'; // ✨ 保持小图独立、干净的高清质感
                imgEl.style.filter = 'blur(0px)'; 
                imgEl.style.transform = `translate(${moveDistX}%, ${moveDistY}%) scale(${endScale}) rotate(${endRotate}deg)`; 
            }, 100 + (delayOrder[idx] * 400));
        });
    }
};

// 启动引擎
// 页面加载完成后启动 HeroEngine
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if(window.HeroEngine) window.HeroEngine.init();
    }, 500);
});
