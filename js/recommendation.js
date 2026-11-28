/* ============================================================
   ПРОГНОЗ КЛЁВА — ЗОНА БЭКЕНД-РАЗРАБОТЧИКА
   ─────────────────────────────────────────────────────────
   Сейчас: заглушка (стабильное псевдослучайное значение 1–5),
   чтобы интерфейс можно было разрабатывать без сервера.

   TODO(backend): заменить на реальный расчёт (погода, давление,
   сезон, время суток) либо на запрос к API:
   GET /api/forecast?pond_id=...&fish=...
   Контракт: функция ОБЯЗАНА возвращать целое число от 1 до 5.
   ============================================================ */

function computeForecast(pond, fish) {
  const seed = [...pond.id, ...fish.name].reduce((s, ch) => s + ch.charCodeAt(0), 0);
  return 1 + (seed % 5);

  /* Пример будущей интеграции:
     async function computeForecast(pondId, fishName) {
       const res = await fetch(`/api/forecast?pond_id=${pondId}&fish=${fishName}`);
       const data = await res.json();
       return Math.min(5, Math.max(1, data.score));
     }
  */
}
