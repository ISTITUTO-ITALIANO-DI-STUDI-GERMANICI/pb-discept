// Helps connecting to an eXist-db instance.
// This loads XML data from the database giving credentials and a proxy eventually.

import { html, css } from "lit";
import { UtBase } from "../../../../utilities/base.js";
import { ExistDBClient } from "../../../../utilities/connection/existdb-client.js";
import { ALERT } from "../../../../utilities/alert/alerts.js";
import { CONFIG } from "../../../../utilities/config.js";

import "../../../../utilities/connection/existdb.js";

import "@material/web/dialog/dialog.js";
import "@material/web/textfield/outlined-text-field.js";
import "../../../templates/button.js";

const cfg = CONFIG.EXISTDB.DEFAULT;

export class CpExistdbSync extends UtBase {

  static properties = {
    open: { type: Boolean },
    baseUrl: { state: true },
    collection: { state: true },
    user: { state: true },
    password: { state: true },
    proxyUrl: { state: true },
    connectionStatus: { state: true },
  };

  constructor() {
    super();

    this.open = false;
    this.storageKey = "existdb-config";
    this.defaults = {
      baseUrl: cfg.URL,
      collection: cfg.COLLECTION,
      user: cfg.USER,
      password: cfg.PASSWORD,
      proxyUrl: cfg.PROXY,
    };

    this.baseUrl = this.defaults.baseUrl;
    this.collection = this.defaults.collection;
    this.user = this.defaults.user;
    this.password = this.defaults.password;
    this.proxyUrl = this.defaults.proxyUrl;
    this.connectionStatus = "idle"; // idle | ok | error | testing
  }

  static styles = css`
    :host {
      display: block;
      --md-sys-typescale-font-family: "Open Sans", sans-serif;
      --md-dialog-container-shape: 24px;
      --md-dialog-container-color: #ffffff;
      --md-outlined-text-field-container-shape: 16px;
      --md-filled-button-container-shape: 14px;
      --md-text-button-container-shape: 14px;
      --md-filled-button-container-height: 42px;
      --md-text-button-container-height: 42px;
    }

    :host * {
      font-family: inherit;
      box-sizing: border-box;
    }

    md-dialog::part(container) {
      overflow: hidden;
    }

    .headline {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-weight: 900;
    }

    .content {
      padding-top: 12px;
    }

    .form {
      display: flex;
      flex-direction: column;
      gap: 18px;
      min-width: 460px;
    }

    md-outlined-text-field {
      width: 100%;
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 10px;
      padding-top: 16px;
      margin-top: 8px;
      border-top: 1px solid #eee;
    }

    cp-button {
      font-weight: 600;
      letter-spacing: 0.08em;
      font-size: 0.78rem;
    }

    @media (max-width: 640px) {
      .form {
        min-width: unset;
        width: 100%;
      }

      .actions {
        flex-wrap: wrap;
      }

      .actions cp-button {
        flex: 1;
      }
    }
  `;

  openDialog() {
    this.open = true;
  }

  closeDialog() {
    this.open = false;
  }

  /**
   * Fetch the first XML file from eXist-db and broadcast it via the
   * "tei-loaded" custom event so that VwTranslations (and any other listener)
   * can pick it up — exactly the same contract as the local file-upload path.
   */
  async loadConfig() {
    try {
      const client = new ExistDBClient({
        baseUrl: this.baseUrl.trim(),
        collection: this.collection.trim(),
        user: this.user.trim(),
        password: this.password.trim(),
        proxyUrl: this.proxyUrl.trim(),
      });

      const files = await client.list();

      if (!files.length) {
        this.alert("error", ALERT.ERROR.SYNC.EMPTY);
        return;
      }

      const firstFile = files[0];
      const xml = await client.get(firstFile);

      window.dispatchEvent(new CustomEvent("tei-loaded", {
        detail: { xml, source: "existdb", filename: firstFile }
      }));

      this.alert("success", ALERT.SUCCESS.SYNC.LOADED);
      this.closeDialog();

    } catch (err) {
      console.error("Load failed:", err);
      this.alert("error", ALERT.ERROR.SYNC.FAILED);
    }
  }

  saveConfig() {
    const payload = {
      baseUrl: this.baseUrl.trim(),
      collection: this.collection.trim(),
      user: this.user.trim(),
      password: this.password.trim(),
      proxyUrl: this.proxyUrl.trim(),
    };

    const required = [payload.baseUrl, payload.collection, payload.user];
    const valid = required.every((v) => v.length > 0);
    if (!valid) return;

    localStorage.setItem(this.storageKey, JSON.stringify(payload));
    this.alert("success", ALERT.SUCCESS.SETTINGS.SAVED);
    this.closeDialog();
  }

  resetDefaults() {
    this.baseUrl = this.defaults.baseUrl;
    this.collection = this.defaults.collection;
    this.user = this.defaults.user;
    this.password = this.defaults.password;
    this.proxyUrl = this.defaults.proxyUrl;
  }

  updateField(field, e) {
    this[field] = e.target.value;
  }

  async testConnection() {
    this.connectionStatus = "testing";
    this.alert("info", ALERT.INFO.CONNECTION.CONNECTING);

    try {
      const client = new ExistDBClient({
        baseUrl: this.baseUrl.trim(),
        collection: this.collection.trim(),
        user: this.user.trim(),
        password: this.password.trim(),
        proxyUrl: this.proxyUrl.trim(),
      });

      await client.list();

      this.connectionStatus = "ok";
      this.alert("success", ALERT.SUCCESS.CONNECTION.EXISTDB);
    } catch (e) {
      console.error(e);
      this.connectionStatus = "error";
      this.alert("error", ALERT.ERROR.CONNECTION.EXISTDB);
    }
  }

  render() {
    return html`
      <md-dialog ?open=${this.open} @closed=${this.closeDialog}>
        <div slot="headline">Sync with eXist-db</div>

        <div slot="content">
          <div class="form">
            <md-outlined-text-field
              label="Base URL"
              required
              .value=${this.baseUrl}
              @input=${(e) => this.updateField("baseUrl", e)}
            ></md-outlined-text-field>

            <md-outlined-text-field
              label="Collection"
              required
              .value=${this.collection}
              @input=${(e) => this.updateField("collection", e)}
            ></md-outlined-text-field>

            <md-outlined-text-field
              label="User"
              required
              .value=${this.user}
              @input=${(e) => this.updateField("user", e)}
            ></md-outlined-text-field>

            <md-outlined-text-field
              type="password"
              label="Password"
              required
              .value=${this.password}
              @input=${(e) => this.updateField("password", e)}
            ></md-outlined-text-field>

            <md-outlined-text-field
              label="Proxy URL (optional)"
              .value=${this.proxyUrl}
              @input=${(e) => this.updateField("proxyUrl", e)}
            ></md-outlined-text-field>
          </div>

        ${this.connectionStatus === "testing"
          ? html`<div>Testing connection...</div>`
          : this.connectionStatus === "ok"
          ? html`<div style="color:green">Connected</div>`
          : this.connectionStatus === "error"
          ? html`<div style="color:red">Connection error</div>`
          : null}

        </div>

        <div slot="actions" class="actions">
          <cp-button label="Test"   @click=${this.testConnection}></cp-button>
          <cp-button label="Cancel" @click=${this.closeDialog}></cp-button>
          <cp-button label="Load"   @click=${this.loadConfig}></cp-button>
          <cp-button label="Save"   variant="filled" @click=${this.saveConfig}></cp-button>
        </div>

      </md-dialog>
    `;
  }
}

customElements.define("cp-existdb-sync", CpExistdbSync);
