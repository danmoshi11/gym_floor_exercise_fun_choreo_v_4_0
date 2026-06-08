// ==========================================
// 自由体操动作数据库 (以图片录入为准)
// ==========================================

// --- 【第 1 组：体操单脚跳、双脚跳和小跳 (Gymnastic Leaps, Jumps and Hops)】 ---
const group1_leaps = {
    // 01 系列：跨跳/劈叉跳系列
    series_01: [
        {
            id: "1.101",
            difficulty: "A",
            value: "0.10",
            nameEn: "Split leap fwd (leg separation 180°)",
            nameZh: ["跨跳","向前纵劈叉单脚(跨)跳(劈叉180°)", "向前纵劈叉单脚跳"], // 结合了图中的中文，并增加通俗叫法
            image: "./cards/cardimages/group01/1_101.png"
        },
        {
            id: "1.201",
            difficulty: "B",
            value: "0.20",
            nameEn: "Split leap with ½ turn (180°)",
            nameZh: ["跨跳180", "跨跳转体180度", "跨跳转体半周"],
            image: "./cards/cardimages/group01/1_201.png"
        },
        {
            id: "1.301",
            difficulty: "C",
            value: "0.30",
            nameEn: "Split leap with 1/1 turn (360°)",
            nameZh: ["跨跳360", "跨跳转体360度", "跨跳转体一周"],
            image: "./cards/cardimages/group01/1_301.png"
        }
    ],

    // 02 系列：剪交跳/弗沃泰系列 (Fouetté / Tour jeté)
    series_02: [
        {
            id: "1.202",
            difficulty: "B",
            value: "0.20",
            nameEn: "Fouetté hop with leg change to cross split (leg separation 180°), also to ring position (tour jeté)",
            nameZh: ["剪交跳", "弗沃泰成纵劈叉(剪交)跳(劈叉180°)", "Tour jeté"],
            image: "./cards/cardimages/group01/1_202.png"
        },
        {
            id: "1.302",
            difficulty: "C",
            value: "0.30",
            nameEn: "Tour jeté with additional ½ turn (180°) ... (Produnova) / Leap fwd, through tour jeté technique ... (Csillag)",
            namedAfter: "Produnova 普罗杜诺娃 / Csillag 克西拉",
            nameZh: ["剪交180", "剪交跳转体180°(成单脚/双脚/纵劈叉落)", "普罗杜诺娃", "向前单脚跳经剪交技术、转体270°成分腿屈体跳转体90°", "克西拉"],
            image: "./cards/cardimages/group01/1_302.png"
        },
        {
            id: "1.402-tour",
            difficulty: "D",
            value: "0.40",
            nameEn: "Tour jeté with additional 1/1 turn (360°), landing on one or both feet (Gogean)",
            namedAfter: "Gogean 高吉安",
            nameZh: ["剪交360", "剪交跳转体360°(成单脚/双脚落)", "高吉安"],
            image: "./cards/cardimages/group01/1_402.png",
            video: {
                src: "./cards/cardvideos/1_402_tour_Ana_Barbosu_ROU.mp4",
                athlete: "Ana Barbosu",
                country: "ROU"
            }
        }
    ],

    //03 系列：交换腿跳
    series_03: [
        {
            id: "1.301",
            difficulty: "B",
            value: "0.20",
            nameEn: "Switch leap (leap fwd with leg change to 180° split)",
            nameZh: ["交换腿跳", "交换腿纵劈叉单脚(跨)跳"],
            image: "./cards/cardimages/group01/1_202.png"
        },
        {
            id: "1.302",
            difficulty: "C",
            value: "0.30",
            nameEn: "Switch leap with ½ turn (180°)",
            nameZh: ["交换腿180", "交换腿跨跳转体 180°"],
            image: "./cards/cardimages/group01/1_302.png"
        },
        {
            id: "1.402",
            difficulty: "D",
            value: "0.40",
            nameEn: "Switch leap with 1/1 turn (360°)",
            nameZh: ["交换腿360", "交换腿跨跳转体 360°"],
            image: "./cards/cardimages/group01/1_402.png",
            video: {
                src: "./cards/cardvideos/1_402_Ana_Barbosu_ROU.mp4",
                athlete: "Ana Barbosu",
                country: "ROU"
            }
        }
    ],

    // 04 系列：单脚跳转体/交换腿转体/分腿屈体跳
    series_04: [
        {
            id: "1.204",
            difficulty: "B",
            value: "0.20",
            nameEn: "Switch leap with ¼ turn (90°) to side split or straddle pike position (both legs above horizontal)",
            namedAfter: "Johnson 强森",
            nameZh: ["交换腿90", "交换腿侧跨(强森)跳", "交换腿跳转体90°成横劈叉(强森)跳", "Johnson", "强森"],
            image: "./cards/cardimages/group01/1_204.png"
        }
    ],

    // 05 系列：向前交换腿/交换腿结环
    series_05: [
        {
            id: "1.105",
            difficulty: "A",
            value: "0.10",
            nameEn: "Stride leap fwd with change of legs to wolf position",
            nameZh: ["交换腿狼跳", "向前交换腿成狼跳"],
            image: "./cards/cardimages/group01/1_105.png"
        },
        {
            id: "1.305",
            difficulty: "C",
            value: "0.30",
            nameEn: "Switch leap to ring position (180° separation of legs)",
            nameZh: ["交换腿结环", "SR","sr","交换腿结环(劈叉180°)"],
            image: "./cards/cardimages/group01/1_305.png",
            video: {
                src: "./cards/cardvideos/1_305_Ke_Qinqin_CHN.mp4",
                athlete: "Ke Qinqin",
                country: "CHN"
            }
        },
        {
            id: "1.405",
            difficulty: "D",
            value: "0.40",
            nameEn: "Switch leap to ring position with ½ turn (180°)",
            namedAfter: "Sankova 桑科娃",
            nameZh: ["交换腿结环180","SR180","sr180", "交换腿结环转体180°", "Sankova", "桑科娃"],
            image: "./cards/cardimages/group01/1_405.png"
        }
    ],

    // 06 系列：屈体跳/羊跳
    series_06: [
        {
            id: "1.106",
            difficulty: "A",
            value: "0.10",
            nameEn: "Pike jump (hip < 90°)",
            nameZh: ["屈体跳", "屈体跳(髋角<90°)"],
            image: "./cards/cardimages/group01/1_106.png"
        },
        {
            id: "1.206",
            difficulty: "B",
            value: "0.20",
            nameEn: "Jump with upper back arch and head release with feet almost touching head (sheep jump)",
            nameZh: ["羊跳", "上体后屈、头后仰，脚几乎触碰头(羊)跳"],
            image: "./cards/cardimages/group01/1_206.png"
        },
        {
            id: "1.306",
            difficulty: "C",
            value: "0.30",
            nameEn: "Pike jump (hip < 90°) with 1/1 turn (360°), also landing in front lying support",
            namedAfter: "Moerz 莫尔兹",
            nameZh: ["屈体跳360", "屈体跳转体360°(髋角<90°)", "屈体跳转体360°成俯撑落", "Moerz", "莫尔兹"],
            image: "./cards/cardimages/group01/1_306.png"
        }
    ],

    // 07 系列：分腿屈体跳/纵劈叉转体
    series_07: [
        {
            id: "1.107",
            difficulty: "A",
            value: "0.10",
            nameEn: "Straddle pike jump (both legs above horizontal), or side split jump (leg separation 180°)",
            nameZh: ["劈叉跳", "分腿屈体跳(双腿高于水平)", "横劈叉跳(劈叉180°)"],
            image: "./cards/cardimages/group01/1_107.png"
        },
        {
            id: "1.207",
            difficulty: "B",
            value: "0.20",
            nameEn: "Split Jump with ½ turn (180°)",
            nameZh: ["劈叉180", "纵劈叉跳转体180°"],
            image: "./cards/cardimages/group01/1_207.png"
        },
        {
            id: "1.307",
            difficulty: "C",
            value: "0.30",
            nameEn: "Straddle pike or side split jump with 1/1 turn (360°)",
            namedAfter: "Popa 坡帕",
            nameZh: ["劈叉360", "分腿屈体跳转体360°", "横劈叉跳转体360°", "Popa", "坡帕"],
            image: "./cards/cardimages/group01/1_307.png"
        },
        {
            id: "1.407",
            difficulty: "D",
            value: "0.40",
            nameEn: "Straddle pike or side split jump with 1½ turn (540°)",
            nameZh: ["劈叉540", "分腿屈体跳转体540°", "横劈叉跳转体540°"],
            image: "./cards/cardimages/group01/1_407.png"
        }
    ],

    // 08 系列：成俯撑落地的跳跃
    series_08: [
        {
            id: "1.108",
            difficulty: "A",
            value: "0.10",
            nameEn: "Straddle pike (both legs above horizontal), or side split jump landing in front lying support (also with ½ turn (180°))",
            nameZh: ["分腿屈体成俯撑", "分腿屈体跳(双腿高于水平)成俯撑落", "横劈叉跳成俯撑落", "分腿屈体跳转体180°成俯撑落", "横劈叉跳转体180°成俯撑落"],
            image: "./cards/cardimages/group01/1_108.png"
        },
        {
            id: "1.108b",
            difficulty: "A",
            value: "0.10",
            nameEn: "Hop with 1/1 turn (360°) to straddle and land in front lying support",
            nameZh: ["小跳转体360成俯撑", "小跳转体360°成分腿屈体平行成俯撑落"],
            image: "./cards/cardimages/group01/1_108b.png"
        },
        {
            id: "1.208",
            difficulty: "B",
            value: "0.20",
            nameEn: "Straddle pike (both legs above horizontal), or side split jump with 1/1 turn (360°) landing in front lying support",
            nameZh: ["分腿屈体360成俯撑", "分腿屈体跳(双腿高于水平)转体360°成俯撑落", "横劈叉跳转体360°成俯撑落"],
            image: "./cards/cardimages/group01/1_208b.png"
        },
        {
            id: "1.208b",
            difficulty: "B",
            value: "0.20",
            nameEn: "Hop with 1½ turn (540°) in horizontal plane to land in front lying support",
            nameZh: ["小跳转体540成俯撑", "小跳转体540°平行成俯撑落"],
            image: "./cards/cardimages/group01/1_208b.png"
        }
    ],

    // 09 系列：纵劈叉/鹿跳/结环等变体
    series_09: [
        {
            id: "1.109",
            difficulty: "A",
            value: "0.10",
            nameEn: "Stag jump",
            nameZh: ["鹿跳"],
            image: "./cards/cardimages/group01/1_109.png"
        },
        {
            id: "1.109b",
            difficulty: "A",
            value: "0.10",
            nameEn: "Stag jump with ½ turn (180°)",
            nameZh: ["鹿跳180", "鹿跳转体180°"],
            image: "./cards/cardimages/group01/1_109b.png"
        },
        {
            id: "1.109c",
            difficulty: "A",
            value: "0.10",
            nameEn: "Sissone (leg separation 180° on the diagonal/45° to the floor) take off two feet, land on one foot",
            nameZh: ["西松跳", "西松跳(劈叉180°、倾斜45°)"],
            image: "./cards/cardimages/group01/1_109c.png"
        },
        {
            id: "1.209",
            difficulty: "B",
            value: "0.20",
            nameEn: "Sissone to ring position (rear foot at head height, body arched and head dropped bwd, 180° separation of legs), to land on one foot",
            nameZh: ["西松结环", "西松结环(后脚位于头高，身体背弓，头向后仰，劈叉180°)成单脚落"],
            image: "./cards/cardimages/group01/1_209b.png"
        },
        {
            id: "1.209b",
            difficulty: "B",
            value: "0.20",
            nameEn: "Stag ring jump (rear foot at head height, body arched and head dropped bwd)",
            nameZh: ["鹿结环", "鹿结环(后脚位于头高、身体后屈且头后仰、劈叉180°)"],
            image: "./cards/cardimages/group01/1_209c.png"
        },
        {
            id: "1.209c",
            difficulty: "B",
            value: "0.20",
            nameEn: "Split jump to ring position (180° separation of legs) to land on both feet",
            nameZh: ["劈叉结环", "劈叉结环(劈叉180°)成双脚落"],
            image: "./cards/cardimages/group01/1_209c.png"
        },
        {
            id: "1.209d",
            difficulty: "B",
            value: "0.20",
            nameEn: "Split jump to ring position with ½ turn (180°) to land on both feet",
            nameZh: ["劈叉结环180", "劈叉结环转体180°成双脚落"],
            image: "./cards/cardimages/group01/1_209d.png"
        },
        {
            id: "1.309",
            difficulty: "C",
            value: "0.30",
            nameEn: "Split ring leap (180° separation of legs)",
            nameZh: ["跨结环", "跨结环(劈叉180°)"],
            image: "./cards/cardimages/group01/1_309b.png",
            video: {
                src: "./cards/cardvideos/1_309_Maiana_Prat_FRA.mp4",
                athlete: "Maiana Prat",
                country: "FRA"
            }
        },
        {
            id: "1.309b",
            difficulty: "C",
            value: "0.30",
            nameEn: "Split jump to ring position with 1/1 turn (360°)",
            namedAfter: "Jurkowska-Kowalska 尤尔科夫斯卡-科瓦尔斯卡",
            nameZh: ["劈叉结环360", "劈叉结环转体360°", "Jurkowska-Kowalska", "尤尔科夫斯卡-科瓦尔斯卡"],
            image: "./cards/cardimages/group01/1_309b.png",
            video: {
                src: "./cards/cardvideos/1_309b_Ke_Qinqin_CHN.mp4",
                athlete: "Ke Qinqin",
                country: "CHN"
            }
        },
        {
            id: "1.409",
            difficulty: "D",
            value: "0.40",
            nameEn: "Tour jeté, to ring position with additional ½ turn (180°)",
            namedAfter: "Ferrari 费拉里",
            nameZh: ["剪交结环180", "剪交结环转体180°", "Ferrari", "费拉里"],
            image: "./cards/cardimages/group01/1_409.png"
        },
        {
            id: "1.409b",
            difficulty: "D",
            value: "0.40",
            nameEn: "Split leap to ring position with ½ turn (180°)",
            namedAfter: "Ting 丁华恬",
            nameZh: ["跨结环180", "跨结环转体180°", "Ting", "丁华恬"],
            image: "./cards/cardimages/group01/1_409b.png"
        }
    ],

    // 10 系列：直体转体
    series_10: [
        {
            id: "1.110",
            difficulty: "A",
            value: "0.10",
            nameEn: "Stretched hop or jump with 1/1 turn (360°)",
            nameZh: ["冰棍360", "直体跳转体360°", "直体双脚跳转体360°"],
            image: "./cards/cardimages/group01/1_110.png"
        },
        {
            id: "1.310",
            difficulty: "C",
            value: "0.30",
            nameEn: "Stretched hop or jump with 2/1 turn (720°)",
            nameZh: ["冰棍720", "直体跳转体720°", "直体双脚跳转体720°"],
            image: "./cards/cardimages/group01/1_310.png"
        }
    ],

    // 11 系列：猫跳/剪刀跳
    series_11: [
        {
            id: "1.111",
            difficulty: "A",
            value: "0.10",
            nameEn: "Leap with alternate leg change (knees above horizontal) (Cat leap)",
            nameZh: ["猫跳","交换腿半脚跳", "交换腿半脚跳(双膝依次高于水平)"],
            image: "./cards/cardimages/group01/1_111.png"
        },
        {
            id: "1.111b",
            difficulty: "A",
            value: "0.10",
            nameEn: "Scissors leap forward (legs above horizontal)",
            nameZh: ["剪刀跳", "向前剪刀跳(双腿依次高于水平)"],
            image: "./cards/cardimages/group01/1_111b.png",
            video: {
                src: "./cards/cardvideos/1_111b_Ana_Barbosu_ROU.mp4",
                athlete: "Ana Barbosu",
                country: "ROU"
            }
        },
        {
            id: "1.211",
            difficulty: "B",
            value: "0.20",
            nameEn: "Cat leap with 1/1 turn (360°)",
            nameZh: ["猫跳360", "猫跳转体360°"],
            image: "./cards/cardimages/group01/1_211.png"
        },
        {
            id: "1.311",
            difficulty: "C",
            value: "0.30",
            nameEn: "Cat leap with 2/1 turn (720°)",
            nameZh: ["猫跳720", "猫跳转体720°"],
            image: "./cards/cardimages/group01/1_311.png"
        }
    ],

    // 12 系列：直角跳转
    series_12: [
        {
            id: "1.112",
            difficulty: "A",
            value: "0.10",
            nameEn: "Hop with ½ turn (180°) to land in arabesque with free leg above horizontal (Fouetté hop)",
            nameZh: ["弗沃泰跳转180", "弗沃泰跳转体180°成阿拉贝斯落(自由腿高于水平)"],
            image: "./cards/cardimages/group01/1_112.png"
        },
        {
            id: "1.112b",
            difficulty: "A",
            value: "0.10",
            nameEn: "Hop with ½ turn (180°) free leg extended at horizontal throughout",
            nameZh: ["直角跳180", "自由腿全程伸展高于水平小(直角)跳转体180°"],
            image: "./cards/cardimages/group01/1_112b.png"
        },
        {
            id: "1.212",
            difficulty: "B",
            value: "0.20",
            nameEn: "Hop with 1/1 turn (360°), free leg extended at horizontal throughout",
            nameZh: ["直角跳360", "直角跳转体360°"],
            image: "./cards/cardimages/group01/1_212.png"
        }
    ],

    // 13 系列：团身双脚跳
    series_13: [
        {
            id: "1.213",
            difficulty: "B",
            value: "0.20",
            nameEn: "Tuck hop or jump with 1/1 turn (360°)",
            nameZh: ["团跳360", "团身小跳转体360°", "团身双脚跳转体360°"],
            image: "./cards/cardimages/group01/1_213.png"
        },
        {
            id: "1.313",
            difficulty: "C",
            value: "0.30",
            nameEn: "Tuck hop or jump with 2/1 turn (720°)",
            nameZh: ["团跳720", "团身小跳转体720°", "团身双脚跳转体720°"],
            image: "./cards/cardimages/group01/1_313.png"
        },
        {
            id: "1.313b",
            difficulty: "C",
            value: "0.30",
            nameEn: "Tuck hop or jump with 2/1 turn (720°) also landing in front lying support",
            nameZh: ["团跳720成俯撑", "团身小跳转体720°成俯撑落", "团身双脚跳转体720°成俯撑落"],
            image: "./cards/cardimages/group01/1_313b.png"
        }
    ],

    // 14 系列：狼双脚跳
    series_14: [
        {
            id: "1.114",
            difficulty: "A",
            value: "0.10",
            nameEn: "Hop or Jump with one leg bent and the other extended straight, fwd above horizontal with knees together (Wolf hop or jump)",
            nameZh: ["狼跳", "狼小跳", "狼双脚跳", "一腿弯曲，另一腿并膝前伸高于水平(狼)小跳"],
            image: "./cards/cardimages/group01/1_114.png"
        },
        {
            id: "1.214",
            difficulty: "B",
            value: "0.20",
            nameEn: "Wolf hop or jump with 1/1 turn (360°)",
            nameZh: ["狼跳360", "狼小跳转体360°", "狼双脚跳转体360°"],
            image: "./cards/cardimages/group01/1_214.png"
        },
        {
            id: "1.214b",
            difficulty: "B",
            value: "0.20",
            nameEn: "Wolf hop or jump with 1/1 turn (360°) landing in front lying support",
            nameZh: ["狼跳360成俯撑", "狼小跳转体360°成俯撑落", "狼双脚跳转体360°成俯撑落"],
            image: "./cards/cardimages/group01/1_214b.png"
        },
        {
            id: "1.514",
            difficulty: "E",
            value: "0.50",
            nameEn: "Wolf hop or jump with 2/1 turn (720°)",
            nameZh: ["狼跳720", "狼小跳转体720°", "狼双脚跳转体720°"],
            image: "./cards/cardimages/group01/1_514.png"
        }
    ]
};


