(() => {
    const header = document.querySelector('.site-header');
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Header glass effect while scrolling
    const updateHeader = () => {
        if (header) header.classList.toggle('scrolled', window.scrollY > 16);
    };
    updateHeader();
    window.addEventListener('scroll', updateHeader, {passive: true});

    // Mobile navigation
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            const isOpen = menuToggle.getAttribute('aria-expanded') !== 'true';
            menuToggle.setAttribute('aria-expanded', String(isOpen));
            mainNav.classList.toggle('open', isOpen);
        });

        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.setAttribute('aria-expanded', 'false');
                mainNav.classList.remove('open');
            });
        });
    }

    // Reveal sections as they enter the viewport
    const revealItems = document.querySelectorAll('.reveal, .post-card');
    if ('IntersectionObserver' in window && !reduceMotion) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {threshold: 0.12});

        revealItems.forEach(item => observer.observe(item));
    } else {
        revealItems.forEach(item => item.classList.add('revealed'));
    }

    // Featured-post slider
    const slides = Array.from(document.querySelectorAll('.featured-card'));
    const previous = document.getElementById('sliderPrev');
    const next = document.getElementById('sliderNext');
    const currentLabel = document.getElementById('sliderCurrent');
    const progressBar = document.getElementById('sliderProgressBar');
    const slider = document.getElementById('featuredSlider');
    let activeIndex = 0;
    let intervalId = null;
    let progressFrame = null;
    let startedAt = 0;
    const duration = 5000;

    function updateProgress() {
        if (!progressBar || reduceMotion || document.hidden || slides.length < 2) return;
        const elapsed = (performance.now() - startedAt) % duration;
        progressBar.style.width = `${(elapsed / duration) * 100}%`;
        progressFrame = requestAnimationFrame(updateProgress);
    }

    function showSlide(index, resetTimer = true) {
        if (!slides.length) return;

        activeIndex = (index + slides.length) % slides.length;
        slides.forEach((slide, i) => {
            slide.classList.toggle('is-active', i === activeIndex);
            slide.setAttribute('aria-hidden', String(i !== activeIndex));
        });

        if (currentLabel) {
            currentLabel.textContent = String(activeIndex + 1).padStart(2, '0');
        }

        if (progressBar) progressBar.style.width = '0%';

        if (resetTimer) startSlider();
    }

    function startSlider() {
        if (intervalId) window.clearInterval(intervalId);
        if (progressFrame) cancelAnimationFrame(progressFrame);
        intervalId = null;
        progressFrame = null;

        if (slides.length < 2 || reduceMotion || document.hidden) return;

        startedAt = performance.now();
        intervalId = window.setInterval(() => {
            showSlide(activeIndex + 1);
        }, duration);

        progressFrame = requestAnimationFrame(updateProgress);
    }

    if (slides.length) {
        showSlide(0, false);

        previous?.addEventListener('click', () => showSlide(activeIndex - 1));
        next?.addEventListener('click', () => showSlide(activeIndex + 1));

        slider?.addEventListener('mouseenter', () => {
            if (intervalId) window.clearInterval(intervalId);
            intervalId = null;
            if (progressFrame) cancelAnimationFrame(progressFrame);
        });

        slider?.addEventListener('mouseleave', startSlider);

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                if (intervalId) window.clearInterval(intervalId);
                intervalId = null;
                if (progressFrame) cancelAnimationFrame(progressFrame);
            } else {
                startSlider();
            }
        });

        startSlider();
    }

    // Search against the actual backend endpoint: GET /posts/search?title=...
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const postsGrid = document.querySelector('.posts-grid');
    const latestHeading = document.querySelector('.latest-heading h2');
    const toast = document.getElementById('homeToast');
    let originalGrid = postsGrid ? postsGrid.innerHTML : '';
    let toastTimer = null;

    function showToast(message) {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('visible');
        window.clearTimeout(toastTimer);
        toastTimer = window.setTimeout(() => toast.classList.remove('visible'), 3000);
    }

    function escapeHtml(value) {
        return String(value ?? '').replace(/[&<>"']/g, char => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;',
            '"': '&quot;', "'": '&#39;'
        })[char]);
    }

    function renderSearchResults(posts, query) {
        if (!postsGrid) return;

        if (!posts.length) {
            postsGrid.innerHTML = '<div class="empty-state compact-empty">برای این عبارت نوشته‌ای پیدا نشد. عبارت دیگری رو امتحان کن.</div>';
        } else {
            postsGrid.innerHTML = posts.map(post => {
                const title = escapeHtml(post.title);
                const excerpt = escapeHtml(post.excerpt);
                const author = escapeHtml(post.authorName);
                const category = escapeHtml(post.categoryName);
                const date = post.publishedAt
                    ? escapeHtml(String(post.publishedAt).slice(0, 10).replaceAll('-', '/'))
                    : 'نوشتهٔ تازه';
                const image = post.image && post.image.length
                    ? `<img src="/posts/image/${Number(post.id)}" alt="${title}" loading="lazy">`
                    : `<div class="image-placeholder small-placeholder"><span class="placeholder-orbit"></span><span class="placeholder-star">✳</span><span class="placeholder-label">NEXORA</span></div>`;

                return `
                    <article class="post-card revealed">
                        <a class="post-cover" href="/post/${Number(post.id)}">
                            ${image}<span class="cover-arrow">↗</span>
                        </a>
                        <div class="post-card-body">
                            <div class="post-meta"><span class="meta-category">${category}</span><span class="meta-separator"></span><span>${date}</span></div>
                            <h3><a href="/post/${Number(post.id)}">${title}</a></h3>
                            <p>${excerpt}</p>
                            <div class="card-footer">
                                <span class="author-name"><span class="author-dot"></span>${author}</span>
                                <a href="/post/${Number(post.id)}" class="card-read" aria-label="خواندن نوشته">←</a>
                            </div>
                        </div>
                    </article>`;
            }).join('');
        }

        if (latestHeading) {
            latestHeading.innerHTML = `نتیجه‌های <span class="gradient-text">جست‌وجو</span>`;
        }

        document.querySelector('.pagination')?.setAttribute('hidden', 'hidden');
        document.getElementById('latest')?.scrollIntoView({behavior: reduceMotion ? 'auto' : 'smooth'});
        showToast(`نتیجهٔ جست‌وجو برای «${query}»`);
    }

    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', async event => {
            event.preventDefault();
            const query = searchInput.value.trim();
            if (!query) {
                searchInput.focus();
                showToast('اول عنوان یا بخشی از عنوان نوشته رو وارد کن.');
                return;
            }

            const submitButton = searchForm.querySelector('button');
            if (submitButton) submitButton.disabled = true;

            try {
                const response = await fetch(`/posts/search?title=${encodeURIComponent(query)}`, {
                    headers: {Accept: 'application/json'},
                    credentials: 'same-origin'
                });

                if (!response.ok) {
                    throw new Error('جست‌وجو انجام نشد.');
                }

                const results = await response.json();
                if (!Array.isArray(results)) {
                    throw new Error('پاسخ جست‌وجو قابل‌خواندن نیست.');
                }

                renderSearchResults(results, query);
            } catch (error) {
                showToast(error.message || 'اتصال به جست‌وجو برقرار نشد.');
            } finally {
                if (submitButton) submitButton.disabled = false;
            }
        });

        searchInput.addEventListener('input', () => {
            if (searchInput.value.trim() === '' && postsGrid && latestHeading?.textContent.includes('جست‌وجو')) {
                postsGrid.innerHTML = originalGrid;
                latestHeading.innerHTML = 'تازه‌ترین <span class="gradient-text">نوشته‌ها</span>';
                document.querySelector('.pagination')?.removeAttribute('hidden');
                window.location.reload();
            }
        });
    }

    // Category chips filter the latest cards by their displayed category name.
    document.querySelectorAll('.category-pill[data-category]').forEach(chip => {
        chip.addEventListener('click', event => {
            const category = chip.dataset.category;
            if (!postsGrid) return;

            const cards = Array.from(postsGrid.querySelectorAll('.post-card'));
            if (!cards.length) return;

            let visible = 0;
            cards.forEach(card => {
                const label = card.querySelector('.meta-category')?.textContent.trim();
                const match = label === category;
                card.hidden = !match;
                if (match) visible++;
            });

            if (latestHeading) {
                latestHeading.innerHTML = `نوشته‌های <span class="gradient-text">${escapeHtml(category)}</span>`;
            }
            if (visible === 0) {
                showToast('برای این دسته در صفحهٔ فعلی نوشته‌ای وجود نداره.');
            } else {
                document.getElementById('latest')?.scrollIntoView({behavior: reduceMotion ? 'auto' : 'smooth'});
            }
        });
    });

})();
