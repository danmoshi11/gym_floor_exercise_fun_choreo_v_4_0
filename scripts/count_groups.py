#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
==========================================
动作分组统计脚本
==========================================
"""

import os
import re
import json

def parse_groups(data_js_path):
    """解析 data.js 中的分组数据"""
    with open(data_js_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    groups = {}
    
    # 匹配每个 group 的定义 (简化版本)
    group_names = ['group1_leaps', 'group2_turns', 'group3_hand_supports', 'group4_fwd_saltos', 'group5_bwd_saltos']
    
    for group_name in group_names:
        # 找到这个 group 的开始和结束位置
        start_pattern = rf'const {group_name}\s*=\s*{{'
        start_match = re.search(start_pattern, content)
        if not start_match:
            continue
        
        start_pos = start_match.end()
        
        # 找到对应的闭合大括号 (简单处理)
        end_pos = start_pos
        brace_count = 1
        while brace_count > 0 and end_pos < len(content):
            if content[end_pos] == '{':
                brace_count += 1
            elif content[end_pos] == '}':
                brace_count -= 1
            end_pos += 1
        
        group_content = content[start_pos:end_pos-1]
        
        # 提取所有动作对象中的 id
        id_pattern = r'id:\s*["\']([^"\']+)["\']'
        ids = re.findall(id_pattern, group_content)
        
        group_num = group_name.split('_')[0][-1]
        groups[f"group{int(group_num):02d}"] = {
            'name': group_name,
            'skill_count': len(ids),
            'skills': ids
        }
    
    return groups

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_js_path = os.path.join(base_dir, 'data.js')
    
    print("=" * 60)
    print("     Action Group Statistics")
    print("=" * 60)
    print()
    
    groups = parse_groups(data_js_path)
    
    total_skills = 0
    for group_id, info in sorted(groups.items()):
        total_skills += info['skill_count']
        print(f"Group {group_id}:")
        print(f"   Name: {info['name']}")
        print(f"   Skill Count: {info['skill_count']}")
        print(f"   First 5 IDs: {', '.join(info['skills'][:5])}{'...' if len(info['skills']) > 5 else ''}")
        print()
    
    print("=" * 60)
    print(f"Total: {total_skills} skills")
    print("=" * 60)
    print()
    
    # 创建分组目录
    cardimages_dir = os.path.join(base_dir, 'cards', 'cardimages')
    for group_id in sorted(groups.keys()):
        group_dir = os.path.join(cardimages_dir, group_id)
        os.makedirs(group_dir, exist_ok=True)
        print("Created directory:", group_dir)
    
    # 保存分组信息到文件
    groups_info_path = os.path.join(base_dir, 'scripts', 'groups_info.json')
    with open(groups_info_path, 'w', encoding='utf-8') as f:
        json.dump(groups, f, indent=2)
    print("Saved groups info to:", groups_info_path)
    
    print()
    print("Instructions:")
    print("1. Place images for each group into group01-group05 directories")
    print("2. Ensure image count matches statistics")
    print("3. Run rename_images_grouped.py for batch renaming")

if __name__ == '__main__':
    main()