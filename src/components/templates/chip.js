// This template creates a chip component that can be used in various contexts.
// It supports different variants (assist, filter, input, suggestion) and can display
// a menu with actions when clicked. The component emits events when selected or when an action is triggered.

import { LitElement, html, css } from "lit";
import { UtBase } from "../../utilities/base.js";

import "@material/web/chips/assist-chip.js";
import "@material/web/chips/filter-chip.js";
import "@material/web/chips/input-chip.js";
import "@material/web/chips/suggestion-chip.js";

import "@material/web/iconbutton/icon-button.js";
import "@material/web/menu/menu.js";
import "@material/web/menu/menu-item.js";
import "@material/web/icon/icon.js";

export class CpChip extends UtBase {

  static properties = {
    label: { type: String },
    value: { type: String },
    variant: { type: String },
    actions: { type: Array },
    open: { type: Boolean, state: true },
  };

  static styles = css`
    :host {
      display: inline-block;
    }

    .wrapper {
      display: flex;
      gap: 6px;
      align-items: center;
      position: relative;
    }

    .chip-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
    }

    .chip-content {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .chip-icon ::slotted(*) {
      display: block;
    }
  `;

  constructor() {
    super();
    this.variant = "assist";
    this.actions = [];
    this.open = false;
  }

  emit(name, detail = {}) {
    this.dispatchEvent(
      new CustomEvent(name, {
        detail: { value: this.value, ...detail },
        bubbles: true,
        composed: true,
      })
    );
  }

  toggleMenu(e) {
    e.stopPropagation();
    this.open = !this.open;
  }

  handleAction(action) {
    this.emit(action.event, action);
    this.open = false;
  }

  renderIconSlot() {
    return html`
      <span slot="icon" class="chip-icon">
        <slot name="leading-icon"></slot>
      </span>
    `;
  }

  renderChip() {
    const onClick = () => this.emit("select");

    switch (this.variant) {

      case "filter":
        return html`
          <md-filter-chip @click=${onClick}>
            <span class="chip-content">
              <slot name="leading-icon"></slot>
              <span class="chip-label">${this.label}</span>
            </span>
          </md-filter-chip>
        `;

      case "input":
        return html`
          <md-input-chip @click=${onClick}>
            <span class="chip-content">
              <slot name="leading-icon"></slot>
              <span class="chip-label">${this.label}</span>
            </span>
          </md-input-chip>
        `;

      case "suggestion":
        return html`
          <md-suggestion-chip @click=${onClick}>
            <span class="chip-content">
              <slot name="leading-icon"></slot>
              <span class="chip-label">${this.label}</span>
            </span>
          </md-suggestion-chip>
        `;

      default:
        return html`
          <md-assist-chip @click=${onClick}>
            <span class="chip-content">
              <slot name="leading-icon"></slot>
              <span class="chip-label">${this.label}</span>
            </span>
          </md-assist-chip>
        `;
    }
  }

  renderMenu() {
    if (!this.actions.length) return null;

    return html`
      <md-icon-button @click=${this.toggleMenu}>
        <md-icon>more_vert</md-icon>
      </md-icon-button>

      ${this.open
        ? html`
            <md-menu open style="position:absolute; margin-top:40px;">
              ${this.actions.map(
                (a) => html`
                  <md-menu-item @click=${() => this.handleAction(a)}>
                    ${a.icon
                      ? html`
                          <md-icon slot="start">${a.icon}</md-icon>
                        `
                      : ""}
                    ${a.label}
                  </md-menu-item>
                `
              )}
            </md-menu>
          `
        : ""}
    `;
  }

  render() {
    return html`
      <div class="wrapper">
        ${this.renderChip()}
        ${this.renderMenu()}
      </div>
    `;
  }
}

customElements.define("cp-chip", CpChip);