// --- 【第 2 组：立转与圈转 (Turns)】 ---
const group2_turns = {
    
    // 01 系列：基础单腿立转 (自由腿低于水平)
    series_01: [
        {
            id: "2.101",
            difficulty: "A",
            value: "0.10",
            nameEn: "1/1 turn (360°) on one leg - free leg optional below horizontal",
            nameZh: ["立转360", "自由腿低于水平立转360°"],
            image: "./cards/cardimages/group02/2_101.png",
            tags: []
        },
        {
            id: "2.201",
            difficulty: "B",
            value: "0.20",
            nameEn: "2/1 turn (720°) on one leg - free leg optional below horizontal",
            nameZh: ["立转720", "自由腿低于水平立转720°"],
            image: "./cards/cardimages/group02/2_201.png",
            tags: []
        },
        {
            id: "2.301",
            difficulty: "C",
            value: "0.30",
            nameEn: "3/1 turn (1080°) on one leg - free leg optional below horizontal",
            nameZh: ["立转1080", "自由腿低于水平立转1080°"],
            image: "./cards/cardimages/group02/2_301.png",
            tags: []
        },
        {
            id: "2.501",
            difficulty: "E",
            value: "0.50",
            nameEn: "4/1 turn (1440°) on one leg - free leg optional below horizontal",
            namedAfter: "Gomez 戈麦兹",
            nameZh: ["立转1440", "自由腿低于水平立转1440°", "Gomez", "戈麦兹"],
            image: "./cards/cardimages/group02/2_501.png",
            video: {
                src: "./cards/cardvideos/2_501_Zhou_Yaqin_CHN.mp4",
                athlete: "Zhou Yaqin",
                country: "CHN"
            },
            tags: []
        }
    ],

    // 02 系列：水平腿立转
    series_02: [
        {
            id: "2.202",
            difficulty: "B",
            value: "0.20",
            nameEn: "1/1 turn (360°) with heel of extended free leg fwd at horizontal throughout turn (support leg may be straight or bent)",
            nameZh: ["水平360", "自由腿全程前举前伸，脚跟位于水平(水平腿)立转360°(支撑腿可直可屈)"],
            image: "./cards/cardimages/group02/2_202.png",
            tags: []
        },
        {
            id: "2.402",
            difficulty: "D",
            value: "0.40",
            nameEn: "2/1 turn (720°) with heel of extended free leg fwd at horizontal throughout turn (support leg may be straight or bent)",
            nameZh: ["水平720", "水平腿立转720°(支撑腿可直可屈)"],
            image: "./cards/cardimages/group02/2_402.png",
            video: {
                src: "./cards/cardvideos/2_402_Eythora_Thorsdottir_NED.mp4",
                athlete: "Eythora Thorsdottir",
                country: "NED"
            },
            tags: []
        },
        {
            id: "2.502",
            difficulty: "E",
            value: "0.50",
            nameEn: "3/1 turn (1080°) with heel of extended free leg fwd at horizontal throughout turn (support leg may be straight or bent)",
            nameZh: ["水平1080", "水平腿立转1080°(支撑腿可直可屈)"],
            image: "./cards/cardimages/group02/2_502.png",
            tags: []
        }
    ],

    // 03 系列：高举腿立转 (注意：即使含180度劈叉，立转也不满足CR1要求，已清空标签)
    series_03: [
        {
            id: "2.203",
            difficulty: "B",
            value: "0.20",
            nameEn: "1/1 turn (360°) with free leg held upward in 180° split position throughout turn",
            nameZh: ["高举腿360", "自由腿全程上举、纵劈叉分腿180°(高举腿)立转360°"],
            image: "./cards/cardimages/group02/2_203.png",
            tags: []
        },
        {
            id: "2.403",
            difficulty: "D",
            value: "0.40",
            nameEn: "2/1 turn (720°) with free leg held upward in 180° split position throughout turn",
            namedAfter: "Memmel 梅梅尔",
            nameZh: ["高举腿720", "高举腿立转720°", "Memmel", "梅梅尔"],
            image: "./cards/cardimages/group02/2_403.png",
            video: {
                src: "./cards/cardvideos/2_403_Liu_Tingting_CHN.mp4",
                athlete: "Liu Tingting",
                country: "CHN"
            },
            tags: []
        },
        {
            id: "2.503",
            difficulty: "E",
            value: "0.50",
            nameEn: "3/1 turn (1080°) with free leg held upward in 180° split position throughout turn",
            namedAfter: "Mustafina 穆斯塔芬娜",
            nameZh: ["高举腿1080", "高举腿立转1080°", "Mustafina", "穆斯塔芬娜"],
            image: "./cards/cardimages/group02/2_503.png",
            video: {
                src: "./cards/cardvideos/2_503_Manila_Esposito_ITA.mp4",
                athlete: "Manila Esposito",
                country: "ITA"
            },
            tags: []
        }
    ],

    // 04 系列：阿提丢与后扳腿立转
    series_04: [
        {
            id: "2.204",
            difficulty: "B",
            value: "0.20",
            nameEn: "1/1 turn (360°) in back attitude (thigh of free leg at horizontal throughout turn)",
            nameZh: ["阿提丢360", "一腿后阿提丢，自由腿大腿全程位于水平(阿提丢)立转360°"],
            image: "./cards/cardimages/group02/2_204.png",
            video: {
                src: "./cards/cardvideos/2_204_Ksenia_Afanaseva_RUS.mp4",
                athlete: "Ksenia Afanaseva",
                country: "RUS"
            },
            tags: []
        },
        {
            id: "2.404",
            difficulty: "D",
            value: "0.40",
            nameEn: "2/1 turn (720°) in back attitude (thigh of free leg at horizontal throughout turn)",
            namedAfter: "Semenova 塞梅诺娃",
            nameZh: ["阿提丢720", "阿提丢立转720°", "Semenova", "塞梅诺娃"],
            image: "./cards/cardimages/group02/2_404.png",
            tags: []
        },
        {
            id: "2.404b",
            difficulty: "D",
            value: "0.40",
            nameEn: "2/1 turn (720°) with free leg held with both hands bwd/upward throughout turn",
            namedAfter: "Berar 贝拉尔",
            nameZh: ["后扳腿720", "自由腿全程后上举、手抱自由腿(后扳腿)立转360°", "Berar", "贝拉尔"],
            image: "./cards/cardimages/group02/2_404b.png",
            tags: []
        }
    ],

    // 05/06 系列：水平俯平衡立转 & 依柳辛
    series_05_06: [
        {
            id: "2.205",
            difficulty: "B",
            value: "0.20",
            nameEn: "1/1 turn (360°) in scale fwd with free leg above horizontal throughout turn",
            nameZh: ["俯平衡360", "自由腿全程高于水平俯平衡立转360°"],
            image: "./cards/cardimages/group02/2_205.png",
            tags: []
        },
        {
            id: "2.206",
            difficulty: "B",
            value: "0.20",
            nameEn: "1/1 illusion turn (360°) through standing split without touching floor with hand",
            nameZh: ["依柳辛", "无单手触地全程站立纵劈叉(分腿180°)(依柳辛)立转360°"],
            image: "./cards/cardimages/group02/2_206.png",
            video: {
                src: "./cards/cardvideos/2_206_Eythora_Thorsdottir_NED.mp4",
                athlete: "Eythora Thorsdottir",
                country: "NED"
            },
            tags: []
        }
    ],

    // 07 系列：单腿蹲转
    series_07: [
        {
            id: "2.207",
            difficulty: "B",
            value: "0.20",
            nameEn: "1/1 turn (360°) in tuck stand on one leg - free leg straight throughout turn",
            nameZh: ["蹲转360", "单腿团身站，自由腿全程伸直立转(蹲转)360°"],
            image: "./cards/cardimages/group02/2_207.png",
            tags: []
        },
        {
            id: "2.407",
            difficulty: "D",
            value: "0.40",
            nameEn: "2/1 (720°) pirouette starting with free leg at horizontal, lowering to complete the turn in wolf position",
            nameZh: ["蹲转720", "开始水平平腿，完成落下成蹲转720°"],
            image: "./cards/cardimages/group02/2_307.png",
            video: {
                src: "./cards/cardvideos/2_407_Vladislava_Urazova_RUS.mp4",
                athlete: "Vladislava Urazova",
                country: "RUS"
            },
            tags: []
        },
        {
            id: "2.507",
            difficulty: "E",
            value: "0.50",
            nameEn: "3/1 turn (1080°) in tuck stand on one leg - free leg straight throughout turn (no turn initiation with a push from hands on floor)",
            namedAfter: "Mitchell 米切尔",
            nameZh: ["蹲转1080", "蹲转1080°(无立转开始手撑地面助力)", "Mitchell", "米切尔"],
            image: "./cards/cardimages/group02/2_507.png",
            video: {
                src: "./cards/cardvideos/2_507_Ou_Yushan_CHN.mp4",
                athlete: "Ou Yushan",
                country: "CHN"
            },
            tags: []
        }
    ],

    // 08 系列：背立转
    series_08: [
        {
            id: "2.208",
            difficulty: "B",
            value: "0.20",
            nameEn: "2/1 spin (720°) or more on back in kip position (hip-leg < closed)",
            nameZh: ["背转720", "屈髋(髋腿闭合)背立转720°或更多"],
            image: "./cards/cardimages/group02/2_208.png",
            tags: []
        }
    ]
};

