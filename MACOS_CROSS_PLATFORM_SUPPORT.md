# macOS Cross-Platform Support

This project now supports all macOS platforms, including both Apple Silicon (ARM64) and Intel (x64) Macs.

## 🎯 Problem Solved

The project previously encountered this error on macOS non-Apple Silicon systems:

```
Error: You installed esbuild for another platform than the one you're currently using.
This won't work because esbuild is written with native code and needs to
install a platform-specific binary executable.
```

## 🔧 Solution Implemented

### 1. Universal esbuild Support
- Added `esbuild-wasm` package for platform-independent builds
- Created `.npmrc` configuration for universal package installation
- Enhanced Vite configuration with platform detection

### 2. Enhanced Package.json Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "clean": "rm -rf node_modules package-lock.json .npm_cache",
    "reinstall": "npm run clean && npm install --force",
    "postinstall": "echo 'Installation complete. Running on architecture:' && uname -m"
  }
}
```

### 3. Platform-Aware Vite Configuration
The `vite.config.js` now includes:
- Automatic platform detection for macOS
- Optimized dependency management for cross-platform compatibility
- Enhanced build optimization

## 🚀 Quick Start on Any macOS

### For Fresh Installation:
```bash
# Clone the repository
git clone <repository-url>
cd learn_english

# Install and run (works on both ARM64 and x64)
npm run reinstall
npm run dev
```

### If You Already Have the Project:
```bash
# Navigate to client directory
cd client

# Clean and reinstall for universal support
npm run reinstall

# Start development
npm run dev
```

## 🍎 Platform Detection

The development server will now display platform information:

```
Running on: darwin (arm64)  # Apple Silicon Mac
🍎 macOS detected: Apple Silicon (ARM64)

OR

Running on: darwin (x64)    # Intel Mac
🍎 macOS detected: Intel (x64)
```

## 📋 Supported Platforms

✅ **macOS Apple Silicon (M1, M2, M3)** - ARM64 architecture
✅ **macOS Intel** - x64 architecture
✅ **Cross-development** - Development on one platform, deployment on another

## 🔍 Troubleshooting

### If you encounter architecture issues:

1. **Clean Installation:**
   ```bash
   cd client
   npm run clean
   npm install --force
   ```

2. **Check Your Architecture:**
   ```bash
   uname -m  # Should show 'arm64' or 'x64'
   ```

3. **Verify Node.js Installation:**
   ```bash
   node --version
   npm --version
   ```
   - Use the official Node.js installer from [nodejs.org](https://nodejs.org/)
   - Avoid using Rosetta 2 when possible

### Performance Note

- The `esbuild-wasm` package provides universal compatibility
- While slightly slower than native builds, it ensures consistent behavior across platforms
- Production builds are optimized for performance regardless of development platform

## 📁 Modified Files

- `client/package.json` - Added esbuild-wasm and scripts
- `client/.npmrc` - Universal npm configuration
- `client/vite.config.js` - Platform-aware build configuration
- `MACOS_CROSS_PLATFORM_SUPPORT.md` - This documentation

## 🎉 Result

The English learning system now runs seamlessly on:
- MacBook Air/Pro with Apple Silicon (M1/M2/M3)
- MacBook Air/Pro with Intel processors
- Mac mini, iMac, and Mac Pro (both ARM64 and Intel)
- Cross-platform development environments

No more esbuild architecture errors! 🚀