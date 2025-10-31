# 🚀 Quick Start Guide - Build APK in 5 Minutes

## Step 1: Install Android Studio
Download and install: https://developer.android.com/studio

## Step 2: Update Web App URL
Open `app/src/main/java/com/mpumpcalc/MainActivity.java`

Change line 26:
```java
private static final String APP_URL = "https://YOUR-VERCEL-URL.vercel.app";
```

## Step 3: Update SDK Path
Open `local.properties`

Set your Android SDK location:
```
sdk.dir=C:\\Users\\YourUsername\\AppData\\Local\\Android\\Sdk
```

## Step 4: Open in Android Studio
1. Launch Android Studio
2. Click "Open" → Select `android` folder
3. Wait for Gradle sync (first time takes 5-10 minutes)

## Step 5: Build APK
### For Testing (Debug APK)
- Build → Build Bundle(s) / APK(s) → Build APK(s)
- APK saved in: `app/build/outputs/apk/debug/app-debug.apk`

### For Release (Production APK)
First, create signing key:
```bash
keytool -genkey -v -keystore mpump-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias mpump
```

Then:
- Build → Generate Signed Bundle / APK
- Select APK
- Create new keystore (or select existing)
- Build "release" variant

## Step 6: Install APK
### On Phone
1. Transfer APK to phone
2. Enable "Install from Unknown Sources"
3. Tap APK file to install

### Using USB
1. Enable Developer Options + USB Debugging on phone
2. Connect phone via USB
3. Run → Run 'app'
4. Select your device

## 🎉 Done!

Your APK is ready. Share it with users or upload to Play Store.

## 🔧 Common Issues

**Gradle Sync Failed?**
- File → Invalidate Caches → Restart

**Can't find SDK?**
- Android Studio → Preferences → Appearance & Behavior → System Settings → Android SDK
- Copy path and paste in `local.properties`

**APK won't install?**
- Enable "Install from Unknown Sources" in phone settings
- Check minSdk (needs Android 7.0+)

**WebView shows blank screen?**
- Check APP_URL is correct
- Test URL in Chrome browser first
- Check internet permission in AndroidManifest.xml

## 📦 APK Locations

**Debug APK:**
`android/app/build/outputs/apk/debug/app-debug.apk`

**Release APK:**
`android/app/build/outputs/apk/release/app-release.apk`

## 🎨 Before Distributing

1. Add your app icon (right-click `res` → New → Image Asset)
2. Change app name in `res/values/strings.xml`
3. Test on real device
4. Test PDF download feature
5. Test back button navigation

## 💡 Remember

- **Web app updates** = No APK rebuild needed
- **Only rebuild APK** when changing:
  - App name
  - App icon
  - App URL
  - Android configurations
  - Version number
