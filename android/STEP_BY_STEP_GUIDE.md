# 📱 Step-by-Step Guide to Build Your Android APK

## 📍 File Location

**MainActivity.java is located at:**
```
/app/android/app/src/main/java/com/mpumpcalc/MainActivity.java
```

**Complete Android project structure:**
```
/app/android/                                      ← Main Android project folder
├── app/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/
│   │       │       └── mpumpcalc/
│   │       │           └── MainActivity.java      ← THIS IS THE FILE YOU NEED
│   │       ├── res/
│   │       │   ├── layout/
│   │       │   │   └── activity_main.xml
│   │       │   ├── values/
│   │       │   │   ├── strings.xml
│   │       │   │   ├── colors.xml
│   │       │   │   └── styles.xml
│   │       │   ├── xml/
│   │       │   │   └── file_paths.xml
│   │       │   └── mipmap/                        ← Put app icons here
│   │       └── AndroidManifest.xml
│   ├── build.gradle
│   └── proguard-rules.pro
├── build.gradle
├── settings.gradle
├── gradle.properties
├── local.properties                               ← Update this with SDK path
├── README.md                                      ← Full documentation
└── QUICKSTART.md                                  ← Quick reference
```

---

## 🎯 STEP 1: Download and Install Android Studio

### Windows:
1. Go to: https://developer.android.com/studio
2. Click "Download Android Studio"
3. Run the installer (android-studio-xxx.exe)
4. Follow installation wizard
5. Choose "Standard" installation
6. Wait for SDK download (takes 10-15 minutes)

### Mac:
1. Go to: https://developer.android.com/studio
2. Download the .dmg file
3. Drag Android Studio to Applications
4. Open Android Studio
5. Follow setup wizard

### What gets installed:
- Android Studio IDE
- Android SDK
- Android Emulator
- Java Development Kit (JDK)

---

## 🎯 STEP 2: Update Your Web App URL

### 2.1 Find MainActivity.java

**Full path:** `/app/android/app/src/main/java/com/mpumpcalc/MainActivity.java`

### 2.2 Open the file in any text editor

You can use:
- Notepad (Windows)
- TextEdit (Mac)
- VS Code
- Or wait to open in Android Studio (Step 4)

### 2.3 Find Line 28 - The URL line

Look for this line:
```java
private static final String APP_URL = "https://muro-alpha.vercel.app";
```

### 2.4 Change to YOUR URL

Replace with your actual Vercel deployment URL:
```java
private static final String APP_URL = "https://your-app-name.vercel.app";
```

**⚠️ IMPORTANT:**
- Use HTTPS (not HTTP)
- Don't add trailing slash (/)
- Use your production URL (not localhost)
- Example: "https://mpump-calc.vercel.app"

### 2.5 Save the file

---

## 🎯 STEP 3: Update Android SDK Path

### 3.1 Find your Android SDK location

**After installing Android Studio**, the SDK is usually at:

**Windows:**
```
C:\Users\YourUsername\AppData\Local\Android\Sdk
```

**Mac:**
```
/Users/YourUsername/Library/Android/sdk
```

**Linux:**
```
/home/YourUsername/Android/Sdk
```

### 3.2 How to find it in Android Studio:

1. Open Android Studio
2. Click **File** → **Settings** (Windows) or **Android Studio** → **Preferences** (Mac)
3. Go to **Appearance & Behavior** → **System Settings** → **Android SDK**
4. Copy the path shown at the top ("Android SDK Location")

### 3.3 Update local.properties

Open this file:
```
/app/android/local.properties
```

Change this line:
```properties
sdk.dir=C:\\Users\\YourUsername\\AppData\\Local\\Android\\Sdk
```

To your actual path. **Note:** Use double backslashes (\\) on Windows:
```properties
sdk.dir=C:\\Users\\John\\AppData\\Local\\Android\\Sdk
```

On Mac/Linux, use single forward slashes:
```properties
sdk.dir=/Users/john/Library/Android/sdk
```

### 3.4 Save the file

---

## 🎯 STEP 4: Open Project in Android Studio

### 4.1 Launch Android Studio

### 4.2 On Welcome Screen:
- Click **"Open"** button
- OR
- If you have a project open: **File** → **Close Project** → Then click **"Open"**

### 4.3 Navigate to Android folder:

Browse to: `/app/android`

**⚠️ IMPORTANT:** Select the **`android`** folder itself, NOT the `app` subfolder

### 4.4 Click "OK"

### 4.5 Wait for Gradle Sync

You'll see at the bottom:
- "Gradle sync in progress..."
- Progress bar

**First time takes 5-15 minutes** because it downloads dependencies.

### 4.6 Sync Complete

When done, you'll see:
- "Gradle sync finished" at the bottom
- Project structure appears on the left
- No errors in "Build" tab

