import React, { useState } from 'react';
import { Copy, Check, Code, X, FileCode, Download } from 'lucide-react';

interface ComposeCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const KOTLIN_CODE_SNIPPETS: { title: string; filename: string; code: string }[] = [
  {
    title: 'Timer Screen Composable',
    filename: 'TimerScreen.kt',
    code: `package com.gate.chronorpg.ui.screens

import androidx.compose.animation.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.gate.chronorpg.model.SubjectCategory
import com.gate.chronorpg.ui.theme.NeonElectricBlue
import com.gate.chronorpg.ui.theme.NeonSoftGreen
import com.gate.chronorpg.viewmodel.PomodoroViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TimerScreen(
    viewModel: PomodoroViewModel,
    modifier: Modifier = Modifier
) {
    val timerState by viewModel.timerState.collectAsState()
    val isWorkMode = timerState.isWorkMode
    val accentColor = if (isWorkMode) NeonElectricBlue else NeonSoftGreen

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(Color(0xFF0B0F19))
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        // 1. Subject Category Dropdown (Required before starting)
        Column(modifier = Modifier.fillMaxWidth()) {
            Text(
                text = "TARGET GATE DISCIPLINE",
                style = MaterialTheme.typography.labelSmall,
                color = Color(0xFF64748B),
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
                        focusedBorderColor = accentColor,
                        unfocusedBorderColor = Color(0xFF1E293B),
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White
                    ),
                    modifier = Modifier
                        .menuAnchor()
                        .fillMaxWidth()
                )
                ExposedDropdownMenu(
                    expanded = expanded,
                    onDismissRequest = { expanded = false }
                ) {
                    SubjectCategory.values().forEach { category ->
                        DropdownMenuItem(
                            text = { Text(category.displayName) },
                            onClick = {
                                viewModel.selectCategory(category)
                                expanded = false
                            }
                        )
                    }
                }
            }
        }

        // 2. Neon Sci-Fi Circular Countdown
        Box(
            contentAlignment = Alignment.Center,
            modifier = Modifier.size(280.dp)
        ) {
            Canvas(modifier = Modifier.fillMaxSize()) {
                val strokeWidth = 14.dp.toPx()
                // Track
                drawCircle(
                    color = Color(0xFF1E293B),
                    style = Stroke(strokeWidth)
                )
                // Glowing Progress Arc
                drawArc(
                    brush = Brush.sweepGradient(
                        listOf(accentColor, accentColor.copy(alpha = 0.6f))
                    ),
                    startAngle = -90f,
                    sweepAngle = 360f * timerState.progress,
                    useCenter = false,
                    style = Stroke(strokeWidth, cap = StrokeCap.Round)
                )
            }

            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text(
                    text = timerState.formattedTime,
                    fontSize = 54.sp,
                    fontWeight = FontWeight.Bold,
                    fontFamily = FontFamily.Monospace,
                    color = Color.White
                )
                Text(
                    text = if (isWorkMode) "DEEP STUDY (+100 XP)" else "REFRESH BREAK",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = accentColor,
                    letterSpacing = 2.sp
                )
            }
        }

        // 3. Control Action Buttons
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceEvenly,
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(
                onClick = { viewModel.resetTimer() },
                modifier = Modifier
                    .size(56.dp)
                    .background(Color(0xFF1E293B), CircleShape)
            ) {
                Icon(Icons.Default.Refresh, contentDescription = "Reset", tint = Color.LightGray)
            }

            Button(
                onClick = { viewModel.toggleTimer() },
                colors = ButtonDefaults.buttonColors(containerColor = accentColor),
                shape = CircleShape,
                modifier = Modifier.size(76.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.PlayArrow,
                    contentDescription = "Toggle",
                    tint = Color(0xFF0B0F19),
                    modifier = Modifier.size(36.dp)
                )
            }
        }
    }
}`
  },
  {
    title: 'Hero Profile Screen Composable',
    filename: 'HeroProfileScreen.kt',
    code: `package com.gate.chronorpg.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.gate.chronorpg.model.SubjectCategory
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
            .background(Color(0xFF0B0F19))
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Hero Level Card
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = Color(0xFF111827)),
                shape = RoundedCornerShape(24.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Text(
                        text = "GATE LEVEL \${heroState.level}",
                        fontSize = 24.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF38BDF8)
                    )
                    Text(
                        text = heroState.rankTitle,
                        fontSize = 14.sp,
                        color = Color(0xFF94A3B8)
                    )
                    Spacer(modifier = Modifier.height(16.dp))
                    LinearProgressIndicator(
                        progress = { heroState.levelProgress },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(10.dp)
                            .clip(RoundedCornerShape(5.dp)),
                        color = Color(0xFF38BDF8),
                        trackColor = Color(0xFF1E293B)
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "\${heroState.currentXp} / \${heroState.nextLevelXp} XP",
                        fontSize = 12.sp,
                        fontFamily = FontFamily.Monospace,
                        color = Color(0xFF64748B)
                    )
                }
            }
        }

        // Subject Breakdown Cards (Strong & Weak Area Diagnosis)
        item {
            Text(
                text = "SUBJECT SYLLABUS BREAKDOWN",
                style = MaterialTheme.typography.labelSmall,
                color = Color(0xFF64748B),
                fontFamily = FontFamily.Monospace
            )
        }

        items(SubjectCategory.values().size) { idx ->
            val category = SubjectCategory.values()[idx]
            val xp = heroState.subjectXpMap[category] ?: 0
            SubjectXpCard(category = category, xp = xp)
        }
    }
}

@Composable
fun SubjectXpCard(category: SubjectCategory, xp: Int) {
    Card(
        colors = CardDefaults.cardColors(containerColor = Color(0xFF151D2F)),
        shape = RoundedCornerShape(16.dp),
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier
                .padding(16.dp)
                .fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(text = category.displayName, fontWeight = FontWeight.SemiBold, color = Color.White)
                Text(text = "\${xp / 100} Sessions Completed", fontSize = 12.sp, color = Color(0xFF64748B))
            }
            Text(
                text = "+\$xp XP",
                fontWeight = FontWeight.Bold,
                fontFamily = FontFamily.Monospace,
                color = Color(0xFF38BDF8)
            )
        }
    }
}`
  },
  {
    title: 'Achievements Screen Composable',
    filename: 'AchievementsScreen.kt',
    code: `package com.gate.chronorpg.ui.screens

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
import androidx.compose.ui.graphics.ColorFilter
import androidx.compose.ui.graphics.ColorMatrix
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.gate.chronorpg.model.Achievement
import com.gate.chronorpg.viewmodel.PomodoroViewModel

@Composable
fun AchievementsScreen(
    viewModel: PomodoroViewModel,
    modifier: Modifier = Modifier
) {
    val achievements by viewModel.achievements.collectAsState()

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(Color(0xFF0B0F19))
            .padding(16.dp)
    ) {
        Text(
            text = "GATE BADGES & CITATIONS",
            style = MaterialTheme.typography.titleMedium,
            color = Color.White
        )
        Spacer(modifier = Modifier.height(16.dp))

        // Grid showing locked & unlocked badges
        LazyVerticalGrid(
            columns = GridCells.Fixed(2),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(achievements) { badge ->
                BadgeCard(badge = badge)
            }
        }
    }
}

@Composable
fun BadgeCard(badge: Achievement) {
    val isUnlocked = badge.isUnlocked
    val borderColor = if (isUnlocked) Color(0xFFF59E0B) else Color(0xFF1E293B)

    Card(
        colors = CardDefaults.cardColors(
            containerColor = if (isUnlocked) Color(0xFF161F30) else Color(0xFF0F172A)
        ),
        shape = RoundedCornerShape(16.dp),
        modifier = Modifier
            .fillMaxWidth()
            .border(1.dp, borderColor, RoundedCornerShape(16.dp))
            .alpha(if (isUnlocked) 1f else 0.5f)
    ) {
        Column(
            modifier = Modifier.padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Badges change from grayscale to full neon color
            Text(
                text = badge.emojiIcon,
                fontSize = 32.sp
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = badge.title,
                fontSize = 14.sp,
                color = if (isUnlocked) Color.White else Color(0xFF94A3B8)
            )
            Text(
                text = if (isUnlocked) "UNLOCKED" else "\${badge.progress}/\${badge.maxProgress}",
                fontSize = 11.sp,
                color = if (isUnlocked) Color(0xFFF59E0B) else Color(0xFF64748B)
            )
        }
    }
}`
  }
];

