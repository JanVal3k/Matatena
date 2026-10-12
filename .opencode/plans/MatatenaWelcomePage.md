# Matatena Welcome Page - Implementation Plan

## Overview
Enhance the existing \MatatenaWelcomePage\ component with a custom Matatena color palette, minimalist design refinements, and responsive breakpoints while keeping Gluestack UI as the component library.

---

## Current State Analysis

**Existing Implementation:** \src/components/MatatenaWelcomePage.tsx\
- ✅ Game name "Matatena" with Play icon
- ✅ Play button (starts game)
- ✅ How to Play button (opens modal with 5-step rules)
- ✅ Difficulty selection (Easy/Medium/Hard) with single-selection
- ✅ Default difficulty: Medium
- ❌ Uses default Gluestack blue primary colors
- ❌ No responsive breakpoint adaptations
- ❌ Not minimalist - has heavy shadows, gradients, busy card styling

**Gluestack UI Config:** \
ode_modules/@gluestack-ui/config/build/gluestack-ui.config.js\
- Token-based theming system with colors, space, radii, breakpoints
- Component themes with variants (action, variant, size)
- Responsive tokens via media queries
- Dark mode support built-in

---

## Requirements

| Requirement | Status |
|-------------|--------|
| Keep Gluestack UI | ✅ Confirmed |
| Minimalist design | 🎯 Target |
| Custom color palette (11 terracotta/orange shades) | 🎯 Target |
| Default difficulty: Medium | ✅ Already implemented |
| Responsive breakpoints (mobile/tablet/desktop) | 🎯 Target |

---

## Color Palette Mapping

| Token | Hex | Usage |
|-------|-----|-------|
| \matatena50\ | \#fff5ec\ | Page background (warm subtle) |
| \matatena100\ | \#ffe7d2\ | Card borders, hover states |
| \matatena200\ | \#ffcca5\ | Unselected difficulty borders |
| \matatena300\ | \#ffa86b\ | Secondary button borders |
| \matatena400\ | \#ff7930\ | Focus rings, accents |
| \matatena500\ | \#ff5508\ | **Primary brand** - selected states, primary button |
| \matatena600\ | \#f83d00\ | Primary button hover, icon containers |
| \matatena700\ | \#cd2801\ | Primary button active, dark text on light |
| \matatena800\ | \#9a1f09\ | Heading text, emphasis |
| \matatena900\ | \#831e0b\ | Body text (dark mode) |
| \matatena950\ | \#470b03\ | Modal backdrop overlay (with opacity) |

**Semantic Aliases:**
- \primary\ → \matatena\ (for easier component usage)
- \primary500\ = \matatena500\ = \#ff5508\ (brand color)

---

## Implementation Phases

### Phase 1: Create Custom Gluestack Config
**File:** \src/theme/config.ts\ (NEW)

`	ypescript
// Structure:
import { createConfig, createComponents } from '@gluestack-style/react';
import { componentsTheme } from '@gluestack-ui/config'; // extend default

export const config = createConfig({
  tokens: {
    colors: {
      // ... all matatena50-950 tokens
      // ... keep existing grays, semantic colors (error, success, etc.)
      // Map primary -> matatena
      primary50: '#fff5ec',
      primary100: '#ffe7d2',
      // ... etc
      primary500: '#ff5508',
      // ...
    },
    breakpoints: {
      base: 0,
      xs: 400,    // NEW: extra small mobile
      sm: 480,
      md: 768,
      lg: 992,
      xl: 1280,
    },
    // Keep existing: space, radii, fontSizes, fontWeights, lineHeights, etc.
  },
});
`

**Key Decisions:**
- Extend default config rather than replace (preserves all component themes)
- Add \xs\ breakpoint at 400px for small phones
- Map \primary\ scale to matatena palette for automatic component theming
- Keep all semantic colors (error, success, warning, info) unchanged

---

### Phase 2: Update App Provider
**File:** \src/App.tsx\ (MODIFY)