// --- 【第 3 组：手撑动作 (Hand Support Elements)】 ---
const group3_hand_supports = {
    
    // 01 系列：踢腿/压上成倒立
    series_01: [
        {
            id: "3.101",
            difficulty: "A",
            value: "0.10",
            nameEn: "Jump kick or press to hstd - return movement optional, also with ½ and 1/1 turn (180° - 360°) in hstd",
            nameZh: ["跳起踢腿成倒立", "跳起踢腿成倒立，落下成任意姿势", "压上成倒立，落下成任意姿势", "跳起踢腿成倒立，倒立转体180°，落下成任意姿势", "踢腿成倒立，倒立转体180°，落下成任意姿势", "跳起踢腿成倒立，倒立转体360°，落下成任意姿势", "压上成倒立，倒立转体360°，落下成任意姿势"],
            image: "./cards/cardimages/group03/3_101.png",
            tags: []
        },
        {
            id: "3.201",
            difficulty: "B",
            value: "0.20",
            nameEn: "Jump kick or press to hstd with 1½ - 2/1 turn (540° - 720°) in hstd - return movement optional",
            nameZh: ["跳起踢腿成倒立转体540/720", "跳起踢腿成倒立，倒立转体540°，落下成任意姿势", "压上成倒立，倒立转体540°，落下成任意姿势", "跳起踢腿成倒立，倒立转体720°，落下成任意姿势", "压上成倒立，倒立转体720°，落下成任意姿势"],
            image: "./cards/cardimages/group03/3_201.png",
            tags: []
        }
    ],

    // 02 系列：鱼跃前滚翻
    series_02: [
        {
            id: "3.102",
            difficulty: "A",
            value: "0.10",
            nameEn: "Hecht roll",
            nameZh: ["鱼跃前滚翻"],
            image: "./cards/cardimages/group03/3_102.png",
            tags: []
        }
    ],

    // 03 系列：后滚翻成倒立
    series_03: [
        {
            id: "3.103",
            difficulty: "A",
            value: "0.10",
            nameEn: "Roll bwd to hstd with ½ or 1/1 turn (180° - 360°) in hstd",
            nameZh: ["后滚翻成倒立转体180/360", "后滚翻成倒立，倒立转体180°", "后滚翻成倒立，倒立转体360°"],
            image: "./cards/cardimages/group03/3_103.png",
            tags: []
        },
        {
            id: "3.203",
            difficulty: "B",
            value: "0.20",
            nameEn: "Roll bwd to hstd with 1½ - 2/1 (540° - 720°) turn in hstd",
            nameZh: ["后滚翻成倒立转体540/720", "后滚翻成倒立，倒立转体540°", "后滚翻成倒立，倒立转体720°"],
            image: "./cards/cardimages/group03/3_203.png",
            tags: []
        }
    ],

    // 04 系列：后软翻成倒立
    series_04: [
        {
            id: "3.104",
            difficulty: "A",
            value: "0.10",
            nameEn: "Walkover bwd from stand or extended tuck-sit to hstd with 1/1 turn (360°) in hstd - return movement optional",
            nameZh: ["后软翻成倒立转体360", "从站立开始，后软翻成倒立，倒立转体360°，落下成任意姿势", "从一腿前伸团身坐开始，后软翻成倒立，倒立转体360°，落下成任意姿势"],
            image: "./cards/cardimages/group03/3_104.png",
            tags: []
        }
    ],

    // 05 系列：前手翻
    series_05: [
        {
            id: "3.105",
            difficulty: "A",
            value: "0.10",
            nameEn: "Handspring fwd, take-off from one leg or Flyspring fwd, take-off from both legs - with or without hecht phase before hand support - landing optional",
            nameZh: ["前手翻", "手撑前无鱼跃阶段单脚起跳前手翻，落下成任意姿势", "手撑有无鱼跃阶段单脚起跳前手翻，落下成任意姿势", "手撑前有鱼跃阶段双脚起跳前手翻，落下成任意姿势", "手撑前有鱼跃阶段双脚起跳前手翻，落下成任意姿势"],
            image: "./cards/cardimages/group03/3_105.png",
            tags: []
        },
        {
            id: "3.105b",
            difficulty: "A",
            value: "0.10",
            nameEn: "Jump bwd with ½ twist (180°) to handspring fwd - landing optional",
            nameZh: ["后跳转体180成前手翻", "后跳转体180°成前手翻，落下成任意姿势"],
            image: "./cards/cardimages/group03/3_105b.png",
            tags: []
        },
        {
            id: "3.305",
            difficulty: "C",
            value: "0.30",
            nameEn: "Handspring fwd with 1/1 twist (360°) after hand support or before",
            namedAfter: "Mostepanova 莫斯特潘诺娃",
            nameZh: ["前手翻转体360", "前手翻转体360°(手撑后转体)", "前跳转体360°前手翻(手撑前转体)", "Mostepanova", "莫斯特潘诺娃"],
            image: "./cards/cardimages/group03/3_305.png",
            tags: [] // 🚨 移除了错误的 "cr2" 标签
        }
    ],

    // 06 系列：踺子 (Round-off)
    series_06: [
        {
            id: "3.106",
            difficulty: "A",
            value: "0.10",
            nameEn: "Round-off",
            nameZh: ["踺子"],
            image: "./cards/cardimages/group03/3_106.png",
            tags: []
        }
    ],

    // 07 系列：后手翻 (Flic-flac / Arabian with hand support)
    series_07: [
        {
            id: "3.107",
            difficulty: "A",
            value: "0.10",
            nameEn: "All flic-flac and gainer flic-flac variations, also with support of one arm",
            nameZh: ["小翻","后手翻", "单臂后手翻", "踢腿后手翻", "单臂踢腿后手翻"],
            image: "./cards/cardimages/group03/3_107.png",
            tags: []
        },
        {
            id: "3.107b",
            difficulty: "A",
            value: "0.10",
            nameEn: "Arabian (bwd take-off) with ¼ twist (90°) - free (aerial) cartwheel - continuing with ¼ twist (90°) to front lying support",
            namedAfter: "Tsavdaridou 查瓦里杜",
            nameZh: ["阿拉伯手翻成俯撑","阿拉伯后手翻转体90成俯撑", "阿拉伯(后跳)转体90°，挺身侧空翻转体90°成俯撑落", "Tsavdaridou", "查瓦里杜"],
            image: "./cards/cardimages/group03/3_107b.png",
            tags: []
        },
        {
            id: "3.207",
            difficulty: "B",
            value: "0.20",
            nameEn: "Flic-flac with 1/1 twist (360°) before hand support",
            nameZh: ["后手翻转体360", "后跳转体360°后手翻(手撑前转体)"],
            image: "./cards/cardimages/group03/3_207.png",
            tags: [] // 🚨 移除了错误的 "cr2" 标签
        }
    ]
};


