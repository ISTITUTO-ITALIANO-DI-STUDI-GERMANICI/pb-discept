import { html } from 'lit';
import { UtBase } from "../../utilities/base.js";

export class CpFooter extends UtBase {

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
            <footer>
                <div>
                    <p>&copy; Istituto Italiano di Studi Germanici</p>
                    <p>This is the footer area!</p>
                </div>
            </footer>
        `;
    }
}

customElements.define('cp-footer', CpFooter);