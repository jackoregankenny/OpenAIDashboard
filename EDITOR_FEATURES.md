# Editor Features Guide

## ✨ All Implemented Features

### 1. **Component Editing (Properties Panel)** ✅

Located on the **right side** of the editor.

**How to use:**
1. Click any component on the canvas
2. Properties panel appears on the right
3. Edit any field (text, colors, variants, etc.)
4. Changes apply **instantly** to the canvas

**Supported Field Types:**
- **Text Fields**: title, heading, subtitle, etc.
- **Text Areas**: description, content, bio (multiline)
- **URLs**: All fields with "link" or "Link" in name
- **Colors**: backgroundColor and any field with "color"
- **Dropdowns**: variant, alignment, layout (predefined options)
- **Numbers**: columns (2-4 range)
- **Custom Properties**: Add your own fields with "+ Add Custom Property"

---

### 2. **Component Deletion** ✅

**Multiple ways to delete:**

#### Option A: Toolbar Button
1. Select component by clicking it
2. Click **"🗑️ Delete"** button in toolbar
3. Confirm deletion

#### Option B: Keyboard (Coming Soon)
- Select component
- Press `Delete` or `Backspace` key

**Protection:**
- Cannot delete the root page node
- Confirmation dialog prevents accidents

---

### 3. **Auto-Save** ✅

**How it works:**
- Automatically saves to browser's `localStorage`
- Saves on **every change** (typing, dragging, deleting)
- Persists across browser sessions
- Toolbar shows **"✓ Auto-saved"** indicator

**To clear saved data:**
```javascript
// Open browser console (F12) and run:
localStorage.removeItem('editorPageTree')
// Then refresh the page
```

---

### 4. **Drag & Drop** ✅

#### Add Components
1. Find component in **left sidebar** palette
2. Click to add to selected section
3. Component appears on canvas

#### Reorder Components
1. Hover over component to see it's draggable
2. Drag component up or down
3. Drop to reorder within same parent
4. Auto-saves new order

**Note:** Components can only be reordered within the same parent/section.

---

### 5. **Undo/Redo** ✅

**Toolbar buttons:**
- **↶ Undo**: Revert last change (Ctrl+Z)
- **↷ Redo**: Restore undone change (Ctrl+Shift+Z)

**Tracks:**
- Component additions
- Component deletions
- Component reordering
- Property changes

**History:**
- Stores last 50 actions
- Disabled buttons when no history available

---

### 6. **Preview Mode** ✅

**Toggle button in toolbar:**
- **👁️ Preview**: See clean published view (no editor UI)
- **✏️ Edit**: Return to editing mode

**In Preview Mode:**
- No selection rings
- No drag handles
- No hover effects
- Exactly as visitors will see it

---

### 7. **Component Selection** ✅

**Visual Feedback:**
- **Blue ring**: Component is selected
- **Light blue ring**: Component is hovered
- **Label overlay**: Shows component name when selected

**How to select:**
- Click directly on component
- Click inside nested components to select child

---

## 🎨 Editor Layout

```
┌─────────────────────────────────────────────────────┐
│ Toolbar (Undo, Redo, Delete, Preview, Auto-saved)  │
├──────────┬─────────────────────────┬────────────────┤
│ Component│                         │   Properties   │
│ Palette  │        Canvas           │     Panel      │
│          │                         │                │
│ - Hero   │  [Selected Component]   │  ┌─────────┐  │
│ - Content│                         │  │ Title:  │  │
│ - Footer │  [Component]            │  │ [____]  │  │
│ - Stats  │                         │  │         │  │
│ - Team   │  [Component]            │  │ Variant:│  │
│ - CTA    │                         │  │ [____▼] │  │
│ - etc.   │                         │  └─────────┘  │
│          │                         │                │
└──────────┴─────────────────────────┴────────────────┘
```

**3-Column Layout:**
1. **Left (280px)**: Component palette - drag/click to add
2. **Center (flexible)**: Canvas - edit and preview your page
3. **Right (320px)**: Properties panel - edit selected component

---

## 📝 How to Edit Component Content

### Step-by-Step Tutorial

**Example: Editing a Hero Component**

