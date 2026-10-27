/* Knight Logics explainer pages: chapter / transcript links and ?t= deep links seek the video (Google key moments). */
(function () {
    var v = document.querySelector('#explainer-video video');
    if (!v) return;
    function seek(t, play) {
        function go() {
            try { v.currentTime = t; } catch (e) {}
            if (play) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        }
        if (v.readyState >= 1) go();
        else { v.addEventListener('loadedmetadata', go, { once: true }); if (v.preload === 'none') { v.preload = 'metadata'; v.load(); } }
    }
    var m = location.search.match(/[?&]t=(\d+(?:\.\d+)?)/) || location.hash.match(/#t=(\d+(?:\.\d+)?)/);
    if (m) {
        seek(parseFloat(m[1]), false);
        var fig = document.getElementById('explainer-video');
        if (fig && fig.scrollIntoView) setTimeout(function () { fig.scrollIntoView({ block: 'center' }); }, 300);
    }
    document.addEventListener('click', function (e) {
        var a = e.target.closest && e.target.closest('a[data-t]');
        if (!a) return;
        e.preventDefault();
        seek(parseFloat(a.getAttribute('data-t')) || 0, true);
        if (v.scrollIntoView) v.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (history.replaceState) history.replaceState(null, '', a.getAttribute('href'));
    });
})();
