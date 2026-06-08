-- ==============================================
--  🔧 修复版 SQL - 解决 "policy already exists" 错误
-- ==============================================
-- 如果你之前已经执行过 SQL，会因为 policy 已存在报错
-- 下面的脚本会先删再建，安全无风险
-- ==============================================


-- ==============================================
--  📹 动作视频表 skill_videos（确保表存在）
-- ==============================================
CREATE TABLE IF NOT EXISTS skill_videos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    skill_id VARCHAR(50) NOT NULL,
    slot_index INTEGER NOT NULL CHECK (slot_index IN (0, 1)),
    video_url TEXT NOT NULL,
    athlete_name VARCHAR(100),
    country_code VARCHAR(10),
    uploaded_by VARCHAR(100) NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(skill_id, slot_index)
);

-- 删除已有 policy（安全重新创建）
DROP POLICY IF EXISTS "Allow public read videos" ON skill_videos;
DROP POLICY IF EXISTS "Allow public insert videos" ON skill_videos;

ALTER TABLE skill_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read videos" ON skill_videos
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert videos" ON skill_videos
    FOR INSERT WITH CHECK (true);


-- ==============================================
--  💬 动作评论表 skill_comments（确保表存在）
-- ==============================================
CREATE TABLE IF NOT EXISTS skill_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    skill_id VARCHAR(50) NOT NULL,
    username VARCHAR(100) NOT NULL,
    content VARCHAR(30) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    likes_count INTEGER DEFAULT 0
);

DROP POLICY IF EXISTS "Allow public read comments" ON skill_comments;
DROP POLICY IF EXISTS "Allow public insert comments" ON skill_comments;

ALTER TABLE skill_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read comments" ON skill_comments
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert comments" ON skill_comments
    FOR INSERT WITH CHECK (true);


-- ==============================================
--  🔍 验证表是否正常工作（执行后看结果）
-- ==============================================
SELECT 'skill_videos 表已存在，当前记录数：' AS status, COUNT(*) FROM skill_videos;
SELECT 'skill_comments 表已存在，当前记录数：' AS status, COUNT(*) FROM skill_comments;
