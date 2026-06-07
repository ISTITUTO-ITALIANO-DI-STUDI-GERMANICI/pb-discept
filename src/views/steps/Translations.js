import { html, css } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { UtBase } from "../../utilities/base.js";
import { CountryFlag } from "../../utilities/lib/countryFlag.js";
import { CpButton } from "../../components/templates/button.js"
import { CpChip } from "../../components/templates/chip.js";
import { CpTEIvalidate } from "../../components/viewComponents/TEIvalidate.js";
import { CpMonaco } from "../../components/viewComponents/monaco.js";
import { formatXML } from "../../utilities/lib/utils.js";

import { CONFIG } from "../../utilities/config.js";
import { TXT } from "../../utilities/map.js";

import Data from "../../utilities/lib/tei/Data.js";

const ALL_KEY = "__all__";

export class VwTranslations extends UtBase {

    static properties = {
        langs:          { state: true },
        xml:            { state: true },
        langMap:        { state: true },
        selectedLang:   { state: true },
        editorValue:    { state: true },
        _newLang:       { state: true },
        _addOpen:       { state: true },  // inline add row visible
        _editingLang:   { state: true },  // lang code being renamed, or null
        _editValue:     { state: true },  // current value of the rename input
        _confirmAction: { state: true },  // pending { type, lang, newLang? } or null
    };

    constructor() {
        super();
        this.langs        = [];
        this.xml          = null;
        this.langMap      = {};
        this.selectedLang = ALL_KEY;
        this.editorValue  = "";
        this._newLang     = "";
        this._addOpen     = false;
        this._editingLang  = null;
        this._editValue    = "";
        this._confirmAction = null;
        this._onTeiLoaded = this._onTeiLoaded.bind(this);
    }

    static styles = [

        UtBase.styles,

        css`

        /* ── Toolbar ─────────────────────────────────── */

        .toolbar {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 10px;
            background: rgba(255,255,255,0.85);
            border: 1px solid rgba(0,0,0,0.07);
            border-radius: 12px;
            flex-wrap: wrap;
        }

        .toolbar-label {
            font-size: 0.7rem;
            font-weight: 700;
            color: #9ca3af;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            padding-right: 4px;
            white-space: nowrap;
        }

        .chips-row {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 6px;
            flex: 1;
        }

        .chip-divider {
            width: 1px;
            height: 20px;
            background: rgba(0,0,0,0.12);
            border-radius: 1px;
            margin: 0 4px;
        }

        /* ── Inline add row ──────────────────────────── */

        .add-row {
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .add-input {
            border: 1px solid rgba(0,0,0,0.18);
            border-radius: 8px;
            padding: 5px 10px;
            font-size: 0.85rem;
            font-family: inherit;
            outline: none;
            width: 70px;
            transition: border-color 160ms ease, width 160ms ease;
        }

        .add-input:focus {
            border-color: var(--md-sys-color-primary, #6750a4);
            width: 90px;
        }

        /* ── Editor shell ────────────────────────────── */

        .editor-wrapper {
            margin-top: 8px;
            display: flex;
            flex-direction: column;
            height: calc(100vh - 210px);
        }

        .editor-header {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 6px 12px;
            background: #f9fafb;
            border: 1px solid rgba(0,0,0,0.08);
            border-bottom: none;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
        }

        .editor-title {
            font-size: 1rem;
            font-weight: 600;
            color: #4b5563;
            flex: 1;
        }

        /* ── Confirm overlay ────────────────────────────── */

        .confirm-overlay {
            position: fixed;
            inset: 0;
            z-index: 1000;
            background: rgba(0,0,0,0.32);
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .confirm-dialog {
            background: #fff;
            border-radius: 16px;
            padding: 24px;
            width: 360px;
            max-width: calc(100vw - 32px);
            box-shadow: 0 8px 32px rgba(0,0,0,0.18);
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .confirm-headline {
            font-size: 1rem;
            font-weight: 700;
            color: #111827;
            margin: 0;
        }

        .confirm-message {
            font-size: 0.85rem;
            color: #4b5563;
            margin: 0;
            line-height: 1.5;
        }

        .confirm-actions {
            display: flex;
            justify-content: flex-end;
            gap: 8px;
            margin-top: 4px;
        }

        /* ── Input shared style (reused in empty state) ─ */

        .lang-input {
            border: 1px solid rgba(0,0,0,0.18);
            border-radius: 8px;
            padding: 7px 12px;
            font-size: 0.9rem;
            font-family: inherit;
            outline: none;
            transition: border-color 160ms ease;
        }

        .lang-input:focus {
            border-color: var(--md-sys-color-primary, #6750a4);
        }

        /* ── Empty state ─────────────────────────────── */

        .empty-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            margin: 80px auto;
            max-width: 340px;
            text-align: center;
        }

        .empty-icon {
            font-size: 40px;
            color: #d1d5db;
            margin-bottom: 4px;
        }

        .empty-title {
            margin: 0;
            font-size: 1rem;
            font-weight: 600;
            color: #374151;
        }

        .empty-sub {
            margin: 0 0 8px;
            font-size: 0.82rem;
            color: #9ca3af;
        }

        .empty-form {
            display: flex;
            align-items: center;
            gap: 8px;
            width: 100%;
        }

        .empty-input {
            flex: 1;
            min-width: 0;
            height: 100%;
        }

    `];

