# Design hand-off

**Redesign source:** `Hybrid-Athlete-Redesign.html` (Downloads) → implemented in app  
**Assets:** `public/images/coach_hero.jpg`, `public/images/brand_mark.png`  
**Tokens:** `src/design/tokens.ts` + `src/index.css` `:root`

## Screens (P01–P06)

| ID  | Screen        | Main component                          |
|-----|---------------|-----------------------------------------|
| P01 | Auth entry    | `AuthChoiceModal.tsx`                   |
| P02 | Login         | `LoginPage.tsx`                         |
| P03 | Home          | `WelcomePortal.tsx`                     |
| P04 | Train         | `App.tsx` workouts + `WeekSelector` / `WorkoutCard` |
| P05 | Log sets      | `WorkoutPageNew.tsx` + `ExerciseCardNew` |
| P06 | Unlock / done | celebration in `WorkoutPageNew`         |

## Visual system

- Warm graphite (`#111110` / `#1A1918` / `#22201E`), bone type (`#F2EDE6`)
- One red (`#E8112D`) — primary CTA, current week, progress, focused input
- Fonts: **Saira Condensed** (display/numbers), **Barlow** (UI) — upright, no italic
- No gradients, glows, or emoji on chrome
