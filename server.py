#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
体操动作库 - 后端服务器
处理视频上传（直接通过，双槽位机制）
"""

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import shutil
import re
from datetime import datetime

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CARDVIDEOS_DIR = os.path.join(BASE_DIR, 'cards', 'cardvideos')
DATA_JS = os.path.join(BASE_DIR, 'data.js')

os.makedirs(CARDVIDEOS_DIR, exist_ok=True)

def format_id_for_filename(skill_id):
    """把 id 中的点和横线替换为下划线"""
    return skill_id.replace('.', '_').replace('-', '_')

def get_skill_videos(skill_id):
    """从 data.js 获取某个动作的视频列表（兼容新旧格式）"""
    with open(DATA_JS, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 查找这个 id 的对象
    pattern = rf'id:\s*["\']{re.escape(skill_id)}["\']([^}}]*?)(?:}}|,)\s*$'
    
    videos = []
    
    # 先尝试找 videos 数组格式
    # 先找到这个 id 的整个对象
    obj_pattern = rf'id:\s*["\']{re.escape(skill_id)}["\']([^}}]+)}}'
    obj_match = re.search(obj_pattern, content, re.DOTALL)
    if obj_match:
        obj_content = obj_match.group(0)
        
        # 看看有没有 videos 数组
        videos_pattern = r'videos:\s*\[(.*?)\]'
        videos_match = re.search(videos_pattern, obj_content, re.DOTALL)
        if videos_match:
            # 提取每个视频对象
            video_objs = re.findall(r'\{[^}]*\}', videos_match.group(1))
            for vo in video_objs:
                # 提取 src
                src_match = re.search(r'src:\s*["\']([^"\']+)["\']', vo)
                src = src_match.group(1) if src_match else ''
                if src:
                    athlete_match = re.search(r'athlete:\s*["\']([^"\']*)["\']', vo)
                    athlete = athlete_match.group(1) if athlete_match else ''
                    country_match = re.search(r'country:\s*["\']([^"\']*)["\']', vo)
                    country = country_match.group(1) if country_match else ''
                    uploaded_by_match = re.search(r'uploadedBy:\s*["\']([^"\']*)["\']', vo)
                    uploaded_by = uploaded_by_match.group(1) if uploaded_by_match else 'admin'
                    videos.append({
                        'src': src,
                        'athlete': athlete,
                        'country': country,
                        'uploadedBy': uploaded_by
                    })
    
    # 如果没找到 videos，尝试找旧的 video 格式
    if not videos:
        video_pattern = rf'id:\s*["\']{re.escape(skill_id)}["\'][^}}]*?(video:\s*(?:".*?"|\{{[^}}]*\}}))'
        video_match = re.search(video_pattern, content, re.DOTALL)
        if video_match:
            video_str = video_match.group(1)
            if video_str.startswith('video: "'):
                # 简单字符串
                src = re.search(r'"([^"]+)"', video_str).group(1)
                videos = [{
                    'src': src,
                    'athlete': '',
                    'country': '',
                    'uploadedBy': 'admin'
                }]
            elif video_str.startswith('video: {'):
                # 对象格式
                src_match = re.search(r'src:\s*["\']([^"\']+)["\']', video_str)
                src = src_match.group(1) if src_match else ''
                if src:
                    athlete_match = re.search(r'athlete:\s*["\']([^"\']*)["\']', video_str)
                    athlete = athlete_match.group(1) if athlete_match else ''
                    country_match = re.search(r'country:\s*["\']([^"\']*)["\']', video_str)
                    country = country_match.group(1) if country_match else ''
                    videos = [{
                        'src': src,
                        'athlete': athlete,
                        'country': country,
                        'uploadedBy': 'admin'
                    }]
    
    return videos

@app.route('/')
def index():
    return send_from_directory(BASE_DIR, 'index.html')

@app.route('/admin')
def admin():
    return send_from_directory(BASE_DIR, 'index.html')  # 不需要管理后台了

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(BASE_DIR, path)

@app.route('/api/upload_direct', methods=['POST'])
def upload_video_direct():
    """直接上传视频，不需要审核"""
    if 'video' not in request.files:
        return jsonify({'success': False, 'error': '没有上传文件'}), 400
    
    file = request.files['video']
    skill_id = request.form.get('skill_id', '')
    athlete = request.form.get('athlete', '未知运动员')
    country = request.form.get('country', '未知国家')
    uploaded_by = request.form.get('uploaded_by', '匿名')
    
    if file.filename == '':
        return jsonify({'success': False, 'error': '没有选择文件'}), 400
    
    # 获取现有视频数量
    existing_videos = get_skill_videos(skill_id)
    if len(existing_videos) >= 2:
        return jsonify({'success': False, 'error': '视频槽位已满'}), 400
    
    # 保存文件
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    ext = os.path.splitext(file.filename)[1]
    formatted_id = format_id_for_filename(skill_id)
    formatted_athlete = athlete.replace(' ', '_')
    new_filename = f"{formatted_id}_{formatted_athlete}_{country.upper()}_{timestamp}{ext}"
    filepath = os.path.join(CARDVIDEOS_DIR, new_filename)
    
    file.save(filepath)
    
    # 更新 data.js
    update_data_js_videos(skill_id, new_filename, athlete, country, uploaded_by)
    
    return jsonify({'success': True, 'filename': new_filename})

def update_data_js_videos(skill_id, video_filename, athlete, country, uploaded_by):
    """更新 data.js，添加视频到 videos 数组"""
    with open(DATA_JS, 'r', encoding='utf-8') as f:
        content = f.read()
    
    video_entry = f'''{{
            src: "./cards/cardvideos/{video_filename}",
            athlete: "{athlete}",
            country: "{country.upper()}",
            uploadedBy: "{uploaded_by}"
        }}'''
    
    # 查找这个 id 的对象，看有没有 videos 数组
    # 先找到这个 id 所在的位置
    id_pattern = rf'id:\s*["\']{re.escape(skill_id)}["\']'
    id_match = re.search(id_pattern, content)
    if not id_match:
        return
    
    # 找到这个 id 的整个对象
    obj_start = id_match.start()
    # 向前找到 {
    i = obj_start
    brace_count = 0
    while i > 0:
        if content[i] == '}':
            brace_count -= 1
        elif content[i] == '{':
            brace_count += 1
            if brace_count == 1:
                obj_start_pos = i
                break
        i -= 1
    else:
        return
    
    # 向后找到 }
    i = obj_start
    brace_count = 0
    obj_end_pos = len(content)
    while i < len(content):
        if content[i] == '{':
            brace_count += 1
        elif content[i] == '}':
            brace_count -= 1
            if brace_count == 0:
                obj_end_pos = i + 1
                break
        i += 1
    
    obj_content = content[obj_start_pos:obj_end_pos]
    
    # 检查是否已经有 videos 数组
    videos_match = re.search(r'videos:\s*\[(.*?)\]', obj_content, re.DOTALL)
    
    if videos_match:
        # 已有 videos 数组，添加新的视频
        existing_videos_str = videos_match.group(1)
        
        # 数一下现有多少个（不算空的）
        existing_count = len(re.findall(r'src:', existing_videos_str))
        
        if existing_count >= 2:
            return  # 已满，不添加
        
        new_videos_str = existing_videos_str.strip()
        if new_videos_str and not new_videos_str.endswith(','):
            new_videos_str += ','
        
        # 计算缩进
        indent_match = re.search(r'(\s*)videos:', obj_content)
        indent = indent_match.group(1) if indent_match else '            '
        
        new_videos_str += f"\n{indent}    {video_entry}"
        new_videos_field = f"videos: [{new_videos_str}\n{indent}]"
        
        # 替换
        new_obj_content = re.sub(r'videos:\s*\[.*?\]', new_videos_field, obj_content, flags=re.DOTALL)
    else:
        # 没有 videos 数组，看看有没有旧的 video 字段
        # 如果有旧的 video 字段，把它移到 videos 数组的第 0 位
        video_match = re.search(r',?\s*video:\s*(?:"([^"]+)"|\{[^}]*\})', obj_content, re.DOTALL)
        
        first_video_str = None
        
        if video_match:
            video_str = video_match.group(0)
            video_content = video_match.group(1) or video_match.group(2)
            
            if video_content.startswith('"'):
                # 旧的字符串格式
                src = video_content.strip('"')
                first_video_str = f'''{{
            src: "{src}",
            athlete: "",
            country: "",
            uploadedBy: "admin"
        }}'''
            elif video_content.startswith('{'):
                # 旧的对象格式
                src_match = re.search(r'src:\s*["\']([^"\']+)["\']', video_content)
                src = src_match.group(1) if src_match else ''
                athlete_match = re.search(r'athlete:\s*["\']([^"\']*)["\']', video_content)
                athlete_v = athlete_match.group(1) if athlete_match else ''
                country_match = re.search(r'country:\s*["\']([^"\']*)["\']', video_content)
                country_v = country_match.group(1) if country_match else ''
                
                first_video_str = f'''{{
            src: "{src}",
            athlete: "{athlete_v}",
            country: "{country_v}",
            uploadedBy: "admin"
        }}'''
            
            # 删除旧的 video 字段
            obj_content = re.sub(r',?\s*video:\s*(?:"[^"]+"|\{[^}]*\})', '', obj_content)
        
        # 构建新的 videos 数组
        videos_entries = []
        if first_video_str:
            videos_entries.append(first_video_str)
        videos_entries.append(video_entry)
        
        # 计算缩进
        # 找一下 image 字段的缩进
        indent_match = re.search(r'(\s*)image:', obj_content)
        indent = indent_match.group(1) if indent_match else '            '
        
        joined_videos = (',\n' + indent).join(videos_entries)
        videos_field = f'''
            videos: [
                {joined_videos}
            ]'''
        
        # 找到插入位置（在 image 后面）
        if 'image:' in obj_content:
            # 在 image 后面插入
            image_match = re.search(r'image:\s*["\'][^"\']+["\']', obj_content)
            if image_match:
                new_obj_content = (obj_content[:image_match.end()] + 
                                  videos_field + 
                                  obj_content[image_match.end():])
            else:
                new_obj_content = obj_content
        else:
            new_obj_content = obj_content
    
    # 替换整个对象
    new_content = content[:obj_start_pos] + new_obj_content + content[obj_end_pos:]
    
    with open(DATA_JS, 'w', encoding='utf-8') as f:
        f.write(new_content)

if __name__ == '__main__':
    print("=" * 80)
    print("  体操动作库后端服务器")
    print("=" * 80)
    print("  主页面: http://localhost:5000")
    print("=" * 80)
    app.run(host='0.0.0.0', port=5000, debug=True)
