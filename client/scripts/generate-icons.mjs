#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 创建一个简单的绿色PNG图标 (单色192x192)
const createSimplePNG = (size) => {
  // 创建一个简单的PNG文件头和数据
  // 这是一个最小的有效PNG文件（绿色方块 #4CAF50）

  const width = size;
  const height = size;

  // PNG文件签名
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // 创建一个简单的IHDR块 (图像头)
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8);      // 位深度
  ihdr.writeUInt8(2, 9);      // 颜色类型 (RGB)
  ihdr.writeUInt8(0, 10);     // 压缩方法
  ihdr.writeUInt8(0, 11);     // 过滤方法
  ihdr.writeUInt8(0, 12);     // 交错方法

  // CRC计算函数
  const crc32 = (data) => {
    let crc = 0xffffffff;
    for (let i = 0; i < data.length; i++) {
      crc = crc ^ data[i];
      for (let j = 0; j < 8; j++) {
        crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
      }
    }
    return (crc ^ 0xffffffff) >>> 0;
  };

  // 创建IHDR块
  const ihdrChunk = Buffer.concat([
    Buffer.from([0, 0, 0, 13]),                    // 块长度
    Buffer.from('IHDR'),                            // 块类型
    ihdr,                                           // 块数据
    Buffer.alloc(4)                                 // CRC占位符
  ]);
  ihdrChunk.writeUInt32BE(crc32(ihdrChunk.slice(4, 17)), 17);

  // 简单的绿色像素数据（#4CAF50）
  // R:76, G:175, B:80
  const pixelData = [];
  for (let y = 0; y < height; y++) {
    pixelData.push(0); // 过滤类型
    for (let x = 0; x < width; x++) {
      pixelData.push(76, 175, 80); // RGB
    }
  }

  // 压缩像素数据 (使用zlib压缩)
  const zlib = require('zlib');
  const imageData = Buffer.from(pixelData);
  const compressedData = require('zlib').deflateSync(imageData);

  // 创建IDAT块
  const idatChunk = Buffer.concat([
    Buffer.from([0, 0, 0, compressedData.length]),  // 块长度
    Buffer.from('IDAT'),                             // 块类型
    compressedData,                                  // 块数据
    Buffer.alloc(4)                                  // CRC占位符
  ]);
  idatChunk.writeUInt32BE(crc32(idatChunk.slice(4, idatChunk.length - 4)), idatChunk.length - 4);

  // 创建IEND块
  const iendChunk = Buffer.concat([
    Buffer.from([0, 0, 0, 0]),                      // 块长度
    Buffer.from('IEND'),                             // 块类型
    Buffer.alloc(4)                                  // CRC
  ]);
  iendChunk.writeUInt32BE(crc32(iendChunk.slice(4, 8)), 8);

  // 合并所有块
  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
};

// 生成图标
const publicDir = path.join(__dirname, '../public');
const sizes = [96, 192, 512];

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

console.log('生成PWA图标...');

try {
  sizes.forEach(size => {
    const buffer = createSimplePNG(size);
    if (buffer) {
      fs.writeFileSync(path.join(publicDir, `icon-${size}.png`), buffer);
      fs.writeFileSync(path.join(publicDir, `icon-${size}-maskable.png`), buffer);
      console.log(`✓ 生成 icon-${size}.png`);
    }
  });

  // 生成苹果Touch Icon
  const buffer = createSimplePNG(180);
  if (buffer) {
    fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), buffer);
    console.log('✓ 生成 apple-touch-icon.png');
  }

  console.log('\n✓ PWA 图标生成完成！');
  console.log('现在可以运行: npm run build 来构建PWA应用');
} catch (error) {
  console.error('✗ 生成图标失败:', error.message);
  console.log('\n提示：可以使用在线工具生成PNG图标：');
  console.log('1. 访问 https://realfavicongenerator.net/');
  console.log('2. 上传一个图像，生成图标');
  console.log('3. 将生成的图标放到 client/public/ 文件夹');
  process.exit(1);
}
