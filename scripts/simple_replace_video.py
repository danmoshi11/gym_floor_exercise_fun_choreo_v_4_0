#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
==========================================
直接替换视频信息 (简单可靠)
==========================================
"""

import os

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_js_path = os.path.join(base_dir, 'data.js')
    
    # 要替换的内容
    replacements = [
        (
            '''video: {
                src: "./cards/cardvideos/1_402_tour_402_Tour_Ana_Barbosu_ROU.mp4",
                athlete: "402 Tour Ana Barbosu",
                country: "ROU"
            }''',
            '''video: {
                src: "./cards/cardvideos/1_402_tour_Ana_Barbosu_ROU.mp4",
                athlete: "Ana Barbosu",
                country: "ROU"
            }'''
        ),
        (
            '''video: {
                src: "./cards/cardvideos/1_111b_111b_111b_Ana_Barbosu_ROU.mp4",
                athlete: "111b 111b Ana Barbosu",
                country: "ROU"
            }''',
            '''video: {
                src: "./cards/cardvideos/1_111b_Ana_Barbosu_ROU.mp4",
                athlete: "Ana Barbosu",
                country: "ROU"
            }'''
        ),
        (
            '''video: {
                src: "./cards/cardvideos/1_305_305_Ke_Qinqin_CHN.mp4",
                athlete: "305 Ke Qinqin",
                country: "CHN"
            }''',
            '''video: {
                src: "./cards/cardvideos/1_305_Ke_Qinqin_CHN.mp4",
                athlete: "Ke Qinqin",
                country: "CHN"
            }'''
        ),
        (
            '''video: {
                src: "./cards/cardvideos/1_309_309_Maiana_Prat_FRA.mp4",
                athlete: "309 Maiana Prat",
                country: "FRA"
            }''',
            '''video: {
                src: "./cards/cardvideos/1_309_Maiana_Prat_FRA.mp4",
                athlete: "Maiana Prat",
                country: "FRA"
            }'''
        ),
        (
            '''video: {
                src: "./cards/cardvideos/1_309b_309b_Ke_Qinqin_CHN.mp4",
                athlete: "309b Ke Qinqin",
                country: "CHN"
            }''',
            '''video: {
                src: "./cards/cardvideos/1_309b_Ke_Qinqin_CHN.mp4",
                athlete: "Ke Qinqin",
                country: "CHN"
            }'''
        ),
        (
            '''video: {
                src: "./cards/cardvideos/1_402_402_Ana_Barbosu_ROU.mp4",
                athlete: "402 Ana Barbosu",
                country: "ROU"
            }''',
            '''video: {
                src: "./cards/cardvideos/1_402_Ana_Barbosu_ROU.mp4",
                athlete: "Ana Barbosu",
                country: "ROU"
            }'''
        ),
        (
            '''video: {
                src: "./cards/cardvideos/2_403_403_Liu_Tingting_CHN.mp4",
                athlete: "403 Liu Tingting",
                country: "CHN"
            }''',
            '''video: {
                src: "./cards/cardvideos/2_403_Liu_Tingting_CHN.mp4",
                athlete: "Liu Tingting",
                country: "CHN"
            }'''
        ),
        (
            '''video: {
                src: "./cards/cardvideos/2_501_501_Zhou_Yaqin_CHN.mp4",
                athlete: "501 Zhou Yaqin",
                country: "CHN"
            }''',
            '''video: {
                src: "./cards/cardvideos/2_501_Zhou_Yaqin_CHN.mp4",
                athlete: "Zhou Yaqin",
                country: "CHN"
            }'''
        ),
        (
            '''video: {
                src: "./cards/cardvideos/2_507_507_Ou_Yushan_CHN.mp4",
                athlete: "507 Ou Yushan",
                country: "CHN"
            }''',
            '''video: {
                src: "./cards/cardvideos/2_507_Ou_Yushan_CHN.mp4",
                athlete: "Ou Yushan",
                country: "CHN"
            }'''
        ),
        (
            '''video: {
                src: "./cards/cardvideos/4_101_tuck_101_Tuck_Qiu_Qiyuan_CHN.mp4",
                athlete: "101 Tuck Qiu Qiyuan",
                country: "CHN"
            }''',
            '''video: {
                src: "./cards/cardvideos/4_101_tuck_Qiu_Qiyuan_CHN.mp4",
                athlete: "Qiu Qiyuan",
                country: "CHN"
            }'''
        ),
        (
            '''video: {
                src: "./cards/cardvideos/4_202_202_Aiko_Sugihara_JPN.mp4",
                athlete: "202 Aiko Sugihara",
                country: "JPN"
            }''',
            '''video: {
                src: "./cards/cardvideos/4_202_Aiko_Sugihara_JPN.mp4",
                athlete: "Aiko Sugihara",
                country: "JPN"
            }'''
        ),
        (
            '''video: {
                src: "./cards/cardvideos/4_202_202_Wang_Yan_CHN.mp4",
                athlete: "202 Wang Yan",
                country: "CHN"
            }''',
            '''video: {
                src: "./cards/cardvideos/4_202_Wang_Yan_CHN.mp4",
                athlete: "Wang Yan",
                country: "CHN"
            }'''
        ),
        (
            '''video: {
                src: "./cards/cardvideos/4_302_360_302_360_Ana_Barbosu_ROU.mp4",
                athlete: "302 360 Ana Barbosu",
                country: "ROU"
            }''',
            '''video: {
                src: "./cards/cardvideos/4_302_360_Ana_Barbosu_ROU.mp4",
                athlete: "Ana Barbosu",
                country: "ROU"
            }'''
        ),
        (
            '''video: {
                src: "./cards/cardvideos/4_302_360_302_360_Liu_Tingting_CHN.mp4",
                athlete: "302 360 Liu Tingting",
                country: "CHN"
            }''',
            '''video: {
                src: "./cards/cardvideos/4_302_360_Liu_Tingting_CHN.mp4",
                athlete: "Liu Tingting",
                country: "CHN"
            }'''
        ),
        (
            '''video: {
                src: "./cards/cardvideos/4_302_540_302_540_Qiu_Qiyuan_CHN.mp4",
                athlete: "302 540 Qiu Qiyuan",
                country: "CHN"
            }''',
            '''video: {
                src: "./cards/cardvideos/4_302_540_Qiu_Qiyuan_CHN.mp4",
                athlete: "Qiu Qiyuan",
                country: "CHN"
            }'''
        ),
        (
            '''video: {
                src: "./cards/cardvideos/4_502_502_Ruby_Evans_GBR.mp4",
                athlete: "502 Ruby Evans",
                country: "GBR"
            }''',
            '''video: {
                src: "./cards/cardvideos/4_502_Ruby_Evans_GBR.mp4",
                athlete: "Ruby Evans",
                country: "GBR"
            }'''
        ),
        (
            '''video: {
                src: "./cards/cardvideos/4_505_505_Julia_Soares_BRA.mp4",
                athlete: "505 Julia Soares",
                country: "BRA"
            }''',
            '''video: {
                src: "./cards/cardvideos/4_505_Julia_Soares_BRA.mp4",
                athlete: "Julia Soares",
                country: "BRA"
            }'''
        ),
        (
            '''video: {
                src: "./cards/cardvideos/4_601_180_601_180_Brooklyn_Moors_CAN.mp4",
                athlete: "601 180 Brooklyn Moors",
                country: "CAN"
            }''',
            '''video: {
                src: "./cards/cardvideos/4_601_180_Brooklyn_Moors_CAN.mp4",
                athlete: "Brooklyn Moors",
                country: "CAN"
            }'''
        ),
        (
            '''video: {
                src: "./cards/cardvideos/5_1002_1002_Simone_Biles_USA.mp4",
                athlete: "1002 Simone Biles",
                country: "USA"
            }''',
            '''video: {
                src: "./cards/cardvideos/5_1002_Simone_Biles_USA.mp4",
                athlete: "Simone Biles",
                country: "USA"
            }'''
        ),
        (
            '''video: {
                src: "./cards/cardvideos/5_301_540_301_540_Shang_Chunsong_CHN.mp4",
                athlete: "301 540 Shang Chunsong",
                country: "CHN"
            }''',
            '''video: {
                src: "./cards/cardvideos/5_301_540_Shang_Chunsong_CHN.mp4",
                athlete: "Shang Chunsong",
                country: "CHN"
            }'''
        ),
        (
            '''video: {
                src: "./cards/cardvideos/5_301_720_301_720_Qiu_Qiyuan_CHN.mp4",
                athlete: "301 720 Qiu Qiyuan",
                country: "CHN"
            }''',
            '''video: {
                src: "./cards/cardvideos/5_301_720_Qiu_Qiyuan_CHN.mp4",
                athlete: "Qiu Qiyuan",
                country: "CHN"
            }'''
        ),
        (
            '''video: {
                src: "./cards/cardvideos/5_401_401_Cheng_Fei_CHN.mp4",
                athlete: "401 Cheng Fei",
                country: "CHN"
            }''',
            '''video: {
                src: "./cards/cardvideos/5_401_Cheng_Fei_CHN.mp4",
                athlete: "Cheng Fei",
                country: "CHN"
            }'''
        ),
        (
            '''video: {
                src: "./cards/cardvideos/5_402_pike_402_Pike_Qin_Xinyi_CHN.mp4",
                athlete: "402 Pike Qin Xinyi",
                country: "CHN"
            }''',
            '''video: {
                src: "./cards/cardvideos/5_402_pike_Qin_Xinyi_CHN.mp4",
                athlete: "Qin Xinyi",
                country: "CHN"
            }'''
        ),
        (
            '''video: {
                src: "./cards/cardvideos/5_402_tuck_402_Tuck_Zhou_Yaqin_CHN.mp4",
                athlete: "402 Tuck Zhou Yaqin",
                country: "CHN"
            }''',
            '''video: {
                src: "./cards/cardvideos/5_402_tuck_Zhou_Yaqin_CHN.mp4",
                athlete: "Zhou Yaqin",
                country: "CHN"
            }'''
        ),
        (
            '''video: {
                src: "./cards/cardvideos/5_501_501_Cheng_Fei_CHN.mp4",
                athlete: "501 Cheng Fei",
                country: "CHN"
            }''',
            '''video: {
                src: "./cards/cardvideos/5_501_Cheng_Fei_CHN.mp4",
                athlete: "Cheng Fei",
                country: "CHN"
            }'''
        ),
        (
            '''video: {
                src: "./cards/cardvideos/5_502_pike360_502_Pike360_Huang_Qiushuang_CHN.mp4",
                athlete: "502 Pike360 Huang Qiushuang",
                country: "CHN"
            }''',
            '''video: {
                src: "./cards/cardvideos/5_502_pike360_Huang_Qiushuang_CHN.mp4",
                athlete: "Huang Qiushuang",
                country: "CHN"
            }'''
        ),
        (
            '''video: {
                src: "./cards/cardvideos/5_502_tuck360_502_Tuck360_Flavia_Saraiva_BRA.mp4",
                athlete: "502 Tuck360 Flavia Saraiva",
                country: "BRA"
            }''',
            '''video: {
                src: "./cards/cardvideos/5_502_tuck360_Flavia_Saraiva_BRA.mp4",
                athlete: "Flavia Saraiva",
                country: "BRA"
            }'''
        ),
        (
            '''video: {
                src: "./cards/cardvideos/5_601_601_Mao_Yi_CHN.mp4",
                athlete: "601 Mao Yi",
                country: "CHN"
            }''',
            '''video: {
                src: "./cards/cardvideos/5_601_Mao_Yi_CHN.mp4",
                athlete: "Mao Yi",
                country: "CHN"
            }'''
        ),
        (
            '''video: {
                src: "./cards/cardvideos/5_603_603_Anna_Ppavlova_RUS.mp4",
                athlete: "603 Anna Ppavlova",
                country: "RUS"
            }''',
            '''video: {
                src: "./cards/cardvideos/5_603_Anna_Ppavlova_RUS.mp4",
                athlete: "Anna Ppavlova",
                country: "RUS"
            }'''
        ),
        (
            '''video: {
                src: "./cards/cardvideos/5_703_703_Simone_Biles_USA.mp4",
                athlete: "703 Simone Biles",
                country: "USA"
            }''',
            '''video: {
                src: "./cards/cardvideos/5_703_Simone_Biles_USA.mp4",
                athlete: "Simone Biles",
                country: "USA"
            }'''
        ),
        (
            '''video: {
                src: "./cards/cardvideos/5_802_802_Simone_Biles_USA.mp4",
                athlete: "802 Simone Biles",
                country: "USA"
            }''',
            '''video: {
                src: "./cards/cardvideos/5_802_Simone_Biles_USA.mp4",
                athlete: "Simone Biles",
                country: "USA"
            }'''
        ),
        (
            '''video: {
                src: "./cards/cardvideos/5_803_803_Sae_Miyakawa_JPN.mp4",
                athlete: "803 Sae Miyakawa",
                country: "JPN"
            }''',
            '''video: {
                src: "./cards/cardvideos/5_803_Sae_Miyakawa_JPN.mp4",
                athlete: "Sae Miyakawa",
                country: "JPN"
            }'''
        ),
    ]
    
    print("=" * 80)
    print("  Simple replace video info")
    print("=" * 80)
    print()
    
    # 读取文件
    with open(data_js_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    replaced_count = 0
    
    # 进行替换
    for old_str, new_str in replacements:
        if old_str in content:
            content = content.replace(old_str, new_str)
            replaced_count += 1
            print(f"  [REPLACED] #{replaced_count}")
    
    # 保存
    print()
    with open(data_js_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"  Done! Replaced {replaced_count} entries.")
    print()
    print("  Please check the webpage is working correctly!")
    print("  Backup exists: data.js.backup")

if __name__ == '__main__':
    main()