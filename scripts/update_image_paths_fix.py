#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
==========================================
更新 data.js 中的图片路径
==========================================
"""

import os
import re

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_js_path = os.path.join(base_dir, 'data.js')
    
    # 读取 data.js
    with open(data_js_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 定义替换规则
    replacements = [
        # group01
        ('1_207_2.png', '1_207.png'),
        ('1_108_2.png', '1_108b.png'),
        ('1_208.png', '1_208b.png'),
        ('1_208_2.png', '1_208b.png'),
        ('1_109_2.png', '1_109.png'),
        ('1_109_3.png', '1_109b.png'),
        ('1_109_4.png', '1_109c.png'),
        ('1_209_1.png', '1_209b.png'),
        ('1_209_2.png', '1_209c.png'),
        ('1_209_3.png', '1_209c.png'),
        ('1_209_4.png', '1_209d.png'),
        ('1_309_1.png', '1_309b.png'),
        ('1_309_2.png', '1_309b.png'),
        ('1_409_1.png', '1_409.png'),
        ('1_409_2.png', '1_409b.png'),
        ('1_111_1.png', '1_111.png'),
        ('1_111_2.png', '1_111b.png'),
        ('1_112_1.png', '1_112.png'),
        ('1_112_2.png', '1_112b.png'),
        ('1_313_1.png', '1_313.png'),
        ('1_313_2.png', '1_313b.png'),
        ('1_214_1.png', '1_214.png'),
        ('1_214_2.png', '1_214b.png'),
        
        # group02
        ('2_404_1.png', '2_404.png'),
        ('2_404_2.png', '2_404b.png'),
        
        # group03
        ('3_105_1.png', '3_105.png'),
        ('3_105_2.png', '3_105b.png'),
        ('3_107_1.png', '3_107.png'),
        ('3_107_2.png', '3_107b.png'),
        
        # group04
        ('4_101.png', '4_101_pike.png'),
        ('4_201.png', '4_201_360tuck.png'),
        ('4_601_1.png', '4_601_pike.png'),
        ('4_601_2.png', '4_601_180.png'),
        ('4_102.png', '4_601_180.png'),  # 需要确认
        ('4_302.png', '4_302_540.png'),
        ('4_105.png', '4_105_tuck.png'),
        ('4_205.png', '4_205_tuck.png'),
        
        # group05
        ('5_101.png', '5_101_layout.png'),
        ('5_201.png', '5_201_180.png'),
        ('5_301.png', '5_301_540.png'),
        ('5_402.png', '5_402_tuck.png'),
        ('5_502.png', '5_502_tuck360.png'),
    ]
    
    print("=" * 80)
    print("  Updating image paths in data.js...")
    print("=" * 80)
    
    count = 0
    for old, new in replacements:
        if old in content:
            content = content.replace(old, new)
            count += 1
            print(f"  [UPDATED] {old} → {new}")
    
    # 保存
    with open(data_js_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("\n" + "=" * 80)
    print(f"  Done! Updated {count} image paths.")
    print("=" * 80)

if __name__ == '__main__':
    main()