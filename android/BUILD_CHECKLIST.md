# ✅ APK Build Checklist

Print this and check off each step as you complete it!

---

## 📥 PREPARATION

- [ ] Computer has at least 8GB RAM
- [ ] At least 10GB free disk space available
- [ ] Good internet connection
- [ ] Android phone available for testing
- [ ] Have the `android` project folder from this app

---

## 💿 ANDROID STUDIO INSTALLATION

- [ ] Downloaded Android Studio from https://developer.android.com/studio
- [ ] Installed Android Studio (double-clicked installer)
- [ ] Ran Setup Wizard
- [ ] Selected "Standard" installation type
- [ ] Downloaded SDK components (this takes time - be patient!)
- [ ] Setup completed successfully
- [ ] Android Studio welcome screen appears

**Estimated Time:** 30-45 minutes (mostly downloading)

---

## 📂 PROJECT SETUP

- [ ] Launched Android Studio
- [ ] Clicked "Open" button
- [ ] Selected the `android` folder (main project folder)
- [ ] Clicked OK/Open
- [ ] Gradle sync started (progress bar at bottom)
- [ ] Waited for "Gradle sync finished" message
- [ ] No red error messages showing

**Estimated Time:** 5-15 minutes (first time)

---

## ⚙️ CONFIGURATION

- [ ] Opened `MainActivity.java` file:
  - Path: `app/java/com/mpumpcalc/MainActivity.java`
- [ ] Found line 45: `private static final String APP_URL = ...`
- [ ] Updated URL to: `"https://petrol-calc-1.preview.emergentagent.com"`
- [ ] Saved file (Ctrl+S or Cmd+S)
- [ ] Green checkmark shows (no red errors)

**Estimated Time:** 2 minutes

---

## 🔨 BUILD APK

- [ ] Clicked **Build** menu (top menu bar)
- [ ] Selected **Build Bundle(s) / APK(s)**
- [ ] Clicked **Build APK(s)**
- [ ] Build process started (progress bar at bottom)
- [ ] Watched build log (text scrolling - this is normal)
- [ ] Build completed successfully
- [ ] Notification shows: "APK(s) generated successfully"
- [ ] Clicked "locate" link in notification
- [ ] File Explorer opened showing APK

**Estimated Time:** 2-5 minutes

---

## 📁 VERIFY APK FILE

- [ ] APK file found at: `android/app/build/outputs/apk/debug/`
- [ ] File name is: `app-debug.apk`
- [ ] File size is between 10-30 MB
- [ ] File copied to easy location (Desktop or Documents)

**Estimated Time:** 1 minute

---

## 📱 PHONE PREPARATION

- [ ] Android phone charged and ready
- [ ] USB cable available (if installing via USB)
- [ ] Enabled "Install from Unknown Sources":
  
  **For Android 8+:**
  - [ ] Settings → Apps & notifications
  - [ ] Special app access
  - [ ] Install unknown apps
  - [ ] Selected File Manager/Chrome
  - [ ] Toggled "Allow from this source" ON
  
  **For Android 7 and below:**
  - [ ] Settings → Security
  - [ ] Toggled "Unknown sources" ON
  - [ ] Tapped OK to confirm

**Estimated Time:** 2 minutes

---

## 📲 INSTALL APK ON PHONE

### Method A: USB Cable
- [ ] Connected phone to computer via USB
- [ ] Selected "File Transfer" mode on phone
- [ ] Phone appears in computer's file explorer
- [ ] Copied `app-debug.apk` to phone's Downloads folder
- [ ] Disconnected phone

### Method B: Email
- [ ] Emailed APK to myself
- [ ] Opened email on phone
- [ ] Downloaded APK attachment

### Installation Steps:
- [ ] Opened File Manager on phone
- [ ] Found `app-debug.apk` in Downloads
- [ ] Tapped the APK file
- [ ] Tapped "Install" button
- [ ] Installation completed
- [ ] Tapped "Open" button

**Estimated Time:** 3-5 minutes

---

## 🧪 TEST THE APP

- [ ] App icon appears in app drawer: "M.Pump Calc"
- [ ] Opened the app
- [ ] Web app loads inside the Android app
- [ ] App interface looks correct
- [ ] Internet connection works

