# Hero Asteroids Experiment — Revert Guide

**Created:** 2026-07-01  
**Purpose:** Experimental landing hero with transparent cutout, particle stars, and Asteroids mini-game.

## Quick Revert (restore original hero)

1. In `MainSite/index.html`, remove or comment the block marked `HERO ASTEROIDS EXPERIMENT`.
2. Hard-refresh the homepage (Ctrl+Shift+R).
3. Original parallax hero (`websitehero*.webp` backgrounds) returns immediately.

## What was preserved

| Asset | Location |
| --- | --- |
| Original hero images | `snapshot/websitehero-original.webp`, `snapshot/websitehero-1920-original.webp` |
| Hero HTML snapshot | `snapshot/hero-section.html` |
| Image paths & CSS vars | `snapshot/settings.json` |
| Transparent cutout | `hero-cutout.png`, `hero-cutout.webp` |

## Original hero settings (pre-experiment)

- Background layers: `.parallax-bg-far` → `websitehero-1920.webp` / `websitehero.webp` / `websitehero-hd.webp`
- Cache bust: `?v=20260604perf1`
- Parallax rate: `--hero-parallax-rate: 0.45` (0.55 mobile)
- BG position: `top center`
- Filter: `brightness(0.82) contrast(1.05)`
- Init: `initLayeredParallax()` in `script.js`

## Disable experiment without removing files

Add `?heroExperiment=0` to the homepage URL, or set in console:

```js
localStorage.setItem('kl-hero-experiment', '0'); location.reload();
```

## Re-enable experiment

```js
localStorage.setItem('kl-hero-experiment', '1'); location.reload();
```

Default when experiment scripts are linked: **enabled** unless `?heroExperiment=0` or localStorage is `0`.
