// This module defines a custom web component <country-flag> that displays
// a country flag based on a given language or country code.

import { LitElement, html, css } from 'lit';
import { TXT } from "../map.js";

export class CountryFlag extends LitElement {

  static properties = {
    code: { type: String }, // Lang or country
  };

  static styles = css`
    .flag-img {
      width: 18px;
      height: 14px;
      display: block;
      border-radius: 3px;
      object-fit: cover;
    }
  `;

  _toCountryCode(input = "") {
    if (!input) return null;

    const trimmed = input.trim();

    // 1. Already a 2-letter ISO country code passed as uppercase (e.g. "GB", "IT")
    if (/^[A-Z]{2}$/.test(trimmed)) {
      return trimmed;
    }

    const normalized = trimmed.toLowerCase().replace("_", "-");

    // 2. Locale case (e.g. "pt-BR", "zh-TW")
    if (normalized.includes("-")) {
      const [, region] = normalized.split("-");
      if (region && region.length === 2) {
        return region.toUpperCase();
      }
    }

    // 3. Pure language code — look up explicit mapping first (e.g. "en" → "GB"),
    //    then fall back to treating the code itself as a country code (e.g. "it" → "IT",
    //    "de" → "DE", "fr" → "FR") for the common case where lang ≡ country.
    const base = normalized.split("-")[0];
    const mapped = TXT.LANGUAGE_TO_COUNTRY[base];
    if (mapped) return mapped.toUpperCase();

    // Reject placeholder codes that have no real flag
    if (base === "und" || base === "001" || base.length !== 2) return null;

    return base.toUpperCase();
  }

  render() {
    const country = this._toCountryCode(this.code);

    if (!country) return html``;

    const flagUrl = `https://flagcdn.com/${country.toLowerCase()}.svg`;

    return html`
      <img
        class="flag-img"
        src="${flagUrl}"
        alt="${country} flag"
        @error="${this._handleError}"
      />
    `;
  }

  _handleError(e) {
    // Fallback
    e.target.style.display = "none";
  }
}

customElements.define('country-flag', CountryFlag);