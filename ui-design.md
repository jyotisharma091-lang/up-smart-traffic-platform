# UP Smart Traffic Enforcement & Management Platform

**UI Design Document**
Version 1.0 | Uttar Pradesh Police | Internal

---

## Table of Contents

1. [Design System](#1-design-system)
   - [Color Palette](#11-color-palette)
   - [Typography](#12-typography)
   - [Spacing & Grid](#13-spacing--grid)
   - [Breakpoints](#14-breakpoints)
   - [Component Tokens](#15-component-tokens)
   - [Animation Principles](#16-animation-principles)
   - [Dark Mode](#17-dark-mode)
2. [Global Shell & Navigation](#2-global-shell--navigation)
   - [App Shell Layout](#21-app-shell-layout)
   - [Topbar](#22-topbar)
   - [Sidebar](#23-sidebar)
   - [Demo Mode Banner & Capabilities](#24-demo-mode-banner--capabilities)
3. [Page Layouts](#3-page-layouts)
   - [Login Page](#31-login-page)
   - [State Admin Dashboard](#32-state-admin-dashboard)
   - [District Admin Dashboard](#33-district-admin-dashboard)
   - [Traffic Officer Dashboard](#34-traffic-officer-dashboard)
   - [Violation Upload Page](#35-violation-upload-page)
   - [User Management Page](#36-user-management-page)
   - [Reports Page](#37-reports-page)
   - [Vehicle Search Page](#38-vehicle-search-page)
   - [Map & Heatmap Page](#39-map--heatmap-page)
4. [Shared Components](#4-shared-components)
5. [Framer Motion Animation Specs](#5-framer-motion-animation-specs)
6. [Accessibility & Responsive Behavior](#6-accessibility--responsive-behavior)

---

## 1. Design System

### 1.1 Color Palette

The palette is inspired by the Uttar Pradesh Police identity — authoritative navy and deep blue tones anchored by amber accents and clean neutral surfaces.

#### Light Theme (Default)

```css
/* Primary — UP Police Navy */
--color-primary-50:  #EEF2FF;
--color-primary-100: #E0E7FF;
--color-primary-200: #C7D2FE;
--color-primary-300: #A5B4FC;
--color-primary-400: #818CF8;
--color-primary-500: #6366F1;   /* primary brand */
--color-primary-600: #4F46E5;   /* interactive default */
--color-primary-700: #4338CA;   /* interactive hover */
--color-primary-800: #1E3A5F;   /* deep navy — sidebar bg */
--color-primary-900: #0F2241;   /* darkest navy */

/* Accent — Amber / Gold (UP Police badge gold) */
--color-accent-300: #FCD34D;
--color-accent-400: #FBBF24;
--color-accent-500: #F59E0B;    /* accent default */
--color-accent-600: #D97706;    /* accent hover */

/* Semantic */
--color-success:  #10B981;      /* active status, verified */
--color-warning:  #F59E0B;      /* pending, 2nd warning */
--color-danger:   #EF4444;      /* rejected, 3rd warning, challan */
--color-info:     #3B82F6;      /* informational, AI badge */

/* Neutrals */
--color-surface:  #FFFFFF;      /* card / panel bg */
--color-bg:       #F1F5F9;      /* page background */
--color-border:   #E2E8F0;      /* dividers, inputs */
--color-muted:    #94A3B8;      /* placeholder, secondary text */
--color-text:     #0F172A;      /* primary body text */
--color-text-sub: #475569;      /* secondary body text */
```

#### Dark Theme (Optional)

```css
--color-surface:  #1E293B;
--color-bg:       #0F172A;
--color-border:   #334155;
--color-muted:    #64748B;
--color-text:     #F1F5F9;
--color-text-sub: #94A3B8;
/* Primary and accent tokens remain the same */
```

> Dark mode is toggled via a button in the Topbar. The `data-theme="dark"` attribute is set on `<html>`. All color tokens switch via CSS variables — no class duplication needed.

---

### 1.2 Typography

**Font Stack:** `Inter` (Google Fonts) — loaded via `<link>` in `index.html`.

| Role               | Family   | Weight | Size (mobile → desktop) | Line Height |
|--------------------|----------|--------|--------------------------|-------------|
| Display Heading    | Inter    | 700    | 24px → 32px              | 1.2         |
| Page Title (H1)    | Inter    | 700    | 20px → 28px              | 1.25        |
| Section Title (H2) | Inter    | 600    | 16px → 22px              | 1.3         |
| Card Title (H3)    | Inter    | 600    | 14px → 18px              | 1.4         |
| Body               | Inter    | 400    | 14px → 15px              | 1.6         |
| Small / Label      | Inter    | 500    | 12px → 13px              | 1.5         |
| Badge / Tag        | Inter    | 600    | 11px → 12px              | 1.0         |
| Monospace (plates) | JetBrains Mono | 600 | 13px → 15px           | 1.4         |

```css
/* index.css — font import */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@600&display=swap');
```

---

### 1.3 Spacing & Grid

The layout uses an **8px base unit** grid. All padding, margin, and gap values are multiples of 4px or 8px.

| Token  | Value  | Usage                              |
|--------|--------|------------------------------------|
| `xs`   | 4px    | Icon gap, tight list items         |
| `sm`   | 8px    | Input padding, small card gap      |
| `md`   | 16px   | Card padding, section gap          |
| `lg`   | 24px   | Page section margin                |
| `xl`   | 32px   | Hero sections, large card padding  |
| `2xl`  | 48px   | Page-level vertical rhythm         |

**Content Max Width:** `1280px` centered with auto horizontal margin.

**Dashboard Grid:**
- Mobile: 1 column, full-width cards
- Tablet (≥768px): 2-column grid
- Desktop (≥1024px): 3 or 4-column grid depending on page

---

### 1.4 Breakpoints

```css
/* Tailwind-aligned breakpoints */
--bp-sm:  640px;   /* large phones, landscape */
--bp-md:  768px;   /* tablets */
--bp-lg:  1024px;  /* small laptops */
--bp-xl:  1280px;  /* standard desktops */
--bp-2xl: 1536px;  /* large monitors */
```

Mobile-first approach: all base styles target `< 640px`. Media queries layer upward.

---

### 1.5 Component Tokens

```css
/* Border Radius */
--radius-sm:   6px;    /* inputs, tags */
--radius-md:   10px;   /* cards, modals */
--radius-lg:   16px;   /* hero panels */
--radius-full: 9999px; /* pills, avatars */

/* Shadow */
--shadow-xs: 0 1px 2px rgba(0,0,0,0.05);
--shadow-sm: 0 2px 8px rgba(0,0,0,0.08);
--shadow-md: 0 4px 16px rgba(0,0,0,0.10);
--shadow-lg: 0 8px 32px rgba(0,0,0,0.14);

/* Sidebar */
--sidebar-width: 260px;
--sidebar-collapsed: 64px;

/* Topbar */
--topbar-height: 60px;
```

---

### 1.6 Animation Principles

All animations use **Framer Motion**. The platform follows a purposeful motion philosophy:

| Principle             | Rule                                                                |
|-----------------------|---------------------------------------------------------------------|
| **Purposeful**        | Motion conveys meaning — entrance, transition, status change        |
| **Fast by default**   | Most transitions: 150ms–300ms; never exceed 500ms for UI elements   |
| **Ease out**          | Default easing: `easeOut` for entrance, `easeIn` for exit           |
| **Stagger children**  | List items and stat cards stagger in at 50ms intervals              |
| **No layout jumps**   | Use `AnimatePresence` with `mode="wait"` on route transitions       |
| **Respect motion**    | Wrap all animations in `useReducedMotion()` check                   |

```tsx
// Shared page transition variant
export const pageVariants = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.2 } }
};

// Stagger container
export const staggerContainer = {
  visible: { transition: { staggerChildren: 0.05 } }
};

// Stagger item
export const staggerItem = {
  hidden:  { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } }
};
```

---

### 1.7 Dark Mode

- Default: **Light Theme**
- Toggle: sun/moon icon button in the Topbar right section
- Persistence: stored in `localStorage` under key `"theme"`
- Implementation: set `data-theme="dark"` on `<html>`, all colors respond via CSS variables
- Framer Motion: icon rotates 180° on toggle with a `spring` transition

---

## 2. Global Shell & Navigation

### 2.1 App Shell Layout

The `AppShell.tsx` component wraps every authenticated page with the full layout structure.

```
┌────────────────────────────────────────────────────────────────────┐
│  DEMO MODE BANNER (conditional — amber strip, full width, top)      │
├────────────────────────────────────────────────────────────────────┤
│  TOPBAR (fixed, full width, height: 60px)                          │
│  [☰ Logo]  [Page Title]  [Search]  [🔔 Notif]  [🌙]  [Avatar]    │
├──────────────┬─────────────────────────────────────────────────────┤
│              │                                                      │
│   SIDEBAR    │   MAIN CONTENT AREA                                 │
│   (fixed,    │   (scrollable, padding: md lg)                      │
│   260px)     │   max-width: 1280px, centered                       │
│              │                                                      │
│   Role-aware │   <AnimatePresence mode="wait">                     │
│   nav links  │     <motion.div variants={pageVariants}>            │
│              │       {children}                                     │
│              │     </motion.div>                                    │
│              │   </AnimatePresence>                                 │
│              │                                                      │
└──────────────┴─────────────────────────────────────────────────────┘

MOBILE (< 768px):
  - Sidebar collapses to an off-canvas drawer (slides in from left)
  - Topbar ☰ hamburger button toggles the drawer
  - Overlay backdrop dims content behind drawer
  - Bottom navigation bar appears with 5 key items (role-aware)
```

**Mobile Bottom Navigation Bar** (≤ 768px only):

```
┌──────────────────────────────────────────────────────────────────┐
│  🏠 Home  |  📷 Capture  |  🔍 Search  |  📋 Cases  |  👤 Me   │
│  (active tab highlighted with primary color + animated indicator)│
└──────────────────────────────────────────────────────────────────┘
```

- Fixed at bottom, height: 56px
- Active tab: primary-600 icon + label + animated underline pill
- Framer Motion: `layoutId="tab-indicator"` for smooth pill movement

---

### 2.2 Topbar

**File:** `components/layout/Topbar.tsx`

**Desktop Layout (≥ 768px):**
```
[UP Police Logo + "UP Traffic"] | [Current Page Title]  ............  [🔍 Global Search] [🔔] [🌙] [Avatar Dropdown]
```

**Mobile Layout (< 768px):**
```
[☰ Hamburger] | [Logo] | [Page Title]  ......  [🔔] [Avatar]
```

**Component details:**

| Element           | Description                                                                 |
|-------------------|-----------------------------------------------------------------------------|
| Logo              | UP Police shield SVG + "UP Traffic" wordmark, 36px tall                    |
| Page Title        | Current route name, `font-semibold`, hidden on mobile if long              |
| Global Search     | Desktop only — pill-shaped input, `⌘K` shortcut triggers command palette   |
| Notification Bell | Icon with animated red badge counter; Framer Motion pulse on new alerts     |
| Theme Toggle      | Sun/Moon icon, animated 180° rotation on toggle                            |
| Avatar Dropdown   | Circular avatar with initials, role badge below name in dropdown panel      |
| Demo Mode Tag     | Amber `DEMO` pill badge next to logo when in demo mode                     |

**Avatar Dropdown Menu:**
```
┌─────────────────────────┐
│  [Avatar] Full Name     │
│           Sub-Inspector │
│           District      │
├─────────────────────────┤
│  👤  My Profile         │
│  🔔  Notifications      │
│  ⚙️  Settings           │
├─────────────────────────┤
│  🚪  Logout             │
└─────────────────────────┘
```
- Animation: `motion.div` with `origin: "top right"`, scale from 0.95 → 1, opacity 0 → 1, 200ms

---

### 2.3 Sidebar

**File:** `components/layout/Sidebar.tsx`

**Desktop:** Fixed left, 260px wide, collapsible to 64px icon-only mode.

```
┌─────────────────────────┐
│ ← [Collapse Arrow]      │
├─────────────────────────┤
│ 🏠  Dashboard           │  ← active: primary-600 bg pill, left border indicator
│ 📋  My Cases            │  ← hover: primary-50 bg
│ 📷  Capture Violation   │
│ 🔍  Vehicle Search      │
│ 🗺️   Map & Hotspots     │
│ 📊  Reports             │
│ 👥  User Management     │  ← State Admin only
│ ⚙️  System Config       │  ← State Admin only
├─────────────────────────┤
│ DISTRICT: Lucknow       │  ← muted label, small
│ MODE: [DEMO PILL]       │
└─────────────────────────┘
```

**Sidebar Behavior:**
- Role-aware: nav items rendered conditionally per `useAuth()` role
- Collapse animation: `motion.div` width animates `260px → 64px` with `spring` transition
- Item labels fade out with `opacity: 0` on collapse; tooltips appear on hover
- Active item: left border accent (`4px solid primary-600`) + `primary-50` background
- Section headers: uppercase muted label for grouping (e.g., `ADMIN TOOLS`)

**Sidebar Nav Map by Role:**

| Nav Item             | Officer | District Admin | State Admin |
|----------------------|---------|----------------|-------------|
| Dashboard            | ✅       | ✅              | ✅           |
| Capture Violation    | ✅       | —              | —           |
| My Cases             | ✅       | —              | —           |
| Vehicle Search       | ✅       | ✅              | —           |
| Verification Queue   | —       | ✅              | —           |
| Officer Management   | —       | ✅              | —           |
| Reports              | —       | ✅              | ✅           |
| Map & Hotspots       | —       | ✅              | ✅           |
| User Management      | —       | —              | ✅           |
| System Config        | —       | —              | ✅           |

---

### 2.4 Demo Mode Banner & Capabilities

**File:** `components/shared/DemoModeBanner.tsx`

```
┌────────────────────────────────────────────────────────────────────┐
│  ⚠  DEMO MODE — No real data is being used or affected.           │
│                                    [Switch to Production →]        │
└────────────────────────────────────────────────────────────────────┘
```

- Height: 40px, full viewport width
- Background: `--color-accent-400` (amber), text: `#1A1A1A`
- Positioned above Topbar; pushes all content down
- Framer Motion: slides down from `y: -40` to `y: 0` on appearance, 300ms
- "Switch to Production" link: State Admin only

**Demo Mode Includes:**
To ensure the system appears fully functional without touching real production data or APIs, the following mock services are activated:
- **Mock SMS Service:** Simulates sending warnings and challans to citizens. The UI displays "SMS Sent" success toasts and history logs.
- **Mock Vehicle Registry:** Returns simulated owner and vehicle details for testing search and verification flows.
- **Mock Control Room Queue:** Auto-generates mock pending violations (with placeholder images and data) to populate the Verification Queue for District Admins.
- **Mock Notifications:** Simulates real-time system alerts, officer activity, and status updates via the notification bell.

---

## 3. Page Layouts

---

### 3.1 Login Page

**File:** `pages/auth/LoginPage.tsx`
**Route:** `/login` (public, unauthenticated only)

#### Purpose
Single entry point for all roles. Clean, authoritative government aesthetic with UP Police branding. Optimized for mobile use by field officers.

#### Layout

```
MOBILE (< 768px) — Full Screen Card:
┌───────────────────────────────────┐
│                                   │
│    [UP Police Shield Logo]        │
│    UP Smart Traffic Platform      │
│    Uttar Pradesh Police           │
│                                   │
│  ┌─────────────────────────────┐  │
│  │       Sign In               │  │
│  │                             │  │
│  │  Username                   │  │
│  │  [___________________________]  │
│  │                             │  │
│  │  Password                   │  │
│  │  [________________________🙈]  │
│  │                             │  │
│  │  [      Sign In Button     ]│  │
│  │                             │  │
│  │  ─── Forgot credentials? ───│  │
│  │  Contact your administrator │  │
│  └─────────────────────────────┘  │
│                                   │
│  v1.0 | © 2025 UP Police          │
└───────────────────────────────────┘

DESKTOP (≥ 768px) — Split Layout:
┌──────────────────────┬────────────────────────┐
│                      │                        │
│  [Hero Panel]        │  [Login Card]          │
│                      │                        │
│  UP Police Shield    │  Sign In to            │
│  (large, centered)   │  UP Traffic Platform   │
│                      │                        │
│  "Modernizing        │  Username field        │
│  Traffic             │  Password field        │
│  Enforcement         │                        │
│  Across              │  Sign In button        │
│  Uttar Pradesh"      │                        │
│                      │  Demo credentials hint │
│  Gradient overlay:   │  (shown in demo mode)  │
│  navy → deep blue    │                        │
│                      │                        │
└──────────────────────┴────────────────────────┘
```

#### Component Breakdown

| Element              | Specification                                                                 |
|----------------------|-------------------------------------------------------------------------------|
| Logo                 | UP Police shield SVG, 80px (mobile) / 120px (desktop)                        |
| Platform Title       | "UP Smart Traffic Platform", H1, `font-bold`, primary-800                    |
| Sub-label            | "Uttar Pradesh Police", body, muted                                           |
| Username Input       | Labeled `htmlFor`, autofocus, `autocomplete="username"`, icon prefix (👤)     |
| Password Input       | Eye toggle icon (show/hide), `autocomplete="current-password"`                |
| Sign In Button       | Full width, primary-600 bg, white text, 48px height, `border-radius: md`      |
| Error State          | Red alert box below form, icon + message, slides in with Framer Motion        |
| Loading State        | Button shows spinner + "Signing in…" text, disabled                           |
| Demo Mode Hint       | Amber info box showing sample credentials, only rendered when in Demo Mode    |
| Hero Panel (desktop) | `linear-gradient(135deg, #0F2241, #1E3A5F)` with subtle mesh/pattern overlay  |
| Footer               | Version tag and copyright, `text-xs muted`, centered                          |

#### Framer Motion Animations

- **Card entrance:** `opacity: 0, y: 32` → `opacity: 1, y: 0`, `duration: 0.4, ease: "easeOut"`
- **Logo:** `scale: 0.8, opacity: 0` → `scale: 1, opacity: 1`, `delay: 0.1`
- **Form fields:** stagger in at 80ms intervals after card appears
- **Error shake:** `x: [-8, 8, -8, 8, 0]`, `duration: 0.4` on failed login
- **Button loading:** spinner `rotate: 360` infinitely while loading
- **Hero text (desktop):** words animate in with `opacity: 0, x: -20` → `opacity: 1, x: 0` stagger

#### Post-Login Redirect

After successful login:
- `navigate` to role-specific dashboard
- Route: `/officer/dashboard`, `/district/dashboard`, or `/state/dashboard`
- Framer Motion: `AnimatePresence` page transition fades login out, dashboard fades in

---

### 3.2 State Admin Dashboard

**File:** `pages/state/StateDashboard.tsx`
**Route:** `/state/dashboard`
**Access:** State Admin only

#### Purpose
High-level operational overview of the entire state. Real-time KPIs, district breakdown, AI detection stats, and system health — all at a glance.

#### Layout

```
MOBILE (< 768px):
┌───────────────────────────────────────┐
│  PageHeader: "State Overview"         │
│  [Today's Date]  [Export ▾] [Filter]  │
├───────────────────────────────────────┤
│  KPI Cards (vertical scroll):         │
│  ┌─────────────────────────────────┐  │
│  │  📷 Total Violations Today      │  │
│  │  1,247   ↑ 12% vs yesterday    │  │
│  └─────────────────────────────────┘  │
│  ┌─────────────────────────────────┐  │
│  │  ⚠️ Pending Verification Queue  │  │
│  │  89     Across 15 districts    │  │
│  └─────────────────────────────────┘  │
│  ┌─────────────────────────────────┐  │
│  │  ✅ Challans Recommended        │  │
│  │  34     This week              │  │
│  └─────────────────────────────────┘  │
│  ┌─────────────────────────────────┐  │
│  │  👥 Active Officers             │  │
│  │  412    Online now             │  │
│  └─────────────────────────────────┘  │
├───────────────────────────────────────┤
│  Violation Trend Chart (line)         │
│  [Last 7 days — full width]           │
├───────────────────────────────────────┤
│  District Performance Table           │
│  (scrollable, rank | district | count)│
├───────────────────────────────────────┤
│  AI Detection Breakdown               │
│  (horizontal bar chart per type)      │
├───────────────────────────────────────┤
│  Recent Activity Feed                 │
│  (timeline list, last 10 events)      │
└───────────────────────────────────────┘

DESKTOP (≥ 1024px):
┌──────────────────────────────────────────────────────────────────┐
│  PageHeader: "State Overview"     [Date Range ▾] [Export ▾]      │
├──────────┬──────────┬──────────┬──────────────────────────────────┤
│ KPI Card │ KPI Card │ KPI Card │ KPI Card  (4-column grid)        │
│ Violations│ Queue   │ Challans │ Officers                          │
├──────────┴──────────┴──────────┴──────────────────────────────────┤
│ Violation Trend Chart (line, 7/30/90d tab)    │ Donut: AI Types  │
│                                               │                   │
│                                               │                   │
├───────────────────────────────────────────────┼───────────────────┤
│ District Performance Table (sortable)         │ System Health     │
│ Rank | District | Violations | Queue | Alerts │ Backend: ✅ Green │
│                                               │ DB: ✅ Green      │
│                                               │ AI Model: ✅      │
│                                               │ Mode: [DEMO]      │
├───────────────────────────────────────────────┴───────────────────┤
│ Recent Activity Feed (timeline with user, action, time, district) │
└──────────────────────────────────────────────────────────────────┘
```

#### KPI Card Spec

```
┌──────────────────────────────────────┐
│ [Icon — 32px, colored bg circle]     │
│                                      │
│ 1,247                                │  ← large number, 36px, font-bold
│ Total Violations Today               │  ← label, small, muted
│ ↑ 12% vs yesterday                  │  ← trend badge, success/danger color
└──────────────────────────────────────┘
```

- 4 KPI cards: Violations, Verification Queue, Challans Recommended, Active Officers
- Each card: `shadow-sm`, `radius-md`, `bg: surface`, `padding: md`
- Trend badge: green upward arrow (violations rising = bad, so apply danger color for violations)
- Framer Motion: cards stagger in, number counts up from 0 using `useMotionValue` + spring

#### Charts

| Chart                   | Library / Type          | Notes                                              |
|-------------------------|-------------------------|----------------------------------------------------|
| Violation Trend         | Line chart (Recharts)   | 7 / 30 / 90 day toggle tabs, smooth curve          |
| AI Detection Breakdown  | Horizontal bar + Donut  | Categories: Helmet, Seatbelt, Triple, Parking…     |
| District Performance    | Sortable table + bar    | Bar sparkline in each row                          |
| System Health           | Status indicators       | Green/amber/red dot + label                        |

---

### 3.3 District Admin Dashboard

**File:** `pages/district/DistrictDashboard.tsx`
**Route:** `/district/dashboard`
**Access:** District Admin only

#### Purpose
Operational hub for a single district. Focus on the Verification Queue — cases pending admin decision. Quick actions, officer status, and local analytics.

#### Layout

```
MOBILE (< 768px):
┌──────────────────────────────────────────┐
│  PageHeader: "Lucknow District"          │
│  [Verification Queue Badge: 89 pending]  │
├──────────────────────────────────────────┤
│  KPI Row (2-column grid):                │
│  ┌────────────┐  ┌────────────┐          │
│  │ Queue: 89  │  │ Closed: 34 │          │
│  └────────────┘  └────────────┘          │
│  ┌────────────┐  ┌────────────┐          │
│  │Officers:47 │  │Challans:12 │          │
│  └────────────┘  └────────────┘          │
├──────────────────────────────────────────┤
│  Verification Queue (priority list)      │
│  ┌──────────────────────────────────┐    │
│  │ 🔴 UP32AB1234 — Triple Riding    │    │  ← 3rd warning
│  │    3 warnings | 2h ago           │    │
│  │    [Review Case →]               │    │
│  └──────────────────────────────────┘    │
│  ┌──────────────────────────────────┐    │
│  │ 🟡 UP70CD5678 — No Helmet        │    │  ← 2nd warning
│  │    2 warnings | 4h ago           │    │
│  └──────────────────────────────────┘    │
│  [View All Cases →]                      │
├──────────────────────────────────────────┤
│  Officer Activity (compact list)         │
│  [PNO | Name | Violations Today | Status]│
├──────────────────────────────────────────┤
│  Today's Violation Breakdown (bar chart) │
└──────────────────────────────────────────┘

DESKTOP (≥ 1024px):
┌──────────────────────────────────────────────────────────────────┐
│  PageHeader: "Lucknow District Overview"   [Date ▾] [Export ▾]   │
├────────────┬────────────┬────────────┬────────────────────────────┤
│  Queue: 89 │  Officers  │  Challans  │  Violations Today          │
│  (danger)  │  47 active │  12 this wk│  284                       │
├────────────┴────────────┴────────────┴────────────────────────────┤
│ Verification Queue (left, 60%)        │ Officer Activity (right)   │
│ Sortable: Newest | Most Warnings      │ Table: Name, Violations,  │
│                                       │ Status, Last Active        │
│ Queue Item Card:                      │                           │
│ ┌──────────────────────────────────┐  │ Violation Types Chart     │
│ │ [Photo thumb] UP32AB1234         │  │ (donut, today's data)     │
│ │ 🚨 3 Warnings — Triple Riding    │  │                           │
│ │ Officer: Sgt. R. Singh | 2h ago  │  │                           │
│ │ [Recommend Challan] [Reject]     │  │                           │
│ │ [Close Case]                     │  │                           │
│ └──────────────────────────────────┘  │                           │
└───────────────────────────────────────┴───────────────────────────┘
```

#### Verification Queue Item Card

```
┌─────────────────────────────────────────────────────────────────┐
│  [Thumbnail 72x72]  UP32AB1234               [🚨 3 Warnings]    │
│                     Triple Riding Detected                      │
│                     AI Confidence: 94%                          │
│                     Submitted by: SI Ramesh Singh, 2h ago       │
├─────────────────────────────────────────────────────────────────┤
│  [View Case Details →]                                          │
└─────────────────────────────────────────────────────────────────┘
```

- Warning badge color: 1st = info-blue, 2nd = amber, 3rd = danger-red
- Quick actions (Recommend Challan / Reject / Close) visible in expanded card
- Framer Motion: card expands on click with `layout` prop (smooth height animation)

---

### 3.4 Traffic Officer Dashboard

**File:** `pages/officer/OfficerDashboard.tsx`
**Route:** `/officer/dashboard`
**Access:** Traffic Officer only

#### Purpose
Mobile-first field dashboard. Immediate access to today's summary, quick actions, and recent notifications. Designed for low-end smartphones and one-handed use.

#### Layout

```
MOBILE (< 768px) — PRIMARY LAYOUT:
┌───────────────────────────────────────┐
│  "Good Morning, Constable Sharma 👋"  │
│  Today: Tuesday, 3 June 2025          │
├───────────────────────────────────────┤
│  Status Card (full width):            │
│  ┌─────────────────────────────────┐  │
│  │  Your Activity Today            │  │
│  │  ┌──────┐ ┌──────┐ ┌────────┐  │  │
│  │  │  12  │ │  2   │ │   1    │  │  │
│  │  │Cases │ │Pend. │ │Challan │  │  │
│  │  └──────┘ └──────┘ └────────┘  │  │
│  └─────────────────────────────────┘  │
├───────────────────────────────────────┤
│  Quick Actions (2x2 grid):            │
│  ┌────────────┐   ┌────────────┐     │
│  │  📷        │   │  🔍        │     │
│  │  Capture   │   │  Search    │     │
│  │  Violation │   │  Vehicle   │     │
│  └────────────┘   └────────────┘     │
│  ┌────────────┐   ┌────────────┐     │
│  │  📋        │   │  🔔        │     │
│  │  My Cases  │   │  Notif.    │     │
│  └────────────┘   └────────────┘     │
├───────────────────────────────────────┤
│  Recent Notifications (last 3):       │
│  🟡 Case UP70CD5678 — 2nd Warning     │
│     Issued • 1h ago                  │
│  ✅ Case UP32AB1234 — Closed          │
│     By District Admin • 3h ago       │
│  [View All Notifications →]           │
├───────────────────────────────────────┤
│  My Recent Cases (compact list):      │
│  | UP32AB | Helmet  | ✅ Closed |     │
│  | UP71CD | Seatbelt| 🟡 Queue |     │
│  | UP88EF | Triple  | 🔵 Pend.  |    │
│  [View All Cases →]                   │
└───────────────────────────────────────┘

DESKTOP (≥ 1024px):
┌──────────────────────────────────────────────────────────────────┐
│  "Good Morning, Constable Sharma"        [Today: 3 June 2025]    │
├──────────────┬──────────────┬──────────────┬─────────────────────┤
│ Cases Today  │ Pending      │ Challan Rec. │ My Station Activity │
│     12       │    2         │     1        │ 47 violations/day   │
├──────────────┴──────────────┴──────────────┴─────────────────────┤
│ Quick Actions (horizontal row)                                    │
│ [📷 Capture Violation]  [🔍 Vehicle Search]  [📋 My Cases]       │
├────────────────────────────────────┬─────────────────────────────┤
│ My Recent Cases (table)            │ Recent Notifications        │
│ Reg. | Type | Status | Date        │ (timeline list, 5 items)    │
│                                    │                             │
│                                    │                             │
└────────────────────────────────────┴─────────────────────────────┘
```

#### Quick Action Card Spec

```
┌──────────────────────────────────┐
│                                  │
│   [Icon — 48px, colored circle]  │
│                                  │
│   Capture Violation              │  ← font-semibold
│   Take a photo or upload         │  ← text-sm, muted (desktop only)
│                                  │
└──────────────────────────────────┘
```

- Mobile: 2×2 grid, square cards, large icon + label only
- Desktop: horizontal pill-shaped cards with icon + title + description
- Hover: `translateY(-2px)` + shadow-md increase
- Active capture card: primary-600 gradient background, white text
- Framer Motion: `whileHover={{ scale: 1.02 }}`, `whileTap={{ scale: 0.97 }}`

---

### 3.5 Violation Upload Page

**File:** `pages/officer/CaptureViolation.tsx`
**Route:** `/officer/capture`
**Access:** Traffic Officer only

#### Purpose
The primary data entry interface for field officers. Designed for one-handed mobile use. Supports camera capture, gallery upload, automatic GPS tagging, and structured violation form entry.

#### Layout (Multi-Step Wizard)

The capture flow is a **3-step wizard** with a progress indicator at the top.

```
STEP INDICATOR (all screen sizes):
┌────────────────────────────────────────┐
│  ① Photo  ──────  ② Details  ──────  ③ Review  │
│  [●]──────────────[○]──────────────[○]  │
└────────────────────────────────────────┘
```

**Step 1 — Photo Capture:**

```
MOBILE:
┌───────────────────────────────────────┐
│  [← Back]   Step 1 of 3 — Photo       │
├───────────────────────────────────────┤
│                                       │
│  ┌─────────────────────────────────┐  │
│  │                                 │  │
│  │   [Drag & Drop / Tap to Select] │  │
│  │                                 │  │
│  │   📷  Take Photo                │  │
│  │   🖼️  Upload from Gallery        │  │
│  │                                 │  │
│  └─────────────────────────────────┘  │
│                                       │
│  [Preview appears here after select]  │
│                                       │
│  📍 GPS: Auto-capturing location...   │
│     [Lat: 26.8467, Lon: 80.9462]      │
│                                       │
│  [Next: Add Details →]                │
└───────────────────────────────────────┘
```

**Step 2 — Violation Details Form:**

```
MOBILE:
┌───────────────────────────────────────┐
│  [← Back]   Step 2 of 3 — Details    │
├───────────────────────────────────────┤
│  [Photo thumbnail — small, top right] │
│                                       │
│  Vehicle Registration Number *        │
│  [UP __ __ ____________________]      │
│  (monospace font input, uppercase)    │
│                                       │
│  Violation Type *                     │
│  [Select Category ▾]                 │
│  ○ No Helmet    ○ No Seatbelt         │
│  ○ Triple Riding  ○ Wrong Parking     │
│  ○ Mobile Usage  ○ Other              │
│                                       │
│  Location Description (optional)      │
│  [_________________________________]  │
│                                       │
│  Date & Time                          │
│  [Auto-filled: 3 Jun 2025, 14:32]     │
│  (editable if needed)                 │
│                                       │
│  Notes (optional)                     │
│  [_________________________________]  │
│                                       │
│  [← Back]     [Review Submission →]  │
└───────────────────────────────────────┘
```

**Step 3 — Review & Submit:**

```
MOBILE:
┌───────────────────────────────────────┐
│  [← Edit]   Step 3 of 3 — Review     │
├───────────────────────────────────────┤
│  ┌─────────────────────────────────┐  │
│  │  [Full photo preview, 200px h]  │  │
│  └─────────────────────────────────┘  │
│                                       │
│  Registration: UP32AB1234             │
│  Violation:    No Helmet              │
│  Location:     MG Road, Lucknow       │
│  GPS:          26.8467°N, 80.9462°E  │
│  Date/Time:    3 Jun 2025, 14:32      │
│  Officer:      SI Ramesh Singh        │
│                                       │
│  ⚠ AI analysis will run automatically│
│    after submission.                  │
│                                       │
│  [← Edit Details]  [Submit Report ✓]│
└───────────────────────────────────────┘
```

**Post-Submit Success State:**

```
┌───────────────────────────────────────┐
│                                       │
│           ✅                          │
│   (animated checkmark, Framer Motion) │
│                                       │
│   Violation Reported!                 │
│   Case #VIO-2025-08471               │
│   AI analysis will begin shortly.     │
│                                       │
│  [📋 View My Cases]  [📷 New Capture] │
└───────────────────────────────────────┘
```

#### Framer Motion Animations

- Step transition: `x: 100% → 0%` for forward, `x: -100% → 0%` for back, with `AnimatePresence`
- Photo drop zone: `scale: 1.02` on drag-over with dashed border highlight
- GPS indicator: pulsing dot animation (`scale: 1 → 1.4 → 1`, looping)
- Submit success: checkmark draws via `pathLength: 0 → 1`, then scale bounce
- Upload progress: animated width bar from `0% → 100%`

---

### 3.6 User Management Page

**File:** `pages/state/UserManagement.tsx`
**Route:** `/state/users`
**Access:** State Admin only

#### Purpose
Full lifecycle management of all user accounts across the state. Create, view, approve, deactivate, suspend, transfer, and retire officer accounts.

#### Layout

```
MOBILE (< 768px):
┌──────────────────────────────────────────┐
│  PageHeader: "User Management"           │
│  [+ Add New Officer]  [🔍 Filter ▾]     │
├──────────────────────────────────────────┤
│  Status Tabs (horizontal scroll):        │
│  [All] [Pending] [Active] [Deactivated]  │
│  [Suspended] [Transferred] [Retired]     │
├──────────────────────────────────────────┤
│  Search Bar: [🔍 Search by name or PNO] │
├──────────────────────────────────────────┤
│  User Cards (vertical list):             │
│  ┌──────────────────────────────────┐    │
│  │ [Avatar] Ramesh Singh            │    │
│  │          PNO: UP-12345           │    │
│  │          SI | Lucknow | SHO     │    │
│  │          🟢 Active               │    │
│  │  [View] [Actions ▾]             │    │
│  └──────────────────────────────────┘    │
│  ┌──────────────────────────────────┐    │
│  │ [Avatar] Priya Sharma            │    │
│  │          PNO: UP-23456           │    │
│  │          ASI | Agra | Kotwali   │    │
│  │          🟡 Pending Verification │    │
│  │  [Approve] [Reject] [View]      │    │
│  └──────────────────────────────────┘    │
├──────────────────────────────────────────┤
│  Pagination: [← Prev] [1] [2] [Next →]  │
└──────────────────────────────────────────┘

DESKTOP (≥ 1024px):
┌──────────────────────────────────────────────────────────────────┐
│  PageHeader: "User Management"    [+ Add New Officer]  [Export]   │
├───────────────────────────────────────────────────────────────────┤
│  [All] [Pending 12] [Active 412] [Deactivated 8] [Suspended 3]…  │
│  [🔍 Search by name, PNO, station…]   [District ▾] [Role ▾]      │
├───────────────────────────────────────────────────────────────────┤
│  Data Table:                                                      │
│  □ | Avatar+Name    | PNO      | Role | District | Station | Status│ Actions │
│  ──────────────────────────────────────────────────────────────── │
│  □ | Ramesh Singh   | UP-12345 | SI   | Lucknow  | SHO     | 🟢   │ ⋮       │
│  □ | Priya Sharma   | UP-23456 | ASI  | Agra     | Kotwali | 🟡   │ ⋮       │
│  □ | Mohan Verma    | UP-34567 | HC   | Kanpur   | Civil   | 🔴   │ ⋮       │
├───────────────────────────────────────────────────────────────────┤
│  [Bulk Actions: Select All | Deactivate | Export]                 │
│  Showing 1-25 of 423 users          [← 1  2  3  4  5 … →]        │
└───────────────────────────────────────────────────────────────────┘
```

#### Actions Dropdown per User (⋮ menu)

```
┌──────────────────────┐
│  👁  View Profile    │
│  ✏️  Edit Details    │
├──────────────────────┤
│  ✅  Activate        │  ← contextual based on current status
│  ⏸   Deactivate      │
│  🚫  Suspend         │
│  🔄  Mark Transferred│
│  🏁  Mark Retired    │
├──────────────────────┤
│  🗑  Reject Account  │  ← Pending Verification only
└──────────────────────┘
```

#### Add New Officer / Edit Officer — Side Drawer

A right-side drawer panel (not a separate page) slides in to show the form:

```
┌──────────────────────────────────┐
│  [← Close]  Add New Officer      │
├──────────────────────────────────┤
│  Full Name *                     │
│  [________________________________]│
│  PNO Number *                    │
│  [________________________________]│
│  Username *                      │
│  [________________________________]│
│  Mobile Number *                 │
│  [________________________________]│
│  Designation *     Rank *        │
│  [____________]  [_____________] │
│  Police Station *                │
│  [________________________________]│
│  District *                      │
│  [Select ▾]                      │
│  Role *                          │
│  ○ Traffic Officer               │
│  ○ District Admin                │
│  ○ State Admin                   │
│                                  │
│  [Cancel]    [Create Officer]    │
└──────────────────────────────────┘
```

- Framer Motion: drawer slides in from right (`x: "100%" → 0`), backdrop fades in
- Form validation: inline error messages below each field, red border on invalid
- On success: drawer closes, table row appears with `motion.tr` entrance animation

#### Status Badge Colors

| Status               | Color  | Icon |
|----------------------|--------|------|
| Active               | Green  | 🟢   |
| Pending Verification | Amber  | 🟡   |
| Deactivated          | Gray   | ⚫   |
| Suspended            | Red    | 🔴   |
| Transferred          | Blue   | 🔵   |
| Retired              | Purple | 🟣   |
| Rejected             | Red    | ❌   |

---

### 3.7 Reports Page

**File:** `pages/state/Analytics.tsx` (State) / `pages/district/DistrictReports.tsx` (District)
**Routes:** `/state/reports`, `/district/reports`
**Access:** State Admin + District Admin

#### Purpose
In-depth analytics with filterable charts, exportable tables, and temporal breakdowns. Supports strategic planning and operational reviews.

#### Layout

```
MOBILE (< 768px):
┌──────────────────────────────────────────┐
│  PageHeader: "Reports & Analytics"       │
│  [Date Range ▾]  [District ▾ (State)]   │
├──────────────────────────────────────────┤
│  Report Type Tabs (horizontal scroll):   │
│  [Overview] [Violations] [Officers]      │
│  [Vehicles] [Hotspots]                   │
├──────────────────────────────────────────┤
│  Summary KPIs (2 per row):               │
│  ┌──────────────┐ ┌──────────────┐       │
│  │ Total: 8,421 │ │ Challans: 89 │       │
│  └──────────────┘ └──────────────┘       │
│  ┌──────────────┐ ┌──────────────┐       │
│  │ Officers:412 │ │ Hotspots: 23 │       │
│  └──────────────┘ └──────────────┘       │
├──────────────────────────────────────────┤
│  Violations by Type (bar chart)          │
│  [Full width, horizontal scroll if many] │
├──────────────────────────────────────────┤
│  Violations Over Time (line chart)       │
│  [Weekly/Monthly toggle]                 │
├──────────────────────────────────────────┤
│  Top Offending Vehicles                  │
│  [Table: Plate | Warnings | Type]        │
├──────────────────────────────────────────┤
│  Officer Performance                     │
│  [Table: Name | Violations | Accuracy]   │
├──────────────────────────────────────────┤
│  [Export to PDF] [Export to CSV]         │
└──────────────────────────────────────────┘

DESKTOP (≥ 1024px):
┌──────────────────────────────────────────────────────────────────┐
│  PageHeader: "Reports & Analytics"                               │
│  [Date Range Picker] [District ▾] [Violation Type ▾] [Export ▾]  │
├──────────────────────────────────────────────────────────────────┤
│  Tab Nav: Overview | Violations | Officers | Vehicles | Hotspots │
├──────────────────────────────────────────────────────────────────┤
│ KPI Strip (4 across)                                             │
│ [Total Violations] [Challans Rec.] [Active Officers] [Hotspots]  │
├────────────────────────────────────┬─────────────────────────────┤
│ Violations Over Time (line, large) │ Violation Types (donut)     │
│                                    │                             │
│                                    │                             │
├────────────────────────────────────┴─────────────────────────────┤
│ District Comparison (grouped bar, State Admin only)               │
├────────────────────────────────────┬─────────────────────────────┤
│ Top Offending Vehicles             │ Officer Performance Table   │
│ Plate | Count | Last Seen | Status │ Name | Today | Total | Rate │
├────────────────────────────────────┴─────────────────────────────┤
│ AI Confidence Distribution (histogram)                           │
└──────────────────────────────────────────────────────────────────┘
```

#### Filter Bar Detail

```
┌─────────────────────────────────────────────────────────────────┐
│  📅 Date Range: [Jun 1 2025] → [Jun 3 2025]  [Custom ▾]        │
│  📍 District:   [All Districts ▾]                               │
│  🚗 Type:       [All Types ▾]                                   │
│  👤 Officer:    [All Officers ▾]                                │
│  [Apply Filters]   [Clear]                                      │
└─────────────────────────────────────────────────────────────────┘
```

- Date range: calendar picker with presets (Today, Last 7 days, This Month, Custom)
- Charts re-render with Framer Motion `AnimatePresence` when filters change
- Export: triggers PDF generation (using browser print API) or CSV download

---

### 3.8 Vehicle Search Page

**File:** `pages/officer/VehicleSearch.tsx`
**Route:** `/officer/vehicles` (Officer), `/district/vehicles` (District)
**Access:** Traffic Officer + District Admin

#### Purpose
Quick field lookup of any vehicle by registration number. Displays warning history, current case status, and violation records. Mobile-first for field use.

#### Layout

```
MOBILE (< 768px):
┌───────────────────────────────────────┐
│  PageHeader: "Vehicle Search"         │
├───────────────────────────────────────┤
│  Search Input (prominent):            │
│  ┌─────────────────────────────────┐  │
│  │  🔍  UP32AB1234                 │  │
│  │      [Search ▾] or [Scan 📷]    │  │
│  └─────────────────────────────────┘  │
│  Hint: "Enter registration number"    │
│        e.g. UP32AB1234               │
├───────────────────────────────────────┤
│  [RESULTS AREA — empty until search]  │
│                                       │
│  After Search:                        │
│  ┌─────────────────────────────────┐  │
│  │  🚗 UP32AB1234                  │  │  ← plate monospace font
│  │  Type: Two-Wheeler              │  │
│  │  ─── Owner Details ───          │  │
│  │  Name: Rakesh Kumar             │  │
│  │  Address: Gomtinagar, Lucknow   │  │
│  ├─────────────────────────────────┤  │
│  │  ─── Warning Count ───          │  │
│  │  🔴 3rd Warning                 │  │
│  │  ██████████████████ (progress)  │  │
│  │  3 of 3 warnings issued         │  │
│  ├─────────────────────────────────┤  │
│  │  ─── Verification Queue Status ─│  │
│  │  Case #CASE-2025-00891          │  │
│  │  Status: Pending Verification   │  │
│  ├─────────────────────────────────┤  │
│  │  ─── Recommended Challans ───   │  │
│  │  • Triple Riding (₹1000)        │  │
│  │  • No Helmet (₹1000)            │  │
│  ├─────────────────────────────────┤  │
│  │  ─── Previous Violations ───    │  │
│  │  • 2 Jun | No Helmet | Lucknow  │  │
│  │  • 28 May| Triple Riding | Agra │  │
│  │  • 15 May| Seatbelt | Kanpur   │  │
│  └─────────────────────────────────┘  │
│                                       │
│  [📷 Report New Violation for this]   │
└───────────────────────────────────────┘

DESKTOP (≥ 1024px):
┌──────────────────────────────────────────────────────────────────┐
│  PageHeader: "Vehicle Search"                                    │
├──────────────────────────────────────────────────────────────────┤
│  [🔍  Enter registration number e.g. UP32AB1234        Search ]  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Vehicle Details Panel (left, 40%)   History Timeline (right)   │
│  ┌────────────────────────────────┐  ┌────────────────────────┐ │
│  │  🚗 UP32AB1234                 │  │  Previous Violations    │ │
│  │  Two-Wheeler                   │  │                         │ │
│  │                                │  │  🔴 2 Jun — No Helmet   │ │
│  │  ─── Owner Details ───         │  │     Lucknow | SI Singh  │ │
│  │  Name: Rakesh Kumar            │  │     [View Photo]        │ │
│  │  Address: Gomtinagar, Lucknow  │  │                         │ │
│  │                                │  │  🟡 28 May — Triple Rid │ │
│  │  ─── Warning Count ───         │  │     Agra | HC Sharma    │ │
│  │  🔴 3 Warnings Issued          │  │     [View Photo]        │ │
│  │  [●───●───●] Progress bar      │  │                         │ │
│  │                                │  │  🔵 15 May — Seatbelt   │ │
│  │  ─── Queue Status ───          │  │     Kanpur | ASI Verma  │ │
│  │  CASE-2025-00891               │  │     [View Photo]        │ │
│  │  Status: Verification Queue    │  │                         │ │
│  │                                │  └────────────────────────┘ │
│  │  ─── Recommended Challans ───  │                             │
│  │  • Triple Riding (₹1000)       │                             │
│  │  • No Helmet (₹1000)           │                             │
│  │                                │                             │
│  │  [Report New Violation]        │                             │
│  └────────────────────────────────┘                             │
└──────────────────────────────────────────────────────────────────┘
```

#### Search Input Behavior

```
┌──────────────────────────────────────────────────────────┐
│  🔍  [UP32AB1234_________________________]  [Search]     │
└──────────────────────────────────────────────────────────┘
```

- Auto-converts input to uppercase
- `onKeyDown Enter` triggers search
- Input styled with `font-mono` (JetBrains Mono) for plate readability
- Loading state: spinner replaces search icon
- Error state: "Vehicle not found — no records match this registration"
- Framer Motion: results panel slides up from `y: 20, opacity: 0 → opacity: 1, y: 0` on load

#### Warning Progress Bar

```
Warnings: ██████████████████────────── 2/3
           [🟡] [🟡] [○]     (icon indicators)
           1st   2nd   3rd
```

- Colors: 1 warning = info-blue, 2 warnings = amber, 3 warnings = danger-red
- Animated fill on load with `width: 0% → X%` spring animation

---

### 3.9 Map & Heatmap Page

**File:** `components/map/HotspotMap.tsx` embedded in `pages/state/Analytics.tsx` + `pages/district/DistrictDashboard.tsx`
**Route:** `/state/map`, `/district/map`
**Access:** District Admin + State Admin

#### Purpose
Interactive geospatial visualization of violation hotspots across the district or state. Powered by Leaflet. Enables resource allocation and patrol planning.

#### Layout

```
MOBILE (< 768px):
┌───────────────────────────────────────┐
│  PageHeader: "Hotspot Map"            │
│  [Lucknow District ▾] [Layers ▾]     │
├───────────────────────────────────────┤
│  Filter Chips (horizontal scroll):    │
│  [All] [Helmet] [Seatbelt] [Triple]   │
│  [Parking] [Mobile] [Today] [Week]    │
├───────────────────────────────────────┤
│  ┌─────────────────────────────────┐  │
│  │                                 │  │
│  │                                 │  │
│  │    [Leaflet Map — full width]   │  │
│  │    height: 55vh                 │  │
│  │                                 │  │
│  │  🔴 Hotspot markers             │  │
│  │  🟡 Medium clusters             │  │
│  │  🟢 Low violation zones         │  │
│  │                                 │  │
│  │  [+] [−] [⌖ My Location]        │  │
│  └─────────────────────────────────┘  │
├───────────────────────────────────────┤
│  Hotspot Summary Panel (below map):   │
│  ┌──────────────────────────────────┐ │
│  │  Top 5 Hotspots                  │ │
│  │  1. MG Road (47 violations)      │ │
│  │  2. Hazratganj (38 violations)   │ │
│  │  3. Alambagh (29 violations)     │ │
│  └──────────────────────────────────┘ │
│  [View Detailed Report →]             │
└───────────────────────────────────────┘

DESKTOP (≥ 1024px):
┌──────────────────────────────────────────────────────────────────┐
│  PageHeader: "Hotspot Map & Violation Distribution"              │
│  [District ▾ (State Admin)] [Date Range ▾] [Violation Type ▾]   │
├────────────────────────────────────────┬─────────────────────────┤
│                                        │  Hotspot Sidebar        │
│  [Leaflet Map — full height, 75vh]     │  ──────────────────     │
│                                        │  Filters:               │
│  Heatmap overlay toggleable            │  [All Types ▾]          │
│  Cluster markers with count badges     │  [Date Range ▾]         │
│                                        │                         │
│  Marker popup on click:                │  ──────────────────     │
│  ┌───────────────────────┐             │  Top 10 Hotspots        │
│  │ MG Road, Lucknow      │             │  1. MG Road — 47        │
│  │ 47 violations         │             │  2. Hazratganj — 38     │
│  │ Most common: Helmet   │             │  3. Alambagh — 29       │
│  │ [View Violations →]   │             │  4. Charbagh — 22       │
│  └───────────────────────┘             │  5. Gomtinagar — 18     │
│                                        │                         │
│  Layer controls (bottom-right):        │  ──────────────────     │
│  [🌡 Heatmap] [📍 Markers] [🗺 Satellite]│  AI Confidence Avg    │
│                                        │  ████████░░ 84%         │
└────────────────────────────────────────┴─────────────────────────┘
```

#### Map Controls & Layer Panel

```
Bottom-right corner of map:
┌───────────┐
│  Layers   │
│  ─────── │
│  ☑ Heatmap│
│  ☑ Markers│
│  ☐ Satellite│
└───────────┘
```

#### Hotspot Marker Design

- **High density (≥ 20 violations):** Red pulsing circle marker, cluster badge
- **Medium density (10–19):** Amber marker
- **Low density (< 10):** Blue marker
- Cluster circles merge nearby markers with count label
- Click on marker → popup with location name, count, top violation type, action link
- Framer Motion: sidebar slides in from right on desktop, markers animate in with stagger on load

#### Heatmap Gradient

```
CSS gradient for Leaflet heatmap plugin:
Low:    rgba(0, 0, 255, 0.3)   → blue
Medium: rgba(255, 165, 0, 0.5) → orange
High:   rgba(255, 0, 0, 0.7)   → red
```

---

## 4. Shared Components

### 4.1 PageHeader

```
┌──────────────────────────────────────────────────────────┐
│  [← Back (if nested)]  H1: Page Title                   │
│  Subtitle or breadcrumb                   [Action CTA]  │
└──────────────────────────────────────────────────────────┘
```
- `H1` for accessibility (one per page)
- CTA button right-aligned on desktop, below title on mobile
- Framer Motion: slides in from `y: -8` on mount

---

### 4.2 Status Badge

```
Pill component:
┌──────────────┐
│  🟢 Active   │   → green bg-opacity-15, green text, green border
└──────────────┘
```

- `border-radius: full` (pill shape)
- `padding: 2px 10px`
- `font-size: 12px, font-weight: 600`
- All 7 user statuses + case statuses have distinct color tokens

---

### 4.3 Stat Card

```
┌──────────────────────────────────────────┐
│  [Icon]                        [Trend ↑] │
│                                          │
│  1,247                                   │  ← animated count-up
│  Total Violations Today                  │
│  ↑ 12% vs yesterday                     │  ← trend badge
└──────────────────────────────────────────┘
```

- Shadow: `shadow-sm` default, `shadow-md` on hover
- Border: 1px `--color-border`
- Icon container: 48px circle, 30% opacity background of semantic color

---

### 4.4 Data Table

| Feature                | Description                                                   |
|------------------------|---------------------------------------------------------------|
| Responsive             | Horizontal scroll on mobile; full columns on desktop          |
| Sortable columns       | Clickable headers with sort indicator arrows                  |
| Checkbox selection     | Select-all + individual rows for bulk actions                 |
| Row actions            | ⋮ overflow menu per row                                       |
| Empty state            | Illustration + message + CTA when no data                     |
| Loading state          | Skeleton rows with shimmer animation                          |
| Pagination             | Numbered pages + prev/next, results count label               |

---

### 4.5 Empty State

```
┌────────────────────────────────────────┐
│                                        │
│   [Illustration — muted, centered]     │
│                                        │
│   No Cases Found                       │
│   Try adjusting your search filters.  │
│                                        │
│   [+ Create First Entry]              │
│       (optional CTA)                   │
│                                        │
└────────────────────────────────────────┘
```

- Used in all list/table views when no records match
- Illustration: simple SVG in `--color-muted` tones
- Framer Motion: `opacity: 0 → 1`, `y: 16 → 0`, 400ms

---

### 4.6 Confirmation Modal

```
┌─────────────────────────────────────────┐
│  ⚠  Confirm Action                      │
│                                         │
│  Are you sure you want to Suspend       │
│  Officer Ramesh Singh (UP-12345)?       │
│                                         │
│  This action can be reversed.           │
│                                         │
│  [Cancel]         [Suspend Officer]     │
└─────────────────────────────────────────┘
```

- Backdrop: `rgba(0,0,0,0.5)`, blurred
- Modal: `radius-md`, `shadow-lg`, centered
- Framer Motion: backdrop fades in, modal scales `0.95 → 1` with `spring`
- Destructive action button: `danger` color

---

### 4.7 Notification Toast

```
┌───────────────────────────────────────────┐
│  ✅  Case Submitted Successfully           │
│      Case #VIO-2025-08471 is now pending. │
│                                   [✕]    │
└───────────────────────────────────────────┘
```

- Position: top-right on desktop, top-center on mobile
- Auto-dismiss: 4 seconds
- Framer Motion: slides in from top, slides out upward on dismiss
- Variants: success (green), warning (amber), error (red), info (blue)

---

## 5. Framer Motion Animation Specs

### 5.1 Page Transition

```tsx
// AppShell wraps routes with AnimatePresence
<AnimatePresence mode="wait">
  <motion.div
    key={location.pathname}
    variants={pageVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
  >
    {page}
  </motion.div>
</AnimatePresence>

// pageVariants (defined in Section 1.6)
```

---

### 5.2 Dashboard Stat Cards — Count-Up

```tsx
import { useMotionValue, useSpring, useEffect } from "framer-motion";

function AnimatedCounter({ target }: { target: number }) {
  const count = useMotionValue(0);
  const spring = useSpring(count, { stiffness: 80, damping: 20 });
  useEffect(() => { count.set(target); }, [target]);
  return <motion.span>{Math.round(spring.get())}</motion.span>;
}
```

---

### 5.3 Sidebar Collapse

```tsx
<motion.aside
  animate={{ width: collapsed ? 64 : 260 }}
  transition={{ type: "spring", stiffness: 300, damping: 30 }}
>
  <motion.span
    animate={{ opacity: collapsed ? 0 : 1 }}
    transition={{ duration: 0.15 }}
  >
    {label}
  </motion.span>
</motion.aside>
```

---

### 5.4 Drawer (User Management / Case Detail)

```tsx
<AnimatePresence>
  {drawerOpen && (
    <>
      <motion.div
        className="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeDrawer}
      />
      <motion.div
        className="drawer"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {drawerContent}
      </motion.div>
    </>
  )}
</AnimatePresence>
```

---

### 5.5 Violation Capture — Wizard Step Transition

```tsx
const direction = useRef(1); // 1 = forward, -1 = back

const stepVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 })
};

<AnimatePresence custom={direction.current} mode="wait">
  <motion.div
    key={step}
    custom={direction.current}
    variants={stepVariants}
    initial="enter"
    animate="center"
    exit="exit"
    transition={{ duration: 0.3, ease: "easeInOut" }}
  >
    <StepComponent />
  </motion.div>
</AnimatePresence>
```

---

### 5.6 Map Marker Entrance

```tsx
// Stagger map markers as they load
const markerVariants = {
  hidden:  { scale: 0, opacity: 0 },
  visible: (i: number) => ({
    scale: 1,
    opacity: 1,
    transition: { delay: i * 0.03, type: "spring", stiffness: 400, damping: 20 }
  })
};
```

---

### 5.7 Tab Active Indicator (Bottom Nav & Tabs)

```tsx
// Shared layoutId creates smooth sliding pill
<motion.div
  layoutId="active-tab-indicator"
  className="tab-pill"
  transition={{ type: "spring", stiffness: 400, damping: 35 }}
/>
```

---

### 5.8 Submit Success Checkmark (SVG path animation)

```tsx
<svg viewBox="0 0 50 50" width="80" height="80">
  <motion.circle
    cx="25" cy="25" r="20"
    stroke="#10B981" strokeWidth="2" fill="none"
    initial={{ pathLength: 0 }}
    animate={{ pathLength: 1 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
  />
  <motion.path
    d="M15 25 L22 32 L35 18"
    stroke="#10B981" strokeWidth="2.5" fill="none" strokeLinecap="round"
    initial={{ pathLength: 0 }}
    animate={{ pathLength: 1 }}
    transition={{ delay: 0.3, duration: 0.3, ease: "easeOut" }}
  />
</svg>
```

---

## 6. Accessibility & Responsive Behavior

### 6.1 Keyboard Navigation

- All interactive elements have visible focus rings (`outline: 2px solid primary-500`)
- Modals trap focus (use `@radix-ui/react-focus-trap` via Shadcn)
- Drawer: `Escape` key closes
- Search: `⌘K` / `Ctrl+K` opens command palette on desktop

### 6.2 ARIA Labels

```tsx
// Key ARIA usage
<button aria-label="Open notifications">
<nav aria-label="Main navigation">
<main aria-label="Page content">
<dialog aria-modal="true" aria-labelledby="modal-title">
<table role="grid" aria-label="User list">
```

### 6.3 Reduced Motion

```tsx
import { useReducedMotion } from "framer-motion";

function AnimatedCard({ children }) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      variants={prefersReduced ? {} : staggerItem}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  );
}
```

### 6.4 Responsive Breakpoint Summary

| Page                    | Mobile (< 768px)            | Tablet (768–1024px)         | Desktop (≥ 1024px)            |
|-------------------------|-----------------------------|-----------------------------|-------------------------------|
| Login                   | Full-screen card            | Centered card, wider        | Split hero + form             |
| State Dashboard         | Vertical card stack         | 2-col KPI grid + charts     | 4-col KPIs + 2-col charts     |
| District Dashboard      | Vertical stack              | 2-col KPI + queue list      | Queue + Officer side-by-side  |
| Officer Dashboard       | Mobile-optimized quick-act  | 2-col grid                  | Full sidebar + table          |
| Capture Violation       | Full-screen wizard          | Centered wizard, wider form | Centered wizard, 600px max-w  |
| User Management         | Card list per user          | Table (limited cols)        | Full table with all columns   |
| Reports                 | Stacked charts              | 2-col layout                | Side-by-side chart grid       |
| Vehicle Search          | Full-width search + results | Centered, 640px max-w       | Split panel + timeline        |
| Map & Heatmap           | Map 55vh + list below       | Map + sidebar               | Full map + wide sidebar       |

### 6.5 Color Contrast

All text-on-background combinations meet **WCAG AA** minimum (4.5:1 for body text, 3:1 for large text):

| Background         | Text Color        | Contrast Ratio |
|--------------------|-------------------|----------------|
| `surface` (#FFF)   | `text` (#0F172A)  | 18.1:1 ✅       |
| `primary-600`      | White             | 7.2:1 ✅        |
| `accent-400`       | `#1A1A1A`         | 8.1:1 ✅        |
| `success` bg-15%   | `success` dark    | 5.2:1 ✅        |

### 6.6 Mobile UX Optimizations

- **Touch targets:** minimum 44×44px for all buttons and interactive elements
- **Safe area insets:** `env(safe-area-inset-*)` applied to bottom navigation for notched devices
- **Input zoom prevention:** `font-size: 16px` on all inputs (prevents iOS zoom on focus)
- **Offline handling:** PWA service worker caches app shell; shows offline banner on connection loss
- **Camera access:** `<input type="file" accept="image/*" capture="environment">` for direct camera capture on mobile
- **GPS:** Geolocation API with timeout fallback; shows error if location denied

---

*UI Design Document prepared for frontend implementation.*
*Aligned with product.md Version 1.0 and architecture.md Version 1.0.*
*All layouts are implementation guides; pixel-perfect values to be finalized during development.*
