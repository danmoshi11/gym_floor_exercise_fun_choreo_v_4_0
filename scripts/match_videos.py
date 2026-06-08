#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
==========================================
视频与动作匹配脚本
==========================================
功能:
1. 扫描 cardvideos 目录中的视频文件
2. 根据文件名解析动作ID、运动员姓名、国家
3. 更新 data.js 中的 video 字段
"""

import os
import re

def parse_video_filename(filename):
    """解析视频文件名"""
    name_without_ext = os.path.splitext(filename)[0]
    parts = name_without_ext.split('_')
    
    if len(parts) >= 3:
        # 格式: {动作ID}_{运动员}_{国家}
        skill_id_part = parts[0]
        country = parts[-1]
        athlete = '_'.join(parts[1:-1])
        
        # 转换回原始ID格式（将下划线改回点号）
        original_id = skill_id_part.replace('_', '.').replace('-', '.')
        
        return {
            'filename': filename,
            'skill_id': original_id,
            'athlete': athlete.replace('_', ' '),
            'country': country
        }
    return None

def update_data_js_with_videos(data_js_path, videos):
    """更新 data.js 中的视频信息"""
    with open(data_js_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    updated_count = 0
    
    for video in videos:
        skill_id = video['skill_id']
        video_path = f"./cards/cardvideos/{video['filename']}"
        
        # 构建 video 字段内容
        video_field = f'''video: {{
                src: "{video_path}",
                athlete: "{video['athlete']}",
                country: "{video['country']}"
            }}'''
        
        # 找到对应的动作对象并更新
        # 匹配模式: 在包含 id: "skill_id" 的对象中添加或更新 video 字段
        pattern = rf'(\{{\s*id:\s*["\']{re.escape(skill_id)}["\'][^{{}}]*?\}})'
        
        def replace_match(match):
            obj_str = match.group(1)
            
            # 检查是否已有 video 字段
            if 'video:' in obj_str:
                # 更新现有 video 字段
                new_obj = re.sub(r'video:\s*\{\s*[^}]+\s*\}', video_field, obj_str)
            else:
                # 添加新的 video 字段
                # 在 image 字段后添加
                new_obj = re.sub(r'(image:\s*["\'][^"\']+["\'])', r'\1,\n' + ' ' * 12 + video_field, obj_str)
            
            return new_obj
        
        new_content = re.sub(pattern, replace_match, content)
        
        if new_content != content:
            content = new_content
            updated_count += 1
            print(f"  Updated: {skill_id} -> {video['filename']}")
    
    with open(data_js_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"\nTotal updated: {updated_count} skills")

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_js_path = os.path.join(base_dir, 'data.js')
    cardvideos_dir = os.path.join(base_dir, 'cards', 'cardvideos')
    
    print("=" * 60)
    print("     Video Matching Script")
    print("=" * 60)
    print()
    
    if not os.path.exists(cardvideos_dir):
        os.makedirs(cardvideos_dir)
        print(f"Created directory: {cardvideos_dir}")
    
    # 获取所有视频文件
    video_extensions = ('.mp4', '.webm', '.mov')
    videos = []
    
    for f in os.listdir(cardvideos_dir):
        if f.lower().endswith(video_extensions):
            parsed = parse_video_filename(f)
            if parsed:
                videos.append(parsed)
                print(f"Found video: {f}")
                print(f"  -> Skill ID: {parsed['skill_id']}")
                print(f"  -> Athlete: {parsed['athlete']}")
                print(f"  -> Country: {parsed['country']}")
                print()
    
    if videos:
        print("Updating data.js with video information...")
        update_data_js_with_videos(data_js_path, videos)
    else:
        print("No videos found in cardvideos directory.")
    
    print("=" * 60)
    print("Done!")

if __name__ == '__main__':
    main()