import type { MarkerEntity } from '../types/models';

const fallback = (value?: string): string => value?.trim() ?? '';

export const getLocalized = (
  base: string | undefined,
  dict: MarkerEntity['name_l10n'] | MarkerEntity['desc_l10n'],
  language: string
): string => {
  if (dict?.[language]?.trim()) return dict[language].trim();
  if (dict?.en?.trim()) return dict.en.trim();
  return fallback(base);
};
