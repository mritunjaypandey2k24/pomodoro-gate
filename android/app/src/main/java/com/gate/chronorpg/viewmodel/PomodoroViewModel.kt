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
    val isRunning: Boolean = false,
    val isWorkMode: Boolean = true,
    val selectedCategory: SubjectCategory = SubjectCategory.ENGINEERING_MATH,
    val selectedTopic: String = "Linear Algebra",
    val currentStreak: Int = 0
) {
    val progress: Float
        get() = (1f - (timeLeftSeconds.toFloat() / totalDurationSeconds.toFloat())).coerceIn(0f, 1f)

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
    val levelProgress: Float = 0f,
    val completedSessions: Int = 0,
    val dailyGoal: Int = 6,
    val todaySessionsCount: Int = 0,
    val subjectXpMap: Map<SubjectCategory, Int> = mapOf(
        SubjectCategory.ENGINEERING_MATH to 0,
        SubjectCategory.CORE_TECHNICAL to 0,
        SubjectCategory.GENERAL_APTITUDE to 0
    )
)

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
            Achievement("maths_virtuoso", "Maths Virtuoso", "5 sessions in Engineering Maths.", "📐", 0, 5, false, 200),
            Achievement("aptitude_ace", "Aptitude Ace", "5 sessions in General Aptitude.", "💡", 0, 5, false, 200),
            Achievement("century_club", "Century Club", "Accumulate 1,000 XP in GATE prep.", "⚡", 0, 1000, false, 300)
        )
    )
    val achievements: StateFlow<List<Achievement>> = _achievements.asStateFlow()

    private var timerJob: Job? = null

    fun selectCategory(category: SubjectCategory) {
        val defaultTopic = when (category) {
            SubjectCategory.ENGINEERING_MATH -> "Linear Algebra"
            SubjectCategory.CORE_TECHNICAL -> "Algorithms & Data Structures"
            SubjectCategory.GENERAL_APTITUDE -> "Numerical Ability"
        }
        _timerState.value = _timerState.value.copy(
            selectedCategory = category,
            selectedTopic = defaultTopic
        )
    }

    fun selectTopic(topic: String) {
        _timerState.value = _timerState.value.copy(selectedTopic = topic)
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
        val duration = if (_timerState.value.isWorkMode) 25 * 60 else 5 * 60
        _timerState.value = _timerState.value.copy(timeLeftSeconds = duration)
    }

    fun fastForwardComplete() {
        pauseTimer()
        onSessionFinished()
    }

    private fun onSessionFinished() {
        val current = _timerState.value
        if (current.isWorkMode) {
            // Award +100 XP
            val xpGain = 100
            val newXp = _heroState.value.totalXp + xpGain
            val newCompleted = _heroState.value.completedSessions + 1
            val newStreak = current.currentStreak + 1
            val newTodayCount = _heroState.value.todaySessionsCount + 1

            val updatedSubjectMap = _heroState.value.subjectXpMap.toMutableMap()
            updatedSubjectMap[current.selectedCategory] = (updatedSubjectMap[current.selectedCategory] ?: 0) + xpGain

            // Calculate level
            var lvl = GATE_LEVELS[0]
            for (i in GATE_LEVELS.indices.reversed()) {
                if (newXp >= GATE_LEVELS[i].minXp) {
                    lvl = GATE_LEVELS[i]
                    break
                }
            }
            val nextLvl = GATE_LEVELS.firstOrNull { it.level == lvl.level + 1 }
            val progressFrac = if (nextLvl != null) {
                ((newXp - lvl.minXp).toFloat() / (nextLvl.minXp - lvl.minXp).toFloat()).coerceIn(0f, 1f)
            } else 1f

            _heroState.value = _heroState.value.copy(
                totalXp = newXp,
                currentLevel = lvl,
                nextLevel = nextLvl,
                levelProgress = progressFrac,
                completedSessions = newCompleted,
                todaySessionsCount = newTodayCount,
                subjectXpMap = updatedSubjectMap
            )

            // Evaluate achievements
            updateAchievements(newCompleted, newStreak, newXp)

            // Switch to break
            _timerState.value = _timerState.value.copy(
                isWorkMode = false,
                timeLeftSeconds = 5 * 60,
                totalDurationSeconds = 5 * 60,
                isRunning = false,
                currentStreak = newStreak
            )
        } else {
            // Switch back to work
            _timerState.value = _timerState.value.copy(
                isWorkMode = true,
                timeLeftSeconds = 25 * 60,
                totalDurationSeconds = 25 * 60,
                isRunning = false
            )
        }
    }

    private fun updateAchievements(completed: Int, streak: Int, xp: Int) {
        val list = _achievements.value.map { ach ->
            var prog = ach.progress
            var unlocked = ach.isUnlocked
            when (ach.id) {
                "first_step" -> prog = completed.coerceAtMost(1)
                "deep_work_streak" -> prog = maxOf(ach.progress, streak).coerceAtMost(4)
                "century_club" -> prog = xp.coerceAtMost(1000)
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
