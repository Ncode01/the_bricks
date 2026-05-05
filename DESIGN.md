---
name: Cinematic Workspace
colors:
  surface: '#fbf8ff'
  surface-dim: '#d8d8ec'
  surface-bright: '#fbf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f2ff'
  surface-container: '#edecff'
  surface-container-high: '#e7e6fb'
  surface-container-highest: '#e1e1f5'
  on-surface: '#191b29'
  on-surface-variant: '#4b4452'
  inverse-surface: '#2e2f3e'
  inverse-on-surface: '#f0efff'
  outline: '#7c7483'
  outline-variant: '#cdc3d4'
  surface-tint: '#7443ba'
  primary: '#7240b8'
  on-primary: '#ffffff'
  primary-container: '#8b5ad3'
  on-primary-container: '#fffbff'
  inverse-primary: '#d7baff'
  secondary: '#764b9b'
  on-secondary: '#ffffff'
  secondary-container: '#d8a8ff'
  on-secondary-container: '#613786'
  tertiary: '#006389'
  on-tertiary: '#ffffff'
  tertiary-container: '#007dac'
  on-tertiary-container: '#fcfcff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#eddcff'
  primary-fixed-dim: '#d7baff'
  on-primary-fixed: '#280056'
  on-primary-fixed-variant: '#5b27a1'
  secondary-fixed: '#f1daff'
  secondary-fixed-dim: '#dfb7ff'
  on-secondary-fixed: '#2d004f'
  on-secondary-fixed-variant: '#5d3381'
  tertiary-fixed: '#c6e7ff'
  tertiary-fixed-dim: '#81cfff'
  on-tertiary-fixed: '#001e2d'
  on-tertiary-fixed-variant: '#004c6b'
  background: '#fbf8ff'
  on-background: '#191b29'
  surface-variant: '#e1e1f5'
typography:
  display-cinematic:
    fontFamily: Newsreader
    fontSize: 72px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  h1-metadata:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  body-standard:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  label-timecode:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.08em
  label-track:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.05em
spacing:
  unit: 4px
  gutter: 1px
  panel-padding: 24px
  track-gap: 8px
  margin-page: 40px
---

## Brand & Style

This design system is built for the elite cinematographer, evoking the technical precision and creative intensity of a high-end color grading and editing suite. It targets production houses and premium directors who value the "behind-the-lens" process as much as the final frame. 

The aesthetic is a hybrid of **Minimalism** and **Architectural Modularism**. It rejects traditional "website" layouts in favor of a workspace environment. The interface functions as a professional toolset where content is organized into logical "sequences" and "bins." The emotional response is one of controlled authority, technical mastery, and structural elegance. Every element feels "latched" to a grid, suggesting a system that is engineered rather than merely decorated.

## Colors

The palette utilizes a sophisticated tonal hierarchy to separate "UI Chrome" from "Content Tracks."

- **Primary Violet (#9B6AE3):** Reserved for "Clip Bricks" and primary action states. It represents the active video track.
- **Secondary Lavender (#B88ADF):** Used for nested clips, secondary tracks, and hovered states within the workspace.
- **Precision Cyan (#2A9FD6):** A technical accent used exclusively for the "Playhead," active sequence markers, and precision trimming indicators.
- **Surface Neutrals:** The background (#F5F4FA) and structural borders (#D7D7EB) mimic the anodized aluminum and matte textures of professional hardware interfaces.

## Typography

The typographic system creates a tension between cinematic artistry and technical metadata.

- **Display:** **Newsreader** is used for project titles and major headings, providing a high-contrast, editorial feel that anchors the portfolio as a piece of art.
- **UI & Navigation:** **Inter** provides the utilitarian foundation. It is used for all functional interface elements, descriptions, and structural menus.
- **Technical Metadata:** **Space Grotesk** is applied to timecodes, scene numbers (e.g., SCENE 01), and track labels (e.g., V1, A1). Its monospaced-like rhythm reinforces the "editing suite" metaphor and ensures technical data remains legible at small scales.

## Layout & Spacing

The layout follows a **Panel-Based Fixed Grid** inspired by non-linear editing (NLE) software. 

1.  **Structural Framing:** The viewport is divided into functional zones (Source Monitor, Timeline, Project Bin). These zones are separated by 1px "structural borders" using the Neutral Lilac-Gray.
2.  **The Timeline Track:** Horizontal tracks serve as the primary navigation. Content is housed in "Clip Bricks" that sit on these tracks.
3.  **Modular Rhythm:** All spacing is derived from a 4px baseline. Gutters between panels are kept at a razor-thin 1px to maximize the "integrated tool" feel, while internal padding within panels is generous (24px) to ensure the content breathes.

## Elevation & Depth

This design system avoids traditional drop shadows in favor of **Tonal Layering and Precision Outlines**.

- **Level 0 (Base):** The Pale Lilac-Gray (#D7D7EB) serves as the "machine" surface.
- **Level 1 (Panels):** The Off-White (#F5F4FA) panels are "inset" into the base, defined by 1px solid borders.
- **Level 2 (Clip Bricks):** Elements on the timeline appear flush or slightly "raised" using flat color fills (Primary/Secondary). No shadows are used; depth is communicated solely through color-blocking.
- **Level 3 (Overlays):** Contextual menus or "Trimming Tooltips" use a high-contrast background with a sharp 1px Cyan border to indicate active focus.

## Shapes

The design system is strictly **Sharp-Edged**. All panels, clip bricks, and input fields utilize 0px border radii to maintain an architectural, engineered look. 

**Exceptions:** 
- Selective rounding (Pill-shape) is applied only to the "Playhead" handle and the primary logo mark to create a distinct visual "anchor" against the rigid grid. 
- Iconography should use square terminals and consistent 2px stroke weights.

## Components

### Clip Bricks (Cards)
Rectangular containers representing video segments. They feature a top-aligned label (SCENE XX) and a thumbnail or metadata summary. Hovering a brick triggers a "scrub" preview where the thumbnail scrolls through frames.

### The Playhead (Navigation)
A vertical Cyan line (#2A9FD6) that acts as the primary scroll/navigation indicator. As the user scrolls the page, the playhead moves across the horizontal timeline track.

### Sequence Tabs
Used for page navigation at the top of the workspace. Active tabs use a "lower-border" of Cyan, mimicking the look of active sequences in Premiere Pro.

### Precision Buttons
Small, square buttons with icon-only labels. Use high-contrast fills for active states. Avoid large, pill-shaped "CTAs"; instead, use "In-Point" and "Out-Point" styled buttons for actions.

### Timecode Rulers
Used at the top of the main gallery. A scale of small vertical ticks that mark increments of the scroll progress, providing a technical sense of orientation.

### Metadata Inputs
Input fields are styled as "Edit Boxes" with no background—only a bottom border that turns Cyan on focus. Labels sit above the input in Space Grotesk.