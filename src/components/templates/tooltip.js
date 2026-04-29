import { html, css } from 'lit';
import { UtBase } from '../../utilities/base.js';

export class CpTooltip extends UtBase {

    static properties = {
        text: { type: String },
        open: { type: Boolean, state: true },
    };

    constructor() {
        super();
        this.text = '';
        this.open = false;
        this._timeout = null;
    }

    static styles = css`

        :host {
            position: relative;
            display: inline-block;
            overflow: visible;
        }

        .tooltip {
            position: absolute;
            left: 50%;
            bottom: calc(100% + 8px);
            transform: translateX(-50%) translateY(4px);
            background: #333;
            color: white;
            font-size: 12px;
            padding: 6px 10px;
            border-radius: 6px;
            white-space: normal;
            opacity: 0;
            pointer-events: none;
            transition: opacity 150ms ease, transform 150ms ease;
            z-index: 100;
            text-align: center;
            line-height: 1.2;
            max-width: 160px;
            width: max-content;
        }

        .tooltip.visible {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }

        .tooltip::after {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            border-width: 5px;
            border-style: solid;
            border-color: #333 transparent transparent transparent;
        }
    `;

    _show() {
        clearTimeout(this._timeout);
        this._timeout = setTimeout(() => {
            this.open = true;
        }, 300); // delay stile MUI
    }

    _hide() {
        clearTimeout(this._timeout);
        this.open = false;
    }

    render() {
        return html`

      <span
        @mouseenter=${this._show}
        @mouseleave=${this._hide}
        @focus=${this._show}
        @blur=${this._hide}
      >
        <slot></slot>
      </span>

      ${this.text ? html`
        <div class="tooltip ${this.open ? 'visible' : ''}">
          ${this.text}
        </div>
      ` : ''}

    `;
    }

}

customElements.define('cp-tooltip', CpTooltip);