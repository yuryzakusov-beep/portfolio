import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'site.json'), 'utf8'));
const projects = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'projects.json'), 'utf8'));

function esc(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

const ICONS = {
  telegram: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.9 4.6c.3-1.2-.8-2.1-1.9-1.6L2.7 9.8c-1.2.5-1.1 2.2.1 2.6l4.4 1.4 1.7 5.3c.3 1 1.6 1.2 2.3.5l2.5-2.5 4.5 3.3c1 .7 2.4.2 2.6-1l1.1-14.8zM9.4 13.7l8.3-5.2-6.5 6.8-.3 3.1-1.5-4.7z"/></svg>`,
  bot: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 10h.01"/><path d="M12 10h.01"/><path d="M16 10h.01"/></svg>`,
  workflow: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="6" height="6" rx="1.5"/><rect x="15" y="3" width="6" height="6" rx="1.5"/><rect x="9" y="15" width="6" height="6" rx="1.5"/><path d="M6 9v2a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V9"/><path d="M12 13v2"/></svg>`,
  sparkles: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2z"/></svg>`,
  python: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/><line x1="14" y1="4" x2="10" y2="20"/></svg>`,
  crm: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/><path d="M15 4v16"/></svg>`,
  globe: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3.6 9h16.8"/><path d="M3.6 15h16.8"/><path d="M12 3a14 14 0 0 0 0 18"/><path d="M12 3a14 14 0 0 1 0 18"/></svg>`,
  arrowRight: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
  arrowLeft: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`,
  chevronRight: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`,
  external: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`
};

function renderHeader(basePrefix = '') {
  const homeHref = basePrefix ? `${basePrefix}index.html` : '#top';
  return `
  <header class="site-header">
    <div class="container header-inner">
      <a class="brand-logo" href="${homeHref}">
        <span class="brand-mark">ЮЗ</span>
        <span>${esc(site.brand.name)}</span>
      </a>
      <nav class="nav-links" aria-label="Основная навигация">
        <a class="${basePrefix ? '' : 'is-current'}" href="${basePrefix}index.html">Главная</a>
        <a href="${basePrefix}index.html#portfolio">Мои работы</a>
        <a href="${basePrefix}index.html#services">Чем могу помочь</a>
        <a href="${basePrefix}index.html#process">Как я работаю</a>
        <a href="${basePrefix}index.html#about">Обо мне</a>
        <a href="${basePrefix}index.html#contact">Обсудить задачу</a>
      </nav>
      <div class="header-actions">
        <button id="motionToggle" class="motion-toggle" type="button" aria-pressed="false" title="Уменьшить анимацию">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M10 9v6"/><path d="M14 9v6"/></svg>
          <span>Меньше анимации</span>
        </button>
        <a class="btn btn-coral btn-sm header-cta-desktop" href="${esc(site.brand.telegramUrl)}" target="_blank" rel="noopener noreferrer">
          ${ICONS.telegram}
          <span>Telegram</span>
        </a>
        <button id="burgerBtn" class="burger-btn" type="button" aria-label="Открыть меню" aria-expanded="false">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></svg>
        </button>
      </div>
    </div>
  </header>
  <div id="mobileMenu" class="mobile-menu" aria-label="Мобильное меню">
    <a href="${basePrefix}index.html">Главная</a>
    <a href="${basePrefix}index.html#portfolio">Мои работы</a>
    <a href="${basePrefix}index.html#services">Чем могу помочь</a>
    <a href="${basePrefix}index.html#process">Как я работаю</a>
    <a href="${basePrefix}index.html#about">Обо мне</a>
    <a href="${basePrefix}index.html#contact">Обсудить задачу</a>
    <a class="btn btn-primary" href="${esc(site.brand.telegramUrl)}" target="_blank" rel="noopener noreferrer" style="margin-top:8px;">
      ${ICONS.telegram}
      <span>Написать в Telegram (${esc(site.brand.telegramHandle)})</span>
    </a>
  </div>`;
}

function renderFooter(basePrefix = '') {
  return `
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <a class="footer-brand" href="${basePrefix}index.html">
            <span class="brand-mark">ЮЗ</span>
            <span>${esc(site.brand.name)}</span>
          </a>
          <p class="footer-about">${esc(site.brand.tagline)}. Понятные решения без лишней сложности и скрытых условий.</p>
          <a class="btn btn-coral btn-sm" href="${esc(site.brand.telegramUrl)}" target="_blank" rel="noopener noreferrer">
            ${ICONS.telegram}
            <span>Написать в Telegram</span>
          </a>
        </div>
        <div class="footer-col">
          <h4>Разделы сайта</h4>
          <ul>
            <li><a href="${basePrefix}index.html">Главная</a></li>
            <li><a href="${basePrefix}index.html#portfolio">Мои работы</a></li>
            <li><a href="${basePrefix}index.html#services">Чем могу помочь</a></li>
            <li><a href="${basePrefix}index.html#process">Как я работаю</a></li>
            <li><a href="${basePrefix}index.html#about">Обо мне</a></li>
            <li><a href="${basePrefix}index.html#contact">Обсудить задачу</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Направления</h4>
          <ul>
            <li><a href="${basePrefix}index.html#portfolio">ИИ-агенты и AIAA V47</a></li>
            <li><a href="${basePrefix}index.html#portfolio">Telegram-боты</a></li>
            <li><a href="${basePrefix}index.html#portfolio">Сценарии n8n и Make</a></li>
            <li><a href="${basePrefix}index.html#portfolio">CRM и обработка заявок</a></li>
            <li><a href="${basePrefix}index.html#portfolio">Python, API и таблицы</a></li>
            <li><a href="${basePrefix}index.html#portfolio">Современные сайты</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Контакты и площадки</h4>
          <ul>
            <li><a href="${esc(site.brand.telegramUrl)}" target="_blank" rel="noopener noreferrer">Telegram: ${esc(site.brand.telegramHandle)}</a></li>
            <li><a href="${esc(site.brand.channelUrl)}" target="_blank" rel="noopener noreferrer">Канал: ${esc(site.brand.channelLabel)}</a></li>
            <li><a href="${esc(site.brand.flUrl)}" target="_blank" rel="noopener noreferrer">Портфолио на FL.ru</a></li>
            <li><a href="${esc(site.brand.workzillaUrl)}" target="_blank" rel="noopener noreferrer">Профиль на Workzilla</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-disclaimer">
        Информация на сайте носит ознакомительный характер и не является публичной офертой. Итоговый объём, сроки и стоимость работ согласуются индивидуально после разбора задачи и проверки доступов.
      </div>
      <div class="footer-bottom">
        <div>© 2026 ${esc(site.brand.name)}. Все права защищены.</div>
        <div class="footer-bottom-links">
          <a href="${esc(site.brand.telegramUrl)}" target="_blank" rel="noopener noreferrer">Telegram: ${esc(site.brand.telegramHandle)}</a>
          <a href="${esc(site.brand.channelUrl)}" target="_blank" rel="noopener noreferrer">Канал: ${esc(site.brand.channelLabel)}</a>
          <a class="footer-top-link" href="#top">Наверх ↑</a>
        </div>
      </div>
    </div>
  </footer>`;
}

function renderLayout({ title, description, bodyHtml, basePrefix = '' }) {
  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${basePrefix}styles/main.css">
</head>
<body id="top">
  ${renderHeader(basePrefix)}
  <main>
    ${bodyHtml}
  </main>
  ${renderFooter(basePrefix)}
  <script src="${basePrefix}scripts/main.js" defer></script>
</body>
</html>`;
}

function renderProjectCard(p, basePrefix = '', isFeatured = false) {
  const detailUrl = `${basePrefix}projects/${p.slug}/index.html`;
  const cls = isFeatured ? 'featured-card' : 'project-card reveal';
  return `
  <article class="${cls}" data-categories="${esc(p.categories.join(','))}">
    <a class="card-media" href="${detailUrl}">
      <img src="${basePrefix}${esc(p.coverImage)}" alt="${esc(p.title)}" loading="lazy" width="640" height="400">
    </a>
    <div class="card-body">
      <div class="card-cat">${esc(p.categoryLabel)}</div>
      <h3 class="card-title"><a href="${detailUrl}">${esc(p.title)}</a></h3>
      <p class="card-problem">${esc(p.problem)}</p>
      <div class="card-benefit"><strong>Польза:</strong> ${esc(p.benefit)}</div>
      <div class="stack-tags">
        ${p.stack.slice(0, 4).map((t) => `<span class="stack-tag">${esc(t)}</span>`).join('')}
      </div>
      <div class="card-footer">
        <a class="card-link-main" href="${detailUrl}">Подробнее ${ICONS.arrowRight}</a>
        <a class="card-link-source" href="${esc(p.sourceUrl)}" target="_blank" rel="noopener noreferrer">Источник ${ICONS.external}</a>
      </div>
    </div>
  </article>`;
}

function buildHomePage() {
  const heroSlidesHtml = site.heroSlides.map((s, idx) => `
    <div class="hero-slide ${idx === 0 ? 'is-active' : ''}" aria-hidden="${idx === 0 ? 'false' : 'true'}">
      <div class="hero-media">
        <img src="${esc(s.image)}" alt="${esc(s.alt)}" ${idx === 0 ? 'fetchpriority="high"' : 'loading="lazy"'}>
      </div>
      <div class="hero-scrim" aria-hidden="true"></div>
      <div class="hero-inner">
        <div class="container">
          <div class="hero-content">
            <div class="hero-badge"><span class="hero-badge-dot"></span>${esc(s.badge)}</div>
            ${idx === 0 ? `<h1 class="hero-title">${esc(s.title)}</h1>` : `<h2 class="hero-title">${esc(s.title)}</h2>`}
            <p class="hero-subtitle">${esc(s.subtitle)}</p>
            <div class="hero-cta">
              <a class="btn btn-coral" href="#portfolio">Посмотреть мои работы ${ICONS.arrowRight}</a>
              <a class="btn btn-glass" href="#contact">${ICONS.telegram} Обсудить задачу</a>
            </div>
          </div>
        </div>
      </div>
    </div>`).join('');

  const heroDotsHtml = site.heroSlides.map((s, idx) => `
    <button class="hero-dot ${idx === 0 ? 'is-active' : ''}" type="button" aria-label="Слайд ${idx + 1}: ${esc(s.badge)}" aria-current="${idx === 0 ? 'true' : 'false'}">
      <span class="hero-dot-progress"></span>
    </button>`).join('');

  const featuredProjects = projects.filter((p) => p.featured);
  const categoryCounts = Object.fromEntries(
    site.categories.map((c) => [
      c.key,
      c.key === 'all' ? projects.length : projects.filter((p) => p.categories.includes(c.key)).length
    ])
  );

  const filterButtonsHtml = site.categories.map((c, idx) => `
    <button class="filter-btn ${idx === 0 ? 'is-active' : ''}" type="button" data-filter="${esc(c.key)}" aria-pressed="${idx === 0 ? 'true' : 'false'}">
      <span>${esc(c.label)}</span>
      <span class="filter-count">${categoryCounts[c.key]}</span>
    </button>`).join('');

  const servicesHtml = site.services.map((srv) => `
    <article class="service-card reveal">
      <div class="service-icon accent-${esc(srv.accent)}">${ICONS[srv.icon] || ICONS.sparkles}</div>
      <h3 class="service-title">${esc(srv.title)}</h3>
      <p class="service-problem">${esc(srv.problem)}</p>
      <p class="service-desc">${esc(srv.description)}</p>
    </article>`).join('');

  const processHtml = site.process.map((step) => `
    <article class="process-card reveal">
      <div class="process-step">${esc(step.step)}</div>
      <h3>${esc(step.title)}</h3>
      <p>${esc(step.description)}</p>
    </article>`).join('');

  const principlesHtml = site.about.principles.map((pr) => `
    <div class="principle-card">
      <h3>${esc(pr.title)}</h3>
      <p>${esc(pr.text)}</p>
    </div>`).join('');

  const bodyHtml = `
    <!-- 1. Главный экран (полноширинный) -->
    <section class="hero-section" aria-label="Главный экран">
      <div id="heroStage" class="hero-stage" tabindex="0" aria-roledescription="carousel" aria-label="Направления работы">
        <div class="hero-slides">
          ${heroSlidesHtml}
        </div>
        <div class="hero-controls-wrap">
          <div class="container">
            <div class="hero-controls">
              <div class="hero-dots" role="tablist" aria-label="Выбор слайда">
                ${heroDotsHtml}
              </div>
              <div class="hero-nav-group">
                <span id="heroCounter" class="hero-counter" aria-live="polite">1 / ${site.heroSlides.length}</span>
                <button id="heroPlayPause" class="hero-icon-btn" type="button" aria-label="Поставить на паузу" data-state="playing">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
                </button>
                <button id="heroPrev" class="hero-icon-btn" type="button" aria-label="Предыдущий слайд">${ICONS.arrowLeft}</button>
                <button id="heroNext" class="hero-icon-btn" type="button" aria-label="Следующий слайд">${ICONS.chevronRight}</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="facts-bar">
        <div class="container">
          <div class="facts-strip">
            <div class="fact-card">
              <div class="fact-num">${projects.length}</div>
              <div class="fact-label">Примеров работ</div>
              <div class="fact-sub">Реальные схемы, код и материалы из t.me/integrator_raboty</div>
            </div>
            <div class="fact-card">
              <div class="fact-num">6</div>
              <div class="fact-label">Направлений</div>
              <div class="fact-sub">ИИ-агенты, Telegram-боты, n8n, CRM, Python и сайты</div>
            </div>
            <div class="fact-card">
              <div class="fact-num">1–2 дня</div>
              <div class="fact-label">Быстрый пилот</div>
              <div class="fact-sub">Сначала проверяем задачу на малом объёме данных</div>
            </div>
            <div class="fact-card">
              <div class="fact-num">Telegram</div>
              <div class="fact-label">Прямая связь</div>
              <div class="fact-sub">Общаемся напрямую без посредников: @yury_zakusov</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Избранные работы (Карусель) -->
    <section class="section" aria-label="Избранные проекты">
      <div class="container">
        <div class="section-head">
          <div>
            <div class="section-eyebrow">Избранное</div>
            <h2 class="section-title">Ключевые работы и прототипы</h2>
            <p class="section-desc">Листайте подборку вправо или откройте любой проект, чтобы посмотреть разбор задачи, результат и реальные скриншоты.</p>
          </div>
          <div class="carousel-controls">
            <button id="featuredPrev" class="hero-icon-btn" type="button" aria-label="Прокрутить назад">${ICONS.arrowLeft}</button>
            <button id="featuredNext" class="hero-icon-btn" type="button" aria-label="Прокрутить вперёд">${ICONS.chevronRight}</button>
          </div>
        </div>
        <div id="featuredTrack" class="carousel-track">
          ${featuredProjects.map((p) => renderProjectCard(p, '', true)).join('')}
        </div>
      </div>
    </section>

    <!-- 2. Мои работы (Полная галерея с фильтрами) -->
    <section id="portfolio" class="section section-alt">
      <div class="container">
        <div class="section-head">
          <div>
            <div class="section-eyebrow">Портфолио</div>
            <h2 class="section-title">Мои работы по направлениям</h2>
            <p class="section-desc">Каждый проект открывается на отдельной странице с подробным разбором «проблема → решение → польза», честным статусом и ссылкой на первоисточник.</p>
          </div>
          <a class="btn btn-outline btn-sm" href="${esc(site.brand.channelUrl)}" target="_blank" rel="noopener noreferrer">
            Весь архив в Telegram ${ICONS.external}
          </a>
        </div>

        <div class="filter-bar" role="group" aria-label="Фильтр проектов по направлениям">
          ${filterButtonsHtml}
        </div>

        <div class="projects-grid">
          ${projects.map((p) => renderProjectCard(p, '', false)).join('')}
        </div>
      </div>
    </section>

    <!-- 3. Чем могу помочь -->
    <section id="services" class="section">
      <div class="container">
        <div class="section-head">
          <div>
            <div class="section-eyebrow">Услуги</div>
            <h2 class="section-title">Чем могу помочь вашему делу</h2>
            <p class="section-desc">Без сложных слов: просто покажите, на что у вас каждый день уходит больше всего времени, и мы соберём аккуратное решение.</p>
          </div>
        </div>
        <div class="services-grid">
          ${servicesHtml}
        </div>
      </div>
    </section>

    <!-- 4. Как я работаю -->
    <section id="process" class="section section-alt">
      <div class="container">
        <div class="section-head">
          <div>
            <div class="section-eyebrow">Порядок работы</div>
            <h2 class="section-title">Как мы приходим к результату</h2>
            <p class="section-desc">Простой и понятный маршрут: без сюрпризов, лишней переплаты и долгих переписок.</p>
          </div>
        </div>
        <div class="process-grid">
          ${processHtml}
        </div>
      </div>
    </section>

    <!-- 5. Обо мне -->
    <section id="about" class="section">
      <div class="container">
        <div class="section-head">
          <div>
            <div class="section-eyebrow">Обо мне</div>
            <h2 class="section-title">${esc(site.about.headline)}</h2>
          </div>
        </div>
        <div class="about-layout reveal">
          <div class="about-text">
            <p class="about-lead">${esc(site.about.lead)}</p>
            ${site.about.paragraphs.map((p) => `<p>${esc(p)}</p>`).join('')}
            <div class="about-links">
              <a class="btn btn-primary btn-sm" href="${esc(site.brand.channelUrl)}" target="_blank" rel="noopener noreferrer">
                ${ICONS.telegram} Канал «Интегратор мои работы»
              </a>
              <a class="btn btn-outline btn-sm" href="${esc(site.brand.flUrl)}" target="_blank" rel="noopener noreferrer">Кейс на FL.ru ${ICONS.external}</a>
              <a class="btn btn-outline btn-sm" href="${esc(site.brand.workzillaUrl)}" target="_blank" rel="noopener noreferrer">Профиль Workzilla ${ICONS.external}</a>
            </div>
          </div>
          <div class="principles-grid">
            ${principlesHtml}
          </div>
        </div>
      </div>
    </section>

    <!-- 6. Обсудить задачу -->
    <section id="contact" class="section section-alt">
      <div class="container">
        <div class="contact-box reveal">
          <div>
            <div class="section-eyebrow">Связаться</div>
            <h2 class="section-title">Обсудим вашу задачу в Telegram</h2>
            <p class="section-desc">Напишите пару строк о том, что хочется автоматизировать. Подскажу, как это лучше сделать, с чего начать и нужен ли короткий пилот.</p>
            <div class="contact-list">
              <a class="contact-pill" href="${esc(site.brand.telegramUrl)}" target="_blank" rel="noopener noreferrer">
                <div>
                  <div class="contact-pill-label">Личный Telegram для связи</div>
                  <div class="contact-pill-value">${esc(site.brand.telegramHandle)}</div>
                </div>
                <span class="btn btn-primary btn-sm">${ICONS.telegram} Написать</span>
              </a>
              <a class="contact-pill" href="${esc(site.brand.channelUrl)}" target="_blank" rel="noopener noreferrer">
                <div>
                  <div class="contact-pill-label">Telegram-канал с работами</div>
                  <div class="contact-pill-value">${esc(site.brand.channelLabel)}</div>
                </div>
                <span class="btn btn-outline btn-sm">Открыть ${ICONS.external}</span>
              </a>
            </div>
          </div>

          <div class="tg-composer">
            <h3>Собрать сообщение за 15 секунд</h3>
            <p class="tg-composer-sub">Выберите направление и напишите пару слов — откроется Telegram уже с готовым текстом.</p>
            <div class="topic-chips" role="group" aria-label="Выберите направление">
              <button class="topic-chip" type="button" data-topic="Telegram-бот">Telegram-бот</button>
              <button class="topic-chip" type="button" data-topic="Сценарий n8n / Make">n8n / Make</button>
              <button class="topic-chip" type="button" data-topic="ИИ-агент">ИИ-агент</button>
              <button class="topic-chip" type="button" data-topic="CRM и заявки">CRM и заявки</button>
              <button class="topic-chip" type="button" data-topic="Python-скрипт">Python-скрипт</button>
              <button class="topic-chip" type="button" data-topic="Сайт">Сайт</button>
            </div>
            <label for="tgMessageInput" class="sr-only">Коротко опишите задачу</label>
            <textarea id="tgMessageInput" class="composer-textarea" placeholder="Например: клиенты пишут вечером, нужно чтобы бот принимал заявку и отправлял её в Google Таблицу и менеджеру..."></textarea>
            <a id="tgComposerBtn" class="btn btn-coral" data-base-url="${esc(site.brand.telegramUrl)}" href="${esc(site.brand.telegramUrl)}" target="_blank" rel="noopener noreferrer" style="width:100%;">
              ${ICONS.telegram} Открыть Telegram с готовым текстом
            </a>
          </div>
        </div>
      </div>
    </section>
  `;

  return renderLayout({
    title: `${site.brand.name} — Автоматизация бизнеса, ИИ-агенты, Telegram-боты, n8n, CRM и Python`,
    description: site.brand.tagline,
    bodyHtml,
    basePrefix: ''
  });
}

function buildProjectPage(project) {
  const basePrefix = '../../';
  const related = projects
    .filter((p) => p.slug !== project.slug && p.categories.some((c) => project.categories.includes(c)))
    .slice(0, 3);

  const tgDiscussUrl = `${site.brand.telegramUrl}?text=${encodeURIComponent(`Здравствуйте! Посмотрел проект «${project.shortTitle}» на сайте-портфолио, хочу обсудить похожую задачу.`)}`;

  const screenshotsHtml = project.realScreenshots && project.realScreenshots.length > 0 ? `
    <section class="screenshots-section">
      <div class="section-eyebrow">Фактические материалы</div>
      <h2 class="section-title" style="font-size:1.6rem;">Реальные скриншоты работы</h2>
      <p class="section-desc" style="margin-top:6px;">Хранятся отдельно от художественной обложки карточки. Нажмите на изображение, чтобы увеличить.</p>
      <div class="screenshots-grid">
        ${project.realScreenshots.map((sc) => `
          <figure class="screenshot-card" style="margin:0;">
            <img src="${basePrefix}${esc(sc.src)}" alt="${esc(sc.caption)}" data-lightbox="true" loading="lazy">
            <figcaption class="screenshot-caption">${esc(sc.caption)}</figcaption>
          </figure>`).join('')}
      </div>
    </section>` : '';

  const extraLinksHtml = (project.extraLinks || []).map((lnk) => `
    <a class="btn btn-outline btn-sm" href="${esc(lnk.url)}" target="_blank" rel="noopener noreferrer">${esc(lnk.label)} ${ICONS.external}</a>`).join('');

  const bodyHtml = `
    <div class="container" style="padding-bottom:72px;">
      <nav class="breadcrumb" aria-label="Хлебные крошки">
        <a href="${basePrefix}index.html">Главная</a>
        <span>/</span>
        <a href="${basePrefix}index.html#portfolio">Мои работы</a>
        <span>/</span>
        <span>${esc(project.shortTitle)}</span>
      </nav>

      <section class="detail-hero">
        <div>
          <div class="card-cat" style="margin-bottom:8px;">${esc(project.categoryLabel)}</div>
          <h1 class="detail-title" style="margin-top:0;">${esc(project.title)}</h1>
          <div class="stack-tags" style="margin-bottom:0;">
            ${project.stack.map((t) => `<span class="stack-tag">${esc(t)}</span>`).join('')}
          </div>
          <div class="detail-actions">
            <a class="btn btn-coral" href="${esc(tgDiscussUrl)}" target="_blank" rel="noopener noreferrer">${ICONS.telegram} Обсудить похожую задачу</a>
            <a class="btn btn-outline" href="${esc(project.sourceUrl)}" target="_blank" rel="noopener noreferrer">${esc(project.sourceLabel)} ${ICONS.external}</a>
            ${extraLinksHtml}
          </div>
        </div>
        <div class="detail-cover">
          <img src="${basePrefix}${esc(project.coverImage)}" alt="${esc(project.title)}">
        </div>
      </section>

      <section class="story-grid" aria-label="Разбор проекта">
        <article class="story-card">
          <div class="story-label" style="color:var(--coral);">01 · Проблема</div>
          <h2>С чего всё начинается</h2>
          <p>${esc(project.problem)}</p>
        </article>
        <article class="story-card">
          <div class="story-label" style="color:var(--primary);">02 · Решение</div>
          <h2>Как это устроено</h2>
          <p>${esc(project.solution)}</p>
        </article>
        <article class="story-card">
          <div class="story-label" style="color:var(--emerald);">03 · Польза</div>
          <h2>Что это даёт в работе</h2>
          <p>${esc(project.benefit)}</p>
        </article>
        <article class="story-card">
          <div class="story-label" style="color:var(--indigo);">04 · Простой пример</div>
          <h2>Как выглядит на практике</h2>
          <p>${esc(project.example)}</p>
        </article>
      </section>

      <div class="honest-box">
        <strong>Честно о статусе и ограничениях</strong>
        ${esc(project.honestNote)}
      </div>

      ${screenshotsHtml}

      ${related.length ? `
      <section style="margin-top:56px;">
        <div class="section-head" style="margin-bottom:24px;">
          <div>
            <div class="section-eyebrow">Ещё по теме</div>
            <h2 class="section-title" style="font-size:1.65rem;">Похожие работы</h2>
          </div>
          <a class="btn btn-outline btn-sm" href="${basePrefix}index.html#portfolio">Ко всем проектам</a>
        </div>
        <div class="projects-grid">
          ${related.map((r) => renderProjectCard(r, basePrefix, false)).join('')}
        </div>
      </section>` : ''}
    </div>

    <div id="lightbox" class="lightbox" role="dialog" aria-modal="true" aria-label="Увеличенный скриншот">
      <button id="lightboxClose" class="lightbox-close" type="button" aria-label="Закрыть">&times;</button>
      <img id="lightboxImg" src="" alt="">
    </div>
  `;

  return renderLayout({
    title: `${project.shortTitle} — Портфолио ${site.brand.name}`,
    description: project.benefit,
    bodyHtml,
    basePrefix
  });
}

function build404Page() {
  const bodyHtml = `
    <div class="container" style="padding:100px 24px; text-align:center;">
      <div class="section-eyebrow">404</div>
      <h1 class="section-title" style="margin-bottom:14px;">Страница не найдена</h1>
      <p class="section-desc" style="margin:0 auto 28px;">Возможно, ссылка устарела. Все актуальные работы доступны на главной странице портфолио.</p>
      <a class="btn btn-primary" href="./index.html">Вернуться на главную</a>
    </div>
  `;
  return renderLayout({
    title: `Страница не найдена — ${site.brand.name}`,
    description: site.brand.tagline,
    bodyHtml,
    basePrefix: './'
  });
}

// Run build
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

copyDir(path.join(ROOT, 'src', 'styles'), path.join(DIST, 'styles'));
copyDir(path.join(ROOT, 'src', 'scripts'), path.join(DIST, 'scripts'));
copyDir(path.join(ROOT, 'src', 'assets'), path.join(DIST, 'assets'));

fs.writeFileSync(path.join(DIST, 'index.html'), buildHomePage(), 'utf8');
fs.writeFileSync(path.join(DIST, '404.html'), build404Page(), 'utf8');
fs.writeFileSync(path.join(DIST, '.nojekyll'), '', 'utf8');

for (const project of projects) {
  const dir = path.join(DIST, 'projects', project.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), buildProjectPage(project), 'utf8');
}

console.log(`Build complete: dist/index.html + ${projects.length} project detail pages.`);
