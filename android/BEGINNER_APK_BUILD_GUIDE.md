# Complete Beginner's Guide to Building APK in Android Studio

## 📋 What You'll Need

1. **A Windows/Mac/Linux computer** with at least:
   - 8 GB RAM (16 GB recommended)
   - 10 GB free disk space
   - Internet connection

2. **The Android project folder** from this app (`/app/android/`)

3. **Android Studio** (we'll download this in Step 1)

---

## 🎯 STEP 1: Download Android Studio

### For Windows:

1. **Open your web browser** (Chrome, Edge, Firefox, etc.)

2. **Go to:** https://developer.android.com/studio

3. **Click the big green button** that says **"Download Android Studio"**

4. **Accept the terms** and click **"Download Android Studio for Windows"**

5. **Wait for download** (it's about 1 GB, may take 5-15 minutes depending on your internet speed)

6. **File will be downloaded** as: `android-studio-2024.X.X.X-windows.exe`

### For Mac:

1. Go to: https://developer.android.com/studio

2. Click **"Download Android Studio"**

3. Choose the right version:
   - **Intel Chip Mac:** Download `.dmg` (Intel)
   - **Apple Silicon (M1/M2/M3):** Download `.dmg` (Apple Silicon)

4. File will be: `android-studio-2024.X.X.X-mac.dmg`

### For Linux:

1. Go to: https://developer.android.com/studio

2. Click **"Download Android Studio"**

3. File will be: `android-studio-2024.X.X.X-linux.tar.gz`

---

## 🎯 STEP 2: Install Android Studio

### For Windows:

1. **Find the downloaded file** in your Downloads folder

2. **Double-click** `android-studio-...exe`

3. **Click "Yes"** if Windows asks permission

4. **Setup Wizard opens:**
   - Click **"Next"**
   - Keep everything checked, click **"Next"**
   - Choose install location (default is fine), click **"Next"**
   - Click **"Install"**

5. **Wait for installation** (5-10 minutes)

6. **Click "Finish"** when done

7. **Android Studio Setup Wizard opens:**
   - Click **"Next"**
   - Select **"Standard"** installation type
   - Choose theme (Light or Dark - your choice)
   - Click **"Next"**
   - Click **"Finish"**

8. **Wait for downloads** (Android Studio will download required components - about 2-3 GB, takes 10-30 minutes)

9. **Click "Finish"** when it says "Setup Complete"

### For Mac:

1. **Open the `.dmg` file** from Downloads

2. **Drag Android Studio icon** to Applications folder

3. **Open Launchpad** and find **Android Studio**

4. **Click to open** (Mac may show security warning)

5. If security warning appears:
   - Go to **System Preferences → Security & Privacy**
   - Click **"Open Anyway"**

6. **Follow the Setup Wizard** (same as Windows steps 7-9)

### For Linux:

1. **Extract the downloaded file:**
   ```bash
   tar -xzf android-studio-*.tar.gz
   ```

2. **Navigate to the folder:**
   ```bash
   cd android-studio/bin
   ```

3. **Run Android Studio:**
   ```bash
   ./studio.sh
   ```

4. **Follow the Setup Wizard** (same as Windows steps 7-9)

---

## 🎯 STEP 3: Get Your Android Project Files

You need to get the `/app/android/` folder from this project to your computer.

### Option A: Download from the platform

1. **Locate the download option** in your current environment

2. **Download the `/app/android/` folder** to your computer

3. **Save it somewhere easy to find** (like Desktop or Documents)

### Option B: If you have command line access

```bash
# Copy the entire android folder to a location accessible to your computer
# Example: if you have a shared folder or can download via git
```

### Important Files to Check:

Make sure your `android` folder contains:
```
android/
├── app/
├── gradle/
├── build.gradle
├── settings.gradle
├── local.properties
├── gradlew
└── gradlew.bat
```

---

## 🎯 STEP 4: Open Project in Android Studio

1. **Launch Android Studio**
   - Windows: Start Menu → Android Studio
   - Mac: Launchpad → Android Studio
   - Linux: Run `studio.sh`

2. **Welcome Screen appears** with options

3. **Click "Open"** button
   - It might also say "Open an Existing Project"

4. **File browser opens**
   - Navigate to where you saved the `android` folder
   - **Select the `android` folder** (the main folder, not the `app` subfolder)
   - Click **"OK"** or **"Open"**

5. **Android Studio starts loading the project**
   - You'll see a progress bar at the bottom
   - Text says "Gradle: Syncing..."
   - **This is normal - wait patiently!**

6. **First time opening may take 5-15 minutes** because:
   - Gradle downloads dependencies
   - Android SDK components download
   - Project indexes and builds

7. **Watch the bottom right corner:**
   - When it shows **"Gradle sync finished"** → Success! ✅
   - If it shows errors → See Troubleshooting section below

---

## 🎯 STEP 5: Configure Project (Important!)

Before building, you need to update one file:

### Update the Website URL:

1. **In Android Studio, left side panel** shows project files

2. **Navigate to:**
   ```
   app → java → com → mpumpcalc → MainActivity.java
   ```

3. **Double-click `MainActivity.java`** to open it

4. **Find line 45** (around there) that says:
   ```java
   private static final String APP_URL = "https://muro-alpha.vercel.app";
   ```

5. **Change it to your web app URL:**
   ```java
   private static final String APP_URL = "https://petrol-calc-1.preview.emergentagent.com";
   ```

6. **Save the file:**
   - Windows: `Ctrl + S`
   - Mac: `Cmd + S`

---

## 🎯 STEP 6: Build the APK

Now the exciting part - creating your APK!

### Method 1: Using Menu (Recommended for Beginners)

1. **Top menu bar** → Click **"Build"**

2. **From dropdown menu** → Click **"Build Bundle(s) / APK(s)"**

3. **Another menu appears** → Click **"Build APK(s)"**

4. **Wait for build process**
   - Bottom of screen shows progress: "Building APK..."
   - First build takes 2-5 minutes
   - You'll see lots of text scrolling (this is normal!)

5. **Success notification appears:**
   - Bottom right corner shows: **"APK(s) generated successfully"**
   - Click **"locate"** link in the notification

6. **File Explorer opens** showing your APK!

### Method 2: Using Gradle (Alternative)

1. **Right side of Android Studio** → Click **"Gradle"** tab

2. **Expand folders:**
   ```
   MPumpCalc → app → Tasks → build
   ```

3. **Double-click** `assembleDebug`

4. **Wait for build** (same as Method 1, step 4-5)

---

## 🎯 STEP 7: Find Your APK File

If you closed the notification or can't find the APK:

### Manual Navigation:

1. **Go to your android project folder** on your computer

2. **Navigate to:**
   ```
   android/app/build/outputs/apk/debug/
   ```

3. **You'll find:** `app-debug.apk`

4. **This is your APK file!** 🎉

### File Details:
- **Name:** `app-debug.apk`
- **Size:** Usually 10-30 MB
- **This is what you install on Android phones**

---

## 🎯 STEP 8: Install APK on Your Android Phone

### Preparation:

1. **Enable "Install from Unknown Sources" on your phone:**
   
   **For Android 8+:**
   - Go to **Settings**
   - Tap **Apps & notifications**
   - Tap **Special app access**
   - Tap **Install unknown apps**
   - Select your **File Manager** or **Chrome**
   - Toggle **"Allow from this source"** ON

   **For Android 7 and below:**
   - Go to **Settings**
   - Tap **Security**
   - Toggle **"Unknown sources"** ON
   - Tap **OK** to confirm

### Option A: Install via USB Cable

1. **Connect your phone to computer** using USB cable

2. **On your phone:**
   - Notification appears: "USB for file transfer"
   - Tap it and select **"File Transfer"** or **"MTP"**

3. **On your computer:**
   - Open **File Explorer** (Windows) or **Finder** (Mac)
   - You'll see your phone name in devices
   - Open it

4. **Copy the APK:**
   - Navigate to where your `app-debug.apk` is
   - **Drag and drop** it to your phone's **Downloads** folder

5. **On your phone:**
   - Open **File Manager** or **My Files** app
   - Go to **Downloads** folder
   - Tap **app-debug.apk**
   - Tap **"Install"**
   - Wait for installation
   - Tap **"Open"** to launch!

### Option B: Install via Email/Cloud

1. **Email the APK to yourself:**
   - Attach `app-debug.apk` to an email
   - Send to your email address

2. **On your phone:**
   - Open the email
   - Download the APK attachment
   - Tap the downloaded file
   - Tap **"Install"**

### Option C: Install via ADB (For Tech-Savvy Users)

1. **Enable USB Debugging** on your phone:
   - Go to **Settings → About Phone**
   - Tap **"Build Number"** 7 times (Developer Mode activates)
   - Go back to **Settings → Developer Options**
   - Toggle **"USB Debugging"** ON

2. **Connect phone to computer** via USB

3. **Open Command Prompt/Terminal:**
   - Windows: Press `Win + R`, type `cmd`, press Enter
   - Mac/Linux: Open Terminal

4. **Navigate to your Android SDK platform-tools:**
   ```bash
   cd C:\Users\YourName\AppData\Local\Android\Sdk\platform-tools
   # (Windows - adjust path for your username)
   
   cd ~/Library/Android/sdk/platform-tools
   # (Mac)
   ```

5. **Install APK:**
   ```bash
   adb install path/to/your/app-debug.apk
   ```

6. **Success message appears:** "Success"

7. **Find the app** on your phone's app drawer

---

## 🎯 STEP 9: Test Your App!

1. **Open M.Pump Calc app** on your phone

2. **The web app loads** inside the Android app

3. **Test PDF Export:**
   - Add some sample data (sales, credit, expenses)
   - Click **"PDF"** button (top right)
   - Configure settings
   - Click **"Generate PDF"**
   - **Grant storage permission** (first time only)
   - Check if PDF is saved to **Downloads/MPumpCalc** folder!

4. **Verify:**
   - Open **File Manager** → **Downloads** → **MPumpCalc**
   - Your PDF should be there! 🎉

---

## 🔧 Troubleshooting Common Issues

### Issue 1: "Gradle sync failed"

**Solution:**
1. Click **"Try Again"** button
2. If still fails, go to **File → Invalidate Caches → Invalidate and Restart**
3. Wait for Android Studio to restart and retry

### Issue 2: "SDK not found"

**Solution:**
1. Go to **File → Settings** (Windows/Linux) or **Android Studio → Preferences** (Mac)
2. Go to **Appearance & Behavior → System Settings → Android SDK**
3. Check the **"Android SDK Location"** path
4. Click **"Apply"** and **"OK"**
5. Go to **SDK Tools** tab
6. Check **"Android SDK Build-Tools"** and **"Android SDK Platform-Tools"**
7. Click **"Apply"** to install them

### Issue 3: "Java not found" or "JDK required"

**Solution:**
1. Android Studio usually includes JDK
2. Go to **File → Project Structure → SDK Location**
3. Under **"JDK location"**, make sure a path is shown
4. If empty, download JDK from: https://www.oracle.com/java/technologies/downloads/
5. Install it and set the path in Android Studio

### Issue 4: Build fails with "Out of memory"

**Solution:**
1. Close other programs
2. In Android Studio, go to **File → Settings → Build, Execution, Deployment → Compiler**
3. Increase **"Build process heap size"** to 2048 MB
4. Click **"Apply"** and retry build

### Issue 5: APK won't install on phone - "App not installed"

**Solution:**
1. Make sure you enabled "Install from Unknown Sources"
2. If you have an older version installed, uninstall it first
3. Try restarting your phone
4. Make sure the APK file downloaded completely (check file size)

### Issue 6: App crashes immediately after opening

**Solution:**
1. Check if your phone has internet connection
2. Make sure the `APP_URL` in `MainActivity.java` is correct
3. Try clearing app data: **Settings → Apps → M.Pump Calc → Storage → Clear Data**

---

## 📱 Building a Release APK (For Publishing to Play Store)

The APK you built above is a **Debug APK** - it's for testing only.

To publish to Play Store, you need a **Release APK** (signed):

### Quick Steps:

1. **Build → Generate Signed Bundle/APK**
2. Select **"APK"** → **"Next"**
3. **"Create new..."** (first time) to create a keystore
4. Fill in keystore details and password (SAVE THESE!)
5. Select **"release"** build variant
6. Click **"Finish"**
7. Release APK will be in: `app/release/app-release.apk`

**Important:** Save your keystore file and passwords in a safe place! You'll need them for future updates.

---

## 🎓 Summary - What You Did!

1. ✅ Downloaded and installed Android Studio
2. ✅ Opened your Android project
3. ✅ Updated the web app URL
4. ✅ Built the APK file
5. ✅ Installed it on your phone
6. ✅ Tested the app!

**Congratulations!** 🎉 You've successfully created your first Android APK!

---

## 📞 Need Help?

If you get stuck:

1. **Check the Troubleshooting section** above
2. **Google the exact error message** - Android Studio errors are well-documented
3. **YouTube:** Search "how to build APK in Android Studio" for video tutorials
4. **Stack Overflow:** Most Android Studio errors have solutions there

---

## 📚 Useful Resources

- **Android Studio Official Guide:** https://developer.android.com/studio/intro
- **Building Your First App:** https://developer.android.com/training/basics/firstapp
- **YouTube:** Search "Android Studio tutorial for beginners"
- **APK Installation Guide:** https://www.androidauthority.com/how-to-install-apks-31494/

---

**Good luck with your app!** 🚀
