import { html, css } from "lit";
import { UtBase } from "../../../../utilities/base.js";
import { CpButton } from "../../../../components/templates/button.js";
import { ALERT } from "../../../../utilities/alert/alerts.js";

export class CpUpload extends UtBase {

    static properties = {
        accept:   { type: String },
        _dragging: { state: true },
    };

    constructor() {
        super();
        this.accept    = ".xml,application/xml,text/xml";
        this._dragging = false;
    }

    // ─────────────────────────────
    // STYLES
    // ─────────────────────────────

    static styles = [
        UtBase.styles,
        css`
            :host { display: block; }

            .drop-zone {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 10px;
                padding: 32px 24px;
                border: 2px dashed rgba(0,0,0,0.15);
                border-radius: 16px;
                background: rgba(0,0,0,0.02);
                cursor: pointer;
                transition: border-color 160ms ease, background 160ms ease;
                text-align: center;
            }

            .drop-zone.dragging {
                border-color: var(--md-sys-color-primary, #6750a4);
                background: rgba(103,80,164,0.05);
            }

            .drop-icon {
                font-size: 36px;
                color: #d1d5db;
                transition: color 160ms ease;
            }

            .drop-zone.dragging .drop-icon {
                color: var(--md-sys-color-primary, #6750a4);
            }

            .drop-label {
                font-size: 0.85rem;
                color: #6b7280;
                margin: 0;
            }

            .drop-hint {
                font-size: 0.75rem;
                color: #9ca3af;
                margin: 0;
            }

            input[type="file"] { display: none; }
        `
    ];

    // ─────────────────────────────
    // HANDLERS
    // ─────────────────────────────

    _onDragOver(e) {
        e.preventDefault();
        this._dragging = true;
    }

    _onDragLeave() {
        this._dragging = false;
    }

    _onDrop(e) {
        e.preventDefault();
        this._dragging = false;
        const file = e.dataTransfer?.files?.[0];
        if (file) this._loadFile(file);
    }

    _onInputChange(e) {
        const file = e.target.files?.[0];
        if (file) this._loadFile(file);
        e.target.value = "";
    }

    _openPicker() {
        this.renderRoot.querySelector("input[type='file']").click();
    }

    async _loadFile(file) {
        try {
            const xml = await file.text();
            window.dispatchEvent(new CustomEvent("tei-loaded", {
                detail: { xml, filename: file.name },
                bubbles: true,
                composed: true,
            }));
            this.alert("success", ALERT.SUCCESS.FILE.UPLOADED(file.name));
        } catch {
            this.alert("error", ALERT.ERROR.FILE.UPLOAD(file.name));
        }
    }

    // ─────────────────────────────
    // RENDER
    // ─────────────────────────────

    render() {
        return html`
            <input
                type="file"
                accept=${this.accept}
                @change=${this._onInputChange}
            />

            <div
                class="drop-zone ${this._dragging ? "dragging" : ""}"
                @click=${this._openPicker}
                @dragover=${this._onDragOver}
                @dragleave=${this._onDragLeave}
                @drop=${this._onDrop}
            >
                <span class="material-symbols-outlined drop-icon">upload_file</span>
                <p class="drop-label">Drop a TEI file here, or click to browse</p>
                <p class="drop-hint">.xml files only</p>
            </div>
        `;
    }
}

customElements.define("cp-upload", CpUpload);