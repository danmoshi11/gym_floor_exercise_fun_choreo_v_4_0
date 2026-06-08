#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
==========================================
视频文件名修复脚本（手动版本）
==========================================
功能: 生成一个CSV文件，让用户手动填写正确的文件名
"""

import os

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    cardvideos_dir = os.path.join(base_dir, 'cards', 'cardvideos')
    
    video_extensions = ('.mp4', '.webm', '.mov')
    videos = []
    
    for f in sorted(os.listdir(cardvideos_dir)):
        if f.lower().endswith(video_extensions):
            videos.append(f)
    
    print("=" * 80)
    print("  Current video files:")
    print("=" * 80)
    print()
    
    for v in videos:
        print(f"  {v}")
    
    print()
    print("=" * 80)
    print("  Suggested file name format:")
    print("  <ID>_<AthleteName>_<Country>.mp4")
    print()
    print("  Examples:")
    print("  1_111b_Ana_Barbosu_ROU.mp4")
    print("  1_305_Ke_Qinqin_CHN.mp4")
    print("  4_101_tuck_Qiu_Qiyuan_CHN.mp4")
    print("  4_805_Daiane_Dos_Santos_BRA.mp4")
    print("=" * 80)

if __name__ == '__main__':
    main()