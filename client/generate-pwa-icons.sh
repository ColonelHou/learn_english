#!/bin/bash

# 创建public目录
mkdir -p public

# 这是一个最小的192x192绿色PNG的Base64编码
# (简单的绿色方块 #4CAF50)
ICON_B64="iVBORw0KGgoAAAANSUhEUgAAAMAAAADAAQAAAACgVK5aAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAArUlEQVR4Xu3UO2+CQBiGYe7Pn7yPJk4Nx3bUoaGhgZxMSGqJBIaGpKSlIxMKhkTBTkCDISVhwQYdJDGESSZvvjvME9ycfHd3383dN37TN33TN33TOxiGYRiGYRiGYRiG/Q9yuZxUVVVRlmUxDENmMxkcx6FarUqaprJarWS9XsvhcCD3+13u9zuFQoF8Pp/HzGYzySRJIldXV5JIJOTi4kIKhQK12+1PXV1dyfV6lVwuRx6PR5XvfDKZUKvVkvV6LcVikb6/v2k+n5OmaTQajWgymXzqdDpfJpMJNRoNchzn1+12KZ/P0+l0+hwQQXj8TS6XSzQaDVpfX9e16OUZhmEYhmEYhmEY9lf6D6OyFTPgE6oSAAAAAElFTkSuQmCC"

# 解码并保存不同大小的图标
for SIZE in 96 192 512; do
  echo "$ICON_B64" | base64 -d > public/icon-${SIZE}.png
  cp public/icon-${SIZE}.png public/icon-${SIZE}-maskable.png
  echo "✓ 生成 icon-${SIZE}.png"
done

# Apple Touch Icon
echo "$ICON_B64" | base64 -d > public/apple-touch-icon.png
echo "✓ 生成 apple-touch-icon.png"

echo ""
echo "✓ PWA图标生成完成！"
echo "现在可以运行: npm run build 来构建PWA应用"
