/**
 * @name DiscordColumnResizer
 * @author Niklas
 * @version 1.0.0
 * @description Adjusts the width of various columns in Discord for a personalized layout. Works with other themes
*/

class DiscordColumnResizer {
    constructor() {
        this.resizeObserver = new ResizeObserver(entries => this.onResize(entries));
        this.isResizing = false;
        this.currentResizingElement = null;
        this.checkInterval = 1000; // 10 seconds
        this.widths = {
            profileBanner: '200px',
            dmPeopleColumn: '200px',
            serverMemberList: '200px'
        }; // Initialize widths storage
    }

    start() {
        this.injectCSS();
        this.observeElements();
        this.loadSettings();
        this.startCheckingWidths();
    }

    stop() {
        this.removeCSS();
        this.unobserveElements();
        this.stopCheckingWidths();
    }

    injectCSS() {
        const css = `
        :root {
            --profile-banner-width: ${this.widths.profileBanner};
            --dm-people-column-width: ${this.widths.dmPeopleColumn};
            --server-member-list-width: ${this.widths.serverMemberList};
        }
    #app-mount > div.appAsidePanelWrapper_bd26cc > div.notAppAsidePanel_bd26cc > div.app_bd26cc > div > div.layers_d4b6c5.layers_a01fb1 > div > div > div > div > div.chat_a7d72e > div.content_a7d72e > div.userPanelOuter_c69a7b.userProfileOuterThemed_c69a7b.theme-dark.custom-theme-background.custom-profile-theme.container_ecc60d {
        resize: horizontal;
        overflow: auto;
        position: relative;
        width: var(--profile-banner-width);
        transform: rotateY(180deg);
    }

    #app-mount > div.appAsidePanelWrapper_bd26cc > div.notAppAsidePanel_bd26cc > div.app_bd26cc > div > div.layers_d4b6c5.layers_a01fb1 > div > div > div > div > div.chat_a7d72e > div.content_a7d72e > div.userPanelOuter_c69a7b.userProfileOuterThemed_c69a7b.theme-dark.custom-theme-background.custom-profile-theme.container_ecc60d > * {
        transform: rotateY(180deg);
    }

    #app-mount > div.appAsidePanelWrapper_bd26cc > div.notAppAsidePanel_bd26cc > div.app_bd26cc > div > div.layers_d4b6c5.layers_a01fb1 > div > div > div > div > div.sidebar_a4d4d9 {
        resize: horizontal;
        width: var(--dm-people-column-width);
        overflow: auto;
    }

    #app-mount > div.appAsidePanelWrapper_bd26cc > div.notAppAsidePanel_bd26cc > div.app_bd26cc > div > div.layers_d4b6c5.layers_a01fb1 > div > div > div > div > div.chat_a7d72e > div.content_a7d72e > div.container_cbd271 {
        resize: horizontal;
        overflow: auto;
        position: relative;
        width: var(--server-member-list-width);
        transform: rotateY(180deg);
    }

    #app-mount > div.appAsidePanelWrapper_bd26cc > div.notAppAsidePanel_bd26cc > div.app_bd26cc > div > div.layers_d4b6c5.layers_a01fb1 > div > div > div > div > div.chat_a7d72e > div.content_a7d72e > div.container_cbd271 > * {
        transform: rotateY(180deg);
    }
    `;
    BdApi.injectCSS('DiscordColumnResizer', css);
}

    removeCSS() {
        BdApi.clearCSS('DiscordColumnResizer');
    }

    observeElements() {
        const selectors = this.getSelectors();

        Object.values(selectors).forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                this.resizeObserver.observe(element);
            } else {
                console.warn(`Element not found for selector: ${selector}`);
            }
        });
    }

    unobserveElements() {
        this.resizeObserver.disconnect();
    }

    getSelectors() {
        return {
            profileBanner: '#app-mount > div.appAsidePanelWrapper_bd26cc > div.notAppAsidePanel_bd26cc > div.app_bd26cc > div > div.layers_d4b6c5.layers_a01fb1 > div > div > div > div > div.chat_a7d72e > div.content_a7d72e > div.userPanelOuter_c69a7b.userProfileOuterThemed_c69a7b.theme-dark.custom-theme-background.custom-profile-theme.container_ecc60d',
            dmPeopleColumn: '#app-mount > div.appAsidePanelWrapper_bd26cc > div.notAppAsidePanel_bd26cc > div.app_bd26cc > div > div.layers_d4b6c5.layers_a01fb1 > div > div > div > div > div.sidebar_a4d4d9',
            serverMemberList: '#app-mount > div.appAsidePanelWrapper_bd26cc > div.notAppAsidePanel_bd26cc > div.app_bd26cc > div > div.layers_d4b6c5.layers_a01fb1 > div > div > div > div > div.chat_a7d72e > div.content_a7d72e > div.container_cbd271'
        };
    }

    startCheckingWidths() {
        this.checkIntervalId = setInterval(() => this.checkAndSaveSettings(), this.checkInterval);
    }

    stopCheckingWidths() {
        clearInterval(this.checkIntervalId);
    }

    checkAndSaveSettings() {
        const selectors = this.getSelectors();
        let hasChanges = false;

        Object.keys(selectors).forEach(key => {
            const selector = selectors[key];
            const element = document.querySelector(selector);

            if (element) {
                const currentWidth = getComputedStyle(element).width;

                if (this.widths[key] !== currentWidth) {
                    this.widths[key] = currentWidth;
                    hasChanges = true;
                }
            }
        });

        if (hasChanges) {
            this.saveSettings();
        }
    }

    saveSettings() {
        const settings = {};

        Object.keys(this.widths).forEach(key => {
            settings[key] = { width: this.widths[key] };
        });

        // Save settings
        BdApi.Data.save("myPlugin", "settings", settings);

        // Update CSS variables
        this.updateCSSVariables();
        this.injectCSS();
    }

    updateCSSVariables() {
        const root = document.documentElement;

        Object.keys(this.widths).forEach(key => {
            const cssVariable = this.getCSSVariableForKey(key);
            if (cssVariable) {
                root.style.setProperty(cssVariable, this.widths[key]);
            }
        });
    }

    getCSSVariableForKey(key) {
        const variableMap = {
            profileBanner: '--profile-banner-width',
            dmPeopleColumn: '--dm-people-column-width',
            serverMemberList: '--server-member-list-width'
        };
        return variableMap[key];
    }

    loadSettings() {
        const savedSettings = BdApi.Data.load("myPlugin", "settings") || {};

        for (const [key, value] of Object.entries(savedSettings)) {
            const selector = this.getSelectorForKey(key);
            const element = document.querySelector(selector);
            if (element) {
                element.style.width = value.width;
                this.widths[key] = value.width;
            }
        }

        // Update CSS variables based on saved settings
        this.updateCSSVariables();
    }

    getSelectorForKey(key) {
        const selectors = this.getSelectors();
        return selectors[key];
    }
}
