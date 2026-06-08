#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
==========================================
安全更新 data.js 视频信息
==========================================
功能：
1. 读取所有视频文件
2. 更新对应的 video 字段
3. 保留现有所有功能
"""

import os
import re

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_js_path = os.path.join(base_dir, 'data.js')
    cardvideos_dir = os.path.join(base_dir, 'cards', 'cardvideos')
    
    # 定义视频信息（根据文件名）
    video_files = {
        "1_111b_Ana_Barbosu_ROU.mp4": {"id": "1.111b", "athlete": "Ana Barbosu", "country": "ROU"},
        "1_305_Ke_Qinqin_CHN.mp4": {"id": "1.305", "athlete": "Ke Qinqin", "country": "CHN"},
        "1_309_Maiana_Prat_FRA.mp4": {"id": "1.309", "athlete": "Maiana Prat", "country": "FRA"},
        "1_309b_Ke_Qinqin_CHN.mp4": {"id": "1.309b", "athlete": "Ke Qinqin", "country": "CHN"},
        "1_402_Ana_Barbosu_ROU.mp4": {"id": "1.402", "athlete": "Ana Barbosu", "country": "ROU"},
        "1_402_tour_Ana_Barbosu_ROU.mp4": {"id": "1.402-tour", "athlete": "Ana Barbosu", "country": "ROU"},
        "2_204_Ksenia_Afanaseva_RUS.mp4": {"id": "2.204", "athlete": "Ksenia Afanaseva", "country": "RUS"},
        "2_206_Eythora_Thorsdottir_NED.mp4": {"id": "2.206", "athlete": "Eythora Thorsdottir", "country": "NED"},
        "2_402_Eythora_Thorsdottir_NED.mp4": {"id": "2.402", "athlete": "Eythora Thorsdottir", "country": "NED"},
        "2_403_Liu_Tingting_CHN.mp4": {"id": "2.403", "athlete": "Liu Tingting", "country": "CHN"},
        "2_407_Vladislava_Urazova_RUS.mp4": {"id": "2.407", "athlete": "Vladislava Urazova", "country": "RUS"},
        "2_501_Zhou_Yaqin_CHN.mp4": {"id": "2.501", "athlete": "Zhou Yaqin", "country": "CHN"},
        "2_503_Manila_Esposito_ITA.mp4": {"id": "2.503", "athlete": "Manila Esposito", "country": "ITA"},
        "2_507_Ou_Yushan_CHN.mp4": {"id": "2.507", "athlete": "Ou Yushan", "country": "CHN"},
        "4_101_tuck_Qiu_Qiyuan_CHN.mp4": {"id": "4.101-tuck", "athlete": "Qiu Qiyuan", "country": "CHN"},
        "4_202_Aiko_Sugihara_JPN.mp4": {"id": "4.202", "athlete": "Aiko Sugihara", "country": "JPN"},
        "4_202_Wang_Yan_CHN.mp4": {"id": "4.202", "athlete": "Wang Yan", "country": "CHN"},
        "4_302_360_Ana_Barbosu_ROU.mp4": {"id": "4.302-360", "athlete": "Ana Barbosu", "country": "ROU"},
        "4_302_360_Liu_Tingting_CHN.mp4": {"id": "4.302-360", "athlete": "Liu Tingting", "country": "CHN"},
        "4_302_540_Qiu_Qiyuan_CHN.mp4": {"id": "4.302-540", "athlete": "Qiu Qiyuan", "country": "CHN"},
        "4_501_Emma_Fioravanti_ITA.mp4": {"id": "4.501", "athlete": "Emma Fioravanti", "country": "ITA"},
        "4_502_Ruby_Evans_GBR.mp4": {"id": "4.502", "athlete": "Ruby Evans", "country": "GBR"},
        "4_505_Julia_Soares_BRA.mp4": {"id": "4.505", "athlete": "Julia Soares", "country": "BRA"},
        "4_601_180_Brooklyn_Moors_CAN.mp4": {"id": "4.601-180", "athlete": "Brooklyn Moors", "country": "CAN"},
        "4_605_Alexandra_Raisman_USA.mp4": {"id": "4.605", "athlete": "Alexandra Raisman", "country": "USA"},
        "4_805_Daiane_Dos_Santos_BRA.mp4": {"id": "4.805", "athlete": "Daiane Dos Santos", "country": "BRA"},
        "5_1002_Simone_Biles_USA.mp4": {"id": "5.1002", "athlete": "Simone Biles", "country": "USA"},
        "5_301_540_Shang_Chunsong_CHN.mp4": {"id": "5.301-540", "athlete": "Shang Chunsong", "country": "CHN"},
        "5_301_720_Qiu_Qiyuan_CHN.mp4": {"id": "5.301-720", "athlete": "Qiu Qiyuan", "country": "CHN"},
        "5_304_Angela_Andreoli_ITA.mp4": {"id": "5.304", "athlete": "Angela Andreoli", "country": "ITA"},
        "5_401_Cheng_Fei_CHN.mp4": {"id": "5.401", "athlete": "Cheng Fei", "country": "CHN"},
        "5_402_pike_Qin_Xinyi_CHN.mp4": {"id": "5.402-pike", "athlete": "Qin Xinyi", "country": "CHN"},
        "5_402_tuck_Zhou_Yaqin_CHN.mp4": {"id": "5.402-tuck", "athlete": "Zhou Yaqin", "country": "CHN"},
        "5_501_Cheng_Fei_CHN.mp4": {"id": "5.501", "athlete": "Cheng Fei", "country": "CHN"},
        "5_502_pike360_Huang_Qiushuang_CHN.mp4": {"id": "5.502-pike360", "athlete": "Huang Qiushuang", "country": "CHN"},
        "5_502_tuck360_Flavia_Saraiva_BRA.mp4": {"id": "5.502-tuck360", "athlete": "Flavia Saraiva", "country": "BRA"},
        "5_601_Mao_Yi_CHN.mp4": {"id": "5.601", "athlete": "Mao Yi", "country": "CHN"},
        "5_603_Anna_Ppavlova_RUS.mp4": {"id": "5.603", "athlete": "Anna Ppavlova", "country": "RUS"},
        "5_703_Simone_Biles_USA.mp4": {"id": "5.703", "athlete": "Simone Biles", "country": "USA"},
        "5_802_Simone_Biles_USA.mp4": {"id": "5.802", "athlete": "Simone Biles", "country": "USA"},
        "5_803_Sae_Miyakawa_JPN.mp4": {"id": "5.803", "athlete": "Sae Miyakawa", "country": "JPN"},
        "5_903_Jessica_Gadirova_GBR.mp4": {"id": "5.903", "athlete": "Jessica Gadirova", "country": "GBR"},
    }
    
    print("=" * 80)
    print("  Safe update data.js video info")
    print("=" * 80)
    print()
    
    # 先备份 data.js
    backup_path = data_js_path + ".backup"
    print("  Creating backup...")
    import shutil
    shutil.copy2(data_js_path, backup_path)
    print(f"  Backup saved to: {backup_path}")
    print()
    
    # 读取 data.js
    print("  Reading data.js...")
    with open(data_js_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    updated_count = 0
    
    # 处理每个视频
    for filename, info in video_files.items():
        filepath = os.path.join(cardvideos_dir, filename)
        if not os.path.exists(filepath):
            print(f"  [SKIP] File not found: {filename}")
            continue
        
        skill_id = info['id']
        video_path = f"./cards/cardvideos/{filename}"
        athlete = info['athlete']
        country = info['country']
        
        video_field = f'''video: {{
                src: "{video_path}",
                athlete: "{athlete}",
                country: "{country}"
            }}'''
        
        # 查找并更新
        # 模式：找到 id 对应的对象，然后处理 video
        # 使用非贪婪匹配，只在 image 后面加
        
        # 1. 先查找整个对象
        obj_pattern = rf'(id:\s*["\']{re.escape(skill_id)}["\'][^{{}}]*?)(}})'
        
        def update_video(match):
            before = match.group(1)
            after = match.group(2)
            
            # 如果已经有 video，删除
            if 'video:' in before:
                before = re.sub(r',?\s*video:\s*\{\s*[^}]*?\s*\}', '', before)
            
            # 确保有 image
            if 'image:' in before:
                # 在 image 后面添加
                before = re.sub(r'(image:\s*["\'][^"\']+["\'])', r'\1,\n' + ' ' * 12 + video_field, before)
            
            return before + after
        
        new_content = re.sub(obj_pattern, update_video, content)
        
        if new_content != content:
            content = new_content
            updated_count += 1
            print(f"  [UPDATED] {skill_id}")
    
    # 保存更新后的文件
    print()
    print(f"  Saving changes...")
    with open(data_js_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("=" * 80)
    print(f"  Done! Updated {updated_count} skills.")
    print(f"  Backup file created: {backup_path}")
    print("=" * 80)
    print()
    print("  ⚠️  请检查网页功能是否正常！")
    print("  如果有问题，请从 backup 文件恢复。")

if __name__ == '__main__':
    main()