    // ─────────────────────────────
    // LIFECYCLE
    // ─────────────────────────────

    connectedCallback() {
        super.connectedCallback?.();
        window.addEventListener("tei-loaded", this._onTeiLoaded);
    }

    disconnectedCallback() {
        window.removeEventListener("tei-loaded", this._onTeiLoaded);
        super.disconnectedCallback?.();
    }

    // ─────────────────────────────
    // DATA
    // ─────────────────────────────

    _onTeiLoaded(e) {
        this.xml = e.detail.xml;
        Data.readFromString(e.detail.xml);
        this.langs = this._getAllLangs();
        this.selectedLang = ALL_KEY;
        this.editorValue = formatXML(Data.generateTEI());
        this.requestUpdate();
    }

    _onSelectLang(lang) {
        // Persist current editor content before switching
        if (this.selectedLang && this.selectedLang !== ALL_KEY && this.editorValue) {
            this.langMap = { ...this.langMap, [this.selectedLang]: this.editorValue };
        }

        this.selectedLang = lang;

        if (lang === ALL_KEY) {
            this.editorValue = formatXML(this._buildFullTEI());
            return;
        }

        const localDoc = this.langMap?.[lang];
        const doc = localDoc || Data.getDocumentPerLanguage(lang);

        if (!doc) {
            this.editorValue = formatXML(CONFIG.TEI.TEMPLATE("Untitled", lang));
            return;
        }

        const parser = new DOMParser();
        const dom = parser.parseFromString(doc, "text/xml");
        const body = dom.querySelector("text");
        const innerContent = body ? body.innerHTML : "";

        this.editorValue = formatXML(
            CONFIG.TEI.TEMPLATE("Untitled", lang)
                .replace("<!-- Write something here -->", innerContent)
        );
    }

    // ─────────────────────────────
    // ADD TRANSLATION
    // ─────────────────────────────

    _confirmAddTranslation() {
        const lang = this._newLang.trim().toLowerCase();
        if (!lang) return;

        const allLangs = this._getAllLangs();

        if (allLangs.includes(lang)) {
            this.alert("warning", `Translation for "${lang.toUpperCase()}" already exists.`);
            return;
        }

        this.langMap = { ...this.langMap, [lang]: CONFIG.TEI.TEMPLATE("Untitled", lang) };
        this.langs = this._getAllLangs();
        this._newLang = "";
        this._addOpen = false;
        this._onSelectLang(lang);
    }

    // ─────────────────────────────
    // HELPERS
    // ─────────────────────────────

    _getAllLangs() {
        const base = Data.getDocumentLanguages?.() || [];
        const local = Object.keys(this.langMap || {});
        return Array.from(new Set([...base, ...local]));
    }

    _syncToData() {
        const existingLangs = new Set(Data.getDocumentLanguages?.() || []);
        for (const [lang, doc] of Object.entries(this.langMap || {})) {
            if (existingLangs.has(lang)) {
                Data.updateDocumentPerLanguage(lang, doc);
            } else {
                Data.addDocumentPerLanguage(lang, doc);
            }
        }
    }

