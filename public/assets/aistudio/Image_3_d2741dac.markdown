---
name: Clinical Pulse Obsidian
colors:
  surface: '#0f131c'
  surface-dim: '#0f131c'
  surface-bright: '#353942'
  surface-container-lowest: '#0a0e16'
  surface-container-low: '#181c24'
  surface-container: '#1c2028'
  surface-container-high: '#262a33'
  surface-container-highest: '#31353e'
  on-surface: '#dfe2ee'
  on-surface-variant: '#bcc9cd'
  inverse-surface: '#dfe2ee'
  inverse-on-surface: '#2c3039'
  outline: '#869397'
  outline-variant: '#3d494c'
  surface-tint: '#4cd7f6'
  primary: '#4cd7f6'
  on-primary: '#003640'
  primary-container: '#06b6d4'
  on-primary-container: '#00424f'
  inverse-primary: '#00687a'
  secondary: '#4edea3'
  on-secondary: '#003824'
  secondary-container: '#00a572'
  on-secondary-container: '#00311f'
  tertiary: '#ffb95f'
  on-tertiary: '#472a00'
  tertiary-container: '#e79400'
  on-tertiary-container: '#563400'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#acedff'
  primary-fixed-dim: '#4cd7f6'
  on-primary-fixed: '#001f26'
  on-primary-fixed-variant: '#004e5c'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#0f131c'
  on-background: '#dfe2ee'
  surface-variant: '#31353e'
typography:
  display:
    fontFamily: Geist
    fontSize: 44px
    fontWeight: '700'
    lineHeight: 52px
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: 0em
  title-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0em
  body-lg:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.01em
  code-lg:
    fontFamily: JetBrains Mono
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: 0.15em
  code-md:
    fontFamily: JetBrains Mono
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0.05em
  code-timer:
    fontFamily: JetBrains Mono
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: 0.08em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.06em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.08em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

This design system is engineered specifically for high-stress, life-critical emergency medical environments where immediate legibility, unambiguous hierarchy, and rapid data ingestion are paramount. Target users include paramedics, emergency room clinicians, triage nurses, and patients granting temporary biometric or QR-mediated access.

The design ethos merges high-performance digital ergonomics with modern tactical clinical aesthetics. Drawing inspiration from aerospace cockpit telemetry and modern surgical monitoring interfaces, it deploys a disciplined dark-mode-first environment. Key visual characteristics include:
- Deep obsidian foundation layers that mitigate eye fatigue in both ambient night settings and intense ER surgical suites.
- Luminous chromatic accents (electric medical cyan, clinical emerald, triage amber, and critical red) reserved strictly for verified states, vital telemetry, and life safety warnings.
- Controlled luminescence: subtle border glows and signal indicators emphasize active scan windows and perishable emergency credentials without visual noise.
- Uncompromising utilitarian confidence that fosters authority, security, and calm in acute care scenarios.

## Colors

The palette is tuned for extreme contrast, dark-room ergonomics, and instantaneous status comprehension. Dark surfaces prevent glare and allow signal indicators to read with luminous clarity.

### Surface Tiers
- **Canvas Base (`#0B0F17`):** The absolute foundational background. Absorbs glare and anchors the viewport.
- **Surface Level 1 (`#111827`):** Primary card bodies, navigation sidebars, and inactive status modules.
- **Surface Level 2 (`#1E293B`):** Elevated clinical cards, flyouts, modals, and QR token framing zones.
- **Surface Level 3 (`#334155`):** Interactive inputs, pressed button states, and divider lines.

### Functional & Signal Accents
- **Electric Medical Cyan (`#06B6D4`):** Primary actions, verified access tokens, active data bridges, and scan viewfinders.
- **Clinical Emerald (`#10B981`):** Verified identity, stable vitals, authenticated consent, and active operational states.
- **Emergency Amber (`#F59E0B`):** Clinical allergies, pending confirmations, interaction warnings, and medium-severity triage tags.
- **Urgent Red (`#EF4444`):** DNR / Do Not Resuscitate orders, anaphylactic alerts, expired or revoked tokens, and acute trauma warnings.

### Typography & Content Neutrals
- **Primary Text (`#F8FAFC`):** Pure contrast for patient names, blood types, and critical readouts.
- **Secondary Text (`#94A3B8`):** Clinical metadata, unit measurements, and secondary headers.
- **Tertiary / Subdued Text (`#64748B`):** Inactive timestamps, form labels, and peripheral instructions.

## Typography

Typography prioritizes rapid clinical parsing through two high-efficiency typefaces:

1. **Primary Telemetry & Structural Prose (Geist):** Handles all headlines, body copy, patient names, and core descriptive readouts. Engineered with precise aperture shapes and robust distinctions between numbers and glyphs, eliminating ambiguity between `O`, `0`, `I`, `1`, and `l`.
2. **Access Codes, Timers & Diagnostic Badges (JetBrains Mono):** Reserved for technical tokens: 6-digit one-time access keys, TTL (time-to-live) countdown clocks, dosage metrics, ICD-10 identifiers, and triage level markers. Monospace metrics guarantee that updating countdown numbers will not jitter or shift layout geometry under active surveillance.

### Hierarchy & Responsive Rules
- On mobile devices, `headline-lg-mobile` replaces `headline-lg` to prevent line wrapping of patient triage headers.
- All monospace labels (`label-md`, `label-sm`) default to uppercase tracking for rapid peripheral legibility in emergency vehicles.

## Layout & Spacing

This layout adheres to a strict 4px/8px incremental rhythm configured across a fluid responsive grid.

