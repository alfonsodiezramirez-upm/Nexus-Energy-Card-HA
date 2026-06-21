import type { NexusLanguage } from "./types";

export type ResolvedNexusLanguage = Exclude<NexusLanguage, "auto">;

export type NexusTranslationKey =
  | "active"
  | "balance"
  | "currentConsumption"
  | "energySummary"
  | "exporting"
  | "expandCollapse"
  | "frequency"
  | "historyFromHomeAssistant"
  | "historyLoadError"
  | "loadingHaHistory"
  | "localHistoryUntilHa"
  | "noHistorySamples"
  | "now"
  | "of"
  | "ofTotal"
  | "overflowPlural"
  | "overflowSingular"
  | "overflowStatus"
  | "powerFactor"
  | "restPrefix"
  | "reverseFlow"
  | "solarAutonomy"
  | "standby"
  | "supplying"
  | "systemNormal"
  | "tooltipDetail"
  | "totalInHome"
  | "voltage";

export const SUPPORTED_LANGUAGES: ResolvedNexusLanguage[] = ["en", "es", "zh", "fr", "de", "hi", "it", "ru"];

export const LANGUAGE_LABELS: Record<NexusLanguage, string> = {
  auto: "Automatic (System)",
  en: "English",
  es: "Español",
  zh: "中文",
  fr: "Français",
  de: "Deutsch",
  hi: "हिन्दी",
  it: "Italiano",
  ru: "Русский"
};

