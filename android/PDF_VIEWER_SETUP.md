# Android PDF Viewer Integration - "Open with..." Dialog

## ✨ What's New

When users click "PDF" button and generate a PDF in the Android app:
1. PDF is generated using jsPDF
2. PDF is saved to device storage: `/Downloads/MPumpCalc/`
3. Android "Open with..." dialog appears automatically
4. User can choose their preferred PDF viewer:
   - Google Drive PDF Viewer
   - Adobe Acrobat Reader
   - Microsoft Office
   - WPS Office
   - Any other installed PDF app

## 🔧 How It Works

### Web App Side (JavaScript)

**Detection:**
```javascript
const isAndroid = /Android/i.test(navigator.userAgent);
const isWebView = window.MPumpCalcAndroid; // Check if interface exists
```

**PDF Generation:**
1. Generate PDF using jsPDF
2. Convert to Base64 string
3. Call Android native method:
```javascript
window.MPumpCalcAndroid.openPdfWithViewer(base64data, fileName);
```

### Android App Side (Java)

**JavaScript Interface:**
```java
webView.addJavascriptInterface(new PdfJavaScriptInterface(this), "MPumpCalcAndroid");
```

**PDF Handling:**
1. Receive Base64 PDF data
2. Decode to bytes
3. Save to `/Downloads/MPumpCalc/` folder
4. Create Intent with ACTION_VIEW
5. Show "Open with..." chooser dialog

## 📁 File Locations

**Saved PDFs:**
```
/storage/emulated/0/Download/MPumpCalc/
├── mpump-report-2025-10-22.pdf
├── mpump-report-2025-10-21.pdf
└── mpump-report-2025-10-15-to-2025-10-20.pdf
```

**Android Code:**
```
/app/android/app/src/main/java/com/mpumpcalc/MainActivity.java
```

## 🎯 User Experience

### In Browser (Chrome/Firefox)
1. Click PDF button → Settings dialog opens
2. Configure options → Click "Generate PDF"
3. PDF downloads to Downloads folder
4. Browser shows download notification
5. Click notification → Opens with default PDF viewer

### In Android App
1. Click PDF button → Settings dialog opens
2. Configure options → Click "Generate PDF"
3. Toast: "PDF saved: mpump-report-2025-10-22.pdf"
4. **"Open with..." dialog appears automatically** ⭐
5. User selects PDF viewer app (Drive, Adobe, etc.)
6. PDF opens in selected app

## 📱 Supported PDF Viewer Apps

Works with any installed PDF viewer:

**Popular Apps:**
- ✅ Google Drive PDF Viewer (pre-installed)
- ✅ Adobe Acrobat Reader
- ✅ Google PDF Viewer
- ✅ Microsoft Office (Word, Edge)
- ✅ WPS Office
- ✅ Foxit PDF Reader
- ✅ Xodo PDF Reader
- ✅ PDF Reader Pro
- ✅ Any app that handles `application/pdf` MIME type

**If No PDF Viewer Installed:**
- Toast message: "No PDF viewer found. Please install a PDF reader app."
- User can install from Play Store

## 🔐 Permissions

**Required in AndroidManifest.xml:**
```xml
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```

**File Provider (for Android 7.0+):**
```xml
<provider
    android:name="androidx.core.content.FileProvider"
    android:authorities="${applicationId}.fileprovider"
    android:exported="false"
    android:grantUriPermissions="true">
    <meta-data
        android:name="android.support.FILE_PROVIDER_PATHS"
        android:resource="@xml/file_paths" />
</provider>
```

## 🧪 Testing

### Test on Real Device

1. **Install APK:**
```bash
adb install app-debug.apk
```

2. **Open App:**
- Navigate to any date with data
- Click "PDF" button
- Configure settings
- Click "Generate PDF"

3. **Verify:**
- ✅ Toast appears: "PDF saved: ..."
- ✅ "Open with..." dialog appears
- ✅ Multiple PDF apps listed
- ✅ Selecting app opens PDF
- ✅ PDF displays correctly

4. **Check File:**
```bash
adb shell ls /sdcard/Download/MPumpCalc/
```

### Test Without PDF Viewer

