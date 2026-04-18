# Safari Deduplicate Tabs

A small Safari extension for macOS that finds duplicate tabs in the current window and closes all but one tab for each repeated URL.

## Overview

When you click the extension button, it scans the current Safari window, groups tabs by exact URL, shows a confirmation list of duplicates, and closes the extra tabs while keeping one tab open for each repeated URL.

## Development

Open the Xcode project:

`SafariDeduplicateTabs/Safari Deduplicate Tabs/Safari Deduplicate Tabs.xcodeproj`

Then:

1. Build and run the macOS app target from Xcode.
2. Enable the extension in Safari settings.
3. Click the toolbar button in Safari to review and remove duplicate tabs.

## Project Structure

- `SafariDeduplicateTabs/` contains the Xcode app and Safari Web Extension targets.
- `SafariDeduplicateTabs/Safari Deduplicate Tabs/Safari Deduplicate Tabs Extension/Resources/` contains the extension UI and manifest.
