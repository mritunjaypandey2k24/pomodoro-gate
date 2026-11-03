package com.gate.chronorpg.ui.screens

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.gate.chronorpg.ui.theme.PureBlack
import com.gate.chronorpg.ui.theme.SubtleSlate
import com.gate.chronorpg.viewmodel.PomodoroViewModel

@Composable
fun HeroProfileScreen(
    viewModel: PomodoroViewModel,
    modifier: Modifier = Modifier
) {
    val heroState by viewModel.heroState.collectAsState()

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .background(PureBlack)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        // 1. GATE Level Card
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = Color(0xFF09090B)),
                shape = RoundedCornerShape(20.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, Color(0xFF27272A), RoundedCornerShape(20.dp))
            ) {
                Column(modifier = Modifier.padding(18.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(
                                text = "LEVEL ${heroState.currentLevel.level} OF 10",
                                fontSize = 11.sp,
                                fontFamily = FontFamily.Monospace,
                                color = Color(0xFF71717A)
                            )
                            Text(
                                text = heroState.currentLevel.title,
                                fontSize = 20.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = Color.White
                            )
                            Text(
                                text = heroState.currentLevel.perk,
                                fontSize = 12.sp,
                                color = Color(0xFFA1A1AA)
                            )
                            Text(
                                text = heroState.selectedExam.displayName,
                                fontSize = 11.sp,
                                color = Color(0xFF71717A)
                            )
                        }
                        Text(
                            text = heroState.currentLevel.badge,
                            fontSize = 32.sp
                        )
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    LinearProgressIndicator(
                        progress = { heroState.levelProgress },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(6.dp)
                            .clip(RoundedCornerShape(3.dp)),
                        color = SubtleSlate,
                        trackColor = Color(0xFF18181B)
                    )

                    Spacer(modifier = Modifier.height(6.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(
                            text = "${(heroState.levelProgress * 100).toInt()}% Complete",
                            fontSize = 11.sp,
                            color = Color(0xFF71717A)
                        )
                        Text(
                            text = "${heroState.totalXp} XP",
                            fontSize = 11.sp,
                            fontFamily = FontFamily.Monospace,
                            color = Color.White
                        )
                    }
                }
            }
        }

        // 2. Daily Session Goal Tracker with Progress Ring
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = Color(0xFF09090B)),
                shape = RoundedCornerShape(20.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, Color(0xFF27272A), RoundedCornerShape(20.dp))
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    // SVG Progress Ring
                    Box(
                        contentAlignment = Alignment.Center,
                        modifier = Modifier.size(76.dp)
                    ) {
                        Canvas(modifier = Modifier.fillMaxSize()) {
                            val strokeWidth = 5.dp.toPx()
                            drawCircle(color = Color(0xFF18181B), style = Stroke(strokeWidth))
                            val frac = (heroState.todaySessionsCount.toFloat() / heroState.dailyGoal.toFloat()).coerceIn(0f, 1f)
                            drawArc(
                                color = SubtleSlate,
                                startAngle = -90f,
                                sweepAngle = 360f * frac,
                                useCenter = false,
                                style = Stroke(strokeWidth, cap = StrokeCap.Round)
                            )
                        }
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text(
                                text = "${heroState.todaySessionsCount}",
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color.White,
                                fontFamily = FontFamily.Monospace
                            )
                            Text(
                                text = "/ ${heroState.dailyGoal}",
                                fontSize = 10.sp,
                                color = Color(0xFF71717A),
                                fontFamily = FontFamily.Monospace
                            )
                        }
                    }

                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = "Daily Session Target",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Medium,
                            color = Color.White
                        )
                        val remaining = heroState.dailyGoal - heroState.todaySessionsCount
                        Text(
                            text = if (remaining <= 0) "Daily goal reached!" else "$remaining more session${if (remaining == 1) "" else "s"} to hit goal",
                            fontSize = 11.sp,
                            color = Color(0xFFA1A1AA)
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            listOf(4, 6, 8, 10).forEach { preset ->
                                FilterChip(
                                    selected = heroState.dailyGoal == preset,
                                    onClick = { viewModel.updateDailyGoal(preset) },
                                    label = { Text("$preset", fontSize = 10.sp) },
                                    colors = FilterChipDefaults.filterChipColors(
                                        selectedContainerColor = Color(0xFF27272A),
                                        selectedLabelColor = Color.White
                                    )
                                )
                            }
                        }
                    }
                }
            }
        }

        // 3. Subject XP Breakdown
        item {
            Text(
                text = "SUBJECT BREAKDOWN",
                fontSize = 11.sp,
                fontFamily = FontFamily.Monospace,
                color = Color(0xFF71717A)
            )
        }

        items(heroState.subjectXpMap.entries.toList()) { entry ->
            val xp = entry.value
            Card(
                colors = CardDefaults.cardColors(containerColor = Color(0xFF09090B)),
                shape = RoundedCornerShape(14.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, Color(0xFF18181B), RoundedCornerShape(14.dp))
            ) {
                Row(
                    modifier = Modifier.padding(14.dp).fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(text = entry.key, fontSize = 13.sp, color = Color.White)
                        Text(text = "${xp / 100} sessions", fontSize = 11.sp, color = Color(0xFF71717A))
                    }
                    Text(
                        text = "+$xp XP",
                        fontSize = 13.sp,
                        fontFamily = FontFamily.Monospace,
                        color = Color(0xFFA1A1AA)
                    )
                }
            }
        }
    }
}
