// ==========================================
// D裁判员降组与无效判定库 (D-Jury Downgrades)
// 包含精准的 target_ids 映射及操作动作布尔值和自定义降组分差
// ==========================================

const d_jury_deductions = [
  // ... (保留前面的 1. 全局无效 和 2. 空翻姿态) ...
  { 
    "element_category": "通用规则 (General)", 
    "fault_condition": "教练员提供帮助 / 摔倒脚未先落地", 
    "d_jury_actions": { "no_dv": true, "no_cv": true, "no_cr": true, "no_dismount_bonus": true },
    "description": "动作不予承认",
    "target_tags": ["all"] 
  },
  { 
    "element_category": "直体空翻 (Stretched Saltos)", 
    "fault_condition": "未能维持直体（髋角屈>10°）", 
    "d_jury_actions": { "downgrade_to_other": true, "penalty": 0.1 },
    "description": "直降为屈 (-0.1)",
    "target_ids": ["4.202", "4.302-360", "4.402", "4.502", "4.602", "5.101-layout", "5.201-360layout", "5.301-540", "5.401", "5.501"]
  },
  { 
    "element_category": "直体两周空翻", 
    "fault_condition": "抓大腿以协助完成第二周空翻", 
    "d_jury_actions": { "downgrade_to_other": true, "penalty": 0.2 }, // 🟢 明确指定扣 0.2 分！
    "description": "直二降为团身两周 (-0.2)",
    "target_ids": ["5.603", "5.703", "5.803", "5.903"]
  },

  // ----------------------------------------
  // 3. 跳步 180度劈叉要求降组判定 (Leaps & Jumps Split Downgrades)
  // ----------------------------------------
  { 
    "element_category": "要求180°劈叉的跳步", 
    "fault_condition": "劈叉不足 > 45°", 
    "d_jury_actions": { "no_dv": true, "downgrade_to_other": false }, // 🟢 按照你的要求：直接不认难度
    "description": "劈叉严重不足超过45度，不予承认难度",
    "target_ids": [
      "1.101", "1.201", "1.301", "1.202", "1.302", "1.402", 
      "1.204", "1.304", "1.404", "1.205", "1.107", "1.207", 
      "1.307", "1.407", "1.108", "1.208", "1.109", "1.209", 
      "1.309", "1.409", "1.305", "1.405", "2.206"
    ]
  },
  { 
    "element_category": "高举腿立转 (带纵劈叉)", 
    "fault_condition": "劈叉不足 > 45° (B组降A组)", 
    "d_jury_actions": { "downgrade_to_other": true, "penalty": 0.1 },
    "description": "降为基本立转",
    "target_ids": ["2.203"]
  },
  { 
    "element_category": "高举腿立转 (带纵劈叉)", 
    "fault_condition": "劈叉不足 > 45° (D组降B组 / E组降C组)", 
    "d_jury_actions": { "downgrade_to_other": true, "penalty": 0.2 },
    "description": "降为低度数立转",
    "target_ids": ["2.403", "2.503"]
  },

  // ----------------------------------------
  // 4. 特定腿位立转专项降组 (Turns with specific leg positions)
  // ----------------------------------------
  { 
    "element_category": "特定腿位立转 (B组)", 
    "fault_condition": "自由腿未保持在规定位置 (B降A)", 
    "d_jury_actions": { "downgrade_to_other": true, "penalty": 0.1 },
    "description": "降为基本立转 (-0.1)",
    "target_ids": ["2.202"] // 水平腿
  },
  { 
    "element_category": "特定腿位立转 (C/D/E组)", 
    "fault_condition": "自由腿掉下 (C降A, D降B, E降B)", 
    "d_jury_actions": { "downgrade_to_other": true, "penalty": 0.2 },
    "description": "降为低价值立转 (-0.2)",
    "target_ids": ["2.402", "2.502", "2.204"] // 水平720, 阿提丢360
  },
  { 
    "element_category": "特定腿位立转 (E组强降)", 
    "fault_condition": "自由腿掉下 (E降B)", 
    "d_jury_actions": { "downgrade_to_other": true, "penalty": 0.3 }, // 阿提丢720降A组基本立转
    "description": "降为基本立转 (-0.3)",
    "target_ids": ["2.404"] 
  },

  // ----------------------------------------
  // 5. 其他跳步不认难度
  // ----------------------------------------
  { 
    "element_category": "团身/分腿/狼跳", 
    "fault_condition": "髋角或膝角 > 135°", 
    "d_jury_actions": { "no_dv": true, "downgrade_to_other": false }, // 🟢 直接不认难度
    "description": "严重变形，不承认难度",
    "target_ids": ["1.213", "1.313", "1.107", "1.307", "1.407", "1.108", "1.208", "1.105", "1.114", "1.214", "1.514"]
  }
];

window.d_jury_deductions = d_jury_deductions;