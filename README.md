# Safari Deduplicate Tabs

This repository contains a Safari extension project for macOS that finds duplicate tabs in the current Safari window and closes all but one tab for each repeated URL after confirmation.

## What it does

When the extension is triggered from the Safari toolbar:

1. It scans only the current window.
2. It groups tabs by identical URL.
3. It shows a confirmation dialog listing one line per repeated URL in this format:

   ```text
   {tab title (truncated)} - ({url (truncated)}) ({number of tabs with this url})
   ```

4. When you confirm, it closes every duplicate tab and leaves one tab open for each URL.

## Project layout

- `SafariDeduplicateTabs/` contains the full Xcode project for the app and extension.
- `SafariDeduplicateTabs/Safari Deduplicate Tabs/Safari Deduplicate Tabs Extension/Resources/` contains the popup HTML, CSS, JavaScript, and manifest used by the extension.

## Open the Safari project

Open:

`SafariDeduplicateTabs/Safari Deduplicate Tabs/Safari Deduplicate Tabs.xcodeproj`

## Run it

1. Open the generated Xcode project.
2. Build and run the macOS app target.
3. Enable the extension in Safari settings.
4. Click the extension toolbar button to review and remove duplicate tabs in the current window.
