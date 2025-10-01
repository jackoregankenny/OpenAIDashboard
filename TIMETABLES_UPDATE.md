# 📅 Timetables & Enhanced Page Management - Update

## 🎉 New Features Added

### 1. ✨ Timetable Block Component

A fully-featured timetable/schedule block with **3 layout options** and **visual browser editor**!

#### Layouts

**Weekly View (Grid)**
- Traditional week-at-a-glance grid
- Shows all periods and days
- Color-coded subjects
- Compact mode available

**Daily View**
- One day per card
- Detailed period information
- Perfect for mobile viewing
- Easy to scroll through the week

**Period View**
- Grouped by time slots
- See all classes for each period
- Quick comparison across days
- Great for room scheduling

#### Features
- ✅ Custom periods (set times and labels)
- ✅ Custom days (5-day, 6-day, 7-day weeks)
- ✅ Color-coded subjects (8 preset colors)
- ✅ Teacher names
- ✅ Room numbers
- ✅ Toggle teacher/room display
- ✅ Compact mode for dense schedules
- ✅ Responsive design
- ✅ **Visual browser editor** - click cells to edit!

### 2. 🎨 Visual Timetable Editor

**In-browser editing** - No JSON editing required!

Features:
- Click any cell in the timetable grid to edit
- Fill in: Subject, Teacher, Room, Color
- Color picker with 8 preset options
- Real-time preview
- Delete button for clearing cells
- Auto-saves to block properties

**How it works:**
1. Add a Timetable block to your page
2. Click "Settings" on the block
3. In the properties panel, see the timetable editor
4. Click any cell to edit
5. Save changes

### 3. 📑 Enhanced Page Management

The admin dashboard now has **full page management**!

#### New Features

**Create Pages**
- "New Page" button per site
- Auto-generate URL slugs
- Preview URL before creating

**Duplicate Pages**
- One-click duplication
- Copies all blocks and settings
- Automatically adds "(Copy)" to title

**Delete Pages**
- Delete confirmation dialog
- Removes page and all its blocks
- Can't delete if you change your mind!

**Publish/Unpublish**
- Toggle page visibility
- Published badge on pages
- Control what's public

**Better UI**
- Page cards with file icons
- Published status badges
- Hover actions menu
- Dropdown for more actions (•••)
- Cleaner layout

## 🎯 Demo Data

The seed now includes a **complete timetable example**:
- Grade 10 - Class A schedule
- Full week (Monday-Friday)
- 7 periods (6 classes + lunch)
- 9 different subjects
- Color-coded
- Teacher names and room numbers

Visit: **http://localhost:3000/sites/riverside-hs/timetable**

## 🚀 Usage Examples

### Adding a Timetable to a Page

1. Go to `/admin`
2. Click settings on any page
3. Click "Timetable" in the left sidebar
4. It adds with default schedule
5. Click settings (⚙️) on the timetable block
6. Use the visual editor to customize

### Editing a Timetable Schedule

In the builder properties panel:
1. See the timetable grid
2. Click any cell
3. Fill in the form:
   - Subject (required)
   - Teacher
   - Room
   - Color
4. Click "Save"
5. Cell updates immediately

### Creating Different Timetables

**Different Layouts:**
- Change `layout` property: weekly/daily/period

**Different Days:**
- Modify `days` array: Add Saturday, Sunday
- Or use: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']

**Different Periods:**
- Customize `periods` array
- Add more periods
- Change times
- Rename labels (Period 1 → Block A, etc.)

**Multiple Timetables:**
- Create multiple timetable blocks
- One per grade level
- Or per class section
- Each can have unique schedules

## 📦 Technical Details

### Timetable Block Props

```typescript
{
  title: string,                    // Block heading
  layout: 'weekly' | 'daily' | 'period',
  days: string[],                   // ['Monday', 'Tuesday', ...]
  periods: Array<{
    time: string,                   // '8:00 AM'
    label: string                   // 'Period 1'
  }>,
  schedule: Record<string, {        // 'Monday-Period 1' -> {...}
    subject: string,
    teacher?: string,
    room?: string,
    color?: string                  // Hex color code
  }>,
  showTeachers: boolean,
  showRooms: boolean,
  compactMode: boolean
}
```

