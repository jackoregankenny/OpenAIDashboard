# Clean UI Principles - School Site Builder

## Philosophy

**Clean, functional, professional** - inspired by WordPress, Webflow, and other real site builders.

No gradients, no excessive effects, no "flashy" elements. Just clear, readable, functional design.

---

## Design System

### Color Usage

✅ **DO:**
- Use solid colors from the theme
- Gray backgrounds for sections
- White cards
- Muted text for secondary info
- Solid green for published status
- Subtle hover states (bg-muted/50)

❌ **DON'T:**
- Gradient text
- Gradient backgrounds  
- Glassmorphism/backdrop-blur
- Rainbow colors
- Excessive shadows

### Typography

✅ **DO:**
- Font size hierarchy: 2xl → xl → base → sm → xs
- Font weight: semibold for headers, normal for body
- Clear labels (uppercase text-xs for sections)
- Consistent spacing

❌ **DON'T:**
- Gradient clip text
- Overly large headings
- Too many font weights
- Fancy font effects

### Spacing

✅ **DO:**
- Consistent padding: p-2, p-3, p-4, p-6
- Clear gaps: gap-2, gap-3, gap-4
- Breathing room between sections
- Borders to separate areas

❌ **DON'T:**
- Cramped layouts
- Excessive padding
- Inconsistent spacing

### Interactive Elements

✅ **DO:**
- Simple hover states (opacity, bg-muted)
- Clear button hierarchy (primary/outline/ghost)
- Icon + text for actions
- Visible disabled states
- Subtle transitions (transition-colors)

❌ **DON'T:**
- Lift effects (translate-y)
- Shadow elevation changes
- Scale animations
- Complex transforms

---

## Component Patterns

### Admin Dashboard

```tsx
// Clean header
<div className="border-b bg-background sticky top-0 z-50 shadow-sm">
  <h1 className="text-2xl font-semibold">Sites</h1>
  <p className="text-sm text-muted-foreground">Manage your websites</p>
</div>

// Simple cards
<Card className="hover:border-primary/50 transition-colors">
  <CardHeader className="pb-3">
    <CardTitle className="text-base font-semibold">{name}</CardTitle>
    <CardDescription className="text-xs">{domain}</CardDescription>
  </CardHeader>
</Card>

// Clean page list
<div className="space-y-1">
  {pages.map(page => (
    <div className="flex items-center justify-between p-2 rounded hover:bg-muted/50">
      {page.isPublished ? <Eye className="w-3.5 h-3.5 text-green-600" /> : <EyeOff />}
      <div className="text-sm">{page.title}</div>
    </div>
  ))}
</div>
```

### Property Editor

```tsx
<Card>
  <CardHeader className="pb-3">
    <CardTitle className="text-base">Edit Block</CardTitle>
    <CardDescription className="text-xs">Description</CardDescription>
  </CardHeader>
  <CardContent className="space-y-4">
    {/* Fields with separators */}
    <Separator className="my-4" />
    <Button size="sm">Save</Button>
  </CardContent>
</Card>
```

### Status Indicators

```tsx
// Published
<Eye className="w-3.5 h-3.5 text-green-600" />

// Draft
<EyeOff className="w-3.5 h-3.5 text-muted-foreground" />

// Label
<span className="text-xs font-medium text-muted-foreground uppercase">
  Pages (3)
</span>
```

---

## Size Reference

### Buttons
- Large action: `size="default"` (h-10)
- Normal: `size="sm"` (h-9)
- Compact: `size="sm" className="h-7 text-xs"`
- Icon only: `size="sm" className="h-7 w-7 p-0"`

### Text
- Page title: `text-2xl font-semibold`
- Section title: `text-base font-semibold`
- Card title: `text-base font-semibold`
- Body: `text-sm`
- Secondary: `text-xs text-muted-foreground`
- Labels: `text-xs font-medium uppercase`

### Icons
- Large: `w-5 h-5` or `w-6 h-6`
- Normal: `w-4 h-4`
- Small: `w-3.5 h-3.5` or `w-3 h-3`

### Spacing
- Component gap: `gap-4` or `gap-6`
- List items: `space-y-1` or `space-y-2`
- Sections: `space-y-3` or `space-y-4`
- Content padding: `p-2`, `p-3`, `p-4`, `p-6`

---

## Real-World Examples

### WordPress Dashboard
- Clean white background
- Simple gray sidebar
- No gradients
- Clear hierarchy
- Functional buttons
- Status badges

### Webflow
- Minimal color
- Lots of white space
- Clear sections
- Icon + text patterns
- Subtle hover states
- Professional feel

### Notion
- Clean typography
- Simple hover effects
- Gray backgrounds for sections
- No flashy elements
- Focus on content
- Easy to scan

---

## Before & After

### Before (Too Flashy)
```tsx
// ❌ Gradient text
<h1 className="bg-gradient-to-r from-primary via-accent to-purple-600 bg-clip-text text-transparent">

// ❌ Glassmorphism
<div className="bg-background/80 backdrop-blur-xl">

// ❌ Lift effect
<Card className="hover:shadow-2xl hover:-translate-y-1">

// ❌ Gradient background
<CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">

// ❌ Animated pulse
<div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
```

### After (Clean)
```tsx
// ✅ Simple text
<h1 className="text-2xl font-semibold">

// ✅ Solid background
<div className="bg-background border-b shadow-sm">

// ✅ Simple hover
<Card className="hover:border-primary/50 transition-colors">

// ✅ Clean header
<CardHeader className="pb-3">

// ✅ Simple icon
<Eye className="w-3.5 h-3.5 text-green-600" />
```

---

## Testing Your Design

Ask yourself:
1. **Would this fit in WordPress?** If no, it's too flashy
2. **Is the hierarchy clear?** Can you scan quickly?
3. **Are colors functional?** Not decorative
4. **Is text readable?** No fancy effects
5. **Are actions obvious?** Clear buttons/icons
6. **Does it feel professional?** Not a tech demo

---

## Summary

**The goal is invisible design** - users should focus on their content, not your UI tricks.

**Professional = Boring (in a good way)**
- Predictable
- Reliable  
- Clear
- Fast
- Functional

**Modern ≠ Gradients**
- Modern = clean spacing
- Modern = good typography
- Modern = smart hierarchy
- Modern = subtle interactions

---

**This is REAL software, not a portfolio piece.** 🎯

