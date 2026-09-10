# SIH 2026 Project Repository

This repository contains **SmritiMitra**, a browser-based cognitive screening and memory-support platform designed for families and community clinics across North East India.

Deployment-> https://dimentia-games.vercel.app/

## 1. Project Information

* **Project Title:** `SmritiMitra`
* **PS ID:** `SIH26003`
* **PS Title:** `AI-Based Cognitive Gaming and Memory Assistance Platform for Elderly Dementia Patients in North Eastern Region (NER)`
* **Category:** Software
* **Theme:** `MedTech / BioTech / HealthTech`

> **Tagline:** *Calm, local-first cognitive screening and memory support for families and community clinics across North East India.*

## 2. Problem Statement

Early identification of cognitive decline can be difficult for families and communities, particularly when access to specialized healthcare and cognitive assessment services is limited.

People and caregivers may not know when changes in memory, speech, attention, or everyday behavior require professional attention. Existing assessment experiences can also be difficult to understand, inaccessible, or dependent on continuous internet connectivity.

There is a need for an accessible, easy-to-understand and locally relevant digital platform that can help families perform an initial cognitive screening, monitor progress, engage in cognitive activities, and find appropriate follow-up resources.

**SmritiMitra is not a medical diagnostic system.** It is designed as a screening and education tool to support conversations with qualified healthcare professionals.

## 3. Proposed Solution

**SmritiMitra** is a browser-based care platform that guides a person or caregiver from an initial introduction through onboarding, structured cognitive screening, daily brain games, and practical follow-up resources.

The platform uses a three-part screening approach:

1. **Cognitive assessment**
2. **Speech assessment**
3. **Behavioral assessment**

Each completed assessment contributes to a combined screening score. The platform then presents the result in understandable language along with appropriate next steps.

The application follows a **local-first and offline-friendly approach**, allowing supported patient and progress information to remain available through local storage/cache during weak or intermittent connectivity.

## 4. Key Features

* Three-part cognitive screening
* Cognitive, speech, and behavioral assessments
* Combined screening score and interpretation
* Optional monitoring context
* Daily brain games
* Memory and attention activities
* Speech and pattern-based activities
* Matching and word-fluency games
* Caregiver/family portal
* Patient selection and progress context
* Emergency contact information
* Doctor directory for North East India
* Offline-friendly/local-first experience
* Local progress caching and synchronization
* Accessibility controls

  * Text scaling
  * Contrast controls
  * Reduced motion
  * Voice guidance
  * Focus improvements
  * Simplified modes
* Localization foundation

  * English
  * Hindi
  * Assamese
* Google authentication
* Privacy-conscious data handling

## 5. Technology Stack

* **Frontend:** React, TypeScript
* **Build Tool:** Vite
* **Routing:** TanStack Router
* **Backend / Database:** Supabase
* **Authentication:** Supabase Authentication / Google OAuth
* **Database:** Supabase Database
* **State Management:** React application state
* **Offline Support:** Local storage/cache and synchronization layer
* **Styling:** CSS / project UI system
* **Speech:** Browser speech-recognition capabilities
* **Internationalization:** Application i18n layer
* **Package Manager:** npm / Bun

## 6. Architecture

### High-Level Architecture

```text
                    ┌──────────────────┐
                    │      User        │
                    │ Person/Caregiver │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │   React / Vite   │
                    │    Frontend      │
                    └────────┬─────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
       ┌────────────┐ ┌────────────┐ ┌────────────┐
       │ Assessment │ │ Brain      │ │ Caregiver  │
       │   Module   │ │   Games    │ │   Portal   │
       └─────┬──────┘ └────────────┘ └────────────┘
             │
             ▼
       ┌────────────┐
       │  Scoring   │
       │   Engine   │
       └─────┬──────┘
             │
             ▼
       ┌────────────┐
       │   Local    │
       │   Cache    │
       └─────┬──────┘
             │
        When online
             │
             ▼
       ┌────────────┐
       │  Supabase  │
       │ Auth + DB  │
       └────────────┘
```

### Product Flow

