/* ============================================================
   СПРАВОЧНИК ВОДОЁМОВ И РЕГИОНОВ — ФАЙЛ ДАННЫХ
   ─────────────────────────────────────────────────────────
   Владелец файла: тимлид. Логика здесь ЗАПРЕЩЕНА —
   только данные. Изменения — через Pull Request,
   ревьюер: фронтенд-разработчик (проверяет формат, не стиль).

   Правила:
   - id — уникальный код латиницей, не повторяется.
   - coords — [широта, долгота] — именно в таком порядке!
   - model — путь только к реально существующему файлу в models/.
   ============================================================ */

const PONDS = [

  /* ---------- Озёра Тисульского района ---------- */

  {
    id: "berchikul",
    name: "Озеро Большой Берчикуль",
    type: "озеро",
    // Самое крупное озеро Кузбасса (~16 кв. км), рыбалка бесплатная
    coords: [55.6110, 88.3438],
    fish: [
      { name: "Окунь",  model: "models/perch.glb" },
      { name: "Карась", model: "models/silver carp.glb" },
      { name: "Щука",   model: "models/Shuka.glb" },
      { name: "Лещ",    model: "models/lesh.glb" }
    ]
  },
  {
    id: "pustoe",
    name: "Озеро Пустое",
    type: "озеро",
    // В 10 км от пос. Тисуль; карась — основная рыба
    coords: [55.7441, 88.1915],
    fish: [
      { name: "Карп", model: "models/carp.glb" },
      { name: "Окунь",  model: "models/perch.glb" }
    ]
  },

  /* ---------- Озёра западной части области ---------- */

  {
    id: "tanay",
    name: "Озеро Танай (пруд Танаев)",
    type: "озеро",
    // Промышленновский район, у с. Журавлево; есть «сплавины» — плавучие острова
    coords: [54.7778, 85.0221],
    fish: [
      { name: "Карась", model: "models/silver carp.glb" },
      { name: "Окунь",  model: "models/perch.glb" },
      { name: "Щука",   model: "models/Shuka.glb" }
    ]
  },
  {
    id: "aprelka",
    name: "Озеро Апрелька",
    type: "озеро",
    // Гурьевский округ, лечебное озеро
    coords: [54.5195, 85.3355],
    fish: [
      { name: "Карась", model: "models/silver carp.glb" },
      { name: "Окунь",  model: "models/perch.glb" }
    ]
  },
  {
    id: "goluboe",
    name: "Голубое озеро (под Темиртау)",
    type: "озеро",
    // Новокузнецкий округ, известное голубой водой
    coords: [53.1068, 87.2975],
    fish: [
      { name: "Карась", model: "models/silver carp.glb" },
      { name: "Окунь",  model: "models/perch.glb" }
    ]
  },

  /* ---------- Водохранилища ---------- */

  {
    id: "belovskoe",
    name: "Беловское водохранилище",
    type: "водохранилище",
    // «Море Кузбасса», у пгт Инской; популярные пляжи и рыбалка
    coords: [54.4114, 86.5106],
    fish: [
      { name: "Лещ",    model: "models/leech.glb" },
      { name: "Судак",  model: "models/zander.glb" },
      { name: "Плотва", model: "models/plotva.glb" },
      { name: "Окунь",  model: "models/perch.glb" }
    ]
  },
  {
    id: "yurginskoe",
    name: "Юргинское водохранилище",
    type: "водохранилище",
    // На реке Искитимке у г. Юрга; зона отдыха и купания
    coords: [55.6906, 84.9584],
    fish: [
      { name: "Карась", model: "models/silver carp.glb" },
      { name: "Плотва", model: "models/plotva.glb" },
      { name: "Окунь",  model: "models/perch.glb" }
    ]
  },

  /* ---------- Реки ---------- */

  {
    id: "tom-kemerovo",
    name: "Река Томь (у Кемерова)",
    type: "река",
    // Координата примерная — привязать к конкретному месту ловли!
    coords: [54.99, 86.00],
    fish: [
      { name: "Щука",   model: "models/Shuka.glb" },
      { name: "Хариус", model: "models/grayling.glb" },
      { name: "Налим",  model: "models/burbot.glb" }
    ]
  },
  {
    id: "kiya-mariinsk",
    name: "Река Кия (у Мариинска)",
    type: "река",
    // Координата гидропоста в Мариинске — привязать к месту ловли
    coords: [56.2145, 87.7750],
    fish: [
      { name: "Щука",   model: "models/Shuka.glb" },
      { name: "Хариус", model: "models/grayling.glb" },
      { name: "Окунь",  model: "models/perch.glb" }
    ]
  },
  {
    id: "kondoma-novokuznetsk",
    name: "Река Кондома (у Новокузнецка)",
    type: "река",
    // Координата примерная — впадает в Томь у Новокузнецка
    coords: [53.76, 87.11],
    fish: [
      { name: "Щука",   model: "models/Shuka.glb" },
      { name: "Хариус", model: "models/grayling.glb" }
    ]
  }

  /* Добавляйте водоёмы сюда же — карта и панель подхватят их
     автоматически. Не забудьте внести id нового водоёма в
     REGION_PONDS ниже! */
];

/* Регионы. regionId связывает регион с водоёмами через REGION_PONDS. */
const REGIONS = [
  {
    id: "kuzbass",
    name: "Кемеровская область (Кузбасс)",
    aliases: ["кузбасс", "кемеровская область", "кемеровская обл",
              "кемеровская", "кемерово", "кемеровская область (кузбасс)"]
  }
];

/* Связь водоёма с регионом: перечисляем id водоёмов каждого региона. */
const REGION_PONDS = {
  kuzbass: [
    "berchikul", "pustoe", "tanay", "aprelka", "goluboe",
    "belovskoe", "yurginskoe",
    "tom-kemerovo", "kiya-mariinsk", "kondoma-novokuznetsk"
  ]
};