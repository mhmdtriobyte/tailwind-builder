# OG Image Specification

## Social Preview Image (og-image.png)

**Dimensions:** 1200 x 630 pixels (standard Open Graph size)

### Design Concept

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                             │   │
│  │      🎨  TAILWIND BUILDER                                   │   │
│  │                                                             │   │
│  │      The Visual Drag-and-Drop Builder                       │   │
│  │      for Tailwind CSS                                       │   │
│  │                                                             │   │
│  │  ┌─────────┐  ┌─────────────────────┐  ┌─────────┐         │   │
│  │  │ Sidebar │  │      Canvas         │  │ Props   │         │   │
│  │  │         │  │  ┌───┐ ┌───┐ ┌───┐  │  │  Panel  │         │   │
│  │  │ [Btn]   │  │  │   │ │   │ │   │  │  │         │         │   │
│  │  │ [Card]  │  │  └───┘ └───┘ └───┘  │  │ Layout  │         │   │
│  │  │ [Form]  │  │  ┌─────────────────┐│  │ Colors  │         │   │
│  │  │ [Nav]   │  │  │                 ││  │ Spacing │         │   │
│  │  │         │  │  └─────────────────┘│  │         │         │   │
│  │  └─────────┘  └─────────────────────┘  └─────────┘         │   │
│  │                                                             │   │
│  │      ✨ 63+ Components  📱 Responsive  💾 Export Code       │   │
│  │                                                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Visual Style

- **Background:** Dark gradient (#0f0f23 to #1a1a2e)
- **Accent Colors:** Blue (#3B82F6) to Purple (#8B5CF6) gradient
- **Typography:**
  - Title: Bold, 72px, White
  - Subtitle: Regular, 32px, Gray-300
  - Features: Medium, 24px, White with icons
- **Elements:**
  - Simplified mockup of the builder interface
  - Floating component cards with soft shadows
  - Subtle grid pattern in background
  - Rounded corners (16px) on all panels

### Key Elements to Include

1. **Logo/Title:** "🎨 Tailwind Builder" prominently displayed
2. **Tagline:** "The Visual Drag-and-Drop Builder for Tailwind CSS"
3. **Interface Preview:** Simplified mockup showing:
   - Component sidebar on left
   - Canvas in center with sample components
   - Properties panel on right
4. **Feature Highlights:**
   - "63+ Components"
   - "Responsive"
   - "Export Code"
5. **Branding:** Consistent with app's dark theme

### File Format

- **Format:** PNG
- **Size:** 1200 x 630 px
- **File:** `public/og-image.png`

### Usage

Add to `src/app/layout.tsx` metadata:

```typescript
export const metadata: Metadata = {
  openGraph: {
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Tailwind Builder - Visual Drag-and-Drop Builder for Tailwind CSS',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
  },
};
```

---

**Note:** This is a specification document. Create the actual og-image.png using a design tool like Figma, Canva, or any image editor following these guidelines.