### Schedule Key Format

Keys are: `{day}-{periodLabel}`

Examples:
- `'Monday-Period 1'`
- `'Tuesday-Lunch'`
- `'Friday-Period 6'`

### Colors Available

- Blue: `#dbeafe`
- Green: `#dcfce7`
- Yellow: `#fef3c7`
- Purple: `#f3e8ff`
- Pink: `#fce7f3`
- Orange: `#ffedd5`
- Red: `#fee2e2`
- Gray: `#f3f4f6`

## 🎨 Page Management API

New endpoints and features:

**Create Page**
```typescript
POST /api/sites/{siteId}/pages
{
  slug: string,
  title: string,
  blocks: Block[]
}
```

**Publish/Unpublish**
```typescript
PUT /api/pages/{pageId}
{
  isPublished: boolean
}
```

**Delete Page**
```typescript
DELETE /api/pages/{pageId}
```

## 🔥 What Makes This Special

1. **Visual Editing** - No JSON! Click and edit in the browser
2. **Mixed Layouts** - Multiple timetables with different layouts on one page
3. **Unique Schedules** - Each timetable block has its own data
4. **Responsive** - Works on mobile, tablet, desktop
5. **Printable** - Timetables print cleanly
6. **Customizable** - Change everything from colors to periods
7. **Professional** - Looks like a real school schedule

## 📊 Use Cases

### For Schools

**Class Schedules**
- One timetable per grade
- Different subjects and teachers
- Room assignments

**Teacher Schedules**
- Show when each teacher is teaching
- Which rooms they use
- Free periods

**Room Schedules**
- Show room usage throughout the day
- Prevent double-booking
- Lab schedules

**Exam Schedules**
- Special exam periods
- Different layout during exam week
- Clearly labeled

### For Multiple Audiences

- **Students**: Weekly view, see whole week
- **Teachers**: Period view, see all classes at once
- **Parents**: Daily view, easy to understand
- **Admin**: Mix all three on different pages

## 🎬 Demo Script Addition

Add to your demo:

> **[Add Timetable Block]**  
> "Schools need schedules. We have a timetable block with 3 layout options."
>
> **[Show Visual Editor]**  
> "Click any cell to edit. No code, no JSON. Just click and type."
>
> **[Toggle Layout]**  
> "Switch between weekly, daily, and period views. Same data, different layouts."
>
> **[Show Published Timetable]**  
> "And here's the published schedule. Color-coded, professional, responsive."

## 🚀 Next Steps

**Easy Enhancements:**
- [ ] Export timetable to PDF
- [ ] Import from CSV
- [ ] Recurring patterns (same schedule every week)
- [ ] Conflict detection (teacher in two places)
- [ ] Print-optimized view

**Advanced Features:**
- [ ] Different schedules per week (A/B week rotation)
- [ ] Holiday exceptions
- [ ] Assembly schedules
- [ ] Teacher availability calendar
- [ ] Drag-and-drop rearranging

## ✅ Complete Feature List

**Total Blocks: 8**
1. Hero
2. Gallery
3. Staff
4. Content
5. Events
6. Contact
7. News
8. **Timetable** ← NEW!

**Page Management:**
- ✅ Create pages
- ✅ Edit pages
- ✅ Delete pages
- ✅ Duplicate pages
- ✅ Publish/unpublish
- ✅ View all pages per site
- ✅ Open in builder
- ✅ Open public view

## 🎯 Try It Now!

```bash
# Server is already running at http://localhost:3000

# Visit these URLs:
http://localhost:3000/admin                      → See new page management
http://localhost:3000/sites/riverside-hs/timetable → See timetable demo
http://localhost:3000/builder/{pageId}            → Try visual timetable editor
```

---

**Perfect for hackathons** - Unique feature, visual editing, multiple use cases! 🚀

