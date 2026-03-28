# BRIEF.md — Matchday Personal Website
> Master brief for building the personal website using Next.js, Tailwind CSS, and Framer Motion.
> Hand this entire file to Claude Code at the start of every session as full context.

---

## 👤 About Me
- **Role:** Software Engineer working in the ML domain
- **Passions:** Football (playing + watching), Formula 1, Machine Learning
- **Club:** Arsenal (colour inspiration — not a fan site)
- **Personality:** Bold, curious, a little nerdy, loves a good story
- **Website goal:** A cool corner of the internet — personal brand, project showcase, writing, and contact

---

## 🎯 Website Goal
Help visitors:
1. Understand who I am as a person
2. See my technical projects and work
3. Get in touch / consider hiring me
4. Follow my writing and thoughts

---

## 🎨 Design Direction

### Concept
**"Matchday"** — The website is the narrative arc of a matchday. Visitors don't browse a portfolio — they *experience an evening at the stadium.* Smooth, continuous free-scroll. Cinematic. Like a film.

---

### Colour Palette — Arsenal-Inspired, Not Arsenal Literal

Arsenal's DNA: deep cannon red, white, and gold. We take those signals and make them *cinematic* — richer, darker, more atmospheric. No bright red, no blue. This should feel like a night match at the Emirates: floodlights, red scarves, golden light, cold air.

```css
:root {
  /* --- Primary --- */
  --color-cannon:     #8B1A1A;   /* Deep cannon red — Arsenal red darkened, cinematic not kit-red */
  --color-pitch:      #0C1A0C;   /* Near-black stadium green — the pitch at night */
  --color-gold:       #C9933A;   /* Warm stadium gold — floodlight / programme gold */

  /* --- Supporting --- */
  --color-chalk:      #F0EDE6;   /* Off-white — chalk on tactics board, jersey fabric */
  --color-tunnel:     #0A0A0A;   /* Pure near-black — tunnel section */
  --color-concrete:   #1A1A1A;   /* Dark concrete — stands, walls */
  --color-amber:      #E8A020;   /* Warm amber — floodlight glow, highlight moments */

  /* --- Text --- */
  --color-text-primary:    #F0EDE6;  /* Chalk white on dark sections */
  --color-text-secondary:  #A89880;  /* Muted warm gold for subtitles */
  --color-text-dark:       #1A1210;  /* Dark text on light sections */

  /* --- Accents --- */
  --color-accent-red:      #B22222;  /* Hover states, active links, CTAs */
  --color-accent-gold:     #D4A843;  /* Score, stats highlights */
  --color-grass-line:      #1E3A1E;  /* Subtle pitch stripe lines */
}
```

**Why this works:**
- `--color-cannon` is Arsenal red but matured — cinematic, not football-kit-red
- `--color-gold` pulls from the programme / club crest gold, not yellow
- `--color-pitch` is the night pitch — dark green that doesn't scream "website"
- White never appears — always `--color-chalk`, keeping it warm not clinical

---

### Typography

```
Display / Headings:   'Barlow Condensed' (weight 700–800) — bold stadium signage energy
                      Fallback: 'Bebas Neue'

Body / Prose:         'DM Sans' (weight 400, 500) — warm, clean, readable
                      Fallback: system-ui

Monospace / Stats:    'JetBrains Mono' — numbers, code, technical details

All via Google Fonts. Load only weights used.
```

---

### Motion & Scroll

- **Framer Motion** for all scroll-triggered reveals
- Each section has ONE orchestrated entrance — not constant jitter
- Smooth, continuous free scroll — no snap, no jarring jumps
- Text fades and slides up on scroll entry (`initial: opacity 0, y: 30` → `animate: opacity 1, y: 0`)
- Background colour transitions between sections
- Hover states: subtle scale (1.02), colour shift, never dramatic

---

### Design Rules

1. No generic layouts — every section designed for this concept
2. Mobile-first but desktop is the showcase
3. One wow moment per section — one thing people remember
4. Tech sections (projects, writing) drop the football metaphor *inside* — clean and honest
5. Football wraps the content, doesn't costume it
6. No club merchandise feel — this is stadium atmosphere, not fan site
7. Dark sections dominate — light sections are the exception (used for editorial/writing)

---

## 🗂️ Tech Stack

