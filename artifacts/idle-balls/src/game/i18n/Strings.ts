import { SettingsManager, Language } from "../managers/SettingsManager";

type TranslationMap = Record<string, Record<Language, string>>;

const T: TranslationMap = {
    // HUD
    title:          { en: "IDLE BALLS",        ru: "IDLE BALLS" },
    drop_ball:      { en: "DROP BALL  (Space)", ru: "БРОСИТЬ  (Space)" },
    daily_bonus:    { en: "DAILY BONUS",        ru: "ЕЖ. БОНУС" },
    statistics:     { en: "STATISTICS",         ru: "СТАТИСТИКА" },
    achievements:   { en: "ACHIEVEMENTS",       ru: "ДОСТИЖЕНИЯ" },
    ap_shop:        { en: "AP SHOP",            ru: "МАГ. AP" },
    prestige_shop:  { en: "PRESTIGE SHOP",      ru: "МАГ. ПРЕСТИЖА" },
    prestige_btn:   { en: "PRESTIGE",           ru: "ПРЕСТИЖ" },
    settings:       { en: "SETTINGS",           ru: "НАСТРОЙКИ" },
    combo_label:    { en: "COMBO",              ru: "КОМБО" },
    balls_label:    { en: "Balls",              ru: "Шары" },
    prestige_label: { en: "Prestige",           ru: "Престиж" },
    pp_label:       { en: "PP",                 ru: "ОП" },

    // Shop titles
    shop_title:      { en: "SHOP",              ru: "МАГАЗИН" },
    item_auto:       { en: "⚙ Auto Dropper",    ru: "⚙ Авто-Сброс" },
    item_mult:       { en: "✦ Multiplier",      ru: "✦ Множитель" },
    item_cap:        { en: "◈ Capacity",        ru: "◈ Ёмкость" },
    item_golden:     { en: "★ Golden",          ru: "★ Золотой" },
    item_lucky:      { en: "☘ Lucky Peg",       ru: "☘ Удач. Пег" },
    item_speed:      { en: "⚡ Speed",           ru: "⚡ Скорость" },
    item_dstrike:    { en: "⚔ Double Strike",   ru: "⚔ Двойной Удар" },
    item_insure:     { en: "✪ Insurance",       ru: "✪ Страховка" },

    // Window titles
    title_stats:     { en: "STATISTICS",        ru: "СТАТИСТИКА" },
    title_achieve:   { en: "ACHIEVEMENTS",      ru: "ДОСТИЖЕНИЯ" },
    title_apshop:    { en: "✦ AP SHOP",         ru: "✦ МАГ. AP" },
    title_daily:     { en: "DAILY BONUS",       ru: "ЕЖ. БОНУС" },
    title_prestige:  { en: "✦ PRESTIGE ✦",      ru: "✦ ПРЕСТИЖ ✦" },
    title_settings:  { en: "SETTINGS",          ru: "НАСТРОЙКИ" },

    // Settings labels
    s_language:      { en: "LANGUAGE",          ru: "ЯЗЫК" },
    s_theme:         { en: "THEME",             ru: "ТЕМА" },
    s_display:       { en: "DISPLAY",           ru: "ОТОБРАЖЕНИЕ" },
    s_gameplay:      { en: "GAMEPLAY",          ru: "ИГРОВОЙ ПРОЦЕСС" },
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
    sw_crits:        { en: "Critical hits",     ru: "Критических" },
    sw_stars:        { en: "Star peg hits",     ru: "Стар-пегов" },
    sw_peg_bonus:    { en: "Peg bonuses",       ru: "Бонус от пегов" },
    sw_purchases:    { en: "Purchases",         ru: "Покупок" },
    sw_best_hit:     { en: "Best hit",          ru: "Лучший удар" },
    sw_best_combo:   { en: "Best combo",        ru: "Лучшее комбо" },
    sw_play_time:    { en: "Play time",         ru: "Время игры" },
    sw_earned:       { en: "Earned",            ru: "Заработано" },
    sw_duration:     { en: "Duration",          ru: "Длительность" },
    sw_rate:         { en: "Rate",              ru: "Скорость" },
    sw_multiplier:   { en: "Multiplier",        ru: "Множитель" },
    sw_income_boost: { en: "Income boost",      ru: "Усилен. дохода" },
    sw_auto_rate:    { en: "Auto-drop rate",    ru: "Авто-сброс" },
    sw_streak:       { en: "Daily streak",      ru: "Стрик дней" },
    sw_prestige:     { en: "Prestige count",    ru: "Престижей" },

    // Daily window
    dw_streak:       { en: "🔥 Day streak",     ru: "🔥 Стрик дней" },
    dw_new_streak:   { en: "Start a streak!",   ru: "Начни стрик!" },
    dw_bonus:        { en: "Bonus",             ru: "Бонус" },
    dw_claimed:      { en: "Already claimed.",  ru: "Уже получено." },
    dw_tomorrow:     { en: "Next: tomorrow",    ru: "Следующий: завтра" },
    dw_claim:        { en: "CLAIM BONUS!",      ru: "ПОЛУЧИТЬ БОНУС!" },
    dw_mult:         { en: "Multiplier",        ru: "Множитель" },

    // Prestige window
    pw_count:        { en: "Prestige #",        ru: "Престиж #" },
    pw_pp_avail:     { en: "PP available",      ru: "ОП доступно" },
    pw_pp_total:     { en: "PP total earned",   ru: "ОП всего" },
    pw_req:          { en: "Requirement",       ru: "Требование" },
    pw_ready:        { en: "✓ READY — earn",    ru: "✓ ГОТОВО — получить" },
    pw_need:         { en: "Need",              ru: "Нужно ещё" },
    pw_more:         { en: "more to prestige",  ru: "для престижа" },
    pw_prestige_shop:{ en: "PRESTIGE SHOP",     ru: "МАГ. ПРЕСТИЖА" },
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
};

export function t(key: string, fallback?: string): string {
    const lang = SettingsManager.getLanguage();
    return T[key]?.[lang] ?? T[key]?.["en"] ?? fallback ?? key;
}
