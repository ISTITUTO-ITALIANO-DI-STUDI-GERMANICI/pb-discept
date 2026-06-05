import { html, css } from "lit";
import { UtBase } from "../../utilities/base.js";
import { CpTooltip } from "../../components/templates/tooltip.js";

import "@material/web/button/text-button.js";
import "@material/web/button/filled-button.js";
import "@material/web/button/outlined-button.js";
import "@material/web/button/filled-tonal-button.js";

export class CpButton extends UtBase {

    static properties = {
        icon: { type: String },
        label: { type: String },
        tooltip: { type: String },
        variant: { type: String },
        disabled: { type: Boolean },
        fill: { type: Boolean }
    };

    static styles = [

        UtBase.styles,

        css`

            :host {
                display: inline-flex;
            }

            md-text-button {
                min-width: auto;
                padding: 6px 12px;

                transition:
                    background-color 160ms ease,
                    transform 160ms ease,
                    box-shadow 160ms ease;
            }

            md-text-button:hover {
                background-color: rgba(0, 0, 0, 0.06);
                transform: translateY(-1px);
            }

            md-text-button:active {
                transform: translateY(0px) scale(0.98);
            }

            md-text-button,
            md-filled-button,
            md-outlined-button,
            md-filled-tonal-button {

                min-width: auto;

                transition:
                    background-color 160ms ease,
                    transform 160ms ease;
            }

            md-text-button:hover,
            md-filled-button:hover,
            md-outlined-button:hover,
            md-filled-tonal-button:hover {
                transform: translateY(-1px);
            }

            md-text-button:active,
            md-filled-button:active,
            md-outlined-button:active,
            md-filled-tonal-button:active {
                transform: scale(.98);
            }

            .content {
                display: inline-flex;
                align-items: center;
                gap: 6px;
            }

        `
    ];

    _renderButton(content) {

        switch (this.variant) {

            case "filled":
                return html`
                <md-filled-button
                    ?disabled=${this.disabled}
                    aria-label=${this.tooltip || this.label}
                >
                    ${content}
                </md-filled-button>
            `;

            case "outlined":
                return html`
                <md-outlined-button
                    ?disabled=${this.disabled}
                    aria-label=${this.tooltip || this.label}
                >
                    ${content}
                </md-outlined-button>
            `;

            case "tonal":
                return html`
                <md-filled-tonal-button
                    ?disabled=${this.disabled}
                    aria-label=${this.tooltip || this.label}
                >
                    ${content}
                </md-filled-tonal-button>
            `;

            default:
                return html`
                <md-text-button
                    ?disabled=${this.disabled}
                    aria-label=${this.tooltip || this.label}
                >
                    ${content}
                </md-text-button>
            `;
        }
    }

    render() {

        const content = html`

            ${this.icon ? this.renderIcon(this.icon, this.fill) : ""}
            ${this.label ? html`<span>${this.label}</span>` : ""}
        `;

        const button = this._renderButton(content);

        if (!this.tooltip) {
            return button;
        }

        return html`
            <cp-tooltip text=${this.tooltip}>
                ${button}
            </cp-tooltip>
        `;
    }

};

customElements.define("cp-button", CpButton);