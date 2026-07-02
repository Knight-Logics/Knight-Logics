/**
 * Knight Logics — Hero Asteroids Experiment
 * Particle stars (WebTech-inspired ambient) + Asteroids mini-game + transparent cutout.
 * Revert: see experiments/hero-asteroids/REVERT.md
 */
(function () {
    'use strict';

    const GREEN = '#64ffda';
    const GREEN_RGB = '100, 255, 218';
    const CUTOUT_SRC = './experiments/hero-asteroids/hero-cutout.webp?v=20260701exp11';

    function isEnabled() {
        const params = new URLSearchParams(window.location.search);
        if (params.get('heroExperiment') === '0') return false;
        if (params.get('heroExperiment') === '1') return true;
        const stored = localStorage.getItem('kl-hero-experiment');
        if (stored === '0') return false;
        if (stored === '1') return true;
        return true;
    }

    if (!document.querySelector('#hero') || !isEnabled()) return;

    const hero = document.querySelector('#hero');
    if (hero.querySelector('.hero-experiment-layers')) return;

    const orphanParallax = document.getElementById('klHeroParallax');
    if (orphanParallax && !hero.contains(orphanParallax)) {
        orphanParallax.remove();
    }
    hero.classList.add('hero-experiment-active');

    function syncLayoutFit() {
        const wrapper = hero.querySelector('.hero-content-wrapper');
        const layout = hero.querySelector('.hero-layout');
        if (!wrapper || !layout) return;

        const innerH = wrapper.clientHeight;
        hero.style.setProperty('--kl-hero-inner-h', `${Math.max(320, innerH)}px`);

        if (window.innerWidth < 769) {
            hero.style.setProperty('--kl-layout-scale', '1');
            return;
        }

        const needed = layout.scrollHeight;
        const available = innerH - 6;
        if (needed > available) {
            const scale = Math.max(0.76, available / needed);
            hero.style.setProperty('--kl-layout-scale', String(scale));
        } else {
            hero.style.setProperty('--kl-layout-scale', '1');
        }
    }

    function syncNavHeight() {
        const nav = document.querySelector('.navbar');
        const header = document.getElementById('header-container');
        const h = Math.ceil(nav?.getBoundingClientRect().height || header?.offsetHeight || 108);
        hero.style.setProperty('--kl-nav-height', h + 'px');
        document.documentElement.style.setProperty('--kl-nav-height', h + 'px');
        if (header) {
            header.style.minHeight = h + 'px';
            header.style.height = h + 'px';
        }
    }

    syncNavHeight();
    syncLayoutFit();
    window.addEventListener('resize', () => {
        syncNavHeight();
        requestAnimationFrame(syncLayoutFit);
    }, { passive: true });
    window.addEventListener('orientationchange', () => {
        syncNavHeight();
        requestAnimationFrame(syncLayoutFit);
    });

    /* ── DOM injection ── */
    const layers = document.createElement('div');
    layers.className = 'hero-experiment-layers';
    layers.innerHTML = `
        <div class="hero-experiment-parallax" id="klHeroParallax" aria-hidden="true">
            <div class="hero-experiment-bg"></div>
            <canvas class="hero-experiment-canvas hero-experiment-canvas--stars" id="klHeroStars" aria-hidden="true"></canvas>
            <canvas class="hero-experiment-canvas hero-experiment-canvas--asteroids" id="klHeroAsteroids" aria-hidden="true"></canvas>
        </div>
        <div class="hero-experiment-foreground" aria-hidden="true">
            <img class="hero-experiment-cutout" id="klHeroCutout" src="${CUTOUT_SRC}" alt="" width="1920" height="1050" decoding="async" fetchpriority="high">
            <div class="hero-experiment-score" id="klHeroScore" aria-live="polite">
                <span class="hero-experiment-score-label">SCORE</span>
                <span class="hero-experiment-score-value">100</span>
            </div>
        </div>
    `;
    const wrapper = hero.querySelector('.hero-content-wrapper');
    hero.insertBefore(layers, wrapper);

    const parallaxShell = document.getElementById('klHeroParallax');
    const starsCanvas = document.getElementById('klHeroStars');
    const asteroidsCanvas = document.getElementById('klHeroAsteroids');
    const cutoutImg = document.getElementById('klHeroCutout');
    const scoreEl = document.querySelector('#klHeroScore .hero-experiment-score-value');
    const trustBridge = document.querySelector('.kl-trust-bridge');

    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;
    const mouse = { x: -9999, y: -9999, down: false };
    const smoothMouse = { x: -9999, y: -9999 };
    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
    const isMobileViewport = () => window.innerWidth <= 768;
    const useLiteStars = () => isCoarsePointer || isMobileViewport();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const useProofParallax = () => !reducedMotion && window.innerWidth >= 769;

    function ensurePageScroll() {
        if (document.body.classList.contains('landing-mode')) return;
        if (document.body.classList.contains('nav-menu-open')) return;
        document.body.style.removeProperty('overflow');
    }

    function syncParallaxMode() {
        const on = useProofParallax();
        document.body.classList.toggle('hero-experiment-parallax', on);
        if (on) {
            if (parallaxShell.parentElement !== layers) {
                layers.insertBefore(parallaxShell, layers.firstChild);
            }
            parallaxShell.classList.add('hero-experiment-parallax--fixed');
        } else {
            parallaxShell.classList.remove('hero-experiment-parallax--fixed');
            parallaxShell.style.transform = '';
            parallaxShell.style.opacity = '';
            parallaxShell.style.visibility = '';
            asteroidsCanvas.style.pointerEvents = 'auto';
            if (parallaxShell.parentElement !== layers) {
                layers.insertBefore(parallaxShell, layers.firstChild);
            }
        }
        ensurePageScroll();
        sizeCanvases();
        buildStars();
    }

    function getCanvasHostRect() {
        if (useProofParallax()) {
            const navH = parseFloat(getComputedStyle(hero).getPropertyValue('--kl-nav-height')) || 108;
            return {
                width: window.innerWidth,
                height: Math.max(320, window.innerHeight - navH),
                left: 0,
                top: navH,
            };
        }
        return hero.getBoundingClientRect();
    }

    function updateProofParallax() {
        if (!useProofParallax() || !trustBridge) return;

        const bridgeRect = trustBridge.getBoundingClientRect();
        const heroRect = hero.getBoundingClientRect();
        const scrollY = window.scrollY;
        const raw = getComputedStyle(hero).getPropertyValue('--kl-hero-parallax-rate').trim();
        const rate = Number.isFinite(parseFloat(raw)) ? parseFloat(raw) : 0.42;

        parallaxShell.style.transform = `translate3d(0, ${-(scrollY * rate)}px, 0)`;

        if (bridgeRect.bottom <= 0) {
            parallaxShell.style.opacity = '0';
            parallaxShell.style.visibility = 'hidden';
        } else {
            parallaxShell.style.opacity = '1';
            parallaxShell.style.visibility = 'visible';
        }

        const heroPlayable = heroRect.bottom > 80 && heroRect.top < window.innerHeight - 40;
        asteroidsCanvas.style.pointerEvents = heroPlayable ? 'auto' : 'none';
    }

    function initProofParallax() {
        window.addEventListener('scroll', () => requestAnimationFrame(updateProofParallax), { passive: true });
        window.addEventListener('resize', () => {
            syncParallaxMode();
            requestAnimationFrame(updateProofParallax);
        }, { passive: true });
        updateProofParallax();
    }

    function smoothPointer() {
        if (mouse.x < 0) {
            smoothMouse.x = -9999;
            smoothMouse.y = -9999;
            return;
        }
        const ease = useLiteStars() ? 0.08 : 0.18;
        smoothMouse.x += (mouse.x - smoothMouse.x) * ease;
        smoothMouse.y += (mouse.y - smoothMouse.y) * ease;
    }

    function sizeCanvases() {
        const rect = getCanvasHostRect();
        W = rect.width;
        H = rect.height;
        [starsCanvas, asteroidsCanvas].forEach((c) => {
            c.width = W * DPR;
            c.height = H * DPR;
            c.style.width = W + 'px';
            c.style.height = H + 'px';
            c.getContext('2d').setTransform(DPR, 0, 0, DPR, 0, 0);
        });
    }

    function heroPoint(e) {
        const r = useProofParallax() ? parallaxShell.getBoundingClientRect() : hero.getBoundingClientRect();
        mouse.x = e.clientX - r.left;
        mouse.y = e.clientY - r.top;
    }

    hero.addEventListener('pointermove', heroPoint, { passive: true });
    if (!isCoarsePointer) {
        asteroidsCanvas.addEventListener('pointermove', (e) => {
            heroPoint(e);
            tryBreakAt(mouse.x, mouse.y, true);
        }, { passive: true });
    }
    hero.addEventListener('pointerleave', () => {
        mouse.x = -9999;
        mouse.y = -9999;
    });
    asteroidsCanvas.addEventListener('pointerdown', (e) => {
        heroPoint(e);
        mouse.down = true;
        smoothMouse.x = mouse.x;
        smoothMouse.y = mouse.y;
        tryBreakAt(mouse.x, mouse.y, false);
    });
    if (isCoarsePointer) {
        asteroidsCanvas.addEventListener('touchstart', (e) => {
            if (!e.changedTouches[0]) return;
            const t = e.changedTouches[0];
            heroPoint(t);
            smoothMouse.x = mouse.x;
            smoothMouse.y = mouse.y;
            tryBreakAt(mouse.x, mouse.y, false);
        }, { passive: true });
    }
    window.addEventListener('resize', () => {
        syncParallaxMode();
        sizeCanvases();
        buildStars();
        requestAnimationFrame(() => {
            updateLayoutMetrics();
            syncLayoutFit();
        });
    });

    /* ── Cutout collision mask ── */
    let maskCanvas = null;
    let maskCtx = null;
    let maskRect = { x: 0, y: 0, w: 0, h: 0 };

    function updateLayoutMetrics() {
        buildCollisionMask();
    }

    function buildCollisionMask() {
        if (!cutoutImg.complete || !cutoutImg.naturalWidth) return;
        const imgR = cutoutImg.getBoundingClientRect();
        const heroR = hero.getBoundingClientRect();
        maskRect = {
            x: imgR.left - heroR.left,
            y: imgR.top - heroR.top,
            w: imgR.width,
            h: imgR.height,
        };
        if (!maskCanvas) {
            maskCanvas = document.createElement('canvas');
            maskCtx = maskCanvas.getContext('2d', { willReadFrequently: true });
        }
        maskCanvas.width = Math.max(1, Math.round(maskRect.w));
        maskCanvas.height = Math.max(1, Math.round(maskRect.h));
        maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
        maskCtx.drawImage(cutoutImg, 0, 0, maskCanvas.width, maskCanvas.height);
    }

    function hitsCutout(px, py, radius) {
        if (!maskCtx || maskRect.w < 1) return false;
        const lx = ((px - maskRect.x) / maskRect.w) * maskCanvas.width;
        const ly = ((py - maskRect.y) / maskRect.h) * maskCanvas.height;
        if (lx < -radius || ly < -radius || lx > maskCanvas.width + radius || ly > maskCanvas.height + radius) {
            return false;
        }
        const samples = 8;
        for (let i = 0; i < samples; i++) {
            const ang = (i / samples) * Math.PI * 2;
            const sx = Math.round(lx + Math.cos(ang) * radius);
            const sy = Math.round(ly + Math.sin(ang) * radius);
            if (sx < 0 || sy < 0 || sx >= maskCanvas.width || sy >= maskCanvas.height) continue;
            const a = maskCtx.getImageData(sx, sy, 1, 1).data[3];
            if (a > 90) return true;
        }
        const cx = Math.round(lx);
        const cy = Math.round(ly);
        if (cx >= 0 && cy >= 0 && cx < maskCanvas.width && cy < maskCanvas.height) {
            return maskCtx.getImageData(cx, cy, 1, 1).data[3] > 90;
        }
        return false;
    }

    function sampleAlpha(lx, ly) {
        const sx = Math.round(lx);
        const sy = Math.round(ly);
        if (sx < 0 || sy < 0 || sx >= maskCanvas.width || sy >= maskCanvas.height) return 0;
        return maskCtx.getImageData(sx, sy, 1, 1).data[3];
    }

    function getCutoutNormal(px, py) {
        const lx = ((px - maskRect.x) / maskRect.w) * maskCanvas.width;
        const ly = ((py - maskRect.y) / maskRect.h) * maskCanvas.height;
        let gx = 0;
        let gy = 0;
        const step = 4;
        for (let ox = -2; ox <= 2; ox++) {
            for (let oy = -2; oy <= 2; oy++) {
                if (!ox && !oy) continue;
                const a = sampleAlpha(lx + ox * step, ly + oy * step);
                const center = sampleAlpha(lx, ly);
                const diff = center - a;
                gx += ox * diff;
                gy += oy * diff;
            }
        }
        let nx = -gx;
        let ny = -gy;
        let len = Math.hypot(nx, ny);
        if (len < 0.01) {
            const cx = maskRect.x + maskRect.w * 0.42;
            const cy = maskRect.y + maskRect.h * 0.55;
            nx = px - cx;
            ny = py - cy;
            len = Math.hypot(nx, ny) || 1;
        }
        return { nx: nx / len, ny: ny / len };
    }

    function bounceOffCutout(rock) {
        if (rock.bounceCd > 0) {
            rock.bounceCd -= 1;
            return;
        }
        if (!hitsCutout(rock.x, rock.y, rock.r)) return;

        const { nx, ny } = getCutoutNormal(rock.x, rock.y);
        const dot = rock.vx * nx + rock.vy * ny;
        if (dot > 0) return;

        const restitution = 0.78;
        rock.vx -= (1 + restitution) * dot * nx;
        rock.vy -= (1 + restitution) * dot * ny;

        const tx = -ny;
        const ty = nx;
        const tangentKick = (Math.random() - 0.5) * 1.4;
        const incomingSpeed = Math.hypot(rock.vx, rock.vy);
        rock.vx += tx * tangentKick + nx * 0.25;
        rock.vy += ty * tangentKick + ny * 0.25;

        const minOut = 0.55 + incomingSpeed * 0.15;
        const outSpeed = Math.hypot(rock.vx, rock.vy);
        if (outSpeed < minOut) {
            const scale = minOut / Math.max(outSpeed, 0.001);
            rock.vx *= scale;
            rock.vy *= scale;
        }

        const push = 14 + rock.r * 0.7;
        rock.x += nx * push;
        rock.y += ny * push;

        if (rock.lastNx != null && rock.lastNy != null) {
            const sameDir = rock.lastNx * nx + rock.lastNy * ny > 0.85;
            if (sameDir) {
                rock.vx += tx * (Math.random() > 0.5 ? 1.2 : -1.2);
                rock.vy += ty * (Math.random() > 0.5 ? 0.9 : -0.9);
            }
        }
        rock.lastNx = nx;
        rock.lastNy = ny;

        rock.bounceCd = 16;
    }

    /* ── Stars / particle network (WebTech ambient phase) ── */
    let stars = [];
    const STAR_COUNT = () => Math.min(120, Math.round((W * H) / 14000));

    function buildStars() {
        stars = [];
        const n = STAR_COUNT();
        for (let i = 0; i < n; i++) {
            const hx = Math.random() * W;
            const hy = Math.random() * H;
            stars.push({
                x: hx,
                y: hy,
                hx,
                hy,
                vx: 0,
                vy: 0,
                r: 1 + Math.random() * 1.6,
            });
        }
    }

    function drawStars(ctx, now) {
        smoothPointer();
        const mx = smoothMouse.x;
        const my = smoothMouse.y;
        const lite = useLiteStars();
        const driftX = lite ? 0.06 : 0.18;
        const driftY = lite ? 0.05 : 0.14;

        stars.forEach((p) => {
            p.vx += (p.hx - p.x) * 0.004;
            p.vy += (p.hy - p.y) * 0.004;
            if (!lite && mx > 0) {
                const dx = p.x - mx;
                const dy = p.y - my;
                const d2 = dx * dx + dy * dy;
                if (d2 < 13000) {
                    const d = Math.sqrt(d2) || 1;
                    const f = ((114 - d) / 114) * 2.2;
                    p.vx += (dx / d) * f;
                    p.vy += (dy / d) * f;
                }
            }
            p.vx *= 0.9;
            p.vy *= 0.9;
            p.x += p.vx + Math.sin(now * 0.0004 + p.hy) * driftX;
            p.y += p.vy + Math.cos(now * 0.0005 + p.hx) * driftY;
        });

        if (!lite && mx > 0) {
            for (let i = 0; i < stars.length; i += 5) {
                const p = stars[i];
                const d = Math.hypot(p.x - mx, p.y - my);
                if (d < 160) {
                    ctx.strokeStyle = `rgba(${GREEN_RGB}, ${(1 - d / 160) * 0.35})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mx, my);
                    ctx.stroke();
                }
            }
        }

        stars.forEach((p) => {
            ctx.fillStyle = `rgba(${GREEN_RGB}, 0.45)`;
            ctx.shadowBlur = 8;
            ctx.shadowColor = GREEN;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.shadowBlur = 0;
    }

    /* ── Asteroids ── */
    let score = 100;
    let rocks = [];
    let spawnTimer = 0;

    function setScore(v) {
        score = v;
        if (scoreEl) scoreEl.textContent = String(score);
    }

    function makeRock(x, y, r, vx, vy, generation) {
        const verts = 8 + Math.floor(Math.random() * 4);
        const points = [];
        for (let i = 0; i < verts; i++) {
            const ang = (i / verts) * Math.PI * 2;
            const rad = r * (0.72 + Math.random() * 0.28);
            points.push({ x: Math.cos(ang) * rad, y: Math.sin(ang) * rad });
        }
        return {
            x: x ?? Math.random() * W,
            y: y ?? -40 - Math.random() * 80,
            r,
            vx: vx ?? (Math.random() - 0.5) * 0.6,
            vy: vy ?? 0.25 + Math.random() * 0.35,
            rot: Math.random() * Math.PI * 2,
            rotV: (Math.random() - 0.5) * 0.02,
            points,
            generation: generation ?? 0,
            id: Math.random(),
            bounceCd: 0,
            lastNx: null,
            lastNy: null,
        };
    }

    function spawnRock() {
        if (rocks.length > 14) return;
        rocks.push(makeRock(Math.random() * W, -30 - Math.random() * 60, 22 + Math.random() * 26, null, null, 0));
    }

    function breakRock(rock, hitX, hitY) {
        if (rock.generation >= 2) {
            rocks = rocks.filter((r) => r.id !== rock.id);
            setScore(score + 10);
            return;
        }
        rocks = rocks.filter((r) => r.id !== rock.id);
        const newR = rock.r * 0.52;
        const angle = Math.atan2(rock.y - hitY, rock.x - hitX);
        const speed = Math.min(1.1 + Math.random() * 0.4, 1.35);
        rocks.push(
            makeRock(rock.x, rock.y, newR, Math.cos(angle) * speed, Math.sin(angle) * speed - 0.2, rock.generation + 1),
            makeRock(rock.x, rock.y, newR, Math.cos(angle + 1.2) * speed, Math.sin(angle + 1.2) * speed - 0.2, rock.generation + 1),
            makeRock(rock.x, rock.y, newR, Math.cos(angle - 1.2) * speed, Math.sin(angle - 1.2) * speed - 0.2, rock.generation + 1)
        );
    }

    let hoveredRockId = null;

    function tryBreakAt(x, y, onHoverEnter) {
        let hit = null;
        let bestD = Infinity;
        rocks.forEach((rock) => {
            const d = Math.hypot(rock.x - x, rock.y - y);
            if (d < rock.r + 14 && d < bestD) {
                bestD = d;
                hit = rock;
            }
        });
        if (!hit) {
            hoveredRockId = null;
            return;
        }
        if (onHoverEnter) {
            if (hoveredRockId === hit.id) return;
            hoveredRockId = hit.id;
        }
        breakRock(hit, x, y);
    }

    function drawRock(ctx, rock) {
        ctx.save();
        ctx.translate(rock.x, rock.y);
        ctx.rotate(rock.rot);
        ctx.strokeStyle = GREEN;
        ctx.lineWidth = 1.6;
        ctx.shadowBlur = 10;
        ctx.shadowColor = GREEN;
        ctx.fillStyle = `rgba(${GREEN_RGB}, 0.12)`;
        ctx.beginPath();
        rock.points.forEach((pt, i) => {
            if (i === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
        ctx.shadowBlur = 0;
    }

    function updateAsteroids(ctx, dt) {
        spawnTimer += dt;
        if (spawnTimer > 2800 && !reducedMotion) {
            spawnTimer = 0;
            spawnRock();
        }

        rocks.forEach((rock) => {
            rock.x += rock.vx;
            rock.y += rock.vy;
            rock.rot += rock.rotV;
            rock.vy += 0.008;

            if (rock.x < rock.r) {
                rock.x = rock.r;
                rock.vx = Math.abs(rock.vx) * 0.85;
            } else if (rock.x > W - rock.r) {
                rock.x = W - rock.r;
                rock.vx = -Math.abs(rock.vx) * 0.85;
            }
            if (rock.y < -rock.r * 2) rock.vy = Math.abs(rock.vy);

            rock.vx = Math.max(-1.4, Math.min(1.4, rock.vx));
            rock.vy = Math.max(-1.2, Math.min(2.2, rock.vy));

            bounceOffCutout(rock);

            if (rock.y - rock.r > H) {
                setScore(score - 10);
                rocks = rocks.filter((r) => r.id !== rock.id);
            }
        });

        if (mouse.x > 0 && mouse.y > 0 && mouse.down) {
            tryBreakAt(mouse.x, mouse.y, false);
        }
        mouse.down = false;

        rocks.forEach((rock) => drawRock(ctx, rock));
    }

    /* ── Main loop ── */
    let last = performance.now();

    function loop(now) {
        const dt = now - last;
        last = now;

        if (W < 1 || H < 1) {
            requestAnimationFrame(loop);
            return;
        }

        const sctx = starsCanvas.getContext('2d');
        sctx.clearRect(0, 0, W, H);
        if (!reducedMotion) drawStars(sctx, now);

        const actx = asteroidsCanvas.getContext('2d');
        actx.clearRect(0, 0, W, H);
        if (!reducedMotion) updateAsteroids(actx, dt);

        updateProofParallax();

        requestAnimationFrame(loop);
    }

    syncParallaxMode();
    initProofParallax();
    ensurePageScroll();
    sizeCanvases();
    buildStars();
    requestAnimationFrame(loop);

    function boot() {
        syncParallaxMode();
        sizeCanvases();
        buildStars();
        syncNavHeight();
        updateLayoutMetrics();
        syncLayoutFit();
        for (let i = 0; i < 4; i++) spawnRock();
    }

    if (cutoutImg.complete) boot();
    else cutoutImg.addEventListener('load', boot);
    cutoutImg.addEventListener('load', updateLayoutMetrics);
    window.addEventListener('load', () => {
        updateLayoutMetrics();
        ensurePageScroll();
    });
    if (typeof ResizeObserver !== 'undefined') {
        const ro = new ResizeObserver(() => requestAnimationFrame(() => {
            updateLayoutMetrics();
            syncLayoutFit();
        }));
        ro.observe(cutoutImg);
        ro.observe(hero);
        const wrapper = hero.querySelector('.hero-content-wrapper');
        const layout = hero.querySelector('.hero-layout');
        if (wrapper) ro.observe(wrapper);
        if (layout) ro.observe(layout);
    }
})();
