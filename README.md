# Node Layout Switcher

[![CI](https://github.com/koenigstag/node-layout-switcher/workflows/CI/badge.svg)](https://github.com/koenigstag/node-layout-switcher/actions)
[![Security Check](https://github.com/koenigstag/node-layout-switcher/workflows/Security%20Check/badge.svg)](https://github.com/koenigstag/node-layout-switcher/actions)
[![Release](https://github.com/koenigstag/node-layout-switcher/workflows/Release/badge.svg)](https://github.com/koenigstag/node-layout-switcher/actions)
[![npm version](https://badge.fury.io/js/node-layout-switcher.svg)](https://badge.fury.io/js/node-layout-switcher)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A Node.js utility for automatic keyboard layout switching and text conversion between different languages. Supports English, Russian, Ukrainian, German, French, Czech and Polish layouts with hotkey-based text replacement.

The idea was inspired by the [Punto Switcher](https://ru.wikipedia.org/wiki/Punto_Switcher) application, but this implementation is built using Node.js and is cross-platform compatible.

## Features

- 🔄 **Automatic text conversion** between different keyboard layouts
- 🌍 **Multi-language support**: English, Russian, Ukrainian, German, French, Czech, Polish
- 🔥 **Hotkey activation**: Convert selected text with customizable key combinations
- 📋 **Clipboard integration**: Seamless text replacement using system clipboard
- ⚙️ **Configurable**: Easy configuration through JSON files

## How It Works

1. **Hotkey Detection**: The application monitors for the configured hotkeys
2. **Language Recognition**: Uses regex patterns to identify the current language of selected text
3. **Layout Mapping**: Maps characters from one layout to another selected using dictionary files
4. **Text Replacement**: Replaces the selected text with the converted version

## Usage

### Basic Usage

1. Select text in any input field using your mouse or keyboard
2. Press hotkey to convert the text between layouts (current layout detected automatically based on the selected text)
3. The selected text will be replaced with the converted text in the same input field

### Configuration

The application supports flexible configuration through `config.json` files. The application searches for configuration files in the following order:

1. **Environment variable**: `CONFIG_PATH` (full path to config file)
2. **Current directory**: `./config.json` (next to executable)
3. **User home**: `~/.node-layout-switcher/config.json`
4. **Built-in**: `./assets/config.json` (default)

#### Creating Custom Configuration

**Option 1: Create config in current directory**
```bash
# For executable files
./node-layout-switcher --init-config

# For npm installation
npx node-layout-switcher --init-config
```

**Option 2: Create config in user home directory**
```bash
# For executable files
./node-layout-switcher --init-user-config

# For npm installation
npx node-layout-switcher --init-user-config
```

**Option 3: Using environment variable**
```bash
# Set custom config path
export CONFIG_PATH="/path/to/your/config.json"
./node-layout-switcher
```

#### Configuration Structure

The `config.json` file allows you to customize:
- **Key bindings**: Change hotkey combinations
- **Actions**: Modify what happens when keys are pressed
- **Language priority**: Set conversion preferences

Example configuration:
```json
{
  "keyBindings": {
    "CTRL+SHIFT+P": {
      "action": "convertSelectedText",
      "description": "Press ${keyBinding} to convert selected text."
    }
  }
}
```

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

## Special Characters Support (Alt Combinations)

The application supports special characters through Alt combinations for various languages:

### 🇺🇦 Ukrainian
- `Alt + U` → `ґ` (G with upturn)
- `Alt + Shift + U` → `Ґ` (Capital G with upturn)

### 🇩🇪 German
- `Alt + S` → `ß` (Eszett/Sharp S)
- `Alt + E` → `€` (Euro symbol)

### 🇵🇱 Polish
- `Alt + A` → `ą`, `Alt + C` → `ć`, `Alt + E` → `ę`
- `Alt + L` → `ł`, `Alt + N` → `ń`, `Alt + O` → `ó`
- `Alt + S` → `ś`, `Alt + Z` → `ź`, `Alt + X` → `ż`
- Capital variants with `Alt + Shift + [Letter]`

### 🇫🇷 French
- `Alt + A` → `à`, `Alt + E` → `è`, `Alt + U` → `ù`
- `Alt + I` → `î`, `Alt + O` → `ô`, `Alt + C` → `ç`

### 🇨🇿 Czech
- `Alt + A` → `á`, `Alt + E` → `é`, `Alt + I` → `í`
- `Alt + O` → `ó`, `Alt + U` → `ú`, `Alt + C` → `č`
- `Alt + D` → `ď`, `Alt + N` → `ň`, `Alt + R` → `ř`
- `Alt + S` → `š`, `Alt + T` → `ť`, `Alt + Z` → `ž`
- Capital variants with `Alt + Shift + [Letter]`

### 🇷🇺 Russian
- `Alt + E` → `є` (Ukrainian-style E)
- `Alt + I` → `і` (Ukrainian-style I)
- Capital variants with `Alt + Shift + [Letter]`

> **Note:** Alt combinations map to base character positions in the English QWERTY layout for cross-layout compatibility.

## Contributing

This project is open for contributions! For detailed information on how to contribute:

- 🤝 **[Contributing Guidelines](CONTRIBUTING.md)** - How to contribute, report bugs, and submit features
- 📚 **[Development Guide](docs/DEVELOPMENT.md)** - Setup, building, testing, and project architecture

Quick start for contributors:
```bash
git clone https://github.com/koenigstag/node-layout-switcher.git
cd node-layout-switcher
npm install
npm run build
npm test
```

## Installation

### Option 1: Download Pre-built Executables (Recommended)

1. Download the latest release archive from [Releases](../../releases):
   - **Windows**: `node-layout-switcher-vX.X.X-windows.zip`
   - **macOS/Linux**: `node-layout-switcher-vX.X.X-unix.tar.gz`

2. Extract the archive:
   - **Windows**: Right-click the ZIP file and select "Extract All..." or use 7-Zip
   - **macOS/Linux**: `tar -xzf node-layout-switcher-vX.X.X-unix.tar.gz`

3. Navigate to the extracted folder:
   ```bash
   cd node-layout-switcher-vX.X.X
   ```

4. Run the executable:
   - **Windows**: Double-click `node-layout-switcher-win.exe` or run in cmd/PowerShell
   - **Linux**: `./node-layout-switcher-linux`
   - **macOS**: `./node-layout-switcher-macos`

5. Configure the application by editing `assets/config.json` if needed

### Option 2: Install via NPM

```bash
npm install -g node-layout-switcher
npx node-layout-switcher
```

### Option 3: Build from Source

1. Clone the repository:
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

5. Run the application:
   ```bash
   npm start
   ```

6. (Optional) Build executable for your platform:
   ```bash
   # Windows .exe
   npm run build:exe
   
   # All platforms
   npm run build:exe:all
   ```

## Configuration

### Main Configuration (`assets/config.json`)

- `selectedTuple`: Array of languages to convert between (e.g., `["en", "ru"]` for English to Russian and vise-versa).
- `langRegexps`: Object containing regex patterns to detect language of selected text.
- `keyBindings`: Object defining hotkeys for text specific actions. Each key maps to an action and a description.
- `dictionaryPaths`: Object mapping language codes to their respective dictionary file paths.
  - Each dictionary stores keyboard layout information using arrays for each row:
    - `numberRow` / `numberRowShifted`: Arrays for number row characters (normal and shifted)
    - `topRow` / `topRowShifted`: Arrays for top letter row (QWERTY row)
    - `middleRow` / `middleRowShifted`: Arrays for middle letter row (ASDF row)
    - `bottomRow` / `bottomRowShifted`: Arrays for bottom letter row (ZXCV row)
    - `keyMapping`: Object mapping physical key codes to array indices
    - Example for English dictionary:
      ```json
      {
        "numberRow": ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "\\"],
        "topRow": ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]"],
        "middleRow": ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'"],
        "bottomRow": ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/"],
        "keyMapping": {
          "KeyQ": 0, "KeyW": 1, "KeyE": 2, "KeyR": 3
        }
      }
      ```

### Example Configuration
Here is a basic example of a valid [`config.json`](assets/config.json) file that supports English and Russian languages with QWERTY layout:

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

- [`en.qwerty.json`](assets/dictionaries/en.qwerty.json) - English QWERTY layout
- [`en.dvorak.json`](assets/dictionaries/en.dvorak.json) - English DVORAK layout (example provided)
- [`ru.qwerty.json`](assets/dictionaries/ru.qwerty.json) - Russian ЙЦУКЕН layout
- [`uk.qwerty.json`](assets/dictionaries/uk.qwerty.json) - Ukrainian ЙЦУКЕН layout
- [`de.qwertz.json`](assets/dictionaries/de.qwertz.json) - German QWERTZ layout
- [`fr.azerty.json`](assets/dictionaries/fr.azerty.json) - French AZERTY layout
- [`cz.qwertz.json`](assets/dictionaries/cz.qwertz.json) - Czech QWERTZ layout
- [`pl.qwerty.json`](assets/dictionaries/pl.qwerty.json) - Polish QWERTY layout

#### Contribution is welcome to add more languages and layouts! Just create a new dictionary file or edit an existing one in the [`dictionaries`](assets/dictionaries/) folder and update the [`config.json`](assets/config.json) accordingly.

## Testing

For detailed testing information, see [Testing Documentation](docs/TESTING.md).

Quick test commands:
- `npm test` - Run comprehensive test suite
- `npm run test:full` - Run all tests including Ukrainian real-world scenarios

## Development & Contributing

For development setup, building, and contributing guidelines:

- 📚 **[Development Guide](docs/DEVELOPMENT.md)** - Setup, building, testing, and project architecture
- 🤝 **[Contributing Guidelines](CONTRIBUTING.md)** - How to contribute, report bugs, and submit features
- 🧪 **[Testing Documentation](docs/TESTING.md)** - Comprehensive testing information

Quick start for developers:
```bash
git clone https://github.com/koenigstag/node-layout-switcher.git
cd node-layout-switcher
npm install
npm run build
npm test
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
- Verify the language is supported in [`config.json`](assets/config.json)
- Check that the dictionary file exists for the target language
- Ensure the regex pattern correctly matches the text

**Permission errors:**
- The application requires permissions to access clipboard and simulate keyboard input (Ctrl+C, Ctrl+V)
- Grant necessary permissions in system settings if required