import { html, css } from "lit";
import { UtBase } from "../../utilities/base.js";
import { CONFIG } from "../../utilities/config.js";

export class CpMonaco extends UtBase {

    static properties = {
        value: { type: String },
        language: { type: String },
        theme: { type: String },
        readonly: { type: Boolean }
    };

    constructor() {
        super();

        this.value = "";
        this.language = CONFIG.MONACO.LANGUAGE || "xml";
        this.theme = CONFIG.MONACO.THEME || "vs-light";
        this.readonly = false;

        this._editor = null;
        this._container = null;
        this._lastValue = "";
        this._ready = false;
    }

    static styles = css`
        :host {
            display: block;
            width: 100%;
            height: 100%;
            min-height: 260px;
        }

        .editor {
            position: relative;
            height: 100%;

            border: 1px solid rgba(0,0,0,0.08);

            border-bottom-left-radius: 10px;
            border-bottom-right-radius: 10px;

            overflow: hidden;
            background: #fff;
            padding-top: 8px;
        }
    `;

    getEditor() {
        return this._editor;
    }

    setValue(v) {
        this.value = v;
        if (this._editor) {
            this._editor.setValue(v);
            this._lastValue = v;
        }
    }

    getValue() {
        return this._editor?.getValue?.() ?? this.value;
    }

    async firstUpdated() {
        this._container = this.renderRoot.querySelector("#editor");

        // Inject Monaco stylesheet into this shadow root so editor chrome renders correctly.
        await this._ensureMonaco();
        this._injectMonacoStylesInto(this.renderRoot);

        this._init();
    }

    updated() {
        if (!this._editor) return;

        const val = this.value ?? "";

        if (val !== this._lastValue) {
            this._lastValue = val;
            this._editor.setValue(val);
        }

        this.resize();
    }

    async _init() {
        try {
            await window.__monaco_loading__;

            const monaco = window.monaco;

            if (!monaco || !this._container) {
                console.warn("[CpMonaco] Monaco or container missing");
                return;
            }

            this._editor = monaco.editor.create(this._container, {
                value: this.value || "",
                language: this.language,
                theme: this.theme,

                readOnly: this.readonly,

                automaticLayout: CONFIG.MONACO.AUTO_LAYOUT,
                lineNumbers: CONFIG.MONACO.LINE_NUMBERS,

                minimap: CONFIG.MONACO.MINIMAP,
                scrollBeyondLastLine: CONFIG.MONACO.SCROLL_BEYOND_LAST_LINE,
                fontSize: CONFIG.MONACO.FONT_SIZE,
                wordWrap: CONFIG.MONACO.WORD_WRAP,
                margin: CONFIG.MONACO.MARGIN,
                padding: CONFIG.MONACO.PADDING,
            });

            console.log("[CpMonaco] editor created", this._editor);

            this._editor.onDidChangeModelContent(() => {
                const val = this._editor.getValue();

                this.value = val;

                this.dispatchEvent(new CustomEvent("change", {
                    detail: { value: val },
                    bubbles: true,
                    composed: true
                }));
            });

            this._lastValue = this.value;
            this._ready = true;

        } catch (err) {
            console.error("[CpMonaco] init failed", err);
        }
    }

    resize() {
        if (!this._editor) return;

        requestAnimationFrame(() => {
            this._editor.layout();
        });
    }

    render() {
        return html`
            <div id="editor" class="editor"></div>
        `;
    }

    disconnectedCallback() {
        super.disconnectedCallback?.();

        if (this._editor) {
            this._editor.dispose();
            this._editor = null;
        }
    }
}

customElements.define("cp-monaco", CpMonaco);
