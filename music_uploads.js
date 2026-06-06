// ==========================================
// 🎵 音乐上传功能（增强版）
// ==========================================

// 全局变量存储上传状态
let currentUploadFile = null;
let currentLocalRecord = null;
const CLOUD_SIZE_LIMIT = 9 * 1024 * 1024; // 9MB

// 显示上传音乐模态框
window.showUploadMusicModal = function() {
    // 创建上传音乐模态框
    const modalHtml = `
        <div id="uploadMusicModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] hidden flex items-center justify-center p-4">
            <div class="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col">
                <!-- 步骤1：选择文件 -->
                <div id="uploadStep1" class="flex flex-col">
                    <div class="bg-gradient-to-r from-purple-600 to-indigo-600 p-5 flex justify-between items-center text-white shrink-0">
                        <h2 class="text-xl font-black flex items-center gap-2">🎵 上传私人音乐</h2>
                        <button onclick="cancelMusicUpload()" class="bg-white/20 hover:bg-white/30 rounded-full w-8 h-8 flex items-center justify-center font-bold transition-colors">&times;</button>
                    </div>
                    <div class="p-6 flex-1">
                        <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                            <p class="text-sm font-bold text-amber-800">
                                💡 本地上传不限制大小，上传到云端需 ≤ 9MB
                            </p>
                        </div>
                        <div id="musicUploadArea" class="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-purple-400 hover:bg-purple-50 transition-all cursor-pointer">
                            <input type="file" id="musicFileInput" accept="audio/*" class="hidden" onchange="handleMusicFileSelect(this)">
                            <div class="text-4xl mb-2">🎶</div>
                            <div class="text-sm font-bold text-slate-500">点击选择音乐文件</div>
                            <div class="text-xs text-slate-400 mt-1">支持 MP3、WAV、OGG、M4A 格式</div>
                        </div>
                    </div>
                </div>
                
                <!-- 步骤2：确认上传 -->
                <div id="uploadStep2" class="flex flex-col hidden">
                    <div class="bg-gradient-to-r from-blue-600 to-cyan-600 p-5 flex justify-between items-center text-white shrink-0">
                        <h2 class="text-xl font-black flex items-center gap-2">📋 确认上传</h2>
                        <button onclick="cancelMusicUpload()" class="bg-white/20 hover:bg-white/30 rounded-full w-8 h-8 flex items-center justify-center font-bold transition-colors">&times;</button>
                    </div>
                    <div class="p-6 flex-1">
                        <div id="selectedFileInfo" class="bg-slate-50 rounded-xl p-4 mb-6"></div>
                        
                        <div class="space-y-3">
                            <button onclick="uploadToLocalOnly()" class="w-full bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-colors">
                                💾 仅保存到本地（无大小限制）
                            </button>
                            
                            <button id="uploadToCloudBtn" onclick="uploadToCloud()" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                                ☁️ 保存到本地并上传到云端
                            </button>
                            
                            <button onclick="backToStep1()" class="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-2 rounded-xl transition-colors">
                                ↩️ 重新选择文件
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- 步骤3：上传进度 -->
                <div id="uploadStep3" class="flex flex-col hidden">
                    <div class="bg-gradient-to-r from-green-600 to-emerald-600 p-5 flex justify-between items-center text-white shrink-0">
                        <h2 class="text-xl font-black flex items-center gap-2">⏳ 上传中...</h2>
                        <button onclick="cancelMusicUpload()" class="bg-white/20 hover:bg-white/30 rounded-full w-8 h-8 flex items-center justify-center font-bold transition-colors">&times;</button>
                    </div>
                    <div class="p-6 flex-1">
                        <div id="uploadProgress" class="space-y-4">
                            <div class="bg-slate-100 rounded-full h-3 overflow-hidden">
                                <div id="progressBar" class="bg-green-500 h-full transition-all"></div>
                            </div>
                            <div id="uploadStatus" class="text-center text-slate-500">正在上传...</div>
                        </div>
                    </div>
                </div>
                
                <!-- 步骤4：上传成功 -->
                <div id="uploadStep4" class="flex flex-col hidden">
                    <div class="bg-gradient-to-r from-green-600 to-emerald-600 p-5 flex justify-between items-center text-white shrink-0">
                        <h2 class="text-xl font-black flex items-center gap-2">✅ 上传成功</h2>
                        <button onclick="cancelMusicUpload()" class="bg-white/20 hover:bg-white/30 rounded-full w-8 h-8 flex items-center justify-center font-bold transition-colors">&times;</button>
                    </div>
                    <div class="p-6 flex-1">
                        <div class="text-center">
                            <div class="text-6xl mb-4">🎉</div>
                            <div class="text-lg font-bold text-slate-800 mb-2" id="successMessage"></div>
                            <div class="text-sm text-slate-500 mb-6" id="successDetail"></div>
                            <button onclick="cancelMusicUpload()" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl transition-colors">
                                完成
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // 移除旧模态框（如果存在）
    const oldModal = document.getElementById('uploadMusicModal');
    if (oldModal) oldModal.remove();
    
    // 添加新模态框
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    document.getElementById('uploadMusicModal').classList.remove('hidden');
    
    // 绑定点击事件
    const uploadArea = document.getElementById('musicUploadArea');
    const fileInput = document.getElementById('musicFileInput');
    if (uploadArea && fileInput) {
        uploadArea.addEventListener('click', () => fileInput.click());
    }
    
    // 重置状态
    currentUploadFile = null;
    currentLocalRecord = null;
};

// 选择文件
window.handleMusicFileSelect = function(input) {
    const file = input.files[0];
    if (!file) return;
    
    currentUploadFile = file;
    
    // 检查文件类型
    const validTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/x-m4a'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(mp3|wav|ogg|m4a)$/i)) {
        ToastManager.show('error', '格式不支持', '请上传 MP3、WAV、OGG 或 M4A 格式的音乐', 3000);
        input.value = '';
        return;
    }
    
    // 显示文件信息
    const fileInfo = `
        <div class="flex items-center gap-3 mb-2">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span class="text-2xl">🎵</span>
            </div>
            <div class="flex-1">
                <div class="font-bold text-slate-800">${file.name}</div>
                <div class="text-xs text-slate-500">${formatFileSize(file.size)}</div>
            </div>
        </div>
        ${file.size > CLOUD_SIZE_LIMIT ? `
            <div class="bg-red-50 border border-red-200 rounded-lg p-3">
                <div class="text-sm font-bold text-red-700">⚠️ 文件过大</div>
                <div class="text-xs text-red-600">文件大小 ${formatFileSize(file.size)}，超过云端限制 9MB</div>
                <div class="text-xs text-red-600">仅可选择"保存到本地"</div>
            </div>
        ` : `
            <div class="bg-green-50 border border-green-200 rounded-lg p-3">
                <div class="text-sm font-bold text-green-700">✓ 文件大小符合要求</div>
                <div class="text-xs text-green-600">可上传到云端音乐池</div>
            </div>
        `}
    `;
    
    document.getElementById('selectedFileInfo').innerHTML = fileInfo;
    
    // 禁用或启用云端上传按钮
    const cloudBtn = document.getElementById('uploadToCloudBtn');
    if (file.size > CLOUD_SIZE_LIMIT) {
        cloudBtn.disabled = true;
        cloudBtn.classList.add('opacity-50', 'cursor-not-allowed');
        cloudBtn.innerHTML = '☁️ 文件过大，无法上传到云端';
    } else {
        cloudBtn.disabled = false;
        cloudBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        cloudBtn.innerHTML = '☁️ 保存到本地并上传到云端';
    }
    
    // 切换到步骤2
    document.getElementById('uploadStep1').classList.add('hidden');
    document.getElementById('uploadStep2').classList.remove('hidden');
};

// 仅保存到本地
window.uploadToLocalOnly = async function() {
    if (!currentUploadFile) return;
    
    try {
        // 显示进度
        document.getElementById('uploadStep2').classList.add('hidden');
        document.getElementById('uploadStep3').classList.remove('hidden');
        document.getElementById('uploadStatus').textContent = '正在保存到本地...';
        document.getElementById('progressBar').style.width = '50%';
        
        // 保存到本地 IndexedDB
        if (typeof MusicManager !== 'undefined') {
            currentLocalRecord = await MusicManager.saveAudio(currentUploadFile);
            
            // 完成
            document.getElementById('progressBar').style.width = '100%';
            document.getElementById('uploadStatus').textContent = '保存完成';
            
            setTimeout(() => {
                document.getElementById('uploadStep3').classList.add('hidden');
                document.getElementById('uploadStep4').classList.remove('hidden');
                document.getElementById('successMessage').textContent = '已保存到本地音乐库';
                document.getElementById('successDetail').textContent = `文件：${currentUploadFile.name}`;
                
                // 刷新音乐库
                window.loadMusicLibrary();
            }, 500);
        } else {
            ToastManager.show('error', '保存失败', 'MusicManager 未加载', 3000);
            cancelMusicUpload();
        }
    } catch (error) {
        ToastManager.show('error', '保存失败', error.message, 3000);
        cancelMusicUpload();
    }
};

// 保存到本地并上传到云端
window.uploadToCloud = async function() {
    if (!currentUploadFile) return;
    
    // 检查文件大小
    if (currentUploadFile.size > CLOUD_SIZE_LIMIT) {
        ToastManager.show('error', '文件过大', `文件大小 ${formatFileSize(currentUploadFile.size)}，超过云端限制 9MB`, 3000);
        return;
    }
    
    // 🔒 密码验证（仅云端上传需要）
    if (Config.settings.enableUploadPassword) {
        const UPLOAD_SECRET = Config.homeMediaUploadPassword;
        
        // ⚠️ 把原来的 prompt 替换成我们的自定义弹窗
        const userInput = await window.customPasswordPrompt("🔒 此功能为内部专属通道。\n请输入上传密码：");

        if (userInput === null) {
            // 用户点击取消
            return;
        }

        if (userInput !== UPLOAD_SECRET) {
            ToastManager.show('error', '密码错误', '上传密码不正确，系统已拒绝上传请求！', 3000);
            return;
        }
    }
    
    try {
        // 显示进度
        document.getElementById('uploadStep2').classList.add('hidden');
        document.getElementById('uploadStep3').classList.remove('hidden');
        document.getElementById('uploadStatus').textContent = '正在保存到本地...';
        document.getElementById('progressBar').style.width = '0%';
        
        // 步骤1：保存到本地
        if (typeof MusicManager !== 'undefined') {
            currentLocalRecord = await MusicManager.saveAudio(currentUploadFile);
            document.getElementById('uploadStatus').textContent = '正在上传到云端...';
            document.getElementById('progressBar').style.width = '50%';
            
            // 步骤2：上传到云端（已连接 Supabase）
            await performCloudUpload();
            
            document.getElementById('progressBar').style.width = '100%';
            document.getElementById('uploadStatus').textContent = '上传完成';
            
            setTimeout(() => {
                document.getElementById('uploadStep3').classList.add('hidden');
                document.getElementById('uploadStep4').classList.remove('hidden');
                document.getElementById('successMessage').textContent = '已保存到本地并上传到云端';
                document.getElementById('successDetail').textContent = `文件：${currentUploadFile.name}（等待管理员审核）`;
                
                // 刷新音乐库
                window.loadMusicLibrary();
            }, 500);
        } else {
            ToastManager.show('error', '上传失败', 'MusicManager 未加载', 3000);
            cancelMusicUpload();
        }
    } catch (error) {
        ToastManager.show('error', '上传失败', error.message, 3000);
        cancelMusicUpload();
    }
};

// 真实云端上传（已连接 Supabase）
async function performCloudUpload() {
    // 确保正确获取 Supabase 实例
    const supabaseClient = typeof SupabaseEngine !== 'undefined' ? SupabaseEngine.client : window.supabase;
    if (!supabaseClient) throw new Error('云数据库未连接');

    // 生成安全干净的文件名（丢弃原文件名中的中文字符，防止 url 错误）
    const fileExt = currentUploadFile.name.split('.').pop().toLowerCase();
    const safeFileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    // 1. 上传文件到 music-pool
    const { data: uploadData, error: uploadError } = await supabaseClient.storage
        .from('music-pool')
        .upload(safeFileName, currentUploadFile, {
            cacheControl: '3600',
            upsert: false
        });
    
    if (uploadError) {
        throw new Error(`上传失败: ${uploadError.message}`);
    }
    
    // 2. 插入审核队列记录
    const { error: insertError } = await supabaseClient
        .from('music_audit_queue')
        .insert({
            uploader_name: window.currentUser?.name || '匿名用户',
            file_name: currentUploadFile.name, // 数据库里保留原来的中文名用于显示
            file_path: uploadData.path,        // 这里存的是干净的云端路径
            file_size: currentUploadFile.size,
            mime_type: currentUploadFile.type,
            status: 'pending'
        });
    
    if (insertError) {
        // 如果数据库记录插入失败，立刻把刚传的文件删掉，防止产生死数据
        await supabaseClient.storage.from('music-pool').remove([uploadData.path]);
        throw new Error(`队列记录失败: ${insertError.message}`);
    }
    
    return uploadData;
}

// 返回步骤1
window.backToStep1 = function() {
    document.getElementById('uploadStep2').classList.add('hidden');
    document.getElementById('uploadStep1').classList.remove('hidden');
    document.getElementById('musicFileInput').value = '';
    currentUploadFile = null;
};

// 取消上传
window.cancelMusicUpload = function() {
    const modal = document.getElementById('uploadMusicModal');
    if (modal) modal.remove();
    
    // 重置状态
    currentUploadFile = null;
    currentLocalRecord = null;
};

// 云端音乐播放
window.playCloudMusic = function(url, name) {
    if (typeof AudioManager !== 'undefined') {
        AudioManager.playExternalAudio(url, name);
    } else {
        // 备用播放方式
        const audio = new Audio(url);
        audio.play().catch(e => {
            ToastManager.show('error', '播放失败', '无法播放云端音乐：' + e.message, 3000);
        });
    }
};

// 下载云端音乐到本地
window.downloadCloudMusic = async function(url, name) {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = name || 'music.mp3';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(downloadUrl);
        ToastManager.show('success', '下载成功', `已下载：${name}`, 3000);
    } catch (e) {
        ToastManager.show('error', '下载失败', '无法下载云端音乐：' + e.message, 3000);
    }
};