```text
Landing Page
     |
     v
Authentication
     |
     v
Onboarding
     |
     v
Patient Profile
     |
     v
Dashboard
     |
     +───────────────┬────────────────┬─────────────────┐
     |               |                |                 |
     v               v                v                 v
Assessment       Brain Games       Doctors       Family Portal
     |
     +───────────────┬────────────────┐
     |               |                |
     v               v                v
Cognitive         Speech         Behavioral
     |               |                |
     └───────────────┼────────────────┘
                     v
              Combined Result
                     |
                     v
                 Dashboard
```

## 7. Repository Structure

```text
NEUROTRACK-NE/
├── README.md
├── SUBMISSION_GUIDE.md
│
├── submission/
│   ├── PRESENTATION.md
│   └── DEMO.md
│
├── src/
│   ├── components/
│   │   ├── games/
│   │   └── layout/
│   │
│   ├── integrations/
│   │   └── supabase/
│   │
│   ├── lib/
│   │
│   ├── routes/
│   │
│   ├── main.tsx
│   └── router.tsx
│
├── supabase/
│   └── ...
│
├── public/
│   └── ...
│
├── assets/
│   └── screenshots/
│       └── README.md
│
├── package.json
├── vite.config.*
├── tsconfig.json
├── .gitignore
└── LICENSE
```

### What Goes Where?

| Item                    | Location                     |
| ----------------------- | ---------------------------- |
| Source code             | `src/`                       |
| Supabase configuration  | `supabase/`                  |
| Static assets           | `public/`                    |
| Technical documentation | `docs/` if added             |
| Project screenshots     | `assets/screenshots/`        |
| Final SIH presentation  | `submission/PRESENTATION.md` |
| Demo video              | `submission/DEMO.md`         |
| Project overview        | `README.md`                  |

## 8. Assessment & Scoring

SmritiMitra divides the screening experience into three components:

```text
┌─────────────────────┐
│  Cognitive Test     │
└──────────┬──────────┘
           │
           ├──────────────┐
           │              │
           ▼              ▼
┌─────────────────┐ ┌─────────────────────┐
│  Speech Test    │ │ Behavioral Test     │
└────────┬────────┘ └──────────┬──────────┘
         │                     │
         └──────────┬──────────┘
                    ▼
          ┌──────────────────┐
          │ Combined Score   │
          └────────┬─────────┘
                   ▼
             Result & Next
                Steps
```

The combined score is calculated as the **rounded arithmetic mean of the available completed assessment scores**.

### Score Interpretation

| Score Range | Tier            | Product Language               |
| ----------- | --------------- | ------------------------------ |
| `0–59`      | `dementia_risk` | Elevated dementia risk         |
| `60–79`     | `mci`           | Possible mild cognitive change |
| `80–100`    | `normal`        | Typical cognitive baseline     |

The result is intended to provide a **screening indication and guidance**, not a medical diagnosis.

Users should consult a qualified healthcare professional for clinical evaluation and decisions.

## 9. Data & Privacy

SmritiMitra follows a **local-first** design philosophy.

```text
User Action
     |
     v
React Application
     |
     +───────────────┐
     |               |
     v               v
Local Cache       Supabase
     |               |
     |          When connection
     |             available
     |               |
     └─────── Sync ──┘
```

Patient and progress information can be cached locally for supported flows so that the experience remains useful during weak or intermittent connectivity.

When an authenticated connection is available, the application attempts to synchronize data with Supabase.

### Security

The browser uses the **Supabase publishable key**.

Private credentials must never be exposed in browser-facing environment variables.

In particular:

* Do not expose Supabase service-role keys.
* Do not commit `.env` files containing secrets.
* Do not upload API keys, passwords, access tokens, or other confidential credentials.
* Configure OAuth redirect URLs correctly in the Supabase project.

## 10. Final Presentation

The final SIH presentation should be included in the repository whenever the file size allows it.

Recommended location:

```text
submission/PRESENTATION.md
```

If the final PPT is too large for GitHub, use an accessible Google Drive/OneDrive viewer link and add it to `submission/PRESENTATION.md`.

The presentation should cover:

* Problem statement
* Proposed solution
* Target users
* Key features
* System architecture
* Technology stack
* Innovation
* Social impact
* Screenshots/prototype
* Future scope
* Team information
* Demo information

