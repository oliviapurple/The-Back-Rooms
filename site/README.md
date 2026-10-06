# The Back Rooms — Website

A one-page marketing site for The Back Rooms, a barbershop + back & scalp
scratch lounge in New York City. Static HTML/CSS/vanilla JS with no build step
and no JS libraries. The font (Newsreader) loads from Google Fonts.

The design takes cues from hotelaurelia.online: a monogram intro screen that
opens (here as two doors) onto a full-bleed photo hero with a thin inset
frame, a centered wordmark, and a two-option switch (Barbershop / Scratch
Lounge) in place of the reference's season picker.

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
- `css/styles.css` — palette tokens (sampled from the brand photos) + all styling
- `js/main.js` — intro, full-screen menu, hero room switch, service tabs,
  review carousel (all respect `prefers-reduced-motion`)
- `assets/logo/` — the wordmark, stacked wordmark, BR monogram and single
  "B" traced to SVG from the brand sheets. They're applied as CSS masks, so
  they take any color (`.logo-mask--*` classes in the stylesheet).
- `assets/img/` — crops from the brand mockup sheets, used as stand-in
  photography

## Before launch — things to fill in

1. **Real photography.** The hero, rooms, gallery and booking banner use
   crops from the brand mockup sheets, which are low resolution (about
   1150px wide at most). Swap in high-resolution photos of the space,
   barbers and Scratch Lounge in `assets/img/` (same filenames, or update
   the `src`s).
2. **Original logo files.** The logos in `assets/logo/` were traced from
   screenshots. If the designer can supply the original SVGs, drop them in
   with the same filenames and update the `aspect-ratio` values in
   `styles.css` to match their viewBoxes.
3. **Square booking links.** Every booking button has the class
   `js-square-link` and `href="#"`: menu "Book a visit", "Book with a
   barber" (×2), "Book a session", one "Join Tier X" per membership, and
   the final "Book a visit". Replace each with its Square Appointments
   URL, then delete the placeholder-alert block at the end of `js/main.js`.
4. **Barber profiles.** `#barbers` lists three "Barber profile — Coming
   soon" rows. Replace them with names, photos and specialties.
5. **Address, phone, email.** `#visit` currently says "Manhattan, New York"
   and "coming soon". Add the real details there (and in the menu footer),
   and consider a map embed once the address is confirmed.
6. **FAQ answers.** The policies in `#faq` (24-hour cancellation, 10-minute
   lateness, walk-ins, memberships) are drafts. Confirm or edit them.
7. **Social preview image** (`og:image`) before launch.

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
