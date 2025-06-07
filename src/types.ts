export type Lang = 'en' | 'ru' | 'uk' | 'de' | 'fr' | 'cz' | 'pl';

export type Dict = Record<string, string>;

export type NewLayoutDict = {
  numberRow: string[];
  numberRowShifted: string[];
  topRow: string[];
  topRowShifted: string[];
  middleRow: string[];
  middleRowShifted: string[];
  bottomRow: string[];
  bottomRowShifted: string[];
  keyMapping: Record<string, number>;
};

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
