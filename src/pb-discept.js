// This is the main entry point for the web component application.
// It imports necessary dependencies, defines the main component structure,

import { html } from 'lit';
import { UtBase } from "./utilities/base.js";

import "./components/templates/alert.js"
import "./components/main/header.js";
import "./components/main/footer.js";
import "./views/main.js";


export class PbDiscept extends UtBase {

  static get properties() {
    return {
      ...super.properties,
    };
  }

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  updated(changedProps) {
    super.updated?.(changedProps);
  }

  render() {
    return html`
      <cp-alert id="alert"></cp-alert>
      <cp-header></cp-header>
      <vw-main></vw-main>
      <cp-footer></cp-footer>
    `;
  }

}

customElements.define("pb-discept", PbDiscept);