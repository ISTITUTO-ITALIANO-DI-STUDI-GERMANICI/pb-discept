/*  The above menu placed upper left inside header component.
    The main features are:
    - Uploading TEI/XML files with validation and feedback.
    - Syncing with eXist-db via a modal dialog.
    - Autosave on localStorage and restore the current save.
    - Help section linking to documentation and support.
    - Settings for user preferences and application configuration.
    - Responsive design with a hamburger menu on smaller screens.
    - Tooltips for desktop actions and labeled buttons for mobile.
*/

import { html, css } from "lit";

import { UtBase } from "../../../utilities/base.js";
import { CONFIG } from "../../../utilities/config.js";
import { ALERT } from "../../../utilities/alert/alerts.js";

import "../../templates/button.js";
import "../../templates/tooltip.js";

import "./options/eXistdbSync.js";
import "./options/upload.js";



export class CpHeaderMenu extends UtBase {

    static properties = {
        open: { type: Boolean }
    };

    connectedCallback() {
        super.connectedCallback();

        document.addEventListener('click', this._handleOutsideClick);
        document.addEventListener('keydown', this._handleKeydown);

        this._mq.addEventListener('change', this._handleMediaChange);
    }

    disconnectedCallback() {
        super.disconnectedCallback();

        document.removeEventListener('click', this._handleOutsideClick);
        document.removeEventListener('keydown', this._handleKeydown);

        this._mq.removeEventListener('change', this._handleMediaChange);
    }

    _handleOutsideClick = (e) => {
        if (!this.open) return;

        const path = e.composedPath();

        const clickedInside = path.some(el =>
            el instanceof Element &&
            (el.closest('.mobile-menu') || el.closest('.hamburger'))
        );

        if (!clickedInside) {
            this.open = false;
        }
    };

    _handleMediaChange(e) {
        if (!e.matches) {
            this.open = false;
        }
    }

    static styles = css`

        :host {
            --md-sys-typescale-font-family: 'Roboto', sans-serif;
            font-family: var(--md-sys-typescale-font-family);
        }

        :host * {
            font-family: inherit;
        }

        .header-menu {
            display: flex;
            gap: 8px;
            align-items: center;
        }

        .hamburger {
            display: none;
        }

        .mobile-menu {
            position: absolute;
            top: 50px;
            right: 10px;

            background: white;
            border: 1px solid #ddd;
            border-radius: 10px;
            padding: 8px;

            display: flex;
            flex-direction: column;
            gap: 6px;
            min-width: 180px;

            box-shadow: 0 8px 20px rgba(0,0,0,0.15);
            z-index: 1000;

            opacity: 0;
            transform: translateY(-8px) scale(0.98);
            pointer-events: none;

            transition: opacity 180ms ease, transform 180ms ease;
        }

        .mobile-menu.open {
            opacity: 1;
            transform: translateY(0) scale(1);
            pointer-events: auto;
        }

        .mobile-item {
            display: flex;
            align-items: center;
            gap: 10px;
            width: 100%;
        }

        .mobile-item cp-button {
            width: 100%;
        }

        @media (max-width: 768px) {

            .header-menu > .desktop-only {
                display: none;
            }

            .hamburger {
                display: inline-flex;
            }
        }
    `;

    constructor() {
        super();
        this.open = false;

        this.actions = [
            { icon: "upload", label: "Upload file" },
            { icon: "sync", label: "Sync eXist-db" },
            { icon: "cloud_done", label: "Restore autosave" },
            { icon: "help", label: "Help" },
            { icon: "settings", label: "Settings" }
        ];

        this._mq = window.matchMedia('(max-width: 768px)');
        this._handleMediaChange = this._handleMediaChange.bind(this);

        this.uploadedFile = null;
        this.languages = [];

    }

    toggleMenu() {
        this.open = !this.open;
    }

    _handleFileUpload(e) {
        const file = e.target.files?.[0];

        if (!file) return;

        const isValid =
            file.name.endsWith(".xml") ||
            file.name.endsWith(".tei") ||
            file.type.includes("xml");

        if (!isValid) {
            this.alert("ERROR", ALERT.ERROR.DOCUMENT.UPLOAD(file.name));
            e.target.value = "";
            return;
        }

        const reader = new FileReader();

        reader.onload = (event) => {

            const content = event.target?.result;
            this.uploadedFile = content;
            this.languages = this._extractLanguages(content);
            this.alert("SUCCESS", ALERT.SUCCESS.DOCUMENT.UPLOADED(file.name));
            this.requestUpdate();

            window.dispatchEvent(new CustomEvent("tei-loaded", {
                detail: {
                    xml: content,
                    languages: this.languages
                }
            }));

        };

        reader.onerror = () => {
            this.alert("ERROR", ALERT.ERROR.DOCUMENT.UPLOAD(file.name));
        };

        reader.readAsText(file);

    }

    handleAction(action) {

        if (action.label === "Sync eXist-db") {
            const modal = this.renderRoot?.querySelector("#existSync");
            modal?.openDialog();
            this.open = false;
        }

        if (action.label === "Upload file") {
            const input = this.renderRoot?.querySelector('input[type="file"]');
            input?.click();
            this.open = false;
            return;
        }

    }

    firstUpdated() {
        this.addEventListener("click", (e) => {
            if (this.disabled) {
                e.stopPropagation();
                e.preventDefault();
            }
        });
    }

    renderAction(a, mobile = false) {
        // Pass icon and label as properties — cp-button handles rendering internally.
        // In mobile mode show the label; on desktop the tooltip suffices.
        return html`
            <cp-button
                icon=${a.icon}
                label=${mobile ? a.label : ""}
                tooltip=${a.label}
                @click=${() => this.handleAction(a)}
            ></cp-button>
        `;
    }

    _extractLanguages(xmlString) {

        if (!xmlString) return [];

        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlString, "application/xml");

        const nodes = [...xml.querySelectorAll("language[ident]")];

        const languages = nodes
            .map(n => n.getAttribute("ident"))
            .filter(Boolean);

        if (languages.length === 0) return ["und"];

        return [...new Set(languages)];
    }

    render() {
        return html`

            <input
                type="file"
                accept=".xml,.tei,text/xml,application/xml"
                style="display:none"
                @change=${this._handleFileUpload}
            />

            <div class="header-menu">

                ${this.actions.map(a => html`
                    <div class="desktop-only">
                        ${this.renderAction(a)}
                    </div>
                `)}

                <cp-button
                    class="hamburger"
                    icon="menu"
                    tooltip="Menu"
                    @click=${this.toggleMenu}
                ></cp-button>

                <div class="mobile-menu ${this.open ? 'open' : ''}">
                    ${this.actions.map(a => html`
                        <div class="mobile-item">
                            ${this.renderAction(a, true)}
                        </div>
                    `)}
                </div>

                <cp-existdb-sync id="existSync"></cp-existdb-sync>

            </div>
        `;
    }
}

customElements.define('cp-header-menu', CpHeaderMenu);
