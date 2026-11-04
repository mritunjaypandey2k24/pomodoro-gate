package com.gate.chronorpg.model

const val XP_PER_SESSION = 100

enum class ExamTrack(val displayName: String) {
    DA("GATE DA · Data Science & AI"),
    CS("GATE CS · Computer Science"),
    EC("GATE EC · Electronics & Communication"),
    EE("GATE EE · Electrical Engineering"),
    ME("GATE ME · Mechanical Engineering"),
    CE("GATE CE · Civil Engineering")
}

fun subjectsFor(exam: ExamTrack): List<String> = when (exam) {
    ExamTrack.DA -> listOf(
        "Probability & Statistics",
        "Linear Algebra",
        "Calculus & Optimization",
        "Programming in Python & Data Structures",
        "Algorithms",
        "Database Management Systems",
        "Machine Learning",
        "Artificial Intelligence",
        "General Aptitude"
    )
    ExamTrack.CS -> listOf(
        "Engineering Mathematics",
        "Digital Logic",
        "Computer Organization",
        "Programming & Data Structures",
        "Algorithms",
        "Theory of Computation",
        "Compiler Design",
        "Operating Systems",
        "Databases",
        "Computer Networks",
        "General Aptitude"
    )
    ExamTrack.EC -> listOf(
        "Engineering Mathematics",
        "Networks",
        "Signals & Systems",
        "Electronic Devices",
        "Analog Circuits",
        "Digital Circuits",
        "Control Systems",
        "Communications",
        "Electromagnetics",
        "General Aptitude"
    )
    ExamTrack.EE -> listOf(
        "Engineering Mathematics",
        "Electric Circuits",
        "Electromagnetic Fields",
        "Signals & Systems",
        "Electrical Machines",
        "Power Systems",
        "Control Systems",
        "Measurements",
        "Power Electronics",
        "General Aptitude"
    )
    ExamTrack.ME -> listOf(
        "Engineering Mathematics",
        "Applied Mechanics",
        "Engineering Materials",
        "Theory of Machines",
        "Thermodynamics",
        "Fluid Mechanics",
        "Heat Transfer",
        "Manufacturing",
        "Industrial Engineering",
        "General Aptitude"
    )
    ExamTrack.CE -> listOf(
        "Engineering Mathematics",
        "Structural Engineering",
        "Geotechnical Engineering",
        "Water Resources",
        "Environmental Engineering",
        "Transportation Engineering",
        "Geomatics",
        "Construction Management",
        "Engineering Geology",
        "General Aptitude"
    )
}

typealias SubjectCategory = String

data class GateLevel(
    val level: Int,
    val title: String,
    val minXp: Int,
    val maxXp: Int,
    val badge: String,
    val perk: String
)

val GATE_LEVELS = listOf(
    GateLevel(1, "GATE Aspirant", 0, 200, "🌱", "Formula Foundation Unlocked"),
    GateLevel(2, "Formula Initiate", 200, 500, "⚡", "PYQ Solver Streak Activated"),
    GateLevel(3, "Problem Solver", 500, 900, "🧩", "Precision Speed +10%"),
    GateLevel(4, "Concept Alchemist", 900, 1400, "🔥", "Virtual Calculator Master"),
    GateLevel(5, "Mock Vanguard", 1400, 2000, "🛡️", "Rank Predictor Tier 1"),
    GateLevel(6, "Syllabus Titan", 2000, 2800, "⚔️", "High-Weightage Domination"),
    GateLevel(7, "Top 500 Contender", 2800, 3800, "💎", "PSU Interview Shortlist"),
    GateLevel(8, "Top 100 Elite", 3800, 5000, "👑", "IIT Direct Admit Zone"),
    GateLevel(9, "IISc Scholar", 5000, 6500, "🌌", "Gold Medalist Aura"),
    GateLevel(10, "AIR 1 Prodigy", 6500, 10000, "🏆", "GATE Legend Immortalized")
)

data class Achievement(
    val id: String,
    val title: String,
    val description: String,
    val emojiIcon: String,
    val progress: Int,
    val maxProgress: Int,
    val isUnlocked: Boolean,
    val xpReward: Int
)

data class SessionRecord(
    val id: String,
    val timestamp: Long,
    val durationMinutes: Int,
    val category: SubjectCategory,
    val topic: String,
    val xpEarned: Int
)
