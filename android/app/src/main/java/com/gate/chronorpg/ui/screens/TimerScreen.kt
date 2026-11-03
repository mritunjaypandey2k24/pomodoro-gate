package com.gate.chronorpg.ui.screens

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.FastForward
import androidx.compose.material.icons.filled.Pause
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.gate.chronorpg.model.SubjectCategory
import com.gate.chronorpg.ui.theme.PureBlack
import com.gate.chronorpg.ui.theme.SubtleSlate
import com.gate.chronorpg.viewmodel.PomodoroViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TimerScreen(
    viewModel: PomodoroViewModel,
    modifier: Modifier = Modifier
) {
    val timerState by viewModel.timerState.collectAsState()
    val isWork = timerState.isWorkMode
    val accentColor = SubtleSlate

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(PureBlack)
            .padding(20.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        // 1. Subject Category Dropdown
        Column(modifier = Modifier.fillMaxWidth()) {
            Text(
                text = "GATE SUBJECT CATEGORY",
                style = MaterialTheme.typography.labelSmall,
                color = Color(0xFF71717A),
                fontFamily = FontFamily.Monospace
            )
            Spacer(modifier = Modifier.height(6.dp))

            var expanded by remember { mutableStateOf(false) }
            ExposedDropdownMenuBox(
                expanded = expanded,
                onExpandedChange = { expanded = !expanded }
            ) {
                OutlinedTextField(
                    value = timerState.selectedCategory.displayName,
                    onValueChange = {},
                    readOnly = true,
                    trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = expanded) },
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = Color(0xFF3F3F46),
                        unfocusedBorderColor = Color(0xFF27272A),
                        focusedContainerColor = Color(0xFF09090B),
                        unfocusedContainerColor = Color(0xFF09090B),
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White
                    ),
                    modifier = Modifier
                        .menuAnchor()
                        .fillMaxWidth()
                )
                ExposedDropdownMenu(
                    expanded = expanded,
                    onDismissRequest = { expanded = false },
                    modifier = Modifier.background(Color(0xFF09090B))
                ) {
                    SubjectCategory.values().forEach { category ->
                        DropdownMenuItem(
                            text = { Text(category.displayName, color = Color.White) },
                            onClick = {
                                viewModel.selectCategory(category)
                                expanded = false
                            }
                        )
                    }
                }
            }
        }

        // 2. Circular Monochromatic Countdown
        Box(
            contentAlignment = Alignment.Center,
            modifier = Modifier.size(260.dp)
        ) {
            Canvas(modifier = Modifier.fillMaxSize()) {
                val strokeWidth = 8.dp.toPx()
                // Track
                drawCircle(
                    color = Color(0xFF18181B),
                    style = Stroke(strokeWidth)
                )
                // Progress Arc
                drawArc(
                    color = accentColor,
                    startAngle = -90f,
                    sweepAngle = 360f * timerState.progress,
                    useCenter = false,
                    style = Stroke(strokeWidth, cap = StrokeCap.Round)
                )
            }

            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text(
                    text = timerState.formattedTime,
                    fontSize = 52.sp,
                    fontWeight = FontWeight.Light,
                    fontFamily = FontFamily.Monospace,
                    color = Color.White
                )
                Text(
                    text = if (isWork) "+100 XP REWARD" else "REST PERIOD",
                    fontSize = 11.sp,
                    fontFamily = FontFamily.Monospace,
                    color = Color(0xFFA1A1AA)
                )
                Text(
                    text = timerState.selectedTopic,
                    fontSize = 12.sp,
                    color = Color(0xFF71717A)
                )
            }
        }

        // 3. Tactile Minimal Controls
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.Center,
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(
                onClick = { viewModel.resetTimer() },
                modifier = Modifier
                    .size(48.dp)
                    .background(Color(0xFF09090B), CircleShape)
                    .border(1.dp, Color(0xFF27272A), CircleShape)
            ) {
                Icon(Icons.Default.Refresh, contentDescription = "Reset", tint = Color(0xFFA1A1AA))
            }

            Spacer(modifier = Modifier.width(20.dp))

            Button(
                onClick = { viewModel.toggleTimer() },
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF18181B)),
                shape = CircleShape,
                modifier = Modifier
                    .size(68.dp)
                    .border(1.dp, Color(0xFF3F3F46), CircleShape)
            ) {
                Icon(
                    imageVector = if (timerState.isRunning) Icons.Default.Pause else Icons.Default.PlayArrow,
                    contentDescription = "Toggle",
                    tint = Color.White,
                    modifier = Modifier.size(32.dp)
                )
            }

            Spacer(modifier = Modifier.width(20.dp))

            IconButton(
                onClick = { viewModel.fastForwardComplete() },
                modifier = Modifier
                    .size(48.dp)
                    .background(Color(0xFF09090B), CircleShape)
                    .border(1.dp, Color(0xFF27272A), CircleShape)
            ) {
                Icon(Icons.Default.FastForward, contentDescription = "Test Complete", tint = Color(0xFF71717A))
            }
        }
    }
}
