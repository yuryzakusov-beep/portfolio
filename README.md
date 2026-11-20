# Сайт-портфолио — Юрий Закусов (Интегратор)

Современный статический сайт-портфолио специалиста по автоматизации бизнеса, ИИ-агентам, Telegram-ботам, n8n, CRM, Python и разработке сайтов.

## Сборка и локальный просмотр

```bash
npm run build
npm run preview
```

Сайт собирается в папку `dist/` (чистые статические файлы HTML, CSS, JS и оптимизированные изображения — подходит для Cloudflare Pages Free и GitHub Pages).

## Как добавить новый проект без изменения кода сайта

1. Откройте файл `data/projects.json`.
2. Добавьте новый объект проекта в массив (поля: `slug`, `title`, `shortTitle`, `categories`, `categoryLabel`, `status`, `statusType`, `featured`, `coverImage`, `realScreenshots`, `problem`, `solution`, `benefit`, `example`, `stack`, `honestNote`, `sourceUrl`, `sourceLabel`).
3. При необходимости положите обложку в `src/assets/images/`, а реальные скриншоты — отдельно в `src/assets/screenshots/`.
4. Запустите `npm run build` — главная страница, фильтры, карусель и отдельная страница `/projects/<slug>/` обновятся автоматически.
