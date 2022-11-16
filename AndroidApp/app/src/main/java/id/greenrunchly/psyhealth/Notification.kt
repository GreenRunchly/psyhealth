package id.greenrunchly.psyhealth

import android.app.NotificationManager
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log
import androidx.core.app.NotificationCompat
import com.beust.klaxon.Klaxon
import okhttp3.*
import okhttp3.RequestBody.Companion.toRequestBody
import okio.IOException

var notificationID = 0
var channelID = "channel"
var titleExtra = "Ini Motivasi"
var messageExtra = "Ea ea ea ea :v"

class Notification : BroadcastReceiver()
{
    override fun onReceive(context: Context?, intent: Intent?) {
        Log.d("OHT", "Notification Broadcast")
        val payload = "test payload"
        val okHttpClient = OkHttpClient()
        val requestBody = payload.toRequestBody()
        val request = Request.Builder()
            .method("POST", requestBody)
            .url("https://app.ieu.link/psyhealth/get-motivasi")
            .build()
        okHttpClient.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                Log.d("OHT", "It Not works!")
            }

            override fun onResponse(call: Call, response: Response) {
                val respon = response.body?.string()
                if (respon != null) {

                    val hasilparse = Klaxon().parse<JsonMotivasi>(respon)

                    if (hasilparse != null) {
                        Log.d("OHT", hasilparse.result.toString())
                        if (hasilparse.result == 0){
                            titleExtra = hasilparse.motivasi.title
                            messageExtra = hasilparse.motivasi.message
                            Log.d("OHT","Calling A Server")

                            val notification = context?.let {
                                NotificationCompat.Builder(it, channelID)
                                    .setSmallIcon(R.drawable.logo_round_small)
                                    .setContentTitle(titleExtra)
                                    .setContentText(messageExtra)
                                    .setStyle(
                                        NotificationCompat.BigTextStyle().bigText(messageExtra)
                                    )
                                    .setDefaults(NotificationCompat.DEFAULT_SOUND)
                                    .build()
                            }

                            val manager =
                                context?.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
                            manager.notify(notificationID, notification)
                        }
                    }
                }
            }
        })
    }

}