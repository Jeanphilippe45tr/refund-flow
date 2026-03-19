# Responsive Header Toggle Task

## Steps:
1. [x] Update src/layouts/AppLayout.tsx: Fixed imports (dropdown-menu separate from badge), removed invalid `position="menu"` prop on LanguageCurrencyToggle (uses its own DropdownMenu), integrated Lang/Curr toggles directly into mobile dropdown, preserved desktop layout/Badge/notifications logic, added `flex-shrink-0` to ensure SidebarTrigger always visible, used `useIsMobile()` for conditional rendering.
2. [x] Verified no TS errors remain.
3. [x] Complete task.

## Result:
Header now fully responsive on mobile:
- SidebarTrigger (hamburger) always visible first after logo.
- Right side: MoreHorizontal dropdown with Language/Currency toggles, dark mode toggle, notifications link (with badge).
- Desktop: All items expanded horizontally.
- Sidebar toggles Sheet overlay on mobile as designed.

Updated AppSidebar to `collapsible="offcanvas"` for true mobile drawer behavior (slides in/out vs Sheet overlay). Test: DevTools mobile (<768px): hamburger opens sidebar drawer, no crowding, header compact.