## 11. Demo Video

A demo video is optional but recommended.

The demo should demonstrate the complete primary journey:

```text
Landing
   ↓
Login
   ↓
Onboarding
   ↓
Patient Profile
   ↓
Dashboard
   ↓
Cognitive Test
   ↓
Speech Test
   ↓
Behavioral Test
   ↓
Combined Result
   ↓
Brain Games
   ↓
Caregiver / Doctor Support
```

Add the video link to:

```text
submission/DEMO.md
```

## 12. Screenshots / Prototype

Important screenshots should be stored in:

```text
assets/screenshots/
```

Recommended screenshots include:

* Landing page
* Authentication
* Onboarding
* Patient profile
* Dashboard
* Cognitive assessment
* Speech assessment
* Behavioral assessment
* Combined result
* Brain games
* Caregiver portal
* Doctor directory
* Accessibility controls
* Offline/local-first experience

## 13. Installation

### Requirements

* Node.js 20 or newer
* npm or Bun
* Supabase project

Clone the repository:

```bash
git clone <YOUR_REPOSITORY_URL>
cd <YOUR_PROJECT_FOLDER>
```

Install dependencies:

```bash
npm install
```

## 14. Environment Configuration

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
```

Vite exposes variables prefixed with `VITE_` to browser code.

**Never place private server credentials or Supabase service-role keys in browser-facing environment variables.**

The `.env` file should not be committed to GitHub.

## 15. Run

Start the development server:

```bash
npm run dev
```

The development server will normally be available at:

```text
http://localhost:5173
```

## 16. Build & Validation

Create a production build:

```bash
npm run build
```

Run linting:

```bash
npm run lint
```

Preview the production build:

```bash
npm run preview
```

Format the project:

```bash
npm run format
```

## 17. Available Scripts

| Command             | Description                       |
| ------------------- | --------------------------------- |
| `npm run dev`       | Start the Vite development server |
| `npm run build`     | Create a production build         |
| `npm run build:dev` | Build using development mode      |
| `npm run preview`   | Preview the production build      |
| `npm run lint`      | Run ESLint                        |
| `npm run format`    | Format the project with Prettier  |

## 18. Reliability & Limitations

* The platform is designed to remain useful during weak or intermittent connectivity.
* Local progress acts as the immediate fallback when Supabase connectivity is unavailable.
* Supabase persistence is best-effort and depends on authenticated connectivity.
* Google OAuth requires the correct redirect URL configuration.
* Speech assessment depends on browser speech-recognition support and user permissions.
* Cognitive screening scores should not be treated as a medical diagnosis.
* Clinical decisions should be made by qualified healthcare professionals.
* The platform should be evaluated with real clinicians, caregivers, and families before clinical deployment.

## 19. Future Scope

Potential future improvements include:

* Integration with additional regional languages of North East India
* More culturally relevant cognitive games
* Improved longitudinal progress tracking
* Advanced caregiver dashboards
* Clinician-facing assessment reports
* Improved speech and behavioral analysis
* Integration with healthcare facilities and community clinics
* Better offline synchronization
* More extensive accessibility support
* Personalized cognitive-game recommendations
* Secure sharing of screening reports with healthcare professionals
* Research validation of the screening methodology with clinical datasets
* Integration with approved healthcare and telemedicine services

## 20. Social Impact

SmritiMitra aims to make early cognitive screening and memory-support resources more approachable for families and communities across North East India.

The platform focuses on:

* **Accessibility** — simple and understandable user experiences.
* **Local relevance** — language and regional healthcare context.
* **Continuity** — offline-friendly access during unreliable connectivity.
* **Family involvement** — caregiver-oriented tools and progress information.
* **Early awareness** — helping users recognize when professional evaluation may be appropriate.
* **Engagement** — brain games and activities that encourage continued cognitive interaction.

## 21. Important Disclaimer

**SmritiMitra is a screening and education platform, not a medical diagnostic tool.**

Its scores and recommendations should not be used as a substitute for professional medical assessment, diagnosis, or treatment.

Any person with concerns about cognitive health should consult an appropriately qualified healthcare professional.

## 22. License

No license has been declared for this repository yet.