// ==========================================
// 第 4 组：向前空翻与侧向空翻 (Saltos fwd & swd) 【100% 全量拆分版】
// ==========================================
const group4_fwd_saltos = {
    
    // 01 系列：团身/屈体前空翻及其两周
    series_01: [
        {
            id: "4.101-tuck",
            difficulty: "A",
            value: "0.10",
            nameEn: "Salto fwd tucked",
            nameZh: ["前团", "团身前空翻"],
            image: "./cards/cardimages/group04/4_101_pike.png",
            video: {
                src: "./cards/cardvideos/4_101_tuck_Qiu_Qiyuan_CHN.mp4",
                athlete: "Qiu Qiyuan",
                country: "CHN"
            },
            tags: ["fwd"]
        },
        {
            id: "4.101-pike",
            difficulty: "A",
            value: "0.10",
            nameEn: "Salto fwd piked",
            nameZh: ["前屈", "屈体前空翻"],
            image: "./cards/cardimages/group04/4_101_pike.png",
            tags: ["fwd"]
        },
        {
            id: "4.201-360tuck",
            difficulty: "B",
            value: "0.20",
            nameEn: "Salto fwd tucked with 1/1 twist (360°)",
            nameZh: ["前团360", "团身前空翻转体360°"],
            image: "./cards/cardimages/group04/4_201_360tuck.png",
            tags: ["fwd", "cr2"] // ⚠️ 满足360度转体，打上cr2
        },
        {
            id: "4.201-180tuck",
            difficulty: "B",
            value: "0.20",
            nameEn: "Salto fwd tucked with ½ twist (180°)",
            nameZh: ["前团180", "团身前空翻转体180°"],
            image: "./cards/cardimages/group04/4_201_360tuck.png",
            tags: ["fwd"]
        },
        {
            id: "4.201-180pike",
            difficulty: "B",
            value: "0.20",
            nameEn: "Salto fwd piked with ½ twist (180°)",
            nameZh: ["前屈180", "屈体前空翻转体180°"],
            image: "./cards/cardimages/group04/4_201_360tuck.png",
            tags: ["fwd"]
        },
        {
            id: "4.501",
            difficulty: "E",
            value: "0.50",
            nameEn: "Double salto fwd tucked",
            namedAfter: "Podkopayeva 波德科帕耶娃",
            nameZh: ["前团两周", "团身前空翻两周", "Podkopayeva", "波德科帕耶娃"],
            image: "./cards/cardimages/group04/4_501.png",
            video: {
                src: "./cards/cardvideos/4_501_Emma_Fioravanti_ITA.mp4",
                athlete: "Emma Fioravanti",
                country: "ITA"
            },
            tags: ["fwd", "cr3"] // ⚠️ 满足双周，打上cr3
        },
        {
            id: "4.601-180",
            difficulty: "F",
            value: "0.60",
            nameEn: "Double salto fwd tucked with ½ twist (180°)",
            namedAfter: "Podkopayeva 波德科帕耶娃",
            nameZh: ["前团两周180", "前团180旋", "团身前空翻两周转体180°", "Podkopayeva", "波德科帕耶娃"],
            image: "./cards/cardimages/group04/4_601_pike.png",
            video: {
                src: "./cards/cardvideos/4_601_180_Brooklyn_Moors_CAN.mp4",
                athlete: "Brooklyn Moors",
                country: "CAN"
            },
            tags: ["fwd", "cr3"] 
        },
        {
            id: "4.601-pike",
            difficulty: "F",
            value: "0.60",
            nameEn: "Double salto fwd piked",
            namedAfter: "Dowell 道威尔",
            nameZh: ["前屈两周", "屈体前空翻两周", "Dowell", "道威尔"],
            image: "./cards/cardimages/group04/4_601_180.png",
            tags: ["fwd", "cr3"]
        }
    ],

    // 02 系列：直体前空翻及其转体
    series_02: [
        {
            id: "4.202",
            difficulty: "B",
            value: "0.20",
            nameEn: "Salto fwd stretched",
            nameZh: ["前直", "直体前空翻"],
            image: "./cards/cardimages/group04/4_601_180.png",
            video: {
                src: "./cards/cardvideos/4_202_Aiko_Sugihara_JPN.mp4",
                athlete: "Aiko Sugihara",
                country: "JPN"
            },
            tags: ["fwd"]
        },
        {
            id: "4.202",
            difficulty: "B",
            value: "0.20",
            nameEn: "Salto fwd stretched, also with ½ twist (180°)",
            nameZh: ["前直180", "直体前空翻转体180°"],
            image: "./cards/cardimages/group04/4_202.png",
            video: {
                src: "./cards/cardvideos/4_202_Aiko_Sugihara_JPN.mp4",
                athlete: "Aiko Sugihara",
                country: "JPN"
            },
            tags: ["fwd"] 
        },
        {
            id: "4.302-360",
            difficulty: "C",
            value: "0.30",
            nameEn: "Salto fwd stretched with 1/1 twist (360°)",
            nameZh: ["前直360", "直体前空翻转体360°"],
            image: "./cards/cardimages/group04/4_302_540.png",
            video: {
                src: "./cards/cardvideos/4_302_360_Ana_Barbosu_ROU.mp4",
                athlete: "Ana Barbosu",
                country: "ROU"
            },
            tags: ["fwd", "cr2"]
        },
        {
            id: "4.302-540",
            difficulty: "C",
            value: "0.30",
            nameEn: "Salto fwd stretched with 1½ twist (540°)",
            nameZh: ["前直540", "直体前空翻转体540°"],
            image: "./cards/cardimages/group04/4_302_540.png",
            video: {
                src: "./cards/cardvideos/4_302_540_Qiu_Qiyuan_CHN.mp4",
                athlete: "Qiu Qiyuan",
                country: "CHN"
            },
            tags: ["fwd", "cr2"]
        },
        {
            id: "4.402",
            difficulty: "D",
            value: "0.40",
            nameEn: "Salto fwd stretched with 2/1 twist (720°)",
            namedAfter: "Tarasevich 塔拉塞维奇",
            nameZh: ["前直720", "直体前空翻转体720°", "Tarasevich", "塔拉塞维奇"],
            image: "./cards/cardimages/group04/4_402.png",
            tags: ["fwd", "cr2"]
        },
        {
            id: "4.502",
            difficulty: "E",
            value: "0.50",
            nameEn: "Salto fwd stretched with 2 ½ twist (900°)",
            namedAfter: "Cojocar 科诺卡鲁",
            nameZh: ["前直900", "直体前空翻转体900°", "Cojocar", "科诺卡鲁"],
            image: "./cards/cardimages/group04/4_502.png",
            video: {
                src: "./cards/cardvideos/4_502_Ruby_Evans_GBR.mp4",
                athlete: "Ruby Evans",
                country: "GBR"
            },
            tags: ["fwd", "cr2"]
        },
        {
            id: "4.602",
            difficulty: "F",
            value: "0.60",
            nameEn: "Salto fwd stretched with 3/1 twist (1080°)",
            namedAfter: "Maldonado 马尔多纳多",
            nameZh: ["前直1080", "直体前空翻转体1080°", "Maldonado", "马尔多纳多"],
            image: "./cards/cardimages/group04/4_602.png",
            tags: ["fwd", "cr2"]
        }
    ],

    // 03/04 系列：挺身前空翻与挺身侧空翻
    series_03_04: [
        {
            id: "4.103",
            difficulty: "A",
            value: "0.10",
            nameEn: "Free (aerial) walkover fwd",
            nameZh: ["前挺", "挺身前空翻"],
            image: "./cards/cardimages/group04/4_103.png",
            tags: []
        },
        {
            id: "4.104",
            difficulty: "A",
            value: "0.10",
            nameEn: "Free (aerial) cartwheel or free (aerial) round-off",
            nameZh: ["侧挺", "挺身侧空翻", "无手撑的踺子"],
            image: "./cards/cardimages/group04/4_104.png",
            tags: []
        }
    ],

    // 05 系列：侧空翻与阿拉伯空翻
    series_05: [
        {
            id: "4.105-tuck",
            difficulty: "A",
            value: "0.10",
            nameEn: "Salto swd tucked",
            nameZh: ["侧团", "单脚/双脚起跳的团身侧空翻"],
            image: "./cards/cardimages/group04/4_105_tuck.png",
            tags: [] 
        },
        {
            id: "4.105-pike",
            difficulty: "A",
            value: "0.10",
            nameEn: "Salto swd piked",
            nameZh: ["侧屈", "单脚/双脚起跳的屈体侧空翻"],
            image: "./cards/cardimages/group04/4_105_tuck.png",
            tags: [] 
        },
        {
            id: "4.205-tuck",
            difficulty: "B",
            value: "0.20",
            nameEn: "Arabian salto tucked",
            nameZh: ["阿团", "阿拉伯前团", "阿拉伯团身前空翻"],
            image: "./cards/cardimages/group04/4_205_tuck.png",
            tags: ["fwd"] 
        },
        {
            id: "4.205-pike",
            difficulty: "B",
            value: "0.20",
            nameEn: "Arabian salto piked",
            nameZh: ["阿屈", "阿拉伯前屈", "阿拉伯屈体前空翻"],
            image: "./cards/cardimages/group04/4_205_tuck.png",
            tags: ["fwd"] 
        },
        {
            id: "4.505",
            difficulty: "E",
            value: "0.50",
            nameEn: "Arabian double salto tucked",
            namedAfter: "Andreasen / Jentsch 安德列亚森/詹奇",
            nameZh: ["阿团两周", "阿拉伯前团两周", "阿拉伯团身前空翻两周", "Andreasen", "Jentsch", "安德列亚森", "詹奇"],
            image: "./cards/cardimages/group04/4_505.png",
            video: {
                src: "./cards/cardvideos/4_505_Julia_Soares_BRA.mp4",
                athlete: "Julia Soares",
                country: "BRA"
            },
            tags: ["fwd", "cr3"] 
        },
        {
            id: "4.605",
            difficulty: "F",
            value: "0.60",
            nameEn: "Arabian double salto piked",
            namedAfter: "Dos Santos 道斯 桑托斯",
            nameZh: ["阿屈两周", "阿拉伯前屈两周", "阿拉伯屈体前空翻两周", "Dos Santos", "道斯 桑托斯"],
            image: "./cards/cardimages/group04/4_605.png",
            video: {
                src: "./cards/cardvideos/4_605_Alexandra_Raisman_USA.mp4",
                athlete: "Alexandra Raisman",
                country: "USA"
            },
            tags: ["fwd", "cr3"] 
        },
        {
            id: "4.805",
            difficulty: "H",
            value: "0.80",
            nameEn: "Arabian double salto stretched",
            namedAfter: "Dos Santos 道斯 桑托斯",
            nameZh: ["阿直两周", "阿拉伯前直两周", "阿拉伯直体前空翻两周", "Dos Santos", "道斯 桑托斯"],
            image: "./cards/cardimages/group04/4_805.png",
            video: {
                src: "./cards/cardvideos/4_805_Daiane_Dos_Santos_BRA.mp4",
                athlete: "Daiane Dos Santos",
                country: "BRA"
            },
            tags: ["fwd", "cr3"] 
        }
    ]
};

