package com.mpumpcalc.app;

import android.Manifest;
import android.app.DownloadManager;
import android.content.ContentResolver;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.CancellationSignal;
import android.os.Environment;
import android.os.ParcelFileDescriptor;
import android.print.PageRange;
import android.print.PrintAttributes;
import android.print.PrintDocumentAdapter;
import android.print.PrintDocumentInfo;
import android.print.PrintManager;
import android.provider.MediaStore;
import android.util.Base64;
import android.webkit.CookieManager;
import android.webkit.DownloadListener;
import android.webkit.JavascriptInterface;
import android.webkit.URLUtil;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.core.content.FileProvider;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;

public class MainActivity extends AppCompatActivity {

    private WebView webView;
    // Load from local assets for offline functionality
    private static final String APP_URL = "file:///android_asset/index.html";
    private static final int SELECT_JSON_FILE_REQUEST = 102;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Initialize WebView
        webView = findViewById(R.id.webview);
        setupWebView();

        // Load app
        webView.loadUrl(APP_URL);
    }

    private void setupWebView() {
        WebSettings webSettings = webView.getSettings();
        
        // Enable JavaScript
        webSettings.setJavaScriptEnabled(true);
        
        // Add JavaScript Interface for PDF handling
        webView.addJavascriptInterface(new PdfJavaScriptInterface(this), "MPumpCalcAndroid");
        
        // Enable DOM Storage for localStorage
        webSettings.setDomStorageEnabled(true);
        
        // Enable Database
        webSettings.setDatabaseEnabled(true);

        // Enable Zoom
        webSettings.setSupportZoom(true);
        webSettings.setBuiltInZoomControls(false);
        webSettings.setDisplayZoomControls(false);
        
        // Enable viewport
        webSettings.setUseWideViewPort(true);
        webSettings.setLoadWithOverviewMode(true);
        
        // Enable file access
        webSettings.setAllowFileAccess(true);
        webSettings.setAllowContentAccess(true);
        
        // Allow file URLs to access other file URLs (needed for loading JS/CSS from assets)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN) {
            webSettings.setAllowFileAccessFromFileURLs(true);
            webSettings.setAllowUniversalAccessFromFileURLs(true);
        }
        
        // Mixed content mode
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            webSettings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        }
        
        // Set User Agent
        String userAgent = webSettings.getUserAgentString();
        webSettings.setUserAgentString(userAgent + " MPumpCalc/1.0");
        
        // WebView Client
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                view.loadUrl(url);
                return true;
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                // Inject CSS to hide any unwanted elements if needed
            }
        });
        
        // WebChrome Client for alerts, confirm, etc
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                super.onProgressChanged(view, newProgress);
                // You can add a progress bar here
            }
        });
        
        // Download Listener for PDF downloads
        webView.setDownloadListener(new DownloadListener() {
            @Override
            public void onDownloadStart(String url, String userAgent, String contentDisposition,
                                        String mimeType, long contentLength) {
                downloadFile(url, userAgent, contentDisposition, mimeType);
            }
        });
    }

    private void downloadFile(String url, String userAgent, String contentDisposition, String mimeType) {
        try {
            DownloadManager.Request request = new DownloadManager.Request(Uri.parse(url));
            request.setMimeType(mimeType);
            
            String cookies = CookieManager.getInstance().getCookie(url);
            request.addRequestHeader("cookie", cookies);
            request.addRequestHeader("User-Agent", userAgent);
            
            request.setDescription("Downloading file...");
            request.setTitle(URLUtil.guessFileName(url, contentDisposition, mimeType));
            
            request.allowScanningByMediaScanner();
            request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
            request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS,
                    URLUtil.guessFileName(url, contentDisposition, mimeType));
            
            DownloadManager dm = (DownloadManager) getSystemService(DOWNLOAD_SERVICE);
            dm.enqueue(request);
            
            Toast.makeText(getApplicationContext(), "Downloading...", Toast.LENGTH_SHORT).show();
        } catch (Exception e) {
            e.printStackTrace();
            Toast.makeText(getApplicationContext(), "Download failed", Toast.LENGTH_SHORT).show();
        }
    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }


    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        
        if (requestCode == SELECT_JSON_FILE_REQUEST && resultCode == RESULT_OK) {
            if (data != null) {
                Uri uri = data.getData();
                if (uri != null) {
                    readJsonFile(uri);
                }
            }
        }
    }

    private void readJsonFile(Uri uri) {
        try {
            ContentResolver resolver = getContentResolver();
            InputStream inputStream = resolver.openInputStream(uri);
            
            if (inputStream != null) {
                StringBuilder stringBuilder = new StringBuilder();
                byte[] buffer = new byte[1024];
                int bytesRead;
                
                while ((bytesRead = inputStream.read(buffer)) != -1) {
                    stringBuilder.append(new String(buffer, 0, bytesRead));
                }
                
                inputStream.close();
                
                final String jsonData = stringBuilder.toString();
                
                // Call JavaScript function to handle import
                runOnUiThread(() -> {
                    // Escape the JSON string properly for JavaScript
                    String escapedJson = jsonData
                        .replace("\\", "\\\\")
                        .replace("\"", "\\\"")
                        .replace("\n", "\\n")
                        .replace("\r", "\\r")
                        .replace("\t", "\\t");
                    
                    String jsCode = "if (typeof window.handleAndroidImport === 'function') { " +
                                   "window.handleAndroidImport(\"" + escapedJson + "\"); " +
                                   "}";
                    
                    webView.evaluateJavascript(jsCode, null);
                    Toast.makeText(MainActivity.this, "Loading backup data...", Toast.LENGTH_SHORT).show();
                });
            }
        } catch (Exception e) {
            e.printStackTrace();
            runOnUiThread(() -> {
                Toast.makeText(MainActivity.this, "Failed to read file: " + e.getMessage(), Toast.LENGTH_LONG).show();
            });
        }
    }


    @Override
    protected void onResume() {
        super.onResume();
        webView.onResume();
    }

    @Override
    protected void onPause() {
        super.onPause();
        webView.onPause();
    }

    @Override
    protected void onDestroy() {
        if (webView != null) {
            webView.destroy();
        }
        super.onDestroy();
    }

    // JavaScript Interface for PDF handling
    public class PdfJavaScriptInterface {
        Context context;

        PdfJavaScriptInterface(Context c) {
            context = c;
        }

        @JavascriptInterface
        public void printPdf(String base64Pdf, String fileName) {
            try {
                // Decode base64 to bytes
                byte[] pdfBytes = Base64.decode(base64Pdf, Base64.DEFAULT);
                
                // Save to cache (temporary file)
                File cacheDir = context.getCacheDir();
                File pdfFile = new File(cacheDir, fileName);
                
                FileOutputStream fos = new FileOutputStream(pdfFile);
                fos.write(pdfBytes);
                fos.close();
                
                // Open Android Print Dialog
                runOnUiThread(() -> {
                    printPdfFile(pdfFile, fileName);
                });
                
            } catch (IOException e) {
                e.printStackTrace();
                runOnUiThread(() -> {
                    Toast.makeText(context, "Failed to prepare PDF for printing", Toast.LENGTH_SHORT).show();
                });
            }
        }

        private void printPdfFile(File pdfFile, String jobName) {
            // Get PrintManager
            PrintManager printManager = (PrintManager) context.getSystemService(Context.PRINT_SERVICE);
            
            if (printManager != null) {
                // Create print document adapter
                PrintDocumentAdapter printAdapter = new PdfPrintDocumentAdapter(pdfFile, jobName);
                
                // Start print job
                printManager.print(jobName, printAdapter, null);
                
                Toast.makeText(context, "Opening print dialog...", Toast.LENGTH_SHORT).show();
            } else {
                Toast.makeText(context, "Print service not available", Toast.LENGTH_SHORT).show();
            }
        }

        @JavascriptInterface
        public void openPdfWithViewer(String base64Pdf, String fileName) {
            // Directly save PDF using MediaStore (no permissions needed for Android 10+)
            savePdfFile(base64Pdf, fileName);
        }

        private void savePdfFile(String base64Pdf, String fileName) {
            try {
                // Decode base64 PDF data
                byte[] pdfBytes = Base64.decode(base64Pdf, Base64.DEFAULT);

                // Use MediaStore to save PDF (works on Android 10+ without permissions)
                ContentResolver resolver = context.getContentResolver();
                ContentValues contentValues = new ContentValues();
                contentValues.put(MediaStore.MediaColumns.DISPLAY_NAME, fileName);
                contentValues.put(MediaStore.MediaColumns.MIME_TYPE, "application/pdf");
                contentValues.put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS);

                // Insert new PDF file into MediaStore
                Uri pdfUri = resolver.insert(MediaStore.Files.getContentUri("external"), contentValues);

                if (pdfUri != null) {
                    // Write PDF data to the file
                    try (OutputStream os = resolver.openOutputStream(pdfUri)) {
                        if (os != null) {
                            os.write(pdfBytes);
                            os.flush();
                        }
                    }

                    // Automatically open the PDF file
                    openPdfFileWithUri(pdfUri);

                } else {
                    throw new IOException("Failed to create new MediaStore record.");
                }

            } catch (IOException e) {
                e.printStackTrace();
                runOnUiThread(() -> {
                    Toast.makeText(context, "Failed to save PDF: " + e.getMessage(), Toast.LENGTH_LONG).show();
                });
            } catch (Exception e) {
                e.printStackTrace();
                runOnUiThread(() -> {
                    Toast.makeText(context, "An error occurred: " + e.getMessage(), Toast.LENGTH_LONG).show();
                });
            }
        }

        private void openPdfFileWithUri(Uri uri) {
            Intent intent = new Intent(Intent.ACTION_VIEW);
            intent.setDataAndType(uri, "application/pdf");
            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_ACTIVITY_NO_HISTORY);

            try {
                context.startActivity(intent);
            } catch (Exception e) {
                e.printStackTrace();
                runOnUiThread(() -> {
                    Toast.makeText(context, "No PDF viewer app found. Please install a PDF reader.", Toast.LENGTH_LONG).show();
                });
            }
        }


        @JavascriptInterface
        public void saveJsonBackup(String jsonData, String fileName) {
            try {
                // Use MediaStore to save JSON backup file
                ContentResolver resolver = context.getContentResolver();
                ContentValues contentValues = new ContentValues();
                contentValues.put(MediaStore.MediaColumns.DISPLAY_NAME, fileName);
                contentValues.put(MediaStore.MediaColumns.MIME_TYPE, "application/json");
                contentValues.put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS);

                // Insert new JSON file into MediaStore
                Uri jsonUri = resolver.insert(MediaStore.Files.getContentUri("external"), contentValues);

                if (jsonUri != null) {
                    // Write JSON data to the file
                    try (OutputStream os = resolver.openOutputStream(jsonUri)) {
                        if (os != null) {
                            os.write(jsonData.getBytes());
                            os.flush();
                        }
                    }

                    // Show success message
                    runOnUiThread(() -> {
                        Toast.makeText(context, "Backup saved to Downloads: " + fileName, Toast.LENGTH_LONG).show();
                    });

                } else {
                    throw new IOException("Failed to create backup file.");
                }

            } catch (IOException e) {
                e.printStackTrace();
                runOnUiThread(() -> {
                    Toast.makeText(context, "Failed to save backup: " + e.getMessage(), Toast.LENGTH_LONG).show();
                });
            } catch (Exception e) {
                e.printStackTrace();
                runOnUiThread(() -> {
                    Toast.makeText(context, "An error occurred: " + e.getMessage(), Toast.LENGTH_LONG).show();
                });
            }
        }

        @JavascriptInterface
        public void selectJsonBackup() {
            runOnUiThread(() -> {
                Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
                intent.addCategory(Intent.CATEGORY_OPENABLE);
                intent.setType("application/json");
                intent.putExtra(Intent.EXTRA_MIME_TYPES, new String[]{"application/json", "text/plain"});
                
                try {
                    MainActivity.this.startActivityForResult(intent, SELECT_JSON_FILE_REQUEST);
                } catch (Exception e) {
                    e.printStackTrace();
                    Toast.makeText(context, "Failed to open file picker", Toast.LENGTH_SHORT).show();
                }
            });
        }



        private void openPdfFile(File file) {
            Uri uri;
            
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                // For Android 7.0+ use FileProvider
                uri = FileProvider.getUriForFile(
                        context,
                        context.getApplicationContext().getPackageName() + ".fileprovider",
                        file
                );
            } else {
                uri = Uri.fromFile(file);
            }
            
            Intent intent = new Intent(Intent.ACTION_VIEW);
            intent.setDataAndType(uri, "application/pdf");
            intent.setFlags(Intent.FLAG_ACTIVITY_NO_HISTORY);
            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            
            // Create chooser to show "Open with..." dialog
            Intent chooser = Intent.createChooser(intent, "Open PDF with");
            
            try {
                context.startActivity(chooser);
            } catch (Exception e) {
                runOnUiThread(() -> {
                    Toast.makeText(context, "No PDF viewer found. Please install a PDF reader app.", Toast.LENGTH_LONG).show();
                });
            }
        }
    }

    // Print Document Adapter for PDF
    private class PdfPrintDocumentAdapter extends PrintDocumentAdapter {
        private File pdfFile;
        private String jobName;

        PdfPrintDocumentAdapter(File pdfFile, String jobName) {
            this.pdfFile = pdfFile;
            this.jobName = jobName;
        }

        @Override
        public void onLayout(PrintAttributes oldAttributes, PrintAttributes newAttributes,
                           CancellationSignal cancellationSignal, LayoutResultCallback callback,
                           Bundle extras) {
            if (cancellationSignal.isCanceled()) {
                callback.onLayoutCancelled();
                return;
            }

            PrintDocumentInfo info = new PrintDocumentInfo.Builder(jobName)
                    .setContentType(PrintDocumentInfo.CONTENT_TYPE_DOCUMENT)
                    .setPageCount(PrintDocumentInfo.PAGE_COUNT_UNKNOWN)
                    .build();

            callback.onLayoutFinished(info, true);
        }

        @Override
        public void onWrite(PageRange[] pages, ParcelFileDescriptor destination,
                          CancellationSignal cancellationSignal, WriteResultCallback callback) {
            try {
                FileInputStream input = new FileInputStream(pdfFile);
                FileOutputStream output = new FileOutputStream(destination.getFileDescriptor());

                byte[] buffer = new byte[8192];
                int bytesRead;

                while ((bytesRead = input.read(buffer)) != -1) {
                    if (cancellationSignal.isCanceled()) {
                        callback.onWriteCancelled();
                        input.close();
                        output.close();
                        return;
                    }
                    output.write(buffer, 0, bytesRead);
                }

                input.close();
                output.close();

                callback.onWriteFinished(new PageRange[]{PageRange.ALL_PAGES});

            } catch (IOException e) {
                e.printStackTrace();
                callback.onWriteFailed(e.getMessage());
            }
        }
    }
}