1. Uninstall all PDF viewers
2. Generate PDF
3. Should show: "No PDF viewer found"
4. Install a PDF app from Play Store
5. Try again

## 🐛 Troubleshooting

### "Open with..." Dialog Doesn't Appear

**Cause:** PDF viewer apps not installed or not responding to Intent

**Solution:**
```bash
# Check installed PDF apps
adb shell pm list packages | grep -i pdf

# Common PDF viewer packages:
# com.google.android.apps.docs (Drive)
# com.adobe.reader
# com.microsoft.office.officehub
```

### PDF Saved But Can't Open

**Cause:** File permissions or FileProvider issue

**Check:**
1. Verify `file_paths.xml` exists
2. Check FileProvider authority matches package name
3. Verify WRITE_EXTERNAL_STORAGE permission granted

### Android 11+ Storage Issues

**Android 11+** uses Scoped Storage. Update to use MediaStore API:

```java
// For Android 11+ (API 30+)
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
    ContentValues values = new ContentValues();
    values.put(MediaStore.Downloads.DISPLAY_NAME, fileName);
    values.put(MediaStore.Downloads.MIME_TYPE, "application/pdf");
    values.put(MediaStore.Downloads.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS + "/MPumpCalc");
    
    Uri uri = context.getContentResolver().insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values);
    // Write to uri...
}
```

## 📊 Comparison

### Before (Browser only):
```
Click PDF → Download → Manual open
```

### After (Android App):
```
Click PDF → Auto save → "Open with..." dialog → Select app → Opens
```

### Before (AppsGeyser):
```
Click PDF → Nothing (failed)
```

### After (Custom Android App):
```
Click PDF → Saved + Opens immediately
```

## 💡 Pro Tips

**1. Default PDF Viewer:**
- First time: Shows "Open with..." dialog
- User selects app and checks "Always"
- Next time: Opens directly in that app

**2. Clear Default:**
- Settings → Apps → Default apps → Opening links
- Find PDF viewer app
- Tap "Clear defaults"

**3. Multiple PDFs:**
- All PDFs saved in `/Downloads/MPumpCalc/` folder
- Easy to find and manage
- Can share via file manager

**4. File Manager Integration:**
- PDFs appear in Downloads folder
- Can be accessed via any file manager
- Can be shared via Bluetooth, Email, WhatsApp, etc.

## 🔄 Fallback Behavior

**Priority Order:**

1. **Android WebView** (Custom App):
   - Detects `window.MPumpCalcAndroid`
   - Saves file + Shows "Open with..." dialog
   - Best experience ⭐

2. **Chrome/Browser**:
   - Normal download
   - Shows download notification
   - User opens from notification

3. **Error Case**:
   - Falls back to download
   - User can manually open from Downloads

## 📝 Code Snippets

### Check if "Open with" Works

Add logging in MainActivity.java:

```java
@JavascriptInterface
public void openPdfWithViewer(String base64Pdf, String fileName) {
    Log.d("MPumpCalc", "Received PDF: " + fileName);
    Log.d("MPumpCalc", "Base64 length: " + base64Pdf.length());
    
    // ... rest of code
    
    Log.d("MPumpCalc", "PDF saved to: " + pdfFile.getAbsolutePath());
    Log.d("MPumpCalc", "Opening with chooser...");
}
```

### View Logs

```bash
adb logcat | grep MPumpCalc
```

## ✅ Final Checklist

Before distributing APK:

- [ ] MainActivity.java has PdfJavaScriptInterface
- [ ] JavaScript interface added to WebView
- [ ] Permissions in AndroidManifest.xml
- [ ] FileProvider configured
- [ ] file_paths.xml exists
- [ ] Tested on Android 7, 10, 11, 14
- [ ] Tested with Google Drive PDF Viewer
- [ ] Tested with Adobe Reader
- [ ] Tested without any PDF viewer
- [ ] Verified file saves correctly
- [ ] Verified "Open with..." appears

## 🎉 Result

Users get a seamless PDF experience:
- One tap to generate and open PDF
- Freedom to choose their favorite PDF viewer
- PDFs saved for later access
- Works like native Android apps
- Professional user experience

Perfect for business use! 🚀
