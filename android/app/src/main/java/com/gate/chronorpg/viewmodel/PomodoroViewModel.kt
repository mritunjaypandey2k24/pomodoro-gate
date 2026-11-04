package com.gate.chronorpg.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.gate.chronorpg.model.*
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class TimerUiState(
    val timeLeftSeconds: Int = 25 * 60,
    val totalDurationSeconds: Int = 25 * 60,
    val workDurationMinutes: Int = 25,
    val isRunning: Boolean = false,
    val isWorkMode: Boolean = true,
    val selectedExam: ExamTrack = ExamTrack.DA,
    val selectedTopic: String = subjectsFor(ExamTrack.DA).first(),
    val currentStreak: Int = 0,
    val completedSessions: Int = 0
) {
    val progress: Float
        get() = if (totalDurationSeconds > 0) {
            (timeLeftSeconds.toFloat() / totalDurationSeconds.toFloat()).coerceIn(0f, 1f)
        } else {
            0f
        }

    val formattedTime: String
        get() {
            val mins = timeLeftSeconds / 60
            val secs = timeLeftSeconds % 60
            return "%02d:%02d".format(mins, secs)
        }
}

data class HeroUiState(
    val totalXp: Int = 0,
    val currentLevel: GateLevel = GATE_LEVELS[0],
    val nextLevel: GateLevel? = GATE_LEVELS[1],
    val completedSessions: Int = 0,
    val dailyGoal: Int = 6,
    val todaySessionsCount: Int = 0,
    val selectedExam: ExamTrack = ExamTrack.DA,
    val subjectXpMap: Map<String, Int> = subjectsFor(ExamTrack.DA).associateWith { 0 }
) {
    val levelProgress: Float
        get() {
            val next = nextLevel ?: return 1f
            val levelSpan = next.minXp - currentLevel.minXp
            if (levelSpan <= 0) return 0f
            return ((totalXp - currentLevel.minXp).toFloat() / levelSpan)
                .coerceIn(0f, 1f)
        }
}

class PomodoroViewModel : ViewModel() {
    private val _timerState = MutableStateFlow(TimerUiState())
    val timerState: StateFlow<TimerUiState> = _timerState.asStateFlow()

    private val _heroState = MutableStateFlow(HeroUiState())
    val heroState: StateFlow<HeroUiState> = _heroState.asStateFlow()

    private val _achievements = MutableStateFlow(
        listOf(
            Achievement("first_step", "First Step", "Complete 1 session done.", "🚀", 0, 1, false, 100),
            Achievement("deep_work_streak", "Deep Work Streak", "4 sessions in a row.", "🔥", 0, 4, false, 250),
            Achievement("syllabus_conqueror", "Syllabus Conqueror", "10 sessions in a single technical subject.", "⚔️", 0, 10, false, 500),
            Achievement("subject_specialist", "Subject Specialist", "Complete 5 sessions in one subject.", "📚", 0, 5, false, 200),
            Achievement("syllabus_explorer", "Syllabus Explorer", "Study 5 different subjects.", "🧭", 0, 5, false, 250),
            Achievement("century_club", "Century Club", "Accumulate 1,000 XP in GATE prep.", "⚡", 0, 1000, false, 300),
            Achievement("daily_discipline", "Daily Discipline", "Complete 6 sessions in one day.", "☀️", 0, 6, false, 300),
            Achievement("gate_ready", "GATE Ready", "Reach 5,000 XP in your selected exam.", "🏆", 0, 5000, false, 1000)
        )
    )
    val achievements: StateFlow<List<Achievement>> = _achievements.asStateFlow()

    private val _sessionCompleted = MutableStateFlow(false)
    val sessionCompleted: StateFlow<Boolean> = _sessionCompleted.asStateFlow()

    private var timerJob: Job? = null

    fun selectExam(exam: ExamTrack) {
        if (_timerState.value.isRunning) return
        val topics = subjectsFor(exam)
        _timerState.value = _timerState.value.copy(
            selectedExam = exam,
            selectedTopic = topics.first()
        )
        val current = _heroState.value
        _heroState.value = current.copy(
            selectedExam = exam,
            subjectXpMap = topics.associateWith { current.subjectXpMap[it] ?: 0 }
        )
    }

    fun selectTopic(topic: String) {
        if (_timerState.value.isRunning) return
        _timerState.value = _timerState.value.copy(selectedTopic = topic)
    }

    fun setWorkDuration(minutes: Int) {
        if (_timerState.value.isRunning) return
        val safeMinutes = minutes.coerceIn(1, 180)
        _timerState.value = _timerState.value.copy(
            workDurationMinutes = safeMinutes,
            timeLeftSeconds = safeMinutes * 60,
            totalDurationSeconds = safeMinutes * 60
        )
    }

