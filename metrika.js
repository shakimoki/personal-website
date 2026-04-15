// Yandex Metrica — loads only after explicit analytics consent
(function () {
    function loadYM() {
        if (window._ymLoaded) return;
        window._ymLoaded = true;
        (function (m, e, t, r, i, k, a) {
            m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); };
            m[i].l = 1 * new Date();
            for (var j = 0; j < e.scripts.length; j++) {
                if (e.scripts[j].src === r) return;
            }
            k = e.createElement(t);
            a = e.getElementsByTagName(t)[0];
            k.async = 1; k.src = r;
            a.parentNode.insertBefore(k, a);
        })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');

        ym(108566055, 'init', {
            id: 108566055,
            webvisor: true,
            clickmap: true,
            trackLinks: true,
            accurateTrackBounce: true,
        });
    }

    // Expose for cookie banner callback
    window.initMetrika = loadYM;

    // Auto-init if user already consented
    if (localStorage.getItem('cookie_consent') === 'all') {
        loadYM();
    }
})();
