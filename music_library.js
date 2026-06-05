// ==========================================
// 🎵 音乐仓库模块 - 重构版
// ==========================================

// 精选体操音乐列表（项目自带）
const BUILTIN_MUSIC = [
    { file: '2019_Ou.mp3', name: '欧钰珊 2019', artist: 'OU Yushan', year: '2019', country: 'CHN' },
    { file: '2021_Angelina_Melnikova.mp3', name: '梅尔尼科娃 2021', artist: 'Angelina Melnikova', year: '2021', country: 'RUS' },
    { file: '2021_Lu.mp3', name: '芦玉菲 2021', artist: 'LU Yufei', year: '2021', country: 'CHN' },
    { file: '2021_Rebeca_Andrade.mp3', name: '安德拉德 2021', artist: 'Rebeca Andrade', year: '2021', country: 'BRA' },
    { file: '2021_Simone_Biles.mp3', name: '拜尔斯 2021', artist: 'Simone Biles', year: '2021', country: 'USA' },
    { file: '2021_Tang.mp3', name: '唐茜靖 2021', artist: 'TANG Xijing', year: '2021', country: 'CHN' },
    { file: '2023_Alice_D_Amato.mp3', name: '达马托 2023', artist: "Alice D'Amato", year: '2023', country: 'ITA' },
    { file: '2023_Alice_Kinsella.mp3', name: '金塞拉 2023', artist: 'Alice Kinsella', year: '2023', country: 'GBR' },
    { file: '2023_Ou.mp3', name: '欧钰珊 2023', artist: 'OU Yushan', year: '2023', country: 'CHN' },
    { file: '2023_Qiu.mp3', name: '邱祺缘 2023', artist: 'QIU Qiyuan', year: '2023', country: 'CHN' },
    { file: '2023_Rebeca_Andrade.mp3', name: '安德拉德 2023', artist: 'Rebeca Andrade', year: '2023', country: 'BRA' },
    { file: '2023_Zhou.mp3', name: '周雅琴 2023', artist: 'ZHOU Yaqin', year: '2023', country: 'CHN' },
    { file: '2024_Zhou.mp3', name: '周雅琴 2024', artist: 'ZHOU Yaqin', year: '2024', country: 'CHN' },
    // ✨ 2025年新增音乐
    { file: '2025_Lia_Monica_Fontaine.mp3', name: 'Lia Monica Fontaine 2025', artist: 'Lia Monica Fontaine', year: '2025', country: 'CAN' },
    { file: '2025_Sabrina_Maneca_Voinea.mp3', name: 'Sabrina Maneca Voinea 2025', artist: 'Sabrina Maneca Voinea', year: '2025', country: 'ROU' }
];

