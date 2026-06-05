// ==========================================
// 🖼️ 首页媒体上传模块
// ==========================================

let uploadedFiles = [];

// 处理图片选择
window.handleImageSelect = function(input) {
    const files = Array.from(input.files);
    addFiles(files, 'image');
};

// 处理视频选择
window.handleVideoSelect = function(input) {
    const files = Array.from(input.files);
    addFiles(files, 'video');
};

// 添加文件到列表
function addFiles(files, type) {
    files.forEach(file => {
        const fileInfo = {
            id: Date.now() + Math.random(),
            name: file.name,
            size: formatFileSize(file.size),
            type: type,
            file: file
        };
        uploadedFiles.push(fileInfo);
    });
    updateFileList();
}

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

// 更新文件列表显示
function updateFileList() {
    const fileList = document.getElementById('selectedFiles');
    const fileCount = document.getElementById('fileCount');
    
    if (uploadedFiles.length === 0) {
        fileList.innerHTML = '<p class="text-center text-slate-400 text-sm py-4">暂无选择的文件</p>';
        fileCount.textContent = '0';
        return;
    }
    
    fileCount.textContent = uploadedFiles.length;
    fileList.innerHTML = uploadedFiles.map(file => `
        <div class="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div class="w-10 h-10 rounded-lg bg-${file.type === 'image' ? 'blue' : 'purple'}-100 flex items-center justify-center shrink-0">
                <span class="text-xl">${file.type === 'image' ? '🖼️' : '🎬'}</span>
            </div>
            <div class="flex-1 min-w-0">
                <div class="text-sm font-bold text-slate-800 truncate">${file.name}</div>
                <div class="text-xs text-slate-400">${file.size}</div>
            </div>
            <button onclick="removeUploadFile(${file.id})" class="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors">
                ✕
            </button>
        </div>
    `).join('');
}

// 移除文件
window.removeUploadFile = function(fileId) {
    uploadedFiles = uploadedFiles.filter(f => f.id !== fileId);
    updateFileList();
};

// 清空所有文件
window.clearUploadFiles = function() {
    uploadedFiles = [];
    document.getElementById('imageUpload').value = '';
    document.getElementById('videoUpload').value = '';
    updateFileList();
};

// 确认上传
window.confirmUpload = async function() {
    if (uploadedFiles.length === 0) {
        ToastManager.show('warning', '请选择文件', '请先选择要上传的图片或视频', 2000);
        return;
    }
    
    // 确保 Supabase 引擎已加载且连接成功
    if (typeof SupabaseEngine === 'undefined' || !SupabaseEngine.client) {
        ToastManager.show('error', '云端未连接', '无法连接到服务器，请刷新页面重试。');
        return;
    }

    // 🔒 专属上传密码拦截大门
    const UPLOAD_SECRET = Config.homeMediaUploadPassword;
    const userInput = prompt("🔒 此功能为内部专属通道。靴靴\n这个邀请码请在某宝上面购买哈。\n请输入【夹带私货】的上传密码：");

    if (userInput === null) {
        return; 
    }
    
    if (userInput !== UPLOAD_SECRET) {
        ToastManager.show('error', '密码错误', '上传密码不正确，系统已拒绝上传请求！', 3000);
        return;
    }
    
    const modal = document.getElementById('uploadModal');
    const confirmBtn = modal.querySelector('button:last-child');
    const supabase = SupabaseEngine.client;
    
    // 显示加载状态
    confirmBtn.innerHTML = '⏳ 上传中，请勿关闭页面...';
    confirmBtn.disabled = true;
    
    try {
        let successCount = 0;
        const uploaderName = localStorage.getItem('gymUsername') || '匿名用户';
        
        // 🚨 请确保你在 Supabase Storage 中创建了名为 'user_media' 的存储桶
        const BUCKET_NAME = 'user_media';

        for (const fileInfo of uploadedFiles) {
            const file = fileInfo.file;
            const fileExt = file.name.split('.').pop();
            
            // 分类存入对应的文件夹 (images/ 或 videos/)，并用时间戳生成唯一文件名防冲突
            const folder = fileInfo.type === 'image' ? 'images' : 'videos';
            const uniqueFileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `${folder}/${uniqueFileName}`;

            // 将文件实体推送到 Supabase Storage
            const { data: storageData, error: storageError } = await supabase.storage
                .from(BUCKET_NAME)
                .upload(filePath, file);

            if (storageError) throw storageError;

            // 获取刚刚上传文件的公共访问链接
            const { data: publicUrlData } = supabase.storage
                .from(BUCKET_NAME)
                .getPublicUrl(filePath);

            successCount++;
        }

        // 上传完成，清空列表并显示成功消息
        ToastManager.show('success', '上传成功', `成功上传 ${successCount} 个文件！`, 3000);
        clearUploadFiles();
        
        // 重置按钮状态
        confirmBtn.innerHTML = '确认上传';
        confirmBtn.disabled = false;
        
        // 关闭模态框
        const uploadModal = document.getElementById('uploadModal');
        if (uploadModal) {
            uploadModal.remove();
        }
        
    } catch (error) {
        console.error('上传失败:', error);
        ToastManager.show('error', '上传失败', error.message, 3000);
        
        // 重置按钮状态
        confirmBtn.innerHTML = '确认上传';
        confirmBtn.disabled = false;
    }
};

// 页面加载时绑定点击事件
document.addEventListener('DOMContentLoaded', () => {
    const imageArea = document.getElementById('imageUploadArea');
    const videoArea = document.getElementById('videoUploadArea');
    const imageInput = document.getElementById('imageUpload');
    const videoInput = document.getElementById('videoUpload');
    
    if (imageArea) {
        imageArea.addEventListener('click', () => imageInput.click());
    }
    if (videoArea) {
        videoArea.addEventListener('click', () => videoInput.click());
    }
});