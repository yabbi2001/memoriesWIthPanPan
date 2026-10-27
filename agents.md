# 💖 Eternal Love Notes & Storybook (Ditto App Aesthetic) - Agent Guidelines

## 1. Project Overview & Aesthetic
- **Type**: Couples Memory & Storybook React Web Application.
- **Design Style**: Inspired by modern Dribbble "Ditto App" UI layout featuring dark aesthetics (`#0f1419`, `#19222b`), glassmorphism cards, glowing neon accents (teal and rose), and rounded UI widgets.
- **Key Visual Polish**: Tilted / rotated photo cards (using Tailwind classes like `-rotate-3`, `rotate-6`) that straighten out and scale up smoothly on hover (`hover:rotate-0 hover:scale-105`).

---

## 2. Component Architecture & Modular Structure
When building or updating code, structure the project into clean, modular components:

```text
src/
├── components/
│   ├── Navbar.jsx               # Header, Avatar badges, Music player toggle, Date widget
│   ├── HeroFeaturedCard.jsx     # Main tilted polaroid photo card with avatar badge
│   ├── ProgressChartWidget.jsx  # SVG Wave graph & relationship milestone tracker
│   ├── MoodCheckinWidget.jsx    # Curved purple weekly question & rating widget
│   ├── RecentAdventureCard.jsx  # Tilted polaroid secondary card
│   ├── DailyChecklist.jsx       # Quick couple actions interactive checklist
│   ├── LightboxModal.jsx        # Full-screen photo and memory details popup
│   └── AddMemoryModal.jsx       # Form modal to add new tilted memories
├── utils/
│   └── audioSynth.js            # Web Audio API Lofi chord generator logic
├── App.jsx                      # Main orchestrator combining all components & state
└── main.jsx


# 🎨 UI Build-up & Component Prompt for Couples Memory Web App

Act as an expert Frontend React & Tailwind CSS UI Developer. I want you to generate the code for a modern, responsive **Couples Memory Web Application** inspired by the Dribbble "Ditto App" dark aesthetic design.

Please implement the following UI requirements precisely:

1. **Color Palette & Typography**:
   - Dark background tones (`bg-[#0f1419]` and card background `bg-[#19222b]`).
   - Clean, rounded sans-serif layout with subtle borders (`border-slate-800`).
   - Glowing neon accents (Teal `#2dd4bf` and Rose/Pink `#f43f5e`).

2. **Layout & Tilted Cards (Key Visual Feature)**:
   - Use a multi-column responsive grid layout (12-column grid on desktop).
   - Featured photo cards must feature subtle CSS rotation angles (e.g., `-rotate-3`, `rotate-6`) to look like real polaroid shots scattered on a table.
   - Smooth hover effects on cards: `hover:rotate-0 hover:scale-105 transition duration-300`.

3. **Ditto-Style Widgets**:
   - **Hero Photo Card**: Includes a glassmorphic avatar badge overlay and caption area.
   - **Progress Wave Chart Widget**: An SVG curve graph showing relationship progression over time with milestone tags.
   - **Weekly Mood Check-in Widget**: A curved deep purple glass card featuring interactive rating buttons (1 to 5).
   - **Daily Actions Checklist**: Interactive toggle list items for couple activities.

4. **Interactive States & Modals**:
   - Lightbox modal popup when clicking on any memory card.
   - Add Memory form modal with clean inputs for title, date, location, and image URL.
   - Fully responsive on mobile devices and smooth CSS transitions throughout.