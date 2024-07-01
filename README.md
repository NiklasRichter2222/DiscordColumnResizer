# DiscordColumnResizer

**Author:** Niklas  
**Version:** 1.3.2 
**Description:** Customize the width of columns in Discord for a personalized layout.

## Features

- Adjusts widths of:
  - Profile Banner
  - DM People Column
  - Server Member List
- Saves and applies width settings on restart

## Installation

1. **Install BetterDiscord** from [BetterDiscord website](https://betterdiscord.app/).
2. **Download** `DiscordColumnResizer.js`.
3. **Move** the file to `%appdata%/BetterDiscord/plugins` (Windows) or `~/.config/BetterDiscord/plugins` (Linux).
4. **Enable** the plugin in BetterDiscord settings.

## Configuration

Default widths are set in the code:

```javascript
this.widths = {
    profileBanner: '200px',
    dmPeopleColumn: '200px',
    serverMemberList: '200px'
};