```
Framework:        Next.js 14+ (App Router, TypeScript)
Styling:          Tailwind CSS + CSS variables for theme tokens
Animation:        Framer Motion
Blog:             MDX files — app/blog/[slug]/page.tsx
Content:          /data/projects.ts, /data/stats.ts
Contact:          Resend (free tier) — no backend needed
Deployment:       Vercel (free tier, auto-deploy on push)
Easter Egg:       football-data.org API (free tier) — live scores ticker in stats section
Fonts:            Google Fonts — Barlow Condensed, DM Sans, JetBrains Mono
```

**Folder structure:**
```
/app
  /page.tsx                  ← All scenes stacked (single page)
  /blog/[slug]/page.tsx      ← Individual blog posts
  /layout.tsx
/components
  /scenes/
    MatchdayCard.tsx
    SquadSheet.tsx
    WalkingToGround.tsx
    TheTunnel.tsx
    Kickoff.tsx
    HalfTime.tsx
    SecondHalf.tsx
    FinalWhistle.tsx
  /ui/
    ProjectCard.tsx
    TimelineItem.tsx
    StatRow.tsx
    PostCard.tsx
/data
  projects.ts
  stats.ts
/content/blog/
  *.mdx
```

---

## 📖 Scene-by-Scene Narrative

---

### 🎫 Scene 1 — THE MATCHDAY CARD
**Component:** `MatchdayCard.tsx`
**Vibe:** A matchday programme cover — but it's you. Bold poster. Immediate impact.

#### Visual Direction
- Full viewport height (`100vh`)
- Background: `--color-pitch` with subtle floodlight radial glow in warm gold from above
- Programme card centred — thin ruled border in `--color-gold`, structured grid layout
- Subtle animated rainfall or floating dust particles (Framer Motion, very subtle)
- Dynamic date rendered live: `MATCHDAY · {formatted today's date}`
- Scroll prompt: `Kick Off ↓` with gentle bounce animation

#### Layout
```
┌────────────────────────────────────────┐
│  MATCHDAY PROGRAMME          2025/26   │
│  ─────────────────────────────────     │
│                                        │
│         [YOUR NAME]                    │
│              vs                        │
│          THE INTERNET                  │
│                                        │
│  ─────────────────────────────────     │
│  Venue: Everywhere                     │
│  Kick Off: Always                      │
│                                        │
│  Software Engineer · ML · Football · F1│
│                                        │
│             ↓ Kick Off                 │
└────────────────────────────────────────┘
```

#### Wow Moment
Your name as a match — on a programme. Feels like a poster worth pinning on a wall.

---

### 🧩 Scene 2 — THE SQUAD SHEET
**Component:** `SquadSheet.tsx`
**Vibe:** Who you are, told as a starting XI. Top-down pitch, floodlit green, chalk lines.

#### Visual Direction
- Top-down football pitch: `--color-pitch` background, chalk-white pitch markings
- Formation: **4-3-3** rendered as positioned player cards on the pitch
- Each card: number + role name
- Hover → expands with trait description (Framer Motion)
- Chalk-draw animation on pitch lines on section entry
- Arsenal cannon very faintly etched in the centre circle (watermark level)

#### Formation — 4-3-3
```
                    [GK]  #1 · The Problem Solver
                          "Last line of defence. Never panics."

  [LB] #3              [CB] #5            [CB] #6             [RB] #2
  The Learner           The Builder        The Analyst          The Thinker
  "Always overlapping"  "Solid base"       "Data over noise"    "Full pitch view"

        [LM] #11              [CM] #8              [RM] #7
        Football Brain         ML Engineer           F1 Obsessive
        "Reads the game"       "The engine room"     "Loves the data"

   [LW] #10              [ST] #9              [RW] #11
   Open Source            Builder at Heart      Night Owl
   "Always contributing"  "Ships things"        "Best commits at 1am"
```

#### Wow Moment
A living squad sheet that represents your personality — not a bio paragraph.

---

### 🚶 Scene 3 — WALKING TO THE GROUND
**Component:** `WalkingToGround.tsx`
**Vibe:** Your origin story. The walk from the city toward the stadium — amber lights growing in the distance.

#### Visual Direction
- Background shifts from `--color-tunnel` to warmer tones as you scroll
- Vertical timeline — each milestone scroll-triggered, alternates left/right
- Each milestone: Year in `--color-gold` (Barlow Condensed) + Title + one-line description
- Moments, not job titles

#### Placeholder Timeline
```
[YEAR]  First Line of Code
        "Wrote Hello World. Had no idea it would become a career."

[YEAR]  Fell Into ML
        "Trained my first model. It was terrible. I was completely hooked."

[YEAR]  First Job
        "Showed up not knowing everything. Left knowing more than I expected."

[YEAR]  Discovered F1 Data
        "Realised motorsport is just applied ML at 300km/h."

[YEAR]  Playing Football Seriously
        "Best debugging sessions still happen on the pitch."

[YEAR]  Now
        "Building things that learn. Watching things that move fast."
```

