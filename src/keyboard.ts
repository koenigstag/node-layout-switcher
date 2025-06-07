import {
  GlobalKeyboardListener,
  IGlobalKeyDownMap,
  IGlobalKeyEvent,
  IGlobalKeyListener,
} from 'node-global-key-listener';
import path from 'path';
import fs from 'fs';
import config from './config';
import actions from './actions';

declare global {
  namespace NodeJS {
    interface Process {
      pkg?: unknown;
    }
  }
}

// For pkg executables, detect if we're in a packaged environment
const isPkg = !!process.pkg;

// Configure the GlobalKeyboardListener for pkg
const gklConfig = isPkg
  ? (() => {
      const execDir = path.dirname(process.execPath);
      switch (process.platform) {
        case 'win32': {
          const winServerPath = path.resolve(execDir, 'WinKeyServer.exe');
          // console.log(`🔍 Looking for WinKeyServer.exe at: ${winServerPath}`);
          if (!fs.existsSync(winServerPath)) {
            console.warn(`⚠️  WinKeyServer.exe not found at: ${winServerPath}`);
            console.warn(
              `📁 Available files in ${execDir}:`,
              fs.readdirSync(execDir),
            );
          } else {
            // console.log(`✅ Found WinKeyServer.exe`);
          }
          return {
            windows: {
              serverPath: winServerPath,
            },
          };
        }
        case 'linux': {
          const linuxServerPath = path.resolve(execDir, 'X11KeyServer');
          // console.log(`🔍 Looking for X11KeyServer at: ${linuxServerPath}`);
          if (!fs.existsSync(linuxServerPath)) {
            console.warn(`⚠️  X11KeyServer not found at: ${linuxServerPath}`);
          } else {
            // console.log(`✅ Found X11KeyServer`);
          }
          return {
            linux: {
              serverPath: linuxServerPath,
            },
          };
        }
        case 'darwin': {
          const macServerPath = path.resolve(execDir, 'MacKeyServer');
          // console.log(`🔍 Looking for MacKeyServer at: ${macServerPath}`);
          if (!fs.existsSync(macServerPath)) {
            console.warn(`⚠️  MacKeyServer not found at: ${macServerPath}`);
          } else {
            // console.log(`✅ Found MacKeyServer`);
          }
          return {
            mac: {
              serverPath: macServerPath,
            },
          };
        }
        default:
          console.warn(`⚠️  Unsupported platform: ${process.platform}`);
          return {};
      }
    })()
  : {};

// console.log(
//   `🔧 GlobalKeyboardListener config:`,
//   JSON.stringify(gklConfig, null, 2),
// );

let gkl: GlobalKeyboardListener;
try {
  gkl = new GlobalKeyboardListener(gklConfig);
  // console.log(`✅ GlobalKeyboardListener initialized successfully`);
} catch (error) {
  console.error(`❌ Failed to initialize GlobalKeyboardListener:`, error);
  process.exit(1);
}

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
  isDown: IGlobalKeyDownMap,
): boolean {
  if (!e.name) return false;

  const requiredKeys = keyBinding
    .toUpperCase()
    .split('+')
    .map(k => k.trim());

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
      s =>
        // exclude either CTRL or LEFT CTRL
        !s.includes(KeyNames.CTRL) &&
        !s.includes(KeyNames.SHIFT) &&
        !s.includes(KeyNames.ALT) &&
        !s.includes(KeyNames.META),
    )
    .filter(Boolean)
    .map(k => k.toUpperCase());

  if (!requiresOtherKeys.length) {
    return true;
  }

  const pressedKeys = Object.entries(isDown)
    .filter(([, val]) => Boolean(val))
    .map(([key]) => key.toUpperCase());

  return requiresOtherKeys.every(key => pressedKeys.includes(key));
}

export function registerListener(
  bindings: Record<string, IGlobalKeyListener>,
): void {
  try {
    gkl.addListener((e: IGlobalKeyEvent, isDown: IGlobalKeyDownMap) => {
      if (!e.name) return;

      if (e.state === 'DOWN') {
        for (const [bind, handler] of Object.entries(bindings)) {
          if (matchesKeybinding(bind, e, isDown)) {
            console.log(`🎹 Key binding triggered: ${bind}`);
            try {
              handler(e, isDown);
            } catch (error) {
              console.error(`❌ Error executing handler for ${bind}:`, error);
            }
          }
        }
      }
    });
    console.log(`✅ Key listener registered successfully`);
  } catch (error) {
    console.error(`❌ Failed to register key listener:`, error);
    throw error;
  }
}

export function initKeyBindings(): void {
  console.log(`🔧 Initializing key bindings...`);
  const bindings: Record<string, IGlobalKeyListener> = {};

  for (const [keyBinding, settings] of Object.entries(config.keyBindings)) {
    bindings[keyBinding] = () => {
      const action = settings.action;
      const handler = actions[action as keyof typeof actions];

      if (handler) {
        console.log(`🎯 Executing action: ${action}`);
        handler();
      } else {
        console.warn(`⚠️  No handler found for action: ${action}`);
      }
    };

    if (settings.description) {
      console.log(
        `- ${settings.description?.replace('${keyBinding}', keyBinding)}`,
      );
    }
  }

  console.log(
    `📋 Configured ${Object.keys(bindings).length} key binding(s):`,
    Object.keys(bindings),
  );

  try {
    registerListener(bindings);
  } catch (error) {
    console.error(`❌ Failed to initialize key bindings:`, error);
    console.error(`💡 Keyboard functionality will not be available`);
  }
}
