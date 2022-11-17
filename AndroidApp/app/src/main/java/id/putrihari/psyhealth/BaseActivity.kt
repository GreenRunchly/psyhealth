@file:Suppress("DEPRECATION")

package id.putrihari.psyhealth

import android.os.Bundle
import android.preference.PreferenceManager
import androidx.appcompat.app.AppCompatActivity

@Suppress("DEPRECATION")
abstract class BaseActivity : AppCompatActivity() {

    private var currentTheme = PAGI

    override fun onCreate(savedInstanceState: Bundle?) {
        currentTheme = PreferenceManager.getDefaultSharedPreferences(this).getInt(KEY_THEME, PAGI)
        super.onCreate(savedInstanceState)
    }

    protected fun setTheme() { setTheme(currentTheme) }
    protected fun switchTheme() {
        currentTheme = when(currentTheme) {
            PAGI -> MALAM
            MALAM -> PAGI
            else -> -1
        }

        PreferenceManager.getDefaultSharedPreferences(this).edit().putInt(KEY_THEME, currentTheme).apply()
    }
    protected fun switchThemeManual(settheme:Int) {
        PreferenceManager.getDefaultSharedPreferences(this).edit().putInt(KEY_THEME, settheme).apply()
    }

    companion object {
        private const val KEY_THEME = "Theme"
        const val PAGI = R.style.mainAppTheme
        const val MALAM = R.style.mainAppThemeNight
    }
}