const TRANSLATIONS: Record<ResolvedNexusLanguage, Record<NexusTranslationKey, string>> = {
  en: {
    active: "Active",
    balance: "Balance",
    currentConsumption: "Current consumption",
    energySummary: "Energy summary",
    exporting: "Exporting",
    expandCollapse: "Expand or collapse",
    frequency: "Frequency",
    historyFromHomeAssistant: "Immediate history from Home Assistant",
    historyLoadError: "Could not load HA history",
    loadingHaHistory: "Loading Home Assistant history",
    localHistoryUntilHa: "Local history until HA data arrives",
    noHistorySamples: "No history samples available",
    now: "Now",
    of: "of",
    ofTotal: "of total",
    overflowPlural: "overflows",
    overflowSingular: "overflow",
    overflowStatus: "Overflow",
    powerFactor: "Power factor",
    restPrefix: "Rest of",
    reverseFlow: "Reverse flow",
    solarAutonomy: "Solar autonomy",
    standby: "Standby",
    supplying: "Supplying",
    systemNormal: "System normal",
    tooltipDetail: "Details for",
    totalInHome: "Total home",
    voltage: "Voltage"
  },
  es: {
    active: "Activo",
    balance: "Balance",
    currentConsumption: "Consumo actual",
    energySummary: "Resumen energético",
    exporting: "Exportando",
    expandCollapse: "Expandir o colapsar",
    frequency: "Frecuencia",
    historyFromHomeAssistant: "Historial inmediato desde Home Assistant",
    historyLoadError: "No se pudo cargar el historial de HA",
    loadingHaHistory: "Cargando historial de Home Assistant",
    localHistoryUntilHa: "Historial local hasta recibir datos de HA",
    noHistorySamples: "Sin muestras históricas disponibles",
    now: "Ahora",
    of: "de",
    ofTotal: "del total",
    overflowPlural: "overflows",
    overflowSingular: "overflow",
    overflowStatus: "Desbordamiento",
    powerFactor: "Factor de potencia",
    restPrefix: "Resto",
    reverseFlow: "Flujo inverso",
    solarAutonomy: "Autonomía solar",
    standby: "Standby",
    supplying: "Aportando",
    systemNormal: "Sistema normal",
    tooltipDetail: "Detalle de",
    totalInHome: "Total en casa",
    voltage: "Voltaje"
  },
  zh: {
    active: "运行中",
    balance: "平衡",
    currentConsumption: "当前消耗",
    energySummary: "能源摘要",
    exporting: "正在输出",
    expandCollapse: "展开或折叠",
    frequency: "频率",
    historyFromHomeAssistant: "来自 Home Assistant 的即时历史",
    historyLoadError: "无法加载 HA 历史",
    loadingHaHistory: "正在加载 Home Assistant 历史",
    localHistoryUntilHa: "本地历史，等待 HA 数据",
    noHistorySamples: "没有可用历史样本",
    now: "现在",
    of: "占",
    ofTotal: "占总量",
    overflowPlural: "溢出",
    overflowSingular: "溢出",
    overflowStatus: "溢出",
    powerFactor: "功率因数",
    restPrefix: "剩余",
    reverseFlow: "反向流",
    solarAutonomy: "太阳能自给率",
    standby: "待机",
    supplying: "供电中",
    systemNormal: "系统正常",
    tooltipDetail: "详情",
    totalInHome: "全屋总计",
    voltage: "电压"
  },
  fr: {
    active: "Actif",
    balance: "Balance",
    currentConsumption: "Consommation actuelle",
    energySummary: "Résumé énergétique",
    exporting: "Exportation",
    expandCollapse: "Développer ou réduire",
    frequency: "Fréquence",
    historyFromHomeAssistant: "Historique immédiat depuis Home Assistant",
    historyLoadError: "Impossible de charger l'historique HA",
    loadingHaHistory: "Chargement de l'historique Home Assistant",
    localHistoryUntilHa: "Historique local en attendant les données HA",
    noHistorySamples: "Aucun échantillon historique disponible",
    now: "Maintenant",
    of: "de",
    ofTotal: "du total",
    overflowPlural: "débordements",
    overflowSingular: "débordement",
    overflowStatus: "Débordement",
    powerFactor: "Facteur de puissance",
    restPrefix: "Reste de",
    reverseFlow: "Flux inverse",
    solarAutonomy: "Autonomie solaire",
    standby: "Veille",
    supplying: "Alimentation",
    systemNormal: "Système normal",
    tooltipDetail: "Détail de",
    totalInHome: "Total maison",
    voltage: "Tension"
  },
  de: {
    active: "Aktiv",
    balance: "Bilanz",
    currentConsumption: "Aktueller Verbrauch",
    energySummary: "Energieübersicht",
    exporting: "Exportiert",
    expandCollapse: "Erweitern oder einklappen",
    frequency: "Frequenz",
    historyFromHomeAssistant: "Sofortverlauf aus Home Assistant",
    historyLoadError: "HA-Verlauf konnte nicht geladen werden",
    loadingHaHistory: "Home Assistant Verlauf wird geladen",
    localHistoryUntilHa: "Lokaler Verlauf bis HA-Daten eintreffen",
    noHistorySamples: "Keine Verlaufswerte verfügbar",
    now: "Jetzt",
    of: "von",
    ofTotal: "vom Gesamtwert",
    overflowPlural: "Überläufe",
    overflowSingular: "Überlauf",
    overflowStatus: "Überlauf",
    powerFactor: "Leistungsfaktor",
    restPrefix: "Rest von",
    reverseFlow: "Rückfluss",
    solarAutonomy: "Solarautarkie",
    standby: "Standby",
    supplying: "Liefert",
    systemNormal: "System normal",
    tooltipDetail: "Details zu",
    totalInHome: "Haus gesamt",
    voltage: "Spannung"
  },
  hi: {
    active: "सक्रिय",
    balance: "संतुलन",
    currentConsumption: "वर्तमान खपत",
    energySummary: "ऊर्जा सारांश",
    exporting: "निर्यात",
    expandCollapse: "फैलाएं या समेटें",
    frequency: "आवृत्ति",
    historyFromHomeAssistant: "Home Assistant से ताज़ा इतिहास",
    historyLoadError: "HA इतिहास लोड नहीं हो सका",
    loadingHaHistory: "Home Assistant इतिहास लोड हो रहा है",
    localHistoryUntilHa: "HA डेटा आने तक स्थानीय इतिहास",
    noHistorySamples: "कोई इतिहास नमूना उपलब्ध नहीं",
    now: "अभी",
    of: "का",
    ofTotal: "कुल का",
    overflowPlural: "ओवरफ्लो",
    overflowSingular: "ओवरफ्लो",
    overflowStatus: "ओवरफ्लो",
    powerFactor: "पावर फैक्टर",
    restPrefix: "शेष",
    reverseFlow: "उल्टा प्रवाह",
    solarAutonomy: "सौर स्वायत्तता",
    standby: "स्टैंडबाय",
    supplying: "आपूर्ति",
    systemNormal: "सिस्टम सामान्य",
    tooltipDetail: "विवरण",
    totalInHome: "घर कुल",
    voltage: "वोल्टेज"
  },
  it: {
    active: "Attivo",
    balance: "Bilancio",
    currentConsumption: "Consumo attuale",
    energySummary: "Riepilogo energia",
    exporting: "Esportazione",
    expandCollapse: "Espandi o comprimi",
    frequency: "Frequenza",
    historyFromHomeAssistant: "Cronologia immediata da Home Assistant",
    historyLoadError: "Impossibile caricare la cronologia HA",
    loadingHaHistory: "Caricamento cronologia Home Assistant",
    localHistoryUntilHa: "Cronologia locale in attesa dei dati HA",
    noHistorySamples: "Nessun campione storico disponibile",
    now: "Ora",
    of: "di",
    ofTotal: "del totale",
    overflowPlural: "overflow",
    overflowSingular: "overflow",
    overflowStatus: "Overflow",
    powerFactor: "Fattore di potenza",
    restPrefix: "Resto di",
    reverseFlow: "Flusso inverso",
    solarAutonomy: "Autonomia solare",
    standby: "Standby",
    supplying: "In erogazione",
    systemNormal: "Sistema normale",
    tooltipDetail: "Dettaglio di",
    totalInHome: "Totale casa",
    voltage: "Tensione"
  },
  ru: {
    active: "Активно",
    balance: "Баланс",
    currentConsumption: "Текущее потребление",
    energySummary: "Сводка энергии",
    exporting: "Экспорт",
    expandCollapse: "Развернуть или свернуть",
    frequency: "Частота",
    historyFromHomeAssistant: "Последняя история из Home Assistant",
    historyLoadError: "Не удалось загрузить историю HA",
    loadingHaHistory: "Загрузка истории Home Assistant",
    localHistoryUntilHa: "Локальная история до получения данных HA",
    noHistorySamples: "Исторические значения недоступны",
    now: "Сейчас",
    of: "от",
    ofTotal: "от общего",
    overflowPlural: "переполнения",
    overflowSingular: "переполнение",
    overflowStatus: "Переполнение",
    powerFactor: "Коэффициент мощности",
    restPrefix: "Остаток",
    reverseFlow: "Обратный поток",
    solarAutonomy: "Солнечная автономия",
    standby: "Ожидание",
    supplying: "Подает",
    systemNormal: "Система в норме",
    tooltipDetail: "Детали",
    totalInHome: "Итого по дому",
    voltage: "Напряжение"
  }
};

export function resolveLanguage(configLanguage?: NexusLanguage, hassLanguage?: string): ResolvedNexusLanguage {
  if (configLanguage && configLanguage !== "auto" && isSupportedLanguage(configLanguage)) {
    return configLanguage;
  }

  const normalized = String(hassLanguage ?? "")
    .toLowerCase()
    .split(/[-_]/)[0];

  return isSupportedLanguage(normalized) ? normalized : "en";
}

export function t(language: ResolvedNexusLanguage, key: NexusTranslationKey): string {
  return TRANSLATIONS[language]?.[key] ?? TRANSLATIONS.en[key];
}

function isSupportedLanguage(value: string): value is ResolvedNexusLanguage {
  return (SUPPORTED_LANGUAGES as string[]).includes(value);
}
