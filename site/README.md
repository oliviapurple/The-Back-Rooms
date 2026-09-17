# The Back Rooms — Website

A one-page marketing site for The Back Rooms, a barbershop + back scratch
lounge in New York City. Static HTML/CSS/vanilla JS — no build step,
no dependencies, no external JS libraries. Fonts (Playfair Display + Inter)
load from Google Fonts.

**Wording note:** the site intentionally never uses "therapy" or "massage"
when describing the Scratch Lounge — the staff are not licensed massage
therapists, and that language could be misleading. Keep new copy to "care,"
"session," "attention," and "Lounge" instead.

## Preview locally

```bash
cd site
python3 -m http.server 8000
# then open http://localhost:8000
```

## What's here

- `index.html` — all page content and structure
- `css/styles.css` — design tokens (colors, type, spacing) + all styling
- `js/main.js` — mobile nav, scroll-reveal animation, service tabs, review
  carousel (all respect `prefers-reduced-motion`)

## Before launch — things to fill in

1. **Real photography.** The gallery section (`#gallery`) and hero currently
   use styled placeholder tiles. Swap in real photos of the space, the
   barbers, and the Scratch Lounge — replace the `.gallery-item` divs with
   `<img>` tags and update the CSS.
2. **Square booking links.** In `index.html`, every booking button has the
   class `js-square-link` and a `href="#"` placeholder — there are four of
   them (main "Book on Square" CTA, "Book With Our Barbers" ×2, and one
   "Join Tier X" button per membership card). Replace each `href="#"` with
   its real Square Appointments URL (the barber-booking and membership
   links will likely be different Square booking pages/services). Once all
   real links are in, you can delete the placeholder-click alert in
   `js/main.js` (the block that checks `href === "#"`).
3. **Barber profiles.** The "Meet Our Barbers" section (`#barbers`) is a
   placeholder panel — add real bios, photos, and specialties per barber
   once you have them, since barbers are independent (1099) contractors and
   don't have listed pricing on this site.
4. **Exact street address, phone, and email** — currently placeholders
   (`New York, NY`, `(212) 555-0000`, `hello@thebackroomsnyc.com`). Update in
   both `index.html` and anywhere they're repeated (footer, visit section).
5. **Map** — the "Visit" section uses a stylized placeholder map, not a real
   embed. Once you have a confirmed address, swap in a Google Maps embed or
   static map image.
6. **Favicon** — a real favicon/social preview image (`og:image`) should be
   added before launch.

## Deploying on Squarespace

This is hand-coded HTML/CSS/JS, and Squarespace does not host arbitrary
custom pages the way a static host (Netlify, Vercel, GitHub Pages) does — it
only accepts custom code in two limited ways:

- **Code Injection** (Settings → Advanced → Code Injection, Business plan or
  higher): lets you inject CSS/JS into the site's `<head>`/footer, but not
  swap out Squarespace's own page markup.
- **Code Blocks**: on Squarespace 7.1, you can drop a block of raw
  HTML/CSS/JS into a page inside their layout system, but it lives inside
  Squarespace's own section/container structure, not as a full standalone
  page.

Practically, that means this file cannot be uploaded to Squarespace as-is
and come out looking identical. Two realistic paths:

1. **Recommended if you want this exact design:** host this coded version
   directly (Netlify/Vercel/GitHub Pages all have generous free tiers) and
   point your domain at it instead of Squarespace. You keep every animation
   and the exact layout.
2. **If you want to stay on Squarespace:** pick a Squarespace template with
   a similar dark/editorial aesthetic, rebuild the page structure in their
   editor, and port over the copy, pricing menu, color palette
   (`css/styles.css` `:root` block has every hex value), fonts, and simpler
   CSS effects via Code Injection. The scroll-reveal and carousel JS can
   often be adapted into a Code Block with some rework, but full fidelity
   (e.g. the marquee, staggered reveals) is not guaranteed on Squarespace's
   templating system.

Let your developer/agency know which path you'd prefer — happy to prep
either a deploy-ready static build or a content/spec handoff doc for a
Squarespace rebuild.
