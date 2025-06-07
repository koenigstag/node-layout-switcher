import {
  GlobalKeyboardListener,
  IGlobalKeyDownMap,
  IGlobalKeyEvent,
  IGlobalKeyListener,
} from 'node-global-key-listener';
import config from './config';
import actions from './actions';

const gkl = new GlobalKeyboardListener();

const KeyNames = {
  CTRL: 'CTRL',
  SHIFT: 'SHIFT',
  ALT: 'ALT',
  META: 'META',
  LEFT_CTRL: 'LEFT CTRL',
  RIGHT_CTRL: 'RIGHT CTRL',
  LEFT_SHIFT: 'LEFT SHIFT',
  RIGHT_SHIFT: 'RIGHT SHIFT',
  LEFT_ALT: 'LEFT ALT',
  RIGHT_ALT: 'RIGHT ALT',
  LEFT_META: 'LEFT META',
  RIGHT_META: 'RIGHT META',
} as const;

function matchesKeybinding(
  keyBinding: string,
  e: IGlobalKeyEvent,
  isDown: IGlobalKeyDownMap
): boolean {
  if (!e.name) return false;

  const requiredKeys = keyBinding
    .toUpperCase()
    .split('+')
    .map((k) => k.trim());

  const checkRequiresKey = (key: string) =>
    requiredKeys.includes(key.toUpperCase());

  const requiresCtrl = checkRequiresKey(KeyNames.CTRL);
  const requiresLeftCtrl = checkRequiresKey(KeyNames.LEFT_CTRL);
  const requiresRightCtrl = checkRequiresKey(KeyNames.RIGHT_CTRL);
  const requiresShift = checkRequiresKey(KeyNames.SHIFT);
  const requiresLeftShift = checkRequiresKey(KeyNames.LEFT_SHIFT);
  const requiresRightShift = checkRequiresKey(KeyNames.RIGHT_SHIFT);
  const requiresAlt = checkRequiresKey(KeyNames.ALT);
  const requiresLeftAlt = checkRequiresKey(KeyNames.LEFT_ALT);
  const requiresRightAlt = checkRequiresKey(KeyNames.RIGHT_ALT);
  const requiresMeta = checkRequiresKey(KeyNames.META);
  const requiresLeftMeta = checkRequiresKey(KeyNames.LEFT_META);
  const requiresRightMeta = checkRequiresKey(KeyNames.RIGHT_META);

  if (
    // CTRL
    (requiresCtrl &&
      !isDown[KeyNames.LEFT_CTRL] &&
      !isDown[KeyNames.RIGHT_CTRL]) ||
    (requiresLeftCtrl &&
      !isDown[KeyNames.LEFT_CTRL] &&
      isDown[KeyNames.RIGHT_CTRL]) ||
    (requiresRightCtrl &&
      !isDown[KeyNames.RIGHT_CTRL] &&
      isDown[KeyNames.LEFT_CTRL]) ||
    // SHIFT
    (requiresShift &&
      !isDown[KeyNames.LEFT_SHIFT] &&
      !isDown[KeyNames.RIGHT_SHIFT]) ||
    (requiresLeftShift &&
      !isDown[KeyNames.LEFT_SHIFT] &&
      isDown[KeyNames.RIGHT_SHIFT]) ||
    (requiresRightShift &&
      !isDown[KeyNames.RIGHT_SHIFT] &&
      isDown[KeyNames.LEFT_SHIFT]) ||
    // ALT
    (requiresAlt &&
      !isDown[KeyNames.LEFT_ALT] &&
      !isDown[KeyNames.RIGHT_ALT]) ||
    (requiresLeftAlt &&
      !isDown[KeyNames.LEFT_ALT] &&
      isDown[KeyNames.RIGHT_ALT]) ||
    (requiresRightAlt &&
      !isDown[KeyNames.RIGHT_ALT] &&
      isDown[KeyNames.LEFT_ALT]) ||
    // META
    (requiresMeta &&
      !isDown[KeyNames.LEFT_META] &&
      !isDown[KeyNames.RIGHT_META]) ||
    (requiresLeftMeta &&
      !isDown[KeyNames.LEFT_META] &&
      isDown[KeyNames.RIGHT_META]) ||
    (requiresRightMeta &&
      !isDown[KeyNames.RIGHT_META] &&
      isDown[KeyNames.LEFT_META])
  ) {
    return false;
  }

  const requiresOtherKeys = requiredKeys
    .filter(
      (s) =>
        // exclude either CTRL or LEFT CTRL
        !s.includes(KeyNames.CTRL) &&
        !s.includes(KeyNames.SHIFT) &&
        !s.includes(KeyNames.ALT) &&
        !s.includes(KeyNames.META)
    )
    .filter(Boolean)
    .map((k) => k.toUpperCase());

  if (!requiresOtherKeys.length) {
    return true;
  }

  const pressedKeys = Object.entries(isDown)
    .filter(([_key, val]) => Boolean(val))
    .map(([key]) => key.toUpperCase());

  return requiresOtherKeys.every((key) => pressedKeys.includes(key));
}

export function registerListener(
  bindings: Record<string, IGlobalKeyListener>
): void {
  gkl.addListener((e: IGlobalKeyEvent, isDown: IGlobalKeyDownMap) => {
    if (!e.name) return;

    if (e.state === 'DOWN') {
      for (const [bind, handler] of Object.entries(bindings)) {
        if (matchesKeybinding(bind, e, isDown)) {
          handler(e, isDown);
        }
      }
    }
  });
}

export function initKeyBindings(): void {
  const bindings: Record<string, IGlobalKeyListener> = {};

  for (const [keyBinding, settings] of Object.entries(config.keyBindings)) {
    bindings[keyBinding] = () => {
      const action = settings.action;
      const handler = actions[action as keyof typeof actions];

      handler?.();
    };

    if (settings.description) {
      console.log(
        `- ${settings.description?.replace('${keyBinding}', keyBinding)}`
      );
    }
  }

  registerListener(bindings);
}
