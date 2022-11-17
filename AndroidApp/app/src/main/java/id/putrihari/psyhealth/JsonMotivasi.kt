package id.putrihari.psyhealth

data class JsonMotivasi(
    val motivasi: Motivasi,
    val pesan: String,
    val result: Int
)

data class Motivasi(
    val message: String,
    val title: String
)