`	ypescript
import { config } from './theme/config'; // custom config
import { GluestackUIProvider } from '@gluestack-ui/themed';
// ... use custom config in provider
`

---

### Phase 3: Refactor Welcome Page - Design System

#### 3.1 Page Background & Container
| Element | Current | New (Minimalist) |
|---------|---------|------------------|
| Page bg | \gray50\ / dark \gray900\ | \matatena50\ / dark \matatena950\ |
| Card bg | White / dark \gray800\ | White / dark \matatena900\ |
| Card border | \gray100\ / dark \gray700\ | \matatena100\ / dark \matatena800\ |
| Card shadow | \2xl\ | \softShadow.1\ (subtle) or none |
| Card radius | \2xl\ (16px) | \xl\ (12px) - softer |
| Padding | \$10\ (40px) | Responsive: \ase:, sm:, md:\ |

#### 3.2 Header Section
| Element | Current | New |
|---------|---------|-----|
| Icon container | \primary500\ bg, \white\ icon | \matatena100\ bg, \matatena600\ icon |
| Icon size | 48px | Responsive: \ase:40, md:48, lg:56\ |
| Game title | \2xl\, bold, \gray900\ | Responsive: \ase:2xl, md:3xl, lg:4xl\, \matatena800\ |
| Subtitle | \lg\, \gray500\ | \matatena600\, slightly smaller |

#### 3.3 Difficulty Buttons
| State | Current | New |
|-------|---------|-----|
| Unselected bg | \gray50\ | White |
| Unselected border | \gray200\ | \matatena200\ (2px) |
| Unselected text | \gray900\ | \matatena700\ |
| Unselected desc | \gray500\ | \matatena500\ |
| Unselected icon bg | \color100\ | \matatena100\ |
| Unselected icon | \color600\ | \matatena600\ |
| Selected bg | \color500\ | \matatena600\ |
| Selected text | White | White |
| Selected border | \color500\ | \matatena600\ |
| Selected icon bg | White | White |
| Selected icon | \color500\ | \matatena500\ |
| Checkmark | White bg, \color500\ icon | White bg, \matatena500\ icon |
| Hover (unselected) | \gray100\ | \matatena50\ |
| Hover (selected) | \color600\ | \matatena700\ |
| Shadow | 2/6 | Subtle: \softShadow.1\ / \softShadow.2\ |
| Radius | \lg\ (8px) | \xl\ (12px) |
| Padding | \$6\ (24px) | Responsive: \ase:, sm:, md:\ |

**Icons:** Keep Star (Easy), Zap (Medium), Crown (Hard) - recolored to palette

#### 3.4 Play Button (Primary)
| Property | Value |
|----------|-------|
| Background | \matatena600\ |
| Hover | \matatena700\ |
| Active | \matatena800\ |
| Text | White |
| Focus ring | \matatena400\ (2px) |
| Height | Responsive: \ase:, sm:\ |
| Radius | \lg\ (8px) |
| Shadow | \softShadow.1\ |
| Transition | 150ms |
| Icon | Play (20px) |

#### 3.5 How to Play Button (Outline)
| Property | Value |
|----------|-------|
| Background | Transparent |
| Border | \matatena300\ (2px) |
| Text | \matatena700\ |
| Hover bg | \matatena50\ |
| Hover border | \matatena400\ |
| Active bg | \matatena100\ |
| Focus ring | \matatena400\ |
| Height | Responsive: \ase:, sm:\ |
| Radius | \lg\ (8px) |
| Icon | HelpCircle (20px, \matatena600\) |

