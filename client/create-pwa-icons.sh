#!/bin/bash

# 创建public目录
mkdir -p public

# 使用Python创建简单的绿色PNG图标
python3 << 'PYTHON'
from PIL import Image, ImageDraw
import os

# 创建图标的函数
def create_icon(size, filename):
    # 创建绿色背景的图像
    img = Image.new('RGB', (size, size), color=(76, 175, 80))
    
    # 在图像上绘制白色文字
    draw = ImageDraw.Draw(img)
    
    # 尝试添加文字（如果Pillow有文字支持）
    text = "📚"
    try:
        # 使用emoji或简单的文本
        draw.text((size//4, size//4), text, fill=(255, 255, 255))
    except:
        pass
    
    img.save(filename)
    print(f"✓ 创建 {filename}")

# 生成不同大小的图标
sizes = [96, 180, 192, 512]
for size in sizes:
    if size == 180:
        create_icon(size, "public/apple-touch-icon.png")
    else:
        create_icon(size, f"public/icon-{size}.png")
        create_icon(size, f"public/icon-{size}-maskable.png")

print("\n✓ PWA图标生成完成！")
PYTHON

chmod +x create-pwa-icons.sh
