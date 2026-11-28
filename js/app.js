/* ============================================================
   ЛОГИКА ПРИЛОЖЕНИЯ — ЗОНА ФРОНТЕНД-РАЗРАБОТЧИКА
   ─────────────────────────────────────────────────────────
   Данные (PONDS, REGIONS, REGION_PONDS) НЕ меняем здесь —
   они живут в js/data.js и принадлежат тимлиду.
   Прогноз (computeForecast) — зона бэкенда, js/recommendation.js.
   Аналитика (Analytics.log) — зона бэкенда, js/analytics.js.
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {

  /* ---------- Ссылки на элементы страницы ---------- */
  const form       = document.getElementById("search-form");
  const input      = document.getElementById("region-input");
  const result     = document.getElementById("result");

  const screenMain   = document.getElementById("screen-main");
  const screenRegion = document.getElementById("screen-region");
  const backBtn      = document.getElementById("back-btn");

  const fishPanel = document.getElementById("fish-panel");
  const pondName  = document.getElementById("pond-name");
  const fishList  = document.getElementById("fish-list");
  const panelHint = document.getElementById("panel-placeholder-hint");

  let map = null;

  /* ============================================================
     БЛОК 1. ПОИСК РЕГИОНА
     ============================================================ */

  /* Нормализация: «Кузбасс», «кузбасс », «Кемеровская Область»
     и «кемеровская область» должны считаться одним регионом. */
  function normalize(str) {
    return str.toLowerCase().replace(/ё/g, "е").replace(/\s+/g, " ").trim();
  }

  function findRegion(query) {
    const q = normalize(query);
    return REGIONS.find(function (r) {
      return r.aliases.some(function (a) { return normalize(a) === q; });
    });
  }

  /* Возвращает список водоёмов региона по REGION_PONDS. */
  function getPondsForRegion(regionId) {
    const ids = REGION_PONDS[regionId] || [];
    return PONDS.filter(function (p) { return ids.includes(p.id); });
  }

  /* ---------- Переход на экран региона ---------- */
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const query = input.value.trim();

    /* Случай 1: пустой ввод */
    if (query === "") {
      result.textContent = "Введите название региона";
      return;
    }

    const region = findRegion(query);

    /* Случай 2: регион не найден в справочнике */
    if (!region) {
      result.textContent = "Такой регион пока не поддерживается. Попробуйте: Кузбасс";
      Analytics.log("region_not_found", { query: query });
      return;
    }

    const ponds = getPondsForRegion(region.id);

    /* Случай 3: регион есть, но водоёмов в нём пока нет */
    if (ponds.length === 0) {
      result.textContent = "В этом регионе пока нет добавленных водоёмов";
      return;
    }

    Analytics.log("search_region", { regionId: region.id, query: query });

    result.textContent = "";
    screenMain.classList.add("hidden");
    screenRegion.classList.remove("hidden");

    initMap(ponds);
  });

  /* ============================================================
     БЛОК 2. ВОЗВРАТ НА ГЛАВНЫЙ ЭКРАН
     ============================================================ */

  backBtn.addEventListener("click", function () {
    screenRegion.classList.add("hidden");
    screenMain.classList.remove("hidden");

    /* Полный сброс состояния, чтобы повторный поиск начинался с чистого листа */
    input.value = "";
    result.textContent = "";
    input.focus();

    if (map) {
      map.remove();   // уничтожаем карту вместе со слушателями событий
      map = null;
    }

    fishPanel.classList.add("hidden");
    panelHint.classList.remove("hidden");
    fishList.innerHTML = "";
  });

  /* ============================================================
     БЛОК 3. КАРТА
     ============================================================ */

  function initMap(ponds) {
    if (map) return; // карта уже создана — не дублируем

    /* Центр Кузбасса, масштаб подобран под все 10 водоёмов */
    map = L.map("map").setView([54.75, 87.2], 7);
    map.attributionControl.setPrefix(false);

    /* Тайлы OpenTopoMap с распределением по поддоменам a/b/c */
    L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap, © OpenTopoMap",
    maxZoom: 17,
    subdomains: "abc"
}).addTo(map);


    /* Метки водоёмов из справочника */
    ponds.forEach(function (pond) {
      /* Защита от битой записи в data.js: нет координат — не рисуем */
      if (!Array.isArray(pond.coords) || pond.coords.length !== 2) {
        console.warn("[app.js] У водоёма нет координат, пропущен:", pond.id);
        return;
      }

      L.marker(pond.coords, { title: pond.name })
        .addTo(map)
        .bindPopup(pond.name)
        .on("click", function () { showPond(pond); });
    });

    /* Автоподгонка вида: если водоёмов мало — приблизить к ним */
    if (ponds.length > 0) {
      const bounds = L.latLngBounds(ponds.map(function (p) { return p.coords; }));
      map.fitBounds(bounds, { padding: [30, 30] });
    }

    /* Контейнер карты появился после скрытия секции — пересчитать размеры */
    setTimeout(function () { map.invalidateSize(); }, 100);
  }

  /* ============================================================
     БЛОК 4. ПАНЕЛЬ С РЫБАМИ
     ============================================================ */

  function showPond(pond) {
    pondName.textContent = pond.name + " (" + pond.type + ")";

    fishList.innerHTML = pond.fish.map(function (fish) {

      /* Прогноз считает computeForecast из recommendation.js (бэкенд).
         Защита: если бэкенд вернёт что-то не то — приводим к 1..5. */
      let score = Number(computeForecast(pond, fish));
      if (!Number.isFinite(score)) score = 1;
      score = Math.min(5, Math.max(1, Math.round(score)));

      const scale = Array.from({ length: 5 }, function (_, i) {
        return '<div class="cell' + (i < score ? " on-" + score : "") + '"></div>';
      }).join("");

      return `
        <div class="fish-card">
          <model-viewer src="${fish.model}" alt="${fish.name}"
                        camera-controls auto-rotate
                        shadow-intensity="1"></model-viewer>
          <div class="fish-info">
            <div class="fish-name">${fish.name}</div>
            <div class="forecast-scale">${scale}</div>
            <div class="forecast-text">Прогноз клёва: ${score} из 5</div>
          </div>
        </div>`;
    }).join("");

    panelHint.classList.add("hidden");
    fishPanel.classList.remove("hidden");

    Analytics.log("pond_click", { pondId: pond.id, pondName: pond.name });
  }

});