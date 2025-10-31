# 🔍 PRE-DEPLOYMENT CHECK - Android App

## Running Comprehensive Error Check...

This document lists ALL potential issues before building APK.
**Nothing has been fixed yet** - we'll address them one by one.

---

## 🔴 CRITICAL ISSUES (Must Fix)

### 1. ❌ Missing App Icons
**Location:** `/app/android/app/src/main/res/mipmap-*/`
**Issue:** App icon folders exist but contain NO icon files
**Impact:** Build will fail OR app will have default Android icon
**Check:**
```bash
ls /app/android/app/src/main/res/mipmap-mdpi/
ls /app/android/app/src/main/res/mipmap-hdpi/
ls /app/android/app/src/main/res/mipmap-xhdpi/
ls /app/android/app/src/main/res/mipmap-xxhdpi/
ls /app/android/app/src/main/res/mipmap-xxxhdpi/
```
**Required Files:**
- ic_launcher.png (in each mipmap folder)
- ic_launcher_round.png (in each mipmap folder)

---

### 2. ❌ SDK Path Not Set
**File:** `/app/android/local.properties`
**Current Value:** `sdk.dir=REPLACE_WITH_YOUR_SDK_PATH`
**Issue:** Placeholder not replaced with actual SDK path
**Impact:** Gradle sync will FAIL in Android Studio
**Fix Required:** User must update with their Android SDK path

---

### 3. ⚠️ Internet-Dependent Scripts in HTML
**File:** `/app/android/app/src/main/assets/index.html`
**Issue:** External scripts require internet:
- `https://assets.emergent.sh/scripts/emergent-main.js`
- `https://unpkg.com/rrweb@latest/dist/rrweb.min.js`
- `https://d2adkz2s9zrlge.cloudfront.net/rrweb-recorder-20250919-1.js`
**Impact:** These won't load offline (but app may still work)
**Severity:** Medium - app might work but features may be missing

---

## 🟡 MEDIUM PRIORITY ISSUES

### 4. ⚠️ Backend API References
**Files with backend calls:**
- `/app/frontend/src/services/api.js`
- `/app/frontend/src/contexts/AuthContext.js`

**Issue:** Code references backend URLs:
```javascript
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://petrol-calc-1.preview.emergentagent.com';
```
**Impact:** If app tries to call these APIs, it will fail offline
**Check Needed:** Verify if ZAPTRStyleCalculator component actually uses these APIs

---

### 5. ⚠️ PostHog Analytics Tracking
**File:** `/app/android/app/src/main/assets/index.html`
**Issue:** PostHog tracking code present (requires internet)
```javascript
posthog.init("phc_yJW1VjHGGwmCbbrtczfqqNxgBDbhlhOWcdzcIJEOTFE", ...)
```
**Impact:** Won't track analytics offline (app will still work)
**Severity:** Low - analytics just won't work

---

### 6. ⚠️ Missing Proguard Rules Verification
**File:** `/app/android/app/proguard-rules.pro`
**Issue:** Need to verify if React/WebView classes are excluded from minification
**Impact:** Release build might have issues (debug build OK)
**Needed for:** Release APK only

---

## 🟢 MINOR ISSUES / WARNINGS

### 7. ℹ️ Gradle Build Version Check
**File:** `/app/android/build.gradle`
**Current:** `classpath 'com.android.tools.build:gradle:8.2.0'`
**Note:** Using Gradle 8.2.0 - relatively new version
**Impact:** User's Android Studio must support this version
**Check:** User's Android Studio version compatibility

---

### 8. ℹ️ Minimum SDK Version
**File:** `/app/android/app/build.gradle`
**Current:** `minSdk 24` (Android 7.0)
**Note:** Excludes devices running Android 6.0 and below
**Impact:** ~5% of old devices won't support app
**Status:** This is reasonable, just FYI

---

### 9. ℹ️ Version Code and Name
**File:** `/app/android/app/build.gradle`
**Current:**
```gradle
versionCode 1
versionName "1.0.0"
```
**Note:** First version - OK for initial release
**For Updates:** Must increment versionCode for each update

---

### 10. ℹ️ Package Name
**Current:** `com.mpumpcalc.app`
**Note:** Generic package name
**Recommendation:** Consider company-specific name (e.g., `com.yourcompany.mpumpcalc`)
**Impact:** Hard to change after Play Store release

---

## ✅ VERIFIED WORKING

### Components That Look Good:

1. ✅ **HashRouter Implementation**
   - Correctly using HashRouter in App.js
   - Compatible with file:// protocol

2. ✅ **Relative Paths in Build**
   - package.json has `"homepage": "."`
   - Build uses `./static/` paths

3. ✅ **WebView Configuration**
   - MainActivity.java has proper settings
   - localStorage enabled
   - JavaScript enabled
   - DOM storage enabled

4. ✅ **File Provider Setup**
   - AndroidManifest.xml has FileProvider
   - file_paths.xml configured

5. ✅ **Permissions**
   - INTERNET permission present
   - Storage permissions present
   - All necessary permissions included

6. ✅ **Assets Folder**
   - index.html present
   - static/js/ folder present
   - static/css/ folder present

7. ✅ **LocalStorage Usage**
   - ZAPTRStyleCalculator uses localStorage
   - localStorageService implemented
   - No hard dependency on backend

---

## 📋 DETAILED FILE CHECKS

Let me run actual checks now...
