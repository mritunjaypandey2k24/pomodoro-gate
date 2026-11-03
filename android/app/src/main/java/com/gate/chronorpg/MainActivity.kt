package com.gate.chronorpg

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.EmojiEvents
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Timer
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.gate.chronorpg.ui.screens.AchievementsScreen
import com.gate.chronorpg.ui.screens.HeroProfileScreen
import com.gate.chronorpg.ui.screens.TimerScreen
import com.gate.chronorpg.ui.theme.GATEChronoTheme
import com.gate.chronorpg.ui.theme.PureBlack
import com.gate.chronorpg.viewmodel.PomodoroViewModel

enum class NavigationTab(val title: String) {
    TIMER("Timer"),
    HERO("Hero XP"),
    BADGES("Badges")
}

class MainActivity : ComponentActivity() {
    private val viewModel: PomodoroViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            GATEChronoTheme {
                var selectedTab by remember { mutableStateOf(NavigationTab.TIMER) }

                Scaffold(
                    modifier = Modifier.fillMaxSize(),
                    containerColor = PureBlack,
                    bottomBar = {
                        NavigationBar(
                            containerColor = Color(0xFF09090B),
                            tonalElevation = 0.dp
                        ) {
                            NavigationBarItem(
                                selected = selectedTab == NavigationTab.TIMER,
                                onClick = { selectedTab = NavigationTab.TIMER },
                                icon = { Icon(Icons.Default.Timer, contentDescription = "Timer") },
                                label = { Text("Timer") },
                                colors = NavigationBarItemDefaults.colors(
                                    selectedIconColor = Color.White,
                                    selectedTextColor = Color.White,
                                    indicatorColor = Color(0xFF18181B),
                                    unselectedIconColor = Color(0xFF71717A),
                                    unselectedTextColor = Color(0xFF71717A)
                                )
                            )
                            NavigationBarItem(
                                selected = selectedTab == NavigationTab.HERO,
                                onClick = { selectedTab = NavigationTab.HERO },
                                icon = { Icon(Icons.Default.Person, contentDescription = "Hero") },
                                label = { Text("Hero XP") },
                                colors = NavigationBarItemDefaults.colors(
                                    selectedIconColor = Color.White,
                                    selectedTextColor = Color.White,
                                    indicatorColor = Color(0xFF18181B),
                                    unselectedIconColor = Color(0xFF71717A),
                                    unselectedTextColor = Color(0xFF71717A)
                                )
                            )
                            NavigationBarItem(
                                selected = selectedTab == NavigationTab.BADGES,
                                onClick = { selectedTab = NavigationTab.BADGES },
                                icon = { Icon(Icons.Default.EmojiEvents, contentDescription = "Badges") },
                                label = { Text("Badges") },
                                colors = NavigationBarItemDefaults.colors(
                                    selectedIconColor = Color.White,
                                    selectedTextColor = Color.White,
                                    indicatorColor = Color(0xFF18181B),
                                    unselectedIconColor = Color(0xFF71717A),
                                    unselectedTextColor = Color(0xFF71717A)
                                )
                            )
                        }
                    }
                ) { innerPadding ->
                    Box(modifier = Modifier.padding(innerPadding)) {
                        when (selectedTab) {
                            NavigationTab.TIMER -> TimerScreen(viewModel = viewModel)
                            NavigationTab.HERO -> HeroProfileScreen(viewModel = viewModel)
                            NavigationTab.BADGES -> AchievementsScreen(viewModel = viewModel)
                        }
                    }
                }
            }
        }
    }
}
