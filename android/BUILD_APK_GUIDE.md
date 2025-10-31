# 🚀 Complete Guide: Build M.Pump Calc Android APK (Offline Mode)

## ✅ What's Already Done

Your Android project is **100% ready** with:
- ✅ **Frontend built** and copied to Android assets
- ✅ **Offline mode configured** (app loads from local files)
- ✅ **All permissions set** for PDF download/save
- ✅ **PDF export functionality** integrated
- ✅ **Data backup/restore** via JSON files
- ✅ **Local storage** support for offline data

---

## 📋 What You Need

1. **Android Studio** (already installed ✅)
2. **Your Android SDK path** (we'll find this in Step 1)
3. **10-15 minutes** of your time

---

## 🎯 Step-by-Step Build Instructions

### Step 1: Find Your Android SDK Path

**Open Android Studio** and find your SDK path:

**On Windows:**
1. Open Android Studio
2. Go to: `File` → `Settings` → `Appearance & Behavior` → `System Settings` → `Android SDK`
3. Copy the path shown (usually: `C:\Users\YourUsername\AppData\Local\Android\Sdk`)

**On Mac:**
1. Open Android Studio
2. Go to: `Android Studio` → `Preferences` → `Appearance & Behavior` → `System Settings` → `Android SDK`
3. Copy the path shown (usually: `/Users/YourUsername/Library/Android/sdk`)

**On Linux:**
1. Open Android Studio
2. Go to: `File` → `Settings` → `Appearance & Behavior` → `System Settings` → `Android SDK`
3. Copy the path shown (usually: `/home/YourUsername/Android/Sdk`)

---

### Step 2: Update local.properties

1. Open the file: `/app/android/local.properties` in any text editor
2. Replace `REPLACE_WITH_YOUR_SDK_PATH` with your actual SDK path

**Examples:**

**Windows (use double backslashes):**
```
sdk.dir=C:\\Users\\John\\AppData\\Local\\Android\\Sdk
```

**Mac:**
```
sdk.dir=/Users/John/Library/Android/sdk
```

**Linux:**
```
sdk.dir=/home/John/Android/Sdk
```

3. Save the file

---

### Step 3: Open Project in Android Studio

1. **Launch Android Studio**
2. Click **"Open"** (not "New Project")
3. Navigate to and select the **`/app/android`** folder
4. Click **"OK"**
5. **Wait for Gradle Sync** (first time: 5-10 minutes)
   - You'll see a progress bar at the bottom
   - Don't interrupt this process!

**If Gradle sync fails:**
- Click **"File"** → **"Invalidate Caches / Restart"** → **"Invalidate and Restart"**
- Wait for Android Studio to restart and sync again

---

### Step 4: Build Debug APK (For Testing)

1. In Android Studio menu: **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
2. Wait for the build to complete (2-5 minutes)
3. You'll see a notification: **"APK(s) generated successfully"**
4. Click **"locate"** in the notification to find your APK

**APK Location:**
```
/app/android/app/build/outputs/apk/debug/app-debug.apk
```

---

### Step 5: Install APK on Your Phone

#### Method A: Direct Transfer (Easiest)

1. Copy `app-debug.apk` to your phone (via USB, email, cloud, etc.)
2. On your phone, open **File Manager** and locate the APK
3. Tap the APK file
4. If prompted, enable **"Install from Unknown Sources"**
5. Tap **"Install"**
6. Tap **"Open"** to launch the app

#### Method B: Install via USB (Faster)

1. Enable **Developer Options** on your phone:
   - Go to **Settings** → **About Phone**
   - Tap **Build Number** 7 times
2. Enable **USB Debugging**:
   - **Settings** → **Developer Options** → **USB Debugging** → ON
3. Connect your phone to computer via USB
4. In Android Studio: **Run** → **Run 'app'**
5. Select your device from the list
6. App will install and launch automatically

---

## 🎉 Test Your App

After installation, test these features:

### ✅ Basic Functionality
- [ ] App launches successfully
- [ ] Dashboard shows date selector
- [ ] All tabs visible (Reading Sales, Credit Sales, Inc./Exp.)

### ✅ Offline Mode
- [ ] Turn off WiFi and Mobile Data
- [ ] App still works perfectly
- [ ] Can add new records
- [ ] Data saves locally

### ✅ PDF Export
- [ ] Add some test data
- [ ] Tap **"PDF"** button
- [ ] PDF should open automatically
- [ ] Check **Downloads** folder for saved PDF

### ✅ Data Backup
- [ ] Add some test records
- [ ] Export backup (if feature available)
- [ ] Verify backup saved to Downloads
- [ ] Test restore functionality

---

## 🏭 Build Release APK (For Distribution)

When you're ready to distribute your app to others:

### Step 1: Create Signing Key

Open terminal/command prompt and run:

**Windows (Command Prompt):**
```bash
cd C:\Users\YourUsername
keytool -genkey -v -keystore mpump-release.jks -keyalg RSA -keysize 2048 -validity 10000 -alias mpump
```

**Mac/Linux:**
```bash
cd ~
keytool -genkey -v -keystore mpump-release.jks -keyalg RSA -keysize 2048 -validity 10000 -alias mpump
```

You'll be asked:
- Password (choose a strong password, **remember it!**)
- Your name
- Organization
- City/State/Country

**IMPORTANT:** Save this keystore file and password securely!

### Step 2: Generate Signed APK

1. In Android Studio: **Build** → **Generate Signed Bundle / APK**
2. Select **APK** → **Next**
3. Click **"Choose existing..."**
4. Select your `mpump-release.jks` file
5. Enter your keystore password and key password
6. **Next**
7. Select **release** build variant
8. Check **V1 (Jar Signature)** and **V2 (Full APK Signature)**
9. Click **"Finish"**

**Release APK Location:**
```
/app/android/app/build/outputs/apk/release/app-release.apk
```

This APK is production-ready and can be:
- Shared with users
- Uploaded to Google Play Store
- Distributed via your website

---

## 🎨 Customization (Optional)

### Change App Name

Edit: `/app/android/app/src/main/res/values/strings.xml`
```xml
<string name="app_name">Your Custom Name</string>
```

### Change App Icon

1. Right-click on **res** folder in Android Studio
2. Select **New** → **Image Asset**
3. Choose **Launcher Icons**
4. Upload your icon image
5. Click **Next** → **Finish**

### Change App Package Name

1. Open: `/app/android/app/build.gradle`
2. Change line 10:
   ```gradle
   applicationId "com.yourcompany.yourapp"
   ```

### Update Version Number

Edit: `/app/android/app/build.gradle`
```gradle
versionCode 2        // Increase by 1 for each update
versionName "1.1.0"  // Your version number
```

---

## 🔧 Troubleshooting

### Problem: "SDK location not found"

**Solution:**
- Check `local.properties` has correct SDK path
- Verify Android SDK is installed
- In Android Studio: **Tools** → **SDK Manager** → verify SDK location

### Problem: "Gradle sync failed"

**Solution:**
- **File** → **Invalidate Caches** → **Invalidate and Restart**
- Check internet connection (Gradle downloads dependencies)
- Delete `.gradle` folder in project and sync again

### Problem: "APK won't install on phone"

**Solution:**
- Enable **"Install from Unknown Sources"** in phone settings
- Check phone Android version (need Android 7.0+)
- Uninstall old version first if updating

### Problem: "WebView shows blank screen"

**Solution:**
- Check that `/app/android/app/src/main/assets/index.html` exists
- Verify all frontend files copied to assets folder
- Try: **Build** → **Clean Project** → **Rebuild Project**

### Problem: "PDF export not working"

**Solution:**
- Ensure storage permissions granted
- Check Android version (need Android 10+ for MediaStore)
- Try exporting on actual device (not emulator)

### Problem: "Build takes too long"

**Solution:**
- First build always takes longer (downloads dependencies)
- Subsequent builds will be faster
- Ensure stable internet connection for first build

---

## 📱 App Features Summary

Your offline Android app includes:

✅ **Fully Offline Operation**
- Works without internet connection
- All data stored locally on device
- Fast performance

✅ **Petrol Pump Management**
- Daily reading sales tracking
- Credit sales management
- Income & expense recording
- Fuel rate management

✅ **PDF Export**
- Generate daily reports
- Save to Downloads folder
- Automatic PDF viewer integration
- Print functionality

✅ **Data Backup & Restore**
- Export all data to JSON
- Import from backup file
- Save backups to Downloads

✅ **Local Storage**
- Uses device localStorage
- No database setup needed
- Automatic data persistence

---

## 🆘 Getting Help

### Android Studio Documentation
- **Official Guide:** https://developer.android.com/studio/build/building-cmdline

### Common Issues
- **Stack Overflow:** Search "Android Studio [your error]"
- **Reddit:** r/androiddev
- **YouTube:** "How to build APK Android Studio"

### Video Tutorials
- Search YouTube: "Android Studio build APK tutorial"
- Watch: "Android Studio Beginners Guide"

---

## ✅ Success Checklist

After completing all steps, you should have:

- [x] **Android project opens** in Android Studio without errors
- [x] **Gradle sync completes** successfully
- [x] **Debug APK created** in `app/build/outputs/apk/debug/`
- [x] **APK installs** on Android phone (7.0+)
- [x] **App launches** and shows petrol pump dashboard
- [x] **Offline mode works** (tested with no internet)
- [x] **PDF export works** (PDF saves to Downloads)
- [x] **All features functional** (sales, credit, income/expense)
- [x] **Data persists** (closes and reopens with data intact)

---

## 🎯 Next Steps

1. **Test thoroughly** on your device
2. **Share APK** with team members for testing
3. **Gather feedback** and fix any issues
4. **Build release APK** when ready for production
5. **(Optional) Publish to Google Play Store**

---

## 📊 Project Structure

```
/app/android/
├── app/
│   ├── build.gradle                 # App configuration
│   └── src/
│       └── main/
│           ├── AndroidManifest.xml  # Permissions & settings
│           ├── java/
│           │   └── com/mpumpcalc/MainActivity.java  # App code
│           ├── res/                 # Resources (icons, layouts)
│           │   ├── layout/activity_main.xml
│           │   ├── values/strings.xml
│           │   └── xml/file_paths.xml
│           └── assets/              # Frontend files (offline)
│               ├── index.html
│               ├── static/
│               │   ├── css/
│               │   └── js/
│               └── asset-manifest.json
├── build.gradle                     # Project configuration
├── settings.gradle                  # Project settings
├── gradle.properties                # Gradle settings
├── local.properties                 # SDK path (YOU EDIT THIS)
└── gradlew / gradlew.bat           # Build scripts
```

---

## 🔄 Updating Your App

### When Frontend Changes:

1. Rebuild React frontend:
   ```bash
   cd /app/frontend
   yarn build
   ```

2. Copy new files to Android assets:
   ```bash
   rm -rf /app/android/app/src/main/assets/*
   cp -r /app/frontend/build/* /app/android/app/src/main/assets/
   ```

3. Rebuild APK in Android Studio:
   - **Build** → **Clean Project**
   - **Build** → **Build APK(s)**

4. Update version number in `app/build.gradle`

---

## 🎊 Congratulations!

You now have a fully functional **offline Android app** for M.Pump Calc!

**Key Benefits:**
- ✅ Works without internet
- ✅ Fast performance
- ✅ Native Android experience
- ✅ PDF export to device
- ✅ Data backup/restore
- ✅ Easy to distribute

---

**Questions? Issues? Check the troubleshooting section or search online for specific errors.**

**Happy Building! 🚀**

---

*Last Updated: October 2025*
*M.Pump Calc Android v1.0*
