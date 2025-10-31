# M.Pump Calc Android App - Build Instructions

## 📱 Overview
This Android project wraps your M.Pump Calc web app in a native Android WebView for APK distribution.

## 🔧 Prerequisites

1. **Android Studio** (Latest version)
   - Download: https://developer.android.com/studio
   
2. **Java Development Kit (JDK) 11+**
   - Comes with Android Studio

3. **Android SDK**
   - Install via Android Studio SDK Manager
   - Minimum SDK: 24 (Android 7.0)
   - Target SDK: 34 (Android 14)

## 📁 Project Structure

```
android/
├── app/
│   ├── src/main/
│   │   ├── java/com/mpumpcalc/
│   │   │   └── MainActivity.java        # Main WebView Activity
│   │   ├── res/
│   │   │   ├── layout/
│   │   │   │   └── activity_main.xml    # Layout with WebView
│   │   │   ├── values/
│   │   │   │   ├── strings.xml          # App name
│   │   │   │   ├── colors.xml           # Theme colors
│   │   │   │   └── styles.xml           # App theme
│   │   │   └── xml/
│   │   │       └── file_paths.xml       # File provider paths
│   │   └── AndroidManifest.xml          # App configuration
│   ├── build.gradle                      # App-level Gradle
│   └── proguard-rules.pro               # ProGuard rules
├── build.gradle                          # Project-level Gradle
├── settings.gradle                       # Gradle settings
└── gradle.properties                     # Gradle properties
```

## 🚀 Setup Steps

### Step 1: Update Your Web App URL

Open `MainActivity.java` and update the APP_URL:

```java
private static final String APP_URL = "https://muro-alpha.vercel.app"; 
// Change to your actual deployed URL
```

### Step 2: Update Android SDK Path

Edit `local.properties` and set your Android SDK path:

```properties
sdk.dir=C:\\Users\\YourUsername\\AppData\\Local\\Android\\Sdk
```

To find your SDK path:
- Windows: `C:\Users\YourUsername\AppData\Local\Android\Sdk`
- Mac: `/Users/YourUsername/Library/Android/sdk`
- Linux: `/home/YourUsername/Android/Sdk`

### Step 3: Add App Icon

1. Create your app icon (512x512 PNG)
2. Use Android Studio's Image Asset tool:
   - Right-click `res` folder → New → Image Asset
   - Select "Launcher Icons (Adaptive and Legacy)"
   - Upload your icon
   - Click "Next" → "Finish"

### Step 4: Generate Signing Key (For Release APK)

Open terminal in Android Studio:

```bash
keytool -genkey -v -keystore mpump-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias mpump-key
```

Follow prompts to set password and details.

### Step 5: Configure Signing (Optional for Release)

Create `android/app/keystore.properties`:

```properties
storePassword=your_store_password
keyPassword=your_key_password
keyAlias=mpump-key
storeFile=mpump-release-key.jks
```

Update `app/build.gradle`:

```gradle
android {
    signingConfigs {
        release {
            def keystorePropertiesFile = rootProject.file("keystore.properties")
            def keystoreProperties = new Properties()
            keystoreProperties.load(new FileInputStream(keystorePropertiesFile))

            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
            storeFile file(keystoreProperties['storeFile'])
            storePassword keystoreProperties['storePassword']
        }
    }
    
    buildTypes {
        release {
            signingConfig signingConfigs.release
            // ... rest of config
        }
    }
}
```

## 🏗️ Building the APK

### Option 1: Using Android Studio (Recommended)

1. **Open Project**
   - Launch Android Studio
   - File → Open → Select `android` folder
   - Wait for Gradle sync to complete

2. **Build Debug APK** (for testing)
   - Build → Build Bundle(s) / APK(s) → Build APK(s)
   - APK location: `android/app/build/outputs/apk/debug/app-debug.apk`

3. **Build Release APK** (for distribution)
   - Build → Generate Signed Bundle / APK
   - Select "APK"
   - Choose your keystore
   - Select "release" build variant
   - APK location: `android/app/build/outputs/apk/release/app-release.apk`

### Option 2: Using Command Line

```bash
# Navigate to android folder
cd android

# Build Debug APK
./gradlew assembleDebug

# Build Release APK (requires signing config)
./gradlew assembleRelease

# Clean build
./gradlew clean
```