### Breakpoints & Canvas Bounds
- **Mobile (< 640px):** Single-column stack with dynamic full-width utility modules. Margins are set to `1rem` to maximize touch targets on handheld clinical tablets and paramedic phones. Target touch dimensions must not drop below 48px square.
- **Tablet (640px – 1024px):** 6-column grid with `1rem` gutters. Useful for paramedic in-vehicle docks, splitting the patient card and active vitals into distinct columns.
- **Desktop / ER Console (> 1024px):** 12-column grid maxed at 1440px viewport width, utilizing `1.5rem` gutters and `2rem` outer margins. Enables side-by-side verification: the QR bridge token viewer operates alongside historical charts and active drug conflict analysis.

### Structural Flow
Clinical data blocks (Allergies, Medications, Directives) prioritize vertical stacking over multi-level horizontal tabs to reduce tap fatigue and eliminate obscured clinical data during acute emergency procedures.

## Elevation & Depth

Visual hierarchy is constructed through tonal stratification, subtle chromatic glows, and high-precision borders rather than heavy drop shadows.

### Surface Stratification
- **Floor (`#0B0F17`):** The global viewport context.
- **Base Surface (`#111827`):** Non-clickable structural segments, framed with a 1px border of `#1E293B`.
- **Raised Interactive Cards (`#1E293B`):** Hoverable or selectable patient modules, framed with a 1px border of `#334155`.

### Luminous Depth & States
- **Normal Cards:** Minimal physical shadow (`0 2px 8px rgba(0, 0, 0, 0.4)`), bounded by crisp sub-surface strokes.
- **Active / Verified Bridge State:** Framed with a 1px border of `#06B6D4` paired with an electric radial glow: `0 0 16px -2px rgba(6, 182, 212, 0.35)`.
- **Critical / Revocation State:** Framed with a 1px border of `#EF4444` accompanied by a localized urgent flare: `0 0 16px -2px rgba(239, 68, 68, 0.4)`.
- **Active Scanning Target:** Glassmorphism overlay using `rgba(17, 24, 39, 0.75)` with a `backdrop-filter: blur(12px)` and illuminated cyan guide brackets.

## Shapes

The design system uses a roundedness level of `2` (`0.5rem` / `8px` baseline). This maintains crisp clinical efficiency without the aggressive severity of sharp corners or the casual informality of full pill shapes.

### Curvature Tokens
- **Base Components (`rounded` / `0.5rem`):** Applied to buttons, input fields, code display blocks, and alert badges.
- **Containers & Modules (`rounded-lg` / `1rem`):** Applied to QR card holders, modal overlays, clinical record sections, and scan framing windows.
- **Full Radius (`rounded-full`):** Strictly reserved for circular clinician avatars, vital status dot indicators, and countdown progress rings.

## Components

### Buttons
- **Primary Clinical Action:** Background `#06B6D4`, text `#0B0F17`, font weight 600. On hover, background shifts to `#22D3EE` with a cyan outer glow (`0 0 12px rgba(6, 182, 212, 0.4)`).
- **Secondary Action:** Background `#1E293B`, border 1px solid `#334155`, text `#F8FAFC`. On hover, border transitions to `#94A3B8`.
- **Emergency Revoke / Hazard Action:** Background `#EF4444`, text `#FFFFFF`, accompanied by an urgent amber-tinted focus ring and active crimson glow.

### Access Code & Countdown Displays
- **One-Time Bridge Passcode:** Composed of 6 discrete character wells using `Surface Level 2` (`#1E293B`), bordered in `#334155`. Glyphs render in `JetBrains Mono` (`code-lg`, 28px) in `#F8FAFC`.
- **Time-to-Live Countdown Ring:** Monospace digital clock (`code-timer`) paired with a dynamic SVG circular stroke that transitions from `#06B6D4` to `#F59E0B` at < 60 seconds, and pulses `#EF4444` at < 15 seconds.

### Medical Status Badges & Chips
- **Allergy & Contraindication Chip:** Background `rgba(245, 158, 11, 0.12)`, border 1px solid `#F59E0B`, text `#F59E0B`, label typography (`label-md`). Includes an alert hazard icon prefix.
- **Active Sync Badge:** Background `rgba(16, 185, 129, 0.12)`, border 1px solid `#10B981`, text `#10B981`. Prefixed with a pulsating green status dot (`6px`).
- **Revoked / DNR Badge:** Background `rgba(239, 68, 68, 0.15)`, border 1px solid `#EF4444`, text `#EF4444`, uppercase tracking.

### Cards & QR Viewport
- **QR Bridge Card:** Grounded on `#111827`, bordered with a 1px stroke of `#1E293B`. The QR viewport itself uses an elevated high-contrast white `#FFFFFF` substrate with rounded interior corners (`0.5rem`) to guarantee camera readability in low-light ambulance environments.
- **Clinical Overview Module:** Surface `#111827` segmented by horizontal hairline borders (`#1E293B`). Vital signs are separated into modular sub-cells with secondary labels (`label-sm`, `#94A3B8`) over primary metrics (`title-md`, `#F8FAFC`).

### Inputs & Verification Toggles
- **Input Fields:** Background `#111827`, border 1px solid `#334155`, text `#F8FAFC`. Focus state drives border color to `#06B6D4` with a matching `0 0 0 2px rgba(6, 182, 212, 0.2)` ring.
- **Biometric / PIN Confirmation Switch:** Track background `#1E293B` (inactive) to `#10B981` (active), with an illuminated white indicator node.