#### Wow Moment
The timeline feels like a walk — warm, personal, momentum building.

---

### 🔦 Scene 4 — THE TUNNEL
**Component:** `TheTunnel.tsx`
**Vibe:** Dark. Intimate. Your real voice. The calm before the pitch.

#### Visual Direction
- Full dark: `--color-tunnel` background
- Narrow centred text column (max-width: 600px)
- Text in `--color-chalk` with very subtle warm glow
- Vignette on left and right edges (tunnel walls)
- Warm light gradient bleeds in at section bottom (the pitch ahead)
- No bullet points. Pure prose. Your voice.
- Quote styled large, `--color-gold`, Barlow Condensed

#### Placeholder Copy
```
I build things that learn.

I'm a software engineer working in machine learning — the kind of work where
you spend three days debugging a pipeline, and the moment it finally works
feels like a last-minute winner.

I watch football the way most people watch films. Tactical, emotional,
occasionally shouting at the screen. I play it too — badly enough to stay
humble, good enough to keep coming back.

F1 is my other obsession. Not just the racing — the data, the strategy, the
margins. There's a reason I ended up in ML.

This site is my corner of the internet. Projects I've built, thoughts I've
had, and the occasional post that's half technical write-up, half match analysis.

───

"The best players make the people around them better."
```

#### Wow Moment
Dark, focused, a tiny warm light ahead — feels like you're *about to meet* someone.

---

### ⚡ Scene 5 — KICKOFF: THE PROJECTS
**Component:** `Kickoff.tsx`
**Vibe:** Energy unleashed. Page floods with light. The work takes centre stage.

#### Visual Direction
- Entrance: dramatic transition from tunnel darkness — background lightens, pitch green floods in
- Projects as **fixture cards** — styled like a football app's match result row
- Grid: 2 columns desktop, 1 column mobile
- Inside each project detail view: clean and minimal — NO football theme inside
- Filter tabs by tech stack or type

#### Fixture Card Structure
```
┌──────────────────────────────────────────────┐
│  [Project Name]     vs    [The Problem]       │
│                                               │
│  "One line on what it does and why it matters"│
│                                               │
│  [PyTorch] [FastAPI] [Docker]    Shipped ✓   │
└──────────────────────────────────────────────┘
```

#### Placeholder Projects
```
PROJECT 01
[Your Project Name] vs [The Problem It Solved]
"One line describing what it does and why it matters."
Stack: [PyTorch · Transformers · FastAPI]
Status: Shipped ✓

PROJECT 02
[Your Project Name] vs [The Problem It Solved]
"One line describing what it does and why it matters."
Stack: [Next.js · Tailwind · Supabase]
Status: In Progress ⚙

PROJECT 03
[Your Project Name] vs [The Problem It Solved]
"One line describing what it does and why it matters."
Stack: [Python · Scikit-learn · Docker]
Status: Shipped ✓
```

#### Wow Moment
Fixture cards for engineering work — instantly readable, instantly memorable.

---

### 📊 Scene 6 — HALF TIME: THE STATS BOARD
**Component:** `HalfTime.tsx`
**Vibe:** A breather. Broadcast stats overlay. Numbers that tell the full story.

#### Visual Direction
- Dark broadcast feel: `--color-concrete` background, `--color-chalk` text, `--color-gold` highlights
- Two-column layout — styled like a Sky Sports live stats graphic
- Animated count-up numbers on scroll entry
- **F1 easter egg:** faint telemetry line running across the section bottom
- **Football API easter egg:** tiny live scores ticker at the section top (football-data.org free API)

#### Placeholder Copy
```
HALF TIME

         HUMAN          |        TECHNICAL
─────────────────────────────────────────────
Matches Watched    500+ | Years in ML          [X]
Goals (5-a-side)    47  | Models Trained      [X]+
F1 Races Watched   200+ | GitHub Commits      [X]+
Cups of Chai         ∞  | Papers Read         [X]+
Countries Visited   [X] | PRs Merged          [X]+
Books Read          [X] | Stack Overflow   [X]k visits

─────── [F1 telemetry line] ─────────────────
```

#### Wow Moment
The most screenshot-able section. Equal weight to the human and the engineer — that balance *is* the message.

---

### 📝 Scene 7 — SECOND HALF: THE WRITING
**Component:** `SecondHalf.tsx`
**Vibe:** Your thoughts on the pitch. Editorial, clean, slightly lighter than the rest.

