/**
 * @name DiscordColumnResizer
 * @author Niklas
 * @version 1.0.0
 * @description Adjusts the width of various columns in Discord for a personalized layout. Works with other themes
*/

class DiscordColumnResizer {
    constructor() {
        this.resizeObserver = new ResizeObserver(entries => this.onResize(entries));
        this.checkInterval = 1000; // 10 seconds
        this.widths = {
            profileBanner: '200px',
            dmPeopleColumn: '200px',
            serverMemberList: '200px'
        }; // Initialize widths storage

        this.elements = {
            profileBannerDiv: '#app-mount > div.appAsidePanelWrapper_bd26cc > div.notAppAsidePanel_bd26cc > div.app_bd26cc > div > div.layers_d4b6c5.layers_a01fb1 > div > div > div > div > div.chat_a7d72e > div.content_a7d72e > div.userPanelOuter_c69a7b',
            profileBannerAside: '#app-mount > div.appAsidePanelWrapper_bd26cc > div.notAppAsidePanel_bd26cc > div.app_bd26cc > div > div.layers_d4b6c5.layers_a01fb1 > div > div > div > div > div.chat_a7d72e > div.content_a7d72e > aside',
            dmPeopleColumn: '#app-mount > div.appAsidePanelWrapper_bd26cc > div.notAppAsidePanel_bd26cc > div.app_bd26cc > div > div.layers_d4b6c5.layers_a01fb1 > div > div > div > div > div.sidebar_a4d4d9',
            serverMemberList: '#app-mount > div.appAsidePanelWrapper_bd26cc > div.notAppAsidePanel_bd26cc > div.app_bd26cc > div > div.layers_d4b6c5.layers_a01fbf1 > div > div > div > div > div.chat_a7d72e > div.content_a7d72e > div.container_cbd271'
        };
    }

    start() {
        // Delay the execution of the start function's contents by x seconds
        setTimeout(() => {
            this.injectCSS();
            this.observeElements();
            this.loadSettings();
            this.startCheckingWidths();
        }, 6000);
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
        ${this.elements.profileBannerDiv}, ${this.elements.profileBannerAside} {
            resize: horizontal;
            overflow: auto;
            position: relative;
            width: var(--profile-banner-width);
            transform: rotateY(180deg);
        }

        ${this.elements.profileBannerDiv} > *,
        ${this.elements.profileBannerAside} > * {
            transform: rotateY(180deg);
        }

        ${this.elements.dmPeopleColumn} {
            resize: horizontal;
            width: var(--dm-people-column-width);
            overflow: auto;
        }

        ${this.elements.serverMemberList} {
            resize: horizontal;
            overflow: auto;
            position: relative;
            width: var(--server-member-list-width);
            transform: rotateY(180deg);
        }

        ${this.elements.serverMemberList} > * {
            transform: rotateY(180deg);
        }
        `;
        BdApi.injectCSS('DiscordColumnResizer', css);
    }

    removeCSS() {
        BdApi.clearCSS('DiscordColumnResizer');
    }

    observeElements() {
        Object.values(this.elements).forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                this.resizeObserver.observe(element);
            });
        });
    }

    unobserveElements() {
        this.resizeObserver.disconnect();
    }

    onResize(entries) {
        entries.forEach(entry => {
            const target = entry.target;
            // Handle resize event for the element
            this.syncWidths(target);
        });
    }

    syncWidths(resizedElement) {
        const width = getComputedStyle(resizedElement).width;

        if (resizedElement.matches(this.elements.profileBannerDiv)) {
            this.updateElementWidth(this.elements.profileBannerAside, width);
        }
    }

    updateElementWidth(selector, width) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.style.width = width;
        });
        this.widths.profileBanner = width; // Update stored width
        this.saveSettings(); // Save new width
    }

    startCheckingWidths() {
        this.checkIntervalId = setInterval(() => this.checkAndSaveSettings(), this.checkInterval);
    }

    stopCheckingWidths() {
        clearInterval(this.checkIntervalId);
    }

    checkAndSaveSettings() {
        let hasChanges = false;

        Object.keys(this.elements).forEach(key => {
            const selector = this.elements[key];
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                const currentWidth = getComputedStyle(element).width;

                if (this.widths[key] !== currentWidth) {
                    this.widths[key] = currentWidth;
                    hasChanges = true;
                }
            });
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
        BdApi.Data.save("DiscordColumnResizer", "settings", settings);

        // Update CSS variables
        this.updateCSSVariables();
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
        const savedSettings = BdApi.Data.load("DiscordColumnResizer", "settings") || {};

        for (const [key, value] of Object.entries(savedSettings)) {
            const selector = this.getSelectorForKey(key);
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.style.width = value.width;
                this.widths[key] = value.width;
            });
        }

        // Update CSS variables based on saved settings
        this.updateCSSVariables();
    }

    getSelectorForKey(key) {
        return this.elements[key];
    }
}