// ==========================================
// 第 5 组：向后空翻 (Saltos bwd) 【100% 全量拆分版】
// ==========================================
const group5_bwd_saltos = {
    
    // 01 系列：单周向后空翻及其转体
    series_01: [
        {
            id: "5.101-layout",
            difficulty: "A",
            value: "0.10",
            nameEn: "Salto bwd stretched",
            nameZh: ["后直", "直体后空翻"],
            image: "./cards/cardimages/group05/5_101_layout.png",
            tags: ["bwd"]
        },
        {
            id: "5.101-pike",
            difficulty: "A",
            value: "0.10",
            nameEn: "Salto bwd piked",
            nameZh: ["后屈", "屈体后空翻"],
            image: "./cards/cardimages/group05/5_101_layout.png",
            tags: ["bwd"]
        },
        {
            id: "5.101-tuck",
            difficulty: "A",
            value: "0.10",
            nameEn: "Salto bwd tucked",
            nameZh: ["后团", "团身后空翻"],
            image: "./cards/cardimages/group05/5_101_layout.png",
            tags: ["bwd"]
        },
        {
            id: "5.201-360layout",
            difficulty: "B",
            value: "0.20",
            nameEn: "Salto bwd stretched with 1/1 twist (360°)",
            nameZh: ["后直360", "直体后空翻转体360°"],
            image: "./cards/cardimages/group05/5_201_180.png",
            tags: ["bwd", "cr2"] // ⚠️ 满足360度转体，打上cr2
        },
        {
            id: "5.201-360tuck",
            difficulty: "B",
            value: "0.20",
            nameEn: "Salto bwd tucked with 1/1 twist (360°)",
            nameZh: ["后团360", "团身后空翻转体360°"],
            image: "./cards/cardimages/group05/5_201_180.png",
            tags: ["bwd", "cr2"]
        },
        {
            id: "5.201-180",
            difficulty: "B",
            value: "0.20",
            nameEn: "Salto bwd stretched with ½ twist (180°)",
            nameZh: ["后直180", "直体后空翻转体180°"],
            image: "./cards/cardimages/group05/5_201_180.png",
            tags: ["bwd"]
        },
        {
            id: "5.301-540",
            difficulty: "C",
            value: "0.30",
            nameEn: "Salto bwd stretched with 1½ twist (540°)",
            nameZh: ["后直540", "直体后空翻转体540°"],
            image: "./cards/cardimages/group05/5_301_540.png",
            video: {
                src: "./cards/cardvideos/5_301_540_Shang_Chunsong_CHN.mp4",
                athlete: "Shang Chunsong",
                country: "CHN"
            },
            tags: ["bwd", "cr2"]
        },
        {
            id: "5.301-720",
            difficulty: "C",
            value: "0.30",
            nameEn: "Salto bwd stretched with 2/1 twist (720°)",
            nameZh: ["后直720", "直体后空翻转体720°"],
            image: "./cards/cardimages/group05/5_301_540.png",
            video: {
                src: "./cards/cardvideos/5_301_720_Qiu_Qiyuan_CHN.mp4",
                athlete: "Qiu Qiyuan",
                country: "CHN"
            },
            tags: ["bwd", "cr2"]
        },
        {
            id: "5.401",
            difficulty: "D",
            value: "0.40",
            nameEn: "Salto bwd stretched with 2½ twist (900°)",
            nameZh: ["后直900", "直体后空翻转体900°"],
            image: "./cards/cardimages/group05/5_401.png",
            video: {
                src: "./cards/cardvideos/5_401_Cheng_Fei_CHN.mp4",
                athlete: "Cheng Fei",
                country: "CHN"
            },
            tags: ["bwd", "cr2"]
        },
        {
            id: "5.501",
            difficulty: "E",
            value: "0.50",
            nameEn: "Salto bwd stretched with 3/1 twist (1080°)",
            nameZh: ["后直1080", "直体后空翻转体1080°"],
            image: "./cards/cardimages/group05/5_501.png",
            video: {
                src: "./cards/cardvideos/5_501_Cheng_Fei_CHN.mp4",
                athlete: "Cheng Fei",
                country: "CHN"
            },
            tags: ["bwd", "cr2"]
        },
        {
            id: "5.601",
            difficulty: "F",
            value: "0.60",
            nameEn: "Salto bwd stretched with 3½ twist (1260°)",
            nameZh: ["后直1260", "直体后空翻转体1260°"],
            image: "./cards/cardimages/group05/5_601.png",
            video: {
                src: "./cards/cardvideos/5_601_Mao_Yi_CHN.mp4",
                athlete: "Mao Yi",
                country: "CHN"
            },
            tags: ["bwd", "cr2"]
        }
    ],

    // 02 系列：团身/屈体后空翻两周及其转体
    series_02: [
        {
            id: "5.402-tuck",
            difficulty: "D",
            value: "0.40",
            nameEn: "Double salto bwd tucked",
            namedAfter: "Kim 金淑琼",
            nameZh: ["后团两周", "团身后空翻两周", "Kim", "金淑琼"],
            image: "./cards/cardimages/group05/5_402_tuck.png",
            video: {
                src: "./cards/cardvideos/5_402_tuck_Zhou_Yaqin_CHN.mp4",
                athlete: "Zhou Yaqin",
                country: "CHN"
            }, 
            tags: ["bwd", "cr3"] // ⚠️ 满足双周，打上cr3
        },
        {
            id: "5.402-pike",
            difficulty: "D",
            value: "0.40",
            nameEn: "Double salto bwd piked",
            namedAfter: "Kim 金淑琼",
            nameZh: ["后屈两周", "屈体后空翻两周", "Kim", "金淑琼"],
            image: "./cards/cardimages/group05/5_402_tuck.png",
            video: {
                src: "./cards/cardvideos/5_402_pike_Qin_Xinyi_CHN.mp4",
                athlete: "Qin Xinyi",
                country: "CHN"
            }, 
            tags: ["bwd", "cr3"]
        },
        {
            id: "5.502-tuck360",
            difficulty: "E",
            value: "0.50",
            nameEn: "Double salto bwd tucked with 1/1 twist (360°)",
            namedAfter: "Mukhina 穆欣娜",
            nameZh: ["团身旋", "后团360旋", "后团360炫", "团身后空翻两周转体360°", "Mukhina", "穆欣娜"],
            image: "./cards/cardimages/group05/5_502_tuck360.png",
            video: {
                src: "./cards/cardvideos/5_502_tuck360_Flavia_Saraiva_BRA.mp4",
                athlete: "Flavia Saraiva",
                country: "BRA"
            },
            tags: ["bwd", "cr2", "cr3"] // ⚠️ 双周带360度转体，同时满足cr2和cr3
        },
        {
            id: "5.502-pike360",
            difficulty: "E",
            value: "0.50",
            nameEn: "Double salto bwd piked with 1/1 twist (360°)",
            namedAfter: "Oliveira 奥利维拉",
            nameZh: ["屈体旋", "后屈360旋", "后屈360炫", "屈体后空翻两周转体360°", "Oliveira", "奥利维拉"],
            image: "./cards/cardimages/group05/5_502_tuck360.png",
            video: {
                src: "./cards/cardvideos/5_502_pike360_Huang_Qiushuang_CHN.mp4",
                athlete: "Huang Qiushuang",
                country: "CHN"
            },
            tags: ["bwd", "cr2", "cr3"]
        },
        {
            id: "5.602",
            difficulty: "F",
            value: "0.60",
            nameEn: "Double salto bwd tucked with 1¼ twist (540°)",
            namedAfter: "Heron 赫伦",
            nameZh: ["后团540旋", "后团540炫", "团身后空翻两周转体540°", "Heron", "赫伦"],
            image: "./cards/cardimages/group05/5_602.png",
            tags: ["bwd", "cr2", "cr3"]
        },
        {
            id: "5.802",
            difficulty: "H",
            value: "0.80",
            nameEn: "Double salto bwd tucked with 2/1 twist (720°)",
            namedAfter: "Silivas 希里瓦斯",
            nameZh: ["水炫","后团720旋", "后团720炫", "团身后空翻两周转体720°", "Silivas", "希里瓦斯"],
            image: "./cards/cardimages/group05/5_802.png",
            video: {
                src: "./cards/cardvideos/5_802_Simone_Biles_USA.mp4",
                athlete: "Simone Biles",
                country: "USA"
            },
            tags: ["bwd", "cr2", "cr3"]
        },
        {
            id: "5.1002",
            difficulty: "J",
            value: "1.00",
            nameEn: "Double salto bwd tucked with 3/1 twist (1080°)",
            namedAfter: "Biles 拜尔斯",
            nameZh: ["后团1080旋", "后团1080炫", "团身后空翻两周转体1080°", "Biles", "拜尔斯"],
            image: "./cards/cardimages/group05/5_1002.png",
            video: {
                src: "./cards/cardvideos/5_1002_Simone_Biles_USA.mp4",
                athlete: "Simone Biles",
                country: "USA"
            },
            tags: ["bwd", "cr2", "cr3"]
        }
    ],

    // 03 系列：直体后空翻两周及其转体
    series_03: [
        {
            id: "5.603",
            difficulty: "F",
            value: "0.60",
            nameEn: "Double salto bwd stretched",
            nameZh: ["后直两周", "直体后空翻两周"],
            image: "./cards/cardimages/group05/5_603.png",
            video: {
                src: "./cards/cardvideos/5_603_Anna_Ppavlova_RUS.mp4",
                athlete: "Anna Ppavlova",
                country: "RUS"
            },
            tags: ["bwd", "cr3"]
        },
        {
            id: "5.703",
            difficulty: "G",
            value: "0.70",
            nameEn: "Double salto bwd stretched with ½ twist (180°)",
            namedAfter: "Biles 拜尔斯",
            nameZh: ["后直两周180", "直体后空翻两周转体180°", "Biles", "拜尔斯"],
            image: "./cards/cardimages/group05/5_703.png",
            video: {
                src: "./cards/cardvideos/5_703_Simone_Biles_USA.mp4",
                athlete: "Simone Biles",
                country: "USA"
            },
            tags: ["bwd", "cr3"] 
        },
        {
            id: "5.803",
            difficulty: "H",
            value: "0.80",
            nameEn: "Double salto bwd stretched with 1/1 twist (360°)",
            namedAfter: "Chusovitina / Tuzhikova 丘索维金娜/图吉科娃",
            nameZh: ["直炫","直体旋", "后直360旋", "后直360炫", "直体后空翻两周转体360°", "Chusovitina", "Tuzhikova", "丘索维金娜", "图吉科娃"],
            image: "./cards/cardimages/group05/5_803.png",
            video: {
                src: "./cards/cardvideos/5_803_Sae_Miyakawa_JPN.mp4",
                athlete: "Sae Miyakawa",
                country: "JPN"
            },
            tags: ["bwd", "cr2", "cr3"]
        },
        {
            id: "5.903",
            difficulty: "I",
            value: "0.90",
            nameEn: "Double salto bwd stretched with 2/1 twist (720°)",
            namedAfter: "Moors 莫尔斯",
            nameZh: ["后直720旋", "后直720炫", "直体后空翻两周转体720°", "Moors", "莫尔斯"],
            image: "./cards/cardimages/group05/5_903.png",
            video: {
                src: "./cards/cardvideos/5_903_Jessica_Gadirova_GBR.mp4",
                athlete: "Jessica Gadirova",
                country: "GBR"
            },
            tags: ["bwd", "cr2", "cr3"]
        }
    ],

    // 04 系列：快速后空翻 (Whip saltos)
    series_04: [
        {
            id: "5.104",
            difficulty: "A",
            value: "0.10",
            nameEn: "Whip salto bwd",
            nameZh: ["快速后空翻","快速", "小翻"],
            image: "./cards/cardimages/group05/5_104.png",
            tags: ["bwd"]
        },
        {
            id: "5.204",
            difficulty: "B",
            value: "0.20",
            nameEn: "Whip salto bwd with ½ twist (180°)",
            nameZh: ["快速180", "快速后空翻转体180°"],
            image: "./cards/cardimages/group05/5_204.png",
            tags: ["bwd"] 
        },
        {
            id: "5.304",
            difficulty: "C",
            value: "0.30",
            nameEn: "Whip salto bwd with 1/1 twist (360°)",
            nameZh: ["快速360", "快速后空翻转体360°"],
            image: "./cards/cardimages/group05/5_304.png",
            video: {
                src: "./cards/cardvideos/5_304_Angela_Andreoli_ITA.mp4",
                athlete: "Angela Andreoli",
                country: "ITA"
            },
            tags: ["bwd", "cr2"]
        }
    ]
};




