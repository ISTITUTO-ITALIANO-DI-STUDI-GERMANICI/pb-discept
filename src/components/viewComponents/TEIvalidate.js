import { html, css } from "lit";
import { UtBase } from "../../utilities/base.js";
import { ALERT } from "../../utilities/alert/alerts.js";
import { CpButton } from "../../components/templates/button.js";

import "../../utilities/lib/tei/TEIUtils.js";

export class CpTEIvalidate extends UtBase {

    static properties = {
        xml: { type: String },
        result: { type: Object },
        running: { type: Boolean },
        open: { type: Boolean }
    };

    constructor() {
        super();
        this.xml = "";
        this.result = null;
        this.running = false;
        this.open = false;
    }

    static styles = [

        UtBase.styles,

        css`
            :host {
                display: inline-block;
                position: relative;
            }

            .panel {
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .result {
                font-size: 0.85rem;
                margin-left: 4px;
            }

            .ok {
                color: #059669;
                font-weight: 600;
            }

            .error {
                color: #dc2626;
                font-weight: 600;
            }

            /* ─────────────────────────────
            ERROR PANEL REDESIGN
            ───────────────────────────── */

            .error-panel {
                position: absolute;
                top: calc(100% + 6px);
                right: 0;
                z-index: 999;
                width: 320px;
                border: 1px solid rgba(220, 38, 38, 0.25);
                border-radius: 10px;
                background: #fff5f5;
                overflow: hidden;
                box-shadow: 0 8px 24px rgba(0,0,0,0.10);
                animation: panel-in 140ms cubic-bezier(0.22,1,0.36,1);
            }

            @keyframes panel-in {
                from { opacity: 0; transform: translateY(-4px) scale(0.99); }
                to   { opacity: 1; transform: translateY(0)    scale(1);    }
            }

            .error-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px 12px;
                background: rgba(220, 38, 38, 0.08);
                border-bottom: 1px solid rgba(220, 38, 38, 0.15);
                font-weight: 600;
                font-size: 0.85rem;
                color: #991b1b;
            }

            .error-count {
                display: inline-flex;
                align-items: center;
                gap: 6px;
            }

            .error-count::before {
                content: "⚠";
                font-size: 0.9rem;
            }

            .error-list {
                list-style: none;
                margin: 0;
                padding: 8px 12px;
                display: flex;
                flex-direction: column;
                gap: 6px;
            }

            .error-list li {
                font-size: 0.82rem;
                color: #7f1d1d;
                padding: 6px 8px;
                background: rgba(220, 38, 38, 0.06);
                border-left: 3px solid #dc2626;
                border-radius: 6px;
                line-height: 1.3;
            }
`
    ];

    _toggle() {
        this.open = !this.open;
    }

    // ─────────────────────────────
    // VALIDATION CORE
    // ─────────────────────────────

    _validateTEI(xmlString) {
        const errors = [];

        if (!xmlString || !xmlString.trim()) {
            return { valid: false, errors: ["Empty document"] };
        }

        const parser = new DOMParser();
        const doc = parser.parseFromString(xmlString, "application/xml");

        const parseError = doc.querySelector("parsererror");
        if (parseError) {
            errors.push("XML is not well-formed");
        }

        const tei = doc.querySelector("TEI");
        if (!tei) {
            errors.push("Missing <TEI> root element");
        }

        if (!doc.querySelector("text")) {
            errors.push("Missing <text> element");
        }

        if (!doc.querySelector("body")) {
            errors.push("Missing <body> element");
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    // ─────────────────────────────
    // ACTION
    // ─────────────────────────────

    _runValidation() {
        this.running = true;

        const result = this._validateTEI(this.xml);

        this.result = result;
        this.running = false;

        if (result.valid) {
            this.alert("success", ALERT.SUCCESS.TEI.VALIDATION);
            return;
        }

        const count = result.errors.length;

        const message =
            typeof ALERT.ERROR.TEI.VALIDATION === "function"
                ? ALERT.ERROR.TEI.VALIDATION(count)
                : ALERT.ERROR.TEI.VALIDATION`(${count} errors)`;

        this.alert("error", message);

        if (count > 0) {
            this.alert("info", result.errors.slice(0, 3).join(" | "));
        }
    }

    // ─────────────────────────────
    // RENDER
    // ─────────────────────────────

    render() {
        return html`
            <div class="panel">
                <cp-button
                    icon="check"
                    tooltip="Validate TEI"
                    ?disabled=${this.running || !this.xml}
                    @click=${this._runValidation}
                    @contextmenu=${(e) => { e.preventDefault(); this._toggle(); }}
                ></cp-button>

                ${this.running ? html`
                    <span class="result">ALERT.INFO.TEI.VALIDATING</span>
                ` : ""}

                ${this.result ? html`
                    <span class="result ${this.result.valid ? "ok" : "error"}">
                        ${this.result.valid ? "Valid" : "Invalid"}
                    </span>
                ` : ""}
            </div>

            ${this.result && !this.result.valid ? html`
                <div class="error-panel">

                    <div class="error-header">
                        <div class="error-count">
                            ${this.result.errors.length} validation error(s)
                        </div>
                    </div>

                    <ul class="error-list">
                        ${this.result.errors.map(e => html`
                            <li>${e}</li>
                        `)}
                    </ul>

                </div>
            ` : ""}
                    `;
    }
}

customElements.define("cp-tei-validate", CpTEIvalidate);