    _buildFullTEI() {
        if (this.selectedLang && this.selectedLang !== ALL_KEY && this.editorValue) {
            this.langMap = { ...this.langMap, [this.selectedLang]: this.editorValue };
        }
        this._syncToData();
        return Data.generateTEI();
    }

    // ─────────────────────────────
    // RENAME / DELETE
    // ─────────────────────────────

    _startRename(lang) {
        this._editingLang = lang;
        this._editValue   = lang;
    }

    _confirmRename() {
        const oldLang = this._editingLang;
        const newLang = this._editValue.trim().toLowerCase();

        this._editingLang = null;
        this._editValue   = "";

        if (!newLang || newLang === oldLang) return;

        if (this._getAllLangs().includes(newLang)) {
            this.alert("warning", `Language "${newLang.toUpperCase()}" already exists.`);
            return;
        }

        this._confirmAction = { type: "rename", lang: oldLang, newLang };
    }

    _doRename(oldLang, newLang) {
        Data.renameDocumentLanguage(oldLang, newLang);

        if (this.langMap?.[oldLang] !== undefined) {
            const doc = this.langMap[oldLang];
            const updated = { ...this.langMap };
            delete updated[oldLang];
            updated[newLang] = doc;
            this.langMap = updated;
        }

        if (this.selectedLang === oldLang) this.selectedLang = newLang;
        this.langs = this._getAllLangs();
    }

    _deleteLang(lang) {
        this._confirmAction = { type: "delete", lang };
    }

    _doDelete(lang) {
        Data.deleteDocumentPerLanguage(lang);

        if (this.langMap?.[lang] !== undefined) {
            const updated = { ...this.langMap };
            delete updated[lang];
            this.langMap = updated;
        }

        if (this.selectedLang === lang) {
            this.selectedLang = ALL_KEY;
            this.editorValue  = formatXML(this._buildFullTEI());
        }

        this.langs = this._getAllLangs();
    }

    _getLangLabel(lang) {
        if (lang === ALL_KEY) return "Full TEI document";
        const base = TXT.LANG?.[lang];
        return base ? `${base}` : lang.toUpperCase();
    }

    // ─────────────────────────────
    // RENDER
    // ─────────────────────────────

    _renderToolbar(langs) {
        return html`
            <div class="toolbar">

                <span class="toolbar-label">Languages</span>

                <div class="chips-row">

                    <!-- ALL chip -->
                    <cp-chip
                        label="ALL"
                        value=${ALL_KEY}
                        variant="assist"
                        @click=${() => this._onSelectLang(ALL_KEY)}
                        ?selected=${this.selectedLang === ALL_KEY}
                    >
                        <span slot="leading-icon" class="material-symbols-outlined" style="font-size:16px;line-height:1;">public</span>
                    </cp-chip>

                    <div class="chip-divider"></div>

                    <!-- Language chips — click to select, dblclick to rename, X to delete -->
                    ${repeat(langs, (lang) => lang, (lang) => this._editingLang === lang ? html`
                        <div class="add-row">
                            <input
                                class="add-input"
                                type="text"
                                placeholder=${lang}
                                maxlength="10"
                                .value=${this._editValue}
                                @input=${(e) => this._editValue = e.target.value}
                                @keydown=${(e) => {
                                    if (e.key === "Enter")  this._confirmRename();
                                    if (e.key === "Escape") { this._editingLang = null; this._editValue = ""; }
                                }}
                            />
                            <cp-button
                                icon="check"
                                tooltip="Confirm rename"
                                variant="tonal"
                                ?disabled=${!this._editValue.trim()}
                                @click=${this._confirmRename}
                            ></cp-button>
                            <cp-button
                                icon="close"
                                tooltip="Cancel"
                                @click=${() => { this._editingLang = null; this._editValue = ""; }}
                            ></cp-button>
                        </div>
                    ` : html`
                        <md-input-chip
                            .label=${lang.toUpperCase()}
                            ?selected=${this.selectedLang === lang}
                            @click=${() => this._onSelectLang(lang)}
                            @dblclick=${(e) => { e.stopPropagation(); this._startRename(lang); }}
                            @remove=${(e) => { e.preventDefault(); e.stopPropagation(); this._deleteLang(lang); }}
                        >
                            <country-flag slot="icon" .code=${lang}></country-flag>
                        </md-input-chip>
                    `)}

                </div>

                <!-- Inline add -->
                ${this._addOpen ? html`
                    <div class="add-row">
                        <input
                            class="add-input"
                            type="text"
                            placeholder="e.g. it, fr…"
                            maxlength="10"
                            .value=${this._newLang}
                            @input=${(e) => this._newLang = e.target.value}
                            @keydown=${(e) => {
                                if (e.key === "Enter") this._confirmAddTranslation();
                                if (e.key === "Escape") { this._addOpen = false; this._newLang = ""; }
                            }}
                        />
                        <cp-button
                            icon="check"
                            tooltip="Confirm"
                            variant="tonal"
                            ?disabled=${!this._newLang.trim()}
                            @click=${this._confirmAddTranslation}
                        ></cp-button>
                        <cp-button
                            icon="close"
                            tooltip="Cancel"
                            @click=${() => { this._addOpen = false; this._newLang = ""; }}
                        ></cp-button>
                    </div>
                ` : html`
                    <cp-button
                        icon="add"
                        tooltip="Add language"
                        @click=${() => { this._addOpen = true; }}
                    ></cp-button>
                `}

            </div>
        `;
    }

