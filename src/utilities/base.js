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