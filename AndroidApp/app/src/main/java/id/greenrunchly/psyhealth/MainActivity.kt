package id.greenrunchly.psyhealth

import android.app.*
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.provider.Settings
import android.util.Log
import android.view.KeyEvent
import android.view.MotionEvent
import android.view.View
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity
import okhttp3.*
import java.util.*

class MainActivity : AppCompatActivity() {


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        scheduleNotification(5,0)
        createNotificationChannel()

        val uniqueID: String =
            Settings.Secure.getString(contentResolver, Settings.Secure.ANDROID_ID)
        ///Log.d("IDPerangkat",uniqueID)

        val mWebView = findViewById<View>(R.id.WebView) as WebView

        val webSetting = mWebView.settings
        webSetting.javaScriptEnabled = true
        webSetting.allowFileAccess = true
        webSetting.domStorageEnabled = true
        webSetting.allowFileAccess = true

        mWebView.webViewClient = WebViewClient()
        mWebView.scrollBarStyle = View.SCROLLBARS_INSIDE_OVERLAY
        mWebView.isVerticalScrollBarEnabled = false
        mWebView.isHorizontalScrollBarEnabled = false

        mWebView.loadUrl("file:///android_asset/check-socket.html?uniq_id=$uniqueID")

        class MyWebViewClient : WebViewClient() {

            @Deprecated("Deprecated in Java")
            override fun shouldOverrideUrlLoading(view: WebView?, url: String?): Boolean {
                if (url != null && (url.startsWith("file:///android_asset/settings-apply.html?apply"))){
                    Log.d("URL","Theme applied!")
                }
                if (url != null && (url.startsWith("file:///"))) {
                    return false
                } else {
                    // Otherwise, the link is not for a page on my site, so launch another Activity that handles URLs
                    Intent(Intent.ACTION_VIEW, Uri.parse(url)).apply {
                        startActivity(this); return true
                    }
                }
            }
        }

        val myWebView: WebView = mWebView
        myWebView.webViewClient = MyWebViewClient()

        mWebView.canGoBack()
        mWebView.setOnKeyListener(View.OnKeyListener { _, keyCode, event ->
            if (keyCode == KeyEvent.KEYCODE_BACK && event.action == MotionEvent.ACTION_UP && mWebView.canGoBack()) {
                mWebView.goBack()
                return@OnKeyListener true
            }
            false
        })
    }

    private fun scheduleNotification(waktuJam : Int,waktuMenit : Int) {

        val intent = Intent(applicationContext, Notification::class.java)
        val pendingIntent = PendingIntent.getBroadcast(
            applicationContext,
            notificationID,
            intent,
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )
        val calendar: Calendar = Calendar.getInstance().apply {
            timeInMillis = System.currentTimeMillis()
            set(Calendar.HOUR_OF_DAY, waktuJam)
            set(Calendar.MINUTE, waktuMenit)
        }
        val alarmManager = getSystemService(ALARM_SERVICE) as AlarmManager
        val time = calendar.timeInMillis

        alarmManager.setRepeating(
            AlarmManager.RTC_WAKEUP,
            time,
            300000,
            pendingIntent
        )
        /*
        * alarmManager.setExactAndAllowWhileIdle(
            AlarmManager.RTC_WAKEUP,
            time,
            pendingIntent
        )
        * */
    }

    private fun createNotificationChannel() {
        val name = "Notif Channel"
        val desc = "Deskripsi Notif"
        val importance = NotificationManager.IMPORTANCE_DEFAULT
        val channel = NotificationChannel(channelID, name, importance)
        channel.description = desc
        val notificationManager = getSystemService(NOTIFICATION_SERVICE) as NotificationManager
        notificationManager.createNotificationChannel(channel)
    }

    /*private fun showAlert(time: Long, title: String, message: String) {
        val date = Date(time)
        val dateFormat = DateFormat.getLongDateFormat(applicationContext)
        val timeFormat = DateFormat.getTimeFormat(applicationContext)

        AlertDialog.Builder(this)
            .setTitle("Notifikasi Jadwal Tips")
            .setMessage(
                "Title:" + title + "\n Message:" + message + "\nAt: "+ dateFormat.format(date) + " " + timeFormat.format(date))
            .show()
    }*/



}