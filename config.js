// ==========================================
// 📋 配置文件 - 所有密码、数据和限制参数集中管理
// ==========================================

const Config = {
    // 首页媒体上传密码（用于图片和视频上传到云端）
    homeMediaUploadPassword: '0000',
    SUPABASE_URL: 'https://aorjdomtvnlmwjhhetes.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvcmpkb210dm5sbXdqaGhldGVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0ODI4NjQsImV4cCI6MjA5NjA1ODg2NH0.Ism_ygrwbspclpQdz9x9cLKL2rY5WCXRQg-v3SaRA_k',
    
    // ==========================================
    // 💰 金币兑换码配置
    // ==========================================
    coinCodes: {
        'woshineimuer': { coins: 99999, description: '无限金币密码' },
        'woyaojinbi': { coins: 10000, description: 'VIP专属礼包' },
        'woshivip': { coins: 5000, description: '体操大师' },
        '66666': { coins: 6666, description: '先将就用一下8' }
    },
    
    // 文件大小限制配置
    limits: {
        // 图片限制：10MB
        imageMaxSize: 10 * 1024 * 1024,

        // 视频限制：5MB，20秒
        videoMaxSize: 10 * 1024 * 1024,
        videoMaxDuration: 20, // 秒

        // 音乐云端上传限制：9MB
        musicCloudMaxSize: 9 * 1024 * 1024,

        // 音乐本地上传限制：50MB（无大小限制，保留此参数以备将来使用）
        musicLocalMaxSize: 50 * 1024 * 1024
    },
    
    // ==========================================
    // 🎬 已有的 Admin 视频信息（槽位1）
    // ==========================================
    adminVideos: {
        // 格式: "动作ID": { athlete: "...", country: "...", filename: "..." }
    },

    // 其他配置
    settings: {
        // 是否启用密码保护（true=启用，false=禁用）
        enableUploadPassword: true,

        // 上传文件保留天数（审核队列中）
        uploadRetentionDays: 30
    },

    // ==========================================
    // 🎵 音乐库数据
    // ==========================================
    musicLibrary: [
        { file: './music/gym/2019_Ou.mp3', name: '欧钰珊 2019', artist: 'OU Yushan', year: '2019', country: 'CHN' },
        { file: './music/gym/2021_Angelina_Melnikova.mp3', name: '梅尔尼科娃 2021', artist: 'Angelina Melnikova', year: '2021', country: 'RUS' },
        { file: './music/gym/2021_Lu.mp3', name: '芦玉菲 2021', artist: 'LU Yufei', year: '2021', country: 'CHN' },
        { file: './music/gym/2021_Rebeca_Andrade.mp3', name: '安德拉德 2021', artist: 'Rebeca Andrade', year: '2021', country: 'BRA' },
        { file: './music/gym/2021_Simone_Biles.mp3', name: '拜尔斯 2021', artist: 'Simone Biles', year: '2021', country: 'USA' },
        { file: './music/gym/2021_Tang.mp3', name: '唐茜靖 2021', artist: 'TANG Xijing', year: '2021', country: 'CHN' },
        { file: './music/gym/2023_Alice_D_Amato.mp3', name: '达马托 2023', artist: "Alice D'Amato", year: '2023', country: 'ITA' },
        { file: './music/gym/2023_Alice_Kinsella.mp3', name: '金塞拉 2023', artist: 'Alice Kinsella', year: '2023', country: 'GBR' },
        { file: './music/gym/2023_Ou.mp3', name: '欧钰珊 2023', artist: 'OU Yushan', year: '2023', country: 'CHN' },
        { file: './music/gym/2023_Qiu.mp3', name: '邱祺缘 2023', artist: 'QIU Qiyuan', year: '2023', country: 'CHN' },
        { file: './music/gym/2023_Rebeca_Andrade.mp3', name: '安德拉德 2023', artist: 'Rebeca Andrade', year: '2023', country: 'BRA' },
        { file: './music/gym/2023_Zhou.mp3', name: '周雅琴 2023', artist: 'ZHOU Yaqin', year: '2023', country: 'CHN' },
        { file: './music/gym/2024_Zhou.mp3', name: '周雅琴 2024', artist: 'ZHOU Yaqin', year: '2024', country: 'CHN' },
        { file: './music/gym/2025_Lia_Monica_Fontaine.mp3', name: 'Lia Monica Fontaine 2025', artist: 'Lia Monica Fontaine', year: '2025', country: 'CAN' },
        { file: './music/gym/2025_Sabrina_Maneca_Voinea.mp3', name: 'Sabrina Maneca Voinea 2025', artist: 'Sabrina Maneca Voinea', year: '2025', country: 'ROU' }
    ],

    // ==========================================
    // 🎬 Hero引擎媒体数据
    // ==========================================
    heroMedia: {
        videos: [
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
        classicImages: [
            './images/classic/Simone_Biles_Showcast.jpeg', 
            './images/classic/Rebeca_Andrade_Showcast.jpg', 
            './images/classic/Ruby_Evans_Showcast.jpg', 
            './images/classic/Ou_Yushan_Showcast.jpg', 
            './images/classic/Brooklyn_Moors_Showcast.jpg'
        ],
        galleryImages: [
            './images/gallery/Zhou_Yaqin_Showcast.jpg', './images/gallery/Zhou_Yaqin_Showcast2.jpg',
            './images/gallery/Zhang_Yihan_Showcast.jpg', './images/gallery/Zhang_Yihan_Showcast2.jpg', 
            './images/gallery/Kishi_Rina_Showcast.jpg', 
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
        // 导演时间轴 - 调整顺序：先显示gallery图片，给视频缓冲多一点时间
        sequence: ['video', 'video', 'video', 'gallery', 'gallery', 'gallery', 'classic', 'classic', 'classic']
    },

    // ==========================================
    // 🎴 动作卡片媒体路径配置
    // ==========================================
    skillMedia: {
        // 图片基础路径
        imageBasePath: './cards/cardimages/',
        
        // 视频基础路径（如果有动作演示视频）
        videoBasePath: './cards/videos/',
        
        // 图片文件格式
        imageFormat: '.png',
        
        // 视频文件格式
        videoFormat: '.mp4',
        
        // 各组图片路径映射
        groupPaths: {
            '1': 'group01/',  // 第1组：体操跳步
            '2': 'group02/',  // 第2组：转体
            '3': 'group03/',  // 第3组：技巧
            '4': 'group04/',  // 第4组：技巧
            '5': 'group05/'   // 第5组：技巧
        }
    }
};
