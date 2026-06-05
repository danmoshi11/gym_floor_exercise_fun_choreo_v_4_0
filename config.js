// ==========================================
// 📋 配置文件 - 所有密码和限制参数集中管理
// ==========================================

const Config = {
    // 首页媒体上传密码（用于图片和视频上传到云端）
    homeMediaUploadPassword: '0000',
    SUPABASE_URL: 'https://aorjdomtvnlmwjhhetes.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvcmpkb210dm5sbXdqaGhldGVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0ODI4NjQsImV4cCI6MjA5NjA1ODg2NH0.Ism_ygrwbspclpQdz9x9cLKL2rY5WCXRQg-v3SaRA_k',
    // 文件大小限制配置
    limits: {
        // 图片限制：10MB
        imageMaxSize: 10 * 1024 * 1024,

        // 视频限制：50MB
        videoMaxSize: 50 * 1024 * 1024,

        // 音乐云端上传限制：9MB
        musicCloudMaxSize: 9 * 1024 * 1024,

        // 音乐本地上传限制：50MB（无大小限制，保留此参数以备将来使用）
        musicLocalMaxSize: 50 * 1024 * 1024
    },

    // 其他配置
    settings: {
        // 是否启用密码保护（true=启用，false=禁用）
        enableUploadPassword: true,

        // 上传文件保留天数（审核队列中）
        uploadRetentionDays: 30
    }
};
