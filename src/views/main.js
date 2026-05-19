import { html } from 'lit';
import { UtBase } from "../utilities/base.js";
import { CpStepper } from '../components/templates/stepper.js';

export class VwMain extends UtBase {

    constructor() {
        super();

        this.activeStep = 0;

        this.steps = [
            {
                label: 'Intro',
                description: 'Project description'
            },
            {
                label: 'Project description',
                description: 'Describe your project, the team members, the authors, etc.'
            },
            {
                label: 'TEI and translations',
                description: 'Create or upload your TEI documents and define the translation sources.'
            },
            {
                label: 'Alignments',
                description: 'Align your TEI documents.'
            },
            {
                label: 'Images',
                description: 'Add image resources to your TEI documents.'
            },
            {
                label: 'Final steps',
                description: 'Create your digital edition.'
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

            <div slot="step-0">
                Intro
            </div>

            <div slot="step-1">
                Metadata
            </div>

            <div slot="step-2">
                TEI and translations
            </div>

            <div slot="step-3">
                Alignments
            </div>

            <div slot="step-4">
                Images
            </div>

            <div slot="step-5">
                Final steps
            </div>

            </cp-stepper>
        `;
    }
}

customElements.define('vw-main', VwMain);