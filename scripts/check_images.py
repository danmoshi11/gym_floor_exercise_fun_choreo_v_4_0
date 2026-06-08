#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
==========================================
检查图片路径是否正确
==========================================
"""

import os
import re

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_js_path = os.path.join(base_dir, 'data.js')
    cardimages_dir = os.path.join(base_dir, 'cards', 'cardimages')
    
    # 列出所有图片文件
    all_images = []
    for group_dir in ['group01', 'group02', 'group03', 'group04', 'group05']:
        group_path = os.path.join(cardimages_dir, group_dir)
        if os.path.exists(group_path):
            for f in os.listdir(group_path):
                if f.endswith('.png'):
                    rel_path = f'./cards/cardimages/{group_dir}/{f}'
                    all_images.append(rel_path)
    
    print("=" * 80)
    print("  All image files found:")
    print("=" * 80)
    for img in sorted(all_images):
        print(f"  {img}")
    
    # 读取 data.js 查找所有 image 路径
    with open(data_js_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 提取所有 image: "..." 路径
    image_pattern = r'image:\s*"([^"]+)"'
    data_images = re.findall(image_pattern, content)
    
    print("\n" + "=" * 80)
    print("  Checking image paths in data.js...")
    print("=" * 80)
    
    ok_count = 0
    missing = []
    
    for img in data_images:
        if img in all_images:
            print(f"  [OK] {img}")
            ok_count += 1
        else:
            print(f"  [MISSING] {img}")
            missing.append(img)
    
    print(f"\n  Summary: {ok_count}/{len(data_images)} images found")
    
    if missing:
        print("\n" + "=" * 80)
        print("  Missing image files (NOT FOUND on disk):")
        print("=" * 80)
        for m in missing:
            print(f"  {m}")

if __name__ == '__main__':
    main()