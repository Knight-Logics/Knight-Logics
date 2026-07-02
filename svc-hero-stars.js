/**
 * Green particle stars for inner-page heroes — same ambient layer as the
 * landing hero (hero-experiment.js drawStars), without the Asteroids game.
 */
(function initSvcHeroStars() {
    const GREEN = '#64ffda';
    const GREEN_RGB = '100, 255, 218';
    const LINK_DIST = 132;
    const MOUSE_LINK_DIST = 180;
    const MOUSE_REPEL = 13000;
    const MOUSE_REPEL_R = 114;

    function starCount(w, h) {
        const byArea = Math.round((w * Math.max(h, 220)) / 8500);
        const byWidth = Math.round(w / 9);
        return Math.max(72, Math.min(200, Math.max(byArea, byWidth)));
    }

    function heroWidth(hero) {
        const rect = hero.getBoundingClientRect();
        const w = Math.round(rect.width || hero.offsetWidth || 0);
        if (w > 0) return w;
        return Math.round(document.documentElement.clientWidth || window.innerWidth || 1);
    }

    function mountStars(wrap, hero) {
        if (!wrap || wrap.dataset.starsInit === '1') return;
        const canvas = wrap.querySelector('.svc-hero-stars__canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let W = 0;
        let H = 0;
        let stars = [];
        let raf = 0;
        let running = true;
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const mouse = { x: -1, y: -1 };
        const smoothMouse = { x: -1, y: -1 };
        const actionsBar = hero.nextElementSibling?.classList?.contains('kl-hero-actions-bar')
            ? hero.nextElementSibling
            : null;

        wrap.dataset.starsInit = '1';

        function zoneHeight() {
            return hero.offsetHeight + (actionsBar ? actionsBar.offsetHeight : 0);
        }

        function getZoneRect() {
            const heroRect = hero.getBoundingClientRect();
            const barH = actionsBar ? actionsBar.offsetHeight : 0;
            return {
                left: heroRect.left,
                top: heroRect.top,
                width: heroRect.width,
                height: heroRect.height + barH,
            };
        }

        function pointerInZone(clientX, clientY) {
            const z = getZoneRect();
            return clientX >= z.left
                && clientX <= z.left + z.width
                && clientY >= z.top
                && clientY <= z.top + z.height;
        }

        function clientToCanvas(clientX, clientY) {
            const z = getZoneRect();
            return {
                x: clientX - z.left,
                y: clientY - z.top,
            };
        }

        function resize() {
            const w = heroWidth(hero);
            const h = zoneHeight();
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            W = Math.max(1, w);
            H = Math.max(1, Math.round(h));
            wrap.style.width = '100%';
            wrap.style.height = `${H}px`;
            canvas.width = Math.round(W * dpr);
            canvas.height = Math.round(H * dpr);
            canvas.style.width = `${W}px`;
            canvas.style.height = `${H}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            buildStars();
            if (reduced) drawStatic();
            else if (!raf && !document.hidden) raf = requestAnimationFrame(draw);
        }

        function buildStars() {
            stars = [];
            const n = reduced ? Math.min(48, starCount(W, H)) : starCount(W, H);
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
                    r: 0.9 + Math.random() * 2.1,
                    twinkle: Math.random() * Math.PI * 2,
                });
            }
        }

        function smoothPointer() {
            if (mouse.x < 0) {
                smoothMouse.x = -1;
                smoothMouse.y = -1;
                return;
            }
            smoothMouse.x += (mouse.x - smoothMouse.x) * 0.18;
            smoothMouse.y += (mouse.y - smoothMouse.y) * 0.18;
        }

        function updateStars(now) {
            const mx = smoothMouse.x;
            const my = smoothMouse.y;
            const driftX = reduced ? 0.04 : 0.18;
            const driftY = reduced ? 0.03 : 0.14;
            const t = now || 0;

            stars.forEach((p) => {
                p.vx += (p.hx - p.x) * 0.004;
                p.vy += (p.hy - p.y) * 0.004;
                if (!reduced && mx >= 0) {
                    const dx = p.x - mx;
                    const dy = p.y - my;
                    const d2 = dx * dx + dy * dy;
                    if (d2 < MOUSE_REPEL) {
                        const d = Math.sqrt(d2) || 1;
                        const f = ((MOUSE_REPEL_R - d) / MOUSE_REPEL_R) * 2.2;
                        p.vx += (dx / d) * f;
                        p.vy += (dy / d) * f;
                    }
                }
                p.vx *= 0.9;
                p.vy *= 0.9;
                p.x += p.vx + Math.sin(t * 0.0004 + p.hy) * driftX;
                p.y += p.vy + Math.cos(t * 0.0005 + p.hx) * driftY;
            });
        }

        function drawCursorGlow(mx, my) {
            if (mx < 0) return;
            const glow = ctx.createRadialGradient(mx, my, 0, mx, my, 96);
            glow.addColorStop(0, `rgba(${GREEN_RGB}, 0.14)`);
            glow.addColorStop(0.45, `rgba(${GREEN_RGB}, 0.05)`);
            glow.addColorStop(1, `rgba(${GREEN_RGB}, 0)`);
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(mx, my, 96, 0, Math.PI * 2);
            ctx.fill();
        }

        function drawLinks(mx, my) {
            for (let i = 0; i < stars.length; i++) {
                for (let j = i + 1; j < stars.length; j++) {
                    const a = stars[i];
                    const b = stars[j];
                    const d = Math.hypot(a.x - b.x, a.y - b.y);
                    if (d > LINK_DIST) continue;
                    const alpha = (1 - d / LINK_DIST) * 0.22;
                    ctx.strokeStyle = `rgba(${GREEN_RGB}, ${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }

            if (mx >= 0) {
                for (let i = 0; i < stars.length; i += 2) {
                    const p = stars[i];
                    const d = Math.hypot(p.x - mx, p.y - my);
                    if (d < MOUSE_LINK_DIST) {
                        ctx.strokeStyle = `rgba(${GREEN_RGB}, ${(1 - d / MOUSE_LINK_DIST) * 0.48})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(mx, my);
                        ctx.stroke();
                    }
                }
            }
        }

        function drawDots(now) {
            const t = now || 0;
            stars.forEach((p) => {
                const pulse = reduced ? 1 : 0.88 + Math.sin(t * 0.002 + p.twinkle) * 0.12;
                ctx.fillStyle = `rgba(${GREEN_RGB}, ${0.42 * pulse})`;
                ctx.shadowBlur = 12;
                ctx.shadowColor = GREEN;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r * pulse, 0, Math.PI * 2);
                ctx.fill();
            });
            ctx.shadowBlur = 0;
        }

        function drawFrame(now) {
            ctx.clearRect(0, 0, W, H);
            smoothPointer();
            if (!reduced) updateStars(now);
            drawCursorGlow(smoothMouse.x, smoothMouse.y);
            drawLinks(smoothMouse.x, smoothMouse.y);
            drawDots(now);
        }

        function drawStatic() {
            drawFrame(0);
        }

        function draw(now) {
            if (!running) return;
            drawFrame(now);
            raf = requestAnimationFrame(draw);
        }

        function onPointerMove(e) {
            if (!pointerInZone(e.clientX, e.clientY)) {
                if (mouse.x >= 0) {
                    mouse.x = -1;
                    mouse.y = -1;
                }
                return;
            }
            const pos = clientToCanvas(e.clientX, e.clientY);
            mouse.x = pos.x;
            mouse.y = pos.y;
        }

        function onPointerLeave() {
            mouse.x = -1;
            mouse.y = -1;
        }

        document.addEventListener('pointermove', onPointerMove, { passive: true });
        window.addEventListener('blur', onPointerLeave);
        hero.addEventListener('mouseleave', onPointerLeave);
        if (actionsBar) actionsBar.addEventListener('mouseleave', onPointerLeave);

        resize();
        if (!reduced) raf = requestAnimationFrame(draw);
        else drawStatic();

        const ro = typeof ResizeObserver !== 'undefined'
            ? new ResizeObserver(() => resize())
            : null;
        if (ro) {
            ro.observe(hero);
            if (actionsBar) ro.observe(actionsBar);
        } else {
            window.addEventListener('resize', resize);
        }

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                running = false;
                cancelAnimationFrame(raf);
                raf = 0;
            } else if (!reduced) {
                running = true;
                resize();
                raf = requestAnimationFrame(draw);
            }
        });

        wrap._klStarsResize = resize;
    }

    function injectStarsMarkup(hero) {
        if (hero.querySelector('.svc-hero-stars')) return;
        hero.insertAdjacentHTML('afterbegin', `
            <div class="svc-hero-stars" aria-hidden="true">
                <div class="svc-hero-stars__bg"></div>
                <canvas class="svc-hero-stars__canvas"></canvas>
            </div>`);
    }

    function findHeroInner(section) {
        const selectors = [
            '.svc-hero-inner',
            '.cs-hero-inner',
            '.profile-hero-inner',
            '.contact-page-hero-inner',
            '.videoforge-hero-copy',
            '.pixelforge-hero-copy',
            '.displayplus-hero-copy',
            '.ed-hero-copy',
            '.container > div',
        ];
        for (let i = 0; i < selectors.length; i++) {
            const node = section.querySelector(selectors[i]);
            if (node) return node;
        }
        return section.querySelector('.container');
    }

    function upgradeToStarsHero(section) {
        if (!section || section.dataset.starsUpgraded === '1') return;
        section.dataset.starsUpgraded = '1';
        section.classList.add('svc-hero', 'svc-hero--stars');
        section.classList.remove(
            'svc-hero--panels',
            'pricing-hero',
            'profile-hero',
            'cs-hero',
            'automation-hero',
            'referral-hero',
            'displayplus-hero',
            'videoforge-hero',
            'pixelforge-hero',
            'ed-hero'
        );
        section.removeAttribute('style');

        section.querySelectorAll('.hero-panels, .svc-hero-overlay').forEach((el) => el.remove());

        const inner = findHeroInner(section);
        if (inner && !inner.classList.contains('svc-hero-inner')) {
            inner.classList.add('svc-hero-inner', 'fade-in');
        }

        injectStarsMarkup(section);
        mountStars(section.querySelector('.svc-hero-stars'), section);
    }

    function initAll() {
        document.querySelectorAll('.svc-hero--stars').forEach((hero) => {
            injectStarsMarkup(hero);
            mountStars(hero.querySelector('.svc-hero-stars'), hero);
        });
    }

    window.klUpgradeHeroToStars = upgradeToStarsHero;
    window.klInitSvcHeroStars = initAll;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => requestAnimationFrame(initAll));
    } else {
        requestAnimationFrame(initAll);
    }
})();
