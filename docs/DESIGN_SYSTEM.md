# iGuard Design System

## Overview

iGuard's design system is inspired by modern SaaS dashboards like Stripe, Vercel, and Linear, emphasizing clarity, professionalism, and data density.

## Design Philosophy

### Core Principles
1. **Clarity First**: Information should be immediately understandable
2. **Trust Through Design**: Professional aesthetic builds confidence in financial transactions
3. **Data Density**: Maximize information without overwhelming users
4. **Consistency**: Predictable patterns across all interfaces

### Design Inspiration
- **Stripe**: Clean data tables, clear typography, professional color palette
- **Vercel**: Modern aesthetics, subtle animations, card-based layouts
- **Linear**: Sharp interface, excellent contrast, purposeful spacing

## Typography

### Font Families
- **UI Text**: Inter (Google Fonts)
  - Weights: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
  - Usage: All interface text, buttons, labels
- **Code/Monospace**: JetBrains Mono
  - Usage: API keys, code snippets, technical identifiers

### Type Scale
- **Display**: 3xl-6xl for hero headings
- **Headings**: xl-2xl for page titles
- **Body**: base (16px) for primary content
- **Small**: sm for supporting text
- **Tiny**: xs for metadata and timestamps

## Color System

### Semantic Colors
All colors use HSL format with CSS custom properties for light/dark mode support:

#### Primary (Brand)
- Used for: Primary actions, active states, brand elements
- Accessible on both light and dark backgrounds

#### Accent
- Used for: Secondary actions, highlights, interactive elements
- Complements primary color

#### Background Layers
- `background`: Main canvas
- `card`: Elevated surfaces
- `muted`: Subtle backgrounds for secondary content

#### Text Hierarchy
- `foreground`: Primary text (highest contrast)
- `muted-foreground`: Secondary text (medium contrast)  
- `tertiary-foreground`: Least important text (low contrast)

#### Semantic States
- `destructive`: Errors, delete actions
- `success`: Confirmations, positive states
- `warning`: Cautions, important notices

### Light/Dark Mode
- Automatic switching via `dark` class on `<html>`
- All colors defined with light and dark variants
- Consistent contrast ratios across modes

## Spacing System

### Scale
- **Small**: 4px, 8px, 12px (tight spacing)
- **Medium**: 16px, 20px, 24px (default spacing)
- **Large**: 32px, 40px, 48px (section spacing)

### Application
- Card padding: 24px (p-6)
- Section gaps: 32px (gap-8)
- Component spacing: 16px (space-y-4)
- Button padding: 16px horizontal, 8px vertical

## Components

### Cards
- Border radius: 8px (rounded-md)
- Border: 1px subtle border
- Background: `bg-card`
- Shadow: Minimal, subtle elevation

### Buttons
Variants:
- **default**: Primary actions (bg-primary)
- **secondary**: Secondary actions (bg-secondary)
- **outline**: Tertiary actions (border only)
- **ghost**: Minimal actions (transparent)
- **destructive**: Delete/remove actions (bg-destructive)

Sizes:
- **sm**: Compact (h-8)
- **default**: Standard (h-9)
- **lg**: Prominent (h-10)
- **icon**: Square (h-9 w-9)

### Tables
- Zebra striping for readability
- Hover states on rows
- Sticky headers for long tables
- Responsive horizontal scroll

### Forms
- Clear labels above inputs
- Validation messages below inputs
- Consistent input height (h-9)
- Focus rings for accessibility

## Layout Patterns

### Page Structure
```
┌─────────────────────────────────────┐
│ Navigation (sticky top)              │
├─────────────────────────────────────┤
│ Page Header (title + actions)       │
├─────────────────────────────────────┤
│ Main Content                         │
│ ┌─────────┐ ┌─────────┐            │
│ │  Card   │ │  Card   │            │
│ └─────────┘ └─────────┘            │
│                                      │
│ ┌──────────────────────────────────┐│
│ │  Full-width Table/Content        ││
│ └──────────────────────────────────┘│
└─────────────────────────────────────┘
```

### Grid System
- 12-column responsive grid (Tailwind)
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Gap: 24px (gap-6) for cards, 16px (gap-4) for forms

### Responsive Behavior
- Mobile-first approach
- Stack cards vertically on mobile
- Horizontal scrolling for tables
- Collapsible navigation on small screens

## Interaction Patterns

### Hover States
- Buttons: Subtle elevation via `hover-elevate`
- Cards: Elevation + border color shift
- Links: Underline appears
- Table rows: Background color change

### Active/Pressed States  
- Buttons: Deeper elevation via `active-elevate-2`
- Inputs: Border color intensifies
- Visual feedback within 100ms

### Loading States
- Skeleton screens for initial loads
- Spinner for in-progress actions
- Disabled state for buttons during mutations
- Optimistic updates where possible

### Transitions
- Duration: 150ms for most interactions
- Easing: Ease-in-out for smoothness
- Properties: Background, border, transform
- No transitions on layout properties (prevents janky animations)

## Icons

### Library
- **Lucide React**: Primary icon set
- **React Icons (Simple Icons)**: Brand logos only

### Usage
- Size: 16px (h-4 w-4) for inline, 20px (h-5 w-5) for buttons
- Color: Inherit from parent text color
- Spacing: 8px gap from adjacent text

## Accessibility

### WCAG 2.1 AA Compliance
- Color contrast ratios: 4.5:1 for normal text, 3:1 for large text
- Focus indicators: Visible ring on all interactive elements
- Semantic HTML: Proper heading hierarchy, labels for inputs
- Keyboard navigation: Tab order follows visual order

### Screen Readers
- Alt text for all images
- ARIA labels for icon buttons
- ARIA live regions for dynamic content
- Proper form labeling

### Testing
- All interactive elements have `data-testid` attributes
- Playwright tests verify core workflows
- Manual testing with keyboard navigation

## Data Visualization

### Stats Cards
- Large number (2xl-3xl font)
- Supporting label (sm font, muted)
- Optional icon for context
- Optional trend indicator

### Tables
- Clear column headers
- Sortable columns (where applicable)
- Pagination for large datasets
- Export functionality (future)

### Charts (Future)
- Recharts library for consistency
- Muted colors with primary accent
- Clear axis labels
- Responsive sizing

## Brand Elements

### Logo
- Simple shield icon (Lucide)
- "iGuard" wordmark in semibold Inter
- Primary color for icon
- No complex graphics (keeps focus on data)

### Voice & Tone
- **Professional**: Clear, confident language
- **Helpful**: Guide users, don't confuse them
- **Concise**: Respect user's time
- **Honest**: No dark patterns or misleading UI

## File Organization

### Component Structure
```
client/src/
├── components/
│   ├── ui/              # shadcn/ui primitives
│   ├── Navigation.tsx   # Top nav
│   └── ...             # Feature components
├── pages/              # Route components
├── lib/                # Utilities
└── hooks/              # Custom hooks
```

### Style Organization
```
client/src/index.css
├── Tailwind directives
├── CSS custom properties (colors)
├── Typography imports
└── Custom utility classes
```

## Future Enhancements

### Planned Additions
- Dark mode toggle in navigation
- Customizable dashboard layouts
- Advanced data filtering
- Chart visualizations for earnings
- Mobile app (potential)

### Design Tokens
- Export colors as JSON for consistency
- Shared tokens with backend (emails, PDFs)
- Design system documentation site
