# Design Brief

## Tone & Aesthetic
Spotify-modern professional. Dark mode only. Clean, focused, minimal. Bold green accent for primary interactions. Organic spacing and typography hierarchy.

## Visual Hierarchy
Now-playing card dominates primary viewport. Library/Queue tabs and playback controls provide secondary navigation. Header minimal, footer action-rich.

## Color Palette
| Token         | OKLCH        | Usage                               |
|---------------|--------------|-------------------------------------|
| Primary       | 0.71 0.159 142 | Play/pause, accent buttons, focus    |
| Background    | 0.145 0 0    | Page background, lowest elevation   |
| Card          | 0.18 0 0     | Player card, elevated surfaces      |
| Muted         | 0.22 0 0     | Disabled, secondary UI              |
| Foreground    | 0.95 0 0     | Primary text, high contrast         |
| Destructive   | 0.65 0.19 22 | Danger actions (delete, clear)      |
| Border        | 0.28 0 0     | Subtle dividers, input borders      |

## Typography
- **Display**: GeneralSans, 400–700 weight. Track names, artist, clean sans.
- **Body**: GeneralSans. Playlist names, queue items, UI copy.
- **Mono**: GeistMono. Time stamps, durations, technical metadata.
- **Scale**: 12px (caption), 14px (body), 16px (label), 18px (title), 24px (now-playing track).

## Structural Zones
| Zone            | Treatment                                  |
|-----------------|--------------------------------------------|
| Header          | bg-card, border-b border-border. Minimal. |
| Now Playing     | bg-card elevated. Album art (16:9 ratio). |
| Sidebar (tabs)  | bg-card with tab navigation (Library, Queue). |
| Playback Bar    | bg-card, border-t. Full-width controls.  |
| Tab Content     | bg-background. Scrollable list layout.   |

## Shape Language
- **Radius**: 0.625rem default (corners on cards, inputs).
- **Elevation**: Color-based. Card over background via OKLCH lightness.
- **Borders**: Subtle 1px at border token. No gradients.
- **Spacing**: Tight (0.5rem), base (1rem), spacious (1.5–2rem). Rhythm via grid.

## Component Patterns
- **Buttons**: Green accent for primary, muted for secondary. 44px min tap target (mobile).
- **Player Controls**: Symmetrical layout. Play/pause center, skip left/right.
- **Queue List**: Compact rows. Current track highlighted with accent left border.
- **Library**: Grid or list. Album art thumbnail or icon. No hover (touch-first).

## Motion
- **Transition**: 0.3s cubic-bezier(0.4, 0, 0.2, 1) for interactive elements.
- **Play button**: Instant state change (play ↔ pause). No animation.
- **Tab switches**: Fade 0.2s. No slide (respects Android UX).
- **Progress scrubbing**: Smooth real-time update (50ms throttle).

## Signature Detail
Green-accented play button is primary touch target. Fills entire interactive zone. Track name dominates now-playing card above album art. Album art is 1:1 square with subtle shadow. Time display (current / duration) sits below scrubber bar in mono.

## Constraints & Anti-Patterns
- ✓ Dark mode only. No light theme.
- ✓ OKLCH tokens exclusively. No raw hex or arbitrary colors.
- ✓ Mobile-first. 375px min viewport (Android standard).
- ✗ No equalizer, audio effects, or scrobbling (out of scope).
- ✗ No gradients, no glows, no blur effects.
- ✗ No animations beyond 0.3s transitions and state changes.
- ✗ No floating action buttons or badges (native Android pattern).

## Export Summary
- `index.css`: OKLCH token palette (dark mode), GeneralSans + GeistMono @font-face, utility transitions.
- `tailwind.config.js`: Mobile-first breakpoints, custom accent color mapping to primary (green).
- Fonts: GeneralSans (body + display), GeistMono (mono).
