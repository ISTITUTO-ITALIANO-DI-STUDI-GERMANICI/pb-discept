import { html } from 'lit';
import { UtBase } from "./utilities/base.js";

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
      <cp-header></cp-header>
      <vw-main></vw-main>
      <cp-footer></cp-footer>
    `;
  }

}

customElements.define("pb-discept", PbDiscept);