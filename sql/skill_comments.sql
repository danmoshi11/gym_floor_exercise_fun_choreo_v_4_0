-- ==========================================
-- GymChoreo 动作评论表 (skill_comments)
-- ==========================================
-- 在 Supabase Dashboard 的 SQL Editor 中执行此脚本

-- 创建评论表
CREATE TABLE IF NOT EXISTS skill_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    skill_id VARCHAR(50) NOT NULL,           -- 动作ID，如 "1.101"
    username VARCHAR(100) NOT NULL,          -- 用户昵称
    content VARCHAR(30) NOT NULL,            -- 评论内容（30字以内）
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),  -- 创建时间
    
    -- 可选：点赞功能（如果需要）
    likes_count INTEGER DEFAULT 0            -- 点赞数
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_skill_comments_skill_id ON skill_comments(skill_id);
CREATE INDEX IF NOT EXISTS idx_skill_comments_created_at ON skill_comments(created_at);

-- 设置 RLS (Row Level Security) 策略
ALTER TABLE skill_comments ENABLE ROW LEVEL SECURITY;

-- 允许所有人读取评论
CREATE POLICY "Allow public read" ON skill_comments
    FOR SELECT USING (true);

-- 允许所有人插入评论（匿名用户也可以）
CREATE POLICY "Allow public insert" ON skill_comments
    FOR INSERT WITH CHECK (true);

-- 如果需要点赞功能，可以添加以下表
-- CREATE TABLE IF NOT EXISTS comment_likes (
--     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
--     comment_id UUID REFERENCES skill_comments(id) ON DELETE CASCADE,
--     user_identifier VARCHAR(100),          -- 用户标识（可用localStorage中的ID）
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
-- );