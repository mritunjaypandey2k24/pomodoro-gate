package com.gate.chronorpg.service

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Intent
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import androidx.core.app.NotificationCompat
import com.gate.chronorpg.R

class TimerNotificationService : Service() {
    private val handler = Handler(Looper.getMainLooper())
    private var remainingSeconds = 0
    private var isWorkMode = true

    private val ticker = object : Runnable {
        override fun run() {
            if (remainingSeconds > 0) remainingSeconds--
            updateNotification()
            handler.postDelayed(this, 1_000L)
        }
    }

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        when (intent?.action) {
            ACTION_STOP -> {
                handler.removeCallbacks(ticker)
                stopForeground(STOP_FOREGROUND_REMOVE)
                stopSelf()
            }

            ACTION_START, ACTION_UPDATE -> {
                remainingSeconds = intent.getIntExtra(EXTRA_REMAINING_SECONDS, remainingSeconds)
                isWorkMode = intent.getBooleanExtra(EXTRA_IS_WORK_MODE, isWorkMode)
                startForeground(NOTIFICATION_ID, buildNotification())
                handler.removeCallbacks(ticker)
                handler.post(ticker)
            }
        }
        return START_NOT_STICKY
    }

    override fun onDestroy() {
        handler.removeCallbacks(ticker)
        super.onDestroy()
    }

    override fun onBind(intent: Intent?): IBinder? = null

    private fun updateNotification() {
        getSystemService(NotificationManager::class.java)
            .notify(NOTIFICATION_ID, buildNotification())
    }

    private fun buildNotification(): Notification {
        val minutes = remainingSeconds / 60
        val seconds = remainingSeconds % 60
        val formatted = "%02d:%02d".format(minutes, seconds)
        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setSmallIcon(R.drawable.app_icon)
            .setContentTitle(if (isWorkMode) "GATE ChronoRPG • Focus" else "GATE ChronoRPG • Break")
            .setContentText(formatted)
            .setOngoing(true)
            .setOnlyAlertOnce(true)
            .setCategory(NotificationCompat.CATEGORY_PROGRESS)
            .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
            .setProgress(0, remainingSeconds, false)
            .build()
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "Timer",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Shows the active GATE ChronoRPG timer on the lock screen"
                setShowBadge(false)
            }
            getSystemService(NotificationManager::class.java).createNotificationChannel(channel)
        }
    }

    companion object {
        const val ACTION_START = "com.gate.chronorpg.action.START_TIMER"
        const val ACTION_UPDATE = "com.gate.chronorpg.action.UPDATE_TIMER"
        const val ACTION_STOP = "com.gate.chronorpg.action.STOP_TIMER"
        const val EXTRA_REMAINING_SECONDS = "remaining_seconds"
        const val EXTRA_IS_WORK_MODE = "is_work_mode"

        private const val CHANNEL_ID = "timer"
        private const val NOTIFICATION_ID = 1001
    }
}