**If Gradle Sync Fails:**
1. **File** → **Invalidate Caches / Restart** → **Invalidate and Restart**
2. Wait for restart
3. **File** → **Sync Project with Gradle Files**

---

## 🎯 STEP 5: Add App Icon (Optional but Recommended)

### 5.1 Prepare Icon

Create a square PNG icon (512x512 pixels minimum)

### 5.2 In Android Studio:

1. Right-click **`res`** folder in project view (left sidebar)
2. Select **New** → **Image Asset**
3. Select **"Launcher Icons (Adaptive and Legacy)"**
4. In **"Icon Type"**, choose **"Image"**
5. Click folder icon next to **"Path"**
6. Select your icon image
7. Adjust padding if needed
8. Click **"Next"**
9. Click **"Finish"**

Your icon will be added to all required sizes automatically!

---

## 🎯 STEP 6: Build Debug APK (For Testing)

### 6.1 In Android Studio Menu:

**Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**

### 6.2 Wait for Build

Bottom right corner shows:
- "Gradle Build Running..."
- Progress bar

Takes 1-3 minutes

### 6.3 Build Complete

You'll see a notification:
```
APK(s) generated successfully.
Locate or analyze the APK.
```

### 6.4 Find Your APK

Click **"locate"** in the notification

OR manually go to:
```
/app/android/app/build/outputs/apk/debug/app-debug.apk
```

### 6.5 APK is Ready!

- File name: `app-debug.apk`
- Size: ~5-15 MB
- Ready to install on any Android phone!

---

## 🎯 STEP 7: Install APK on Your Phone

### Method 1: Transfer APK File

**Step 7.1:** Copy `app-debug.apk` to your phone
- Via USB cable
- Via email (send to yourself)
- Via cloud storage (Google Drive, Dropbox)
- Via messaging app (WhatsApp, Telegram)

**Step 7.2:** Enable "Install from Unknown Sources"
1. Open **Settings** on your phone
2. Go to **Security** (or **Privacy**)
3. Find **"Install unknown apps"** or **"Unknown sources"**
4. Select your file manager or browser
5. Enable **"Allow from this source"**

**Step 7.3:** Install APK
1. Open file manager on phone
2. Navigate to Downloads folder (or wherever you saved APK)
3. Tap `app-debug.apk`
4. Tap **"Install"**
5. Wait for installation
6. Tap **"Open"**

### Method 2: Install via USB (Faster)

**Step 7.1:** Enable Developer Options on Phone
1. Go to **Settings** → **About phone**
2. Tap **"Build number"** 7 times
3. You'll see "You are now a developer!"

**Step 7.2:** Enable USB Debugging
1. Go to **Settings** → **System** → **Developer options**
2. Enable **"USB debugging"**

**Step 7.3:** Connect Phone to Computer
1. Connect via USB cable
2. On phone, tap **"Allow USB debugging"**
3. Check **"Always allow from this computer"**
4. Tap **"OK"**

**Step 7.4:** Install from Android Studio
1. In Android Studio, click **Run** → **Run 'app'**
2. Select your phone from device list
3. Click **"OK"**
4. App installs and opens automatically!

---

## 🎯 STEP 8: Test the App

### 8.1 Open the app on your phone

### 8.2 Test These Features:

✅ **App loads your web app**
- Should show your M.Pump Calc interface
- No blank screen

✅ **Add a sales record**
- Click "Reading Sales"
- Fill in data
- Save

✅ **Check data persists**
- Close app
- Reopen app
- Data should still be there (LocalStorage working!)

✅ **Test PDF download**
- Add some data
- Click "PDF" button
- Check Downloads folder for PDF file

✅ **Test back button**
- Navigate through the app
- Press phone's back button
- Should go back through pages, not close app immediately

✅ **Test offline**
- Turn off internet (Airplane mode)
- Open app
- Should still work (cached)

---

## 🎯 STEP 9: Build Release APK (For Distribution)

### Why Release APK?

- **Debug APK**: For testing only, larger size
- **Release APK**: For distribution, optimized, smaller size

### 9.1 Create Signing Key (First time only)

**9.1.1** Open Terminal in Android Studio:
- **View** → **Tool Windows** → **Terminal**

**9.1.2** Run this command:
```bash
keytool -genkey -v -keystore mpump-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias mpump-key
```

**9.1.3** Answer the prompts:
```
Enter keystore password: [choose a strong password]
Re-enter new password: [repeat password]
What is your first and last name? [Your Name]
What is the name of your organizational unit? [Leave blank or enter]
What is the name of your organization? [Your Company]
What is the name of your City or Locality? [Your City]
What is the name of your State or Province? [Your State]
What is the two-letter country code? [IN]
Is CN=..., correct? [yes]
Enter key password for <mpump-key>: [press Enter to use same password]
```