// 音乐播放器
window.MusicPlayer = {
    audio: null,
    currentTrack: null,
    playlist: [],
    currentIndex: -1,
    isPlaying: false,
    volume: 0.8,

    init: function() {
        this.audio = new Audio();
        this.audio.volume = this.volume;
        
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => this.onTrackEnd());
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
        this.audio.addEventListener('error', (e) => this.onError(e));
        
        console.log('🎵 MusicPlayer 初始化完成');
    },

    // 播放指定曲目
    play: function(url, title, artist) {
        if (!this.audio) this.init();
        
        this.audio.src = url;
        this.currentTrack = { url, title, artist };
        
        this.audio.play().then(() => {
            this.isPlaying = true;
            this.updateUI();
            this.showPlayer();
            ToastManager.show('success', '正在播放', title, 2000);
        }).catch(err => {
            console.error('播放失败:', err);
            ToastManager.show('error', '播放失败', '无法播放此音乐', 2000);
        });
    },

    // 播放/暂停切换
    togglePlay: function() {
        if (!this.audio || !this.audio.src) {
            ToastManager.show('info', '提示', '请先选择一首音乐', 2000);
            return;
        }
        
        if (this.isPlaying) {
            this.audio.pause();
            this.isPlaying = false;
        } else {
            this.audio.play().then(() => {
                this.isPlaying = true;
            }).catch(err => console.error(err));
        }
        this.updateUI();
    },

    // 上一曲
    prevTrack: function() {
        if (this.playlist.length === 0) return;
        
        this.currentIndex = (this.currentIndex - 1 + this.playlist.length) % this.playlist.length;
        const track = this.playlist[this.currentIndex];
        this.play(track.url, track.title, track.artist);
    },

    // 下一曲
    nextTrack: function() {
        if (this.playlist.length === 0) return;
        
        this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
        const track = this.playlist[this.currentIndex];
        this.play(track.url, track.title, track.artist);
    },

    // 设置播放列表
    setPlaylist: function(tracks) {
        this.playlist = tracks;
        this.currentIndex = 0;
    },

    // 设置音量
    setVolume: function(value) {
        this.volume = value / 100;
        if (this.audio) {
            this.audio.volume = this.volume;
        }
    },

    // 跳转进度
    seekTo: function(event) {
        if (!this.audio || !this.audio.duration) return;
        
        const progressBar = event.currentTarget;
        const rect = progressBar.getBoundingClientRect();
        const percent = (event.clientX - rect.left) / rect.width;
        this.audio.currentTime = percent * this.audio.duration;
    },

    // 更新进度
    updateProgress: function() {
        if (!this.audio) return;
        
        const currentTime = this.audio.currentTime;
        const duration = this.audio.duration || 0;
        const percent = duration > 0 ? (currentTime / duration) * 100 : 0;
        
        const progressBar = document.getElementById('progressBar');
        const currentTimeEl = document.getElementById('currentTime');
        
        if (progressBar) progressBar.style.width = percent + '%';
        if (currentTimeEl) currentTimeEl.textContent = this.formatTime(currentTime);
    },

    // 更新总时长
    updateDuration: function() {
        const totalTimeEl = document.getElementById('totalTime');
        if (totalTimeEl && this.audio) {
            totalTimeEl.textContent = this.formatTime(this.audio.duration);
        }
    },

    // 曲目结束
    onTrackEnd: function() {
        this.isPlaying = false;
        this.updateUI();
        
        // 自动播放下一曲
        if (this.playlist.length > 1) {
            this.nextTrack();
        }
    },

    // 错误处理
    onError: function(e) {
        console.error('音频加载错误:', e);
        ToastManager.show('error', '加载失败', '无法加载此音乐文件', 2000);
    },

    // 更新UI
    updateUI: function() {
        const playPauseIcon = document.getElementById('playPauseIcon');
        if (playPauseIcon) {
            playPauseIcon.textContent = this.isPlaying ? '⏸' : '▶';
        }
        
        if (this.currentTrack) {
            const playerTitle = document.getElementById('playerTitle');
            const playerArtist = document.getElementById('playerArtist');
            if (playerTitle) playerTitle.textContent = this.currentTrack.title;
            if (playerArtist) playerArtist.textContent = this.currentTrack.artist;
        }
    },

    // 显示播放器
    showPlayer: function() {
        const player = document.getElementById('musicPlayer');
        if (player) player.classList.remove('hidden');
    },

    // 格式化时间
    formatTime: function(seconds) {
        if (!seconds || isNaN(seconds)) return '00:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
};

