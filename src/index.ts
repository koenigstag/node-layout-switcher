import { initKeyBindings } from './keyboard';
import { ASCII_ART, divider, version } from './constants';
import { configPath } from './config';

console.log(ASCII_ART);

console.log(`\nVersion ${version}`);

console.log(`\nUsing config: ${configPath}`);

console.log(`\n${divider}\n`);

initKeyBindings();

console.log(`\n🟢 Listening to key-bindings.`);
