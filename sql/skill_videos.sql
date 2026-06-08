-- ==========================================
-- GymChoreo 动作视频表 (skill_videos)
-- ==========================================
-- 在 Supabase Dashboard 的 SQL Editor 中执行此脚本

-- 创建视频表
CREATE TABLE IF NOT EXISTS skill_videos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    skill_id VARCHAR(50) NOT NULL,           -- 动作ID，如 "1.101"
    slot_index INTEGER NOT NULL CHECK (slot_index IN (0, 1)),  -- 槽位 0 或 1
    
    -- 视频文件信息
    video_url TEXT NOT NULL,                  -- Supabase Storage 中的视频 URL
    athlete_name VARCHAR(100),                -- 运动员姓名
    country_code VARCHAR(10),                 -- 国家代码，如 "CHN", "USA"
    
    -- 上传者信息
    uploaded_by VARCHAR(100) NOT NULL,        -- 上传者名称（或 "匿名"）
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),  -- 上传时间
    
    -- 确保每个动作的每个槽位只有一个视频
    UNIQUE(skill_id, slot_index)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_skill_videos_skill_id ON skill_videos(skill_id);
CREATE INDEX IF NOT EXISTS idx_skill_videos_slot_index ON skill_videos(slot_index);

-- 设置 RLS (Row Level Security) 策略
ALTER TABLE skill_videos ENABLE ROW LEVEL SECURITY;

-- 允许所有人读取视频信息
CREATE POLICY "Allow public read videos" ON skill_videos
    FOR SELECT USING (true);

-- 允许所有人上传视频（但需要遵守槽位限制）
CREATE POLICY "Allow public insert videos" ON skill_videos
    FOR INSERT WITH CHECK (true);

-- ==========================================
-- 可选：如果你也想把视频存储到 Supabase Storage
-- ==========================================
-- 1. 在 Supabase Dashboard 的 Storage 中创建一个名为 "skill-videos" 的 bucket
-- 2. 设置 bucket 权限为 public（允许公开读取）