1. **Select the Hero**
   - Click on the hero section in the canvas
   - Blue ring appears around it
   - Properties panel updates on right

2. **Edit Text**
   - Find "Title" field in properties panel
   - Type new heading: "Welcome to Springfield High"
   - See changes instantly on canvas

3. **Change Style**
   - Find "Variant" dropdown
   - Select: "minimal", "gradient", or "image"
   - Canvas updates immediately

4. **Add CTA Button**
   - Find "Primary Cta Text" field
   - Type: "Apply Now"
   - Find "Primary Cta Link" field
   - Type: "/apply"

5. **Customize Colors** (if available)
   - Find "Background Color" field
   - Click color picker or type hex: `#3b82f6`
   - Canvas shows new color

**All changes auto-save!** ✅

---

## 🔧 Common Tasks

### Add Multiple Components
1. Select section (dashed border area)
2. Click first component in palette
3. Select section again
4. Click next component
5. Repeat as needed

### Build a Complete Page
```
Suggested structure:
1. Hero Section (header)
2. Features Grid (services/offerings)
3. Stats Showcase (achievements)
4. Testimonials (social proof)
5. Team Grid (faculty)
6. CTA Banner (enrollment)
7. Footer (navigation/contact)
```

### Duplicate Component Style
1. Note component's variant/settings
2. Add new component
3. Manually set same properties
   *(Component templates coming in Phase 4)*

### Reset to Demo Page
```javascript
// Browser console (F12):
localStorage.removeItem('editorPageTree')
// Refresh page
```

---

## 🎯 Property Field Types Reference

### Text Fields
- `title`, `heading`, `name`
- `subtitle`, `subheading`, `tagline`
- `buttonText`, `ctaText`

### Text Areas (Multiline)
- `description`, `content`
- `bio`, `quote`

### URL Fields
- `buttonLink`, `ctaLink`
- `primaryCtaLink`, `secondaryCtaLink`
- `email` (for contact links)

### Select/Dropdown Fields

**Variant** (style options):
- Hero: `gradient`, `minimal`, `image`
- Content: `default`, `featured`, `minimal`
- Footer: `dark`, `light`, `branded`
- CTA: `gradient`, `solid`, `minimal`
- Features: `default`, `bordered`, `elevated`

**Alignment**:
- `left`, `center`, `right`

**Layout**:
- `single`, `grid`

**Columns**:
- `2`, `3`, `4`

### Color Fields
- Click color picker for visual selection
- Or type hex code: `#3b82f6`
- Supports: `backgroundColor`, `textColor`

---

## 💡 Pro Tips

1. **Use Variants**: Each component has multiple style options - try them all!

2. **Save Often**: It's automatic, but you can refresh to verify

3. **Preview Frequently**: Toggle preview mode to see visitor experience

4. **Undo Freely**: Don't worry about mistakes - undo is always available

5. **Custom Properties**: Need a field that doesn't exist? Use "+ Add Custom Property"

6. **Component Order**: Drag to reorder - no need to delete and re-add

7. **Consistent Styling**: Use same variant across similar components for cohesive design

8. **Mobile Check**: Resize browser window to test responsive layouts

---

## 🐛 Troubleshooting

**Properties panel is empty:**
- Make sure you've clicked a component (not a section)
- Look for blue selection ring around component

**Can't drag component:**
- Components can only be reordered within same parent
- Try adding to different section instead

**Changes not saving:**
- Check browser console (F12) for errors
- Verify localStorage is enabled in browser settings

**Delete button not showing:**
- Delete button only appears when component is selected
- Cannot delete root page node or sections (by design)

**Lost my changes:**
- Check if you cleared localStorage or used different browser
- Auto-save only works in same browser session

---

## 🚀 Next Features (Phase 4)

- [ ] Database persistence (instead of localStorage)
- [ ] Multiple pages per site
- [ ] Component templates/presets
- [ ] Copy/paste components
- [ ] Keyboard shortcuts
- [ ] Export to HTML/code
- [ ] Media library for images
- [ ] Responsive preview modes

---

**All editor features are now fully functional!**

Visit: **http://localhost:3000/editor/demo** to try it out.