**Estimated Time:** 1 minute

---

## 📄 TEST PDF EXPORT (THE FIX!)

- [ ] In the app, added some test data:
  - [ ] Added a Reading Sales record
  - [ ] Added a Credit Sales record
  - [ ] Added an Income entry
  - [ ] Added an Expense entry

- [ ] Clicked **"PDF"** button (top right corner)

- [ ] PDF Settings dialog opened

- [ ] Selected options:
  - [ ] Summary checked
  - [ ] Reading Sales checked
  - [ ] Credit Sales checked
  - [ ] Income checked
  - [ ] Expenses checked

- [ ] Clicked **"Generate PDF"** button

- [ ] Permission dialog appeared (first time only)

- [ ] Granted **Storage Permission**

- [ ] Saw toast notification: "PDF saved: mpump-report-YYYY-MM-DD.pdf"

- [ ] "Open with..." dialog appeared

- [ ] Selected a PDF viewer app

- [ ] PDF opened and displays correctly

- [ ] PDF shows all the data I entered

**Estimated Time:** 3 minutes

---

## ✅ VERIFY PDF FILE IN DOWNLOADS

- [ ] Opened **File Manager** app on phone

- [ ] Navigated to **Downloads** folder

- [ ] Found **MPumpCalc** subfolder

- [ ] Opened MPumpCalc folder

- [ ] PDF file is there: `mpump-report-2025-XX-XX.pdf`

- [ ] Tapped PDF to open it

- [ ] PDF opens successfully

- [ ] All data is correctly shown in PDF

**Estimated Time:** 1 minute

---

## 🎉 SUCCESS CRITERIA

All of the following should be TRUE:

- [x] Android Studio installed and working
- [x] Project opens without errors
- [x] APK builds successfully
- [x] APK installs on phone
- [x] App launches and loads web content
- [x] PDF export works
- [x] PDF saves to Downloads/MPumpCalc folder
- [x] PDF file can be opened and viewed
- [x] PDF contains correct data

---

## 📊 TOTAL TIME ESTIMATE

| Phase | Time |
|-------|------|
| Android Studio Installation | 30-45 min |
| Project Setup | 5-15 min |
| Configuration | 2 min |
| Build APK | 2-5 min |
| Install on Phone | 3-5 min |
| Testing | 5 min |
| **TOTAL** | **~50-75 min** |

*First time takes longer. Subsequent builds take ~5-10 minutes.*

---

## 🆘 IF SOMETHING FAILS

Check the box of what you tried:

- [ ] Read error message carefully
- [ ] Searched error message on Google
- [ ] Checked **BEGINNER_APK_BUILD_GUIDE.md** Troubleshooting section
- [ ] Tried "Invalidate Caches & Restart" in Android Studio
- [ ] Restarted Android Studio
- [ ] Restarted computer
- [ ] Tried building APK again
- [ ] Checked Android phone has enough storage space
- [ ] Verified internet connection is working
- [ ] Checked phone's security settings for app installation

---

## 📸 SCREENSHOTS TO TAKE (Optional but helpful)

For your records or if you need help:

- [ ] Android Studio welcome screen
- [ ] Project loaded successfully
- [ ] Build successful notification
- [ ] APK file in folder
- [ ] App installed on phone
- [ ] PDF export working
- [ ] PDF file in Downloads folder

---

## 💾 IMPORTANT FILES TO KEEP

- [ ] **`app-debug.apk`** - The APK file itself
- [ ] **`android`** folder - Your project source code
- [ ] **This checklist** - For future reference

---

## 🎯 NEXT STEPS

After successful build:

- [ ] Share APK with team members for testing
- [ ] Test on multiple Android devices
- [ ] Gather user feedback
- [ ] Fix any issues found
- [ ] Rebuild APK with fixes
- [ ] (Optional) Build Release APK for Play Store

---

## 🎓 CONGRATULATIONS!

If all boxes are checked, you've successfully:
- ✅ Set up Android development environment
- ✅ Built your first Android APK
- ✅ Installed and tested the app
- ✅ Verified PDF export functionality works

**You're now an Android app developer!** 🚀

---

**Date Completed:** ________________

**Time Taken:** ________________

**Notes:**
_________________________________________________________
_________________________________________________________
_________________________________________________________