#### 3.6 How to Play Modal
| Element | Current | New |
|---------|---------|-----|
| Backdrop | \lack/50\ / dark \lack/70\ | \matatena950/60\ |
| Card bg | White / dark \gray800\ | White / dark \matatena900\ |
| Card radius | \2xl\ | \xl\ |
| Card padding | \$8\ | Responsive: \ase:, md:\ |
| Close button | ChevronRight rotated | X icon or keep chevron |
| Title | \xl\, \gray900\ | \matatena800\ |
| Step number | \primary500\ bg | \matatena500\ bg |
| Step title | \md\, \gray900\ | \matatena800\ |
| Step desc | \sm\, \gray600\ | \matatena600\ |
| "Got it" button | Ghost | Outline: \matatena300\ border |
| "Start Playing" | \primary500\ | \matatena600\ |

---

### Phase 4: Responsive Breakpoints Implementation

#### Breakpoint Strategy
| Breakpoint | Min Width | Target Device | Key Changes |
|------------|-----------|---------------|-------------|
| \ase\ | 0px | Mobile < 400px | Compact everything |
| \xs\ | 400px | Small mobile | Slightly more space |
| \sm\ | 480px | Standard mobile | Current mobile layout |
| \md\ | 768px | Tablet | Wider card, buttons can be HStack |
| \lg\ | 992px | Desktop | Centered, max-width card |
| \xl\ | 1280px | Large desktop | Same as lg |

#### Responsive Tokens (Gluestack Syntax)
`	ypescript
// Padding
p={{ base: '', xs: '', sm: '', md: '', lg: '' }}

// Font sizes
fontSize={{ base: '', sm: '', md: '', lg: '' }}

// Spacing
space={{ base: '', sm: '', md: '' }}

// Flex direction (for button groups)
flexDirection={{ base: 'column', md: 'row' }}

// Width
w={{ base: 'full', md: 'auto' }}

// Grid columns (if using grid)
gridTemplateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
`

#### Specific Layout Adaptations

**Mobile (< 768px):**
- Single column VStack for all content
- Difficulty buttons: full width, stacked vertically
- Play + How to Play: stacked vertically, full width
- Modal: full width with margins, scrollable content

**Tablet (768px - 991px):**
- Card max-width: 500px
- Difficulty buttons: can stay stacked or HStack if 3 fit
- Action buttons: HStack with equal width

**Desktop (≥ 992px):**
- Card max-width: 480px (fixed)
- Centered on screen
- All buttons: comfortable touch targets (44px min height)
- Modal: fixed width 480px, centered

---

### Phase 5: Accessibility & Polish

| Check | Implementation |
|-------|----------------|
| Focus visible | All interactive: \ing: 2, ringColor: 'matatena400'\ |
| Color contrast | Verify: \matatena800\ on white (12.6:1 ✓), white on \matatena600\ (4.8:1 ✓) |
| Reduced motion | \@media (prefers-reduced-motion: reduce) { transition: none }\ |
| Keyboard nav | Tab order: Difficulty → Play → How to Play → Modal close → Modal actions |
| ARIA labels | Buttons have descriptive text, modal has \ole="dialog"\, \ria-labelledby\ |
| Touch targets | Min 44x44px (already satisfied by Gluestack defaults) |

---

### Phase 6: Dark Mode Palette

| Token | Light | Dark |
|-------|-------|------|
| Page bg | \matatena50\ | \matatena950\ |
| Card bg | White | \matatena900\ |
| Card border | \matatena100\ | \matatena800\ |
| Primary text | \matatena800\ | \matatena50\ |
| Secondary text | \matatena600\ | \matatena200\ |
| Muted text | \matatena500\ | \matatena400\ |
| Primary button | \matatena600\ | \matatena500\ |
| Primary hover | \matatena700\ | \matatena400\ |
| Outline border | \matatena300\ | \matatena600\ |
| Modal backdrop | \matatena950/60\ | \lack/70\ |

---

## Files to Create / Modify

| File | Action | Description |
|------|--------|-------------|
| \src/theme/config.ts\ | **CREATE** | Custom Gluestack config with Matatena palette |
| \src/theme/index.ts\ | **CREATE** | Export barrel file |
| \src/App.tsx\ | **MODIFY** | Use custom config provider |
| \src/components/MatatenaWelcomePage.tsx\ | **MODIFY** | Apply new colors, minimalist styles, responsive tokens |
| \src/index.css\ | **OPTIONAL** | Global CSS vars for non-Gluestack elements |

