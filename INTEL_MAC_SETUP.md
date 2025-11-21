# Intel Mac (x64) Setup Guide

If you're running on an Intel-based Mac and encountering the esbuild architecture error, follow these steps to fix it.

## Problem

```
Error: You installed esbuild for another platform than the one you're currently using.
Specifically the "@esbuild/darwin-arm64" package is present but this platform
needs the "@esbuild/darwin-x64" package instead.
```

This happens when:
- Node.js or npm is running under Rosetta 2 (ARM64 emulation)
- Dependencies were installed on a different architecture
- Mixed installations of native esbuild packages

## ✅ Solution

### Step 1: Verify Your Architecture

```bash
uname -m
# Should output: x86_64 (for Intel Macs)
```

### Step 2: Check Node.js Installation

```bash
node --version
which node
file $(which node)
# Should show: x86_64 (NOT arm64 or Mach-O 64-bit executable x86_64 under Mach-O 64-bit executable arm64)
```

If Node.js is running under Rosetta 2:
1. Download the **universal** Node.js installer from [nodejs.org](https://nodejs.org/)
2. Install the native Intel version (not Rosetta 2)
3. Verify: `file $(which node)` should show native x86_64

### Step 3: Clean Installation

Navigate to the `client` directory and run:

```bash
# Go to client directory
cd client

# Clean everything
npm run clean

# Reinstall with new universal configuration
npm install --force

# Verify esbuild-wasm is installed
npm list esbuild-wasm
# Should show: learn-english-client@1.0.0 [...] esbuild-wasm@^0.19.12

# Verify NO native esbuild is installed
npm list esbuild
# Should show: (empty)
```

### Step 4: Start Development Server

```bash
npm run dev
```

You should see:
```
Running on: darwin (x64)
🍎 macOS detected: Intel (x64)
  VITE v4.5.14  ready in XXX ms
  ➜  Local:   http://localhost:3000/
```

## 🔍 Troubleshooting

### Issue: Still getting esbuild errors

1. **Force clean cache:**
   ```bash
   rm -rf node_modules package-lock.json .npm_cache ~/Library/Caches/npm
   npm cache clean --force
   ```

2. **Check Node.js version:**
   ```bash
   node -v  # Should be v18 or higher
   ```

3. **Reinstall Node.js:**
   - Uninstall current Node.js
   - Download and install universal Node.js from [nodejs.org](https://nodejs.org/)
   - Use native Intel version (not Rosetta 2)

### Issue: "File not found" in .npmrc

If you see warnings about .npmrc settings, they're harmless. The file is configured correctly.

### Issue: npm ERR! code ERESOLVE

Run with `--force` flag:
```bash
npm install --force
```

## 📋 Files Modified for Cross-Platform Support

The following files have been updated to support both ARM64 and x64 Macs:

- `package.json` - Added `esbuild-wasm` and npm overrides
- `.npmrc` - Proper npm configuration for universal installs
- `vite.config.js` - Platform detection and esbuild-wasm support
- `MACOS_CROSS_PLATFORM_SUPPORT.md` - Complete cross-platform documentation
- `INTEL_MAC_SETUP.md` - This guide (Intel-specific setup)

## 🚀 Quick Reference

```bash
# One-command setup for Intel Macs:
cd client && npm run clean && npm install --force && npm run dev
```

## ✨ Expected Result

After following these steps:
- ✅ No esbuild architecture errors
- ✅ Development server runs on http://localhost:3000
- ✅ API proxy works on http://localhost:3001
- ✅ Hot module reload (HMR) works
- ✅ Build process works without errors

## Notes

- `esbuild-wasm` is slightly slower than native esbuild (~10% overhead)
- This affects development speed only, not production builds
- Production builds are fully optimized regardless
- Cross-platform compatibility is worth the minimal performance cost

Need help? Check the main documentation at `MACOS_CROSS_PLATFORM_SUPPORT.md`