package com.gate.chronorpg.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.gate.chronorpg.model.Achievement
import com.gate.chronorpg.ui.theme.PureBlack
import com.gate.chronorpg.viewmodel.PomodoroViewModel

@Composable
fun AchievementsScreen(
    viewModel: PomodoroViewModel,
    modifier: Modifier = Modifier
) {
    val achievements by viewModel.achievements.collectAsState()
    val unlockedCount = achievements.count { it.isUnlocked }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(PureBlack)
            .padding(16.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "GATE BADGES",
                fontSize = 11.sp,
                fontFamily = FontFamily.Monospace,
                color = Color(0xFF71717A)
            )
            Text(
                text = "$unlockedCount / ${achievements.size} Unlocked",
                fontSize = 11.sp,
                fontFamily = FontFamily.Monospace,
                color = Color.White
            )
        }

        Spacer(modifier = Modifier.height(14.dp))

        LazyVerticalGrid(
            columns = GridCells.Fixed(2),
            horizontalArrangement = Arrangement.spacedBy(10.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            items(achievements) { badge ->
                val isUnlocked = badge.isUnlocked
                Card(
                    colors = CardDefaults.cardColors(containerColor = Color(0xFF09090B)),
                    shape = RoundedCornerShape(14.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .border(
                            1.dp,
                            if (isUnlocked) Color(0xFF3F3F46) else Color(0xFF18181B),
                            RoundedCornerShape(14.dp)
                        )
                        .alpha(if (isUnlocked) 1f else 0.4f)
                ) {
                    Column(
                        modifier = Modifier.padding(14.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text(text = badge.emojiIcon, fontSize = 28.sp)
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = badge.title,
                            fontSize = 12.sp,
                            color = if (isUnlocked) Color.White else Color(0xFF71717A)
                        )
                        Text(
                            text = if (isUnlocked) "+${badge.xpReward} XP" else "${badge.progress}/${badge.maxProgress}",
                            fontSize = 10.sp,
                            fontFamily = FontFamily.Monospace,
                            color = Color(0xFFA1A1AA)
                        )
                    }
                }
            }
        }
    }
}
