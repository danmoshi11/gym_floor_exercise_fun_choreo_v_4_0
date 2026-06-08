#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
==========================================
检查哪些视频还没有更新
==========================================
"""

import os
import re

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_js_path = os.path.join(base_dir, 'data.js')
    cardvideos_dir = os.path.join(base_dir, 'cards', 'cardvideos')
    
    # 列出所有视频文件
    all_videos = sorted([f for f in os.listdir(cardvideos_dir) if f.endswith('.mp4')])
    
    print("=" * 80)
    print("  Video files in cardvideos:")
    print("=" * 80)
    for f in all_videos:
        print(f"  {f}")
    
    # 读取 data.js
    with open(data_js_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    print("\n" + "=" * 80)
    print("  Checking which videos are already in data.js...")
    print("=" * 80)
    
    found_count = 0
    not_found = []
    
    for f in all_videos:
        search_str = f'src: "./cards/cardvideos/{f}"'
        if search_str in content:
            print(f"  [OK] {f}")
            found_count += 1
        else:
            print(f"  [NEEDS ADD] {f}")
            not_found.append(f)
    
    print(f"\n  Found {found_count}/{len(all_videos)} videos in data.js")
    
    if not_found:
        print("\n" + "=" * 80)
        print("  Missing videos (need to add video field):")
        print("=" * 80)
        for f in not_found:
            print(f"  {f}")

if __name__ == '__main__':
    main()