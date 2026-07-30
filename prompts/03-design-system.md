# Sahayak — Design System

> This document defines the complete visual language of Sahayak.
>
> Every page, component, interaction, animation, and layout must follow this
> specification to maintain consistency.
>
> The goal is to create a timeless, premium product—not a trendy UI.

---

# Design Principles

The interface should feel:

- Premium
- Calm
- Human
- Trustworthy
- Modern
- Minimal
- Spacious

The experience should resemble a polished software product rather than a startup landing page.

Never overwhelm users with excessive colors, gradients, or animations.

Every pixel should have a purpose.

---

# Visual Inspiration

Draw inspiration from the quality and polish of products like:

- Apple
- Linear
- Stripe
- Notion
- Vercel
- Airbnb
- Arc Browser

Do NOT copy layouts or branding.

Take inspiration from:

- spacing
- typography
- simplicity
- interaction quality
- attention to detail

Sahayak must have its own unique visual identity.

---

# Theme

The application should use a completely original design language.

Avoid the previous blue-orange identity.

New direction:

Elegant
Natural
Warm
Modern

The interface should feel inviting rather than corporate.

---

# Color Palette

## Primary

Forest Green

```
#155E63
```

Used for

- Primary buttons
- Active navigation
- Important highlights

---

## Primary Hover

```
#10494D
```

---

## Secondary

Soft Emerald

```
#3AAE8B
```

Used for

- Success
- Verified badges
- Progress

---

## Accent

Golden Amber

```
#E7A42B
```

Used sparingly.

Examples

- Call to action highlights
- Ratings
- Important badges

Never use amber for large backgrounds.

---

## Background

```
#FAFAF8
```

Very subtle warm off-white.

Avoid pure white pages.

---

## Surface

```
#FFFFFF
```

Cards

Dialogs

Dropdowns

Forms

---

## Elevated Surface

```
#FCFCFB
```

Used for hover states.

---

## Text Primary

```
#1D1D1F
```

---

## Text Secondary

```
#616161
```

---

## Text Muted

```
#8C8C8C
```

---

## Border

```
#E8E8E5
```

---

## Success

```
#16A34A
```

---

## Warning

```
#D97706
```

---

## Error

```
#DC2626
```

---

## Info

```
#2563EB
```

---

# Dark Mode

Support full dark mode.

Dark Background

```
#111315
```

Card

```
#1A1C1E
```

Border

```
#2D2F31
```

Primary Text

```
#F7F7F7
```

Secondary Text

```
#BDBDBD
```

Do not simply invert colors.

Adjust every component individually.

---

# Typography

## Font Pair

Headings

Fraunces

Body

Inter

Fallback

system-ui

---

# Font Weights

300

400

500

600

700

800

---

# Typography Scale

Display

64px

Hero Heading

56px

H1

48px

H2

40px

H3

32px

H4

24px

Body Large

18px

Body

16px

Caption

14px

Small

12px

---

# Line Height

Headings

110%

Body

170%

---

# Letter Spacing

Only headings may use slight negative tracking.

Body should remain natural.

---

# Layout System

Maximum Width

```
1280px
```

Content Width

```
1180px
```

Article Width

```
760px
```

Never allow content to stretch edge-to-edge.

---

# Spacing System

Use an 8-point grid.

```
4
8
12
16
24
32
40
48
64
80
96
120
160
```

Never invent random spacing values.

---

# Border Radius

Buttons

```
16px
```

Inputs

```
14px
```

Cards

```
24px
```

Dialogs

```
28px
```

Pills

```
999px
```

---

# Shadows

Use extremely soft shadows.

Example

Small

```
0 2px 10px rgba(0,0,0,.04)
```

Medium

```
0 10px 30px rgba(0,0,0,.08)
```

Large

```
0 20px 60px rgba(0,0,0,.10)
```

Never use harsh shadows.

---

# Buttons

Three button variants.

Primary

Filled Forest Green

Secondary

White with border

Ghost

Transparent

---

Buttons should have

56px height

Large padding

Medium font weight

Rounded corners

Hover animation

Keyboard focus

Loading state

Disabled state

Icon support

---

# Cards

Cards should feel premium.

Requirements

24px radius

Large padding

Soft border

Subtle hover

Never use thick borders.

---

# Inputs

Rounded

Large click area

Clear labels

Visible errors

Focus ring

Placeholder color muted

Support

Text

Password

Search

Dropdown

Textarea

Date

Time

Phone

---

# Navigation

Sticky

Blur background on scroll

Transparent at top

Solid after scrolling

Smooth transition

Desktop

Logo

Navigation

Search

Profile

CTA

Mobile

Drawer menu

Large touch targets

---

# Icons

Use

Lucide React

Consistent stroke width

Never mix icon styles.

---

# Illustrations

Use custom illustrations where possible.

Avoid generic stock illustrations.

Illustrations should reinforce human connection.

---

# Images

Mentor photos should always have:

Consistent aspect ratio

Rounded corners

Lazy loading

Skeleton placeholder

Blur loading

---

# Motion

Animations should feel elegant.

Never flashy.

---

Page Transition

Fade

Duration

250ms

---

Card Hover

Translate

-4px

Scale

1.01

---

Buttons

Scale

1.02

---

Dropdown

Fade + Slide

---

Dialogs

Scale + Fade

---

Page Sections

Fade Up

On first appearance

---

Respect

prefers-reduced-motion

Disable non-essential animations.

---

# Micro Interactions

Hover

Focus

Pressed

Loading

Success

Error

Disabled

Every interactive component must provide visual feedback.

---

# Accessibility

Minimum contrast AA.

Keyboard navigation.

Screen reader support.

Visible focus.

ARIA labels.

Reduced motion.

Accessible forms.

Touch-friendly spacing.

---

# Responsive Breakpoints

Mobile

0

Tablet

768

Laptop

1024

Desktop

1280

Large Desktop

1536

---

# Component Rules

Every reusable component must:

Accept props.

Avoid duplicated logic.

Support loading state.

Support empty state.

Support disabled state.

Support dark mode.

Support accessibility.

---

# Design Consistency Rules

Never mix border radius values.

Never use random spacing.

Never use more than three accent colors on one screen.

Never use unnecessary gradients.

Never use glassmorphism everywhere.

Never animate everything.

Avoid visual noise.

---

# Premium UI Checklist

Every page should answer YES to these questions.

✓ Is there enough whitespace?

✓ Is typography the primary visual element?

✓ Are actions obvious?

✓ Does the page feel calm?

✓ Does it load gracefully?

✓ Does every component have hover and focus states?

✓ Is the mobile experience first-class?

✓ Does the UI feel handcrafted rather than generated?

If any answer is NO,

the design is not ready.