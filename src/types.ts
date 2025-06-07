export type Lang = 'en' | 'ru' | 'uk' | 'de' | 'fr' | 'cz' | 'pl';

export type CharInfo = {
  row: string;
  index: number;
  shifted: boolean;
  altCombination?: boolean;
};

export type CharMap = Record<string, CharInfo>;

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
  altCombinations?: Record<string, string>;
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
