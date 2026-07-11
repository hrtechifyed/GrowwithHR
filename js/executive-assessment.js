class ExecutiveAssessment {
    constructor() {
        this.state = {
            stepIndex: 0,
            mode: 'landing',
            data: {
                company: {
                    companyName: '',
                    entity: '',
                    industry: '',
                    natureOfBusiness: '',
                    founded: ''
                },
                workforce: {
                    employees: '',
                    contractWorkers: '',
                    interns: '',
                    apprentices: '',
                    remoteWorkforce: ''
                },
                operations: {
                    primaryState: '',
                    workModel: '',
                    operatingLocations: '',
                    countries: ''
                },
                growth: {
                    hiringPlans: '',
                    fundingStage: '',
                    expansionPlans: '',
                    peopleFunction: ''
                }
            }
        };

        this.steps = [
            {
                id: 'company',
                title: 'Company',
                subtitle: "Let's begin with a few questions about your organisation.",
                icon: 'fa-building',
                coachMessage: "We'll start with the basics so we can understand the organisation you lead.",
                introduction: 'Please share the organisation details you are comfortable providing.',
                fields: [
                    { key: 'companyName', label: 'Company Name', type: 'text', placeholder: 'Enter company name', help: 'The name your organisation uses publicly or internally.' },
                    { key: 'entity', label: 'Entity', type: 'text', placeholder: 'Enter legal or operating entity', help: 'For example, the registered entity or business unit name.' },
                    { key: 'industry', label: 'Industry', type: 'text', placeholder: 'Enter industry', help: 'For example, technology, manufacturing, healthcare, education.' },
                    { key: 'natureOfBusiness', label: 'Nature of Business', type: 'textarea', placeholder: 'Describe the nature of your business', help: 'A brief description of what the organisation does and how it creates value.' },
                    { key: 'founded', label: 'Founded', type: 'text', placeholder: 'Founded year or date', help: 'If you are unsure, share the best available estimate.' }
                ]
            },
            {
                id: 'workforce',
                title: 'Workforce',
                subtitle: 'Next, we would like to understand the scale and shape of your workforce.',
                icon: 'fa-people-group',
                coachMessage: 'This helps us understand how the organisation is staffed today.',
                introduction: 'You may answer approximately if exact numbers are not readily available.',
                fields: [
                    { key: 'employees', label: 'Employees', type: 'number', placeholder: 'Number of employees', help: 'Approximate headcount is perfectly fine.' },
                    { key: 'contractWorkers', label: 'Contract Workers', type: 'number', placeholder: 'Number of contract workers', help: 'Include contractors, freelancers or contingent workers if relevant.' },
                    { key: 'interns', label: 'Interns', type: 'number', placeholder: 'Number of interns', help: 'If none, you may enter 0.' },
                    { key: 'apprentices', label: 'Apprentices', type: 'number', placeholder: 'Number of apprentices', help: 'If none, you may enter 0.' },
                    { key: 'remoteWorkforce', label: 'Remote Workforce', type: 'text', placeholder: 'Describe remote workforce setup', help: 'For example, fully remote, hybrid, distributed, or mostly on-site.' }
                ]
            },
            {
                id: 'operations',
                title: 'Operations',
                subtitle: 'Now we would like to understand how and where your organisation operates.',
                icon: 'fa-location-dot',
                coachMessage: 'Operating context often shapes people strategy, so we take a careful look here.',
                introduction: 'A simple, practical description is enough.',
                fields: [
                    { key: 'primaryState', label: 'Primary State', type: 'text', placeholder: 'Enter primary state / region', help: 'Share the main state, province or region where operations are anchored.' },
                    { key: 'workModel', label: 'Work Model', type: 'text', placeholder: 'Enter work model', help: 'For example, on-site, hybrid, remote-first, or a mixed model.' },
                    { key: 'operatingLocations', label: 'Operating Locations', type: 'textarea', placeholder: 'Describe operating locations', help: 'List offices, plants, branches or other locations as needed.' },
                    { key: 'countries', label: 'Countries', type: 'text', placeholder: 'Enter countries of operation', help: 'If you operate in one country only, you may simply name that country.' }
                ]
            },
            {
                id: 'growth',
                title: 'Growth',
                subtitle: 'Finally, we would like to understand what growth may look like for your organisation.',
                icon: 'fa-chart-line',
                coachMessage: 'This gives us a sense of where the organisation may be heading.',
                introduction: 'If plans are still evolving, answer based on the current direction of travel.',
                fields: [
                    { key: 'hiringPlans', label: 'Hiring Plans', type: 'textarea', placeholder: 'Describe hiring plans', help: 'For example, planned hiring areas, scale or timeline.' },
                    { key: 'fundingStage', label: 'Funding Stage', type: 'text', placeholder: 'Enter funding stage', help: 'For example, bootstrapped, seed, Series A, private, listed, or not applicable.' },
                    { key: 'expansionPlans', label: 'Expansion Plans', type: 'textarea', placeholder: 'Describe expansion plans', help: 'For example, geographies, business lines or capability expansion.' },
                    { key: 'peopleFunction', label: 'People Function', type: 'text', placeholder: 'Describe HR / People function', help: 'For example, lean, developing, established, or fully built out.' }
                ]
            }
        ];

        this.cacheElements();
        this.bindEvents();
        this.renderCurrentStep();
        this.updateProgress();
        this.updateFooter();
    }

    cacheElements() {
        this.landingScreen = document.getElementById('landingScreen');
        this.workspace = document.getElementById('conversationWorkspace');
        this.reviewScreen = document.getElementById('reviewScreen');
        this.loadingScreen = document.getElementById('loadingScreen');
        this.successScreen = document.getElementById('successScreen');
        this.startButton = document.getElementById('startAssessment');
        this.container = document.getElementById('conversationContainer');
        this.template = document.getElementById('conversationTemplate');
        this.stepIndicator = document.getElementById('stepIndicator');
        this.stepTitle = document.getElementById('stepTitle');
        this.stepSubtitle = document.getElementById('stepSubtitle');
        this.progressBar = document.getElementById('progressBar');
        this.coachMessage = document.getElementById('coachMessage');
        this.footerMessage = document.getElementById('footerMessage');
        this.backButton = document.getElementById('backButton');
        this.nextButton = document.getElementById('nextButton');
        this.reviewContent = document.getElementById('reviewContent');
        this.reviewBackButton = document.getElementById('reviewBackButton');
        this.generateButton = document.getElementById('generateAdvisory');
        this.successContinueButton = document.getElementById('successContinue');
    }

    bindEvents() {
        this.startButton?.addEventListener('click', () => this.startAssessment());
        this.backButton?.addEventListener('click', () => this.previousStep());
        this.nextButton?.addEventListener('click', () => this.nextStep());
        this.reviewBackButton?.addEventListener('click', () => this.showWorkspace());
        this.generateButton?.addEventListener('click', () => this.generateAdvisory());
        this.successContinueButton?.addEventListener('click', () => this.resetToStart());
        document.addEventListener('input', (event) => {
            if (event.target && event.target.closest('.exec-response-container')) {
                this.syncStateFromInputs();
                this.updateFooter();
            }
        });
    }

    startAssessment() {
        this.state.mode = 'conversation';
        this.landingScreen.hidden = true;
        this.reviewScreen.hidden = true;
        this.workspace.hidden = false;
        this.successScreen && (this.successScreen.hidden = true);
        this.renderCurrentStep();
        this.updateProgress();
        this.updateFooter();
    }

    renderCurrentStep() {
        const step = this.steps[this.state.stepIndex];
        if (!step || !this.template || !this.container) return;
        const node = this.template.content.cloneNode(true);
        const card = node.querySelector('.exec-conversation-card');
        const icon = node.getElementById('questionIcon');
        const heading = node.getElementById('questionHeading');
        const coachThought = node.getElementById('coachThought');
        const questionText = node.getElementById('questionText');
        const questionHint = node.getElementById('questionHint');
        const responseContainer = node.getElementById('responseContainer');

        if (icon) icon.className = `fa-solid ${step.icon}`;
        if (heading) heading.textContent = step.title;
        if (coachThought) coachThought.textContent = step.coachMessage;
        if (questionText) questionText.textContent = step.introduction;
        if (questionHint) questionHint.textContent = step.subtitle;
        if (responseContainer) {
            responseContainer.innerHTML = '';
            step.fields.forEach((field) => {
                const wrapper = document.createElement('div');
                wrapper.className = 'exec-field';
                const label = document.createElement('label');
                label.className = 'exec-field-label';
                label.textContent = field.label;
                label.setAttribute('for', `${step.id}-${field.key}`);
                const input = field.type === 'textarea' ? document.createElement('textarea') : document.createElement('input');
                input.className = 'exec-field-input';
                input.id = `${step.id}-${field.key}`;
                input.name = field.key;
                input.placeholder = field.placeholder;
                input.value = this.state.data[step.id][field.key] || '';
                if (field.type !== 'textarea') input.type = field.type;
                if (field.type === 'number') input.inputMode = 'numeric';
                const help = document.createElement('div');
                help.className = 'exec-field-help';
                help.textContent = field.help;
                wrapper.append(label, input, help);
                responseContainer.appendChild(wrapper);
            });
        }
        this.container.innerHTML = '';
        this.container.appendChild(node);
    }

    syncStateFromInputs() {
        const step = this.steps[this.state.stepIndex];
        if (!step) return;
        step.fields.forEach((field) => {
            const input = document.getElementById(`${step.id}-${field.key}`);
            if (input) this.state.data[step.id][field.key] = input.value.trim();
        });
    }

    validateStep() {
        this.syncStateFromInputs();
        const step = this.steps[this.state.stepIndex];
        const values = this.state.data[step.id];
        const filled = Object.values(values).some((value) => String(value || '').trim().length > 0);
        return filled;
    }

    nextStep() {
        if (!this.validateStep()) {
            this.setCoachMessage('Please share a little detail so we can continue the conversation. If you are unsure, answer to the best of your current knowledge.');
            return;
        }
        if (this.state.stepIndex < this.steps.length - 1) {
            this.state.stepIndex += 1;
            this.renderCurrentStep();
            this.updateProgress();
            this.updateFooter();
            this.setCoachMessage(this.steps[this.state.stepIndex].coachMessage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            this.showReview();
        }
    }

    previousStep() {
        if (this.state.stepIndex > 0) {
            this.syncStateFromInputs();
            this.state.stepIndex -= 1;
            this.renderCurrentStep();
            this.updateProgress();
            this.updateFooter();
            this.setCoachMessage(this.steps[this.state.stepIndex].coachMessage);
        }
    }

    updateProgress() {
        const total = this.steps.length;
        const current = this.state.stepIndex + 1;
        if (this.stepIndicator) this.stepIndicator.textContent = `Step ${current} of ${total}`;
        if (this.stepTitle) this.stepTitle.textContent = this.steps[this.state.stepIndex].title;
        if (this.stepSubtitle) this.stepSubtitle.textContent = this.steps[this.state.stepIndex].subtitle;
        if (this.progressBar) this.progressBar.style.width = `${(current / total) * 100}%`;
    }

    updateFooter() {
        if (this.footerMessage) this.footerMessage.textContent = `${this.steps[this.state.stepIndex].title} Conversation`;
        if (this.backButton) this.backButton.disabled = this.state.stepIndex === 0;
        if (this.nextButton) this.nextButton.textContent = this.state.stepIndex === this.steps.length - 1 ? 'Review Responses' : 'Continue';
    }

    setCoachMessage(message) {
        if (this.coachMessage) this.coachMessage.textContent = message;
    }

    showReview() {
        this.syncStateFromInputs();
        this.workspace.hidden = true;
        this.reviewScreen.hidden = false;
        this.reviewContent.innerHTML = '';
        this.steps.forEach((step) => {
            const section = document.createElement('section');
            section.className = 'exec-review-section';
            const title = document.createElement('h3');
            title.textContent = step.title;
            const list = document.createElement('div');
            list.className = 'exec-review-list';
            step.fields.forEach((field) => {
                const row = document.createElement('div');
                row.className = 'exec-review-row';
                const label = document.createElement('span');
                label.className = 'exec-review-label';
                label.textContent = field.label;
                const value = document.createElement('span');
                value.className = 'exec-review-value';
                const raw = this.state.data[step.id][field.key];
                value.textContent = raw && String(raw).trim().length ? raw : 'Not shared';
                row.append(label, value);
                list.appendChild(row);
            });
            const edit = document.createElement('button');
            edit.type = 'button';
            edit.className = 'exec-review-edit';
            edit.textContent = `Edit ${step.title}`;
            edit.addEventListener('click', () => {
                this.reviewScreen.hidden = true;
                this.workspace.hidden = false;
                this.state.stepIndex = this.steps.findIndex((s) => s.id === step.id);
                this.renderCurrentStep();
                this.updateProgress();
                this.updateFooter();
            });
            section.append(title, list, edit);
            this.reviewContent.appendChild(section);
        });
    }

    showWorkspace() {
        this.reviewScreen.hidden = true;
        this.workspace.hidden = false;
    }

    generateAdvisory() {
        this.reviewScreen.hidden = true;
        this.loadingScreen.hidden = false;
        const totalSteps = 6;
        let current = 0;
        const timer = setInterval(() => {
            current += 1;
            const bar = this.loadingScreen?.querySelector('.exec-loading-fill');
            const label = this.loadingScreen?.querySelector('.exec-loading-text');
            if (bar) bar.style.width = `${Math.min((current / totalSteps) * 100, 100)}%`;
            if (label) label.textContent = current < totalSteps ? 'Preparing your Executive Advisory…' : 'Almost there…';
            if (current >= totalSteps) {
                clearInterval(timer);
                this.loadingScreen.hidden = true;
                this.successScreen.hidden = false;
            }
        }, 500);
    }

    resetToStart() {
        this.state.stepIndex = 0;
        this.state.mode = 'landing';
        this.reviewScreen.hidden = true;
        this.successScreen.hidden = true;
        this.workspace.hidden = true;
        this.landingScreen.hidden = false;
        this.setCoachMessage('Welcome. Thank you for taking the time to have this conversation. Before we begin, I would like to understand a little about your organisation. There are no right or wrong answers here. Simply answer each question to the best of your current knowledge. We will move one conversation at a time.');
        this.renderCurrentStep();
        this.updateProgress();
        this.updateFooter();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.executiveAssessment = new ExecutiveAssessment();
});