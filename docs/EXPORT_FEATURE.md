# Markdown Export Feature

## Overview
The program can now be exported as a nicely formatted Markdown (.md) file with two different views:

### Coach's View
**Includes:**
- Complete program details
- Dice rolls for each lift per week
- Lift configuration table (weights and RMs at each intensity)
- Rep max information
- All technical details for program analysis

**Use case:** For coaches to keep records, analyze programs, and understand the complete program structure.

### Athlete's View
**Includes:**
- Clean workout plan
- Lift name, intensity, and weight
- Total reps to complete
- Suggested rep scheme
- Simple instructions

**Excludes:**
- Dice rolls
- Rep max data
- Technical program details

**Use case:** For athletes to follow their training plan without unnecessary complexity.

## How to Use

1. Open any program in the program view
2. Click the **"📥 Download"** button in the header
3. Hover to see the dropdown menu
4. Select either:
   - **Coach's View** - Full details
   - **Athlete's View** - Clean workout plan

The file will download immediately with a filename like:
- `spring_2025_battleship_coach_view.md`
- `spring_2025_battleship_athlete_view.md`

## File Format

Markdown (.md) files are:
- **Readable as plain text** - Open in any text editor
- **Portable** - Copy/paste into any app
- **Convertible** - Can be converted to PDF, HTML, Word, etc.
- **Compatible** - Works with Notion, Obsidian, GitHub, etc.

## Converting to PDF

If you need a PDF, you can:
1. Use online converters (search "markdown to pdf")
2. Use Pandoc: `pandoc program.md -o program.pdf`
3. Use Marked 2 (Mac app)
4. Import into Google Docs and export as PDF
5. Use VS Code with Markdown PDF extension

## Example Output Structure

```markdown
# Program Name

**Program Type:** Battleship
**Duration:** 8 Weeks
**Lifts:** 4
**Sessions per Week:** 3

---

## Week 1

**Dice Rolls:** (Coach view only)
- Squat: 🎲 4, 2
- Upper Body Press: 🎲 1, 3

### Session A

#### Squat - Medium
- **Weight:** 185 lbs
- **Total Reps:** 41
- **Suggested Rep Scheme:** 6 sets: 7, 7, 7, 7, 7, 6

...
```

## Future Enhancements

Possible additions:
- PDF export (direct from app)
- CSV export (for spreadsheet analysis)
- Print-optimized view
- Email program to athlete
- Custom branding/logo support
