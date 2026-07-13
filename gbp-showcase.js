/**
 * GBP profile showcase — hydrates cards from data/gbp-showcase.json + data/gbp-ratings.json
 */
(function initGbpShowcase() {
    const ROOT_SEL = '[data-gbp-showcase]';

    function stars(rating) {
        const n = Math.max(0, Math.min(5, Number(rating) || 0));
        const full = Math.floor(n);
        const half = n - full >= 0.5 ? 1 : 0;
        let s = '';
        for (let i = 0; i < full; i++) s += '★';
        if (half) s += '½';
        while (s.length < 5) s += '☆';
        return s;
    }

    function formatReviews(count) {
        const n = Number(count) || 0;
        if (n === 0) return 'No public reviews yet';
        if (n === 1) return '1 review';
        return `${n.toLocaleString()} reviews`;
    }

    function sortProfiles(list, group, ratingsByKey) {
        const items = list.filter((p) => p.group === group.id && p.publicShowcase !== false);
        if (group.sortBy === 'reviewCountDesc') {
            return items.sort((a, b) => {
                const ac = ratingsByKey[a.key]?.reviewCount ?? -1;
                const bc = ratingsByKey[b.key]?.reviewCount ?? -1;
                return bc - ac;
            });
        }
        if (group.sortBy === 'launchDateDesc') {
            return items.sort((a, b) => {
                const ad = a.profileLaunchDate || '';
                const bd = b.profileLaunchDate || '';
                return bd.localeCompare(ad);
            });
        }
        return items;
    }

    function cardHtml(profile, ratingEntry) {
        const rating = ratingEntry?.ratingValue;
        const count = ratingEntry?.reviewCount;
        const status = ratingEntry?.status;
        const hasRating = rating != null && count != null && status !== 'missing-location-id';
        const ratingText = hasRating && Number(count) > 0
            ? `${Number(rating).toFixed(1)} · ${formatReviews(count)}`
            : (status === 'empty' || Number(count) === 0 ? 'Recently launched' : 'Syncing…');
        const starRow = hasRating && Number(count) > 0
            ? `<div class="gbp-showcase-card__stars" aria-label="${Number(rating).toFixed(1)} out of 5 stars, ${formatReviews(count)}">${stars(rating)}</div>`
            : '<div class="gbp-showcase-card__stars gbp-showcase-card__stars--pending" aria-hidden="true">☆☆☆☆☆</div>';
        const links = [];
        if (profile.caseStudy) links.push(`<a href="${profile.caseStudy}" class="gbp-showcase-card__link">Case study</a>`);
        if (profile.website) links.push(`<a href="${profile.website}" class="gbp-showcase-card__link" target="_blank" rel="noopener noreferrer">Website</a>`);
        const note = profile.note ? `<p class="gbp-showcase-card__note">${profile.note}</p>` : '';
        return `
            <article class="gbp-showcase-card" data-gbp-key="${profile.key}">
                <header class="gbp-showcase-card__head">
                    <h3 class="gbp-showcase-card__title">${profile.title}</h3>
                    <span class="gbp-showcase-card__category">${profile.category || ''}</span>
                </header>
                ${starRow}
                <p class="gbp-showcase-card__rating">${ratingText}</p>
                ${note}
                ${links.length ? `<div class="gbp-showcase-card__links">${links.join('')}</div>` : ''}
            </article>`;
    }

    async function loadJson(url) {
        const res = await fetch(`${url}?v=${Date.now()}`, { cache: 'no-store' });
        if (!res.ok) throw new Error(`Failed ${url}`);
        return res.json();
    }

    async function render(root) {
        const layout = root.dataset.gbpShowcaseLayout || 'grid';
        root.setAttribute('aria-busy', 'true');
        root.innerHTML = '<p class="gbp-showcase-loading">Loading managed profiles…</p>';

        let config;
        let ratingsPayload;
        try {
            [config, ratingsPayload] = await Promise.all([
                loadJson('/data/gbp-showcase.json'),
                loadJson('/data/gbp-ratings.json')
            ]);
        } catch (err) {
            console.warn('GBP showcase load failed:', err);
            root.innerHTML = '<p class="gbp-showcase-error">Profile data is temporarily unavailable. <a href="/website-growth-audit">Request a GBP audit</a> and we will review your profile live on the call.</p>';
            root.removeAttribute('aria-busy');
            return;
        }

        const ratingsByKey = ratingsPayload?.byKey || {};
        const groups = (config.groups || []).map((group) => {
            const profiles = sortProfiles(config.profiles || [], group, ratingsByKey);
            if (!profiles.length) return '';
            const cards = profiles.map((p) => cardHtml(p, ratingsByKey[p.key])).join('');
            return `
                <div class="gbp-showcase-group">
                    <div class="gbp-showcase-group__head">
                        <h3>${group.title}</h3>
                        <p>${group.subtitle || ''}</p>
                    </div>
                    <div class="gbp-showcase-${layout}">${cards}</div>
                </div>`;
        }).join('');

        root.innerHTML = groups || '<p class="gbp-showcase-error">No showcase profiles configured.</p>';
        root.removeAttribute('aria-busy');

        if (typeof window.klApplyGbpRatingPayload === 'function') {
            Object.keys(ratingsByKey).forEach((key) => {
                const entry = ratingsByKey[key];
                if (!entry || entry.ratingValue == null) return;
                window.klApplyGbpRatingPayload({
                    key,
                    ratingValue: entry.ratingValue,
                    reviewCount: entry.reviewCount
                });
            });
        }
    }

    function init() {
        document.querySelectorAll(ROOT_SEL).forEach((root) => render(root));
    }

    window.klInitGbpShowcase = init;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
