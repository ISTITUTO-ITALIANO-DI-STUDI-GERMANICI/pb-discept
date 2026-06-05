// This template implements a stepper component that guides users through a multi-step process.
// It displays the current step, allows navigation between steps, and shows progress.
//
// KEY DESIGN DECISION — always-mounted slots:
// All step slots are rendered into the DOM at all times (visibility toggled via
// CSS display:none). This means child components like VwTranslations are
// connectedCallback'd once and stay alive, so they can receive window events
// (e.g. "tei-loaded") even when their step is not the active one.
// Without this, a TEI file uploaded while on step 0 would fire "tei-loaded"
// before VwTranslations is mounted on step 2, and the event would be lost.

import { html, css } from 'lit';
import { UtBase } from '../../utilities/base.js';

import './tooltip.js';
import './button.js';

export class CpStepper extends UtBase {

  static properties = {
    steps: { type: Array },
    activeStep: { type: Number },
  };

  constructor() {
    super();
    this.steps = [];
    this.activeStep = 0;
  }

  static styles = css`

    :host {
      display: block;
      padding: 16px;
    }

    .stepper {
      position: relative;
      margin: 0 auto;
    }

    /* TRACK LINE */
    .track {
      position: absolute;
      top: 18px;
      left: calc(100% / (var(--steps-count) * 2));
      right: calc(100% / (var(--steps-count) * 2));
      height: 2px;
      background: #eee;
      z-index: 0;
      overflow: hidden;
    }

    /* PROGRESS LINE */
    .track-progress {
      height: 100%;
      background: linear-gradient(
        90deg,
        var(--md-sys-color-primary, #6750a4),
        #8ab4f8
      );
      width: 0%;
      transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* CONTAINER STEP */
    .steps {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-direction: row;
      flex-wrap: nowrap;
      position: relative;
      z-index: 1;
    }

    /* STEP NODE */
    .step-node {
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      flex: 1;
      position: relative;
      min-width: 80px;
      padding-top: 2px;
    }

    /* CIRCLE */
    .circle {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 2px solid #bbb;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: 0.2s;
    }

    /* ACTIVE */
    .step-node.active .circle {
      background: var(--md-sys-color-primary, #6750a4);
      border-color: var(--md-sys-color-primary, #6750a4);
      color: white;
    }

    /* COMPLETED */
    .step-node.completed .circle {
      background: var(--md-sys-color-primary, #50a46b);
      border-color: var(--md-sys-color-primary, #50a45d);
      color: white;
    }

    /* LABEL */
    .label {
      margin-top: 8px;
      font-size: 12px;
      text-align: center;
      color: #555;
    }

    .content {
      margin-top: 32px;
      padding: 16px;
      border: 1px solid #ddd;
      border-radius: 12px;
    }

    /* Each step panel is always in the DOM; only the active one is visible. */
    .step-panel {
      display: none;
    }

    .step-panel.active {
      display: block;
    }

    .actions {
      display: flex;
      justify-content: space-between;
      margin-top: 16px;
    }
  `;

  _getProgressPercent() {
    if (this.steps.length <= 1) return 0;
    return (this.activeStep / (this.steps.length - 1)) * 100;
  }

  _stateClass(i) {
    if (i < this.activeStep) return 'completed';
    if (i === this.activeStep) return 'active';
    return '';
  }

  _isCompleted(i) {
    const step = this.steps[i];
    return step.completed || i < this.activeStep;
  }

  _goToStep(index) {
    const step = this.steps[index];
    if (!step || step.disabled) return;

    this.dispatchEvent(new CustomEvent('step-change', {
      detail: { from: this.activeStep, to: index },
      bubbles: true,
      composed: true,
    }));

    this.activeStep = index;
  }

  _next() {
    if (this.activeStep < this.steps.length - 1) {
      this._goToStep(this.activeStep + 1);
    }
  }

  _back() {
    if (this.activeStep > 0) {
      this._goToStep(this.activeStep - 1);
    }
  }

  render() {
    return html`
    <div class="stepper" style="--steps-count: ${this.steps.length}">

      <!-- TRACK BASE -->
      <div class="track">
        <div
          class="track-progress"
          style="width: ${this._getProgressPercent()}%"
        ></div>
      </div>

      <!-- STEPS -->
      <div class="steps">
        ${this.steps.map((step, i) => html`
          <div
            class="step-node ${this._stateClass(i)}"
            @click=${() => this._goToStep(i)}
          >
            <cp-tooltip .text=${step.description || ''}>
              <div class="circle" tabindex="0">
                ${i < this.activeStep ? '✓' : i + 1}
              </div>
            </cp-tooltip>
            <div class="label">
              ${step.label}
              ${step.optional ? html`<span>(optional)</span>` : ''}
            </div>
          </div>
        `)}
      </div>

      <!-- CONTENT
           All panels are always mounted so child components receive window
           events regardless of which step is currently active. Only the
           active panel is made visible via the .active CSS class. -->
      <div class="content">
        ${this.steps.map((_, i) => html`
          <div class="step-panel ${i === this.activeStep ? 'active' : ''}">
            <slot name="step-${i}"></slot>
          </div>
        `)}
      </div>

    </div>
  `;
  }
}

customElements.define('cp-stepper', CpStepper);