---

## Dependencies

- **No new packages** - uses existing:
  - \@gluestack-ui/themed\
  - \@gluestack-ui/config\
  - \@gluestack-style/react\
  - \lucide-react\ (icons)

---

## Testing Checklist

- [ ] Page loads with matatena50 background
- [ ] Card has minimal shadow, matatena100 border
- [ ] Title renders in matatena800, responsive sizing
- [ ] Difficulty buttons: unselected=white/matatena200, selected=matatena600/white
- [ ] Single selection works (radio behavior)
- [ ] Play button: matatena600 → hover matatena700 → active matatena800
- [ ] How to Play button: outline matatena300 → hover matatena50
- [ ] Modal opens/closes, backdrop is matatena950/60
- [ ] Steps render with matatena500 number circles
- [ ] Mobile (< 480px): stacked layout, compact spacing
- [ ] Tablet (768px): wider card, comfortable spacing
- [ ] Desktop (992px+): centered card, max-width 480px
- [ ] Dark mode: all colors swap correctly
- [ ] Focus states visible on all interactive elements
- [ ] Keyboard navigation works end-to-end
- [ ] No console errors

---

## Clarifying Questions (Before Implementation)

1. **Display font for "Matatena" heading?**
   - Option A: System font stack (current) - clean, fast
   - Option B: Custom Google Font (e.g., "Fredoka", "Baloo 2", "Nunito") - playful, brand personality
   - Option C: Custom local font file

2. **Entrance animations?**
   - Option A: None - pure minimalist, instant render
   - Option B: Subtle fade-in + slide-up (300ms, stagger children)
   - Option C: Only on first visit (use localStorage flag)

3. **Dark mode support?**
   - Option A: Full dark mode palette (as designed above)
   - Option B: Light mode only (simpler, game may not need dark)
   - Option C: Auto-detect system preference

4. **Difficulty icons?**
   - Option A: Keep Lucide (Star/Zap/Crown) - consistent, zero effort
   - Option B: Custom SVGs matching minimalist style
   - Option C: Emoji (⭐ ⚡ 👑) - playful, no assets needed

5. **Card elevation?**
   - Option A: Flat (border only, no shadow) - ultra minimalist
   - Option B: Subtle \softShadow.1\ - slight depth
   - Option C: \softShadow.2\ on hover only

6. **How to Play modal close icon?**
   - Option A: Keep rotated ChevronRight (current)
   - Option B: X icon (more standard)
   - Option C: Both (X on desktop, chevron on mobile)

---

## Estimated Effort

| Phase | Complexity | Est. Time |
|-------|------------|-----------|
| Phase 1: Custom Config | Medium | 30-45 min |
| Phase 2: App Provider | Low | 5 min |
| Phase 3: Design Refactor | High | 60-90 min |
| Phase 4: Responsive Tokens | Medium | 30-45 min |
| Phase 5: A11y Polish | Medium | 20-30 min |
| **Total** | | **2.5 - 3.5 hours** |

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Gluestack responsive token syntax differs from plan | Medium | Medium | Test each breakpoint in browser dev tools |
| Dark mode color contrast failures | Low | High | Verify with axe/core or manual WCAG check |
| Custom config doesn't merge correctly with component themes | Low | High | Extend default config, don't replace |
| Touch targets too small on mobile | Low | Medium | Use Gluestack's built-in size tokens (min 44px) |
| Animation performance on low-end devices | Low | Low | Respect prefers-reduced-motion, keep transitions < 200ms |

---

## Next Steps

1. **Confirm clarifying questions** above
2. **Approve plan** → proceed to implementation
3. **Execute phases sequentially** with verification at each step
4. **Final review** against testing checklist
