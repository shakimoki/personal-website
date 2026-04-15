        const html = document.documentElement;
        const saved = localStorage.getItem('theme');
        if (saved) html.setAttribute('data-theme', saved);

        const translations = {
            en: {
                pageTitle: 'Alexei Morozov',
                displayName: 'Alexei Morozov',
                bio: 'crypto / investments / marketing',
                insightsLabel: 'insights',
                analysisTag: 'Analysis',
                btcDate: 'Mar 27, 2026',
                btcTitle: 'Bottom for BTC?',
                btcDesc: 'BTC accumulation zone forecast at $40-50K. On-chain metrics, Supply in Profit/Loss, and DCA strategy breakdown.',
                channelTag: 'Channel',
                channelTitle: 'Telegram Channel',
                channelDesc: 'Crypto forecasts, market analysis, and investment ideas. Join for regular updates.',
                supportLabel: 'support',
                modalWarning: 'Verify address and network before sending - transactions are irreversible.',
                copyAddress: 'Copy Address',
                copied: 'Copied',
                languageLabel: 'Choose language',
                languagesLabel: 'Languages',
                themeLabel: 'Toggle theme',
                closeQr: 'Close QR modal',
                copyFromQr: 'Copy address from QR',
                cookieTitle: 'We use cookies',
                cookieDesc: 'Analytics helps us improve the site. Necessary cookies store your theme and language preferences.',
                cookiePolicy: 'Privacy Policy',
                cookieAll: 'Accept all',
                cookieNecessary: 'Necessary only',
                cookieReject: 'Decline'
            },
            ru: {
                pageTitle: 'Алексей Морозов',
                displayName: 'Алексей Морозов',
                bio: 'крипто / инвестиции / маркетинг',
                insightsLabel: 'материалы',
                analysisTag: 'Разбор',
                btcDate: '27 мар 2026',
                btcTitle: 'Дно по BTC?',
                btcDesc: 'Прогноз зоны накопления BTC на $40-50K. Ончейн-метрики, Supply in Profit/Loss и разбор DCA-стратегии.',
                channelTag: 'Канал',
                channelTitle: 'Telegram-канал',
                channelDesc: 'Крипто-прогнозы, рыночная аналитика и инвестиционные идеи. Подписывайтесь, чтобы следить за обновлениями.',
                supportLabel: 'поддержать',
                modalWarning: 'Проверьте адрес и сеть перед отправкой - криптотранзакции необратимы.',
                copyAddress: 'Скопировать адрес',
                copied: 'Скопировано',
                languageLabel: 'Выбор языка',
                languagesLabel: 'Языки',
                themeLabel: 'Переключить тему',
                closeQr: 'Закрыть QR-код',
                copyFromQr: 'Скопировать адрес из QR-кода',
                cookieTitle: 'Мы используем cookies',
                cookieDesc: 'Аналитика помогает улучшать сайт. Необходимые cookies хранят настройки темы и языка.',
                cookiePolicy: 'Политика конфиденциальности',
                cookieAll: 'Принять все',
                cookieNecessary: 'Только необходимые',
                cookieReject: 'Отказаться'
            }
        };
        let currentLang = localStorage.getItem('lang') || 'en';
        function t(key) {
            return translations[currentLang]?.[key] || translations.en[key] || key;
        }
        function applyLanguage(lang) {
            currentLang = translations[lang] ? lang : 'en';
            html.lang = currentLang;
            localStorage.setItem('lang', currentLang);
            document.title = t('pageTitle');
            document.querySelectorAll('[data-i18n]').forEach((el) => {
                const key = el.dataset.i18n;
                el.textContent = t(key);
            });
            document.querySelectorAll('[data-i18n-aria-label]').forEach((el) => {
                const key = el.dataset.i18nAriaLabel;
                el.setAttribute('aria-label', t(key));
            });
            document.querySelectorAll('[data-lang-option]').forEach((button) => {
                const active = button.dataset.langOption === currentLang;
                button.classList.toggle('active', active);
                button.setAttribute('aria-pressed', active ? 'true' : 'false');
                button.setAttribute('aria-checked', active ? 'true' : 'false');
            });
            const typedName = document.getElementById('typed-name');
            if (typedName && !typedName.querySelector('.cursor')) typedName.textContent = t('displayName');
            const copyButton = document.getElementById('modalCopyBtn');
            if (copyButton) {
                copyButton.textContent = copyButton.classList.contains('copied') ? t('copied') : t('copyAddress');
            }
        }
        const languageToggle = document.querySelector('.language-toggle');
        const languageTrigger = document.getElementById('languageTrigger');
        function setLanguageMenuOpen(open) {
            if (!languageToggle || !languageTrigger) return;
            languageToggle.classList.toggle('open', open);
            languageTrigger.setAttribute('aria-expanded', open ? 'true' : 'false');
        }
        if (languageTrigger) {
            languageTrigger.addEventListener('click', (e) => {
                e.stopPropagation();
                setLanguageMenuOpen(!languageToggle.classList.contains('open'));
            });
        }
        document.querySelectorAll('[data-lang-option]').forEach((button) => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                applyLanguage(button.dataset.langOption);
                setLanguageMenuOpen(false);
            });
        });
        document.addEventListener('click', (e) => {
            if (languageToggle && !languageToggle.contains(e.target)) {
                setLanguageMenuOpen(false);
            }
        });
        applyLanguage(currentLang);

        document.getElementById('themeToggle').addEventListener('click', () => {
            const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
            initParticles();
        });

        // === TYPING ===
        const nameEl = document.getElementById('typed-name');
        let ci = 0;
        function renderTypedName(text, showCursor = true) {
            nameEl.textContent = text;
            if (showCursor) {
                const cursor = document.createElement('span');
                cursor.className = 'cursor';
                nameEl.appendChild(cursor);
            }
        }
        function typeChar() {
            const displayName = t('displayName');
            if (ci < displayName.length) {
                renderTypedName(displayName.slice(0, ci + 1));
                ci++;
                setTimeout(typeChar, 70 + Math.random() * 50);
            } else {
                setTimeout(() => { renderTypedName(t('displayName'), false); }, 2500);
            }
        }
        setTimeout(typeChar, 400);

        // === PRICES ===
        async function fetchPrices() {
            try {
                const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true');
                const d = await res.json();
                tick('btc', d.bitcoin); tick('eth', d.ethereum);
            } catch(e) {}
        }
        function tick(id, c) {
            if (!c) return;
            document.getElementById('price-'+id).textContent = '$'+c.usd.toLocaleString('en-US',{maximumFractionDigits:0});
            const ch = c.usd_24h_change;
            const el = document.getElementById('change-'+id);
            el.textContent = (ch>=0?'+':'')+ch.toFixed(1)+'%';
            el.className = 'change '+(ch>=0?'up':'down');
        }
        fetchPrices(); setInterval(fetchPrices, 60000);

        // === QR CANVAS RENDERER ===
        let qrModules = null;
        let qrModuleCount = 0;
        let qrMouseX = -1, qrMouseY = -1;
        let qrMouseLerpX = -1, qrMouseLerpY = -1;
        let qrHover = false;
        let trailFadeStart = 0;
        let qrMouseLastMoveTime = 0;
        let qrDisplaySize = 240;
        let qrAnimationFrame = null;
        let activeAddress = '';
        let qrCleanupTimer = null;
        let copyResetTimer = null;
        const SVG_NS = 'http://www.w3.org/2000/svg';
        const qrImage = document.getElementById('qrImage');
        const qrHolo = document.getElementById('qrHolo');
        const qrSvg = document.getElementById('qrSvg');
        const qrContainer = document.getElementById('qrContainer');
        const modalOverlay = document.getElementById('modalOverlay');
        const modalCard = document.getElementById('modalCard');
        const modalAddr = document.getElementById('modalAddr');
        const modalClose = document.getElementById('modalClose');
        const modalCopyBtn = document.getElementById('modalCopyBtn');
        const cryptoCards = document.querySelectorAll('.crypto-card');

        function setQRContainerFx(xPercent, yPercent, tiltXDeg, tiltYDeg) {
            qrContainer.style.setProperty('--qr-glow-x', `${xPercent}%`);
            qrContainer.style.setProperty('--qr-glow-y', `${yPercent}%`);
            qrContainer.style.setProperty('--qr-tilt-x', `${tiltXDeg}deg`);
            qrContainer.style.setProperty('--qr-tilt-y', `${tiltYDeg}deg`);
            qrContainer.style.setProperty('--qr-prism-opacity', qrHover ? '.46' : '.28');
            qrContainer.style.setProperty('--qr-colorize', qrHover ? '.05' : '.015');
            qrContainer.style.setProperty('--qr-color-strength', qrHover ? '1.08' : '1.02');
        }

        function resetQRInteraction() {
            qrHover = false;
            qrMouseX = -1;
            qrMouseY = -1;
            qrMouseLerpX = -1;
            qrMouseLerpY = -1;
            trailFadeStart = performance.now();
            setQRContainerFx(50, 50, 0, 0);
            qrContainer.style.setProperty('--qr-prism-opacity', '.28');
            qrContainer.style.setProperty('--qr-spin', '220deg');
            qrContainer.style.setProperty('--qr-colorize', '.015');
            qrContainer.style.setProperty('--qr-color-strength', '1.02');
            if (!qrModules) return;
            for (let r = 0; r < qrModuleCount; r++) {
                for (let c = 0; c < qrModuleCount; c++) {
                    qrModules[r][c].targetScale = 1;
                }
            }
        }


        function resizeQRDisplay(displaySize) {
            qrDisplaySize = displaySize;
            qrContainer.style.width = `${displaySize}px`;
            qrContainer.style.height = `${displaySize}px`;
            qrImage.width = displaySize;
            qrImage.height = displaySize;
            qrSvg.setAttribute('width', displaySize);
            qrSvg.setAttribute('height', displaySize);
            qrSvg.setAttribute('viewBox', `0 0 ${displaySize} ${displaySize}`);
        }

        function isFinderRegion(row, col, count) {
            return (row < 7 && col < 7) ||
                   (row < 7 && col >= count - 7) ||
                   (row >= count - 7 && col < 7);
        }

        function generateQR(text) {
            const qr = qrcode(0, 'M');
            qr.addData(text);
            qr.make();
            qrModuleCount = qr.getModuleCount();
            qrModules = [];
            qrSvg.replaceChildren();

            // Dome/fish-scale radial gradient per module
            const defs = document.createElementNS(SVG_NS, 'defs');
            const grad = document.createElementNS(SVG_NS, 'radialGradient');
            grad.setAttribute('id', 'qrDome');
            grad.setAttribute('cx', '35%');
            grad.setAttribute('cy', '28%');
            grad.setAttribute('r', '62%');
            const s0 = document.createElementNS(SVG_NS, 'stop');
            s0.setAttribute('offset', '0%');
            s0.setAttribute('stop-color', 'rgba(255,255,255,0.52)');
            const s1 = document.createElementNS(SVG_NS, 'stop');
            s1.setAttribute('offset', '100%');
            s1.setAttribute('stop-color', 'rgba(255,255,255,0)');
            grad.appendChild(s0);
            grad.appendChild(s1);
            defs.appendChild(grad);
            qrSvg.appendChild(defs);

            const bg = document.createElementNS(SVG_NS, 'rect');
            bg.setAttribute('x', '0');
            bg.setAttribute('y', '0');
            bg.setAttribute('width', qrDisplaySize);
            bg.setAttribute('height', qrDisplaySize);
            bg.setAttribute('rx', '20');
            bg.setAttribute('ry', '20');
            qrSvg.appendChild(bg);

            const count = qrModuleCount;
            for (let r = 0; r < count; r++) {
                qrModules[r] = [];
                for (let c = 0; c < count; c++) {
                    const filled = qr.isDark(r, c);
                    const isFinder = isFinderRegion(r, c, count);
                    let element = null;
                    let dome = null;
                    if (filled) {
                        element = document.createElementNS(SVG_NS, isFinder ? 'rect' : 'circle');
                        qrSvg.appendChild(element);
                        // Dome highlight overlay
                        dome = document.createElementNS(SVG_NS, isFinder ? 'rect' : 'circle');
                        dome.setAttribute('fill', 'url(#qrDome)');
                        dome.setAttribute('pointer-events', 'none');
                        qrSvg.appendChild(dome);
                    }
                    qrModules[r][c] = { filled, isFinder, element, dome, scale: 1, targetScale: 1, lastHue: 0, hasColor: false };
                }
            }
        }

        function drawQRFrame() {
            if (!qrModules) return;
            const size = qrDisplaySize;
            const padding = 16;
            const drawSize = size - padding * 2;
            const cellSize = drawSize / qrModuleCount;
            const isLight = html.getAttribute('data-theme') === 'light';
            // bg is children[1] (children[0] = defs)
            const bg = qrSvg.children[1];

            const baseR = cellSize * 0.39; // circle radius for data dots
            const count = qrModuleCount;
            const dotColor = isLight ? '#29234d' : '#f0f0f5';
            const bgColor = isLight ? '#f2f4ff' : '#0e0e12';

            // Update bg fill
            if (bg) {
                bg.setAttribute('fill', bgColor);
                bg.setAttribute('width', size);
                bg.setAttribute('height', size);
            }

            const now = performance.now();
            const trailDuration = 2000;
            // shrinkFade: 1 while moving, fades to 0 over 500ms after 1.5s of stillness
            const stillAge = Math.max(0, now - qrMouseLastMoveTime - 1500);
            const shrinkFade = (qrHover && qrMouseLerpX >= 0) ? Math.max(0, 1 - stillAge / 500) : 0;

            for (let r = 0; r < count; r++) {
                for (let c = 0; c < count; c++) {
                    const mod = qrModules[r][c];

                    // Smooth scale lerp — snappier
                    mod.scale += (mod.targetScale - mod.scale) * 0.22;

                    const cx = padding + c * cellSize + cellSize / 2;
                    const cy = padding + r * cellSize + cellSize / 2;
                    const s = mod.scale;

                    if (!mod.filled) continue;

                    if (qrHover && qrMouseLerpX >= 0) {
                        const dx = cx - qrMouseLerpX;
                        const dy = cy - qrMouseLerpY;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        // Color trail
                        const glowR = cellSize * 3.2;
                        if (dist < glowR) {
                            const angle = Math.atan2(dy, dx);
                            mod.lastHue = ((angle / Math.PI * 180) + 360 + dist * 1.6) % 360;
                            mod.hasColor = true;
                            mod.coloredAt = now;
                        }
                        // Shrink: tight radius (~2 cells), deep crush to 0.05, fades when still
                        const shrinkR = cellSize * 4.0;
                        const rawScale = Math.max(0.05, Math.min(1, dist / shrinkR));
                        mod.targetScale = shrinkFade > 0 ? 1 - (1 - rawScale) * shrinkFade : 1;
                    } else {
                        mod.targetScale = 1;
                    }

                    let color;
                    if (mod.hasColor) {
                        // Dots near current lerped cursor stay fully bright
                        const nearCursor = qrHover && qrMouseLerpX >= 0 &&
                            Math.sqrt((cx - qrMouseLerpX) ** 2 + (cy - qrMouseLerpY) ** 2) < cellSize * 3.2;
                        if (nearCursor) {
                            color = isLight
                                ? `hsl(${mod.lastHue},72%,36%)`
                                : `hsl(${mod.lastHue},100%,78%)`;
                        } else {
                            // Fade each dot individually from when it was last colored
                            const age = now - (mod.coloredAt || trailFadeStart);
                            if (age < trailDuration) {
                                const fade = Math.sqrt(1 - age / trailDuration);
                                color = isLight
                                    ? `hsl(${mod.lastHue},${Math.round(68 * fade)}%,${Math.round(32 + 10 * fade)}%)`
                                    : `hsl(${mod.lastHue},${Math.round(100*fade)}%,${Math.round(96-16*fade)}%)`;
                            } else {
                                mod.hasColor = false;
                                color = dotColor;
                            }
                        }
                    } else {
                        color = dotColor;
                    }

                    if (mod.isFinder) {
                        const w = cellSize * s;
                        const rx = w * 0.22;
                        mod.element.setAttribute('x', cx - w / 2);
                        mod.element.setAttribute('y', cy - w / 2);
                        mod.element.setAttribute('width', w);
                        mod.element.setAttribute('height', w);
                        mod.element.setAttribute('rx', rx);
                        mod.element.setAttribute('ry', rx);
                        mod.element.setAttribute('fill', color);
                        mod.dome.setAttribute('x', cx - w / 2);
                        mod.dome.setAttribute('y', cy - w / 2);
                        mod.dome.setAttribute('width', w);
                        mod.dome.setAttribute('height', w);
                        mod.dome.setAttribute('rx', rx);
                        mod.dome.setAttribute('ry', rx);
                    } else {
                        const rad = baseR * s;
                        mod.element.setAttribute('cx', cx);
                        mod.element.setAttribute('cy', cy);
                        mod.element.setAttribute('r', rad);
                        mod.element.setAttribute('fill', color);
                        mod.dome.setAttribute('cx', cx);
                        mod.dome.setAttribute('cy', cy);
                        mod.dome.setAttribute('r', rad);
                    }
                }
            }
        }

        function tickQRAnimation() {
            if (!modalOverlay.classList.contains('active') && qrCleanupTimer === null) {
                qrAnimationFrame = null;
                return;
            }
            const spin = (performance.now() * 0.015) % 360;
            qrContainer.style.setProperty('--qr-spin', `${spin}deg`);
            // Lerp mouse toward real position for trail smear effect
            if (qrHover && qrMouseX >= 0) {
                if (qrMouseLerpX < 0) { qrMouseLerpX = qrMouseX; qrMouseLerpY = qrMouseY; }
                qrMouseLerpX += (qrMouseX - qrMouseLerpX) * 0.09;
                qrMouseLerpY += (qrMouseY - qrMouseLerpY) * 0.09;
            } else {
                qrMouseLerpX = -1;
                qrMouseLerpY = -1;
            }
            if (qrModules) {
                drawQRFrame();
            }
            qrAnimationFrame = requestAnimationFrame(tickQRAnimation);
        }

        function startQRAnimation() {
            if (qrAnimationFrame !== null) {
                cancelAnimationFrame(qrAnimationFrame);
            }
            qrAnimationFrame = requestAnimationFrame(tickQRAnimation);
        }

        qrContainer.addEventListener('mousemove', (e) => {
            const rect = qrContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const xRatio = Math.max(0, Math.min(1, x / rect.width));
            const yRatio = Math.max(0, Math.min(1, y / rect.height));
            qrMouseX = x * (qrDisplaySize / rect.width);
            qrMouseY = y * (qrDisplaySize / rect.height);
            qrMouseLastMoveTime = performance.now();
            qrHover = true;
            setQRContainerFx(
                xRatio * 100,
                yRatio * 100,
                (xRatio - 0.5) * 9,
                (0.5 - yRatio) * 9
            );
            qrContainer.style.setProperty('--qr-spin', `${220 + xRatio * 18 - yRatio * 12}deg`);
        });

        qrContainer.addEventListener('mouseleave', resetQRInteraction);

        // === MODAL ===
        function openModal(coinName, network, addr) {
            if (qrCleanupTimer !== null) {
                clearTimeout(qrCleanupTimer);
                qrCleanupTimer = null;
            }
            resetCopyButton();
            document.getElementById('modalNetwork').textContent = network + ' \u00B7 ' + coinName;
            modalAddr.textContent = addr;
            activeAddress = addr;
            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';

            const displaySize = window.innerWidth < 500 ? 232 : 288;
            resizeQRDisplay(displaySize);
            generateQR(addr);
            qrSvg.style.display = 'block';
            qrImage.style.display = 'none';
            resetQRInteraction();
            startQRAnimation();
        }

        function closeModal(e) {
            if (e && e.target !== modalOverlay) return;
            modalOverlay.classList.remove('active');
            document.body.style.overflow = '';
            resetCopyButton();
            resetQRInteraction();
            if (qrCleanupTimer !== null) clearTimeout(qrCleanupTimer);
            qrCleanupTimer = window.setTimeout(() => {
                if (modalOverlay.classList.contains('active')) return;
                qrModules = null;
                activeAddress = '';
                qrImage.removeAttribute('src');
                qrImage.alt = '';
                qrHolo.style.webkitMaskImage = 'none';
                qrHolo.style.maskImage = 'none';
                if (qrAnimationFrame !== null) {
                    cancelAnimationFrame(qrAnimationFrame);
                    qrAnimationFrame = null;
                }
                qrCleanupTimer = null;
            }, 420);
        }
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

        cryptoCards.forEach((card) => {
            const openFromCard = () => openModal(card.dataset.coin, card.dataset.network, card.dataset.address);
            card.addEventListener('click', openFromCard);
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openFromCard();
                }
            });
        });

        modalOverlay.addEventListener('click', closeModal);
        modalCard.addEventListener('click', (e) => e.stopPropagation());
        modalClose.addEventListener('click', () => closeModal());
        modalCopyBtn.addEventListener('click', () => copyAddr(activeAddress));
        modalAddr.addEventListener('click', () => copyAddr(activeAddress));
        modalAddr.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                copyAddr(activeAddress);
            }
        });
        qrContainer.addEventListener('click', () => copyAddr(activeAddress));
        qrContainer.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                copyAddr(activeAddress);
            }
        });

        // === COPY ===
        function resetCopyButton() {
            if (copyResetTimer !== null) {
                clearTimeout(copyResetTimer);
                copyResetTimer = null;
            }
            modalCopyBtn.classList.remove('copied');
            modalCopyBtn.textContent = t('copyAddress');
        }

        function copyAddr(addr) {
            if (!addr) return;
            const showCopiedState = () => {
                modalCopyBtn.classList.add('copied');
                modalCopyBtn.textContent = t('copied');
                if (copyResetTimer !== null) clearTimeout(copyResetTimer);
                copyResetTimer = setTimeout(() => {
                    modalCopyBtn.classList.remove('copied');
                    modalCopyBtn.textContent = t('copyAddress');
                    copyResetTimer = null;
                }, 2200);
            };

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(addr).then(showCopiedState).catch(() => {
                    const fallback = document.createElement('textarea');
                    fallback.value = addr;
                    fallback.setAttribute('readonly', '');
                    fallback.style.position = 'absolute';
                    fallback.style.left = '-9999px';
                    document.body.appendChild(fallback);
                    fallback.select();
                    document.execCommand('copy');
                    document.body.removeChild(fallback);
                    showCopiedState();
                });
                return;
            }

            const fallback = document.createElement('textarea');
            fallback.value = addr;
            fallback.setAttribute('readonly', '');
            fallback.style.position = 'absolute';
            fallback.style.left = '-9999px';
            document.body.appendChild(fallback);
            fallback.select();
            document.execCommand('copy');
            document.body.removeChild(fallback);
            showCopiedState();
        }

        // === PARTICLES (brighter) ===
        const pCanvas = document.getElementById('particles');
        const pCtx = pCanvas.getContext('2d');
        let particles = [];

        function resize() { pCanvas.width = window.innerWidth; pCanvas.height = window.innerHeight; }
        resize();
        window.addEventListener('resize', () => {
            resize();
            initParticles();
            if (modalOverlay.classList.contains('active') && activeAddress) {
                const displaySize = window.innerWidth < 500 ? 232 : 288;
                resizeQRDisplay(displaySize);
                drawQRFrame();
            }
        });

        function initParticles() {
            particles = [];
            const count = Math.floor((pCanvas.width * pCanvas.height) / 14000);
            for (let n = 0; n < count; n++) {
                particles.push({
                    x: Math.random() * pCanvas.width,
                    y: Math.random() * pCanvas.height,
                    r: Math.random() * 1.8 + 0.5,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: (Math.random() - 0.5) * 0.3,
                    alpha: Math.random() * 0.45 + 0.15
                });
            }
        }
        initParticles();

        function drawParticles() {
            pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
            const isLight = html.getAttribute('data-theme') === 'light';
            const rgb = isLight ? '100,80,160' : '160,150,220';

            for (const p of particles) {
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0) p.x = pCanvas.width;
                if (p.x > pCanvas.width) p.x = 0;
                if (p.y < 0) p.y = pCanvas.height;
                if (p.y > pCanvas.height) p.y = 0;

                pCtx.beginPath();
                pCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                pCtx.fillStyle = `rgba(${rgb},${p.alpha})`;
                pCtx.fill();
            }

            for (let a = 0; a < particles.length; a++) {
                for (let b = a + 1; b < particles.length; b++) {
                    const dx = particles[a].x - particles[b].x;
                    const dy = particles[a].y - particles[b].y;
                    const dist = dx*dx + dy*dy;
                    if (dist < 12000) {
                        pCtx.beginPath();
                        pCtx.moveTo(particles[a].x, particles[a].y);
                        pCtx.lineTo(particles[b].x, particles[b].y);
                        pCtx.strokeStyle = `rgba(${rgb},${0.12 * (1 - dist/12000)})`;
                        pCtx.lineWidth = 0.5;
                        pCtx.stroke();
                    }
                }
            }
            requestAnimationFrame(drawParticles);
        }
        drawParticles();

        // === COOKIE CONSENT ===
        (function () {
            const banner  = document.getElementById('cookieBanner');
            const consent = localStorage.getItem('cookie_consent');

            function hideBanner() {
                banner.classList.add('hiding');
                setTimeout(() => { banner.hidden = true; }, 380);
            }

            if (!consent) {
                // Show after a short delay so page renders first
                setTimeout(() => { banner.hidden = false; }, 800);
            }

            document.getElementById('cookieAcceptAll').addEventListener('click', () => {
                localStorage.setItem('cookie_consent', 'all');
                hideBanner();
                if (typeof window.initMetrika === 'function') window.initMetrika();
            });

            document.getElementById('cookieNecessary').addEventListener('click', () => {
                localStorage.setItem('cookie_consent', 'necessary');
                hideBanner();
            });

            document.getElementById('cookieReject').addEventListener('click', () => {
                localStorage.setItem('cookie_consent', 'rejected');
                hideBanner();
            });
        })();
