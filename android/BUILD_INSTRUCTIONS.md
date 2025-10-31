# M.Pump Calc Android App - Build Instructions

## ✅ Changes Applied

All your requested changes have been bundled into this Android app:

1. ✅ **Emergent logo removed** - No branding
2. ✅ **Page title updated** - "M.Pump Calc - Petrol Pump Calculator"
3. ✅ **Rate carry-forward** - Last changed date's rate applies to new dates
4. ✅ **Fuel type rate auto-update** - Rates auto-fill when selecting fuel
5. ✅ **Date-specific rates in dropdown** - Shows current rate in fuel selection
6. ✅ **Zero amount sales allowed** - Can add sales with same start/end reading

## 📱 App Configuration

**Type:** Offline Android App (WebView with bundled assets)
- Web files bundled in: `android/app/src/main/assets/`
- Loads from: `file:///android_asset/index.html`
- **Works without internet connection** ✅
- All data stored locally in WebView localStorage

## 🚀 How to Build APK in Android Studio

### Step 1: Open Project
1. Launch **Android Studio**
2. Click **File → Open**
3. Navigate to `/app/android` folder
4. Click **OK**
5. Wait for Gradle sync to complete

### Step 2: Configure Signing (Optional - for Release)
For Debug APK, skip to Step 3.

For Release APK:
1. Go to **Build → Generate Signed Bundle/APK**
2. Select **APK**
3. Create or use existing keystore
4. Fill in key details

### Step 3: Build APK

**Option A: Debug APK (for testing)**
1. Click **Build → Build Bundle(s) / APK(s) → Build APK(s)**
2. Wait for build to complete
3. Click **locate** in the notification
4. APK location: `android/app/build/outputs/apk/debug/app-debug.apk`

**Option B: Release APK (for distribution)**
1. Click **Build → Generate Signed Bundle/APK**
2. Select **APK** → Click **Next**
3. Select your keystore → Click **Next**
4. Choose **release** build variant
5. Check both signature versions (V1 and V2)
6. Click **Finish**
7. APK location: `android/app/build/outputs/apk/release/app-release.apk`

### Step 4: Install on Device

**Method 1: Using Android Studio**
1. Connect Android device via USB
2. Enable USB Debugging on device
3. Click **Run** (green play button) in Android Studio
4. Select your device
5. App will install and launch

**Method 2: Manual Installation**
1. Copy APK file to your Android device
2. Open APK file on device
3. Allow installation from unknown sources if prompted
4. Install the app

## 📋 Build Variants

- **Debug**: For testing, includes debugging info, larger size
- **Release**: For production, optimized and minified

## 🔧 Minimum Requirements

- **Minimum Android Version**: Android 7.0 (API 24)
- **Target Android Version**: Android 14 (API 34)
- **Permissions Required**:
  - Storage (for PDF export/import)
  - No internet permission needed (offline app)

## 📁 File Structure

```
android/
├── app/
│   ├── src/main/
│   │   ├── assets/           # ← Bundled web app files
│   │   │   ├── index.html
│   │   │   └── static/
│   │   │       ├── js/
│   │   │       └── css/
│   │   ├── java/com/mpumpcalc/
│   │   │   └── MainActivity.java
│   │   ├── res/
│   │   └── AndroidManifest.xml
│   └── build.gradle
├── build.gradle
└── BUILD_INSTRUCTIONS.md    # ← This file
```

## 🔄 Updating Web Content

When you make changes to the frontend:

1. **Build frontend:**
   ```bash
   cd /app/frontend
   yarn build
   ```

2. **Copy to Android assets:**
   ```bash
   rm -rf /app/android/app/src/main/assets/*
   cp -r /app/frontend/build/* /app/android/app/src/main/assets/
   ```

3. **Rebuild APK** in Android Studio

## ⚠️ Important Notes

1. **Relative Paths**: The frontend is built with `"homepage": "."` in package.json to use relative paths
2. **LocalStorage**: All app data (rates, sales, etc.) is stored in WebView localStorage
3. **Offline First**: App works completely offline after installation
4. **No Backend**: This is a standalone app - no server communication needed

## 🐛 Troubleshooting

**Issue: Blank screen after installation**
- Solution: Check Android Studio logcat for JavaScript errors
- Ensure file access permissions are enabled in MainActivity.java

**Issue: CSS/JS not loading**
- Solution: Verify assets folder contains all build files
- Check that paths in index.html are relative (./static/)

**Issue: LocalStorage not working**
- Solution: Ensure `setDomStorageEnabled(true)` is set in WebView settings
- Check that `setAllowFileAccessFromFileURLs(true)` is enabled

## 📱 Testing Checklist

Before releasing:
- [ ] Install APK on physical device
- [ ] Test all features (Reading Sales, Credit Sales, Inc/Exp, Rate)
- [ ] Verify data persistence (close and reopen app)
- [ ] Test PDF export functionality
- [ ] Check different Android versions (if possible)
- [ ] Verify offline functionality (airplane mode)

## 🎉 You're Ready!

Your Android app is now configured with all the latest changes and ready to build!

**Quick Start:**
1. Open `/app/android` in Android Studio
2. Wait for Gradle sync
3. Click Build → Build APK(s)
4. Install and test!
