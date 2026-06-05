// ==========================================
// E裁判员执行扣分库 (E-Jury Deductions)
// 包含极致精准的 target_ids 靶向映射与中文注释
// ==========================================

const e_jury_deductions = [
  // ----------------------------------------
  // 1. 通用身体姿态错误 (General Body Shape)
  // ----------------------------------------
  
  { "id": "bent_knees_small", "name": "屈膝(小错)", "full_description": "屈膝 (小错) - Bent knees (Small)", "deduction": 0.1, "category": "general", "target_tags": ["acro", "leaps", "turns", "hand_support"] },
  { "id": "bent_knees_med", "name": "屈膝(中错)", "full_description": "屈膝 (中错) - Bent knees (Medium)", "deduction": 0.3, "category": "general", "target_tags": ["acro", "leaps", "turns", "hand_support"] },
  { "id": "bent_knees_large", "name": "屈膝(大错)", "full_description": "屈膝 (大错) - Bent knees (Large)", "deduction": 0.5, "category": "general", "target_tags": ["acro", "leaps", "turns", "hand_support"] },
  
  { "id": "legs_apart_knees_small", "name": "分腿/膝(小错)", "full_description": "分腿或分膝 (小错) - Legs or knees apart (Small)", "deduction": 0.1, "category": "general", "target_tags": ["acro", "leaps", "turns", "hand_support"] },
  { "id": "legs_apart_knees_med", "name": "分腿/膝(中错)", "full_description": "分腿或分膝 (中错) - Legs or knees apart (Medium)", "deduction": 0.3, "category": "general", "target_tags": ["acro", "leaps", "turns", "hand_support"] },
  { "id": "legs_apart_knees_large", "name": "分腿/膝≥肩宽", "full_description": "分腿或分膝等于或大于肩宽 (大错)", "deduction": 0.5, "category": "general", "target_tags": ["acro", "leaps", "turns", "hand_support"] },
  
  { "id": "twist_crossing_legs_small", "name": "转体绞腿(小错)", "full_description": "在转体动作中绞腿 (小错) - Twist crossing legs (Small)", "deduction": 0.1, "category": "general", "target_tags": ["acro", "leaps", "turns"] },
  { "id": "twist_crossing_legs_med", "name": "转体绞腿(中错)", "full_description": "在转体动作中绞腿 (中错) - Twist crossing legs (Medium)", "deduction": 0.3, "category": "general", "target_tags": ["acro", "leaps", "turns"] },
  { "id": "twist_crossing_legs_large", "name": "转体绞腿(大错)", "full_description": "在转体动作中绞腿 (大错) - Twist crossing legs (Large)", "deduction": 0.5, "category": "general", "target_tags": ["acro", "leaps", "turns"] },
  
  { "id": "insufficient_height_small", "name": "高度不足(小错)", "full_description": "动作高度不足/外观幅度 (小错)", "deduction": 0.1, "category": "general", "target_tags": ["acro", "leaps"] },
  { "id": "insufficient_height_med", "name": "高度不足(中错)", "full_description": "动作高度不足/外观幅度 (中错)", "deduction": 0.3, "category": "general", "target_tags": ["acro", "leaps"] },
  
  { "id": "body_posture_not_straight_small", "name": "直体不直(小错)", "full_description": "动作中身体和或腿姿势直体不直 (小错)", "deduction": 0.1, "category": "general", "target_tags": ["acro", "leaps", "turns"] },
  { "id": "body_posture_not_straight_med", "name": "直体不直(中错)", "full_description": "动作中身体和或腿姿势直体不直 (中错)", "deduction": 0.3, "category": "general", "target_tags": ["acro", "leaps", "turns"] },
  
  { "id": "flexed_feet", "name": "勾脚(小错)", "full_description": "勾脚 - Flexed feet", "deduction": 0.1, "category": "general", "target_tags": ["acro", "leaps", "turns"] },
  { "id": "hesitation", "name": "动作犹豫(小错)", "full_description": "完成动作中犹豫", "deduction": 0.1, "category": "general", "target_tags": ["acro", "leaps", "turns"] },
  
  { "id": "balk_small", "name": "空跑未完成(小错)", "full_description": "尝试完成动作但没有完成/空跑 (小错)", "deduction": 0.1, "category": "general", "target_tags": ["acro", "leaps", "turns"] },
  { "id": "balk_med", "name": "空跑未完成(中错)", "full_description": "尝试完成动作但没有完成/空跑 (中错)", "deduction": 0.3, "category": "general", "target_tags": ["acro", "leaps", "turns"] },
  { "id": "balk_large", "name": "空跑未完成(大错)", "full_description": "尝试完成动作但没有完成/空跑 (大错)", "deduction": 0.5, "category": "general", "target_tags": ["acro", "leaps", "turns"] },
  
  { "id": "deviation_direction", "name": "偏离直线(小错)", "full_description": "偏离直线方向", "deduction": 0.1, "category": "general", "target_tags": ["acro", "leaps"] },

  // ----------------------------------------
  // 2. 空翻姿态专属错误 (Acro Specific - 高度靶向)
  // ----------------------------------------
  // 【只有】不带转体的一周团身才触发
  { 
    "id": "tuck_imprecise_1_small", "name": "一周团身不精确(小错)", "full_description": "不带转体的一周团身空翻姿势不精确 (小错)", "deduction": 0.1, "category": "general", 
    "target_ids": ["4.101-tuck", "4.105-tuck", "4.205-tuck", "5.101-tuck"],
    "_targets_annotation": "前团, 侧团, 阿团, 后团"
  },
  { 
    "id": "tuck_imprecise_1_med", "name": "一周团身不精确(中错)", "full_description": "不带转体的一周团身空翻姿势不精确 (中错)", "deduction": 0.3, "category": "general", 
    "target_ids": ["4.101-tuck", "4.105-tuck", "4.205-tuck", "5.101-tuck"]
  },

  // 【只有】不带转体的一周屈体才触发
  { 
    "id": "pike_imprecise_1_small", "name": "一周屈体不精确(小错)", "full_description": "不带转体的一周屈体空翻姿势不精确 (小错)", "deduction": 0.1, "category": "general", 
    "target_ids": ["4.101-pike", "4.105-pike", "4.205-pike", "5.101-pike"],
    "_targets_annotation": "前屈, 侧屈, 阿屈, 后屈"
  },
  { 
    "id": "pike_imprecise_1_med", "name": "一周屈体不精确(中错)", "full_description": "不带转体的一周屈体空翻姿势不精确 (中错)", "deduction": 0.3, "category": "general", 
    "target_ids": ["4.101-pike", "4.105-pike", "4.205-pike", "5.101-pike"]
  },

  // 【只有】不带转体的两周团身才触发
  { 
    "id": "tuck_imprecise_2_small", "name": "两周团身不精确(小错)", "full_description": "不带转体的两周团身空翻姿势不精确 (小错)", "deduction": 0.1, "category": "general", 
    "target_ids": ["4.501", "4.505", "5.402-tuck"],
    "_targets_annotation": "前团两周, 阿团两周, 后团两周"
  },
  { 
    "id": "tuck_imprecise_2_med", "name": "两周团身不精确(中错)", "full_description": "不带转体的两周团身空翻姿势不精确 (中错)", "deduction": 0.3, "category": "general", 
    "target_ids": ["4.501", "4.505", "5.402-tuck"]
  },

  // 【只有】不带转体的两周屈体才触发
  { 
    "id": "pike_imprecise_2_small", "name": "两周屈体不精确(小错)", "full_description": "不带转体的两周屈体空翻姿势不精确 (小错)", "deduction": 0.1, "category": "general", 
    "target_ids": ["4.601-pike", "4.605", "5.402-pike"],
    "_targets_annotation": "前屈两周, 阿屈两周, 后屈两周"
  },
  { 
    "id": "pike_imprecise_2_med", "name": "两周屈体不精确(中错)", "full_description": "不带转体的两周屈体空翻姿势不精确 (中错)", "deduction": 0.3, "category": "general", 
    "target_ids": ["4.601-pike", "4.605", "5.402-pike"]
  },

  // 【只有】直体空翻（包含快速和阿拉伯）才触发
  { 
    "id": "early_pike_small", "name": "未能维持直体(小错)", "full_description": "未能维持直体姿势/屈体过早 (小错)", "deduction": 0.1, "category": "general", 
    "target_ids": [
      "4.202", "4.302-360", "4.302-540", "4.402", "4.502", "4.602", "4.805", 
      "5.101-layout", "5.201-360layout", "5.201-180", "5.301-540", "5.301-720", "5.401", "5.501", "5.601", 
      "5.603", "5.703", "5.803", "5.903",
      "5.104", "5.204", "5.304"
    ],
    "_targets_annotation": "所有直体空翻（包含前直、后直、直体两周及快速后空翻等）"
  },
  { 
    "id": "early_pike_med", "name": "未能维持直体(中错)", "full_description": "未能维持直体姿势/屈体过早 (中错)", "deduction": 0.3, "category": "general", 
    "target_ids": [
      "4.202", "4.302-360", "4.302-540", "4.402", "4.502", "4.602", "4.805", 
      "5.101-layout", "5.201-360layout", "5.201-180", "5.301-540", "5.301-720", "5.401", "5.501", "5.601", 
      "5.603", "5.703", "5.803", "5.903",
      "5.104", "5.204", "5.304"
    ]
  },

  // 挺身特有：开度不足
  { "id": "insufficient_split_acro_small", "name": "空翻开度不足(小错)", "full_description": "技巧动作开度不足/非飞行 (小错)", "deduction": 0.1, "category": "general", "target_ids": ["4.103", "4.104"], "_targets_annotation": "挺身前空翻, 挺身侧空翻" },
  { "id": "insufficient_split_acro_med", "name": "空翻开度不足(中错)", "full_description": "技巧动作开度不足/非飞行 (中错)", "deduction": 0.3, "category": "general", "target_ids": ["4.103", "4.104"] },

  // ----------------------------------------
  // 3. 跳步与转体技术错误 (Leaps & Turns Tech)
  // ----------------------------------------
  { "id": "dance_tech_error_small", "name": "舞蹈身形不精确(小错)", "full_description": "舞蹈动作未能满足技术要求/身形不精确 (小错)", "deduction": 0.1, "category": "general", "target_tags": ["leaps", "turns"] },
  { "id": "dance_tech_error_med", "name": "舞蹈身形不精确(中错)", "full_description": "舞蹈动作未能满足技术要求/身形不精确 (中错)", "deduction": 0.3, "category": "general", "target_tags": ["leaps", "turns"] },

  { "id": "tuck_jump_knees_horiz", "name": "团跳膝平(小错)", "full_description": "团身跳: 膝位于水平", "deduction": 0.1, "category": "leaps", "target_ids": ["1.213", "1.313"] },
  { "id": "tuck_jump_knees_low", "name": "团跳膝低(中错)", "full_description": "团身跳: 膝低于水平", "deduction": 0.3, "category": "leaps", "target_ids": ["1.213", "1.313"] },
  
  { "id": "wolf_jump_leg_horiz", "name": "狼跳腿平(小错)", "full_description": "狼跳: 伸展腿位于水平", "deduction": 0.1, "category": "leaps", "target_ids": ["1.105", "1.114", "1.214", "1.514"] },
  { "id": "wolf_jump_leg_low", "name": "狼跳腿低(中错)", "full_description": "狼跳: 伸展腿低于水平", "deduction": 0.3, "category": "leaps", "target_ids": ["1.105", "1.114", "1.214", "1.514"] },

  { "id": "cat_leap_legs_horiz", "name": "猫跳腿平(小错)", "full_description": "猫跳: 单腿/双腿位于水平", "deduction": 0.1, "category": "leaps", "target_ids": ["1.111", "1.211", "1.311"] },
  { "id": "cat_leap_legs_low", "name": "猫跳腿低(中错)", "full_description": "猫跳: 单腿/双腿低于水平", "deduction": 0.3, "category": "leaps", "target_ids": ["1.111", "1.211", "1.311"] },

  { "id": "straddle_pike_uneven", "name": "分腿跳形变(小错)", "full_description": "分腿屈体跳: 腿姿不正确或不平行", "deduction": 0.1, "category": "leaps", "target_ids": ["1.107", "1.207", "1.307", "1.407", "1.108", "1.208"] },
  { "id": "straddle_pike_horiz", "name": "分腿跳腿平(小错)", "full_description": "分腿屈体跳: 腿位于水平", "deduction": 0.1, "category": "leaps", "target_ids": ["1.107", "1.207", "1.307", "1.407", "1.108", "1.208"] },
  { "id": "straddle_pike_low", "name": "分腿跳腿低(中错)", "full_description": "分腿屈体跳: 腿低于水平", "deduction": 0.3, "category": "leaps", "target_ids": ["1.107", "1.207", "1.307", "1.407", "1.108", "1.208"] },

  { "id": "sissone_ring_arch_insufficient", "name": "西松结环背弓(小错)", "full_description": "西松结环: 背弓姿势不足", "deduction": 0.1, "category": "leaps", "target_ids": ["1.209"] },
  { "id": "sissone_ring_foot_head", "name": "西松结环脚平头(小错)", "full_description": "西松结环: 后脚位于头高", "deduction": 0.1, "category": "leaps", "target_ids": ["1.209"] },
  { "id": "sissone_ring_foot_shoulder", "name": "西松结环脚平肩(中错)", "full_description": "西松结环: 后脚位于肩高", "deduction": 0.3, "category": "leaps", "target_ids": ["1.209"] },

  { "id": "sheep_jump_arch_insufficient", "name": "羊跳背弓(小错)", "full_description": "羊跳: 背弓不足", "deduction": 0.1, "category": "leaps", "target_ids": ["1.206"] },
  { "id": "sheep_jump_foot_head_below", "name": "羊跳脚平头及以下(小错)", "full_description": "羊跳: 脚位于头高或低于头高", "deduction": 0.1, "category": "leaps", "target_ids": ["1.206"] },
  { "id": "sheep_jump_hip_ext_insufficient", "name": "羊跳展髋(小错)", "full_description": "羊跳: 展髋不足", "deduction": 0.1, "category": "leaps", "target_ids": ["1.206"] },
  { "id": "sheep_jump_bent_legs_insufficient", "name": "羊跳屈腿(小错)", "full_description": "羊跳: 屈腿不足≥90°", "deduction": 0.1, "category": "leaps", "target_ids": ["1.206"] },

  { "id": "split_leap_swing_insufficient", "name": "交换腿前摆不够(小错)", "full_description": "交换腿/强森: 自由腿前摆少于45°", "deduction": 0.1, "category": "leaps", "target_ids": ["1.202", "1.302", "1.402", "1.204", "1.304", "1.404", "1.205", "1.305", "1.405"] },
  { "id": "split_leap_leg_bent_small", "name": "交换腿前腿弯(小错)", "full_description": "交换腿/强森: 自由腿弯曲 (小错)", "deduction": 0.1, "category": "leaps", "target_ids": ["1.202", "1.302", "1.402", "1.204", "1.304", "1.404", "1.205", "1.305", "1.405"] },
  { "id": "split_leap_leg_bent_med", "name": "交换腿前腿弯(中错)", "full_description": "交换腿/强森: 自由腿弯曲 (中错)", "deduction": 0.3, "category": "leaps", "target_ids": ["1.202", "1.302", "1.402", "1.204", "1.304", "1.404", "1.205", "1.305", "1.405"] },

  { "id": "ring_arch_insufficient", "name": "各结环背弓(小错)", "full_description": "结环跳: 背弓姿势不足", "deduction": 0.1, "category": "leaps", "target_ids": ["1.209", "1.309", "1.409", "1.305", "1.405"] },
  { "id": "ring_front_leg_low_small", "name": "各结环前腿低(小错)", "full_description": "结环跳: 前腿低于水平", "deduction": 0.1, "category": "leaps", "target_ids": ["1.209", "1.309", "1.409", "1.305", "1.405"] },
  { "id": "ring_front_leg_low_med", "name": "各结环前腿低(中错)", "full_description": "结环跳: 前腿低于水平(近似45°)", "deduction": 0.3, "category": "leaps", "target_ids": ["1.209", "1.309", "1.409", "1.305", "1.405"] },
  { "id": "ring_rear_foot_head", "name": "各结环后脚平头(小错)", "full_description": "结环跳: 后脚位于头高", "deduction": 0.1, "category": "leaps", "target_ids": ["1.209", "1.309", "1.409", "1.305", "1.405"] },
  { "id": "ring_rear_foot_shoulder", "name": "各结环后脚平肩(中错)", "full_description": "结环跳: 后脚位于肩高", "deduction": 0.3, "category": "leaps", "target_ids": ["1.209", "1.309", "1.409", "1.305", "1.405"] },
  { "id": "ring_back_leg_stretched", "name": "各结环后腿直(小错)", "full_description": "结环跳: 后腿伸直", "deduction": 0.1, "category": "leaps", "target_ids": ["1.209", "1.309", "1.409", "1.305", "1.405"] },

  { "id": "split_missing_20", "name": "跳步劈叉缺度20(小错)", "full_description": "劈叉不足>0°-20°", "deduction": 0.1, "category": "leaps", "target_tags": ["cr1"] },
  { "id": "split_missing_45", "name": "跳步劈叉缺度45(中错)", "full_description": "劈叉不足>20°-45°", "deduction": 0.3, "category": "leaps", "target_tags": ["cr1"] },
  { "id": "turn_split_missing_20", "name": "转体劈叉缺度20(小错)", "full_description": "带劈叉的立转: 劈叉不足>0°-20°", "deduction": 0.1, "category": "turns", "target_ids": ["2.203", "2.403", "2.503", "2.206"] },
  { "id": "turn_split_missing_45", "name": "转体劈叉缺度45(中错)", "full_description": "带劈叉的立转: 劈叉不足>20°-45°", "deduction": 0.3, "category": "turns", "target_ids": ["2.203", "2.403", "2.503", "2.206"] },

  // ----------------------------------------
  // 4. 通用落地错误 (Landing Faults)
  // ----------------------------------------
  { "id": "landing_legs_apart", "name": "落地分腿(小错)", "full_description": "落地分腿", "deduction": 0.1, "category": "landing", "target_tags": ["all"] },
  { "id": "landing_excessive_arm_swing", "name": "落地抡臂(小错)", "full_description": "落地多于手臂摆动", "deduction": 0.1, "category": "landing", "target_tags": ["all"] },
  { "id": "landing_lack_of_balance_small", "name": "落地晃动(小错)", "full_description": "落地缺乏平衡 (小错)", "deduction": 0.1, "category": "landing", "target_tags": ["all"] },
  { "id": "landing_lack_of_balance_med", "name": "落地晃动(中错)", "full_description": "落地缺乏平衡 (中错)", "deduction": 0.3, "category": "landing", "target_tags": ["all"] },
  { "id": "landing_lack_of_balance_large", "name": "落地晃动(大错)", "full_description": "落地缺乏平衡 (大错)", "deduction": 0.5, "category": "landing", "target_tags": ["all"] },
  { "id": "landing_extra_step_hop", "name": "落地动步或小跳(小错)", "full_description": "落地额外动步、小跳", "deduction": 0.1, "category": "landing", "target_tags": ["all"] },
  { "id": "landing_large_step_jump", "name": "落地大跨步(中错)", "full_description": "落地非常大的动步或大跳/参考超过肩宽", "deduction": 0.3, "category": "landing", "target_tags": ["all"] },
  { "id": "landing_body_posture_small", "name": "落地姿态(小错)", "full_description": "落地身体姿态错误 (小错)", "deduction": 0.1, "category": "landing", "target_tags": ["all"] },
  { "id": "landing_body_posture_med", "name": "落地姿态(中错)", "full_description": "落地身体姿态错误 (中错)", "deduction": 0.3, "category": "landing", "target_tags": ["all"] },
  { "id": "landing_deep_squat", "name": "落地深蹲(大错)", "full_description": "落地深蹲", "deduction": 0.5, "category": "landing", "target_tags": ["all"] },
  { "id": "landing_hand_touch_mat", "name": "手触垫未摔倒(中错)", "full_description": "手擦或触垫子但并未摔倒", "deduction": 0.3, "category": "landing", "target_tags": ["all"] },
  { "id": "landing_hand_support", "name": "手撑垫子(砸锅)", "full_description": "单手或双手撑在垫子上", "deduction": 1.0, "category": "landing", "target_tags": ["all"] },
  { "id": "landing_kneel_sit_on_mat", "name": "跪倒或坐垫(砸锅)", "full_description": "跪倒或坐在垫子上", "deduction": 1.0, "category": "landing", "target_tags": ["all"] },
  { "id": "landing_fall_on_mat", "name": "摔倒(砸锅)", "full_description": "摔倒", "deduction": 1.0, "category": "landing", "target_tags": ["all"] },
  { "id": "landing_feet_not_first", "name": "未先落脚(砸锅)", "full_description": "动作脚未先落地", "deduction": 1.0, "category": "landing", "target_tags": ["all"] },

  // ----------------------------------------
  // 5. 编排与艺术扣分 (Artistry & Choreography) - 留给全局引擎扫描
  // ----------------------------------------
  // ==========================================
  // 🎭 艺术表现 (Artistry of Performance) - 2025-2028 自由操最新规范
  // ==========================================
  { "id": "art_posture", "name": "身体姿态差", "full_description": "成套动作中身体姿态差 (头、肩、躯干)", "deduction": 0.1, "category": "artistry", "target_tags": ["global"] },
  { "id": "art_foot_work", "name": "脚部表现差", "full_description": "脚部表现差 (未绷脚/放松/内扣/勾脚等)", "deduction": 0.1, "category": "artistry", "target_tags": ["global"] },
  { "id": "art_amplitude", "name": "动作幅度不足", "full_description": "舞蹈等动作幅度不足", "deduction": 0.1, "category": "artistry", "target_tags": ["global"] },
  { "id": "art_body_involve", "name": "身体参与不足", "full_description": "身体参与不足 (缺乏全身协调)", "deduction": 0.1, "category": "artistry", "target_tags": ["global"] },
  { "id": "art_complexity", "name": "缺乏多样性与创造力", "full_description": "动作的多样性和创造力不足 (缺乏需要训练和协调的复杂动作)", "deduction": 0.1, "category": "artistry", "target_tags": ["global"] },

  // ==========================================
  // 🎵 乐感与音乐 (Musicality & Music)
  // ==========================================
  { "id": "art_music_express", "name": "音乐表现力差", "full_description": "根据音乐风格表现不够吸引人 / 缺乏表现力", "deduction": 0.1, "category": "artistry", "target_tags": ["global"] },
  { "id": "art_music_connect", "name": "动作与音乐脱节", "full_description": "音乐与成套部分或整个成套没有关联", "deduction": 0.1, "category": "artistry", "target_tags": ["global"] },
  { "id": "art_music_sync", "name": "结束未合拍", "full_description": "成套结束动作和音乐节拍缺乏同步", "deduction": 0.1, "category": "artistry", "target_tags": ["global"] },
  { "id": "art_music_edit", "name": "音乐剪辑差", "full_description": "音乐剪辑差 / 拼接突兀", "deduction": 0.1, "category": "artistry", "target_tags": ["global"] },

  // ==========================================
  // 📋 成套编排 (Composition) - 自由操专项
  // ==========================================
  { "id": "art_comp_corner", "name": "边角舞蹈差", "full_description": "边角舞蹈串差 / 缺乏多样性", "deduction": 0.1, "category": "artistry", "target_tags": ["global"] },
  { "id": "art_comp_floor", "name": "缺少触地动作", "full_description": "缺少触地动作 (必须包括至少躯干、大腿、或膝、或头触地)", "deduction": 0.1, "category": "artistry", "target_tags": ["global"] },

  // ==========================================
  // 🚨 警告：以下四个 ID 为引擎底层弹窗纠察专用，请勿修改它们的 id！
  // ==========================================
  { "id": "artistry_start_with_acro", "name": "开场接技巧", "full_description": "成套开始立刻做技巧串或技巧动作", "deduction": 0.1, "category": "artistry", "target_tags": ["global"] },
  { "id": "artistry_same_diagonal", "name": "重线无舞蹈", "full_description": "后续技巧串与前一技巧串使用同一对角线且无舞蹈编排", "deduction": 0.1, "category": "artistry", "target_tags": ["global"] },
  { "id": "artistry_extra_acro_line", "name": "超标跟串/多余技巧", "full_description": "多于1串后续技巧串/全套超过4串技巧串", "deduction": 0.1, "category": "artistry", "target_tags": ["global"] },
  { "id": "artistry_end_with_acro", "name": "收尾无舞蹈", "full_description": "以技巧动作作为结束/最后一个技巧后面没有舞蹈编排", "deduction": 0.1, "category": "artistry", "target_tags": ["global"] }
];

window.e_jury_deductions = e_jury_deductions;