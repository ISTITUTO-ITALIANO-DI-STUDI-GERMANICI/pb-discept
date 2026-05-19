import { LitElement, css } from 'lit';
import '@material/web/all.js';
import { styles as typescaleStyles } from '@material/web/typography/md-typescale-styles.js';
import { pbMixin } from "./lib/pb-mixin.js";

if (!window.__material_initialized__) {
    window.__material_initialized__ = true;

    if (typescaleStyles.styleSheet) {
        document.adoptedStyleSheets = [
            ...document.adoptedStyleSheets,
            typescaleStyles.styleSheet
        ];
    }
}

export class UtBase extends pbMixin(LitElement) {

    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();
        this._importDependencies();
    }

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

    static styles = css`
        :host {
            --md-sys-typescale-font-family: 'Roboto', sans-serif;
            font-family: var(--md-sys-typescale-font-family);
        }

        :host * {
            font-family: inherit;
        }
    `;
}