    fun toggleTimer() {
        if (_timerState.value.isRunning) {
            pauseTimer()
        } else {
            startTimer()
        }
    }

    private fun startTimer() {
        _timerState.value = _timerState.value.copy(isRunning = true)
        timerJob = viewModelScope.launch {
            while (_timerState.value.timeLeftSeconds > 0) {
                delay(1000L)
                val newTime = _timerState.value.timeLeftSeconds - 1
                _timerState.value = _timerState.value.copy(timeLeftSeconds = newTime)
            }
            onSessionFinished()
        }
    }

    private fun pauseTimer() {
        timerJob?.cancel()
        _timerState.value = _timerState.value.copy(isRunning = false)
    }

    fun resetTimer() {
        pauseTimer()
        val duration = if (_timerState.value.isWorkMode) {
            _timerState.value.workDurationMinutes * 60
        } else {
            _timerState.value.totalDurationSeconds
        }
        _timerState.value = _timerState.value.copy(
            timeLeftSeconds = duration,
            totalDurationSeconds = duration
        )
    }

    fun fastForwardComplete() {
        pauseTimer()
        onSessionFinished()
    }

    fun skipBreak() {
        if (!_timerState.value.isWorkMode) {
            pauseTimer()
            switchToWork()
        }
    }

    fun clearSessionCompletedEvent() {
        _sessionCompleted.value = false
    }

    private fun onSessionFinished() {
        val current = _timerState.value
        if (current.isWorkMode) {
            // Award +100 XP
            val xpGain = XP_PER_SESSION
            val newXp = _heroState.value.totalXp + xpGain
            val newCompleted = _heroState.value.completedSessions + 1
            val newStreak = current.currentStreak + 1
            val newTodayCount = _heroState.value.todaySessionsCount + 1

            val updatedSubjectMap = _heroState.value.subjectXpMap.toMutableMap()
            updatedSubjectMap[current.selectedTopic] = (updatedSubjectMap[current.selectedTopic] ?: 0) + xpGain

            // Calculate level
            var lvl = GATE_LEVELS[0]
            for (i in GATE_LEVELS.indices.reversed()) {
                if (newXp >= GATE_LEVELS[i].minXp) {
                    lvl = GATE_LEVELS[i]
                    break
                }
            }
            val nextLvl = GATE_LEVELS.firstOrNull { it.level == lvl.level + 1 }
            _heroState.value = _heroState.value.copy(
                totalXp = newXp,
                currentLevel = lvl,
                nextLevel = nextLvl,
                completedSessions = newCompleted,
                todaySessionsCount = newTodayCount,
                subjectXpMap = updatedSubjectMap
            )

            // Evaluate achievements
            updateAchievements(newCompleted, newStreak, newXp, updatedSubjectMap)

            // Switch to break
            _timerState.value = _timerState.value.copy(
                isWorkMode = false,
                timeLeftSeconds = 5 * 60,
                totalDurationSeconds = 5 * 60,
                isRunning = false,
                currentStreak = newStreak,
                completedSessions = newCompleted
            )
            _sessionCompleted.value = true
        } else {
            // Switch back to work
            switchToWork()
            _sessionCompleted.value = true
        }
    }

    private fun switchToWork() {
        val duration = _timerState.value.workDurationMinutes * 60
        _timerState.value = _timerState.value.copy(
            isWorkMode = true,
            timeLeftSeconds = duration,
            totalDurationSeconds = duration,
            isRunning = false
        )
    }

    private fun updateAchievements(completed: Int, streak: Int, xp: Int, subjectXp: Map<String, Int>) {
        val list = _achievements.value.map { ach ->
            var prog = ach.progress
            var unlocked = ach.isUnlocked
            when (ach.id) {
                "first_step" -> prog = completed.coerceAtMost(1)
                "deep_work_streak" -> prog = maxOf(ach.progress, streak).coerceAtMost(4)
                "subject_specialist" -> prog = (subjectXp.values.maxOrNull() ?: 0) / 100
                "syllabus_explorer" -> prog = subjectXp.count { it.value > 0 }
                "century_club" -> prog = xp.coerceAtMost(1000)
                "daily_discipline" -> prog = completed.coerceAtMost(6)
                "gate_ready" -> prog = xp.coerceAtMost(5000)
            }
            if (!unlocked && prog >= ach.maxProgress) {
                unlocked = true
            }
            ach.copy(progress = prog, isUnlocked = unlocked)
        }
        _achievements.value = list
    }

    fun updateDailyGoal(goal: Int) {
        _heroState.value = _heroState.value.copy(dailyGoal = goal.coerceIn(1, 24))
    }
}
