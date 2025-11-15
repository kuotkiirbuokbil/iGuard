# iGuard Design Guidelines

## Design Approach

**Selected Approach:** Design System + SaaS Dashboard References

This is a developer-focused fintech tool requiring clarity, trust, and efficiency. Draw inspiration from:
- **Primary:** Stripe Dashboard (data tables, clear hierarchy, professional trustworthiness)
- **Secondary:** Vercel/Linear (clean layouts, developer-friendly UI)
- **System Foundation:** Material Design for consistent data-dense components

**Core Principles:**
1. Information clarity over decoration
2. Consistent, scannable data presentation
3. Trust through professional polish
4. Developer-friendly interactions

---

## Typography

**Font Stack:** Inter (Google Fonts) - single family for consistency

**Hierarchy:**
- **Page Titles:** text-2xl (24px), font-semibold
- **Section Headers:** text-xl (20px), font-semibold
- **Card/Component Titles:** text-lg (18px), font-medium
- **Body Text:** text-base (16px), font-normal
- **Secondary/Helper Text:** text-sm (14px), font-normal
- **Table Headers:** text-sm (14px), font-medium, uppercase tracking-wide
- **Code/API Keys:** font-mono text-sm

---

## Layout System

**Spacing Primitives:** Use Tailwind units: 2, 4, 6, 8, 12, 16, 24
- Component padding: p-6 or p-8
- Section spacing: space-y-6 or space-y-8
- Card spacing: p-6
- Form field spacing: space-y-4

**Container Strategy:**
- Max width: max-w-7xl for dashboards
- Page padding: px-6 lg:px-8
- Two-column layouts where appropriate (form + preview, stats + table)

**Dashboard Layouts:**
- Top navigation bar: h-16
- Sidebar (if needed): w-64 on desktop, collapsible on mobile
- Main content area: Generous padding, clear sections

---

## Component Library

### Navigation
- **Top Bar:** Fixed header with logo left, user menu right, h-16
- **Breadcrumbs:** text-sm with chevron separators for context

### Cards & Containers
- **Data Cards:** Rounded corners (rounded-lg), subtle borders (border), padding p-6
- **Stat Cards:** Compact (p-4), number emphasis (text-3xl font-bold), label below (text-sm)
- **Form Cards:** Clear sections with dividers between field groups

### Forms
- **Input Fields:** 
  - Height: h-10
  - Padding: px-4
  - Border radius: rounded-md
  - Full width with max-width constraints where appropriate
- **Labels:** text-sm font-medium, mb-2
- **Buttons:**
  - Primary: px-4 py-2, rounded-md, font-medium
  - Secondary: Similar sizing, different visual treatment
  - Icon buttons: w-10 h-10 for consistency
- **Helper Text:** text-sm below inputs

### Data Display
- **Tables:**
  - Zebra striping for rows
  - Sticky headers on scroll
  - Row hover states for interactivity
  - Monospace font for codes/IDs
  - Right-align numbers, left-align text
  - Actions column on right with icon buttons
- **Lists:** Consistent spacing (space-y-2), clear separators
- **Code Blocks:** Monospace font, subtle background, copy button top-right

### API Key Display
- **Container:** Monospace text with copy button
- **Format:** Truncated with "..." if long, full reveal on hover/click
- **Copy Action:** Icon button with visual feedback on copy

### Access Logs
- **Table Format:** Time, Agent ID, Data Source, Status, Amount
- **Status Badges:** Rounded pills (rounded-full px-3 py-1 text-xs) with clear visual distinction
- **Timestamp:** Relative time (e.g., "2 minutes ago") with tooltip for full timestamp

### Alerts & Status
- **Toast Notifications:** Top-right corner, auto-dismiss
- **Status Badges:** Small rounded pills for success/error/pending states
- **Empty States:** Centered content with icon, heading, and CTA

### Transaction Display
- **Amount:** Large, prominent (text-lg font-semibold)
- **Hash/ID:** Monospace, truncated with copy
- **Metadata:** Two-column key-value layout

---

## Page Specifications

### Creator Dashboard
**Layout:** Single column with stacked sections

**Sections:**
1. **Stats Overview:** 4-column grid (grid-cols-4) with stat cards
   - Total Earnings, Total Requests, Active Data Sources, Revenue This Month
2. **Connect Data Source Form:** Card with form fields
   - URL (text input)
   - Price per Request (number input with USDC label)
   - Rate Limit (optional number input)
   - Submit button (full-width or right-aligned)
3. **Your Data Sources:** Table with columns
   - URL, Price, Rate Limit, Created, Actions (edit/delete icons)
4. **Recent Access Logs:** Table with pagination
   - Timestamp, Agent, Path, Status, Amount Paid

### Agent Console
**Layout:** Two-column on desktop (grid-cols-2 gap-8), stacked on mobile

**Left Column:**
1. **Agent Details Card:**
   - Agent ID (with copy button)
   - Generate API Key button (if none exists)
   - API Key display (monospace with copy button)
   - Status badge

**Right Column:**
1. **Test Gateway Card:**
   - Form fields: Data Source ID, Path, Purpose (textarea)
   - "Test Request" button
   - Response display area (code block style)

**Bottom Section:**
- **Recent Requests Table:** Full-width, similar to access logs

---

## Interaction Patterns

- **Copy to Clipboard:** Icon button changes to checkmark briefly
- **Form Submission:** Button shows loading state, then success/error toast
- **Table Actions:** Hover reveals action icons
- **Empty States:** Clear messaging with CTA to add first item
- **Loading States:** Skeleton screens for tables, spinner for buttons

---

## Animations

**Minimal approach - only where valuable:**
- Smooth transitions on hover (transition-colors duration-200)
- Toast slide-in/fade-out
- Copy button checkmark transition
- NO page transitions, scroll effects, or decorative animations

---

## Images

**No hero images or decorative imagery for this phase.**

This is a functional dashboard - focus on clean data presentation. Any future imagery would be:
- Logos/icons for integrations (Stripe, Coinbase)
- User avatars in navigation
- Empty state illustrations (simple, line-art style)