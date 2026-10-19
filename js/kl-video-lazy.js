/* Knight Logics media helpers.
   1) Lazy autoplay for muted loop previews:
      <video muted loop playsinline preload="none" poster="..." data-kl-lazyplay> ... </video>
      Plays only while on screen; skipped for reduced-motion and Save-Data users (poster stays).
   2) Click-to-load YouTube embeds:
      <div class="kl-yt" data-yt-id="VIDEO_ID" data-yt-title="..."><button type="button">poster...</button></div>
      The YouTube player (and its cookies/JS) only loads after the visitor presses play. */
(function () {
    var vids = document.querySelectorAll('video[data-kl-lazyplay]');
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var saveData = navigator.connection && navigator.connection.saveData;
    if (vids.length && !reduce && !saveData && 'IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                var v = e.target;
                if (e.isIntersecting) {
                    if (v.preload === 'none') v.preload = 'auto';
                    var p = v.play();
                    if (p && p.catch) p.catch(function () {});
                } else if (!v.paused) {
                    v.pause();
                }
            });
        }, { rootMargin: '200px 0px', threshold: 0.15 });
        Array.prototype.forEach.call(vids, function (v) {
            v.muted = true;
            v.setAttribute('muted', '');
            io.observe(v);
        });
    }

    if (!document.querySelector('.kl-yt[data-yt-id]')) return;
    var warmed = false;
    function warm() {
        if (warmed) return;
        warmed = true;
        ['https://www.youtube-nocookie.com', 'https://i.ytimg.com', 'https://www.google.com'].forEach(function (h) {
            var l = document.createElement('link');
            l.rel = 'preconnect';
            l.href = h;
            l.crossOrigin = '';
            document.head.appendChild(l);
        });
    }
    function play(btn) {
        var box = btn.parentNode;
        var id = box && box.getAttribute('data-yt-id');
        if (!id || !/^[A-Za-z0-9_-]{11}$/.test(id)) return;
        var f = document.createElement('iframe');
        f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0&playsinline=1';
        f.title = box.getAttribute('data-yt-title') || 'YouTube video';
        f.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
        f.setAttribute('allowfullscreen', '');
        f.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
        box.replaceChild(f, btn);
        box.classList.add('is-playing');
        if (f.focus) f.focus();
    }
    document.addEventListener('pointerover', function (e) {
        if (e.target.closest && e.target.closest('.kl-yt')) warm();
    }, { passive: true });
    document.addEventListener('focusin', function (e) {
        if (e.target.closest && e.target.closest('.kl-yt')) warm();
    });
    document.addEventListener('click', function (e) {
        var btn = e.target.closest && e.target.closest('.kl-yt > button');
        if (btn) { e.preventDefault(); play(btn); }
    });
})();