## 📦 App Features

### ✅ Enabled Features

- **Full WebView with JavaScript**
- **LocalStorage support** (for offline data)
- **IndexedDB support** (for auto-backup folder)
- **PDF Downloads** (direct to Downloads folder)
- **File System Access** (for backup/export)
- **Back button navigation**
- **Orientation lock** (portrait mode)
- **Status bar** (white with black text)
- **Hardware acceleration**
- **Offline caching**

### 🔐 Permissions

- `INTERNET` - Load web app
- `ACCESS_NETWORK_STATE` - Check connectivity
- `WRITE_EXTERNAL_STORAGE` - Download PDFs
- `READ_EXTERNAL_STORAGE` - Access downloads
- `DOWNLOAD_WITHOUT_NOTIFICATION` - Silent downloads

## 🎨 Customization

### Change App Name

Edit `res/values/strings.xml`:
```xml
<string name="app_name">Your App Name</string>
```

### Change Theme Colors

Edit `res/values/colors.xml`:
```xml
<color name="colorPrimary">#2563EB</color>
<color name="colorPrimaryDark">#1E40AF</color>
<color name="colorAccent">#3B82F6</color>
```

### Change Package Name

1. In `build.gradle`: Update `applicationId`
2. In `AndroidManifest.xml`: Update `package`
3. Rename folder: `java/com/mpumpcalc/` → `java/com/yourcompany/yourapp/`
4. Update imports in MainActivity.java

## 🐛 Troubleshooting

### Gradle Sync Failed
- File → Invalidate Caches / Restart
- File → Sync Project with Gradle Files

### APK Won't Install
- Check minSdkVersion (24 = Android 7.0)
- Enable "Install from Unknown Sources" on device

### WebView Blank/Not Loading
- Check `APP_URL` is correct
- Check internet permission in manifest
- Check HTTPS certificate is valid

### PDF Download Not Working
- Grant storage permissions
- Check DownloadManager is enabled
- Test on Android 10+ with scoped storage

## 📱 Testing

### On Emulator
1. Tools → AVD Manager → Create Virtual Device
2. Run → Run 'app'
3. Select emulator

### On Physical Device
1. Enable Developer Options on device
2. Enable USB Debugging
3. Connect device via USB
4. Run → Run 'app'
5. Select device

### Install APK Directly
```bash
adb install app-release.apk
```

## 📊 APK Size Optimization

Current setup includes:
- ProGuard enabled (minify + shrink)
- Unused resources removed
- Code optimization enabled

Typical APK size: **5-15 MB**

## 🔄 Updates

To update the app:
1. Update `versionCode` and `versionName` in `build.gradle`
2. Rebuild APK
3. Distribute new APK

Example:
```gradle
versionCode 2      // Increment for each release
versionName "1.1.0"
```

## 📋 Checklist Before Release

- [ ] Updated APP_URL to production URL
- [ ] Added app icon (all sizes)
- [ ] Created signing key
- [ ] Updated version code/name
- [ ] Tested on multiple devices
- [ ] Tested PDF download
- [ ] Tested back button navigation
- [ ] Tested offline mode (if applicable)
- [ ] Reviewed permissions
- [ ] Built release APK
- [ ] Tested release APK installation

## 🚀 Distribution

### Google Play Store
1. Create Developer Account ($25 one-time fee)
2. Upload APK/AAB
3. Fill store listing details
4. Submit for review

### Direct Distribution
1. Share APK file directly
2. Users must enable "Install from Unknown Sources"

## 📞 Support

For issues:
1. Check Android Studio Logcat for errors
2. Enable "Show logcat" in WebView
3. Test in Chrome browser first
4. Check device compatibility

## ⚡ Pro Tips

1. **Test on Real Device** - Emulators don't fully represent real performance
2. **Enable Minify** - Reduces APK size significantly
3. **Test All Android Versions** - Especially Android 10+ (scoped storage)
4. **Monitor Memory** - WebView can consume significant memory
5. **Cache Assets** - Enable app cache for faster loading

## 📝 Notes

- This WebView app loads your deployed web app (Vercel)
- All app logic runs in the web app
- Native features (PDF download, file access) are handled by MainActivity
- Update web app → Changes reflect in Android app immediately (no rebuild needed)
- Only rebuild APK when changing native Android code or configurations
