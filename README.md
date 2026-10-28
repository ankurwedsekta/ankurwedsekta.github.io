# The Painted Palace — Ankur & Ekta

An illustrated, scroll-told wedding invitation. Guests open the palace doors, read the invitation, move through the four ceremonies as painted miniatures, find the venue and send their reply sealed in wax.

## Run

```bash
npm install --registry https://registry.npmjs.org/
npm run dev        # http://localhost:5173
npm run build      # static site in dist/
npm run preview
```

`dist/` is a fully static site. Deploy it to Netlify, Vercel, Cloudflare Pages or GitHub Pages without any server configuration.

## Editing content

All wedding facts (names, families, ceremonies, times, venue, map links, RSVP numbers) live in **`src/content/wedding.ts`**. Calendar files, Google Calendar links, the countdown and the WhatsApp message are all generated from it.

## Structure

| Path | Purpose |
|---|---|
| `src/sections/` | Gateway (door intro), Hero, Invitation, Marquee, Ceremonies (pinned horizontal gallery), Venue, Rsvp, Finale, Header, MobileDock |
| `src/components/` | Procedural artwork (ornaments, ceremony scenes, painted map), WebGL silk shader, embers, grain, Reveal/SplitText, magnetic RoyalButton |
| `src/lib/` | Lenis + GSAP smooth scroll, gate state, calendar (.ics / Google) helpers, shared hooks |

All artwork is drawn in code (SVG and GLSL), so there are no image assets.

## Notes and assumptions

- Dates, times and venue come from the printed invitation: Sagaai on Fri 20 Nov 2026, then Sehra Bandi, Baraat and Dawat on Sat 21 Nov 2026, all at Orriva (Awadh Palace), Ghaziabad.
- RSVPs have no backend. The reply is stored on the guest's device and sent to the family through a prefilled WhatsApp message.
- The painted map is illustrative. "Open in Google Maps" and the "Live" view use a Google Maps search for the venue.
- `prefers-reduced-motion` turns off smooth scrolling, pinning, parallax, particles and the shader animation. The doors fade instead of swinging, and the ceremonies stack vertically.
