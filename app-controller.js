/**
 * App Controller Module
 * Main controller để điều khiển toàn bộ app
 */
const AppController = {
    config: {
        jsonFile: 'questions.json',
        hasImage: false,
        hasExplanation: false,
        fontSize: 18,
        optionFontSize: 15,
        explanationFontSize: 14
    },
    
    /**
     * Initialize app with config
     * @param {Object} config - Configuration object
     */
    async init(config = {}) {
        // Merge config
        this.config = { ...this.config, ...config };
        
        // Initialize all modules
        StateManager.init();
        ModalManager.init();
        FontController.init({
            fontSize: this.config.fontSize,
            optionFontSize: this.config.optionFontSize,
            explanationFontSize: this.config.explanationFontSize
        });
        FontController.setupControls();
        ScrollController.setupScrollButton();
        
        // Setup event handlers
        this.setupEventHandlers();
        
        // Load questions
        await this.loadQuestions();
    },
    
    /**
     * Setup all event handlers
     */
    setupEventHandlers() {
        // Retry button
        RetryHandler.setupRetryButton(() => {
            this.handleRetry();
        });
        
        // Submit button
        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                this.handleSubmit();
            });
        }
        
        // Answer change (using event delegation)
        document.addEventListener('change', (e) => {
            if (e.target.type === 'radio' && e.target.name.startsWith('q-')) {
                this.handleAnswerChange(e.target);
            }
        });
    },
    
    /**
     * Load questions from JSON file
     */
    async loadQuestions() {
        try {
            JSONLoader.showLoading();
            
            const sections = await JSONLoader.loadQuestions(this.config.jsonFile);
            
            StateManager.setSections(sections);
            JSONLoader.hideLoading();
            
            // Render navigation and first section
            Navigation.renderNavigation(sections, (index) => this.switchSection(index));
            this.renderCurrentSection();
            
        } catch (error) {
            JSONLoader.hideLoading();
            JSONLoader.showError(error, this.config.jsonFile);
        }
    },
    
    /**
     * Switch to a different section
     * @param {number} index - Section index
     */
    switchSection(index) {
        StateManager.setCurrentSectionIndex(index);
        StateManager.clearUserAnswers();
        Navigation.updateActiveButton(index);
        this.renderCurrentSection();
        ScrollController.scrollToTop();
    },
    
    /**
     * Render current section
     */
    renderCurrentSection() {
        const section = StateManager.getCurrentSection();
        const sectionIndex = StateManager.currentSectionIndex;
        
        QuestionRenderer.renderSection(
            sectionIndex,
            section,
            null, // Not using callback, using event delegation instead
            {
                hasImage: this.config.hasImage,
                hasExplanation: this.config.hasExplanation
            }
        );
        
        // Apply current font size
        FontController.applyFontSize();
        
        // Update buttons
        RetryHandler.showSubmitButton();
        RetryHandler.hideRetryButton();
    },
    
    /**
     * Handle answer change
     * @param {HTMLElement} element - Radio input element
     */
    handleAnswerChange(element) {
        const sectionIdx = parseInt(element.getAttribute('data-section'));
        const questionIdx = parseInt(element.getAttribute('data-question'));
        const optionIdx = parseInt(element.value);
        
        // Save answer
        StateManager.setUserAnswer(sectionIdx, questionIdx, optionIdx);
        
        // Update visual state
        const section = StateManager.getCurrentSection();
        QuestionRenderer.handleAnswer(sectionIdx, questionIdx, optionIdx, section);
    },
    
    /**
     * Handle submit button click
     */
    handleSubmit() {
        const section = StateManager.getCurrentSection();
        const totalQuestions = section.questions.length;
        
        // Check if all questions are answered
        if (!AnswerValidator.checkAllAnswered(
            totalQuestions,
            StateManager.userAnswers,
            StateManager.currentSectionIndex
        )) {
            AnswerValidator.showIncompleteAlert();
            return;
        }
        
        // Validate and mark answers
        const score = AnswerValidator.validateAndMarkAnswers(
            StateManager.currentSectionIndex,
            section,
            StateManager.userAnswers,
            this.config.hasExplanation
        );
        
        // Display result
        ScoreCalculator.displayResult(score, totalQuestions);
        
        // Update buttons
        RetryHandler.hideSubmitButton();
        RetryHandler.showRetryButton();
    },
    
    /**
     * Handle retry button click
     */
    handleRetry() {
        StateManager.clearUserAnswers();
        this.renderCurrentSection();
        ScrollController.scrollToTop();
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AppController;
}