// 加载精选体操音乐
window.loadBuiltinMusic = function() {
    const grid = document.getElementById('builtinMusicGrid');
    if (!grid) return;
    
    const countEl = document.getElementById('builtinCount');
    if (countEl) countEl.textContent = BUILTIN_MUSIC.length + ' 首';
    
    if (BUILTIN_MUSIC.length === 0) {
        grid.innerHTML = `
            <div class="text-center py-6">
                <div class="text-3xl mb-2">🎵</div>
                <div class="text-slate-400 font-bold">暂无精选音乐</div>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = '';
    
    BUILTIN_MUSIC.forEach((music, index) => {
        const fileUrl = `music/${music.file}`;
        const flagEmoji = getCountryFlag(music.country);
        
        grid.innerHTML += `
            <div class="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl p-3 hover:shadow-lg hover:border-indigo-300 transition-all cursor-pointer group mb-3" onclick="playBuiltinMusic(${index})">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <span class="text-white text-lg">🎵</span>
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="font-bold text-slate-800 truncate text-sm">${music.name}</div>
                        <div class="text-xs text-slate-500 truncate">${flagEmoji} ${music.artist} · ${music.year}</div>
                    </div>
                    <div class="opacity-0 group-hover:opacity-100 transition-opacity">
                        <span class="text-indigo-500 text-xl">▶</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    // 设置播放列表
    MusicPlayer.setPlaylist(BUILTIN_MUSIC.map(m => ({
        url: `music/${m.file}`,
        title: m.name,
        artist: `${getCountryFlag(m.country)} ${m.artist}`
    })));
};

// 播放精选音乐
window.playBuiltinMusic = function(index) {
    const music = BUILTIN_MUSIC[index];
    if (!music) return;
    
    const fileUrl = `music/${music.file}`;
    const flagEmoji = getCountryFlag(music.country);
    
    MusicPlayer.currentIndex = index;
    MusicPlayer.play(fileUrl, music.name, `${flagEmoji} ${music.artist}`);
};

// 获取国家旗帜emoji
function getCountryFlag(countryCode) {
    const flags = {
        'CHN': '🇨🇳',
        'USA': '🇺🇸',
        'RUS': '🇷🇺',
        'BRA': '🇧🇷',
        'ITA': '🇮🇹',
        'GBR': '🇬🇧',
        'JPN': '🇯🇵',
        'FRA': '🇫🇷',
        'CAN': '🇨🇦',
        'NED': '🇳🇱',
        'BEL': '🇧🇪',
        'ROU': '🇷🇴',
        'KOR': '🇰🇷',
        'GER': '🇩🇪'
    };
    return flags[countryCode] || '🏳️';
}

// 加载本地音乐库
window.loadMusicLibrary = async function() {
    const grid = document.getElementById('musicLibraryGrid');
    if (!grid) return;
    
    grid.innerHTML = '<div class="text-center py-6 text-slate-400 font-bold animate-pulse">📡 正在加载音乐库...</div>';
    
    try {
        // 从本地 IndexedDB 获取音乐列表
        if (typeof MusicManager !== 'undefined') {
            const localAudios = await MusicManager.getAllAudios();
            
            const countEl = document.getElementById('localCount');
            if (countEl) countEl.textContent = localAudios.length + ' 首';
            
            if (localAudios.length === 0) {
                grid.innerHTML = `
                    <div class="text-center py-6">
                        <div class="text-3xl mb-2">📁</div>
                        <div class="text-slate-400 font-bold">音乐库空空如也</div>
                        <div class="text-xs text-slate-300 mt-2">点击上方「上传私人音乐」添加您的曲目</div>
                    </div>
                `;
                return;
            }
            
            grid.innerHTML = '';
            localAudios.forEach(audio => {
                const blobUrl = URL.createObjectURL(audio.blob);
                grid.innerHTML += `
                    <div class="bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-100 rounded-xl p-3 hover:shadow-lg hover:border-pink-300 transition-all cursor-pointer group mb-3" onclick="playLocalMusic('${audio.id}', '${audio.name}')">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-500 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                <span class="text-white text-lg">🎵</span>
                            </div>
                            <div class="flex-1 min-w-0">
                                <div class="font-bold text-slate-800 truncate text-sm">${audio.name || '未命名音乐'}</div>
                                <div class="text-xs text-slate-500">${formatFileSize(audio.size || 0)} · 本地存储</div>
                            </div>
                            <div class="flex items-center gap-1">
                                <button onclick="event.stopPropagation(); deleteMusicFromLibrary('${audio.id}')" class="opacity-0 group-hover:opacity-100 bg-red-100 hover:bg-red-200 text-red-500 text-xs px-2 py-1 rounded transition-all">
                                    🗑
                                </button>
                                <span class="text-pink-500 text-xl opacity-0 group-hover:opacity-100 transition-opacity">▶</span>
                            </div>
                        </div>
                    </div>
                `;
            });
        } else {
            grid.innerHTML = `
                <div class="text-center py-6 text-red-400 font-bold">
                    ⚠️ MusicManager 未加载，请刷新页面
                </div>
            `;
        }
    } catch (error) {
        grid.innerHTML = `
            <div class="text-center py-6 text-red-400 font-bold">
                加载失败：${error.message}
            </div>
        `;
    }
};

// 播放本地音乐
window.playLocalMusic = async function(audioId, audioName) {
    if (typeof MusicManager === 'undefined') {
        ToastManager.show('error', '播放失败', 'MusicManager 未加载');
        return;
    }
    
    try {
        const audio = await MusicManager.getAudio(audioId);
        if (audio && audio.blob) {
            const blobUrl = URL.createObjectURL(audio.blob);
            MusicPlayer.play(blobUrl, audioName, '本地音乐');
        }
    } catch (error) {
        ToastManager.show('error', '播放失败', error.message);
    }
};

// 从音乐库删除音乐
window.deleteMusicFromLibrary = async function(audioId) {
    if (!confirm('确定要删除这首音乐吗？')) return;
    
    if (typeof MusicManager === 'undefined') {
        ToastManager.show('error', '删除失败', 'MusicManager 未加载');
        return;
    }
    
    try {
        await MusicManager.deleteAudio(audioId);
        ToastManager.show('success', '删除成功', '音乐已从库中移除', 2000);
        window.loadMusicLibrary(); // 刷新列表
    } catch (error) {
        ToastManager.show('error', '删除失败', error.message);
    }
};

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

// 初始化音乐仓库
window.initMusicLibrary = function() {
    MusicPlayer.init();
    loadBuiltinMusic();
    loadMusicLibrary();
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 延迟初始化，确保其他组件已加载
    setTimeout(() => {
        MusicPlayer.init();
    }, 1000);
});