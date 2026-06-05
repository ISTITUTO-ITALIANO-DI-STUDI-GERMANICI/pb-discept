// This module defines the UtBase class, which serves as a base class for all components in the application.
// It extends LitElement and includes common functionality such as importing dependencies,
// handling alerts, and applying global styles.

import { LitElement, html, css } from 'lit';
import { styles as typescaleStyles } from '@material/web/typography/md-typescale-styles.js';
import { pbMixin } from "./lib/pb-mixin.js";
import { CONFIG } from "./config.js";

import '@material/web/all.js';

/* ─────────────────────────────────────────────
   Material Typography init (once only)
───────────────────────────────────────────── */
if (!window.__material_initialized__) {
    window.__material_initialized__ = true;

    if (typescaleStyles.styleSheet) {
        document.adoptedStyleSheets = [
            ...document.adoptedStyleSheets,
            typescaleStyles.styleSheet
        ];
    }
}

/* ─────────────────────────────────────────────
   MONACO GLOBAL LOADER (AMD CDN MODE)
───────────────────────────────────────────── */

function loadMonaco() {

    if (window.__monaco_loaded__) {
        return Promise.resolve(window.monaco);
    }

    if (window.__monaco_loading__) {
        return window.__monaco_loading__;
    }

    window.__monaco_loading__ = new Promise((resolve, reject) => {

        const script = document.createElement("script");
        script.src =
            "https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs/loader.js";

        script.onload = () => {
            require.config({
                paths: {
                    vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs"
                }
            });

            require(["vs/editor/editor.main"], () => {
                window.__monaco_loaded__ = true;

                // Inject Monaco CSS into document head once (for light DOM).
                // Shadow DOM hosts must additionally call _injectMonacoStylesInto(shadowRoot).
                if (!document.querySelector('#monaco-css-global')) {
                    const link = document.createElement('link');
                    link.id   = 'monaco-css-global';
                    link.rel  = 'stylesheet';
                    link.href = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs/editor/editor.main.css';
                    document.head.appendChild(link);
                }

                resolve(window.monaco);
            });
        };

        script.onerror = (err) => {
            console.error("[UtBase] Monaco loader failed", err);
            reject(err);
        };

        document.head.appendChild(script);
    });

    return window.__monaco_loading__;
}

/* ─────────────────────────────────────────────
   BASE CLASS
───────────────────────────────────────────── */
export class UtBase extends pbMixin(LitElement) {

    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();
        this._importDependencies();
        this._ensureMonaco();
    }

    /**
     * Ensure Monaco is available globally.
     */
    async _ensureMonaco() {
        try {
            await loadMonaco();
        } catch (e) {
            console.error("[UtBase] Monaco failed to initialize", e);
        }
    }

    /**
     * Inject the Monaco editor stylesheet into a shadow root so that the
     * editor renders correctly inside shadow DOM.
     * Call this from firstUpdated() in any component that hosts <cp-monaco>.
     *
     * @param {ShadowRoot} shadowRoot
     */
    _injectMonacoStylesInto(shadowRoot) {
        if (!shadowRoot) return;
        if (shadowRoot.querySelector('#monaco-css')) return;

        const link = document.createElement('link');
        link.id   = 'monaco-css';
        link.rel  = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs/editor/editor.main.css';
        shadowRoot.prepend(link);
    }

    /* ─────────────────────────────────────────────
       ALERT SYSTEM
    ───────────────────────────────────────────── */
    alert(type, message, values = {}) {

        let text = message;

        if (typeof text === "function") {
            text = text(...Object.values(values));
        }

        if (typeof text === "string") {
            text = text.replace(
                /\{(\w+)\}/g,
                (_, key) => values[key] ?? `{${key}}`
            );
        }

        if (!text) return;

        window.dispatchEvent(
            new CustomEvent("show-alert", {
                detail: {
                    type,
                    text,
                    color: CONFIG.MESSAGE[type]?.COLOR,
                    icon: CONFIG.MESSAGE[type]?.ICON
                }
            })
        );
    }

    /* ─────────────────────────────────────────────
       GLOBAL DEPENDENCIES
    ───────────────────────────────────────────── */
    _importDependencies() {

        const head = document.head;

        if (!document.querySelector('link[data-material-symbols]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href =
                'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL,GRAD,opsz@400,1,0,24';
            link.setAttribute('data-material-symbols', 'true');
            head.appendChild(link);
        }

        if (!document.querySelector('link[data-material-symbols-rounded]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href =
                'https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:wght,FILL,GRAD,opsz@400,1,0,24';
            link.setAttribute('data-material-symbols-rounded', 'true');
            head.appendChild(link);
        }

        if (!document.querySelector('link[data-material-symbols-sharp]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href =
                'https://fonts.googleapis.com/css2?family=Material+Symbols+Sharp:wght,FILL,GRAD,opsz@400,1,0,24';
            link.setAttribute('data-material-symbols-sharp', 'true');
            head.appendChild(link);
        }

        if (!document.querySelector("#webcomponents-loader")) {
            const script = document.createElement("script");
            script.src =
                "https://cdn.jsdelivr.net/npm/@webcomponents/webcomponentsjs@2.6.0/webcomponents-loader.min.js";
            script.id = "webcomponents-loader";
            head.appendChild(script);
        }
    }

    /* ─────────────────────────────────────────────
       GLOBAL STYLES
    ───────────────────────────────────────────── */
    static styles = css`
        :host {
            --md-sys-typescale-font-family: 'Roboto', sans-serif;
            font-family: var(--md-sys-typescale-font-family);
        }

        :host * {
            font-family: inherit;
        }

        /*
         * Material Symbols classes must be re-declared inside every shadow root
         * because @font-face / Google Fonts <link> in document.head do NOT
         * pierce shadow DOM. The font binary is already loaded globally by
         * _importDependencies(); only the CSS class that activates it needs
         * to live inside each shadow root.
         */
        .material-symbols-outlined,
        .material-symbols-rounded,
        .material-symbols-sharp {
            font-family: 'Material Symbols Outlined', sans-serif;
            font-weight: normal;
            font-style: normal;
            font-size: 20px;
            line-height: 1;
            letter-spacing: normal;
            text-transform: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            white-space: nowrap;
            word-wrap: normal;
            direction: ltr;
            vertical-align: middle;
            -webkit-font-smoothing: antialiased;
            font-variation-settings:
                'FILL' 0,
                'wght' 400,
                'GRAD' 0,
                'opsz' 24;
            transition: font-variation-settings 160ms ease;
        }

        .material-symbols-rounded {
            font-family: 'Material Symbols Rounded', sans-serif;
        }

        .material-symbols-sharp {
            font-family: 'Material Symbols Sharp', sans-serif;
        }

        .fill {
            font-variation-settings:
                'FILL' 1,
                'wght' 400,
                'GRAD' 0,
                'opsz' 24;
        }
    `;

    // Rendering Material Web icons is a common task, so we provide a helper method for it.
    renderIcon(icon, fill = false) {
        return html`
            <span class="material-symbols-outlined ${fill ? 'fill' : ''}">
                ${icon}
            </span>
        `;
    }

}