**9.1.4** Key file created:
```
/app/android/mpump-release-key.jks
```

**⚠️ SAVE THIS FILE AND PASSWORD!** You need it for all future updates.

### 9.2 Build Signed APK

**9.2.1** In Android Studio:
- **Build** → **Generate Signed Bundle / APK**

**9.2.2** Select:
- Choose **"APK"**
- Click **"Next"**

**9.2.3** Key store path:
- Click **"Choose existing..."**
- Navigate to `mpump-release-key.jks`
- Click **"OK"**

**9.2.4** Enter passwords:
- Key store password: [your keystore password]
- Key alias: `mpump-key`
- Key password: [your key password]
- Check **"Remember passwords"** (optional)
- Click **"Next"**

**9.2.5** Build variant:
- Select **"release"**
- Check both signature versions (V1 and V2)
- Click **"Finish"**

### 9.3 Wait for Build

Takes 2-5 minutes

### 9.4 Find Release APK

Located at:
```
/app/android/app/build/outputs/apk/release/app-release.apk
```

### 9.5 Release APK is Ready!

- File name: `app-release.apk`
- Optimized and signed
- Ready for distribution!

---

## 🎯 STEP 10: Distribute Your App

### Option 1: Direct Distribution (FREE)

**Share APK file:**
- Send via email
- Upload to your website
- Share via Google Drive
- Share via messaging apps

**Users need to:**
1. Download APK
2. Enable "Install from Unknown Sources"
3. Install APK

### Option 2: Google Play Store (Paid)

**Cost:** $25 one-time registration fee

**Steps:**
1. Create Google Play Developer Account
2. Pay $25 fee
3. Create new app listing
4. Upload APK or AAB
5. Fill in store details (screenshots, description)
6. Submit for review
7. Wait 1-7 days for approval

**Benefits:**
- Users trust Play Store
- Automatic updates
- Better discoverability
- Payment processing (if needed)

---

## 📋 Quick Reference Checklist

Before building APK:
- [ ] Updated APP_URL in MainActivity.java (line 28)
- [ ] Updated sdk.dir in local.properties
- [ ] Added app icon
- [ ] Changed app name in strings.xml (optional)
- [ ] Gradle sync completed successfully

Before distributing:
- [ ] Tested on real device
- [ ] Verified data persistence (close/reopen app)
- [ ] Tested PDF download
- [ ] Tested back button
- [ ] Built release APK with signing key
- [ ] Saved keystore file safely

---

## 🐛 Troubleshooting

### "Gradle sync failed"
**Solution:**
1. File → Invalidate Caches / Restart
2. File → Sync Project with Gradle Files

### "SDK location not found"
**Solution:**
Update `local.properties` with correct SDK path

### "APK won't install on phone"
**Solutions:**
- Enable "Install from Unknown Sources"
- Check phone has Android 7.0+ (API 24+)
- Uninstall old version first

### "App shows blank screen"
**Solutions:**
- Check APP_URL is correct HTTPS URL
- Test URL in Chrome browser first
- Check AndroidManifest.xml has INTERNET permission

### "PDF download doesn't work"
**Solutions:**
- Grant storage permissions when prompted
- Check Downloads folder on phone
- Try tapping "PDF" button again

### "Gradle build too slow"
**Solutions:**
- Close other programs
- Give Android Studio more RAM:
  - Help → Edit Custom VM Options
  - Add: `-Xmx4096m`
- Enable offline mode:
  - File → Settings → Gradle
  - Check "Offline work"

---

## 💡 Pro Tips

1. **Always test on real device** - Emulators don't show real performance

2. **Version your APKs** - Before each build, update version in `app/build.gradle`:
   ```gradle
   versionCode 2
   versionName "1.1.0"
   ```

3. **Keep keystore safe** - Store `mpump-release-key.jks` securely. Without it, you can't update your app!

4. **Test before distributing** - Install APK on multiple devices if possible

5. **Monitor app size** - Release APK should be 5-15 MB. If larger, optimize.

---

## 🎉 You're Done!

You now have:
- ✅ Complete Android project
- ✅ MainActivity.java configured
- ✅ APK file ready to distribute
- ✅ Knowledge to build and update your app

**Next Steps:**
- Share your APK with users
- Gather feedback
- Make updates to web app (no APK rebuild needed!)
- Release updates with new version number

---

## 📞 Need Help?

**Check these first:**
1. README.md - Complete documentation
2. QUICKSTART.md - Quick reference
3. This guide - Step-by-step instructions

**Common resources:**
- Android Studio docs: https://developer.android.com/studio
- Stack Overflow: Search your error message
- Android development guide: https://developer.android.com/guide

Good luck with your app! 🚀
