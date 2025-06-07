import {
  copyText,
  pasteText,
  detectLayoutKey,
  remapText,
  uniq,
  getDictionary,
  buildCharToKey,
} from './utils';
import { selectedLayoutsList } from './constants';

const actions = {
  convertSelectedText: async () => {
    if (uniq(selectedLayoutsList).length !== 2) {
      console.error(
        `Invalid number of selected layouts. Expected 2, got ${selectedLayoutsList.length}.`
      );
      return;
    }

    const original = await copyText();

    if (!original.trim()) return;

    const layoutKey = detectLayoutKey(original);

    if (!layoutKey) {
      console.error(`Could not detect layout for the text: "${original}".`);
      return;
    }

    const inverseLayoutKey = selectedLayoutsList.find((l) => l !== layoutKey);

    if (!inverseLayoutKey) {
      console.error(
        `No inverse layout found for ${layoutKey}. Available layouts: ${selectedLayoutsList.join(
          ', '
        )}`
      );
      return;
    }

    if (layoutKey === inverseLayoutKey) {
      console.warn(
        `Language is the same (${layoutKey} == ${inverseLayoutKey}). No transformation will be applied.`
      );
      return;
    }

    const originDictionary = await getDictionary(layoutKey);
    const inverseDictionary = await getDictionary(inverseLayoutKey);

    const charToKeyMap = buildCharToKey(originDictionary);

    const convertedText = remapText(
      original,
      originDictionary,
      inverseDictionary,
      charToKeyMap
    );

    await pasteText(convertedText);

    console.log(
      `[✓] Transformed (${layoutKey} → ${inverseLayoutKey}): ${original} → ${convertedText}`
    );
  },
} as const;

export default actions;
