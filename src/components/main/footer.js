import { html, css } from 'lit';
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

    static styles = css`

            footer > * {
                text-align: center;
            }

        `;

    render() {
        return html`
            <footer>
                    <p>&copy; Istituto Italiano di Studi Germanici</p>
            </footer>
        `;
    }
}

customElements.define('cp-footer', CpFooter);