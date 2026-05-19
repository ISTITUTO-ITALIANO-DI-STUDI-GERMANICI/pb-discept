import { html, css } from 'lit';
import { UtBase } from "../../utilities/base.js";
import { CpHeaderMenu } from "./headerMenu.js";

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

    static styles = 
        css`
            header {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                padding: 20px;
            }`;


    render() {
        return html`
            <header>
                <h1>DIScEPT</h1>
                <cp-header-menu></cp-header-menu>
            </header>
        `;
    }
}

customElements.define('cp-header', CpHeader);