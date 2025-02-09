export const DEFAULT_LOCALE = 'en-US';

export const SUPPORTED_LOCALES = [
  'en-US',
  'en-GB',
  'fr-FR',
  'de-DE',
  'es-ES',
  'ja-JP',
  'zh-CN'
] as const;

export type Locale = typeof SUPPORTED_LOCALES[number];
