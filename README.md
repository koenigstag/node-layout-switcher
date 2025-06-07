# Node Layout Switcher

A Node.js utility for automatic keyboard layout switching and text conversion between different languages. Supports English, Russian, Ukrainian, German, French, Czech and Polish layouts with hotkey-based text replacement.

The idea was inspired by the [Punto Switcher](https://ru.wikipedia.org/wiki/Punto_Switcher) application, but this implementation is built using Node.js and is cross-platform compatible.

## Features

- 🔄 **Automatic text conversion** between different keyboard layouts
- 🌍 **Multi-language support**: English, Russian, Ukrainian, German, French, Czech
- 🔥 **Hotkey activation**: Convert selected text with customizable key combinations
- 📋 **Clipboard integration**: Seamless text replacement using system clipboard
- ⚙️ **Configurable**: Easy configuration through JSON files

## How It Works

1. **Hotkey Detection**: The application monitors for the configured hotkeys
2. **Language Recognition**: Uses regex patterns to identify the current language of selected text
3. **Layout Mapping**: Maps characters from one layout to another selected using dictionary files
4. **Text Replacement**: Replaces the selected text with the converted version

## Usage

1. Select text in any input field using your mouse or keyboard
2. Press hotkey to convert the text between layouts (current layout detected automatically based on the selected text)
3. The selected text will be replaced with the converted text in the same input field

## Example

If you type "ghbdtn" on an English keyboard but meant to type "привет" in Russian, select the text and press `Ctrl+Shift+P` (default keybind) to automatically convert it.

## Supported Languages & Layouts

These languages and layouts are supported for text conversion:

| Language | QWERTY | DVORAK |
|----------|--------|--------|
| English  | ✅     | ✅     |
| Russian  | ✅     | ❌     |
| Ukrainian| ✅     | ❌     |
| German   | ✅     | ❌     |
| French   | ✅     | ❌     |
| Czech    | ✅     | ❌     |
| Polish   | ✅     | ❌     |

## Contribution
This project is open for contributions! If you have ideas for new features, suggestions, improvements, or bug fixes, feel free to submit a pull request or open an issue.

## Installation

### Download ready-to-use binary:

1. Download the latest release from [Releases](../../releases)
2. Extract the archive. Enshure copying `assets` folder with dictionaries and config.json file
3. Config the application by editing `assets/config.json` if needed
4. Run the executable file (e.g., `node-layout-switcher.exe` on Windows, `node-layout-switcher` on macOS/Linux)

### Build from source:
1. Clone the repository using Git:
```bash
git clone https://github.com/koenigstag/node-layout-switcher.git
cd node-layout-switcher
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

4. Configure the application by editing `assets/config.json` if needed

5. Start the built application:
```bash
npm start
```

## Configuration

### Main Configuration (`assets/config.json`)

- `selectedTuple`: Array of languages to convert between (e.g., `["en", "ru"]` for English to Russian and vise-versa).
- `langRegexps`: Object containing regex patterns to detect language of selected text.
- `keyBindings`: Object defining hotkeys for text specific actions. Each key maps to an action and a description.
- `dictionaryPaths`: Object mapping language codes to their respective dictionary file paths.
  - Each dictionary should store key-value pairs.
    - Key: Code for the char in the QWERTY layout structure (e.g., `KeyQ` or `KeyAShifted`, independent of language). DVORAK dictionary should also use the same keys as QWERTY ones.
    - Value: Corresponding character (e.g., `q` or `A` for English, and `й` or `Ф` for Russian language).
    - Example for Russian dictionary:
      ```json
      {
        "KeyQ": "й",
        "KeyQShifted": "Й",
        "KeyA": "ф",
        "KeyAShifted": "Ф"
      }
      ```

### Example Configuration
Here is an example of a valid `config.json` file that supports English and Russian languages with QWERTY layout:

```json
{
  "selectedTuple": ["en", "ru"],
  "langRegexps": {
    "ru": "[а-яё]",
    "en": "[a-z]"
  },
  "dictionaryPaths": {
    "en": "./dictionaries/en.qwerty.json",
    "ru": "./dictionaries/ru.qwerty.json"
  },
  "keyBindings": {
    "Ctrl+Shift+P": {
      "action": "convertSelectedText",
      "description": "Press ${keyBinding} to convert selected text."
    }
  }
}
```

### Language Dictionaries

Each language has its own dictionary file in `assets/dictionaries/` that maps keyboard keys to characters:

- `en.qwerty.json` - English QWERTY layout
- `en.dvorak.json` - English DVORAK layout (example provided)
- `ru.qwerty.json` - Russian ЙЦУКЕН layout
- `uk.qwerty.json` - Ukrainian ЙЦУКЕН layout
- `de.qwertz.json` - German QWERTZ layout
- `fr.azerty.json` - French AZERTY layout
- `cz.qwertz.json` - Czech QWERTZ layout
- `pl.qwerty.json` - Polish QWERTY layout

#### Contribution is welcome to add more languages and layouts! Just create a new dictionary file or edit an existing one in the `dictionaries` folder and update the `config.json` accordingly.

## Development

### How to Contribute

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Modify the README.md or Docs to reflect your changes
6. Commit your changes with a clear message
7. Submit a pull request with a description of your changes
8. Ensure your code passes linting and tests

### Build
```bash
npm run build
```

### Start built application
```bash
npm start
```

### Project Structure
```
├── src/
│   ├── index.ts          # Main entry point
│   ├── config.ts         # Configuration management
│   ├── keyboard.ts       # Keyboard monitoring
│   ├── actions.ts        # Text conversion actions
│   ├── utils.ts          # Utility functions
│   ├── types.ts          # TypeScript type definitions
│   └── constants.ts      # Application constants
├── assets/
│   ├── config.json       # Main configuration
│   └── dictionaries/     # Language layout dictionaries
└── dist/                 # Compiled JavaScript files
```

## Dependencies

- **@nut-tree-fork/nut-js**: Cross-platform automation library to simulate Ctrl+C and Ctrl+V for selected text replacement
- **clipboardy**: Cross-platform clipboard access library to read and write clipboard content
- **node-global-key-listener**: Global hotkey monitoring library to listen for key combinations

## Requirements

- Node.js 18+
- Windows/macOS/Linux

## License

MIT License - see [LICENSE](LICENSE) file for details.

TL;DR: THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND

## Troubleshooting

### Common Issues

**Hotkey not working:**
- Check if another application is using the same hotkey combination
- Run the application with administrator privileges (Windows) or appropriate permissions (macOS/Linux)

**Text not converting:**
- Ensure the program is running and monitoring keybindings
- Check log output for errors
- Verify the language is supported in `config.json`
- Check that the dictionary file exists for the target language
- Ensure the regex pattern correctly matches the text

**Permission errors:**
- The application requires permissions to access clipboard and simulate keyboard input (Ctrl+C, Ctrl+V)
- Grant necessary permissions in system settings if required