export type Lang = 'en' | 'ru' | 'uk' | 'de' | 'fr' | 'cz' | 'pl';

export type Dict = Record<string, string>;

export type Config = {
  defaultLang: Lang;
  selectedTuple: [Lang, Lang];
  langRegexps: Record<Lang, string>;
  dictionaryPaths: Record<Lang, string>;
  keyBindings: Record<
    string,
    {
      action: string;
      description?: string;
    }
  >;
};
