-- ==============================================
--  🚀 Supabase 初始化脚本 - 一键执行即可
-- ==============================================
-- 执行步骤：
-- 1. 登录 Supabase Dashboard → 选择你的项目
-- 2. 左侧菜单 → SQL Editor → New query
-- 3. 全选本文件内容 → 粘贴 → 点击 Run (▶)
-- 4. 然后去 Storage 创建 bucket（详见下方说明）
-- ==============================================


-- ==============================================
--  📹 动作视频表 skill_videos
-- ==============================================
CREATE TABLE IF NOT EXISTS skill_videos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    skill_id VARCHAR(50) NOT NULL,           -- 动作ID，如 "1.402", "5.401"
    slot_index INTEGER NOT NULL CHECK (slot_index IN (0, 1)),  -- 槽位 0 或 1
    video_url TEXT NOT NULL,                  -- Supabase Storage 的视频URL
    athlete_name VARCHAR(100),                -- 运动员姓名，如 "Ana Barbosu"
    country_code VARCHAR(10),                 -- 国家代码，如 "ROU", "CHN"
    uploaded_by VARCHAR(100) NOT NULL,        -- 上传者名称 ("admin" 或 用户名)
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),  -- 上传时间
    UNIQUE(skill_id, slot_index)              -- 每个动作的每个槽位只能有一个视频
);

-- 创建索引加速查询
CREATE INDEX IF NOT EXISTS idx_skill_videos_skill_id ON skill_videos(skill_id);
CREATE INDEX IF NOT EXISTS idx_skill_videos_uploaded_at ON skill_videos(uploaded_at);

-- ==============================================
--  🔐 表权限设置（允许公开读写）
-- ==============================================
ALTER TABLE skill_videos ENABLE ROW LEVEL SECURITY;

-- 允许所有人读取视频
CREATE POLICY "Allow public read videos" ON skill_videos
    FOR SELECT USING (true);

-- 允许所有人上传视频
CREATE POLICY "Allow public insert videos" ON skill_videos
    FOR INSERT WITH CHECK (true);

-- ==============================================
--  💬 动作评论表 skill_comments
-- ==============================================
CREATE TABLE IF NOT EXISTS skill_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    skill_id VARCHAR(50) NOT NULL,           -- 动作ID
    username VARCHAR(100) NOT NULL,          -- 评论者名称
    content VARCHAR(30) NOT NULL,            -- 评论内容（最多30字）
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),  -- 评论时间
    likes_count INTEGER DEFAULT 0            -- 点赞数
);

CREATE INDEX IF NOT EXISTS idx_skill_comments_skill_id ON skill_comments(skill_id);
CREATE INDEX IF NOT EXISTS idx_skill_comments_created_at ON skill_comments(created_at);

ALTER TABLE skill_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read comments" ON skill_comments
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert comments" ON skill_comments
    FOR INSERT WITH CHECK (true);

-- ==============================================
--  📦 Storage Bucket 设置（重要！需手动创建）
-- ==============================================
--  上面的 SQL 已经执行完后，请按以下步骤操作：
--
--  步骤 1：创建 bucket
--  - 左侧菜单 → Storage → New bucket
--  - Bucket name: skill-videos
--  - 勾选 "Make bucket public"（公开）
--  - 点击 Create bucket
--
--  步骤 2：设置 Storage 权限
--  - 在 skill-videos bucket → 点击 Policies
--  - 点击 "New policy" → "For full customization"
--
--  策略1（允许所有人上传）：
--  - Policy name: Allow public uploads
--  - Allowed operation: INSERT
--  - USING expression: true
--  - WITH CHECK expression: true
--
--  策略2（允许所有人读取）：
--  - Policy name: Allow public reads
--  - Allowed operation: SELECT
--  - USING expression: true
--
--  完成后，刷新你的网站即可！
-- ==============================================
