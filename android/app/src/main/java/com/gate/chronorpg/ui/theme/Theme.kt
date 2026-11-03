package com.gate.chronorpg.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

val PureBlack = Color(0xFF000000)
val DarkSurface = Color(0xFF09090B)
val SubtleSlate = Color(0xFF64748B)
val MutedSlate = Color(0xFF94A3B8)
val HairlineBorder = Color(0xFF27272A)
val SoftSilver = Color(0xFFA1A1AA)
val CleanWhite = Color(0xFFFAFAFA)

private val DeepFocusColorScheme = darkColorScheme(
    primary = SubtleSlate,
    onPrimary = CleanWhite,
    background = PureBlack,
    onBackground = CleanWhite,
    surface = DarkSurface,
    onSurface = CleanWhite,
    outline = HairlineBorder,
    surfaceVariant = Color(0xFF18181B),
    onSurfaceVariant = SoftSilver
)

@Composable
fun GATEChronoTheme(
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = DeepFocusColorScheme,
        content = content
    )
}
