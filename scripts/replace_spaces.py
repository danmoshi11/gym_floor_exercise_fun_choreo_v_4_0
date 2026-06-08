#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
==========================================
视频文件名格式化脚本（增强版）
==========================================
功能:
1. 将空格替换为下划线
2. 处理多个单词的运动员名字
3. 正确解析ID（点号、横线都转换为下划线）
4. 姓名：每个单词首字母大写
5. 国家：全大写
"""

import os
import re

def format_name(name):
    """格式化姓名：首字母大写"""
    return '_'.join(word.capitalize() for word in name.split('_'))

def format_country(country):
    """格式化国家：全大写"""
    return country.upper()

def is_country_candidate(word):
    """判断是否是国家候选词（3个字母的缩写）"""
    return len(word) == 3 and word.isalpha()

def smart_parse_filename(filename):
    """智能解析文件名"""
    name_without_ext = os.path.splitext(filename)[0]
    ext = os.path.splitext(filename)[1]
    
    # 先替换空格为下划线
    temp_name = name_without_ext.replace(' ', '_')
    
    # 从后往前找，找到第一个3个字母的词作为国家
    parts = temp_name.split('_')
    country = None
    country_idx = -1
    
    for i in range(len(parts)-1, max(0, len(parts)-2), -1):
        if is_country_candidate(parts[i]):
            country = parts[i]
            country_idx = i
            break
    
    if country is None or country_idx < 1:
        print(f"Warning: Cannot parse country from: {filename}")
        return None
    
    # 国家之前的部分是运动员姓名（可能多个词）
    athlete_parts = parts[1:country_idx]
    athlete = '_'.join(athlete_parts)
    
    # 第一部分是动作ID（需要转换格式）
    skill_id_part = parts[0]
    # 转换: 点号和横线都变为下划线
    skill_id_formatted = skill_id_part.replace('.', '_').replace('-', '_')
    
    # 格式化
    athlete_formatted = format_name(athlete)
    country_formatted = format_country(country)
    
    # 组合新文件名
    new_name = f"{skill_id_formatted}_{athlete_formatted}_{country_formatted}{ext}"
    
    return {
        'old_name': filename,
        'new_name': new_name,
        'skill_id': skill_id_formatted.replace('_', '.'),
        'athlete': athlete_formatted.replace('_', ' '),
        'country': country_formatted
    }

def rename_videos(cardvideos_dir):
    """重命名视频文件"""
    video_extensions = ('.mp4', '.webm', '.mov')
    renamed_count = 0
    renamed_list = []
    
    print("Scanning videos...")
    print()
    
    for f in os.listdir(cardvideos_dir):
        if f.lower().endswith(video_extensions):
            parsed = smart_parse_filename(f)
            
            if parsed:
                if parsed['new_name'] != f:
                    old_path = os.path.join(cardvideos_dir, f)
                    new_path = os.path.join(cardvideos_dir, parsed['new_name'])
                    
                    if os.path.exists(new_path):
                        print(f"  Skipping (exists): {f}")
                    else:
                        os.rename(old_path, new_path)
                        print(f"  Renamed: {f}")
                        print(f"    -> {parsed['new_name']}")
                        print(f"       Skill: {parsed['skill_id']}")
                        print(f"       Athlete: {parsed['athlete']}")
                        print(f"       Country: {parsed['country']}")
                        renamed_count += 1
                        renamed_list.append(parsed)
                else:
                    print(f"  OK: {f}")
    
    return renamed_count, renamed_list

def update_data_js_with_videos(data_js_path, renamed_list):
    """更新 data.js 中的视频信息"""
    with open(data_js_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    updated_count = 0
    
    for parsed in renamed_list:
        skill_id = parsed['skill_id']
        video_path = f"./cards/cardvideos/{parsed['new_name']}"
        
        # 构建 video 字段内容
        video_field = f'''video: {{
                src: "{video_path}",
                athlete: "{parsed['athlete']}",
                country: "{parsed['country']}"
            }}'''
        
        # 找到对应的动作对象并更新
        # 先尝试匹配精确的ID
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
            print(f"  Updated: {skill_id} -> {parsed['new_name']}")
    
    if updated_count > 0:
        with open(data_js_path, 'w', encoding='utf-8') as f:
            f.write(content)
    
    return updated_count

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_js_path = os.path.join(base_dir, 'data.js')
    cardvideos_dir = os.path.join(base_dir, 'cards', 'cardvideos')
    
    print("=" * 70)
    print("     Video File Name Formatter (Enhanced)")
    print("=" * 70)
    print()
    print("Rules:")
    print("  - Spaces -> Underscores")
    print("  - Dots & Hyphens in ID -> Underscores")
    print("  - Name: First letter uppercase (supports multiple words)")
    print("  - Country: All uppercase (3-letter code)")
    print()
    
    if not os.path.exists(cardvideos_dir):
        os.makedirs(cardvideos_dir)
        print(f"Created directory: {cardvideos_dir}")
        print("Done! (No videos to process)")
        return
    
    print("Step 1: Renaming video files...")
    print("-" * 70)
    renamed, renamed_list = rename_videos(cardvideos_dir)
    print(f"\nRenamed {renamed} files")
    
    print("\nStep 2: Updating data.js with video information...")
    print("-" * 70)
    updated = update_data_js_with_videos(data_js_path, renamed_list)
    print(f"Updated {updated} skills in data.js")
    
    print("\n" + "=" * 70)
    print("Done!")

if __name__ == '__main__':
    main()