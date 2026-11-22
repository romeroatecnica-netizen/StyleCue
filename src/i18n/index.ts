import {SUPPORTED_LOCALES, type SupportedLocale} from '../types/stylecue';
import type {TranslationsMap} from './types';
import {ar} from './locales/ar';
import {de} from './locales/de';
import {en} from './locales/en';
import {es} from './locales/es';
import {fr} from './locales/fr';
import {hi} from './locales/hi';
import {ja} from './locales/ja';
import {pt} from './locales/pt';
import {ru} from './locales/ru';
import {zh} from './locales/zh';

export const TRANSLATIONS: TranslationsMap = {
  en,
  es,
  fr,
  de,
  pt,
  ru,
  hi,
  ar,
  zh,
  ja,
};

export function isSupportedLocale(value: string | null | undefined): value is SupportedLocale {
  if (!value) return false;
  return SUPPORTED_LOCALES.some((l) => l.code === value);
}

export function detectInitialLocale(urlLang?: string | null, storedLang?: string | null): SupportedLocale {
  if (isSupportedLocale(urlLang)) {
    return urlLang;
  }
  if (isSupportedLocale(storedLang)) {
    return storedLang;
  }
  if (typeof navigator !== 'undefined') {
    const candidates = navigator.languages?.length ? navigator.languages : [navigator.language];
    for (const raw of candidates) {
      if (!raw) continue;
      const base = raw.toLowerCase().split('-')[0];
      if (isSupportedLocale(base)) {
        return base;
      }
    }
  }
  return 'en';
}

export function getLocaleConfig(locale: SupportedLocale) {
  return SUPPORTED_LOCALES.find((l) => l.code === locale) ?? SUPPORTED_LOCALES[0];
}