export const ComposeCodeModal: React.FC<ComposeCodeModalProps> = ({ isOpen, onClose }) => {
  const [selectedSnippet, setSelectedSnippet] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const current = KOTLIN_CODE_SNIPPETS[selectedSnippet];

  const handleCopy = () => {
    navigator.clipboard.writeText(current.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-850 bg-black">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
              <FileCode className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white tracking-wide">Jetpack Compose Kotlin Code</h2>
              <p className="text-xs text-zinc-500">Native Android code mapping to current screens & architecture</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* File Tabs */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-zinc-850 bg-zinc-950 overflow-x-auto">
          {KOTLIN_CODE_SNIPPETS.map((snippet, idx) => (
            <button
              key={snippet.filename}
              onClick={() => setSelectedSnippet(idx)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                selectedSnippet === idx
                  ? 'bg-zinc-900 text-white border border-zinc-700 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/60'
              }`}
            >
              <span>{snippet.filename}</span>
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2">
            <a
              href="/gate-chrono-compose-project.zip"
              download="gate-chrono-compose-project.zip"
              className="px-3 py-1.5 rounded-md bg-white hover:bg-zinc-200 text-black text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
              title="Download entire ready-to-build Android Studio project"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download Project (.ZIP)</span>
              <span className="sm:hidden">.ZIP</span>
            </a>

            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-300 flex items-center gap-1.5 transition-colors border border-zinc-800"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-zinc-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="flex-1 overflow-auto p-4 bg-black font-mono text-xs text-zinc-300 leading-relaxed">
          <pre className="overflow-x-auto whitespace-pre">
            <code>{current.code}</code>
          </pre>
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-zinc-950 border-t border-zinc-850 text-[11px] text-zinc-500 flex items-center justify-between">
          <span>Target SDK 34 · Jetpack Compose BOM 2024.02 · Material3</span>
          <span className="text-zinc-400">Android Studio Compatible</span>
        </div>
      </div>
    </div>
  );
};
