import { UtBase } from "../../utilities/base";
import "../../components/templates/tooltip.js";
import { html, css } from "lit";

import { CpExistdbSync } from "./options/eXistdbSync.js";

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

    renderIcon({ icon, fill }) {
        return html`
            <span class="material-symbols-outlined ${fill ? 'fill' : ''}">
                ${icon}
            </span>
        `;
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

        .btn-content {
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }

        md-icon {
            font-size: 20px;
            display: inline-flex;
            vertical-align: middle;
        }

        .label {
            font-size: 14px;
            line-height: 1;
        }

        md-text-button {
            min-width: auto;
            padding: 6px 12px;

            transition:
                background-color 160ms ease,
                transform 160ms ease,
                box-shadow 160ms ease;
        }

        md-text-button:hover {
            background-color: rgba(0, 0, 0, 0.06);
            transform: translateY(-1px);
        }

        md-text-button:active {
            transform: translateY(0px) scale(0.98);
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

        .mobile-item md-text-button {
            width: 100%;
            justify-content: flex-start;
        }

        .mobile-item .btn-content {
            display: inline-flex;
            align-items: center;
            margin-right: 8px;
        }

        .material-symbols-outlined,
        .material-symbols-rounded,
        .material-symbols-sharp {
            font-family: 'Material Symbols Outlined';
            font-variation-settings:
                'FILL' 0,
                'wght' 400,
                'GRAD' 0,
                'opsz' 24;

            font-size: 20px;
            line-height: 1;
            display: inline-flex;
            vertical-align: middle;
            transition: transform 160ms ease, color 160ms ease;
        }

        .fill {
            font-variation-settings:
                'FILL' 1,
                'wght' 400,
                'GRAD' 0,
                'opsz' 24;
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
    }

    toggleMenu() {
        this.open = !this.open;
    }

    handleAction(action) {

        if (action.label === "Sync eXist-db") {
            const modal = this.renderRoot?.querySelector("#existSync");
            modal?.openDialog();
            this.open = false;
        }
    }

    renderAction(a, mobile = false) {
        const content = html`
            ${this.renderIcon(a)}
            ${mobile ? a.label : ""}
        `;

        if (mobile) {
            return html`
                <div class="mobile-item">
                    <md-text-button
                        aria-label=${a.label}
                        @click=${() => this.handleAction(a)}
                    >
                        ${content}
                    </md-text-button>
                </div>
            `;
        }
        
        return html`
            <cp-tooltip text=${a.label}>
                <md-text-button
                    aria-label=${a.label}
                    @click=${() => this.handleAction(a)}
                >
                    ${content}
                </md-text-button>
            </cp-tooltip>
        `;
    }

    render() {
        return html`

            <div class="header-menu">

                ${this.actions.map(a => html`
                    <div class="desktop-only">
                        ${this.renderAction(a)}
                    </div>
                `)}

                <md-text-button class="hamburger" @click=${this.toggleMenu}>
                    ${this.renderIcon({ icon: "menu", fill: false })}
                </md-text-button>

                <div class="mobile-menu ${this.open ? 'open' : ''}">
                    ${this.actions.map(a => this.renderAction(a, true))}
                </div>

                <cp-existdb-sync id="existSync"></cp-existdb-sync>

            </div>
        `;
    }
}

customElements.define('cp-header-menu', CpHeaderMenu);