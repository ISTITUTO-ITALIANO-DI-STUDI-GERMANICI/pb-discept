// This template manages alerts and notifications across the component.
// It listens for "show-alert" events.

import { html, css } from "lit";
import { UtBase } from "../../utilities/base.js";
import { CONFIG } from "../../utilities/config.js";
import "../../components/templates/button.js";

export class CpAlert extends UtBase {

  static get properties() {
    return {
      messages: { type: Array },
    };
  }

  constructor() {
    super();
    this.messages = [];
    this._listener = this._onAlert.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();

    window.removeEventListener("show-alert", this._listener);
    window.addEventListener("show-alert", this._listener);
  }

  disconnectedCallback() {
    window.removeEventListener("show-alert", this._listener);
    super.disconnectedCallback?.();
  }

  _onAlert(e) {
    const { type, text, color, icon } = e.detail || {};
    this.show(type, text, { color, icon });
  }

  _contrastColor(hex) {

    const c = hex.replace('#', '');

    const r = parseInt(c.substring(0, 2), 16);
    const g = parseInt(c.substring(2, 4), 16);
    const b = parseInt(c.substring(4, 6), 16);

    const brightness =
      (r * 299 + g * 587 + b * 114) / 1000;

    return brightness > 128
      ? '#000'
      : '#fff';
  }

  show(type, text, options = {}) {

    if (!type || !text) return;

    const normalizedType = String(type).toUpperCase();

    const exists = this.messages.find(
      m => m.type === normalizedType && m.text === text
    );
    if (exists) return;

    const cfg = CONFIG.MESSAGE?.[normalizedType] || {};

    const id = Date.now() + Math.random();

    const msg = {
      id,
      type: normalizedType,
      text,
      leaving: false,
      icon: options.icon ?? cfg.ICON ?? cfg.MESSAGE.OPTIONS.DEFAULT.ICON,
      color: options.color ?? cfg.COLOR ?? cfg.MESSAGE.OPTIONS.DEFAULT.COLOR,
    };

    this.messages = [...this.messages, msg];

    setTimeout(() => this._hideMessage(id), CONFIG.MESSAGE.OPTIONS.ALERT_TIMEOUT);
  }

  dynamicMessage(type, template, values = {}) {
    const message = template.replace(
      /\{(\w+)\}/g,
      (_, key) => values[key] ?? `{${key}}`
    );

    this.show(type, message);
  }

  _hideMessage(id) {
    this.messages = this.messages.map(m =>
      m.id === id ? { ...m, leaving: true } : m
    );

    setTimeout(() => {
      this.messages = this.messages.filter(m => m.id !== id);
    }, 400);
  }

  static styles = [

    UtBase.styles,
    
    css`
      :host {
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 999999;
      }

      .alert-container {
        position: fixed;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%);

        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;

        width: min(600px, calc(100vw - 32px));
      }

      .alert {
        pointer-events: auto;

        display: flex;
        align-items: center;
        gap: 12px;

        width: 100%;

        padding: 14px 18px;

        border-radius: 16px;

        box-shadow:
          0 12px 30px rgba(0,0,0,.25);

        backdrop-filter: blur(12px);

        font-size: .95rem;
        font-weight: 500;
      }

      .message {
        flex: 1;
      }

      .icon {
        font-size: 1.2rem;
      }

      .close-btn {
        --md-text-button-container-shape: 50%;
        --md-text-button-container-height: 28px;
        --md-text-button-leading-space: 0;
        --md-text-button-trailing-space: 0;
        flex-shrink: 0;
      }

      .alert-in {
        animation: alertIn .25s ease;
      }

      .alert-out {
        animation: alertOut .25s ease forwards;
      }

      @keyframes alertIn {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes alertOut {
        from {
          opacity: 1;
          transform: translateY(0);
        }
        to {
          opacity: 0;
          transform: translateY(20px);
        }
      }

    `
  ];

  render() {
    return html`
      <div class="alert-container">
        ${this.messages.map(m => html`
          <div
            class="alert ${m.leaving ? 'alert-out' : 'alert-in'}"
            style="
              background:${m.color};
              color:${this._contrastColor(m.color)};
            "
          >
            <span class="icon">${m.icon}</span>

            <div class="message">
              ${m.text}
            </div>

            <cp-button
              class="close-btn"
              icon="close"
              tooltip="Dismiss"
              @click=${() => this._hideMessage(m.id)}
            ></cp-button>
          </div>
        `)}
      </div>
    `;
  }
}

customElements.define("cp-alert", CpAlert);