#### Visual Direction
- Background: shifts to `--color-chalk` (warmest, lightest section of the whole site)
- Dark text: `--color-text-dark`
- Section header styled as a post-match press conference title card
- Articles as **match report cards**
- Clean MDX reading experience inside posts — zero football theme, just typography
- Category filter: `[ML]` `[Football]` `[F1]` `[Random]`

#### Match Report Card
```
┌─────────────────────────────────────────────┐
│  [ML]                              Mar 2025  │
│                                              │
│  Why My First Model Was Terrible             │
│  (And What I Learned)                        │
│                                              │
│  A post-match analysis of my early ML        │
│  mistakes and what they taught me.           │
│                                              │
│  Read Match Report →                         │
└─────────────────────────────────────────────┘
```

#### Placeholder Post Ideas
```
[ML]        "Why My First Model Was Terrible (And What I Learned)"
[Football]  "What Football Taught Me About Debugging"
[F1]        "Hamilton, Data, and Why Margins Matter"
[Random]    "Building in Public: Notes from Six Months of Shipping"
```

#### Wow Moment
Calling articles "match reports" — ties writing back to the narrative without forcing it.

---

### 🏁 Scene 8 — FINAL WHISTLE: CONTACT
**Component:** `FinalWhistle.tsx`
**Vibe:** Full time. The scoreboard. Warm, simple, inviting.

#### Visual Direction
- Background: back to `--color-pitch` (deep night green)
- Full-width scoreboard in huge Barlow Condensed, `--color-gold`
- No form — just direct links

#### Placeholder Copy
```
FULL TIME

YOU          0 — 1          [YOUR NAME]

─────────────────────────────────────────

Always up for a good conversation about ML,
football, F1 — or ideally all three at once.

📧  [your@email.com]
🐙  github.com/[yourhandle]
💼  linkedin.com/in/[yourhandle]
🐦  @[yourhandle]

─────────────────────────────────────────

© [Your Name] · Built with Next.js · Deployed on Vercel
```

#### Wow Moment
`YOU 0 — 1 [YOUR NAME]` — the visitor came, they scrolled, they lost. Ends on a smile.

---

## 🗺️ Full Scene Arc

```
🎫  Scene 1 — Matchday Card        → Bold programme poster.
🧩  Scene 2 — Squad Sheet          → Who you are as a formation.
🚶  Scene 3 — Walking to Ground    → Your origin story and timeline.
🔦  Scene 4 — The Tunnel           → Intimate about me. Your real voice.
⚡  Scene 5 — Kickoff              → Projects. Energy unleashed.
📊  Scene 6 — Half Time            → Stats board. Numbers. Easter eggs.
📝  Scene 7 — Second Half          → Writing. Editorial. Your thoughts.
🏁  Scene 8 — Final Whistle        → Contact. The scoreboard result.
```

---

## 🧭 How to Use This Brief with Claude Code

1. **Start every session:**
   > *"Read BRIEF.md fully before we begin."* then paste the file.

2. **Build one scene at a time:**
   > *"Let's build Scene 1 — The Matchday Card. Follow the brief exactly."*

3. **Suggested build order:**
   ```
   0. Global: layout.tsx, CSS variables, Tailwind config, font imports
   1. Scene 1 — Matchday Card
   2. Scene 8 — Final Whistle (easy win, test deploy to Vercel)
   3. Scene 4 — The Tunnel
   4. Scene 3 — Walking to Ground
   5. Scene 2 — Squad Sheet
   6. Scene 5 — Kickoff / Projects
   7. Scene 6 — Half Time / Stats
   8. Scene 7 — Second Half / Writing
   9. Blog MDX setup
   10. Polish — animations, mobile, performance
   ```

4. **Deploy after Scene 1** — connect GitHub → Vercel immediately.

5. **Replace all `[bracket]` placeholders** with real content before launch.

---

## ✅ Pre-Build Checklist

- [ ] Real name
- [ ] Actual projects (name, problem, stack, one-liner, status)
- [ ] Timeline milestones (year + moment + one line)
- [ ] About Me prose in your own voice
- [ ] Real stats (years in ML, commits, etc.)
- [ ] A quote you live by
- [ ] Contact links (email, GitHub, LinkedIn, Twitter/X)
- [ ] 2–4 blog post ideas or drafts
- [ ] football-data.org API key (free tier)
- [ ] Google Fonts confirmed: Barlow Condensed + DM Sans + JetBrains Mono
