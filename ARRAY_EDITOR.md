# Array Editor Feature

## ✨ What It Does

The array editor allows you to manage **lists of items** directly in the properties panel for components like:
- **Testimonials** (quotes, authors, ratings)
- **Features** (icons, titles, descriptions)
- **Team Members** (names, roles, photos, bios)
- **Statistics** (values, labels, icons)

## 🎯 Components with Array Editing

### 1. **Testimonials Component**
Edit individual testimonials with fields:
- Quote (textarea)
- Author Name
- Role/Title
- Avatar URL
- Rating (1-5)

### 2. **Features Grid**
Manage feature items:
- Icon (emoji)
- Feature Title
- Description

### 3. **Team Grid**
Manage team members:
- Name
- Role/Title
- Bio
- Photo URL
- Email

### 4. **Stats Showcase**
Edit statistics:
- Icon (emoji)
- Value (number)
- Suffix (+, %, etc.)
- Label (description)

---

## 📱 How to Use

### Adding Items

1. **Select component** (e.g., Testimonials)
2. **Scroll to array field** in properties panel
3. **Click "+ Add"** button (e.g., "+ Add Testimonial")
4. Item is created and **auto-expanded**
5. Fill in the fields
6. Changes save automatically

### Editing Items

1. **Click on item** to expand/collapse it
2. Edit any field
3. Changes apply instantly to canvas
4. Click item header again to collapse

### Reordering Items

Each item has **up/down arrows**:
- **↑** Move item up in the list
- **↓** Move item down in the list
- Order changes immediately on canvas

### Deleting Items

1. Click **🗑️ (trash icon)** on item
2. Confirm deletion
3. Item removed from list

---

## 🎨 UI Features

### Visual Design

```
┌─────────────────────────────────────┐
│ Testimonials              + Add     │  ← Header with Add button
├─────────────────────────────────────┤
│ ┌───────────────────────────────┐   │
│ │ 1. John Doe   ↑ ↓ 🗑️ ▼      │   │  ← Item header (collapsible)
│ ├───────────────────────────────┤   │
│ │ Quote: [textarea]             │   │  ← Expanded fields
│ │ Author: [text field]          │   │
│ │ Role: [text field]            │   │
│ │ Rating: [number 1-5]          │   │
│ └───────────────────────────────┘   │
│                                     │
│ ┌───────────────────────────────┐   │
│ │ 2. Jane Smith  ↑ ↓ 🗑️ ▶     │   │  ← Collapsed item
│ └───────────────────────────────┘   │
└─────────────────────────────────────┘
```

### Color Coding

- **Gray background**: Container
- **White cards**: Individual items
- **Light gray on hover**: Hover state
- **Primary blue**: Add button
- **Red icon**: Delete button

### Interactive Elements

- **Click header**: Expand/collapse item
- **↑↓ Buttons**: Reorder (disabled at edges)
- **🗑️ Button**: Delete with confirmation
- **▶/▼ Icon**: Visual expand/collapse indicator

---

## 💡 Best Practices

### Adding Items
- Add items one at a time
- Fill in at least the first field (used as label)
- Expand multiple items to compare content

### Organization
- Use reorder buttons to prioritize important items
- Keep most important items at the top
- Delete unused items to keep component clean

### Content Guidelines

**Testimonials:**
- Keep quotes concise (2-3 sentences)
- Always include author name and role
- Use 5-star rating for best social proof

**Features:**
- Use emojis for quick visual recognition
- Keep titles short (2-5 words)
- Write benefit-focused descriptions

**Team Members:**
- Use professional photos (square format works best)
- Include meaningful roles/titles
- Keep bios to 1-2 sentences

**Statistics:**
- Use round numbers for impact (500+ vs 487)
- Add appropriate suffixes (+, %, K, M)
- Make labels descriptive but concise

---

## 🔧 Technical Details

### Data Structure

Arrays are stored as JSON in component props:

```typescript
{
  testimonials: [
    {
      quote: "Amazing school!",
      author: "John Doe",
      role: "Parent",
      avatar: "https://...",
      rating: 5
    },
    // ... more items
  ]
}
```

### Auto-Save

- Every change triggers auto-save
- Saved to localStorage immediately
- No manual save needed

### Validation

- Number fields: Enforces min/max values
- URL fields: Browser validates URLs
- Required fields: First field used as item label

---

## 🎬 Example Workflows

### Creating a Testimonial Section

1. Add Testimonials component to canvas
2. Click component to select
3. Scroll to "Testimonials" array in properties
4. Click "+ Add Testimonial"
5. Enter quote: "This school changed my life..."
6. Enter author: "Sarah Johnson"
7. Enter role: "Parent"
8. Set rating: 5
9. Click "+ Add Testimonial" again for second one
10. Repeat for 3-5 testimonials
11. Reorder to put best testimonial first

### Building a Features Grid

1. Add Features Grid component
2. Select component
3. Find "Features" array
4. Click "+ Add Feature"
5. Icon: 🎓
6. Title: "Quality Education"
7. Description: "World-class curriculum..."
8. Repeat for 3-6 features
9. Reorder by importance

---

## 🐛 Troubleshooting

**Items not showing on canvas:**
- Check if array field has at least one item
- Verify first field is filled (used for display)
- Try refreshing the page

**Can't reorder items:**
- Top item's ↑ button is disabled (can't move higher)
- Bottom item's ↓ button is disabled (can't move lower)
- This is expected behavior

**Changes not saving:**
- Check browser console for errors
- Verify localStorage is enabled
- Try editing a different field

**Array field not visible:**
- Make sure component schema includes array field
- Check component is selected (blue ring)
- Scroll down in properties panel

---

## 🚀 Advanced Features (Coming Soon)

- [ ] Duplicate item button
- [ ] Bulk import from CSV/JSON
- [ ] Drag and drop reordering
- [ ] Preview thumbnails in collapsed state
- [ ] Search/filter items
- [ ] Collapse/expand all
- [ ] Copy item to clipboard

---

## 📋 Keyboard Shortcuts (Planned)

- `Enter` - Add new item
- `Delete` - Remove focused item
- `Ctrl+↑/↓` - Reorder item
- `Space` - Expand/collapse item
- `Ctrl+D` - Duplicate item

---

## 🎯 Summary

The array editor provides a **powerful, intuitive interface** for managing lists of data in your components:

✅ Add/edit/delete items easily
✅ Reorder with arrow buttons
✅ Expand/collapse for clean UI
✅ Auto-save all changes
✅ Component-specific fields
✅ Visual feedback for all actions

Perfect for creating rich, data-driven components without touching code!

---

**Try it now:**

```bash
npm run dev
```

Visit: **http://localhost:3000/editor/demo**

1. Add a Testimonials component
2. Select it
3. Scroll to "Testimonials" array
4. Click "+ Add Testimonial"
5. Start editing! 🎉
