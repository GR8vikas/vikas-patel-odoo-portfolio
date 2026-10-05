# Odoo Developer Portfolio — Implementation Plan

## Product direction

A single-page personal portfolio for **Aarav Mehta**, an Odoo developer and systems architect. The experience should feel like a confident editorial case study: technical, warm, precise, and memorable without becoming a noisy developer template.

## Design system

- **Design movement:** Neo-editorial digital brutalism softened by dark glass and precision 3D interface objects.
- **Core principles:** (1) make the work feel tangible through depth and layered surfaces, (2) use typography and spacing as the main visual engine, (3) pair technical credibility with approachable copy, (4) keep motion intentional and low-friction.
- **Color philosophy:** Carbon black and warm paper create a studio/editorial base. Acid lime is the ownable signature color: energetic, optimistic, and a visual shorthand for operational momentum. Aubergine and muted steel provide depth without relying on blue SaaS clichés.
- **Layout paradigm:** Asymmetric, scroll-led storytelling with a left-side vertical rail, oversized section indices, and staggered content blocks. The hero uses a split composition: copy anchored left, a floating 3D module “orbit” anchored right.
- **Signature elements:** acid-lime signal line, floating “module cards” with thin technical labels, and oversized mono section numbers.
- **Interaction philosophy:** interactions should feel like moving through a calm operating system: hover shifts reveal hierarchy, links underline with a lime trace, filters reframe content, and the 3D object responds gently to pointer position.
- **Animation:** entrance reveals use 500–700ms opacity/translate transitions with stagger. Cards lift 4–8px on hover. The hero object rotates subtly on pointer move, but the reduced-motion mode disables all transforms and looping behavior.
- **Typography system:** Space Grotesk for expressive headlines and UI labels; IBM Plex Mono for metadata, indices, eyebrow text, and technical details. Use large, tight headlines with generous line-height in body copy.
- **Brand essence:** “Odoo systems engineering that turns operational friction into elegant, usable software.” Personality: **exact, inventive, grounded**.
- **Brand voice:** direct, specific, and quietly confident. Example lines: “I make the messy middle operational.” “Good systems disappear into the way teams work.”
- **Wordmark / logo:** an `AM/` monogram built as a geometric slash + two offset bars, echoing a route mark or module connector rather than a typed name.
- **Signature brand color:** Acid Lime `#c9ff5a`.

## Implementation approach

- Use a lightweight static Vite-style app served by a small Node server on port 3000; no backend, database, or authentication.
- Semantic HTML sections with anchor navigation for hero, about, capabilities, work, process, and contact.
- CSS-only 3D visual language: perspective, transform layers, borders, gradients, and glass surfaces rather than heavy WebGL, keeping performance strong and the page accessible.
- Vanilla JavaScript for mobile navigation, project filtering, pointer-reactive hero object, scroll reveal, and clipboard feedback.
- Respect `prefers-reduced-motion` throughout.
- Keep the route manifest at `/manus-routes.json` for the single `/` page.

## Project structure

- `index.html` — page structure and content.
- `src/styles.css` — complete design system, responsive layout, states, and motion.
- `src/main.js` — progressive enhancement for interactions.
- `server.mjs` — dependency-free static server for Preview.
- `public/manus-routes.json` — Webdev route manifest.
- `app.config.ts` — project logo metadata.