// ==========================================
// 魔法补丁：自动给第 1 组缺少标签的跳步打上 CR1 标签
// ==========================================
Object.values(group1_leaps).forEach(series => {
    series.forEach(skill => {
        if (!skill.tags) {
            skill.tags = []; // 如果没有标签数组，就建一个
            let combinedNames = skill.nameZh.join("");
            // 只要名字里包含这些字眼，就认定它是满足 CR1 要求的跳步
            if (combinedNames.includes("劈叉") || combinedNames.includes("分腿") || combinedNames.includes("180") || combinedNames.includes("结环")) {
                skill.tags.push("cr1");
            }
        }
    });
});

// ==========================================
// 【终点站】将五大组别全量打包输出给网页使用
// ==========================================

// 创建带type标记的动作数组
const group1WithType = [...group1_leaps.series_01, ...group1_leaps.series_02, ...group1_leaps.series_03, ...group1_leaps.series_04, ...group1_leaps.series_05, ...group1_leaps.series_06, ...group1_leaps.series_07, ...group1_leaps.series_08, ...group1_leaps.series_09, ...group1_leaps.series_10, ...group1_leaps.series_11, ...group1_leaps.series_12, ...group1_leaps.series_13, ...group1_leaps.series_14].map(skill => ({...skill, type: "leaps"}));
const group2WithType = [...group2_turns.series_01, ...group2_turns.series_02, ...group2_turns.series_03, ...group2_turns.series_04, ...group2_turns.series_05_06, ...group2_turns.series_07, ...group2_turns.series_08].map(skill => ({...skill, type: "turns"}));
const group3WithType = [...group3_hand_supports.series_01, ...group3_hand_supports.series_02, ...group3_hand_supports.series_03, ...group3_hand_supports.series_04, ...group3_hand_supports.series_05, ...group3_hand_supports.series_06, ...group3_hand_supports.series_07].map(skill => ({...skill, type: "hand_support"}));
const group4WithType = [...group4_fwd_saltos.series_01, ...group4_fwd_saltos.series_02, ...group4_fwd_saltos.series_03_04, ...group4_fwd_saltos.series_05].map(skill => ({...skill, type: "acro"}));
const group5WithType = [...group5_bwd_saltos.series_01, ...group5_bwd_saltos.series_02, ...group5_bwd_saltos.series_03, ...group5_bwd_saltos.series_04].map(skill => ({...skill, type: "acro"}));

const skillsData = [
    // 第 1 组 (跳跃与跳步) - type: "leaps"
    ...group1WithType,

    // 第 2 组 (立转与圈转) - type: "turns"
    ...group2WithType,

    // 第 3 组 (手撑动作) - type: "hand_support"
    ...group3WithType,

    // 第 4 组 (前空翻与侧空翻) - type: "acro"
    ...group4WithType,

    // 第 5 组 (后空翻) - type: "acro"
    ...group5WithType
];