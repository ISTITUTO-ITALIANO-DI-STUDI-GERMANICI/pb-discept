import { html } from 'lit';
import { UtBase } from "../utilities/base.js";
import { CpStepper } from '../components/templates/stepper.js';

import { VwIntro } from './steps/Intro.js';

export class VwMain extends UtBase {

    constructor() {
        super();

        this.activeStep = 0;

        // We will centralize for a multilanguage component
        this.steps = [
            {
                label: 'Intro',
                description: 'Project description',
                render: () => html`<vw-intro></vw-intro>`
            },
            {
                label: 'Project description',
                description: 'Describe your project, the team members, the authors, etc.',
                render: () => html`Project description`
            },
            {
                label: 'TEI and translations',
                description: 'Create or upload your TEI documents and define the translation sources.',
                render: () => html`TEI and translations`
            },
            {
                label: 'Alignments',
                description: 'Align your TEI documents.',
                render: () => html`Alignments`
            },
            {
                label: 'Images',
                description: 'Add image resources to your TEI documents.',
                render: () => html`Images`
            },
            {
                label: 'Final steps',
                description: 'Create your digital edition.',
                render: () => html`Final steps`
            },
        ];
    }

    _onStepChange(e) {
        this.activeStep = e.detail.to;
    }

    render() {
        return html`
            <cp-stepper
            .steps=${this.steps}
            .activeStep=${this.activeStep}
            @step-change=${this._onStepChange}
            >

            ${this.steps.map((step, i) => html`
                <div slot="step-${i}">
                ${step.render()}
                </div>
            `)}

            </cp-stepper>
        `;
    }
}

customElements.define('vw-main', VwMain);