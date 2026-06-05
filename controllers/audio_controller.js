// ==========================================
// AudioEngine 音频引擎控制器
// ==========================================
window.AudioEngine = {
    wavesurfer: null,
    wsRegions: null,
    isPlaying: false,
    currentMarkerIndex: 0,
    markers: [],
    musicMode: false,

    // 初始化音频引擎
    init: function() {
        if (this.wavesurfer) {
            this.wavesurfer.destroy();
        }

        this.wavesurfer = WaveSurfer.create({
            container: '#waveformContainer',
            waveColor: '#3B82F6',
            progressColor: '#8B5CF6',
            cursorColor: '#EF4444',
            cursorWidth: 2,
            barWidth: 2,
            barGap: 1,
            height: 60,
            barRadius: 2,
            normalize: true,
            responsive: true,
            plugins: [
                WaveSurfer.Regions.create(),
                WaveSurfer.Timeline.create({
                    container: '#waveformContainer',
                    height: 20,
                    primaryColor: '#9CA3AF',
                    secondaryColor: '#E5E7EB',
                    fontFamily: 'monospace',
                    fontSize: 10
                })
            ]
        });

        this.wsRegions = this.wavesurfer.registerPlugin(WaveSurfer.Regions.create());

        // 绑定事件
        this.wavesurfer.on('ready', () => {
            this.onAudioReady();
        });

        this.wavesurfer.on('finish', () => {
            this.onAudioFinish();
        });

        this.wavesurfer.on('audioprocess', (currentTime) => {
            this.onAudioProcess(currentTime);
        });

        this.wavesurfer.on('seek', (progress) => {
            const currentTime = progress * this.wavesurfer.getDuration();
            this.onAudioSeek(currentTime);
        });
    },

    // 加载音频
    loadAudio: function(audioUrl) {
        if (!this.wavesurfer) {
            this.init();
        }
        this.wavesurfer.load(audioUrl);
    },

    // 播放/暂停
    playPause: function() {
        if (!this.wavesurfer) return;
        
        const currentTime = this.wavesurfer.getCurrentTime();
        const duration = this.wavesurfer.getDuration();
        
        // 如果已经播放完，从头开始
        if (currentTime >= duration - 0.1) {
            this.wavesurfer.seekTo(0);
        }
        
        this.wavesurfer.playPause();
        this.isPlaying = !this.isPlaying;
    },

    // 停止播放
    stop: function() {
        if (this.wavesurfer) {
            this.wavesurfer.stop();
            this.isPlaying = false;
            this.currentMarkerIndex = 0;
        }
    },

    // 设置标记点
    setMarkers: function(markers) {
        this.markers = markers;
        this.currentMarkerIndex = 0;
    },

    // 添加标记点
    addMarker: function(time, label) {
        this.markers.push({ time, label });
        this.markers.sort((a, b) => a.time - b.time);
    },

    // 删除标记点
    removeMarker: function(index) {
        if (index >= 0 && index < this.markers.length) {
            this.markers.splice(index, 1);
        }
    },

    // 清空所有标记点
    clearMarkers: function() {
        this.markers = [];
        this.currentMarkerIndex = 0;
    },

    // 跳转到指定标记
    jumpToMarker: function(index) {
        if (index >= 0 && index < this.markers.length && this.wavesurfer) {
            this.wavesurfer.seekTo(this.markers[index].time / this.wavesurfer.getDuration());
            this.currentMarkerIndex = index;
        }
    },

    // 音频就绪回调
    onAudioReady: function() {
        ToastManager.show('success', '音频加载完成', '🎵 音乐已准备就绪，可以开始编排了！', 2000);
    },

    // 音频播放完成回调
    onAudioFinish: function() {
        this.isPlaying = false;
        this.currentMarkerIndex = 0;
        
        // 如果在观赏模式下，循环播放
        if (window.AppController && window.AppController.isViewingMode) {
            setTimeout(() => {
                this.wavesurfer.seekTo(0);
                this.wavesurfer.play();
            }, 1000);
        }
    },

    // 音频播放过程回调
    onAudioProcess: function(currentTime) {
        // 更新当前标记索引
        for (let i = this.markers.length - 1; i >= 0; i--) {
            if (currentTime >= this.markers[i].time) {
                if (i !== this.currentMarkerIndex) {
                    this.currentMarkerIndex = i;
                    this.onMarkerReached(i);
                }
                break;
            }
        }

        // 更新 UI
        this.updateTimeDisplay(currentTime);
    },

    // 音频进度改变回调
    onAudioSeek: function(currentTime) {
        // 更新标记索引
        for (let i = this.markers.length - 1; i >= 0; i--) {
            if (currentTime >= this.markers[i].time) {
                this.currentMarkerIndex = i;
                break;
            }
        }
    },

    // 到达标记点回调
    onMarkerReached: function(index) {
        const marker = this.markers[index];
        if (marker) {
            ToastManager.show('info', `动作标记 ${index + 1}`, marker.label, 1500);
        }
    },

    // 更新时间显示
    updateTimeDisplay: function(currentTime) {
        // 可以在这里更新 UI 上的时间显示
        const duration = this.wavesurfer ? this.wavesurfer.getDuration() : 0;
        const formattedTime = this.formatTime(currentTime);
        const formattedDuration = this.formatTime(duration);
        
        // 更新时间显示元素
        const timeDisplay = document.getElementById('currentTimeDisplay');
        const durationDisplay = document.getElementById('durationDisplay');
        
        if (timeDisplay) timeDisplay.textContent = formattedTime;
        if (durationDisplay) durationDisplay.textContent = formattedDuration;
    },

    // 格式化时间
    formatTime: function(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        const ms = Math.floor((seconds % 1) * 100);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
    },

    // 导出标记点数据
    exportMarkers: function() {
        return {
            markers: this.markers,
            duration: this.wavesurfer ? this.wavesurfer.getDuration() : 0
        };
    },

    // 导入标记点数据
    importMarkers: function(data) {
        if (data && data.markers) {
            this.markers = data.markers;
            this.currentMarkerIndex = 0;
        }
    },

    // 切换音乐模式
    toggleMusicMode: function(enabled) {
        this.musicMode = enabled;
        
        const musicDrawer = document.getElementById('musicDrawer');
        if (musicDrawer) {
            if (enabled) {
                musicDrawer.classList.remove('translate-y-full');
            } else {
                musicDrawer.classList.add('translate-y-full');
            }
        }
    },

    // 获取当前时间
    getCurrentTime: function() {
        return this.wavesurfer ? this.wavesurfer.getCurrentTime() : 0;
    },

    // 获取总时长
    getDuration: function() {
        return this.wavesurfer ? this.wavesurfer.getDuration() : 0;
    }
};