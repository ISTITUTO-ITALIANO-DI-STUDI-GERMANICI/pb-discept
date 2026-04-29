import { html } from 'lit';
import { UtBase } from "../../utilities/base.js";

export class CpHeader extends UtBase {

    static get properties() {
        return {
            ...super.properties
        };
    }

    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();
    }

    render() {
        return html`
            <header>
                <h1>DIScEPT</h1>
                <p>This is the header area!</p>
            </header>
        `;
    }
}

customElements.define('cp-header', CpHeader);