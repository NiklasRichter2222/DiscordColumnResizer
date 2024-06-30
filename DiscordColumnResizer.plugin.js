/**
 * @name DiscordColumnResizer
 * @author Niklas
 * @version 1.0.0
 * @description Adjusts the width of various columns in Discord for a personalized layout. Works with other themes
*/

class DiscordColumnResizer {
    constructor() {}

    start() { this.injectCSS(); }

    stop() { this.removeCSS(); }

    injectCSS() {
        const css = `
       
       /* Define the width variables for different elements */
       :root {
           --profile-banner-width: 20px; /* Width of the profile banner */
           --dm-people-column-width: 20px; /* Width of the DM people column */
           --server-member-list-width: 26px; /* Width of the server member list */
       }
       
       /* Modify the width of the profile banner */
       #app-mount > div.appAsidePanelWrapper_bd26cc > div.notAppAsidePanel_bd26cc > div.app_bd26cc > div > div.layers_d4b6c5.layers_a01fb1 > div > div > div > div > div.chat_a7d72e > div.content_a7d72e > div.userPanelOuter_c69a7b.userProfileOuterThemed_c69a7b.theme-dark.custom-theme-background.custom-profile-theme.container_ecc60d {
           resize: horizontal; /* Allow horizontal resizing */
           overflow: auto; /* Show scrollbars when content overflows */
           position: relative;
           width: --profile-banner-width;
           transform: rotateY(180deg); /* Flip the element horizontally */
       }
       
       #app-mount > div.appAsidePanelWrapper_bd26cc > div.notAppAsidePanel_bd26cc > div.app_bd26cc > div > div.layers_d4b6c5.layers_a01fb1 > div > div > div > div > div.chat_a7d72e > div.content_a7d72e > div.userPanelOuter_c69a7b.userProfileOuterThemed_c69a7b.theme-dark.custom-theme-background.custom-profile-theme.container_ecc60d > * {
           transform: rotateY(180deg); /* Flip the children back to normal */
       }
       
       /* Modify the width of the DM people column */
       #app-mount > div.appAsidePanelWrapper_bd26cc > div.notAppAsidePanel_bd26cc > div.app_bd26cc > div > div.layers_d4b6c5.layers_a01fb1 > div > div > div > div > div.sidebar_a4d4d9 {
           resize: horizontal; /* Allow horizontal resizing */
           width: --dm-people-column-width;
           overflow: auto; /* Show scrollbars when content overflows */
       }
       
       /* Modify the width of the server member list */
       #app-mount > div.appAsidePanelWrapper_bd26cc > div.notAppAsidePanel_bd26cc > div.app_bd26cc > div > div.layers_d4b6c5.layers_a01fb1 > div > div > div > div > div.chat_a7d72e > div.content_a7d72e > div.container_cbd271 {
           resize: horizontal; /* Allow horizontal resizing */
           overflow: auto; /* Show scrollbars when content overflows */
           position: relative;
           width: --server-member-list-width;
           transform: rotateY(180deg); /* Flip the element horizontally */
       }
       
       #app-mount > div.appAsidePanelWrapper_bd26cc > div.notAppAsidePanel_bd26cc > div.app_bd26cc > div > div.layers_d4b6c5.layers_a01fb1 > div > div > div > div > div.chat_a7d72e > div.content_a7d72e > div.container_cbd271 > * {
           transform: rotateY(180deg); /* Flip the children back to normal */
       }
        `;
        BdApi.injectCSS('DiscordColumnResizer', css);
    }

    removeCSS() {
        BdApi.clearCSS('DiscordColumnResizer');
    }
}
