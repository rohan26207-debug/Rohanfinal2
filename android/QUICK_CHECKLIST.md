# ✅ Quick Build Checklist - M.Pump Calc Android

## Before You Start
- [ ] Android Studio installed
- [ ] 10-15 minutes available
- [ ] Good internet connection (for first build)

---

## Step 1: Update SDK Path (2 minutes)

1. [ ] Open Android Studio
2. [ ] Go to: File → Settings → System Settings → Android SDK
3. [ ] Copy the SDK path shown
4. [ ] Open `/app/android/local.properties` in text editor
5. [ ] Replace `REPLACE_WITH_YOUR_SDK_PATH` with your SDK path
6. [ ] Save file

**Example paths:**
- Windows: `C:\\Users\\YourName\\AppData\\Local\\Android\\Sdk`
- Mac: `/Users/YourName/Library/Android/sdk`
- Linux: `/home/YourName/Android/Sdk`

---

## Step 2: Open Project (5-10 minutes)

1. [ ] Launch Android Studio
2. [ ] Click "Open" (not New Project)
3. [ ] Select `/app/android` folder
4. [ ] Click OK
5. [ ] Wait for Gradle Sync (5-10 min first time)
   - Don't interrupt!
   - Progress bar shows at bottom

**If sync fails:**
- [ ] Click: File → Invalidate Caches → Invalidate and Restart
- [ ] Wait and try again

---

## Step 3: Build APK (2-5 minutes)

1. [ ] In menu: Build → Build Bundle(s) / APK(s) → Build APK(s)
2. [ ] Wait for build (2-5 minutes)
3. [ ] See notification: "APK(s) generated successfully"
4. [ ] Click "locate" to find APK

**APK Location:**
```
/app/android/app/build/outputs/apk/debug/app-debug.apk
```

---

## Step 4: Install on Phone (5 minutes)

1. [ ] Copy `app-debug.apk` to your phone
2. [ ] Open File Manager on phone
3. [ ] Tap the APK file
4. [ ] Enable "Install from Unknown Sources" if asked
5. [ ] Tap "Install"
6. [ ] Tap "Open"

---

## Step 5: Test App (5 minutes)

### Basic Tests
- [ ] App launches successfully
- [ ] Dashboard shows properly
- [ ] Can change date
- [ ] All tabs work (Reading Sales, Credit Sales, Inc./Exp.)

### Offline Test
- [ ] Turn off WiFi and Mobile Data
- [ ] App still works
- [ ] Add test data
- [ ] Data saves locally

### PDF Export Test
- [ ] Add some records
- [ ] Tap "PDF" button
- [ ] PDF opens automatically
- [ ] Check Downloads folder
- [ ] PDF contains correct data

---

## ✅ Success!

Your offline Android app is ready!

**What works:**
✅ Fully offline operation
✅ Local data storage
✅ PDF export to Downloads
✅ All petrol pump management features

---

## 🔄 If You Need Release APK (For Distribution)

### Create Signing Key
```bash
keytool -genkey -v -keystore mpump-release.jks -keyalg RSA -keysize 2048 -validity 10000 -alias mpump
```

### Generate Signed APK
1. [ ] Build → Generate Signed Bundle / APK
2. [ ] Select APK → Next
3. [ ] Choose keystore file
4. [ ] Enter passwords
5. [ ] Select "release" variant
6. [ ] Finish

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Gradle sync failed | File → Invalidate Caches → Restart |
| SDK not found | Check `local.properties` path |
| APK won't install | Enable "Unknown Sources" |
| Blank screen | Check assets folder has files |
| PDF not working | Test on real device (not emulator) |

---

## 📁 Important Files

- **local.properties** - SDK path (edit this!)
- **app/build.gradle** - App config & version
- **AndroidManifest.xml** - Permissions
- **MainActivity.java** - Main app code
- **assets/** - Frontend files (offline mode)

---

## 🎉 Done!

**Time spent:** ~20-30 minutes
**Result:** Fully functional offline Android app

**Share your APK with:**
- Team members
- End users
- Test users

---

For detailed instructions, see: **BUILD_APK_GUIDE.md**

*Last Updated: October 2025*