    render() {
        const langs = this._getAllLangs().sort((a, b) => a.localeCompare(b));

        if (!langs.length) return html`
            <div class="empty-container">
                <span class="material-symbols-outlined empty-icon">translate</span>
                <p class="empty-title">No translations yet</p>
                <p class="empty-sub">Enter a language code to get started</p>
                <div class="empty-form">
                    <input
                        class="lang-input empty-input"
                        type="text"
                        placeholder="e.g. it, en, de, \u2026"
                        maxlength="6"
                        .value=${this._newLang}
                        @input=${(e) => this._newLang = e.target.value}
                        @keydown=${(e) => e.key === "Enter" && this._confirmAddTranslation()}
                    />
                    <cp-button
                        icon="add"
                        tooltip="Add language"
                        ?disabled=${!this._newLang.trim()}
                        @click=${this._confirmAddTranslation}
                    ></cp-button>
                </div>
            </div>
        `;

        return html`

            ${this._renderToolbar(langs)}

            <!-- Editor -->
            <div class="editor-wrapper">

                <div class="editor-header">
                    <span class="editor-title">${this._getLangLabel(this.selectedLang)} translation</span>
                    <cp-tei-validate
                        .xml=${this.editorValue}
                        ?disabled=${!this.editorValue}>
                    </cp-tei-validate>
                </div>

                <cp-monaco
                    .value=${this.editorValue}
                    language=${CONFIG.MONACO.LANGUAGE}
                    @change=${(e) => this.editorValue = e.detail.value}
                ></cp-monaco>

            </div>

            ${this._renderConfirmDialog()}

        `;
    }
    _renderConfirmDialog() {
        const a = this._confirmAction;
        if (!a) return "";

        // Capture everything by value now — not read from this._confirmAction later
        const isRename = a.type === "rename";
        const headline = isRename ? "Rename translation?" : "Delete translation?";
        const message  = isRename
            ? `Are you sure you want to rename "${a.lang.toUpperCase()}" to "${a.newLang.toUpperCase()}"?`
            : `Are you sure you want to delete the "${a.lang.toUpperCase()}" translation? This action cannot be undone.`;

        const onCancel  = () => { this._confirmAction = null; };
        const onConfirm = isRename
            ? () => { this._confirmAction = null; this._doRename(a.lang, a.newLang); }
            : () => { this._confirmAction = null; this._doDelete(a.lang); };

        return html`
            <div class="confirm-overlay" @click=${onCancel}>
                <div class="confirm-dialog" @click=${(e) => e.stopPropagation()}>
                    <p class="confirm-headline">${headline}</p>
                    <p class="confirm-message">${message}</p>
                    <div class="confirm-actions">
                        <cp-button label="Cancel"  @click=${onCancel}></cp-button>
                        <cp-button label="Confirm" variant=${isRename ? "tonal" : "filled"} @click=${onConfirm}></cp-button>
                    </div>
                </div>
            </div>
        `;
    }

}

customElements.define('vw-translations', VwTranslations);