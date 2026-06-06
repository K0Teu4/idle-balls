import { SettingsManager, Language } from "../managers/SettingsManager";

type TranslationMap = Record<string, Record<Language, string>>;

const T: TranslationMap = {
    // HUD
    title:          { en: "IDLE BALLS",        ru: "IDLE BALLS" },
    drop_ball:      { en: "DROP BALL  (Space)", ru: "БРОСИТЬ  (Space)" },
    daily_bonus:    { en: "DAILY BONUS",        ru: "ЕЖ. БОНУС" },
    statistics:     { en: "STATISTICS",         ru: "СТАТИСТИКА" },
    achievements:   { en: "ACHIEVEMENTS",       ru: "ДОСТИЖЕНИЯ" },
    ap_shop:        { en: "AP SHOP",            ru: "АП-ШОП" },
    prestige_shop:  { en: "PRESTIGE SHOP",      ru: "ШОП ПРЕСТИЖА" },
    prestige_btn:   { en: "PRESTIGE",           ru: "ПРЕСТИЖ" },
    settings:       { en: "SETTINGS",           ru: "НАСТРОЙКИ" },
    help_btn:       { en: "? HOW TO PLAY",      ru: "? КАК ИГРАТЬ" },
    combo_label:    { en: "COMBO",              ru: "КОМБО" },
    balls_label:    { en: "Balls",              ru: "Шары" },
    prestige_label: { en: "Prestige",           ru: "Престиж" },
    pp_label:       { en: "PP",                 ru: "ОП" },
    hud_need:       { en: "Need",               ru: "Нужно" },
    hud_more:       { en: "more",               ru: "ещё" },
    hud_ready:      { en: "⭐ PRESTIGE READY!", ru: "⭐ ГОТОВ К ПРЕСТИЖУ!" },

    // Shop titles
    shop_title:      { en: "SHOP",              ru: "МАГАЗИН" },
    item_auto:       { en: "⚙ Auto Dropper",    ru: "⚙ Авто-Сброс" },
    item_mult:       { en: "✦ Multiplier",      ru: "✦ Множитель" },
    item_cap:        { en: "◈ Capacity",        ru: "◈ Ёмкость" },
    item_golden:     { en: "★ Golden Ball",     ru: "★ Золотой Шар" },
    item_lucky:      { en: "☘ Lucky Peg",       ru: "☘ Удачный Пег" },
    item_speed:      { en: "⚡ Speed",           ru: "⚡ Скорость" },
    item_dstrike:    { en: "⚔ Double Strike",   ru: "⚔ Двойной Удар" },
    item_insure:     { en: "✪ Insurance",       ru: "✪ Страховка" },
    item_bank:       { en: "$ Bank",            ru: "$ Банк" },

    // Window titles
    title_stats:     { en: "STATISTICS",        ru: "СТАТИСТИКА" },
    title_achieve:   { en: "ACHIEVEMENTS",      ru: "ДОСТИЖЕНИЯ" },
    title_apshop:    { en: "✦ AP SHOP",         ru: "✦ АП-ШОП" },
    title_daily:     { en: "DAILY BONUS",       ru: "ЕЖ. БОНУС" },
    title_prestige:  { en: "✦ PRESTIGE ✦",      ru: "✦ ПРЕСТИЖ ✦" },
    title_settings:  { en: "SETTINGS",          ru: "НАСТРОЙКИ" },

    // Settings labels
    s_language:      { en: "LANGUAGE",          ru: "ЯЗЫК" },
    s_theme:         { en: "THEME",             ru: "ТЕМА" },
    s_display:       { en: "DISPLAY",           ru: "ОТОБРАЖЕНИЕ" },
    s_gameplay:      { en: "GAMEPLAY",          ru: "ГЕЙМПЛЕЙ" },
    s_data:          { en: "DATA",              ru: "ДАННЫЕ" },
    s_float_text:    { en: "Floating Text",     ru: "Плавающий текст" },
    s_show_fps:      { en: "Show FPS",          ru: "Показать FPS" },
    s_autosave:      { en: "Autosave",          ru: "Автосохранение" },
    s_anim_speed:    { en: "Animations",        ru: "Анимации" },
    s_close:         { en: "CLOSE",             ru: "ЗАКРЫТЬ" },
    s_restart:       { en: "RESTART GAME",      ru: "ПЕРЕЗАПУСТИТЬ" },
    s_clear_save:    { en: "DELETE SAVE",       ru: "УДАЛИТЬ СОХР." },
    s_on:            { en: "ON",                ru: "ВКЛ" },
    s_off:           { en: "OFF",               ru: "ВЫКЛ" },

    // Stats window
    sw_lifetime:     { en: "─── LIFETIME ──",   ru: "─── ВСЁ ВРЕМЯ ─" },
    sw_session:      { en: "─── SESSION ───",   ru: "─── СЕССИЯ ────" },
    sw_live:         { en: "─── LIVE ───────",  ru: "─── СЕЙЧАС ────" },
    sw_money:        { en: "Money earned",      ru: "Заработано" },
    sw_balls:        { en: "Balls dropped",     ru: "Шаров брошено" },
    sw_hits:         { en: "Slot hits",         ru: "Попаданий" },
    sw_golden:       { en: "Golden balls",      ru: "Золотых шаров" },
    sw_crits:        { en: "Critical hits",     ru: "Крит. ударов" },
    sw_stars:        { en: "Star peg hits",     ru: "Звёздных пегов" },
    sw_peg_bonus:    { en: "Peg bonuses",       ru: "Бонус от пегов" },
    sw_purchases:    { en: "Purchases",         ru: "Покупок" },
    sw_best_hit:     { en: "Best hit",          ru: "Лучший удар" },
    sw_best_combo:   { en: "Best combo",        ru: "Лучшее комбо" },
    sw_play_time:    { en: "Play time",         ru: "Время игры" },
    sw_earned:       { en: "Earned",            ru: "Заработано" },
    sw_duration:     { en: "Duration",          ru: "Длительность" },
    sw_rate:         { en: "Rate",              ru: "Скорость" },
    sw_multiplier:   { en: "Multiplier",        ru: "Множитель" },
    sw_income_boost: { en: "Income boost",      ru: "Усил. дохода" },
    sw_auto_rate:    { en: "Auto-drop rate",    ru: "Авто-сброс" },
    sw_streak:       { en: "Daily streak",      ru: "Стрик дней" },
    sw_prestige:     { en: "Prestige count",    ru: "Кол-во престижей" },

    // Daily window
    dw_streak:       { en: "🔥 Day streak",     ru: "🔥 Стрик дней" },
    dw_new_streak:   { en: "Start a streak!",   ru: "Начни стрик!" },
    dw_bonus:        { en: "Bonus",             ru: "Бонус" },
    dw_claimed:      { en: "Already claimed.",  ru: "Уже получено." },
    dw_tomorrow:     { en: "Next: tomorrow",    ru: "Следующий: завтра" },
    dw_claim:        { en: "CLAIM BONUS!",      ru: "ПОЛУЧИТЬ БОНУС!" },
    dw_mult:         { en: "Multiplier",        ru: "Множитель" },

    // Prestige window
    pw_count:        { en: "Prestige #",        ru: "Престиж №" },
    pw_pp_avail:     { en: "PP available",      ru: "ОП доступно" },
    pw_pp_total:     { en: "PP total earned",   ru: "ОП заработано" },
    pw_req:          { en: "Requirement",       ru: "Требование" },
    pw_ready:        { en: "✓ READY — earn",    ru: "✓ ГОТОВО — получить" },
    pw_need:         { en: "Need",              ru: "Нужно ещё" },
    pw_more:         { en: "more to prestige",  ru: "для престижа" },
    pw_prestige_shop:{ en: "PRESTIGE BOOSTS",   ru: "БУСТЫ ПРЕСТИЖА" },
    pw_do_prestige:  { en: "PRESTIGE NOW",      ru: "ПРЕСТИЖИРОВАТЬ" },

    // Common
    buy:             { en: "BUY",               ru: "КУПИТЬ" },
    max:             { en: "MAX",               ru: "МАКС" },
    level:           { en: "Level",             ru: "Уровень" },
    cost:            { en: "Cost",              ru: "Цена" },
    close_x:         { en: "✕",                ru: "✕" },
    not_enough_money:{ en: "Not enough money!", ru: "Недостаточно денег!" },
    not_enough_ap:   { en: "Not enough AP!",   ru: "Недостаточно AP!" },
    ball_limit:      { en: "Ball limit reached!", ru: "Лимит шаров!" },

    // Help window
    help_title:        { en: "HOW TO PLAY",       ru: "КАК ИГРАТЬ" },
    help_close_hint:   { en: "Click outside to close",ru: "Нажми за окном чтобы закрыть" },
    help_controls:     { en: "CONTROLS",           ru: "УПРАВЛЕНИЕ" },
    help_controls_d:   {
        en: "Click DROP BALL or press Space to drop a ball. Hold Space for rapid drops.\nEach ball costs money — buy Ball Discount (AP Shop) to reduce cost.",
        ru: "Нажми DROP BALL или Space чтобы бросить шар. Держи Space для быстрого броска.\nКаждый шар стоит денег — купи Скидку на шар (АП-ШОП) для снижения цены."
    },
    help_slots:        { en: "SLOTS (bottom row)", ru: "СЛОТЫ (нижний ряд)" },
    help_slots_d:      {
        en: "×1  ×2  ×5  ×10  ×5  ×2  ×1\nBall landing earns slot value × multiplier.\nSlots flash briefly on hit — visual feedback only.\nAim for the center ×10 slot for max rewards!",
        ru: "×1  ×2  ×5  ×10  ×5  ×2  ×1\nШар приносит значение слота × множитель.\nСлот вспыхивает при попадании — это нормально!\nЦелься в центральный ×10 для максимальной награды!"
    },
    help_combo:        { en: "COMBO SYSTEM",       ru: "СИСТЕМА КОМБО" },
    help_combo_d:      {
        en: "Land balls quickly in succession to build a combo multiplier (+bonus % income). The bar shows time remaining. AP Shop upgrades extend the window and add stacks.",
        ru: "Бросай шары быстро подряд чтобы накапливать комбо-множитель (бонус % к доходу). Полоска показывает оставшееся время. АП-ШОП расширяет окно и добавляет стеки."
    },
    help_golden:       { en: "GOLDEN BALLS",       ru: "ЗОЛОТЫЕ ШАРЫ" },
    help_golden_d:     {
        en: "Golden balls give ×5 income on landing (upgraded by Golden Fortune in AP Shop). Buy the Golden Ball upgrade to increase trigger chance.",
        ru: "Золотые шары дают ×5 дохода при приземлении (усиливается Золотой Фортуной в АП-ШОПЕ). Купи улучшение Золотой Шар чтобы повысить шанс."
    },
    help_pegs:         { en: "PEGS & STAR PEGS",   ru: "ПЕГИ И ЗВЁЗДНЫЕ" },
    help_pegs_d:       {
        en: "Balls bounce off pegs randomly.\n⭐ Star pegs appear every 8s — hit one for a big bonus! Activate Lucky Peg upgrade for bonus income on ANY peg hit.",
        ru: "Шары случайно отскакивают от пегов.\n⭐ Звёздные пеги появляются каждые 8с — попади в один для большого бонуса! Lucky Peg даёт бонус с ЛЮБОГО пега."
    },
    help_ap:           { en: "AP & ACHIEVEMENTS",  ru: "AP И ДОСТИЖЕНИЯ" },
    help_ap_d:         {
        en: "Complete Achievements to earn AP (Achievement Points). Spend AP in the AP SHOP for permanent power-ups: Combo, Crits, Multi Ball, Income Boosts, and more.",
        ru: "Выполняй Достижения чтобы получать AP (Очки Достижений). Трать AP в АП-ШОПЕ на постоянные усиления: Комбо, Криты, Мульти-Шар, Бонусы к доходу и другие."
    },
    help_prestige:     { en: "PRESTIGE",            ru: "ПРЕСТИЖ" },
    help_prestige_d:   {
        en: "Accumulate enough money, then Prestige to earn PP (Prestige Points). Spend PP on permanent Boosts that survive all resets. Each prestige raises the next requirement.",
        ru: "Накопи достаточно денег, затем совверши Престиж чтобы получить ОП (Очки Престижа). Трать ОП на постоянные Бусты которые не сбрасываются при каждом престиже."
    },
    help_specials:     { en: "DOUBLE STRIKE / INSURANCE / BANK", ru: "Д.УДАР / СТРАХОВКА / БАНК" },
    help_specials_d:   {
        en: "Double Strike: chance to ×2 income on slot hit.\nInsurance: refund ball cost when landing on weak slots (×1 or ×2).\nBank: earn passive interest (% of money/min).",
        ru: "Двойной Удар: шанс ×2 дохода при попадании в слот.\nСтраховка: возврат цены шара при слабых слотах (×1 или ×2).\nБанк: пассивный доход (% от денег/мин)."
    },
};

export function t(key: string, fallback?: string): string {
    const lang = SettingsManager.getLanguage();
    return T[key]?.[lang] ?? T[key]?.["en"] ?? fallback ?? key;
}
